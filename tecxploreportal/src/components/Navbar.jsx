import React from 'react';
import { Link } from 'react-router-dom';
import { User, Bell, Search } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="w-full h-16 bg-[#0f172a] border-b border-gray-800 flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white">T</div>
        <div>
          <h1 className="text-white font-bold tracking-wide text-sm">TECXPLORE 3.0</h1>
          <p className="text-gray-500 text-xs">CONTROL CONSOLE // MOD-01</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-green-400 text-xs">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          SYSTEM ONLINE
        </div>
        
        <Link to="/moderator" className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition">
           <div className="text-right hidden md:block">
              <p className="text-white text-sm font-medium">Alex Chen</p>
              <p className="text-gray-500 text-xs">Lead Moderator</p>
           </div>
           <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
             AC
           </div>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;