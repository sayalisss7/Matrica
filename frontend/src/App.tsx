import { useState, useEffect } from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import { Home, MessageSquare, BarChart2, Moon, Sun, Sparkles, Cpu, Crosshair, ArrowRight, TrendingUp, Users, Activity } from 'lucide-react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'


import matricaLogo from './assets/matrica-logo.png'
import valorantBg from './assets/valorant-bg.jpg'
import tabBg from './assets/horizontal.jpg' 
import themeBg from './assets/horiz.jpg' 
import horizBg from './assets/horiz.jpg' 

type ThemeProps = {
  isDarkMode: boolean
}

const HomePage = ({ isDarkMode }: ThemeProps) => {

  const shellClass = isDarkMode
    ? "border border-white/5 bg-black/40 text-white shadow-2xl backdrop-blur-xl"
    : "border border-slate-300 bg-white/60 text-slate-900 shadow-2xl backdrop-blur-xl";

  const subText = isDarkMode
    ? "text-slate-300"
    : "text-slate-900 font-bold";

  const statCardClass = isDarkMode
    ? "border border-white/5 bg-black/30 text-slate-100 hover:bg-black/50 hover:border-[#ff2a2a]/40 hover:shadow-[0_0_20px_rgba(255,42,42,0.15)] transition-all duration-300"
    : "border border-slate-200 bg-white/50 text-slate-900 hover:bg-white/80 hover:border-slate-300 hover:shadow-lg transition-all duration-300 shadow-sm";

  const [cards, setCards] = useState([
    {
      title: "TenZ",
      score: "98",
      subtitle: "Top Rated | Sentinels",
      footer: "Est. Cost: ₹45,000",
      achievements: [
        "🏆 VCT Americas 2024 Champion",
        "📈 +150k Twitch Followers this month",
        "🎯 1.34 Series K/D Ratio"
      ]
    },
    {
      title: "Demon1",
      score: "95",
      subtitle: "Trending | NRG",
      footer: "Est. Cost: ₹30,000",
      achievements: [
        "🏆 Valorant Champions 2023 MVP",
        "📈 Highest VLR Rating globally",
        "💥 42% Headshot percentage"
      ]
    },
    {
      title: "Boaster",
      score: "90",
      subtitle: "IGL Leader | FNATIC",
      footer: "Est. Cost: ₹25,000",
      achievements: [
        "🏆 VCT LOCK//IN São Paulo Winner",
        "🗣️ Highest Brand Safety Score",
        "🌍 Massive EMEA Audience Reach"
      ]
    },
    {
      title: "Aspas",
      score: "88",
      subtitle: "Duelist | Leviatán",
      footer: "Est. Cost: ₹35,000",
      achievements: [
        "🏆 VCT Americas MVP 2024",
        "🔪 Most First Bloods in League",
        "📈 Fastest growing LATAM channel"
      ]
    }
  ]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/dashboard/recommendations')
      .then(res => {
          if(res.data && res.data.length > 0) {
             // Map data to include dummy trends if not provided
             const mapped = res.data.map((c: any) => ({
                 ...c,
                 trend: c.trend || [{val: Math.random()*100}, {val: Math.random()*100}, {val: Math.random()*100}, {val: Math.random()*100}, {val: parseInt(c.score)||80}],
                 reach: c.reach || (Math.random() * 3 + 1).toFixed(1) + "M",
                 roi: c.roi || "High"
             }));
             setCards(mapped);
          }
      })
      .catch(err => console.error("Failed to fetch dashboard data:", err));
  }, []);

  return (

    <div className="p-6 h-full overflow-y-auto page-enter">

      <div
        className={`relative rounded-[28px] ${shellClass} max-w-6xl mx-auto overflow-hidden`}
      >

        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff2a2a] to-transparent" />

        <div className="p-8 lg:p-10">

          {/* Badge */}

          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-[#ff2a2a]/20 border border-[#ff2a2a]/30 text-[#ff2a2a] text-xs uppercase tracking-widest font-bold">

            <Sparkles size={14} />

            Matrica Control Room

          </div>

          {/* Heading */}

          <h1 className="mt-6 text-5xl font-black uppercase">

            System

            <span className="text-[#ff2a2a]">

              {" "}Online

            </span>

          </h1>

          {/* Intro */}

          <div
            className={`mt-8 rounded-2xl p-6 ${
              isDarkMode
                ? "bg-black/20 border border-[#ff2a2a]/20"
                : "bg-white/40"
            }`}
          >

            <h2 className="flex items-center gap-2 text-[#ff2a2a] font-black text-xl uppercase">

              <Cpu size={18} />

              The Matrica

            </h2>

            <p className={`mt-4 leading-8 ${subText}`}>

              Matrica is an AI-powered esports sponsorship intelligence
              platform built specifically for Valorant. It combines tournament
              statistics, player performance, audience reach, social influence,
              and AI-driven insights to recommend the most valuable sponsorship
              opportunities for brands, organizations, and tournament
              organizers.

            </p>

          </div>

          {/* Stats */}


          {/* Recommendation Title */}

          <div className="mt-12 mb-6 flex items-center gap-3">

            <BarChart2 size={22} className="text-[#ff2a2a]" />

            <h2 className="text-2xl font-black uppercase">

              AI Recommendations

            </h2>

          </div>

          {/* Cards */}

<div className="grid lg:grid-cols-2 gap-6">
            {cards.map((card, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-6 transition-all duration-300 cursor-pointer group relative overflow-hidden ${
                  isDarkMode
                    ? "bg-black/40 border border-white/5 hover:border-white/20 hover:bg-black/60 shadow-xl"
                    : "bg-white/60 border border-slate-200 hover:border-slate-300 hover:bg-white/80 hover:shadow-lg"
                }`}
              >
                {/* Header row */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {card.title}
                    </h3>
                    <p className={`font-bold mt-1 text-xs uppercase tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {card.subtitle}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1 bg-[#ff2a2a]/10 px-3 py-1 rounded-full border border-[#ff2a2a]/20">
                      <TrendingUp size={14} className="text-[#ff2a2a]" />
                      <span className="text-[#ff2a2a] font-bold text-sm">Rating: {card.score}</span>
                    </div>
                  </div>
                </div>

                {/* Achievements List */}
                <div className={`my-4 p-4 rounded-xl ${isDarkMode ? 'bg-black/30' : 'bg-slate-50 border border-slate-100'}`}>
                  <div className="flex items-center gap-2 text-xs uppercase text-slate-400 mb-3 font-bold tracking-wider">
                    <Sparkles size={12} className="text-[#ff2a2a]" /> Career Highlights
                  </div>
                  <ul className="space-y-2">
                    {card.achievements?.map((achieve: string, i: number) => (
                      <li key={i} className={`text-sm font-bold flex items-start gap-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        <span className="opacity-80 leading-5">{achieve}</span>
                      </li>
                    ))}
                  </ul>
                </div>


              </div>
            ))}
          </div>

        </div>

      </div>

    </div>

  );

};

const Sponsors = ({ isDarkMode }: ThemeProps) => {
  const [budget, setBudget] = useState(50000)
  const [popWeight, setPopWeight] = useState(33)
  const [repWeight, setRepWeight] = useState(33)
  const [skillWeight, setSkillWeight] = useState(33)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState('')

  const pageText = isDarkMode ? 'text-white' : 'text-black drop-shadow-md'
  const mutedText = isDarkMode ? 'text-slate-400' : 'text-slate-900 font-bold'
  
  const cardClass = isDarkMode
    ? 'border border-white/10 bg-black/45 shadow-[0_0_20px_rgba(0,0,0,0.32)] backdrop-blur-md'
    : 'border-transparent bg-white/50 shadow-[0_0_25px_rgba(255,255,255,0.6)] backdrop-blur-xl'
  const innerCardClass = isDarkMode
    ? 'border border-white/10 bg-white/5'
    : 'border-transparent bg-white/40'
  const inputClass = isDarkMode
    ? 'w-full rounded-md bg-slate-900/80 p-2.5 text-sm text-white outline-none ring-1 ring-white/10 focus:ring-1 focus:ring-[#ff2a2a] font-bold'
    : 'w-full rounded-md bg-white/80 p-2.5 text-sm text-slate-900 outline-none ring-1 ring-[#ff2a2a]/50 focus:ring-1 focus:ring-[#ff2a2a] font-bold shadow-sm'
  const sliderClass = isDarkMode
    ? 'w-full h-1.5 cursor-pointer appearance-none rounded-lg bg-slate-700 accent-[#ff2a2a]'
    : 'w-full h-1.5 cursor-pointer appearance-none rounded-lg bg-slate-300 accent-[#ff2a2a] shadow-sm'
  const pillButtonClass = isDarkMode
    ? 'rounded-md bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-300 ring-1 ring-white/10 transition-all duration-500'
    : 'rounded-md bg-white/80 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-800 ring-1 ring-red-200 transition-all duration-500 shadow-sm'

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
        budget, popWeight, repWeight, skillWeight
      })
      setResults(res.data)
    } catch (err: any) {
      setError(err.message || 'Error connecting to backend')
    } finally {
      setLoading(false)
    }
  }

  const players = Array.isArray(results?.players) ? results.players : []
  const summary = typeof results?.summary === 'string' ? results.summary : ''

  return (
    <div className="p-4 md:p-6 h-full overflow-y-auto page-enter">
      <div className="flex flex-col max-w-5xl mx-auto space-y-3">
      
      <div className={`relative rounded-2xl overflow-hidden transition-all duration-700 ease-in-out ${isDarkMode ? 'border border-[#ff2a2a]/20 shadow-lg' : 'border-none shadow-md'} shrink-0`}>
        <div
          className={`absolute inset-0 bg-cover bg-[center_top] bg-no-repeat transition-all duration-700 ease-in-out ${isDarkMode ? 'opacity-50 mix-blend-screen' : 'opacity-80'}`}
          style={{ backgroundImage: `url('${horizBg}')` }}
        />
        <div className={`absolute inset-0 transition-all duration-700 ease-in-out ${isDarkMode ? 'bg-gradient-to-r from-black/90 via-black/60 to-black/90 backdrop-blur-sm' : 'bg-gradient-to-r from-white/90 via-white/60 to-white/90 backdrop-blur-sm'}`} />
        
        <div className="relative z-10 p-5 flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-extrabold uppercase tracking-wide flex items-center gap-3 transition-colors duration-700 ${pageText}`}>
              <BarChart2 size={24} className={`transition-colors duration-700 ${isDarkMode ? 'text-[#ff2a2a]' : 'text-black'}`} />
              Sponsorship <span className="text-[#ff2a2a] drop-shadow-[0_0_8px_rgba(255,42,42,0.5)]">Intelligence</span>
            </h1>
            <p className={`text-xs mt-1 transition-colors duration-700 ${mutedText} ml-[36px]`}>Find the perfect player for your brand using our matching engine.</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 shrink-0">
        <div className={`transition-all duration-700 ease-in-out ${cardClass} rounded-2xl p-4 shadow-lg flex-1`}>
          <h2 className="text-sm font-bold mb-3 text-[#ff2a2a] uppercase tracking-wide flex items-center gap-2 drop-shadow-sm">
            <Crosshair size={16} /> 1. Quick Industry Templates
          </h2>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => applyTemplate('energy')} className={`${pillButtonClass} hover:bg-[#ff2a2a] hover:text-white hover:shadow-[0_0_10px_#ff2a2a]`}>⚡ Energy Drink</button>
            <button onClick={() => applyTemplate('tech')} className={`${pillButtonClass} hover:bg-blue-500 hover:text-white hover:shadow-[0_0_10px_#3b82f6] hover:ring-blue-500`}>🖱️ Tech / Gear</button>
            <button onClick={() => applyTemplate('apparel')} className={`${pillButtonClass} hover:bg-purple-500 hover:text-white hover:shadow-[0_0_10px_#a855f7] hover:ring-purple-500`}>👕 Apparel</button>
            <button onClick={() => applyTemplate('balanced')} className={`${pillButtonClass} hover:bg-slate-700 hover:text-white hover:shadow-[0_0_10px_#334155] hover:ring-slate-700`}>⚖️ Balanced</button>
          </div>
        </div>

        <div className={`transition-all duration-700 ease-in-out ${cardClass} rounded-2xl p-4 shadow-lg flex-1 flex flex-col justify-center`}>
          <label className={`mb-1 block text-xs font-bold uppercase tracking-wider transition-colors duration-700 ${isDarkMode ? 'text-slate-300' : 'text-slate-900 drop-shadow-sm'}`}>Max Budget (₹)</label>
          <input type="number" value={budget} onChange={(e) => setBudget(Number(e.target.value))} className={`transition-all duration-700 ${inputClass}`} />
        </div>
      </div>

      <div className={`transition-all duration-700 ease-in-out ${cardClass} rounded-2xl p-5 shadow-lg shrink-0`}>
        <h2 className="text-sm font-bold text-[#ff2a2a] uppercase tracking-wide drop-shadow-sm mb-3">2. Fine-tune your Weights</h2>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <label className={`text-[10px] font-bold uppercase tracking-wider transition-colors duration-700 ${isDarkMode ? 'text-slate-300' : 'text-slate-900 drop-shadow-sm'}`}>YouTube Popularity</label>
              <span className="text-[#ff2a2a] font-extrabold text-xs brand-font drop-shadow-sm">{popWeight}%</span>
            </div>
            <input type="range" min="0" max="100" value={popWeight} onChange={(e) => setPopWeight(Number(e.target.value))} className={`transition-all duration-700 ${sliderClass}`} />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className={`text-[10px] font-bold uppercase tracking-wider transition-colors duration-700 ${isDarkMode ? 'text-slate-300' : 'text-slate-900 drop-shadow-sm'}`}>Brand Reputation</label>
              <span className="text-[#ff2a2a] font-extrabold text-xs brand-font drop-shadow-sm">{repWeight}%</span>
            </div>
            <input type="range" min="0" max="100" value={repWeight} onChange={(e) => setRepWeight(Number(e.target.value))} className={`transition-all duration-700 ${sliderClass}`} />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className={`text-[10px] font-bold uppercase tracking-wider transition-colors duration-700 ${isDarkMode ? 'text-slate-300' : 'text-slate-900 drop-shadow-sm'}`}>In-Game Skill</label>
              <span className="text-[#ff2a2a] font-extrabold text-xs brand-font drop-shadow-sm">{skillWeight}%</span>
            </div>
            <input type="range" min="0" max="100" value={skillWeight} onChange={(e) => setSkillWeight(Number(e.target.value))} className={`transition-all duration-700 ${sliderClass}`} />
          </div>
        </div>
      </div>

      <button onClick={runMatch} disabled={loading} className="shrink-0 w-full py-3 bg-[#ff2a2a] text-white font-extrabold text-sm rounded-xl hover:bg-white hover:text-[#ff2a2a] transition-all duration-300 shadow-[0_0_15px_rgba(255,42,42,0.6)] hover:shadow-[0_0_20px_rgba(255,255,255,1)] uppercase tracking-widest disabled:opacity-50 disabled:hover:shadow-none disabled:hover:bg-[#ff2a2a]">
        {loading ? 'Analyzing Telemetry...' : 'Run Dynamic AI Match'}
      </button>

      {error && <div className={`shrink-0 rounded-xl border p-3 text-xs text-red-400 font-bold transition-all duration-700 ${isDarkMode ? 'border-red-900 bg-red-950/60' : 'border-red-500 bg-red-50 text-red-700 shadow-md'}`}>{error}</div>}

      {results && (
        <div className={`transition-all duration-700 ease-in-out ${cardClass} rounded-2xl p-5 shadow-xl page-enter flex flex-col shrink-0`}>
          <h2 className={`mb-4 text-xl font-extrabold uppercase tracking-wide ${pageText}`}>Top Recommended Players</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {players.map((p: any, i: number) => (
              <div key={i} className={`transition-all duration-700 ease-in-out ${innerCardClass} relative overflow-hidden rounded-xl p-4 hover:border-[#ff2a2a]/50 group shadow-md`}>
                <div className="absolute inset-0 bg-gradient-to-br from-[#ff2a2a]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {i === 0 && <div className="absolute top-0 right-0 bg-[#ff2a2a] text-white text-[10px] font-extrabold px-3 py-1 rounded-bl-lg uppercase tracking-wider shadow-[0_0_5px_#ff2a2a]">TOP MATCH</div>}
                
                <h3 className={`mb-1 text-lg font-black uppercase tracking-wide ${pageText}`}>{p.name}</h3>
                <div className="mb-2 text-3xl font-black text-[#ff2a2a] drop-shadow-[0_0_5px_rgba(255,42,42,0.6)] brand-font">
                  {p.score}<span className={`text-sm transition-colors duration-700 ${isDarkMode ? 'text-slate-500' : 'text-slate-600'}`}>/100</span>
                </div>

                <div className={`space-y-1 text-xs font-bold transition-colors duration-700 ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>
                  <div className="flex justify-between"><span>Pop:</span> <span className={`font-black transition-colors duration-700 ${isDarkMode ? 'text-white' : 'text-black'} brand-font`}>{p.popularity}</span></div>
                  <div className="flex justify-between"><span>Rep:</span> <span className={`font-black transition-colors duration-700 ${isDarkMode ? 'text-white' : 'text-black'} brand-font`}>{p.reputation}</span></div>
                  <div className="flex justify-between"><span>Skill:</span> <span className={`font-black transition-colors duration-700 ${isDarkMode ? 'text-white' : 'text-black'} brand-font`}>{p.skill}</span></div>
                  <div className={`mt-2 flex justify-between border-t pt-2 font-extrabold text-green-600 ${isDarkMode ? 'border-slate-700' : 'border-red-300'}`}>
                    <span className="text-slate-900 dark:text-white transition-colors duration-700">Cost:</span> 
                    <span className="brand-font drop-shadow-sm">₹{p.cost.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={`${innerCardClass} rounded-xl p-4 shadow-sm`}>
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-[#ff2a2a] mb-2 flex items-center gap-2 drop-shadow-sm">
              <Sparkles size={14} /> Matrica AI Analysis
            </h3>
            <p className={`whitespace-pre-wrap text-xs leading-relaxed font-bold transition-colors duration-700 ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>
              {summary || 'No AI summary available for this result yet.'}
            </p>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

type ChatProps = ThemeProps & {
  messages: {role: string, content: string}[];
  setMessages: React.Dispatch<React.SetStateAction<{role: string, content: string}[]>>;
};

const Chat = ({ isDarkMode, messages, setMessages }: ChatProps) => {
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
    <div className="p-6 flex flex-col h-full max-h-screen page-enter">
      
      <div className={`shrink-0 relative mb-4 rounded-2xl overflow-hidden transition-all duration-700 ease-in-out ${isDarkMode ? 'border border-white/5 shadow-2xl' : 'border-none shadow-md'}`}>
        <div
          className={`absolute inset-0 bg-cover bg-[center_top] bg-no-repeat transition-all duration-700 ease-in-out ${isDarkMode ? 'opacity-50 mix-blend-screen' : 'opacity-80'}`}
          style={{ backgroundImage: `url('${horizBg}')` }}
        />
        <div className={`absolute inset-0 transition-all duration-700 ease-in-out ${isDarkMode ? 'bg-gradient-to-r from-black/90 via-black/60 to-black/90 backdrop-blur-sm' : 'bg-gradient-to-r from-white/90 via-white/60 to-white/90 backdrop-blur-sm'}`} />
        
        <div className="relative z-10 p-5">
          <h1 className={`text-2xl md:text-3xl font-extrabold uppercase tracking-wide flex items-center gap-3 transition-colors duration-700 ${isDarkMode ? 'text-white' : 'text-black drop-shadow-md'}`}>
            <MessageSquare size={24} className={`transition-colors duration-700 ${isDarkMode ? 'text-[#ff2a2a]' : 'text-black'}`} /> 
            AI <span className="text-[#ff2a2a] drop-shadow-[0_0_8px_rgba(255,42,42,0.5)]">Commlink</span>
          </h1>
        </div>
      </div>
      
      <div className={`mb-4 flex-1 space-y-3 overflow-y-auto rounded-xl p-5 shadow-lg backdrop-blur-md transition-all duration-700 ease-in-out ${isDarkMode ? 'bg-black/45 border border-white/10' : 'bg-white/40 border-transparent'}`}>
        {messages.length === 0 && !loading && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-90 transition-opacity duration-700">
            <Cpu size={40} className="text-[#ff2a2a] mb-3 drop-shadow-[0_0_10px_rgba(255,42,42,0.6)]" />
            <p className={`text-lg font-black uppercase tracking-widest transition-colors duration-700 ${isDarkMode ? 'text-white' : 'text-black drop-shadow-md'}`}>Secure Channel Established</p>
            <p className={`mt-1 text-sm font-bold transition-colors duration-700 ${isDarkMode ? 'text-slate-400' : 'text-slate-800'}`}>Awaiting telemetry queries...</p>
          </div>
        )}
        
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-xl p-3 text-sm font-bold shadow-sm page-enter transition-all duration-700 ease-in-out ${
              m.role === 'user'
                ? 'ml-auto bg-[#ff2a2a] text-white shadow-[0_0_10px_rgba(255,42,42,0.6)] rounded-br-none border border-red-400'
                : isDarkMode
                  ? 'mr-auto bg-slate-800 text-slate-100 border border-white/10 rounded-bl-none'
                  : 'mr-auto bg-white/90 text-slate-900 border-transparent rounded-bl-none shadow-md'
            }`}
          >
            {m.role === 'ai' ? (
              <div className={`prose ${isDarkMode ? 'prose-invert' : ''} prose-sm max-w-none prose-p:leading-relaxed prose-li:my-0`}>
                <ReactMarkdown>{m.content}</ReactMarkdown>
              </div>
            ) : (
              m.content
            )}
          </div>
        ))}
        {loading && <div className={`mr-auto max-w-[85%] rounded-xl rounded-bl-none p-3 text-sm font-bold uppercase tracking-wider border shadow-sm animate-pulse flex items-center gap-2 transition-all duration-700 ease-in-out ${isDarkMode ? 'bg-slate-800 text-[#ff2a2a] border-white/10' : 'bg-white/90 text-[#ff2a2a] border-transparent'}`}>
          <div className="h-1.5 w-1.5 bg-[#ff2a2a] rounded-full animate-ping" />
          <div className="h-1.5 w-1.5 bg-[#ff2a2a] rounded-full animate-ping delay-75" />
          <div className="h-1.5 w-1.5 bg-[#ff2a2a] rounded-full animate-ping delay-150" />
          Matrica is thinking...
        </div>}
      </div>
      
      <div className="relative shrink-0">
        <input 
          className={`w-full rounded-xl p-4 pr-12 text-sm font-bold outline-none transition-all duration-700 focus:ring-1 focus:ring-[#ff2a2a] shadow-[0_0_15px_rgba(0,0,0,0.3)] ${
            isDarkMode ? 'bg-black/60 text-white border border-white/10 focus:border-[#ff2a2a]' : 'bg-white/90 text-slate-900 border-transparent backdrop-blur-md focus:border-[#ff2a2a]'
          }`}
          placeholder="Transmit query to Matrica..." 
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <button 
          onClick={handleSend}
          className={`absolute right-4 top-1/2 -translate-y-1/2 text-[#ff2a2a] transition-all duration-500 ${isDarkMode ? 'hover:text-white' : 'hover:text-black'} hover:drop-shadow-[0_0_10px_#ff2a2a]`}
        >
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  )
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [chatMessages, setChatMessages] = useState<{role: string, content: string}[]>([])

  const appShellClass = isDarkMode ? 'bg-[#0d0d12] text-white' : 'bg-slate-100 text-slate-900'
  const sidebarClass = isDarkMode ? 'border-white/10 bg-black/80 backdrop-blur-xl' : 'border-transparent bg-white/40 backdrop-blur-xl'
  
  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `group flex items-center space-x-3 rounded-xl p-3 transition-all duration-700 font-bold uppercase tracking-widest text-sm overflow-hidden relative ${
      isActive
        ? isDarkMode
          ? 'bg-[#ff2a2a]/40 text-[#ff2a2a] border-l-4 border-[#ff2a2a] shadow-[inset_0_0_15px_rgba(255,42,42,0.3)] hover:bg-[#ff2a2a] hover:text-white hover:shadow-[0_0_20px_#ff2a2a] hover:border-[#ff2a2a]'
          : 'bg-[#ff2a2a]/80 text-white border-l-4 border-[#ff2a2a] shadow-[0_0_10px_rgba(255,42,42,0.6)] hover:bg-[#ff2a2a] hover:text-white hover:shadow-[0_0_20px_#ff2a2a] hover:border-[#ff2a2a] backdrop-blur-sm'
        : isDarkMode
          ? 'text-white border-l-4 border-transparent hover:bg-[#ff2a2a] hover:text-white hover:shadow-[0_0_20px_#ff2a2a] hover:border-[#ff2a2a]'
          : 'text-black drop-shadow-[0_0_5px_rgba(255,255,255,0.9)] border-l-4 border-transparent hover:bg-[#ff2a2a] hover:text-white hover:shadow-[0_0_20px_#ff2a2a] hover:border-[#ff2a2a] bg-white/30 backdrop-blur-sm'
    }`

  return (
    <div className={`relative flex h-screen overflow-hidden transition-colors duration-700 ease-in-out ${appShellClass}`}>
      
      {/* Background Image Layer */}
      <div
        className={`pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 ease-in-out ${isDarkMode ? 'opacity-[0.85]' : 'opacity-100'}`}
        style={{ backgroundImage: `url('${valorantBg}')` }}
      />
      
      {/* Gradient Overlay */}
      <div className={`pointer-events-none absolute inset-0 transition-all duration-700 ease-in-out ${isDarkMode ? 'bg-black/60' : 'bg-transparent'}`} />
      
      {/* Scanline Effect Overlay */}
      <div className="scanlines" />

      {/* Sidebar */}
      <aside className={`relative z-25 flex w-[260px] flex-col border-r transition-all duration-700 ease-in-out shadow-[5px_0_20px_rgba(0,0,0,0.6)] ${sidebarClass}`}>
        
        {/* LOGO SECTION */}
        <div className={`p-4 border-b z-20 transition-colors duration-700 ease-in-out ${isDarkMode ? 'border-white/10 bg-black/10' : 'border-transparent bg-white/20'}`}>
          <div className="flex items-center gap-2.5">
            <img src={matricaLogo} alt="Matrica logo" className="h-9 w-9 object-contain drop-shadow-[0_0_5px_rgba(255,42,42,0.8)]" />
            <h2 className={`brand-font text-2xl tracking-[0.2em] font-black drop-shadow-[0_0_5px_rgba(255,42,42,0.5)] transition-colors duration-700 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>MATRICA</h2>
          </div>
          <p className={`mt-1 text-[10px] font-bold uppercase tracking-widest transition-colors duration-700 ${isDarkMode ? 'text-slate-400' : 'text-slate-800'}`}>Esports Sponsorship Platform</p>
        </div>

        {/* Tab Navigation Container rendering horizontal.jpg (tabBg) */}
        <div className={`relative mx-4 mt-5 flex-1 rounded-2xl overflow-hidden transition-all duration-700 ease-in-out ${isDarkMode ? 'border border-white/5 shadow-2xl' : 'border-none shadow-[0_0_15px_rgba(255,42,42,0.3)]'}`}>
          
          <div
            className={`absolute inset-0 bg-cover bg-[center_top] bg-no-repeat transition-all duration-700 ease-in-out ${isDarkMode ? 'opacity-50 mix-blend-screen' : 'opacity-80'}`}
            style={{ backgroundImage: `url('${tabBg}')` }}
          />
          
          <div className={`absolute inset-0 transition-all duration-700 ease-in-out ${isDarkMode ? 'bg-gradient-to-t from-[#0d0d12]/95 via-[#0d0d12]/60 to-[#0d0d12]/90' : 'bg-gradient-to-t from-white/80 via-transparent to-white/80'}`} />
          
          <nav className="relative z-10 p-3 space-y-2 h-full flex flex-col justify-center">
            <NavLink to="/" className={navItemClass}>
              <span className="relative z-10 flex items-center gap-3">
                <Home size={18} className="text-current transition-colors duration-700" />
                <span>Home</span>
              </span>
            </NavLink>
            <NavLink to="/sponsors" className={navItemClass}>
              <span className="relative z-10 flex items-center gap-3">
                <BarChart2 size={18} className="text-current transition-colors duration-700" />
                <span>Sponsors</span>
              </span>
            </NavLink>
            <NavLink to="/chat" className={navItemClass}>
              <span className="relative z-10 flex items-center gap-3">
                <MessageSquare size={18} className="text-current transition-colors duration-700" />
                <span>AI Chat</span>
              </span>
            </NavLink>
          </nav>
        </div>
        
        {/* Theme Switcher Container */}
        <div className={`m-4 relative z-20 rounded-2xl overflow-hidden transition-all duration-700 ease-in-out ${isDarkMode ? 'border border-[#ff2a2a]/20 shadow-[0_0_10px_rgba(0,0,0,0.5)]' : 'border-none shadow-[0_0_15px_rgba(255,42,42,0.3)]'}`}>
          
          <div
            className={`absolute inset-0 bg-cover bg-[center_top] bg-no-repeat transition-all duration-700 ease-in-out ${isDarkMode ? 'opacity-50 mix-blend-screen' : 'opacity-80'}`}
            style={{ backgroundImage: `url('${themeBg}')` }}
          />
          
          <div className={`absolute inset-0 transition-all duration-700 ease-in-out ${isDarkMode ? 'bg-gradient-to-t from-[#0d0d12]/95 via-[#0d0d12]/60 to-[#0d0d12]/90' : 'bg-gradient-to-t from-white/80 via-transparent to-white/80'}`} />

          <div className="relative z-10 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className={`text-xs font-black uppercase tracking-widest transition-colors duration-700 ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>Theme</span>
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] drop-shadow-[0_0_5px_rgba(255,42,42,0.6)] text-[#ff2a2a]`}>
                {isDarkMode ? 'Dark' : 'Light'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsDarkMode((prev) => !prev)}
              className={`flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-700 ease-in-out ${
                isDarkMode
                  ? 'bg-black text-[#ff2a2a] border border-[#ff2a2a]/30 hover:bg-[#ff2a2a] hover:text-black hover:shadow-[0_0_15px_#ff2a2a]'
                  : 'bg-white text-[#ff2a2a] border-none hover:bg-[#ff2a2a] hover:text-white hover:shadow-[0_0_15px_#ff2a2a] shadow-sm'
              }`}
            >
              <span>{isDarkMode ? 'Switch Light' : 'Switch Dark'}</span>
              {isDarkMode ? (
                <Sun size={16} className="text-current transition-colors duration-700" />
              ) : (
                <Moon size={16} className="text-black transition-colors duration-700" />
              )}
            </button>
          </div>
        </div>
      </aside>

      <main className="relative z-10 flex-1 overflow-hidden">
        <Routes>
          <Route path="/" element={<HomePage isDarkMode={isDarkMode} />} />
          <Route path="/sponsors" element={<Sponsors isDarkMode={isDarkMode} />} />
          <Route path="/chat" element={<Chat isDarkMode={isDarkMode} messages={chatMessages} setMessages={setChatMessages} />} />
        </Routes>
      </main>
    </div>
  )
}

export default App