import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import EventCard from '../components/EventCard';
import Layout from '../components/Layout';
import { Loader } from 'lucide-react';

const Dashboard = () => {
  const { events, currentUser } = useApp();
  const categories = ['Tech', 'Non-Tech', 'E-Sport', 'Workshops', 'Robotics'];
  
  // Initialize with a safe default, but we'll update it shortly
  const [activeTab, setActiveTab] = useState('Tech'); 

  // --- 1. FILTER LOGIC ---
  const filteredEvents = useMemo(() => {
    if (!currentUser) return [];

    return events.filter(e => {
      // Role Filter First
      let hasAccess = false;
      if (currentUser.role === 'SYSTEM_ADMIN') {
        hasAccess = true;
      } else if (currentUser.role === 'COORDINATOR') {
        // Check if event ID is in their assigned list
        hasAccess = currentUser.assignedEventIds?.some(
          assignedId => String(assignedId) === String(e.eventId)
        );
      }
      
      // If they have access, check the category
      return hasAccess && e.category === activeTab;
    });
  }, [events, currentUser, activeTab]);

  // --- 2. AUTO-TAB SWITCHER (New!) ---
  // If the current tab is empty, find a tab that actually has assigned events
  useEffect(() => {
    if (currentUser?.role === 'COORDINATOR' && events.length > 0) {
      // Get all events this user is actually allowed to see
      const userEvents = events.filter(e => 
        currentUser.assignedEventIds?.some(aid => String(aid) === String(e.eventId))
      );
      
      // If they have events, but none are in the current tab...
      const hasEventsInCurrentTab = userEvents.some(e => e.category === activeTab);
      
      if (!hasEventsInCurrentTab && userEvents.length > 0) {
        // ...Switch to the category of their first event!
        setActiveTab(userEvents[0].category);
      }
    }
  }, [currentUser, events, activeTab]);

  if (!currentUser) {
    return (
      <Layout>
        <div className="flex h-[80vh] items-center justify-center">
           <Loader className="animate-spin text-cyan-400" size={48} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase">
              Event <span className="text-cyan-400">Dashboard</span>
            </h2>
            <p className="text-gray-400 text-sm mt-1 font-mono">
              ROLE: <span className="text-cyan-400">{currentUser.role}</span>
            </p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto gap-2 mb-8 pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-6 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-all border ${
                activeTab === cat 
                  ? 'bg-cyan-500/10 border-cyan-400 text-cyan-300' 
                  : 'bg-[#0f172a] border-gray-800 text-gray-500 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <div key={event.id} className="relative">
                 <EventCard event={event} />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500 bg-[#0f172a]/50 rounded-lg border border-gray-800/50 border-dashed">
              <p className="text-lg font-mono">NO EVENTS FOUND IN '{activeTab}'</p>
              
              {/* Simplified Hint */}
              {currentUser.role === 'COORDINATOR' && (
                <p className="text-xs mt-2 text-gray-400">
                  You are assigned: <span className="text-white">{currentUser.assignedEventIds?.join(', ')}</span>.<br/>
                  Try switching tabs (Tech, Non-Tech, etc.) to find them.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;