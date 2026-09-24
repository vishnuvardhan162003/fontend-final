// Talks to the EduBot AI chatbot backend (FastAPI, port 8000).
//
// Backend protocol (app/core/chat_service.py + app/api/chat.py):
//   POST /api/chat  { message, conversation_id? }  -> SSE stream, each `data:`
//   line is JSON: {"event": "start"|"mode"|"token"|"sources"|"end"|"error", ...}
//   - start:   { event: "start", conversation_id }
//   - mode:    { event: "mode", answer_mode: "rag"|"direct"|... }
//   - token:   { event: "token", token }
//   - sources: { event: "sources", sources: [...], answer_mode }
//   - end:     { event: "end" }
//   - error:   { event: "error", error }
//
// The ChatWidget consumes a normalized shape:
//   onChunk({ token?, done?, mode?, sources?, conversationId? })
// This module translates the wire protocol into that shape. Falls back to a
// local offline responder if the backend is unreachable or errors.

import { getLocalBotReply } from '../utils/localBot'

const CHATBOT_API_URL = (import.meta.env.VITE_CHATBOT_API_URL || 'http://localhost:8000').replace(/\/$/, '')

// Backend often isn't running — fail fast so the widget doesn't hang on "···".
const REQUEST_TIMEOUT_MS = 15000

async function streamLocalReply(message, onChunk) {
  const reply = getLocalBotReply(message)
  const words = reply.split(/(\s+)/)

  for (const word of words) {
    onChunk({ token: word })
    // eslint-disable-next-line no-await-in-loop
    await new Promise((resolve) => setTimeout(resolve, 15))
  }

  onChunk({ done: true, mode: 'local' })
}

function normalizeBackendEvent(parsed) {
  if (!parsed || typeof parsed !== 'object') return null
  const event = parsed.event
  if (!event) {
    // Tolerate already-normalized chunks (older backends/tests)
    return parsed
  }
  switch (event) {
    case 'start':
      return parsed.conversation_id ? { conversationId: parsed.conversation_id } : {}
    case 'mode':
      return parsed.answer_mode ? { mode: parsed.answer_mode } : {}
    case 'token':
      return parsed.token ? { token: parsed.token } : {}
    case 'sources':
      return {
        sources: parsed.sources || [],
        ...(parsed.answer_mode ? { mode: parsed.answer_mode } : {}),
      }
    case 'end':
      return { done: true }
    case 'error':
      return { error: parsed.error || 'Chatbot error' }
    default:
      return null
  }
}

function handleSseBlock(rawEvent, ctx, onChunk) {
  const lines = rawEvent.split('\n')
  let eventName = null
  const dataLines = []
  for (const line of lines) {
    if (line.startsWith('event:')) eventName = line.replace(/^event:\s*/, '').trim()
    else if (line.startsWith('data:')) dataLines.push(line.replace(/^data:\s*/, ''))
    else if (line.trim() && !line.startsWith(':')) dataLines.push(line.trim())
  }
  if (dataLines.length === 0) return
  for (const jsonStr of dataLines) {
    if (!jsonStr || jsonStr === '[DONE]') continue
    let parsed
    try {
      parsed = JSON.parse(jsonStr)
    } catch {
      continue
    }
    // sse-starlette may put the type in a separate `event:` line
    if (eventName && !parsed.event) parsed = { event: eventName, ...parsed }
    const chunk = normalizeBackendEvent(parsed)
    if (!chunk) continue
    if (chunk.error) {
      ctx.error = chunk.error
      continue
    }
    if (chunk.conversationId) ctx.conversationId = chunk.conversationId
    if (chunk.mode) ctx.mode = chunk.mode
    if (chunk.sources) ctx.sources = chunk.sources
    if (chunk.token) {
      ctx.receivedToken = true
      onChunk({
        token: chunk.token,
        ...(chunk.conversationId ? { conversationId: chunk.conversationId } : {}),
        ...(chunk.mode ? { mode: chunk.mode } : {}),
      })
    } else if (chunk.conversationId || chunk.mode || chunk.sources) {
      onChunk({
        ...(chunk.conversationId ? { conversationId: chunk.conversationId } : {}),
        ...(chunk.mode ? { mode: chunk.mode } : {}),
        ...(chunk.sources ? { sources: chunk.sources } : {}),
      })
    } else if (chunk.done) {
      onChunk({
        done: true,
        ...(ctx.mode ? { mode: ctx.mode } : {}),
        ...(ctx.sources ? { sources: ctx.sources } : {}),
        ...(ctx.conversationId ? { conversationId: ctx.conversationId } : {}),
      })
    }
  }
}

export async function sendChatMessage(message, conversationId, onChunk, onError) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  const ctx = { conversationId: conversationId ?? null, mode: null, sources: null, receivedToken: false, error: null }
  let sawEnd = false

  try {
    let response
    try {
      response = await fetch(`${CHATBOT_API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          conversation_id: conversationId ?? undefined,
        }),
        signal: controller.signal,
      })
    } catch (err) {
      // Network/CORS/abort — fall back to local responder
      throw err
    }

    if (!response.ok || !response.body) {
      // Surface HTTP errors with body text when available for debugging
      let detail = ''
      try {
        detail = await response.text()
      } catch {
        detail = ''
      }
      throw new Error(`Chatbot request failed (${response.status}) ${detail}`.trim())
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const events = buffer.split('\n\n')
      buffer = events.pop() ?? ''

      for (const rawEvent of events) {
        if (!rawEvent.trim()) continue
        const before = ctx.receivedToken
        handleSseBlock(rawEvent, ctx, (c) => {
          if (c.done) sawEnd = true
          onChunk(c)
        })
        // track end via sawEnd flag set in callback
        void before
      }
    }
    // flush trailing fragment
    if (buffer.trim()) {
      handleSseBlock(buffer, ctx, (c) => {
        if (c.done) sawEnd = true
        onChunk(c)
      })
    }

    if (ctx.error && !ctx.receivedToken) {
      throw new Error(ctx.error)
    }

    if (!ctx.receivedToken) {
      // Backend responded but streamed nothing usable — use local fallback
      await streamLocalReply(message, onChunk)
      return
    }

    if (!sawEnd) {
      // Stream ended without an explicit end event — close it so UI stops spinning
      onChunk({
        done: true,
        ...(ctx.mode ? { mode: ctx.mode } : {}),
        ...(ctx.sources ? { sources: ctx.sources } : {}),
        ...(ctx.conversationId ? { conversationId: ctx.conversationId } : {}),
      })
    }
  } catch {
    // Backend missing, unreachable, timed out, or errored — answer locally
    try {
      await streamLocalReply(message, onChunk)
    } catch (fallbackError) {
      if (onError instanceof Function) {
        onError(fallbackError)
      } else {
        console.error('Chatbot error:', fallbackError)
      }
    }
  } finally {
    clearTimeout(timeout)
  }
}

export function isChatbotConfigured() {
  return Boolean(CHATBOT_API_URL)
}

export { CHATBOT_API_URL }
