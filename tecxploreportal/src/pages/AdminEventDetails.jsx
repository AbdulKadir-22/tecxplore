import React, { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Layout from '../components/Layout';
import { Download, ChevronLeft, Calendar, UserCheck, Clock, List } from 'lucide-react';
import { formatTime } from '../utils/tokenValidator'; // Ensure you have this util

const AdminEventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEvent, getEventParticipants, loadEventDetails, downloadCSV } = useApp();

  // Load fresh data on mount
  useEffect(() => {
    loadEventDetails(id);
  }, [id]);

  const event = getEvent(id);
  const participants = getEventParticipants(id);

  // Helper for dates
  const formatDate = (isoString) => {
    if (!isoString) return '-- : --';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // Helper for Duration (HMS)
  const formatDuration = (seconds) => {
    if (!seconds) return '00:00:00';
    return formatTime(seconds); // Reusing your existing util
  };

  if (!event) return <div className="p-10 text-white">Loading Event...</div>;

  const stats = event.stats || { total: 0, verified: 0, pending: 0 };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <button onClick={() => navigate('/admin/dashboard')} className="flex items-center text-gray-500 hover:text-white mb-6 text-sm">
          <ChevronLeft size={16} /> Back to Admin Console
        </button>

        {/* --- HEADER & ACTIONS --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">{event.title || event.name}</h1>
            <div className="flex gap-3 text-sm text-gray-400 font-mono">
              <span className="text-blue-400">ID: {event.id}</span>
              <span>|</span>
              <span className="uppercase">{event.category}</span>
            </div>
          </div>
          <button 
             onClick={() => downloadCSV(event.id)}
             className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-6 py-2.5 rounded-lg font-bold transition shadow-lg shadow-green-900/20"
          >
             <Download size={18} /> Download CSV Report
          </button>
        </div>

        {/* --- MINI DASHBOARD STATS --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
           <StatCard icon={List} label="Total Participants" value={participants.length} color="text-white" />
           <StatCard icon={UserCheck} label="Verified" value={stats.verified} color="text-green-400" />
           <StatCard icon={Clock} label="Pending" value={stats.total - stats.verified} color="text-yellow-400" />
           <StatCard 
              icon={Calendar} 
              label="Status" 
              value={event.status} 
              color={event.status === 'live' ? 'text-red-400' : 'text-blue-400'} 
              isText 
           />
        </div>

        {/* --- DETAILED TABLE --- */}
        <div className="bg-[#1e293b] rounded-lg border border-gray-700 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0f172a] text-xs uppercase text-gray-400 border-b border-gray-700">
                <th className="p-4 font-bold">Participant Name</th>
                <th className="p-4 font-bold">ID / Token</th>
                <th className="p-4 font-bold">Start Time</th>
                <th className="p-4 font-bold">End Time</th>
                <th className="p-4 font-bold text-right">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 text-sm">
              {participants.map((p) => (
                <tr key={p.id} className="hover:bg-gray-800/50 transition">
                  <td className="p-4 font-medium text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-300">
                        {p.name.charAt(0)}
                      </div>
                      {p.name}
                    </div>
                  </td>
                  <td className="p-4 text-gray-400 font-mono text-xs">
                     {p.id} <br/> <span className="text-cyan-600">{p.token}</span>
                  </td>
                  <td className="p-4 text-gray-300 font-mono">
                    {p.verifiedAt ? formatDate(p.verifiedAt) : '-'}
                  </td>
                  <td className="p-4 text-gray-300 font-mono">
                    {/* Assuming we might calculate end based on start + elapsed, or backend data */}
                    {p.status === 'Completed' ? formatDate(p.endedAt) : <span className="text-green-500 animate-pulse text-xs">IN PROGRESS</span>}
                  </td>
                  <td className="p-4 text-right font-mono text-cyan-400 font-bold">
                    {formatDuration(p.elapsedTime)}
                  </td>
                </tr>
              ))}
              {participants.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">No participants found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

// Simple Stat Component
const StatCard = ({ icon: Icon, label, value, color, isText }) => (
  <div className="bg-[#1e293b] p-4 rounded-lg border border-gray-700 flex items-center gap-4">
    <div className="p-3 bg-gray-800 rounded-full">
      <Icon size={20} className="text-gray-400" />
    </div>
    <div>
       <p className="text-gray-500 text-xs font-bold uppercase tracking-wide">{label}</p>
       <p className={`text-xl font-bold ${color} ${isText ? 'uppercase text-sm mt-1' : 'font-mono'}`}>
         {value}
       </p>
    </div>
  </div>
);

export default AdminEventDetails;