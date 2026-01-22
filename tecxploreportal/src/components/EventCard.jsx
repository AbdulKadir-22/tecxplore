import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Play } from 'lucide-react';

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  // Safety: Ensure stats object exists (handled in AppContext, but good to be safe)
  const stats = event.stats || { total: 0, verified: 0, review: 0, pending: 0 };

  return (
    <div className="bg-[#1e293b] rounded-xl p-5 border border-gray-800 hover:border-gray-600 transition-all shadow-lg flex flex-col h-full relative group">
      <div className="flex justify-between items-start mb-3">
        {/* --- FIX 1: Use 'name' from backend, fallback to 'title' --- */}
        <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-cyan-400 transition-colors">
            {event.name || event.title || "Untitled Event"}
        </h3>
        
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${
          event.status === 'live' ? 'bg-purple-900/40 text-purple-300 border-purple-500' : 'bg-gray-800 text-gray-400 border-gray-700'
        }`}>
          {event.status || 'UPCOMING'}
        </span>
      </div>
      
      {/* --- FIX 2: Backend has no description, so we display the ID or Category instead --- */}
      <p className="text-gray-400 text-xs mb-4 flex-1">
        {event.description || `Category: ${event.category}`}
      </p>
      
      {/* Stats Grid */}
      {/* <div className="grid grid-cols-3 gap-2 text-center bg-[#0f172a] rounded p-2 mb-4">
        <div><p className="text-white font-bold">{stats.verified}</p><p className="text-[10px] text-gray-500 uppercase">Verified</p></div>
        <div><p className="text-blue-400 font-bold">{stats.review}</p><p className="text-[10px] text-gray-500 uppercase">Review</p></div>
        <div><p className="text-gray-400 font-bold">{stats.total}</p><p className="text-[10px] text-gray-500 uppercase">Total</p></div>
      </div> */}

      <div className="grid grid-cols-2 gap-3 mt-auto">
        <button 
          onClick={() => navigate(`/event/verification/${event.id}`)}
          className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded text-xs font-bold transition"
        >
          <ShieldCheck size={14} /> Verify
        </button>
        <button 
          onClick={() => navigate(`/event/live/${event.id}`)}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded text-xs font-bold transition"
        >
          <Play size={14} /> Monitor
        </button>
      </div>
    </div>
  );
};

export default EventCard;