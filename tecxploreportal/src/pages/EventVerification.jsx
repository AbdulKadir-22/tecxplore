import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Layout from '../components/Layout';
import { QrCode, CheckCircle, ChevronLeft, ScanLine, XCircle, Search } from 'lucide-react';

const EventVerification = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEvent, getEventParticipants, loadEventDetails, verifyParticipant } = useApp();
  
  useEffect(() => {
    loadEventDetails(id);
  }, [id]);

  const event = getEvent(id);
  const participants = getEventParticipants(id);
  
  // Controls
  const [tokenInput, setTokenInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('Pending'); 
  const [feedback, setFeedback] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);

  // Filter the list for display (just visual)
  const filteredList = useMemo(() => {
    return participants.filter(p => {
      // Show all based on filter
      return statusFilter === 'All' ? true : p.status === statusFilter;
    });
  }, [participants, statusFilter]);

  // --- FAST VERIFY LOGIC ---
  const handleDirectVerification = async (e) => {
    e.preventDefault(); // Prevent page reload
    if (!tokenInput.trim()) return;

    setLoading(true);
    setFeedback({ type: '', msg: '' });

    // 1. Find participant locally first (to check if valid token)
    const targetParticipant = participants.find(p => p.token === tokenInput.trim());

    if (!targetParticipant) {
      setFeedback({ type: 'error', msg: 'INVALID TOKEN: Participant not found.' });
      setLoading(false);
      return;
    }

    if (targetParticipant.status === 'Verified') {
      setFeedback({ type: 'error', msg: `ALREADY VERIFIED: ${targetParticipant.name}` });
      setTokenInput(''); // Clear to allow next scan
      setLoading(false);
      return;
    }

    // 2. Call API
    try {
      await verifyParticipant(tokenInput.trim(), event.id);
      setFeedback({ type: 'success', msg: `SUCCESS: ${targetParticipant.name} Verified!` });
      setTokenInput(''); // Ready for next scan
    } catch (err) {
      setFeedback({ type: 'error', msg: 'Verification Failed. Server Error.' });
    } finally {
      setLoading(false);
    }
  };

  if (!event) return <div className="p-8 text-white">Loading Event Data...</div>;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <button onClick={() => navigate('/dashboard')} className="flex items-center text-gray-500 hover:text-white mb-4 text-sm">
          <ChevronLeft size={16} /> Back to Dashboard
        </button>
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ScanLine className="text-cyan-400" />
            Verification Station
          </h1>
          <p className="text-gray-400 text-sm mt-1">{event.title}</p>
        </div>

        {/* --- MAIN ACTION AREA: TOKEN SCANNER --- */}
        <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 shadow-xl mb-8">
          <form onSubmit={handleDirectVerification} className="flex flex-col md:flex-row gap-4">
             <div className="relative flex-1">
                <QrCode className="absolute left-4 top-3.5 text-cyan-400" size={20} />
                <input 
                  type="text" 
                  placeholder="ENTER TOKEN HERE..." 
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  className="w-full bg-[#0f172a] border border-gray-600 rounded-lg pl-12 pr-4 py-3 text-white focus:border-cyan-500 outline-none font-mono tracking-wider text-lg shadow-inner"
                  autoFocus
                />
             </div>
             <button 
               type="submit"
               disabled={loading || !tokenInput}
               className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-8 py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
             >
               {loading ? 'Verifying...' : 'VERIFY NOW'}
             </button>
          </form>

          {/* Feedback Message */}
          {feedback.msg && (
            <div className={`mt-4 p-3 rounded-lg text-center font-bold border ${
              feedback.type === 'success' 
                ? 'bg-green-900/20 text-green-400 border-green-900' 
                : 'bg-red-900/20 text-red-400 border-red-900'
            }`}>
               {feedback.msg}
            </div>
          )}
        </div>

        {/* --- LIST VIEW (For visual confirmation) --- */}
        <div className="flex justify-between items-end mb-4 border-b border-gray-800 pb-2">
           <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider">Participant List</h3>
           <div className="flex gap-2">
             {['Pending', 'Verified', 'All'].map(s => (
               <button
                 key={s}
                 onClick={() => setStatusFilter(s)}
                 className={`px-3 py-1 rounded text-[10px] font-bold uppercase border transition ${
                   statusFilter === s ? 'bg-gray-700 text-white border-gray-600' : 'text-gray-500 border-transparent hover:text-gray-300'
                 }`}
               >
                 {s}
               </button>
             ))}
           </div>
        </div>

        <div className="space-y-3">
           {filteredList.length === 0 && (
             <div className="text-center py-12 border border-dashed border-gray-800 rounded-lg">
               <p className="text-gray-500 text-sm">No participants in '{statusFilter}' list.</p>
             </div>
           )}

          {filteredList.map(p => (
            <div 
              key={p.id} 
              className={`p-4 rounded-lg border flex justify-between items-center transition ${
                p.status === 'Verified' 
                  ? 'bg-purple-900/10 border-purple-900/30 opacity-70' 
                  : 'bg-[#1e293b] border-gray-800'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg ${
                    p.status === 'Verified' ? 'bg-purple-900' : 'bg-gray-700'
                }`}>
                  {p.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-white font-bold">{p.name}</h4>
                  {/* <div className="flex gap-2 text-xs font-mono mt-0.5">
                    <span className="text-cyan-600">{p.token}</span>
                    <span className="text-gray-600">|</span>
                    <span className="text-gray-500">{p.id}</span>
                  </div> */}
                </div>
              </div>
              
              <div className="text-right">
                {p.status === 'Verified' ? (
                  <span className="flex items-center gap-1 text-purple-400 text-xs font-bold bg-purple-900/20 px-3 py-1 rounded-full">
                    <CheckCircle size={14} /> Verified
                  </span>
                ) : (
                  <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest bg-gray-800 px-2 py-1 rounded">
                    Waiting
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </Layout>
  );
};

export default EventVerification;