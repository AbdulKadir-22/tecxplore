import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical } from 'lucide-react';

const ParticipantCard = ({ participant, onVerifyClick }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Verified': return 'bg-purple-900 text-purple-300 border-purple-700';
      case 'Reviewing': return 'bg-cyan-900 text-cyan-300 border-cyan-700';
      default: return 'bg-gray-700 text-gray-400 border-gray-600';
    }
  };

  const isVerified = participant.status === 'Verified';

  return (
    <div className={`relative bg-[#1e293b] rounded-lg p-4 border border-gray-800 ${isVerified ? 'border-l-4 border-l-purple-500' : 'border-l-4 border-l-cyan-500'}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full ${participant.avatar} flex items-center justify-center text-white font-bold`}>
            {participant.name.charAt(0)}
          </div>
          <div>
            <h4 
              className="text-white font-bold cursor-pointer hover:underline"
              onClick={() => isVerified && navigate(`/participant/${participant.id}`)}
            >
              {participant.name}
            </h4>
            <span className={`text-[10px] px-1.5 py-0.5 rounded border uppercase ${getStatusColor(participant.status)}`}>
              {participant.status}
            </span>
          </div>
        </div>
        <button className="text-gray-500 hover:text-white"><MoreVertical size={16}/></button>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs mb-4">
        <div>
          <p className="text-gray-500">PASS TYPE</p>
          <p className="text-gray-300">{participant.passType}</p>
        </div>
        <div>
          <p className="text-gray-500">ID</p>
          <p className="text-gray-300">{participant.id}</p>
        </div>
      </div>

      <div className="flex gap-2">
        {participant.status !== 'Verified' && (
           <button 
             onClick={() => onVerifyClick(participant)}
             className="flex-1 py-2 bg-cyan-500 hover:bg-cyan-600 text-black font-bold text-xs rounded transition shadow-[0_0_10px_rgba(6,182,212,0.3)]"
           >
             VERIFY
           </button>
        )}
        {participant.status === 'Reviewing' && (
           <button className="flex-1 py-2 bg-transparent border border-gray-700 text-gray-400 font-bold text-xs rounded hover:bg-gray-800 transition">
             REJECT
           </button>
        )}
         {participant.status === 'Verified' && (
           <div className="w-full text-center text-gray-500 text-xs italic py-2">
             Access Granted by System
           </div>
        )}
      </div>
    </div>
  );
};

export default ParticipantCard;