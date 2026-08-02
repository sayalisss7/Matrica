import { useState } from 'react';
import axios from 'axios';
import { XCircle, Send, CheckCircle2, Bot, ShieldCheck } from 'lucide-react';

interface Proposal {
  proposal_id: number;
  brand_id: number;
  actual_offer_amount: number;
  meeting_datetime: string;
  proposal_message: string;
  status: string;
  created_at: string;
  duration_name: string;
  duration_days: number;
}

interface ProposalReviewModalProps {
  proposal: Proposal;
  onClose: () => void;
  onStatusChange: () => void;
}

export default function ProposalReviewModal({ proposal, onClose, onStatusChange }: ProposalReviewModalProps) {
  const [responseAction, setResponseAction] = useState<'ACCEPT' | 'COUNTER' | 'REJECT' | null>(null);
  const [counterMessage, setCounterMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRespond = async (action: 'ACCEPT' | 'COUNTER' | 'REJECT') => {
    setIsSubmitting(true);
    try {
      if (action === 'ACCEPT') {
        await axios.post(`https://matrica-backend.jollyplant-fd7887aa.centralindia.azurecontainerapps.io/api/sponsorships/proposals/${proposal.proposal_id}/accept`);
      } else {
        await axios.post(`https://matrica-backend.jollyplant-fd7887aa.centralindia.azurecontainerapps.io/api/sponsorships/proposals/${proposal.proposal_id}/respond`, {
          action: action,
          message: action === 'COUNTER' ? counterMessage : ''
        });
      }
      onStatusChange();
      onClose();
    } catch (err) {
      console.error("Failed to respond to proposal", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const glassPanel = "bg-[#0a0f16]/90 backdrop-blur-3xl border border-[#00e5ff]/20 shadow-[0_0_50px_rgba(0,229,255,0.1)]";
  const innerBox = "bg-black/50 border border-white/10 rounded-2xl p-5";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 page-enter">
      <div className={`relative w-full max-w-4xl max-h-[90vh] rounded-3xl ${glassPanel} flex flex-col overflow-hidden`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#00e5ff]/20 bg-black/40">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-widest flex items-center gap-3 text-white">
              <ShieldCheck className="text-[#00e5ff]" /> Incoming Offer
            </h2>
            <p className="text-sm font-bold mt-1 text-slate-400">Proposal ID: <span className="text-[#00e5ff] font-mono">{proposal.proposal_id}</span></p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <XCircle size={32} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar text-white">
          
          {/* Offer Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className={innerBox}>
               <span className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Offer Amount</span>
               <span className="text-2xl font-black text-[#00e5ff]">₹{proposal.actual_offer_amount.toLocaleString()}</span>
            </div>
            <div className={innerBox}>
               <span className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Duration</span>
               <span className="text-xl font-bold">{proposal.duration_name}</span>
            </div>
            <div className={innerBox}>
               <span className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Proposed Meeting</span>
               <span className="text-sm font-bold">{new Date(proposal.meeting_datetime).toLocaleString()}</span>
            </div>
          </div>

          {/* Proposal Message */}
          <div className={innerBox}>
            <span className="block text-[10px] font-bold uppercase text-slate-400 mb-3">Message from Brand</span>
            <div className="text-[15px] leading-relaxed text-slate-300 font-medium whitespace-pre-wrap">
              {proposal.proposal_message}
            </div>
          </div>

          {/* Action Area */}
          <div className="pt-4 border-t border-white/10">
            {responseAction === 'COUNTER' ? (
              <div className="space-y-4 page-enter">
                <label className="block text-xs font-bold uppercase text-[#00e5ff] flex items-center gap-2">
                  <Bot size={14} /> AI Counter-Offer Assistant
                </label>
                <textarea 
                  value={counterMessage}
                  onChange={e => setCounterMessage(e.target.value)}
                  placeholder="Ask for more money, better gear, or specific terms..."
                  className="w-full h-32 p-4 bg-black/40 border border-[#00e5ff]/30 text-white rounded-xl focus:border-[#00e5ff] focus:ring-1 focus:ring-[#00e5ff] transition-all"
                />
                <div className="flex gap-3">
                  <button onClick={() => setResponseAction(null)} className="flex-1 py-3 font-bold rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-800 transition-all">Cancel</button>
                  <button onClick={() => handleRespond('COUNTER')} disabled={isSubmitting} className="flex-1 py-3 font-bold rounded-xl bg-yellow-500 text-black hover:bg-yellow-400 transition-all uppercase tracking-wider flex justify-center items-center gap-2">
                    {isSubmitting ? 'Sending...' : 'Send Counter-Offer'} <Send size={16}/>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row gap-4">
                <button 
                  onClick={() => handleRespond('ACCEPT')}
                  disabled={isSubmitting}
                  className="flex-1 py-4 font-black uppercase tracking-widest rounded-2xl bg-[#00e5ff] text-black hover:bg-white transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)] flex justify-center items-center gap-2"
                >
                  <CheckCircle2 size={20} /> Accept Deal
                </button>
                <button 
                  onClick={() => setResponseAction('COUNTER')}
                  className="flex-1 py-4 font-black uppercase tracking-widest rounded-2xl border border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10 transition-all flex justify-center items-center gap-2"
                >
                  <Bot size={20} /> Counter Offer
                </button>
                <button 
                  onClick={() => handleRespond('REJECT')}
                  disabled={isSubmitting}
                  className="flex-1 py-4 font-black uppercase tracking-widest rounded-2xl border border-red-500/50 text-red-500 hover:bg-red-500/10 transition-all flex justify-center items-center gap-2"
                >
                  <XCircle size={20} /> Decline
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
