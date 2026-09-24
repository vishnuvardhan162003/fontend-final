import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import ChatWidget from '../common/ChatWidget'
import { ChatProvider } from '../../context/ChatContext'

export default function MainLayout() {
  return (
    <ChatProvider>
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <ChatWidget />
      </div>
    </ChatProvider>
  )
}
