import { Routes, Route, Link } from 'react-router-dom'
import { Home, Users, Trophy, MessageSquare, BarChart2 } from 'lucide-react'
import { useState } from 'react'
import axios from 'axios'

// Placeholder components
const Dashboard = () => <div className="p-8"><h1 className="text-3xl font-bold mb-4">Dashboard</h1><p>KPIs and overviews.</p></div>
const Players = () => <div className="p-8"><h1 className="text-3xl font-bold mb-4">Player Analytics</h1></div>
const Teams = () => <div className="p-8"><h1 className="text-3xl font-bold mb-4">Team Analytics</h1></div>
const Sponsors = () => {
  const [budget, setBudget] = useState(50000)
  const [popWeight, setPopWeight] = useState(33)
  const [repWeight, setRepWeight] = useState(33)
  const [skillWeight, setSkillWeight] = useState(33)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState('')
  
  const applyTemplate = (type: string) => {
    if (type === 'energy') { setPopWeight(70); setRepWeight(20); setSkillWeight(10); }
    if (type === 'tech') { setPopWeight(20); setRepWeight(10); setSkillWeight(70); }
    if (type === 'apparel') { setPopWeight(40); setRepWeight(40); setSkillWeight(20); }
    if (type === 'balanced') { setPopWeight(33); setRepWeight(33); setSkillWeight(33); }
  }

  const runMatch = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await axios.post('http://localhost:8000/api/match_sponsor', {
        budget,
        popWeight,
        repWeight,
        skillWeight
      })
      setResults(res.data)
    } catch (err: any) {
      setError(err.message || 'Error connecting to backend')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Sponsorship Intelligence</h1>
        <p className="text-gray-400">Find the perfect player for your brand using our dynamic weighted matching engine.</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-4 text-red-500">1. Quick Industry Templates</h2>
        <div className="flex space-x-4">
          <button onClick={() => applyTemplate('energy')} className="px-4 py-2 bg-gray-800 hover:bg-red-500 hover:text-white rounded-lg transition-all font-medium text-gray-300">⚡ Energy Drink</button>
          <button onClick={() => applyTemplate('tech')} className="px-4 py-2 bg-gray-800 hover:bg-blue-500 hover:text-white rounded-lg transition-all font-medium text-gray-300">🖱️ Tech / Gear</button>
          <button onClick={() => applyTemplate('apparel')} className="px-4 py-2 bg-gray-800 hover:bg-purple-500 hover:text-white rounded-lg transition-all font-medium text-gray-300">👕 Apparel</button>
          <button onClick={() => applyTemplate('balanced')} className="px-4 py-2 bg-gray-800 hover:bg-gray-600 rounded-lg transition-all font-medium text-gray-300">⚖️ Balanced</button>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl space-y-6">
        <h2 className="text-xl font-semibold text-red-500">2. Fine-tune your Weights</h2>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-gray-300 font-medium">YouTube Popularity Weight</label>
              <span className="text-red-500 font-bold">{popWeight}%</span>
            </div>
            <input type="range" min="0" max="100" value={popWeight} onChange={(e) => setPopWeight(Number(e.target.value))} className="w-full accent-red-500 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-gray-300 font-medium">Brand Reputation Weight</label>
              <span className="text-red-500 font-bold">{repWeight}%</span>
            </div>
            <input type="range" min="0" max="100" value={repWeight} onChange={(e) => setRepWeight(Number(e.target.value))} className="w-full accent-red-500 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-gray-300 font-medium">In-Game Skill Weight</label>
              <span className="text-red-500 font-bold">{skillWeight}%</span>
            </div>
            <input type="range" min="0" max="100" value={skillWeight} onChange={(e) => setSkillWeight(Number(e.target.value))} className="w-full accent-red-500 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
          </div>
        </div>

        <div className="pt-6 border-t border-gray-800">
          <label className="text-gray-300 font-medium block mb-2">Max Budget ($)</label>
          <input type="number" value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="w-full bg-gray-800 text-white p-4 rounded-lg outline-none focus:ring-2 focus:ring-red-500 font-mono text-lg" />
        </div>
      </div>

      <button onClick={runMatch} disabled={loading} className="w-full py-4 bg-red-600 text-white font-bold text-lg rounded-xl hover:bg-red-700 transition-all shadow-lg hover:shadow-red-500/20 uppercase tracking-wider disabled:opacity-50">
        {loading ? 'Analyzing Matches...' : 'Run Dynamic AI Match'}
      </button>

      {error && <div className="p-4 bg-red-900/50 text-red-400 rounded-xl border border-red-800">{error}</div>}

      {results && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl mt-8">
          <h2 className="text-2xl font-bold text-white mb-6">Top Recommended Players</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {results.players.map((p: any, i: number) => (
              <div key={i} className="bg-gray-800 rounded-xl p-6 border border-gray-700 relative overflow-hidden">
                {i === 0 && <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">TOP MATCH</div>}
                <h3 className="text-2xl font-bold text-white mb-2">{p.name}</h3>
                <div className="text-4xl font-black text-red-500 mb-4">{p.score}<span className="text-lg text-gray-500">/100</span></div>
                
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex justify-between"><span>Popularity:</span> <span className="font-bold">{p.popularity}</span></div>
                  <div className="flex justify-between"><span>Reputation:</span> <span className="font-bold">{p.reputation}</span></div>
                  <div className="flex justify-between"><span>Skill:</span> <span className="font-bold">{p.skill}</span></div>
                  <div className="flex justify-between pt-2 border-t border-gray-700 mt-2 text-green-400 font-bold">
                    <span>Est. Cost:</span> <span>${p.cost.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <h3 className="text-lg font-bold text-red-500 mb-2">Matrica AI Analysis</h3>
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{results.summary}</p>
          </div>
        </div>
      )}

    </div>
  )
}


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
