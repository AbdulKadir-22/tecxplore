import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout'; // Added Layout
import { useApp } from '../context/AppContext';
import { formatTime } from '../utils/tokenValidator';

const ParticipantProfile = () => {
  const { id } = useParams();
  const { participants } = useApp();
  const participant = participants.find(p => p.id === id);

  if (!participant) return <div className="text-white p-8">Participant Not Found</div>;

  return (
    <Layout>
       <div className="max-w-4xl mx-auto p-4 md:p-8">
        <Link to={`/event/verification/${participant.eventId}`} className="text-gray-500 hover:text-cyan-400 mb-6 block font-mono text-sm">
            {'<'} RETURN_TO_VERIFICATION
        </Link>
        
        <div className="bg-[#0f172a] rounded-xl border border-gray-800 p-8 flex flex-col md:flex-row gap-8 items-center md:items-start relative overflow-hidden">
           {/* Background Decoration */}
           <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-[80px] rounded-full pointer-events-none"></div>

           <div className={`w-32 h-32 rounded-full bg-gray-800 flex items-center justify-center text-white text-4xl font-bold border-2 border-gray-700 z-10`}>
               {participant.name.charAt(0)}
           </div>
           
           <div className="flex-1 text-center md:text-left z-10">
               <div className="flex flex-col md:flex-row items-center gap-4 mb-2">
                   <h1 className="text-3xl font-black text-white uppercase">{participant.name}</h1>
                   <span className="bg-purple-900/30 text-purple-300 border border-purple-500/50 px-3 py-1 rounded-sm text-[10px] uppercase font-bold tracking-widest">
                    {participant.status}
                   </span>
               </div>
               <p className="text-cyan-500 font-mono mb-6 text-sm">ID: {participant.id} // ACCESS: {participant.passType}</p>
               
               <div className="bg-[#020617] p-6 rounded-lg border border-gray-800 inline-block w-full md:w-auto">
                   <p className="text-gray-500 text-[10px] uppercase mb-2 tracking-widest">Current Session Time</p>
                   <p className="text-3xl font-mono text-white tracking-widest">
                    {formatTime(participant.elapsedTime)}
                   </p>
               </div>
           </div>
        </div>
      </div>
    </Layout>
  );
};

export default ParticipantProfile;