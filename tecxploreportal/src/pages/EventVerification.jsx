import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Layout from '../components/Layout';
import { Search, CheckCircle, XCircle, ChevronLeft, ScanLine } from 'lucide-react';

const EventVerification = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEvent, getEventParticipants, loadEventDetails, verifyParticipant } = useApp();
  
  // Load data from API on mount
  useEffect(() => {
    loadEventDetails(id);
  }, [id]);

  const event = getEvent(id);
  const participants = getEventParticipants(id);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); 
  const [selectedUser, setSelectedUser] = useState(null);
  const [tokenInput, setTokenInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const filteredList = useMemo(() => {
    return participants.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [participants, searchTerm, statusFilter]);

  const handleVerification = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      await verifyParticipant(tokenInput, event.id);
      setSelectedUser(null);
      setTokenInput('');
    } catch (err) {
      setErrorMsg('Token Verification Failed. Access Denied.');
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
        
        {/* Same Header UI */}
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <ScanLine className="text-cyan-400" />
              Verification Station
            </h1>
            <p className="text-gray-400 text-sm mt-1">{event.title}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-[#1e293b] p-4 rounded-lg border border-gray-700 mb-6 space-y-4 md:space-y-0 md:flex md:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search by Name or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0f172a] border border-gray-600 rounded pl-10 pr-4 py-2 text-white focus:border-cyan-500 outline-none"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
             {['All', 'Verified', 'Pending'].map(s => (
               <button
                 key={s}
                 onClick={() => setStatusFilter(s)}
                 className={`px-3 py-2 rounded text-xs font-bold whitespace-nowrap ${
                   statusFilter === s ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                 }`}
               >
                 {s}
               </button>
             ))}
          </div>
        </div>

        {/* List */}
        <div className="space-y-3">
          {filteredList.map(p => (
            <div 
              key={p.id} 
              onClick={() => p.status !== 'Verified' && setSelectedUser(p)}
              className={`p-4 rounded-lg border flex justify-between items-center transition ${
                p.status === 'Verified' 
                  ? 'bg-purple-900/10 border-purple-900/50 cursor-default' 
                  : 'bg-[#1e293b] border-gray-800 hover:border-cyan-500 cursor-pointer'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold`}>
                  {p.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-white font-bold">{p.name}</h4>
                  <p className="text-xs text-gray-500">{p.id}</p>
                </div>
              </div>
              <div className="text-right">
                {p.status === 'Verified' ? (
                  <span className="flex items-center gap-1 text-purple-400 text-xs font-bold">
                    <CheckCircle size={14} /> Verified
                  </span>
                ) : (
                  <span className="text-cyan-500 text-xs font-bold border border-cyan-800 px-2 py-1 rounded">
                    VERIFY
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedUser && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#1e293b] border border-gray-600 w-full max-w-sm rounded-xl p-6 shadow-2xl">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-white text-lg font-bold">Verify Identity</h3>
                <button onClick={() => setSelectedUser(null)} className="text-gray-500 hover:text-white"><XCircle /></button>
              </div>
              
              <div className="text-center mb-6">
                <p className="text-white font-bold">{selectedUser.name}</p>
                <p className="text-gray-400 text-xs">{selectedUser.id}</p>
              </div>

              <input 
                type="text" 
                placeholder="Enter Token" 
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                className="w-full bg-[#0f172a] border border-gray-600 text-white p-3 rounded text-center tracking-widest mb-2 uppercase"
              />
              {errorMsg && <p className="text-red-500 text-xs text-center mb-4">{errorMsg}</p>}

              <button 
                onClick={handleVerification}
                disabled={loading}
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded transition mt-2 disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Confirm'}
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EventVerification;