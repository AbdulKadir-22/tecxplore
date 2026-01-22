import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // 1. Perform login
      await login(email, password);
      // 2. Navigate ONLY after success
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Invalid credentials or system error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0f172a] border border-gray-800 p-8 rounded-2xl shadow-2xl relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-600/10 blur-[60px] rounded-full pointer-events-none"></div>
        
        <div className="text-center mb-8 relative z-10">
            <h1 className="text-white text-3xl font-black tracking-tight mb-2">TECXPLORE 3.0</h1>
            <p className="text-cyan-400 text-xs font-mono tracking-widest">SECURE_ACCESS_GATEWAY</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          <div>
            <label className="text-gray-500 text-[10px] font-bold uppercase tracking-widest block mb-2">Identifier</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#020617] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition font-mono text-sm"
              placeholder="user@university.edu"
              required
            />
          </div>
          <div>
            <label className="text-gray-500 text-[10px] font-bold uppercase tracking-widest block mb-2">Passcode</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#020617] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition font-mono text-sm"
              required
            />
          </div>
          
          {error && <p className="text-red-500 text-xs text-center font-bold">{error}</p>}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg transition shadow-[0_0_20px_rgba(6,182,212,0.3)] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm"
          >
            {loading ? 'Authenticating...' : 'Initialize Session'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;