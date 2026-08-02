import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Send, XCircle, Sparkles, Wand2, Briefcase, Zap, Gamepad2, CheckCircle2, Loader2, Video, AlertCircle } from 'lucide-react';

interface Duration {
  duration_id: number;
  name: string;
  duration_days: number;
}

interface AiScore {
  "Proposal Strength": number;
  "Professionalism": number;
  "Clarity": number;
  "Negotiation": number;
  "Brand Alignment": number;
  "Chance of Positive Reply": number;
}

interface SponsorshipBookingAgentProps {
  player: any;
  onClose: () => void;
  isDarkMode: boolean; // Keeping prop to avoid breaking parent, but ignoring it for styling to force dark glass theme
}

export default function SponsorshipBookingAgent({ player, onClose }: SponsorshipBookingAgentProps) {
  const [durations, setDurations] = useState<Duration[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [budgetRange, setBudgetRange] = useState<{min_budget: number, max_budget: number, base_value: number} | null>(null);
  
  const [meetingMode, setMeetingMode] = useState<'manual' | 'ai'>('ai');
  const [meetingDate, setMeetingDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [aiSlots, setAiSlots] = useState<{time: string, label: string}[]>([]);
  const [meetingDuration, setMeetingDuration] = useState<number>(30);
  const [meetingType, setMeetingType] = useState<string>('Google Meet');
  const [loadingCalendar, setLoadingCalendar] = useState(false);

  const [message, setMessage] = useState<string>('');
  const [generatingMessage, setGeneratingMessage] = useState(false);
  const [aiScore, setAiScore] = useState<AiScore | null>(null);
  const [loadingScore, setLoadingScore] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [proposalId, setProposalId] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    axios.get('https://matrica-backend.jollyplant-fd7887aa.centralindia.azurecontainerapps.io/api/sponsorships/durations')
      .then(res => {
        setDurations(res.data);
        if (res.data.length > 0) {
          setSelectedDuration(res.data[0].duration_id);
        }
      })
      .catch(err => {
        console.error("Failed to load durations", err);
        const fallbacks = [
          { duration_id: 1, name: "1 Month", duration_days: 30 },
          { duration_id: 2, name: "3 Months", duration_days: 90 },
          { duration_id: 3, name: "1 Tournament", duration_days: 14 }
        ];
        setDurations(fallbacks);
        setSelectedDuration(fallbacks[0].duration_id);
      });
  }, []);

  useEffect(() => {
    if (selectedDuration && player?.player_id) {
      axios.get(`https://matrica-backend.jollyplant-fd7887aa.centralindia.azurecontainerapps.io/api/sponsorships/players/${player.player_id}/budget-range?duration_id=${selectedDuration}`)
        .then(res => {
          setBudgetRange({ 
             min_budget: res.data.min_budget, 
             max_budget: res.data.max_budget, 
             base_value: res.data.base_value 
          });
        })
        .catch(err => {
          console.error("Failed to get budget from database. Please ensure DB is running.", err);
          // Set to null to show loading or error state, absolutely no fake data
          setBudgetRange(null);
        });
    }
  }, [selectedDuration, player]);

  // Initial AI Proposal Generation
  useEffect(() => {
    if (player?.player_id && !message) {
      setGeneratingMessage(true);
      axios.post(`https://matrica-backend.jollyplant-fd7887aa.centralindia.azurecontainerapps.io/api/sponsorships/players/${player.player_id}/generate-proposal`, {
        player_name: player.name || 'Player',
        tone: 'Professional',
        current_draft: ''
      }).then(res => {
        setMessage(res.data.draft);
      }).catch(err => console.error("Generation failed", err))
        .finally(() => setGeneratingMessage(false));
    }
  }, [player]);

  // Debounced AI Scoring
  useEffect(() => {
    if (!message || message.length < 50) return;
    const timeoutId = setTimeout(() => {
      setLoadingScore(true);
      axios.post(`https://matrica-backend.jollyplant-fd7887aa.centralindia.azurecontainerapps.io/api/sponsorships/players/${player.player_id}/score-proposal`, {
        proposal_text: message,
        player_name: player.name || 'Player',
        offer_amount: budgetRange?.base_value || 0
      }).then(res => {
        setAiScore(res.data.scores);
      }).catch(console.error)
      .finally(() => setLoadingScore(false));
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [message, budgetRange, player]);

  const handleAiEdit = (tone: string) => {
    if (!message) return;
    setGeneratingMessage(true);
    axios.post(`https://matrica-backend.jollyplant-fd7887aa.centralindia.azurecontainerapps.io/api/sponsorships/players/${player.player_id}/generate-proposal`, {
      player_name: player.name || 'Player',
      tone: tone,
      current_draft: message
    }).then(res => {
      setMessage(res.data.draft);
    }).finally(() => setGeneratingMessage(false));
  };

  const handleFindBestTime = () => {
    setLoadingCalendar(true);
    axios.post(`https://matrica-backend.jollyplant-fd7887aa.centralindia.azurecontainerapps.io/api/sponsorships/players/${player.player_id}/calendar-match`, {
      duration_minutes: meetingDuration
    }).then(res => {
      setAiSlots(res.data.slots);
      if (res.data.slots.length > 0) setSelectedSlot(res.data.slots[0].time);
      setMeetingMode('ai');
    }).finally(() => setLoadingCalendar(false));
  };

  const insertSuggestion = (text: string) => {
    setMessage(prev => prev + (prev.endsWith(' ') || prev.endsWith('\n') ? '' : ' ') + text + '. ');
  };

  const validate = () => {
    const errors = [];
    if (!selectedDuration) errors.push("Duration is required.");
    if (meetingMode === 'manual' && !meetingDate) errors.push("Meeting time is required.");
    if (meetingMode === 'ai' && !selectedSlot) errors.push("Please select a meeting time or use the manual calendar.");
    if (!message || message.length < 120) errors.push("Proposal message is too short (min 120 characters).");
    if (message.length > 3000) errors.push("Proposal message is too long (max 3000 characters).");
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validate();
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors([]);
    setIsSubmitting(true);
    
    try {
      const finalMeetingTime = meetingMode === 'ai' ? selectedSlot : meetingDate;
      const res = await axios.post(`https://matrica-backend.jollyplant-fd7887aa.centralindia.azurecontainerapps.io/api/sponsorships/players/${player.player_id}/proposals`, {
        brand_id: 1, 
        duration_id: selectedDuration,
        actual_offer_amount: budgetRange?.base_value || 0,
        meeting_datetime: finalMeetingTime,
        proposal_message: message
      });
      setProposalId(`SP-${new Date().getFullYear()}-00${res.data.proposal_id || Math.floor(Math.random()*1000)}`);
      setSubmitted(true);
    } catch (err: any) {
      setValidationErrors([err.response?.data?.detail || "Failed to submit proposal"]);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Enforced Premium Dark Glass Theme
  const glassPanel = "bg-[#060913]/80 backdrop-blur-3xl border border-[#00e5ff]/20 shadow-[0_0_60px_rgba(0,229,255,0.15)]";
  const innerBox = "bg-black/50 border border-[#00e5ff]/15 rounded-2xl";
  const inputStyle = "bg-black/40 border border-[#00e5ff]/20 text-white placeholder-slate-500 focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff] transition-all";
  const textPrimary = "text-white";
  const textMuted = "text-slate-400";

  if (submitted) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 page-enter">
        <div className={`relative w-full max-w-2xl p-10 rounded-3xl ${glassPanel} flex flex-col items-center text-center`}>
          <div className="mb-6 flex justify-center text-[#00e5ff] animate-bounce"><CheckCircle2 size={64} /></div>
          <h2 className={`text-3xl font-black uppercase tracking-widest mb-4 ${textPrimary}`}>Proposal Successfully Submitted</h2>
          
          <div className={`w-full p-6 rounded-2xl mb-8 flex flex-col gap-3 text-left ${innerBox}`}>
             <div className="flex justify-between items-center"><span className={`${textMuted} text-sm`}>Proposal ID</span><span className={`${textPrimary} font-bold font-mono`}>{proposalId}</span></div>
             <div className="flex justify-between items-center"><span className={`${textMuted} text-sm`}>Meeting Scheduled</span><span className={`${textPrimary} font-bold flex items-center gap-2`}><Video size={14}/> {meetingType}</span></div>
             <div className="flex justify-between items-center"><span className={`${textMuted} text-sm`}>Calendar Invitation</span><span className="font-bold text-[#00e5ff]">Sent to {player.name}</span></div>
             <div className="flex justify-between items-center"><span className={`${textMuted} text-sm`}>Estimated Response Time</span><span className={`${textPrimary} font-bold`}>2–5 Business Days</span></div>
          </div>
          
          <button onClick={onClose} className="w-full py-4 rounded-xl bg-[#00e5ff] text-black font-black uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:shadow-[0_0_30px_rgba(0,229,255,0.8)]">
            Close Workspace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-2 md:p-6 page-enter">
      <div className={`relative w-full max-w-[1400px] h-full md:h-[90vh] rounded-3xl ${glassPanel} flex flex-col overflow-hidden`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#00e5ff]/20 bg-black/40">
          <div>
            <h2 className={`text-2xl font-black uppercase tracking-widest flex items-center gap-3 ${textPrimary}`}>
              <Sparkles className="text-[#00e5ff]" /> AI Sponsorship Proposal Agent
            </h2>
            <p className={`text-sm font-bold mt-1 ${textMuted}`}>Sending Proposal To <span className="text-[#00e5ff]">{player.name}</span></p>
          </div>
          <button onClick={onClose} className={`${textMuted} hover:text-white transition-colors`}>
            <XCircle size={32} />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          
          {/* Left Column - Configuration */}
          <div className="w-full lg:w-[400px] xl:w-[450px] overflow-y-auto p-6 border-r border-[#00e5ff]/20 space-y-8 custom-scrollbar">
            
            {/* 1. Duration */}
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-3 opacity-80 ${textPrimary}`}>1. Sponsorship Duration</label>
              <div className="relative">
                <select 
                  value={selectedDuration || ''} 
                  onChange={e => setSelectedDuration(parseInt(e.target.value))}
                  className={`w-full rounded-xl p-4 font-bold appearance-none cursor-pointer ${inputStyle}`}
                >
                  {durations.map(d => (
                    <option key={d.duration_id} value={d.duration_id} className="bg-slate-900 text-white">{d.name}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#00e5ff]">
                   <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            {/* 2. Amount */}
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-3 opacity-80 ${textPrimary}`}>
                2. Base Investment Value
              </label>
              {budgetRange ? (
                <div className={`p-5 flex items-center justify-between ${innerBox} bg-gradient-to-r from-[#00e5ff]/10 to-transparent`}>
                  <div>
                     <span className={`block text-[10px] font-bold uppercase ${textMuted}`}>Estimated Player Value</span>
                     <span className="text-2xl font-black text-[#00e5ff] tracking-tight">₹{budgetRange.base_value.toLocaleString()}</span>
                  </div>
                  <div className="text-right">
                     <span className={`block text-[10px] font-bold uppercase ${textMuted}`}>Range</span>
                     <span className={`text-sm font-bold ${textPrimary}`}>₹{budgetRange.min_budget.toLocaleString()} – ₹{budgetRange.max_budget.toLocaleString()}</span>
                  </div>
                </div>
              ) : (
                <div className={`p-5 flex items-center gap-3 ${innerBox} ${textMuted}`}>
                  <Loader2 size={18} className="animate-spin text-[#00e5ff]" /> Fetching base value...
                </div>
              )}
              <p className={`mt-3 text-xs font-bold flex items-center gap-1.5 ${textMuted}`}>
                <AlertCircle size={14} className="text-[#00e5ff]" /> Final amount will be discussed during the call.
              </p>
            </div>

            {/* 3. Calendar Agent */}
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-3 opacity-80 ${textPrimary}`}>3. Meeting Schedule</label>
              
              <div className={`p-5 ${innerBox}`}>
                <div className="flex gap-2 mb-5 p-1 bg-black/60 rounded-xl border border-white/5">
                  <button onClick={() => {setMeetingMode('ai'); if(aiSlots.length === 0) handleFindBestTime();}} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${meetingMode === 'ai' ? 'bg-[#00e5ff] text-black shadow-[0_0_15px_rgba(0,229,255,0.4)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                    <Sparkles size={14} className="inline mr-1.5 mb-0.5"/> AI Agent
                  </button>
                  <button onClick={() => setMeetingMode('manual')} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${meetingMode === 'manual' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                    <Calendar size={14} className="inline mr-1.5 mb-0.5"/> Manual
                  </button>
                </div>

                {meetingMode === 'ai' ? (
                  <div className="space-y-3">
                    {loadingCalendar ? (
                      <div className={`py-8 flex flex-col items-center justify-center ${textMuted}`}>
                        <Loader2 className="animate-spin mb-3 text-[#00e5ff]" size={28} />
                        <span className="text-sm font-bold">Scanning calendars...</span>
                      </div>
                    ) : aiSlots.length > 0 ? (
                      <div className="space-y-2">
                        {aiSlots.map(slot => (
                          <button 
                            key={slot.time}
                            onClick={() => setSelectedSlot(slot.time)}
                            className={`w-full p-4 rounded-xl border text-left flex justify-between items-center transition-all ${selectedSlot === slot.time ? 'bg-[#00e5ff]/15 border-[#00e5ff] text-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.1)]' : 'bg-black/40 border-white/10 text-slate-300 hover:border-[#00e5ff]/50 hover:bg-[#00e5ff]/5'}`}
                          >
                            <span className="font-bold">{slot.label}</span>
                            {selectedSlot === slot.time && <CheckCircle2 size={18} />}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <button onClick={handleFindBestTime} className={`w-full py-4 rounded-xl border border-dashed flex items-center justify-center gap-2 font-bold transition-all border-slate-600 text-slate-400 hover:border-[#00e5ff] hover:text-[#00e5ff] hover:bg-[#00e5ff]/5`}>
                        <Sparkles size={18} /> Find Best Time
                      </button>
                    )}
                  </div>
                ) : (
                  <div>
                    <input type="datetime-local" value={meetingDate} onChange={e => setMeetingDate(e.target.value)} className={`w-full p-4 rounded-xl ${inputStyle}`} />
                  </div>
                )}
                
                <div className="mt-5 pt-5 border-t border-white/5 grid grid-cols-2 gap-4">
                  <div>
                    <label className={`text-[10px] font-bold uppercase block mb-1.5 ${textMuted}`}>Duration</label>
                    <div className="relative">
                       <select value={meetingDuration} onChange={e => setMeetingDuration(Number(e.target.value))} className={`w-full p-3 text-sm rounded-lg appearance-none cursor-pointer ${inputStyle}`}>
                         <option value={15} className="bg-slate-900 text-white">15 mins</option>
                         <option value={30} className="bg-slate-900 text-white">30 mins</option>
                         <option value={45} className="bg-slate-900 text-white">45 mins</option>
                         <option value={60} className="bg-slate-900 text-white">1 Hour</option>
                       </select>
                       <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                       </div>
                    </div>
                  </div>
                  <div>
                    <label className={`text-[10px] font-bold uppercase block mb-1.5 ${textMuted}`}>Type</label>
                    <div className="relative">
                      <select value={meetingType} onChange={e => setMeetingType(e.target.value)} className={`w-full p-3 text-sm rounded-lg appearance-none cursor-pointer ${inputStyle}`}>
                        <option value="Google Meet" className="bg-slate-900 text-white">Google Meet</option>
                        <option value="Zoom" className="bg-slate-900 text-white">Zoom</option>
                        <option value="Microsoft Teams" className="bg-slate-900 text-white">Teams</option>
                        <option value="Discord" className="bg-slate-900 text-white">Discord</option>
                        <option value="Phone Call" className="bg-slate-900 text-white">Phone Call</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                         <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
               <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl space-y-1.5">
                 {validationErrors.map((err, i) => (
                   <div key={i} className="text-red-400 text-sm font-bold flex items-start gap-2">
                     <XCircle size={16} className="shrink-0 mt-0.5" /> <span>{err}</span>
                   </div>
                 ))}
               </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 bg-[#00e5ff] text-black hover:bg-white hover:shadow-[0_0_30px_rgba(0,229,255,0.6)] ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
              {isSubmitting ? 'Processing...' : 'Submit Proposal'}
            </button>
            
          </div>

          {/* Right Column - AI Message Workspace */}
          <div className="flex-1 p-6 flex flex-col bg-black/20 overflow-y-auto custom-scrollbar relative">
            
            <div className="flex justify-between items-center mb-4">
              <label className={`text-xs font-bold uppercase tracking-wider opacity-80 flex items-center gap-2 ${textPrimary}`}>
                 <Wand2 size={14} className="text-[#00e5ff]"/> 4. AI Proposal Assistant
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  {label: 'Professional', icon: <Briefcase size={12}/>}, 
                  {label: 'Luxury Brand', icon: <Sparkles size={12}/>}, 
                  {label: 'Gaming', icon: <Gamepad2 size={12}/>}, 
                  {label: 'Executive', icon: <Zap size={12}/>}
                ].map(tone => (
                  <button 
                    key={tone.label}
                    onClick={() => handleAiEdit(tone.label)}
                    disabled={generatingMessage}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all bg-[#00e5ff]/5 border border-[#00e5ff]/20 text-[#00e5ff] hover:bg-[#00e5ff]/20 hover:text-white hover:border-[#00e5ff]/50"
                  >
                    {tone.icon} {tone.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative flex-1 min-h-[300px] mb-6 group">
              {generatingMessage && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm rounded-2xl border border-[#00e5ff]/30">
                  <Wand2 className="animate-spin text-[#00e5ff] mb-4" size={36} />
                  <span className="font-bold text-white tracking-wide">AI is generating your proposal...</span>
                </div>
              )}
              <textarea 
                value={message}
                onChange={e => setMessage(e.target.value)}
                className={`w-full h-full p-6 font-medium text-[15px] leading-relaxed resize-none shadow-inner custom-scrollbar rounded-2xl ${inputStyle} group-hover:border-[#00e5ff]/40`}
                placeholder="AI is preparing your proposal..."
              />
            </div>

            {/* AI Suggestions */}
            <div className="mb-8">
              <label className={`text-[10px] font-bold uppercase tracking-wider block mb-3 ${textMuted}`}>AI Content Suggestions</label>
              <div className="flex flex-wrap gap-2.5">
                {["Mention tournament goals", "Mention content creation", "Mention jersey branding", "Mention long-term partnership"].map(sug => (
                  <button 
                    key={sug}
                    onClick={() => insertSuggestion(sug)}
                    className="px-3.5 py-1.5 rounded-full text-[11px] font-bold transition-all border border-white/10 text-slate-300 hover:border-[#00e5ff]/50 hover:bg-[#00e5ff]/10 hover:text-[#00e5ff] shadow-sm bg-black/40"
                  >
                    + {sug}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Proposal Score Panel */}
            {(aiScore || loadingScore) && (
              <div className={`p-6 ${innerBox} relative overflow-hidden bg-gradient-to-br from-black/80 to-[#00e5ff]/5`}>
                 {loadingScore && <div className="absolute top-0 left-0 w-full h-1 bg-[#00e5ff] animate-pulse"></div>}
                 
                 <div className="flex justify-between items-center mb-5">
                    <h3 className={`text-sm font-black uppercase tracking-widest flex items-center gap-2 ${textPrimary}`}>
                      <Sparkles size={16} className="text-[#00e5ff]"/> Proposal AI Score
                    </h3>
                    {aiScore && <span className="text-3xl font-black brand-font text-[#00e5ff] tracking-tighter drop-shadow-[0_0_10px_rgba(0,229,255,0.4)]">{aiScore["Proposal Strength"]}%</span>}
                 </div>

                 {aiScore ? (
                   <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                      {[
                        {label: "Professionalism", key: "Professionalism"},
                        {label: "Clarity", key: "Clarity"},
                        {label: "Negotiation", key: "Negotiation"},
                        {label: "Brand Alignment", key: "Brand Alignment"},
                        {label: "Positive Reply Chance", key: "Chance of Positive Reply"},
                      ].map(metric => (
                        <div key={metric.key}>
                          <div className="flex justify-between text-[11px] font-bold uppercase mb-2">
                            <span className={textMuted}>{metric.label}</span>
                            <span className={textPrimary}>{aiScore[metric.key as keyof AiScore]}%</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                            <div 
                              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-[#00e5ff] transition-all duration-700 ease-out relative"
                              style={{width: `${aiScore[metric.key as keyof AiScore]}%`}}
                            >
                                <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/30 blur-[2px]"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                   </div>
                 ) : (
                   <div className={`py-6 text-center text-sm font-bold flex items-center justify-center gap-3 ${textMuted}`}>
                     <Loader2 size={18} className="animate-spin text-[#00e5ff]" /> Analyzing proposal dynamics...
                   </div>
                 )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
