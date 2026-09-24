import { useEffect, useRef, useState } from 'react'
import { MessageCircle, X, Send, BookOpen, Lightbulb } from 'lucide-react'
import { sendChatMessage } from '../../services/chatbotService'
import { useChat } from '../../context/ChatContext'

// Floating AI chatbot widget. Self-contained — does not alter any existing
// page, layout, or route. Talks to the separate EduBot Python backend.

const WELCOME_MESSAGE = {
  role: 'assistant',
  content: "Hi! I'm EduBot 👋 Ask me anything about your courses, or general questions too.",
  mode: null,
}

export default function ChatWidget() {
  const { isChatOpen: isOpen, setIsChatOpen: setIsOpen } = useChat()
  const [messages, setMessages] = useState([WELCOME_MESSAGE])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const conversationIdRef = useRef(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isOpen])

  function handleSend(e) {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed || isStreaming) return

    setMessages((prev) => [...prev, { role: 'user', content: trimmed }])
    setInput('')
    setIsStreaming(true)

    let assistantIndex
    setMessages((prev) => {
      assistantIndex = prev.length
      return [...prev, { role: 'assistant', content: '', mode: null, sources: [] }]
    })

    sendChatMessage(
      trimmed,
      conversationIdRef.current,
      (chunk) => {
        if (chunk.conversationId) {
          conversationIdRef.current = chunk.conversationId
        }
        setMessages((prev) => {
          const updated = [...prev]
          const current = updated[assistantIndex]
          if (!current) return prev
          updated[assistantIndex] = {
            ...current,
            content: current.content + (chunk.token ?? ''),
            mode: chunk.mode ?? current.mode,
            sources: chunk.sources ?? current.sources,
          }
          return updated
        })
        if (chunk.done) setIsStreaming(false)
      },
      () => {
        setMessages((prev) => {
          const updated = [...prev]
          const current = updated[assistantIndex]
          if (current && !current.content) {
            updated[assistantIndex] = {
              ...current,
              content: "Sorry, I couldn't connect right now. Please try again in a moment.",
            }
          }
          return updated
        })
        setIsStreaming(false)
      },
    )
  }

  return (
    <>
      {/* Floating toggle button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-teal text-white shadow-lg shadow-navy-900/20 transition hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-300"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[520px] w-[360px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-navy-900/20">
          {/* Header */}
          <div className="flex items-center gap-3 bg-navy px-4 py-3 text-white">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal/20">
              <Lightbulb size={18} className="text-amber" />
            </div>
            <div>
              <p className="font-display text-sm font-semibold">EduBot</p>
              <p className="font-body text-xs text-navy-200">Ask about your courses</p>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-4 py-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 font-body text-sm ${
                    msg.role === 'user'
                      ? 'bg-teal text-white'
                      : 'bg-white text-ink shadow-sm border border-slate-100'
                  }`}
                >
                  {msg.content || (isStreaming && idx === messages.length - 1 ? '···' : '')}
                  {msg.mode === 'rag' && msg.sources?.length > 0 && (
                    <div className="mt-2 flex items-center gap-1 border-t border-slate-100 pt-2 text-[11px] text-slate-400">
                      <BookOpen size={12} />
                      <span>From course materials</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-slate-100 bg-white p-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              disabled={isStreaming}
              className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 font-body text-sm text-ink placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-200 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={isStreaming || !input.trim()}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal text-white transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
