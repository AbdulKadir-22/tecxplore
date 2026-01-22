import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout'; // Import the Layout wrapper
import { User, Shield, LogOut, Calendar, Clock } from 'lucide-react';

const ModeratorProfile = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-4 md:p-8 mt-4 md:mt-10">
        <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-8 relative overflow-hidden">
            
            {/* Decorative Background Blur */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/10 blur-[80px] rounded-full pointer-events-none"></div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 relative z-10">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                    AC
                </div>
                
                <div className="text-center md:text-left flex-1">
                    <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-1">Alex Chen</h1>
                    <div className="flex items-center justify-center md:justify-start gap-2 text-cyan-400 font-mono text-sm mb-4">
                        <Shield size={14} />
                        <span>LEAD_MODERATOR // ID: MOD-01</span>
                    </div>
                    <span className="inline-block bg-green-500/10 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest">
                        ● System Active
                    </span>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-[#020617] p-4 rounded border border-gray-800 flex items-center gap-3">
                    <Calendar className="text-gray-500" size={20} />
                    <div>
                        <p className="text-gray-500 text-[10px] uppercase tracking-widest">Assigned Events</p>
                        <p className="text-white font-bold font-mono">4 Active Tasks</p>
                    </div>
                </div>
                <div className="bg-[#020617] p-4 rounded border border-gray-800 flex items-center gap-3">
                    <Clock className="text-gray-500" size={20} />
                    <div>
                        <p className="text-gray-500 text-[10px] uppercase tracking-widest">Session Start</p>
                        <p className="text-white font-bold font-mono">09:42 AM</p>
                    </div>
                </div>
            </div>

            <button 
                onClick={() => navigate('/')}
                className="w-full flex items-center justify-center gap-2 py-4 bg-red-900/10 text-red-500 border border-red-900/50 rounded-lg hover:bg-red-900/20 hover:border-red-500 transition-all font-bold uppercase tracking-wider text-sm"
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