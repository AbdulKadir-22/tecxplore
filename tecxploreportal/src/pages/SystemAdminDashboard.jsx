import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Layout from '../components/Layout';
import { Download, ChevronRight, Users, CheckCircle, Clock, Activity } from 'lucide-react';

const SystemAdminDashboard = () => {
  const { events, downloadCSV, currentUser } = useApp();
  const navigate = useNavigate();

  // Safety check: redirect if not admin
  if (currentUser?.role !== 'SYSTEM_ADMIN') {
    return <div className="p-10 text-white text-center">ACCESS DENIED. ADMIN ONLY.</div>;
  }

  // Helper to handle CSV download
  const handleDownload = async (e, eventId) => {
    e.stopPropagation(); // Prevent row click
    try {
      await downloadCSV(eventId);
    } catch (error) {
      alert("Failed to download CSV. Check console.");
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase">
              System <span className="text-blue-500">Admin</span> Console
            </h2>
            <p className="text-gray-400 text-sm mt-1 font-mono">OVERVIEW OF ALL EVENTS</p>
          </div>
        </div>

        {/* --- EVENTS TABLE --- */}
        <div className="bg-[#1e293b] rounded-xl border border-gray-700 overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 p-4 bg-[#0f172a] border-b border-gray-700 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <div className="col-span-4">Event Name</div>
            <div className="col-span-2 text-center">Participants</div>
            <div className="col-span-2 text-center">Verified</div>
            <div className="col-span-2 text-center">Status</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-gray-700">
            {events.map((event) => {
              const stats = event.stats || { total: 0, verified: 0, pending: 0 };
              
              return (
                <div 
                  key={event.id}
                  onClick={() => navigate(`/admin/event/${event.id}`)}
                  className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-800/50 transition cursor-pointer group"
                >
                  {/* Event Name & Category */}
                  <div className="col-span-4">
                    <h3 className="text-white font-bold text-sm group-hover:text-blue-400 transition-colors">
                      {event.title || event.name || "Untitled Event"}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded border border-gray-600">
                        {event.category}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">{event.eventId}</span>
                    </div>
                  </div>

                  {/* Total Participants */}
                  <div className="col-span-2 text-center">
                    <span className="text-gray-300 font-mono text-sm">{stats.total}</span>
                  </div>

                  {/* Verified Count */}
                  <div className="col-span-2 text-center">
                     <span className="text-green-400 font-mono text-sm font-bold">{stats.verified}</span>
                     <span className="text-gray-600 text-[10px] ml-1">/ {stats.total}</span>
                  </div>

                  {/* Status Badge */}
                  <div className="col-span-2 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${
                       event.status === 'live' 
                         ? 'bg-red-500/10 text-red-400 border-red-500/50 animate-pulse' 
                         : event.status === 'completed'
                         ? 'bg-blue-500/10 text-blue-400 border-blue-500/50'
                         : 'bg-gray-700 text-gray-400 border-gray-600'
                    }`}>
                       {event.status === 'live' && <Activity size={10} />}
                       {event.status}
                    </span>
                  </div>

                  {/* Actions (CSV) */}
                  <div className="col-span-2 flex justify-end gap-2">
                    <button 
                      onClick={(e) => handleDownload(e, event.id)}
                      className="p-2 bg-gray-700 hover:bg-green-600 hover:text-white text-gray-300 rounded transition border border-gray-600"
                      title="Download CSV"
                    >
                      <Download size={16} />
                    </button>
                    <button className="p-2 text-gray-500 group-hover:text-white transition">
                       <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              );
            })}

            {events.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                No events found.
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SystemAdminDashboard;