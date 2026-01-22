import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ParticipantCard from '../components/ParticipantCard';
import { mockEvents } from '../data/mockEvents';
import { mockParticipants } from '../data/mockParticipants';
import { loadValidTokens, validateToken } from '../utils/tokenValidator';
import { X, Search } from 'lucide-react';

const EventDetails = () => {
  const { id } = useParams();
  const [eventData, setEventData] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [selectedParticipant, setSelectedParticipant] = useState(null); // For modal
  const [inputToken, setInputToken] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [validTokens, setValidTokens] = useState(new Set());

  // Load Event and Participants
  useEffect(() => {
    const event = mockEvents.find(e => e.id === parseInt(id));
    const eventParticipants = mockParticipants.filter(p => p.eventId === parseInt(id));
    setEventData(event);
    setParticipants(eventParticipants);
    
    // Load CSV Token Data
    loadValidTokens().then(tokens => {
        setValidTokens(tokens);
    }).catch(err => console.error("Failed to load tokens", err));
  }, [id]);

  const handleVerify = () => {
    const isValid = validateToken(inputToken, validTokens);
    
    if (isValid) {
      // Update participant status locally
      const updatedList = participants.map(p => 
        p.id === selectedParticipant.id ? { ...p, status: 'Verified' } : p
      );
      setParticipants(updatedList);
      setSelectedParticipant(null);
      setInputToken('');
      setVerificationError('');
    } else {
      setVerificationError('Invalid Token. Access Denied.');
    }
  };

  if (!eventData) return <div className="text-white p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0b1120] pb-12">
      <Navbar />
      
      {/* Header */}
      <div className="p-8 max-w-7xl mx-auto">
        <div className="mb-6">
            <h2 className="text-4xl font-bold text-white mb-2">{eventData.title}</h2>
            <p className="text-gray-400">Registration Phase • {eventData.status}</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-[#1e293b] p-4 rounded-lg border border-gray-800 text-center">
                <p className="text-gray-500 text-xs uppercase mb-1">Total</p>
                <p className="text-white text-3xl font-bold">{eventData.stats.total}</p>
            </div>
            <div className="bg-[#1e293b] p-4 rounded-lg border border-purple-900/50 text-center">
                <p className="text-purple-400 text-xs uppercase mb-1">Verified</p>
                <p className="text-purple-300 text-3xl font-bold">{eventData.stats.verified}</p>
            </div>
            <div className="bg-[#1e293b] p-4 rounded-lg border border-cyan-900/50 text-center">
                <p className="text-cyan-400 text-xs uppercase mb-1">In Progress</p>
                <p className="text-cyan-300 text-3xl font-bold">{eventData.stats.review}</p>
            </div>
            <div className="bg-[#1e293b] p-4 rounded-lg border border-gray-800 text-center">
                <p className="text-gray-500 text-xs uppercase mb-1">Pending</p>
                <p className="text-white text-3xl font-bold">{eventData.stats.pending}</p>
            </div>
        </div>

        {/* Participants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {participants.map(p => (
                <ParticipantCard 
                    key={p.id} 
                    participant={p} 
                    onVerifyClick={(part) => setSelectedParticipant(part)}
                />
            ))}
        </div>
      </div>

      {/* Verification Modal */}
      {selectedParticipant && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[#1e293b] border border-gray-700 w-full max-w-md p-6 rounded-xl shadow-2xl relative">
                <button 
                    onClick={() => { setSelectedParticipant(null); setVerificationError(''); }}
                    className="absolute right-4 top-4 text-gray-500 hover:text-white"
                >
                    <X size={20} />
                </button>

                <div className="text-center mb-6">
                    <div className={`w-16 h-16 rounded-full mx-auto ${selectedParticipant.avatar} flex items-center justify-center text-white text-2xl font-bold mb-3`}>
                        {selectedParticipant.name.charAt(0)}
                    </div>
                    <h3 className="text-white text-xl font-bold">{selectedParticipant.name}</h3>
                    <p className="text-gray-500 text-sm">Participant Verification</p>
                </div>

                <div className="mb-6">
                    <label className="text-gray-400 text-xs font-bold uppercase block mb-2">Enter Unique Verification ID</label>
                    <input 
                        type="text"
                        placeholder="E.G., K8Svrk"
                        value={inputToken}
                        onChange={(e) => setInputToken(e.target.value)}
                        className="w-full bg-[#0f172a] border border-gray-600 rounded-lg px-4 py-3 text-white text-center tracking-widest uppercase focus:outline-none focus:border-purple-500 transition"
                    />
                    {verificationError && <p className="text-red-500 text-xs mt-2 text-center">{verificationError}</p>}
                </div>

                <div className="flex gap-3">
                    <button 
                        onClick={() => setSelectedParticipant(null)}
                        className="flex-1 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleVerify}
                        className="flex-1 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-black font-bold"
                    >
                        Verify Participant ✓
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;