import { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, Target, TrendingUp, Users, Star, BarChart3, Crosshair, Zap, ShieldAlert, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import horizBg from './assets/horiz.jpg';

type ThemeProps = {
  isDarkMode: boolean;
};

// Define perspective types
type PerspectiveType = 'performance' | 'brand' | 'mastery';

// Define categories per perspective
const CATEGORIES: Record<PerspectiveType, any[]> = {
  performance: [
    { id: 'kills', label: 'Top Kills', icon: <Target size={16} />, color: '#ff2a2a' },
    { id: 'kd', label: 'Top K/D Ratio', icon: <Activity size={16} />, color: '#3b82f6' },
    { id: 'acs', label: 'Highest ACS', icon: <BarChart3 size={16} />, color: '#a855f7' },
    { id: 'hs', label: 'Headshot %', icon: <Crosshair size={16} />, color: '#ec4899' },
  ],
  brand: [
    { id: 'score', label: 'Overall Score', icon: <Star size={16} />, color: '#10b981' },
    { id: 'popularity', label: 'Most Popular', icon: <Users size={16} />, color: '#f59e0b' },
    { id: 'first_kills', label: 'Highest First Kills', icon: <Zap size={16} />, color: '#fb923c' },
  ],
  mastery: [
    { id: 'agent_jett', label: 'Best Jett', icon: <ShieldAlert size={16} />, color: '#0ea5e9' },
    { id: 'agent_omen', label: 'Best Omen', icon: <ShieldAlert size={16} />, color: '#6366f1' },
    { id: 'agent_viper', label: 'Best Viper', icon: <ShieldAlert size={16} />, color: '#22c55e' },
    { id: 'agent_killjoy', label: 'Best Killjoy', icon: <ShieldAlert size={16} />, color: '#eab308' },
  ]
};

export default function Dashboard({ isDarkMode }: ThemeProps) {
  const [activePerspective, setActivePerspective] = useState<PerspectiveType>('performance');
  const [activeCategory, setActiveCategory] = useState(CATEGORIES.performance[0]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // When perspective changes, reset category to the first of that perspective
  useEffect(() => {
    setActiveCategory(CATEGORIES[activePerspective][0]);
  }, [activePerspective]);

  useEffect(() => {
    setLoading(true);
    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/dashboard/stats?category=${activeCategory.id}`)
      .then(res => {
        setData(res.data);
      })
      .catch(err => console.error("Error fetching dashboard stats", err))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const pageText = isDarkMode ? 'text-white' : 'text-slate-900 drop-shadow-sm';
  const mutedText = isDarkMode ? 'text-slate-400' : 'text-slate-600 font-bold';
  const cardClass = isDarkMode
    ? 'border border-white/10 bg-black/45 shadow-[0_0_20px_rgba(0,0,0,0.32)] backdrop-blur-md'
    : 'border border-slate-200 bg-white/60 shadow-lg backdrop-blur-xl';

  return (
    <div className="p-4 md:p-6 h-full overflow-y-auto page-enter">
      <div className="flex flex-col max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className={`relative rounded-2xl overflow-hidden transition-all duration-700 ease-in-out ${isDarkMode ? 'border border-[#ff2a2a]/20 shadow-lg' : 'border-none shadow-md'} shrink-0`}>
          <div
            className={`absolute inset-0 bg-cover bg-[center_top] bg-no-repeat transition-all duration-700 ease-in-out ${isDarkMode ? 'opacity-50 mix-blend-screen' : 'opacity-80'}`}
            style={{ backgroundImage: `url('${horizBg}')` }}
          />
          <div className={`absolute inset-0 transition-all duration-700 ease-in-out ${isDarkMode ? 'bg-gradient-to-r from-black/90 via-black/60 to-black/90 backdrop-blur-sm' : 'bg-gradient-to-r from-white/90 via-white/60 to-white/90 backdrop-blur-sm'}`} />
          
          <div className="relative z-10 p-6 md:p-8 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
            <div>
              <h1 className={`text-3xl font-extrabold uppercase tracking-wide flex items-center gap-3 transition-colors duration-700 ${pageText}`}>
                <Award size={28} style={{ color: activeCategory.color }} className="transition-colors duration-500" />
                Sponsor <span style={{ color: activeCategory.color }} className="transition-colors duration-500 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">Analytics</span>
              </h1>
              <p className={`text-sm mt-2 transition-colors duration-700 ${mutedText} ml-[40px] uppercase tracking-wider`}>
                Player telemetry structured for targeted sponsor campaigns.
              </p>
            </div>

            {/* Perspective Toggle */}
            <div className={`flex flex-wrap rounded-xl p-1 shadow-inner backdrop-blur-md transition-all duration-700 ${isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-black/5 border border-black/10'}`}>
              <button
                onClick={() => setActivePerspective('performance')}
                className={`px-4 md:px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                  activePerspective === 'performance'
                    ? 'bg-[#ff2a2a] text-white shadow-[0_0_15px_rgba(255,42,42,0.6)]'
                    : isDarkMode
                      ? 'text-slate-400 hover:text-white hover:bg-white/5'
                      : 'text-slate-600 hover:text-black hover:bg-black/5'
                }`}
              >
                Performance
              </button>
              <button
                onClick={() => setActivePerspective('brand')}
                className={`px-4 md:px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                  activePerspective === 'brand'
                    ? 'bg-[#10b981] text-white shadow-[0_0_15px_rgba(16,185,129,0.6)]'
                    : isDarkMode
                      ? 'text-slate-400 hover:text-white hover:bg-white/5'
                      : 'text-slate-600 hover:text-black hover:bg-black/5'
                }`}
              >
                Brand & Clutch
              </button>
              <button
                onClick={() => setActivePerspective('mastery')}
                className={`px-4 md:px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                  activePerspective === 'mastery'
                    ? 'bg-[#0ea5e9] text-white shadow-[0_0_15px_rgba(14,165,233,0.6)]'
                    : isDarkMode
                      ? 'text-slate-400 hover:text-white hover:bg-white/5'
                      : 'text-slate-600 hover:text-black hover:bg-black/5'
                }`}
              >
                Agent Mastery
              </button>
            </div>
          </div>
        </div>

        {/* Category Selector */}
        <div className="flex flex-wrap gap-3 shrink-0">
          {CATEGORIES[activePerspective].map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                activeCategory.id === cat.id
                  ? 'bg-black text-white shadow-lg border border-transparent'
                  : isDarkMode
                    ? 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-white'
                    : 'bg-white border border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50 shadow-sm'
              }`}
              style={activeCategory.id === cat.id ? { backgroundColor: cat.color, boxShadow: `0 0 15px ${cat.color}66` } : {}}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>

        {/* Chart and Leaderboard Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Chart */}
          <div className={`lg:col-span-2 ${cardClass} rounded-2xl p-6 transition-all duration-500`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-lg font-black uppercase tracking-wide ${pageText}`}>{activeCategory.label} Distribution</h2>
              {loading && <div className="text-xs font-bold animate-pulse text-slate-400 uppercase">Updating Feed...</div>}
            </div>
            
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#ffffff15" : "#00000015"} vertical={false} />
                  <XAxis dataKey="name" stroke={isDarkMode ? "#ffffff66" : "#00000066"} tick={{ fontSize: 12, fontWeight: 'bold' }} />
                  <YAxis stroke={isDarkMode ? "#ffffff66" : "#00000066"} tick={{ fontSize: 12, fontWeight: 'bold' }} />
                  <Tooltip 
                    cursor={{ fill: isDarkMode ? '#ffffff10' : '#00000010' }}
                    contentStyle={{ 
                      backgroundColor: isDarkMode ? '#0d0d12cc' : '#ffffffcc',
                      backdropFilter: 'blur(8px)',
                      border: `1px solid ${isDarkMode ? '#ffffff20' : '#00000020'}`,
                      borderRadius: '12px',
                      color: isDarkMode ? '#fff' : '#000',
                      fontWeight: 'bold'
                    }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} animationDuration={1000}>
                    {data.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={activeCategory.color} className="transition-all duration-500 hover:opacity-80 cursor-pointer" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Leaderboard List */}
          <div className={`${cardClass} rounded-2xl p-6 flex flex-col`}>
            <h2 className={`text-lg font-black uppercase tracking-wide mb-4 ${pageText}`}>Top 10 Leaderboard</h2>
            <div className="flex-1 overflow-y-auto pr-2 space-y-3">
              {data.map((item: any, idx: number) => (
                <div 
                  key={idx}
                  className={`flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-black/30 border border-white/5 hover:border-white/20' 
                      : 'bg-white/50 border border-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white"
                      style={{ backgroundColor: activeCategory.color }}
                    >
                      {idx + 1}
                    </div>
                    <span className={`font-bold text-sm uppercase ${pageText}`}>{item.name}</span>
                  </div>
                  <span className="font-black text-sm brand-font" style={{ color: activeCategory.color }}>
                    {item.value.toLocaleString()}
                  </span>
                </div>
              ))}
              {!loading && data.length === 0 && (
                <div className="text-center text-sm font-bold text-slate-500 py-10">
                  No data available for this category.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
