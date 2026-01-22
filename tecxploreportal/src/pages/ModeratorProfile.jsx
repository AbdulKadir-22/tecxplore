import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useApp } from '../context/AppContext';
import { apiClient } from '../api/apiClient';
import { Shield, LogOut, Calendar, Clock, Mail, Loader, AlertTriangle } from 'lucide-react';

const ModeratorProfile = () => {
  const navigate = useNavigate();
  const { logout } = useApp(); // Use global logout logic
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiClient.getProfile();
        // Handle response whether it's wrapped in { user: ... } or flat
        setProfile(data.user || data);
      } catch (err) {
        console.error("Profile Load Error:", err);
        setError("Could not load profile. Backend route may be missing.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex h-[80vh] items-center justify-center text-cyan-400 gap-3">
           <Loader className="animate-spin" /> Loading Profile...
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex h-[80vh] flex-col items-center justify-center text-red-400 gap-2">
           <AlertTriangle size={40} />
           <p className="font-bold">{error}</p>
           <button onClick={() => window.location.reload()} className="text-sm underline hover:text-white">Retry</button>
        </div>
      </Layout>
    );
  }

  // Fallback data if API fields are missing
  const displayName = profile?.name || "Unknown Moderator";
  const displayRole = profile?.role || "STAFF";
  const displayId = profile?._id ? `ID: ${profile._id.substring(profile._id.length - 6).toUpperCase()}` : "ID: N/A";
  const initials = displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  
  // Calculate count from the assignedEventIds array (which contains objects)
  const activeTaskCount = Array.isArray(profile?.assignedEventIds) 
    ? profile.assignedEventIds.length 
    : 0;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-4 md:p-8 mt-4 md:mt-10">
        <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-8 relative overflow-hidden shadow-2xl">
            
            {/* Decorative Background Blur */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/10 blur-[80px] rounded-full pointer-events-none"></div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 relative z-10">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)] border-2 border-white/10">
                    {initials}
                </div>
                
                <div className="text-center md:text-left flex-1">
                    <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-1">{displayName}</h1>
                    <div className="flex items-center justify-center md:justify-start gap-2 text-cyan-400 font-mono text-sm mb-4">
                        <Shield size={14} />
                        <span className="uppercase">{displayRole} // {displayId}</span>
                    </div>
                    <span className="inline-block bg-green-500/10 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest shadow-[0_0_10px_rgba(74,222,128,0.1)]">
                        ● System Active
                    </span>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {/* Active Tasks Card */}
                <div className="bg-[#020617] p-4 rounded-lg border border-gray-800 flex items-center gap-4 hover:border-blue-500/30 transition-colors group">
                    <div className="p-3 bg-gray-800/50 rounded-full text-gray-400 group-hover:text-blue-400 transition-colors">
                        <Calendar size={20} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Assigned Events</p>
                        <p className="text-white font-bold font-mono text-lg">{activeTaskCount} Active Task{activeTaskCount !== 1 && 's'}</p>
                    </div>
                </div>

                {/* Email / Info Card */}
                <div className="bg-[#020617] p-4 rounded-lg border border-gray-800 flex items-center gap-4 hover:border-blue-500/30 transition-colors group">
                    <div className="p-3 bg-gray-800/50 rounded-full text-gray-400 group-hover:text-blue-400 transition-colors">
                        <Mail size={20} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Registered Email</p>
                        <p className="text-white font-bold font-mono text-sm truncate max-w-[180px]" title={profile?.email}>
                            {profile?.email}
                        </p>
                    </div>
                </div>
            </div>

            {/* Logout Button */}
            <button 
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 py-4 bg-red-900/10 text-red-500 border border-red-900/50 rounded-lg hover:bg-red-900/20 hover:border-red-500 hover:text-red-400 transition-all font-bold uppercase tracking-wider text-sm shadow-lg"
            >
                <LogOut size={16} /> Terminate Session
            </button>
        </div>
        
        <p className="text-center text-gray-600 text-[10px] mt-6 font-mono uppercase">
            TECXPLORE 3.0 Control Console • V3.0.1 Stable
        </p>
      </div>
    </Layout>
  );
};

export default ModeratorProfile;