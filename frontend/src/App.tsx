import { Routes, Route, Link } from 'react-router-dom'
import { Home, Users, Trophy, MessageSquare, BarChart2 } from 'lucide-react'

// Placeholder components
const Dashboard = () => <div className="p-8"><h1 className="text-3xl font-bold mb-4">Dashboard</h1><p>KPIs and overviews.</p></div>
const Players = () => <div className="p-8"><h1 className="text-3xl font-bold mb-4">Player Analytics</h1></div>
const Teams = () => <div className="p-8"><h1 className="text-3xl font-bold mb-4">Team Analytics</h1></div>
const Sponsors = () => <div className="p-8"><h1 className="text-3xl font-bold mb-4">Sponsorship Intelligence</h1></div>
import { useState } from 'react'
import axios from 'axios'

const Chat = () => {
  const [messages, setMessages] = useState<{role: string, content: string}[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return
    const userMsg = input
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setInput('')
    setLoading(true)
    
    try {
      const res = await axios.post('http://localhost:8000/api/chat', { query: userMsg })
      setMessages(prev => [...prev, { role: 'ai', content: res.data.answer }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Error connecting to Matrica backend.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 flex flex-col h-full max-h-screen">
      <h1 className="text-3xl font-bold mb-4">AI Chat</h1>
      <div className="flex-1 bg-gray-900 rounded-lg p-4 mb-4 overflow-y-auto space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`p-3 rounded-lg ${m.role === 'user' ? 'bg-brand-accent ml-auto max-w-[80%]' : 'bg-gray-800 mr-auto max-w-[80%]'}`}>
            {m.content}
          </div>
        ))}
        {loading && <div className="text-gray-400 animate-pulse">Matrica is thinking...</div>}
      </div>
      <input 
        className="w-full bg-gray-800 p-4 rounded-lg outline-none focus:ring-2 focus:ring-brand-accent transition-all" 
        placeholder="Ask Matrica..." 
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSend()}
      />
    </div>
  )
}

function App() {
  return (
    <div className="flex h-screen bg-brand-dark overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-800 bg-black flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-brand-accent tracking-wider">MATRICA</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link to="/" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-900 transition-colors">
            <Home size={20} className="text-gray-400" />
            <span>Dashboard</span>
          </Link>
          <Link to="/players" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-900 transition-colors">
            <Users size={20} className="text-gray-400" />
            <span>Players</span>
          </Link>
          <Link to="/teams" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-900 transition-colors">
            <Trophy size={20} className="text-gray-400" />
            <span>Teams</span>
          </Link>
          <Link to="/sponsors" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-900 transition-colors">
            <BarChart2 size={20} className="text-gray-400" />
            <span>Sponsors</span>
          </Link>
          <Link to="/chat" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-900 transition-colors">
            <MessageSquare size={20} className="text-brand-accent" />
            <span className="text-brand-light font-medium">AI Chat</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/players" element={<Players />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/sponsors" element={<Sponsors />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
