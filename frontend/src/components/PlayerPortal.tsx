import { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Inbox, RefreshCw, Activity, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import ProposalReviewModal from './ProposalReviewModal';

export default function PlayerPortal() {
  const [players, setPlayers] = useState<any[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<any | null>(null);

  // Mock fetching available players to simulate login
  useEffect(() => {
    // We don't have a direct endpoint for all players, but we can hardcode some top ones for demo
    setPlayers([
      { player_id: 1, name: 'TenZ' },
      { player_id: 2, name: 'Demon1' },
      { player_id: 3, name: 'Boaster' },
      { player_id: 4, name: 'Aspas' }
    ]);
    setSelectedPlayerId(3); // Default to Boaster for demo
  }, []);

  const fetchProposals = async () => {
    if (!selectedPlayerId) return;
    setLoading(true);
    try {
      const res = await axios.get(`https://matrica-backend.jollyplant-fd7887aa.centralindia.azurecontainerapps.io/api/sponsorships/players/${selectedPlayerId}/proposals`);
      setProposals(res.data);
    } catch (err) {
      console.error("Failed to fetch proposals", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, [selectedPlayerId]);

  const glassPanel = "bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl";
  
  return (
    <div className="min-h-screen bg-[#060913] text-white pt-24 pb-12 px-6 page-enter">
      <div className="max-w-6xl mx-auto">
        
        {/* Header / Mock Login */}
        <div className={`p-6 rounded-3xl ${glassPanel} mb-8 flex justify-between items-center`}>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-widest flex items-center gap-3">
              <User className="text-[#00e5ff]" size={28}/> Player Portal
            </h1>
            <p className="text-slate-400 mt-2 font-bold text-sm">View and negotiate incoming sponsorship offers.</p>
          </div>
          <div className="flex items-center gap-4">
             <span className="text-xs font-bold uppercase text-slate-500">Simulate Login As:</span>
             <select 
               value={selectedPlayerId || ''}
               onChange={e => setSelectedPlayerId(Number(e.target.value))}
               className="bg-black/50 border border-[#00e5ff]/30 rounded-xl px-4 py-2 font-bold focus:border-[#00e5ff] outline-none"
             >
               {players.map(p => (
                 <option key={p.player_id} value={p.player_id}>{p.name}</option>
               ))}
             </select>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Stats */}
          <div className="space-y-6">
            <div className={`p-6 rounded-3xl ${glassPanel}`}>
               <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                 <Activity size={16}/> Overview
               </h3>
               <div className="space-y-4">
                 <div className="bg-white/5 rounded-2xl p-4 flex justify-between items-center">
                   <span className="text-xs font-bold uppercase text-slate-400">Total Offers</span>
                   <span className="text-2xl font-black">{proposals.length}</span>
                 </div>
                 <div className="bg-[#00e5ff]/5 border border-[#00e5ff]/20 rounded-2xl p-4 flex justify-between items-center">
                   <span className="text-xs font-bold uppercase text-[#00e5ff]">Pending Review</span>
                   <span className="text-2xl font-black text-[#00e5ff]">
                     {proposals.filter(p => p.status === 'PENDING_PLAYER_REVIEW').length}
                   </span>
                 </div>
               </div>
            </div>
            
            <div className={`p-6 rounded-3xl ${glassPanel} bg-gradient-to-br from-black/60 to-[#00e5ff]/5`}>
               <h3 className="text-sm font-black uppercase tracking-widest text-[#00e5ff] mb-4 flex items-center gap-2">
                 <Sparkles size={16}/> AI Negotiation
               </h3>
               <p className="text-sm text-slate-300 leading-relaxed font-medium">
                 Use the AI Counter-Offer Assistant to automatically generate responses to brands. Ask for gear, higher compensation, or specific terms with one click.
               </p>
            </div>
          </div>

          {/* Right Column - Proposals List */}
          <div className={`lg:col-span-2 p-6 rounded-3xl ${glassPanel} min-h-[500px]`}>
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                 <Inbox size={16} className="text-[#00e5ff]"/> Incoming Proposals
               </h3>
               <button onClick={fetchProposals} className="text-slate-400 hover:text-white transition-colors">
                 <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
               </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64 text-[#00e5ff]">
                <Loader2 size={32} className="animate-spin" />
              </div>
            ) : proposals.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                <Inbox size={48} className="mb-4 opacity-50" />
                <p className="font-bold">No incoming proposals found.</p>
                <p className="text-sm">Wait for brands to send you offers.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {proposals.map(prop => (
                  <div 
                    key={prop.proposal_id} 
                    className="group bg-black/40 border border-white/5 rounded-2xl p-5 hover:border-[#00e5ff]/50 hover:bg-[#00e5ff]/5 transition-all cursor-pointer relative overflow-hidden"
                    onClick={() => setSelectedProposal(prop)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-xs font-black uppercase tracking-widest text-[#00e5ff]">Brand #{prop.brand_id}</span>
                          <span className="text-[10px] text-slate-500 font-bold">{new Date(prop.created_at).toLocaleDateString()}</span>
                        </div>
                        <h4 className="text-xl font-black">Offer: ₹{prop.actual_offer_amount.toLocaleString()}</h4>
                      </div>
                      
                      {/* Status Badge */}
                      {prop.status === 'PENDING_PLAYER_REVIEW' && <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">Action Required</span>}
                      {prop.status === 'PLAYER_MODIFIED' && <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">Countered</span>}
                      {prop.status === 'ACCEPTED' && <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1"><CheckCircle2 size={12}/> Locked</span>}
                      {prop.status === 'DECLINED' && <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">Declined</span>}
                    </div>
                    
                    <p className="text-sm text-slate-400 line-clamp-2 pr-12">
                      {prop.proposal_message}
                    </p>
                    
                    <div className="absolute right-5 bottom-5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[#00e5ff] text-xs font-black uppercase tracking-widest flex items-center gap-1">Review <ArrowRight size={14} /></span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {selectedProposal && (
        <ProposalReviewModal 
          proposal={selectedProposal} 
          onClose={() => setSelectedProposal(null)} 
          onStatusChange={fetchProposals}
        />
      )}
    </div>
  );
}

// ArrowRight needed to be imported
function ArrowRight(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12h14"></path>
      <path d="m12 5 7 7-7 7"></path>
    </svg>
  );
}
