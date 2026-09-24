import { createContext, useContext, useState } from 'react'

// Shares the EduBot chat widget's open/closed state with the rest of the
// app so pages (e.g. Contact) can react — for example, to make sure their
// own content is not covered by the floating chat panel.
const ChatContext = createContext(null)

export function ChatProvider({ children }) {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <ChatContext.Provider value={{ isChatOpen, setIsChatOpen }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const ctx = useContext(ChatContext)
  if (!ctx) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return ctx
}
