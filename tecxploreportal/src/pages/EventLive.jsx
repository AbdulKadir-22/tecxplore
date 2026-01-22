import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Layout from '../components/Layout';
import { formatTime } from '../utils/tokenValidator'; // Ensure this util exists or recreate
import { ChevronLeft, Play, StopCircle, Database, CheckCheck, Download } from 'lucide-react';

const EventLive = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    getEvent, 
    getEventParticipants, 
    loadEventDetails,
    startEvent, 
    stopEvent, 
    startParticipantTimer,
    submitAllData,
    currentUser,
    downloadCSV
  } = useApp();
  
  useEffect(() => {
    loadEventDetails(id);
  }, [id]);

  const event = getEvent(id);
  const participants = getEventParticipants(id);
  const [searchTerm, setSearchTerm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [dataSent, setDataSent] = useState(false);

  const verifiedParticipants = useMemo(() => {
    return participants
      .filter(p => p.status === 'Verified')
      .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [participants, searchTerm]);

  const handleSendData = async () => {
    setSubmitting(true);
    try {
      await submitAllData(event.id);
      setDataSent(true);
    } catch (err) {
      alert('Error submitting data. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!event) return <div className="p-8 text-white">Loading Live Console...</div>;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
            <button onClick={() => navigate('/dashboard')} className="flex items-center text-gray-500 hover:text-white text-sm font-mono">
                <ChevronLeft size={16} /> RETURN_TO_BASE
            </button>
            
            {/* Admin Export */}
            {currentUser?.role === 'SYSTEM_ADMIN' && (
                <button 
                  onClick={() => downloadCSV(event.id)}
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded text-xs font-bold"
                >
                    <Download size={14} /> EXPORT CSV
                </button>
            )}
        </div>

        {/* Master Control */}
        <div className={`relative overflow-hidden rounded-xl border p-6 mb-8 transition-all ${
          event.status === 'live'
            ? 'bg-cyan-900/10 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.1)]' 
            : event.status === 'completed'
              ? 'bg-red-900/10 border-red-900/50'
              : 'bg-[#0f172a] border-gray-800'
        }`}>
           <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                 <h1 className="text-3xl font-black text-white uppercase tracking-tight">{event.title}</h1>
                 <p className="text-gray-400 text-sm font-mono mt-1">STATUS: {event.status.toUpperCase()}</p>
              </div>

              <div className="flex items-center gap-6">
                 <div className="text-right">
                    <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">Session Duration</p>
                    <p className={`text-4xl font-mono font-bold tracking-widest ${
                        event.status === 'live' ? 'text-white' : 'text-gray-600'
                    }`}>
                        {formatTime(event.elapsedTime)}
                    </p>
                 </div>

                 {/* TOGGLE */}
                 {event.status !== 'completed' && (
                   <button 
                      onClick={() => event.status === 'live' ? stopEvent(event.id) : startEvent(event.id)}
                      className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all shadow-lg ${
                          event.status === 'live'
                              ? 'bg-red-500/10 border-red-500 text-red-500 hover:bg-red-500 hover:text-white' 
                              : 'bg-green-500/10 border-green-500 text-green-400 hover:bg-green-500 hover:text-white'
                      }`}
                   >
                      {event.status === 'live' ? <StopCircle size={28} /> : <Play size={28} className="ml-1" />}
                   </button>
                 )}
              </div>
           </div>
        </div>

        {/* Participant List Logic (Same as before but data driven) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
           {verifiedParticipants.map(p => (
             <div key={p.id} className={`bg-[#0f172a] border p-4 rounded-lg transition ${
                p.timerRunning ? 'border-cyan-500/30' : 'border-gray-800'
             }`}>
                <div className="flex justify-between items-start mb-4">
                   <div className="flex gap-3">
                      <div className="w-10 h-10 rounded bg-gray-800 flex items-center justify-center text-white font-bold text-lg border border-gray-700">
                         {p.name.charAt(0)}
                      </div>
                      <div>
                         <h4 className="text-white font-bold text-sm">{p.name}</h4>
                         <p className="text-xs text-cyan-500 font-mono">{p.id}</p>
                      </div>
                   </div>
                   {p.timerRunning && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>}
                </div>

                <div className="bg-[#020617] rounded border border-gray-800 p-3 mb-4 flex justify-between items-center">
                   <span className="text-[10px] text-gray-500 uppercase">Elapsed</span>
                   <span className={`font-mono text-xl tracking-wider ${p.timerRunning ? 'text-cyan-400' : 'text-gray-500'}`}>
                      {formatTime(p.elapsedTime)}
                   </span>
                </div>

                {event.status === 'live' ? (
                    p.timerRunning ? (
                        <div className="w-full py-2 bg-green-500/10 border border-green-500/30 text-green-400 text-center text-xs font-bold uppercase rounded tracking-widest">
                            ● Tracking Active
                        </div>
                    ) : (
                        <button 
                            onClick={() => startParticipantTimer(p.id)}
                            className="w-full py-2 bg-cyan-500/10 border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black text-xs font-bold uppercase rounded tracking-widest transition"
                        >
                            Start Timer
                        </button>
                    )
                ) : (
                    <div className="w-full py-2 bg-gray-800/50 border border-gray-700 text-gray-500 text-center text-xs font-bold uppercase rounded tracking-widest">
                        Timer Stopped
                    </div>
                )}
             </div>
           ))}
        </div>

        {/* Submit Data */}
        {event.status === 'completed' && (
            <div className="flex justify-center pb-10">
                <button 
                    onClick={handleSendData}
                    disabled={dataSent || submitting}
                    className={`flex items-center gap-3 px-8 py-4 rounded-xl font-bold uppercase tracking-wider shadow-lg transition-all ${
                        dataSent 
                        ? 'bg-green-600 text-white cursor-default' 
                        : 'bg-cyan-500 hover:bg-cyan-400 text-black hover:scale-105 disabled:opacity-50'
                    }`}
                >
                    {submitting ? 'Sending...' : dataSent ? (
                        <><CheckCheck size={20}/> Data Sent</>
                    ) : (
                        <><Database size={20}/> Send Data to DB</>
                    )}
                </button>
            </div>
        )}
      </div>
    </Layout>
  );
};

export default EventLive;