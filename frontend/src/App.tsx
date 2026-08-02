import { useState, useEffect, useRef } from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import { Home, MessageSquare, BarChart2, Moon, Sun, Sparkles, Cpu, Crosshair, ArrowRight, TrendingUp, Activity, XCircle, Edit2, Square, Check, X, Bot } from 'lucide-react'
import axios from 'axios'
import SponsorshipBookingAgent from './components/SponsorshipBookingAgent'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Dashboard from './Dashboard'
import IntroScreen from './IntroScreen'
import Footer from './Footer'



import matricaLogo from './assets/matrica-logo.png'
import valorantBg from './assets/valorant-bg.jpg'
import tabBg from './assets/horizontal.jpg' 
import horizBg from './assets/horiz.jpg' 
import gameImg from './assets/game.png'
import sovaImg from './assets/sova.png'

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
    axios.get('https://matrica-backend.jollyplant-fd7887aa.centralindia.azurecontainerapps.io/api/dashboard/recommendations')
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

    <div className="h-full overflow-y-auto page-enter flex flex-col justify-between">
      <div className="p-4 md:p-6 w-full">
        <div
          className={`relative rounded-[28px] ${shellClass} max-w-6xl mx-auto overflow-hidden`}
        >

        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff2a2a] to-transparent" />

        <div className="p-8 lg:p-10">

          {/* Hero Row with Text and Medium Animated Game Image */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-4">
            <div className="lg:col-span-8">
              {/* Badge */}
              <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-widest font-extrabold shadow-sm ${
                isDarkMode
                  ? 'bg-[#00e5ff]/20 border border-[#00e5ff]/40 text-[#00e5ff]'
                  : 'bg-blue-600/15 border border-blue-600/50 text-blue-900'
              }`}>
                <Sparkles size={14} />
                Matrica Control Room
              </div>

              {/* Heading */}
              <h1 className={`mt-6 text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight ${
                isDarkMode 
                  ? 'text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]' 
                  : 'text-slate-950 drop-shadow-sm'
              }`}>
                System
                <span className={isDarkMode ? 'text-[#00e5ff] drop-shadow-[0_0_15px_rgba(0,229,255,0.8)]' : 'text-blue-700 font-black'}>
                  {" "}Online
                </span>
              </h1>

              {/* Intro */}
              <div
                className={`mt-8 rounded-2xl p-6 ${
                  isDarkMode
                    ? "bg-black/20 border border-[#00e5ff]/25"
                    : "bg-white/95 border border-slate-300 shadow-lg"
                }`}
              >
                <h2 className={`flex items-center gap-2 font-black text-xl uppercase ${
                  isDarkMode ? 'text-[#00e5ff]' : 'text-blue-800 font-black'
                }`}>
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
            </div>

            {/* Medium size animated game image on Home page */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00e5ff]/20 via-transparent to-[#00e5ff]/5 opacity-60 rounded-3xl pointer-events-none blur-xl" />
              
              <div className="relative z-10 p-4 w-full flex items-center justify-center min-h-[220px]">
                <img
                  src={gameImg}
                  alt="Valorant Agent Game"
                  className="w-52 sm:w-60 md:w-64 h-52 sm:h-60 md:h-64 object-contain block mx-auto animate-smooth-zoom hover:scale-110 drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)] transition-all duration-500 cursor-pointer"
                />
              </div>

              <div className={`mt-2 relative z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                isDarkMode
                  ? 'bg-[#00e5ff]/15 border border-[#00e5ff]/30 text-[#00e5ff]'
                  : 'bg-blue-600/15 border border-blue-600/40 text-blue-800'
              }`}>
                <Sparkles size={12} /> Dynamic AI Agent
              </div>
            </div>
          </div>

          {/* Stats */}


          {/* Recommendation Title */}

          <div className="mt-12 mb-6 flex items-center gap-3">

            <BarChart2 size={22} className="text-[#00e5ff]" />

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
                    <p className={`mt-1 text-xs uppercase tracking-widest ${isDarkMode ? 'text-slate-400 font-bold' : 'text-black font-extrabold'}`}>
                      {card.subtitle}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full border ${
                      isDarkMode
                        ? 'bg-[#00e5ff]/15 border-[#00e5ff]/30 text-[#00e5ff]'
                        : 'bg-blue-600/15 border-blue-600/40 text-blue-800'
                    }`}>
                      <TrendingUp size={14} />
                      <span className="font-black text-sm">Rating: {card.score}</span>
                    </div>
                  </div>
                </div>

                {/* Achievements List */}
                <div className={`my-4 p-4 rounded-xl ${isDarkMode ? 'bg-black/30' : 'bg-slate-50 border border-slate-200'}`}>
                  <div className={`flex items-center gap-2 text-xs uppercase mb-3 font-bold tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-black font-black'}`}>
                    <Sparkles size={12} className={isDarkMode ? 'text-[#00e5ff]' : 'text-blue-700'} /> Career Highlights
                  </div>
                  <ul className="space-y-2">
                    {card.achievements?.map((achieve: string, i: number) => (
                      <li key={i} className={`text-sm flex items-start gap-2 ${isDarkMode ? 'text-slate-300 font-bold' : 'text-black font-black'}`}>
                        <span className="leading-5">{achieve}</span>
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
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
};

const Sponsors = ({ isDarkMode }: ThemeProps) => {
  const [budget, setBudget] = useState<string | number>(50000)
  const [showErrorPopup, setShowErrorPopup] = useState(false)
  const [popWeight, setPopWeight] = useState(34)
  const [repWeight, setRepWeight] = useState(33)
  const [skillWeight, setSkillWeight] = useState(33)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState('')
  const [scrollZoom, setScrollZoom] = useState(1)
  const [selectedPlayerForBooking, setSelectedPlayerForBooking] = useState<any>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop
    const factor = 1 + Math.sin(scrollTop * 0.015) * 0.08
    setScrollZoom(factor)
  }

  const pageText = isDarkMode ? 'text-white' : 'text-slate-950 font-black'
  const mutedText = isDarkMode ? 'text-slate-400' : 'text-slate-900 font-extrabold'
  
  const cardClass = isDarkMode
    ? 'border border-white/10 bg-black/45 shadow-[0_0_20px_rgba(0,0,0,0.32)] backdrop-blur-md'
    : 'border border-slate-300 bg-white/95 shadow-xl backdrop-blur-xl'
  const innerCardClass = isDarkMode
    ? 'border border-white/10 bg-white/5'
    : 'border border-slate-300 bg-slate-50 shadow-sm'
  const inputClass = isDarkMode
    ? 'w-full rounded-md bg-slate-900/80 p-2.5 text-sm text-white outline-none ring-1 ring-white/10 focus:ring-1 focus:ring-[#00e5ff] font-bold'
    : 'w-full rounded-md bg-white p-2.5 text-sm text-slate-950 outline-none ring-1 ring-blue-500/50 focus:ring-1 focus:ring-blue-600 font-bold shadow-sm'
  const sliderClass = isDarkMode
    ? 'w-full h-1.5 cursor-pointer appearance-none rounded-lg bg-slate-700 accent-[#00e5ff]'
    : 'w-full h-1.5 cursor-pointer appearance-none rounded-lg bg-slate-300 accent-blue-600 shadow-sm'
  const pillButtonClass = isDarkMode
    ? 'rounded-md bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-300 ring-1 ring-white/10 transition-all duration-500'
    : 'rounded-md bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-950 ring-1 ring-slate-300 transition-all duration-500 shadow-sm hover:bg-blue-600 hover:text-white'

  const applyTemplate = (type: string) => {
    if (type === 'energy') { setPopWeight(70); setRepWeight(20); setSkillWeight(10); }
    if (type === 'tech') { setPopWeight(20); setRepWeight(10); setSkillWeight(70); }
    if (type === 'apparel') { setPopWeight(40); setRepWeight(40); setSkillWeight(20); }
    if (type === 'balanced') { setPopWeight(34); setRepWeight(33); setSkillWeight(33); }
  }

  const handleWeightChange = (changedIndex: number, newValue: number) => {
    const values = [popWeight, repWeight, skillWeight];
    const oldValue = values[changedIndex];
    
    if (newValue === oldValue) return;

    let remaining = 100 - newValue;
    const oldRemaining = 100 - oldValue;

    let newValues = [...values];
    newValues[changedIndex] = newValue;

    const otherIndices = [0, 1, 2].filter(i => i !== changedIndex);

    if (oldRemaining === 0) {
      newValues[otherIndices[0]] = Math.round(remaining / 2);
      newValues[otherIndices[1]] = remaining - newValues[otherIndices[0]];
    } else {
      const ratio = remaining / oldRemaining;
      newValues[otherIndices[0]] = Math.round(values[otherIndices[0]] * ratio);
      newValues[otherIndices[1]] = remaining - newValues[otherIndices[0]];
    }

    setPopWeight(newValues[0]);
    setRepWeight(newValues[1]);
    setSkillWeight(newValues[2]);
  }

  const runMatch = async () => {
    const numBudget = Number(budget);
    if (isNaN(numBudget) || numBudget < 0 || budget === '') {
      setShowErrorPopup(true);
      return;
    }
    setLoading(true)
    setError('')
    try {
      const res = await axios.post('https://matrica-backend.jollyplant-fd7887aa.centralindia.azurecontainerapps.io/api/match_sponsor', {
        budget: numBudget, popWeight, repWeight, skillWeight
      })
      setResults(res.data)

      if (res.data.auto_book_status) {
        console.log(`Agent Action: ${res.data.auto_book_status}`);
      }
    } catch (err: any) {
      setError(err.message || 'Error connecting to backend')
    } finally {
      setLoading(false)
    }
  }

  const players = Array.isArray(results?.players) ? results.players : []
  const summary = typeof results?.summary === 'string' ? results.summary : ''

  return (
    <div onScroll={handleScroll} className="h-full overflow-y-auto page-enter flex flex-col justify-between">
      <div className="p-4 md:p-6 flex flex-col max-w-6xl mx-auto space-y-4 w-full">
      
      <div className={`relative rounded-2xl overflow-hidden transition-all duration-700 ease-in-out ${isDarkMode ? 'border border-[#00e5ff]/30 shadow-lg' : 'border border-slate-300 shadow-md'} shrink-0`}>
        <div
          className={`absolute inset-0 bg-cover bg-[center_top] bg-no-repeat transition-all duration-700 ease-in-out ${isDarkMode ? 'opacity-50 mix-blend-screen' : 'opacity-80'}`}
          style={{ backgroundImage: `url('${horizBg}')` }}
        />
        <div className={`absolute inset-0 transition-all duration-700 ease-in-out ${isDarkMode ? 'bg-gradient-to-r from-black/90 via-black/60 to-black/90 backdrop-blur-sm' : 'bg-gradient-to-r from-white/90 via-white/60 to-white/90 backdrop-blur-sm'}`} />
        
        <div className="relative z-10 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className={`text-2xl md:text-3xl font-extrabold uppercase tracking-wide flex items-center gap-3 transition-colors duration-700 ${pageText}`}>
              <BarChart2 size={24} className={`transition-colors duration-700 ${isDarkMode ? 'text-[#00e5ff]' : 'text-blue-700'}`} />
              Sponsorship <span className={isDarkMode ? 'text-[#00e5ff] drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]' : 'text-blue-700 font-black'}>Intelligence</span>
            </h1>
            <p className={`text-xs mt-1 transition-colors duration-700 ${mutedText} ml-[36px]`}>Find the perfect player for your brand using our matching engine.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 shrink-0">
        <div className={`transition-all duration-700 ease-in-out ${cardClass} rounded-2xl p-5 shadow-lg flex-1`}>
          <h2 className={`text-sm font-bold mb-3 uppercase tracking-wide flex items-center gap-2 drop-shadow-sm ${
            isDarkMode ? 'text-[#00e5ff]' : 'text-blue-700 font-black'
          }`}>
            <Crosshair size={16} /> 1. Quick Industry Templates
          </h2>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => applyTemplate('energy')} className={`${pillButtonClass} hover:bg-[#00e5ff] hover:text-black hover:shadow-[0_0_15px_rgba(0,229,255,0.6)] hover:border-[#00e5ff]`}>⚡ Energy Drink</button>
            <button onClick={() => applyTemplate('tech')} className={`${pillButtonClass} hover:bg-blue-500 hover:text-white hover:shadow-[0_0_10px_#3b82f6] hover:ring-blue-500`}>🖱️ Tech / Gear</button>
            <button onClick={() => applyTemplate('apparel')} className={`${pillButtonClass} hover:bg-[#00ff88] hover:text-black hover:shadow-[0_0_15px_rgba(0,255,136,0.6)] hover:ring-[#00ff88]`}>👕 Apparel</button>
            <button onClick={() => applyTemplate('balanced')} className={`${pillButtonClass} hover:bg-slate-700 hover:text-white hover:shadow-[0_0_10px_#334155] hover:ring-slate-700`}>⚖️ Balanced</button>
          </div>
        </div>

        <div className={`transition-all duration-700 ease-in-out ${cardClass} rounded-2xl p-5 shadow-lg lg:w-80 flex flex-col justify-center`}>
          <label className={`mb-1 block text-xs font-bold uppercase tracking-wider transition-colors duration-700 ${isDarkMode ? 'text-slate-300' : 'text-slate-900 drop-shadow-sm'}`}>Max Budget (₹)</label>
          <input type="text" value={budget} onChange={(e) => setBudget(e.target.value)} className={`transition-all duration-700 ${inputClass}`} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 shrink-0 items-stretch">
        <div className={`lg:col-span-7 transition-all duration-700 ease-in-out ${cardClass} rounded-2xl p-6 shadow-lg flex flex-col justify-center`}>
          <h2 className={`text-sm font-bold uppercase tracking-wide drop-shadow-sm mb-4 flex items-center gap-2 ${
            isDarkMode ? 'text-[#00e5ff]' : 'text-blue-700 font-black'
          }`}>
            <Sparkles size={16} /> 2. Fine-tune your Weights
          </h2>

          <div className="space-y-5">
            <div>
              <div className="flex justify-between mb-1">
                <label className={`text-[10px] font-bold uppercase tracking-wider transition-colors duration-700 ${isDarkMode ? 'text-slate-300' : 'text-slate-900 drop-shadow-sm'}`}>YouTube Popularity</label>
                <span className={`font-extrabold text-xs brand-font drop-shadow-sm ${isDarkMode ? 'text-[#00e5ff]' : 'text-blue-700 font-black'}`}>{popWeight}%</span>
              </div>
              <input type="range" min="0" max="100" value={popWeight} onChange={(e) => handleWeightChange(0, Number(e.target.value))} className={`transition-all duration-700 ${sliderClass}`} />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className={`text-[10px] font-bold uppercase tracking-wider transition-colors duration-700 ${isDarkMode ? 'text-slate-300' : 'text-slate-900 drop-shadow-sm'}`}>Brand Reputation</label>
                <span className={`font-extrabold text-xs brand-font drop-shadow-sm ${isDarkMode ? 'text-[#00e5ff]' : 'text-blue-700 font-black'}`}>{repWeight}%</span>
              </div>
              <input type="range" min="0" max="100" value={repWeight} onChange={(e) => handleWeightChange(1, Number(e.target.value))} className={`transition-all duration-700 ${sliderClass}`} />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label className={`text-[10px] font-bold uppercase tracking-wider transition-colors duration-700 ${isDarkMode ? 'text-slate-300' : 'text-slate-900 drop-shadow-sm'}`}>In-Game Skill</label>
                <span className={`font-extrabold text-xs brand-font drop-shadow-sm ${isDarkMode ? 'text-[#00e5ff]' : 'text-blue-700 font-black'}`}>{skillWeight}%</span>
              </div>
              <input type="range" min="0" max="100" value={skillWeight} onChange={(e) => handleWeightChange(2, Number(e.target.value))} className={`transition-all duration-700 ${sliderClass}`} />
            </div>
          </div>
        </div>

        {/* Right side game image with smooth zoom in/out animation */}
        <div className={`lg:col-span-5 transition-all duration-700 ease-in-out ${cardClass} rounded-2xl p-5 shadow-lg flex flex-col items-center justify-center relative overflow-hidden group min-h-[220px]`}>
          <div className="absolute inset-0 bg-gradient-to-br from-[#00e5ff]/15 via-transparent to-[#00e5ff]/5 opacity-60 pointer-events-none" />
          
          <div
            style={{ transform: `scale(${scrollZoom})` }}
            className="w-full flex items-center justify-center transition-transform duration-300 ease-out z-10 min-h-[240px]"
          >
            <img
              src={sovaImg}
              alt="Valorant Sova Agent"
              className="w-56 sm:w-64 md:w-72 h-56 sm:h-64 md:h-72 object-contain block mx-auto animate-smooth-zoom hover:scale-110 drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)] transition-all duration-500 cursor-pointer"
            />
          </div>

          <div className={`mt-3 relative z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest shadow-sm ${
            isDarkMode
              ? 'bg-[#00e5ff]/15 border-[#00e5ff]/30 text-[#00e5ff]'
              : 'bg-blue-600/15 border-blue-600/40 text-blue-800'
          }`}>
            <Sparkles size={12} /> AI Matching Engine
          </div>
        </div>
      </div>

      <div className="flex justify-center my-4 shrink-0">
        <button
          onClick={runMatch}
          disabled={loading}
          className={`w-full sm:w-80 md:w-96 py-3.5 font-black text-sm rounded-2xl transition-all duration-300 uppercase tracking-widest disabled:opacity-50 flex items-center justify-center gap-2 ${
            isDarkMode
              ? 'bg-[#00e5ff] text-black hover:bg-white hover:text-black shadow-[0_0_20px_rgba(0,229,255,0.6)] hover:shadow-[0_0_30px_rgba(0,255,136,0.9)]'
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
          }`}
        >
          {loading ? 'Analyzing Telemetry...' : <><Sparkles size={16} /> Run Dynamic AI Match</>}
        </button>
      </div>

      {error && <div className={`shrink-0 rounded-xl border p-3 text-xs text-red-400 font-bold transition-all duration-700 ${isDarkMode ? 'border-red-900 bg-red-950/60' : 'border-red-500 bg-red-50 text-red-700 shadow-md'}`}>{error}</div>}

      {results && (
        <div className={`transition-all duration-700 ease-in-out ${cardClass} rounded-2xl p-6 shadow-xl page-enter flex flex-col shrink-0`}>
          <h2 className={`mb-4 text-xl font-extrabold uppercase tracking-wide ${pageText}`}>Top Recommended Players</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {players.map((p: any, i: number) => (
              <div key={i} className={`transition-all duration-700 ease-in-out ${innerCardClass} relative overflow-hidden rounded-xl p-4 hover:border-[#00e5ff]/50 group shadow-md`}>
                <div className="absolute inset-0 bg-gradient-to-br from-[#00e5ff]/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                {i === 0 && <div className={isDarkMode ? "absolute top-0 right-0 bg-[#00e5ff] text-black font-black text-[10px] px-3 py-1 rounded-bl-lg uppercase tracking-wider shadow-[0_0_8px_rgba(0,229,255,0.8)]" : "absolute top-0 right-0 bg-blue-700 text-white font-black text-[10px] px-3 py-1 rounded-bl-lg uppercase tracking-wider shadow-md"}>TOP MATCH</div>}
                
                <h3 className={`mb-1 text-lg font-black uppercase tracking-wide ${pageText}`}>{p.name}</h3>
                <div className={`mb-2 text-3xl font-black ${isDarkMode ? 'text-[#00e5ff] drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]' : 'text-blue-700'} brand-font`}>
                  {p.score}<span className={`text-sm transition-colors duration-700 ${isDarkMode ? 'text-slate-500' : 'text-slate-600'}`}>/100</span>
                </div>

                <div className={`space-y-1 text-xs font-bold transition-colors duration-700 ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>
                  <div className="flex justify-between"><span>Pop:</span> <span className={`font-black transition-colors duration-700 ${isDarkMode ? 'text-white' : 'text-black'} brand-font`}>{p.popularity}</span></div>
                  <div className="flex justify-between"><span>Rep:</span> <span className={`font-black transition-colors duration-700 ${isDarkMode ? 'text-white' : 'text-black'} brand-font`}>{p.reputation}</span></div>
                  <div className="flex justify-between"><span>Skill:</span> <span className={`font-black transition-colors duration-700 ${isDarkMode ? 'text-white' : 'text-black'} brand-font`}>{p.skill}</span></div>
                  <div className={`mt-2 flex justify-between border-t pt-2 font-extrabold text-green-600 ${isDarkMode ? 'border-slate-700' : 'border-slate-300'}`}>
                    <span className="text-slate-900 dark:text-white transition-colors duration-700">Cost:</span> 
                    <span className="brand-font drop-shadow-sm">₹{p.cost.toLocaleString()}</span>
                  </div>
                  <div className="mt-4 flex justify-center border-t pt-4 border-slate-700">
                    {p.is_currently_sponsored ? (
                      <span className="w-full text-center py-2 px-4 rounded-xl bg-slate-800 text-slate-500 font-black uppercase text-xs tracking-wider border border-slate-700 cursor-not-allowed">
                        🔒 Currently Sponsored
                      </span>
                    ) : (
                      <button 
                        onClick={() => setSelectedPlayerForBooking(p)}
                        className={`relative z-10 w-full py-2 px-4 rounded-xl font-black uppercase text-xs tracking-wider transition-all shadow-md flex items-center justify-center gap-2 ${
                          isDarkMode 
                            ? 'bg-[#00e5ff] text-black hover:bg-white hover:shadow-[0_0_15px_rgba(0,229,255,0.6)]' 
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        <Bot size={16} /> Propose Sponsorship
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedPlayerForBooking && (
            <SponsorshipBookingAgent 
              player={selectedPlayerForBooking} 
              onClose={() => setSelectedPlayerForBooking(null)} 
              isDarkMode={isDarkMode} 
            />
          )}

          <div className={`${innerCardClass} rounded-xl p-4 shadow-sm`}>
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-[#00e5ff] mb-2 flex items-center gap-2 drop-shadow-sm">
              <Sparkles size={14} /> Matrica AI Analysis
            </h3>
            <p className={`whitespace-pre-wrap text-xs leading-relaxed font-bold transition-colors duration-700 ${isDarkMode ? 'text-slate-300' : 'text-slate-900'}`}>
              {summary || 'No AI summary available for this result yet.'}
            </p>
          </div>
        </div>
      )}
      </div>

      <Footer isDarkMode={isDarkMode} />

      {showErrorPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm page-enter">
          <div className="relative w-80 rounded-2xl border-2 border-[#00e5ff] bg-[#0a0a0f] p-6 shadow-[0_0_30px_rgba(0,229,255,0.35)]">
            <div className="mb-4 flex items-center justify-center text-[#00e5ff]">
               <XCircle size={40} className="animate-pulse drop-shadow-[0_0_10px_rgba(0,229,255,0.5)]" />
            </div>
            <h3 className="mb-2 text-center text-xl font-black uppercase tracking-widest text-white drop-shadow-md">Invalid</h3>
            <p className="mb-6 text-center text-sm font-bold text-slate-400">
              Please enter a valid maximum budget amount.
            </p>
            <button
              onClick={() => setShowErrorPopup(false)}
              className="w-full rounded-xl bg-[#00e5ff] py-2.5 font-black uppercase tracking-wider text-white transition-all hover:bg-white hover:text-black hover:shadow-[0_0_15px_rgba(0,229,255,0.5)]"
            >
              Acknowledge
            </button>
          </div>
        </div>
      )}
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

  const abortControllerRef = useRef<AbortController | null>(null)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editInput, setEditInput] = useState('')

  const handleSend = async (overrideInput?: string, skipPush?: boolean) => {
    const textToSend = overrideInput !== undefined ? overrideInput : input
    if (!textToSend.trim()) return
    
    if (!skipPush) {
      setMessages(prev => [...prev, { role: 'user', content: textToSend }])
      if (overrideInput === undefined) setInput('')
    }
    setLoading(true)
    
    abortControllerRef.current = new AbortController()
    
    try {
      const res = await axios.post('https://matrica-backend.jollyplant-fd7887aa.centralindia.azurecontainerapps.io/api/chat', { query: textToSend }, {
        signal: abortControllerRef.current.signal
      })
      setMessages(prev => [...prev, { role: 'ai', content: res.data.answer }])
    } catch (err: any) {
      if (axios.isCancel(err)) {
        console.log('Request canceled by user');
      } else {
        setMessages(prev => [...prev, { role: 'ai', content: 'Error connecting to Matrica backend.' }])
      }
    } finally {
      setLoading(false)
      abortControllerRef.current = null
    }
  }

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setMessages(prev => [...prev, { role: 'ai', content: '*Generation stopped by user.*' }])
    }
  }

  const startEdit = (index: number, content: string) => {
    setEditingIndex(index)
    setEditInput(content)
  }

  const cancelEdit = () => {
    setEditingIndex(null)
    setEditInput('')
  }

  const saveEdit = (index: number) => {
    if (!editInput.trim()) return
    const updatedMessages = messages.slice(0, index)
    updatedMessages.push({ role: 'user', content: editInput })
    setMessages(updatedMessages)
    setEditingIndex(null)
    handleSend(editInput, true)
  }

  return (
    <div className="flex flex-col h-full max-h-screen page-enter justify-between">
      <div className="p-4 md:p-6 flex flex-col flex-1 overflow-hidden w-full">
      
      <div className={`shrink-0 relative mb-4 rounded-2xl overflow-hidden transition-all duration-700 ease-in-out ${isDarkMode ? 'border border-white/5 shadow-2xl' : 'border-none shadow-md'}`}>
        <div
          className={`absolute inset-0 bg-cover bg-[center_top] bg-no-repeat transition-all duration-700 ease-in-out ${isDarkMode ? 'opacity-50 mix-blend-screen' : 'opacity-80'}`}
          style={{ backgroundImage: `url('${horizBg}')` }}
        />
        <div className={`absolute inset-0 transition-all duration-700 ease-in-out ${isDarkMode ? 'bg-gradient-to-r from-black/90 via-black/60 to-black/90 backdrop-blur-sm' : 'bg-gradient-to-r from-white/90 via-white/60 to-white/90 backdrop-blur-sm'}`} />
        
        <div className="relative z-10 p-5">
          <h1 className={`text-2xl md:text-3xl font-extrabold uppercase tracking-wide flex items-center gap-3 transition-colors duration-700 ${isDarkMode ? 'text-white' : 'text-slate-950 font-black'}`}>
            <MessageSquare size={24} className={`transition-colors duration-700 ${isDarkMode ? 'text-[#00e5ff]' : 'text-blue-700'}`} /> 
            AI <span className={isDarkMode ? 'text-[#00e5ff] drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]' : 'text-blue-700 font-black'}>Commlink</span>
          </h1>
        </div>
      </div>
      
      <div className={`mb-4 flex-1 space-y-3 overflow-y-auto rounded-xl p-5 shadow-lg backdrop-blur-md transition-all duration-700 ease-in-out ${isDarkMode ? 'bg-black/45 border border-white/10' : 'bg-white/40 border-transparent'}`}>
        {messages.length === 0 && !loading && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-90 transition-opacity duration-700 w-full">
            <Cpu size={40} className={`mb-3 ${isDarkMode ? 'text-[#00e5ff] drop-shadow-[0_0_10px_rgba(0,229,255,0.6)]' : 'text-blue-700'}`} />
            <p className={`text-lg font-black uppercase tracking-widest transition-colors duration-700 ${isDarkMode ? 'text-white' : 'text-slate-950'}`}>Secure Channel Established</p>
            <p className={`mt-1 text-sm font-bold transition-colors duration-700 ${isDarkMode ? 'text-slate-400' : 'text-slate-900'}`}>Awaiting telemetry queries or select a suggested analysis below:</p>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl w-full px-4">
              {[
                "Run a complete quantitative and qualitative analysis on the player 'TenZ'.",
                "Which team won the most eco rounds in the VCT Americas tournament?",
                "Compare the average combat score (ACS) and headshot percentages of Demon1 and Aspas.",
                "What is the latest community sentiment and news around FNATIC Boaster?"
              ].map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className={`text-left p-4 rounded-xl border transition-all duration-300 group relative overflow-hidden ${
                    isDarkMode 
                      ? 'border-white/10 bg-black/40 hover:border-[#00e5ff]/50 hover:bg-[#00e5ff]/10 hover:shadow-[0_0_15px_rgba(0,229,255,0.2)]' 
                      : 'border-slate-300 bg-white/60 hover:border-[#00e5ff]/50 hover:bg-cyan-50 hover:shadow-md'
                  }`}
                >
                  <p className={`text-xs font-bold leading-relaxed transition-colors ${isDarkMode ? 'text-slate-300 group-hover:text-white' : 'text-slate-700 group-hover:text-black'}`}>
                    "{q}"
                  </p>
                  <div className="mt-2 flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-[#00e5ff] opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight size={10} /> Auto-Execute
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] w-fit rounded-xl p-3 text-sm font-bold shadow-sm page-enter transition-all duration-700 ease-in-out group relative ${
              m.role === 'user'
                ? 'ml-auto bg-gradient-to-br from-[#00e5ff]/95 to-[#00b8d4]/90 backdrop-blur-md text-black font-extrabold shadow-[0_0_15px_rgba(0,229,255,0.4)] rounded-br-none border border-white/20'
                : isDarkMode
                  ? 'mr-auto bg-slate-800 text-slate-100 border border-white/10 rounded-bl-none'
                  : 'mr-auto bg-white/90 text-slate-900 border-transparent rounded-bl-none shadow-md'
            }`}
          >
            {m.role === 'ai' ? (
              <div className={`prose ${isDarkMode ? 'prose-invert' : ''} prose-sm max-w-none prose-p:leading-relaxed prose-li:my-0 prose-table:border prose-table:border-white/10 prose-th:bg-black/20 prose-th:p-2 prose-td:p-2`}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
              </div>
            ) : editingIndex === i ? (
              <div className="flex flex-col gap-2 min-w-[250px] sm:min-w-[400px]">
                <textarea
                  className="w-full rounded-lg bg-black/40 border border-white/30 p-2 text-sm text-white outline-none focus:border-white resize-none"
                  value={editInput}
                  onChange={(e) => setEditInput(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-end gap-2">
                  <button onClick={cancelEdit} className="flex items-center gap-1 rounded bg-black/40 px-2 py-1 text-xs hover:bg-black/60 transition-colors"><X size={12}/> Cancel</button>
                  <button onClick={() => saveEdit(i)} className="flex items-center gap-1 rounded bg-white text-[#00e5ff] px-2 py-1 text-xs font-black hover:bg-gray-200 transition-colors"><Check size={12}/> Save & Submit</button>
                </div>
              </div>
            ) : (
              <>
                {m.content}
                <button 
                  onClick={() => startEdit(i, m.content)}
                  className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 p-1.5 rounded-full bg-black/50 text-white hover:bg-[#00e5ff] hover:text-white shadow-lg hover:shadow-[0_0_10px_rgba(0,229,255,0.5)] hover:scale-110"
                  title="Edit message"
                >
                  <Edit2 size={14} />
                </button>
              </>
            )}
          </div>
        ))}
        {loading && <div className={`mr-auto max-w-[85%] rounded-xl rounded-bl-none p-3 text-sm font-bold uppercase tracking-wider border shadow-sm flex items-center gap-3 transition-all duration-700 ease-in-out ${isDarkMode ? 'bg-slate-800 text-[#00e5ff] border-white/10' : 'bg-white/90 text-[#00e5ff] border-transparent'}`}>
          <div className="flex items-center gap-2 animate-pulse">
            <div className="h-1.5 w-1.5 bg-[#00e5ff] rounded-full animate-ping" />
            <div className="h-1.5 w-1.5 bg-[#00e5ff] rounded-full animate-ping delay-75" />
            <div className="h-1.5 w-1.5 bg-[#00e5ff] rounded-full animate-ping delay-150" />
            Matrica is thinking...
          </div>
        </div>}
      </div>
      
      <div className="relative shrink-0">
        <input 
          className={`w-full rounded-xl p-4 pr-12 text-sm font-bold outline-none transition-all duration-700 focus:ring-1 focus:ring-[#00e5ff] shadow-[0_0_15px_rgba(0,0,0,0.3)] ${
            isDarkMode ? 'bg-black/60 text-white border border-white/10 focus:border-[#00e5ff]' : 'bg-white/90 text-slate-900 border-transparent backdrop-blur-md focus:border-[#00e5ff]'
          }`}
          placeholder="Transmit query to Matrica..." 
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        {loading ? (
          <button 
            onClick={handleStop}
            className={`absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#00e5ff] transition-all duration-500 hover:scale-110`}
            title="Stop Generation"
          >
            <Square size={20} className="fill-current" />
          </button>
        ) : (
          <button 
            onClick={() => handleSend()}
            className={`absolute right-4 top-1/2 -translate-y-1/2 text-[#00e5ff] transition-all duration-500 ${isDarkMode ? 'hover:text-white' : 'hover:text-black'} hover:drop-shadow-[0_0_10px_rgba(0,229,255,0.5)]`}
          >
            <ArrowRight size={20} />
          </button>
        )}
      </div>
      </div>
      <Footer isDarkMode={isDarkMode} />
    </div>
  )
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [chatMessages, setChatMessages] = useState<{role: string, content: string}[]>([])
  const [showIntro, setShowIntro] = useState(true)

  if (showIntro) {
    return <IntroScreen onEnter={() => setShowIntro(false)} isDarkMode={isDarkMode} />
  }

  const appShellClass = isDarkMode ? 'bg-[#080a10] text-white' : 'bg-slate-100 text-slate-900'

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `group relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
      isActive
        ? isDarkMode
          ? 'bg-[#00e5ff] text-black font-extrabold shadow-[0_0_20px_rgba(0,229,255,0.8)] scale-105 z-10'
          : 'bg-blue-600 text-white font-black shadow-md border border-blue-700 scale-105 z-10'
        : isDarkMode
          ? 'text-slate-300 hover:text-white hover:bg-white/10'
          : 'text-slate-900 hover:text-black hover:bg-black/10 font-extrabold'
    }`

  return (
    <div className={`relative flex flex-col h-screen overflow-hidden transition-colors duration-700 ease-in-out ${appShellClass}`}>
      
      {/* Background Image Layer */}
      <div
        className={`pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 ease-in-out ${isDarkMode ? 'opacity-[0.85]' : 'opacity-100'}`}
        style={{ backgroundImage: `url('${valorantBg}')` }}
      />
      
      {/* Gradient Overlay */}
      <div className={`pointer-events-none absolute inset-0 transition-all duration-700 ease-in-out ${isDarkMode ? 'bg-black/65' : 'bg-transparent'}`} />
      
      {/* Scanline Effect Overlay */}
      <div className="scanlines" />

      {/* HORIZONTAL TOP NAVIGATION BAR (Replicating BGMI Screenshot / Image 1) */}
      <header className={`relative z-30 flex items-center justify-between px-6 py-3.5 border-b transition-all duration-700 ease-in-out shadow-xl shrink-0 ${
        isDarkMode ? 'border-white/10 bg-black/80 backdrop-blur-2xl' : 'border-slate-300 bg-white/75 backdrop-blur-2xl'
      }`}>
        {/* Texture Wallpaper behind Header (replicates wallpaper behind tabs) */}
        <div
          className={`pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700 ${isDarkMode ? 'opacity-30 mix-blend-screen' : 'opacity-45'}`}
          style={{ backgroundImage: `url('${tabBg}')` }}
        />

        {/* LOGO & BRAND */}
        <div 
          className="relative z-10 flex items-center gap-3 cursor-pointer group"
          onClick={() => setShowIntro(true)} 
          title="Click to return to Intro Screen"
        >
          <img
            src={matricaLogo}
            alt="Matrica logo"
            className={`h-10 w-10 object-contain group-hover:scale-110 transition-transform ${
              isDarkMode ? 'drop-shadow-[0_0_12px_rgba(0,229,255,0.8)] animate-logo-glow' : 'drop-shadow-sm'
            }`}
          />
          <div className="flex flex-col">
            <h2 className={`brand-font text-2xl tracking-[0.2em] font-black transition-colors duration-700 ${
              isDarkMode 
                ? 'text-white drop-shadow-[0_0_10px_rgba(0,229,255,0.6)] animate-title-glow' 
                : 'text-blue-950 drop-shadow-sm font-black'
            }`}>
              MATRICA
            </h2>
            <p className={`mt-0.5 text-[9px] font-black uppercase tracking-widest transition-colors duration-700 ${
              isDarkMode ? 'text-[#00e5ff]' : 'text-blue-700 font-black'
            }`}>
              Esports Sponsorship Platform
            </p>
          </div>
        </div>

        {/* HORIZONTAL BGMI-STYLE TAB MENU */}
        <div className={`relative z-10 hidden md:flex items-center gap-1.5 px-2 py-1.5 rounded-2xl border transition-all duration-700 ${
          isDarkMode ? 'border-white/10 bg-black/60 shadow-inner' : 'border-slate-300 bg-white/60 shadow-inner'
        }`}>
          <NavLink to="/" className={navItemClass}>
            <Home size={16} />
            <span>HOME</span>
          </NavLink>
          <NavLink to="/sponsors" className={navItemClass}>
            <BarChart2 size={16} />
            <span>SPONSORS ↗</span>
          </NavLink>
          <NavLink to="/dashboard" className={navItemClass}>
            <Activity size={16} />
            <span>DASHBOARD ↗</span>
          </NavLink>
          <NavLink to="/chat" className={navItemClass}>
            <MessageSquare size={16} />
            <span>AI CHAT ↗</span>
          </NavLink>
        </div>
        
        {/* RIGHT ACTION CONTROLS: INTRO SCREEN + CLASSY DARK MODE SWITCHER */}
        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={() => setShowIntro(true)}
            className={`hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${
              isDarkMode
                ? 'border-[#00e5ff]/40 bg-[#00e5ff]/10 text-[#00e5ff] hover:bg-[#00e5ff] hover:text-black hover:shadow-[0_0_15px_rgba(0,229,255,0.8)]'
                : 'border-slate-400 bg-white/80 text-slate-900 hover:bg-[#00e5ff] hover:text-black hover:border-black hover:shadow-md'
            }`}
            title="Return to Welcome / Landing Screen"
          >
            <Sparkles size={13} />
            <span>Intro Screen</span>
          </button>

          {/* BGMI-style Dark Mode Switcher */}
          <button
            type="button"
            onClick={() => setIsDarkMode((prev) => !prev)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wider transition-all duration-500 shadow-md ${
              isDarkMode
                ? 'bg-black text-[#00e5ff] border border-[#00e5ff]/40 hover:bg-[#00e5ff] hover:text-black hover:shadow-[0_0_20px_rgba(0,229,255,0.8)]'
                : 'bg-black text-[#00e5ff] border border-[#00e5ff]/50 hover:bg-[#00e5ff] hover:text-black hover:shadow-[0_0_20px_rgba(0,229,255,0.8)]'
            }`}
          >
            <span>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
            {isDarkMode ? (
              <Sun size={15} className="text-current transition-colors duration-500" />
            ) : (
              <Moon size={15} className="text-current transition-colors duration-500" />
            )}
          </button>
        </div>
      </header>

      {/* MOBILE HORIZONTAL NAVIGATION FOR SMALL SCREENS */}
      <div className={`md:hidden relative z-30 flex items-center justify-around px-2 py-2 border-b overflow-x-auto shrink-0 ${
        isDarkMode ? 'border-white/10 bg-black/80' : 'border-slate-300 bg-white/80'
      }`}>
        <NavLink to="/" className={navItemClass}>
          <Home size={14} />
          <span>HOME</span>
        </NavLink>
        <NavLink to="/sponsors" className={navItemClass}>
          <BarChart2 size={14} />
          <span>SPONSORS</span>
        </NavLink>
        <NavLink to="/dashboard" className={navItemClass}>
          <Activity size={14} />
          <span>DASHBOARD</span>
        </NavLink>
        <NavLink to="/chat" className={navItemClass}>
          <MessageSquare size={14} />
          <span>CHAT</span>
        </NavLink>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="relative z-10 flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<HomePage isDarkMode={isDarkMode} />} />
          <Route path="/sponsors" element={<Sponsors isDarkMode={isDarkMode} />} />
          <Route path="/dashboard" element={<Dashboard isDarkMode={isDarkMode} />} />
          <Route path="/chat" element={<Chat isDarkMode={isDarkMode} messages={chatMessages} setMessages={setChatMessages} />} />
        </Routes>
      </main>
    </div>
  )
}

export default App