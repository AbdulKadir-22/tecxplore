import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { apiClient } from '../api/apiClient';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // --- AUTH STATE (Keep existing logic) ---
  const [currentUser, setCurrentUser] = useState(() => {
    const email = localStorage.getItem('user_email');
    const role = localStorage.getItem('user_role');
    
    let assignedEventIds = [];
    try {
      const storedIds = localStorage.getItem('assigned_event_ids');
      if (storedIds) assignedEventIds = JSON.parse(storedIds);
    } catch (e) { console.error("ID Parse Error", e); }

    if (assignedEventIds.length === 0) {
      const oldId = localStorage.getItem('assigned_event_id');
      if (oldId) assignedEventIds = [oldId];
    }

    if (email && role && role !== 'undefined') {
      return { email, role, assignedEventIds };
    }
    return null;
  });

  const [events, setEvents] = useState([]);
  const [participants, setParticipants] = useState([]);
  const eventsRef = useRef(events);
  
  useEffect(() => { eventsRef.current = events; }, [events]);

  useEffect(() => {
    if (currentUser) fetchEvents();
  }, [currentUser]); 

  // --- HELPER: Calculate Seconds ---
  const getSecondsSince = (dateString) => {
    if (!dateString) return 0;
    const start = new Date(dateString).getTime();
    const now = new Date().getTime();
    const diff = Math.floor((now - start) / 1000);
    return diff > 0 ? diff : 0;
  };

  // --- GLOBAL TIMER ---
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Update Main Event Timers
      setEvents(prev => prev.map(e => 
        e.timerRunning ? { ...e, elapsedTime: e.elapsedTime + 1 } : e
      ));

      // 2. Update Participant Timers
      setParticipants(prev => prev.map(p => {
        const parentEvent = eventsRef.current.find(e => String(e.id) === String(p.eventId));
        // Timer only runs if: Participant is Verified AND Event is Live
        if (p.status === 'Verified' && parentEvent && parentEvent.timerRunning) {
          return { ...p, elapsedTime: p.elapsedTime + 1 };
        }
        return p;
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchEvents = async () => {
    if (!currentUser) return;
    try {
      let validEvents = [];
      if (currentUser.role === 'SYSTEM_ADMIN') {
         const data = await apiClient.getAllEvents();
         validEvents = Array.isArray(data) ? data : (data.events || []);
      } else if (currentUser.role === 'COORDINATOR') {
         const ids = currentUser.assignedEventIds || [];
         if (ids.length === 0) { setEvents([]); return; }
         const promises = ids.map(id => apiClient.getEventDetails(id).catch(() => null));
         const results = await Promise.all(promises);
         validEvents = results.filter(res => res !== null).map(res => res.event || res);
      }

      const formattedEvents = validEvents.map(e => ({
        ...e,
        eventId: e.eventId || e._id, 
        id: e.eventId || e._id, 
        timerRunning: e.status === 'live',
        // FIX: Calculate time on initial load too!
        elapsedTime: (e.status === 'live' && e.startedAt) ? getSecondsSince(e.startedAt) : 0,
        stats: e.stats || { total: 0, verified: 0, review: 0, pending: 0 } 
      }));
      setEvents(formattedEvents);
    } catch (err) { console.error("Fetch Error:", err); }
  };

  const login = async (email, password) => {
    const data = await apiClient.login(email, password);
    const role = data.role || data.user?.role;
    let assignedEventIds = data.assignedEventIds || data.user?.assignedEventIds || [];
    const singleId = data.assignedEventId || data.user?.assignedEventId;
    if (assignedEventIds.length === 0 && singleId) assignedEventIds = [singleId];

    if (!role) throw new Error("No role returned");

    localStorage.setItem('user_email', email);
    localStorage.setItem('user_role', role);
    localStorage.setItem('assigned_event_ids', JSON.stringify(assignedEventIds));
    
    setCurrentUser({ email, role, assignedEventIds });
    return data; 
  };

  const logout = () => {
    localStorage.clear();
    setCurrentUser(null);
    setEvents([]);
    window.location.href = '/login'; 
  };
  
  const loadEventDetails = async (eventId) => {
     try {
       const eventData = await apiClient.getEventDetails(eventId);
       const eventPayload = eventData.event || eventData; 
       
       setEvents(prev => {
         const exists = prev.find(e => String(e.id) === String(eventId));
         
         // --- CRITICAL FIX FOR EVENT TIMER ---
         // If we have a 'startedAt' from DB, use it to calculate true elapsed time.
         // If not, try 'updatedAt' (common fallback), or default to 0.
         const startTime = eventPayload.startedAt || eventPayload.updatedAt;
         const trueElapsedTime = (eventPayload.status === 'live' && startTime)
             ? getSecondsSince(startTime)
             : 0;

         const updatedEvent = { 
            ...eventPayload, 
            id: eventId, 
            eventId: eventId,
            timerRunning: eventPayload.status === 'live',
            // Use the calculated time instead of 0
            elapsedTime: trueElapsedTime
         };

         return exists 
            ? prev.map(e => String(e.id) === String(eventId) ? { ...e, ...updatedEvent } : e)
            : [...prev, updatedEvent];
       });
       
       const pData = await apiClient.getParticipantsByEvent(eventId);
       
       if (Array.isArray(pData)) {
         setParticipants(prev => {
           const others = prev.filter(p => String(p.eventId) !== String(eventId));
           
           const newParticipants = pData.map(p => {
             const isVerified = p.verified === true || p.status === 'Verified';
             // Logic for participants (already working)
             const calculatedTime = isVerified && p.verifiedAt 
                ? getSecondsSince(p.verifiedAt) 
                : 0;

             return {
               ...p,
               id: p.participantId || p.id || p._id,
               eventId: eventId,
               status: isVerified ? 'Verified' : 'Pending',
               timerRunning: isVerified, 
               elapsedTime: calculatedTime 
             };
           });
           
           return [...others, ...newParticipants];
         });
       }
     } catch(err) { console.error(err); }
  };

  const verifyParticipant = async (token, eventId) => {
    const result = await apiClient.verifyToken(token, eventId);
    setParticipants(prev => prev.map(p => {
      if (p.token === token) {
        return { 
            ...p, 
            status: 'Verified',
            verified: true,
            verifiedAt: new Date().toISOString(),
            timerRunning: true,
            elapsedTime: 0 
        };
      }
      return p;
    }));
    return result;
  };

  const startEvent = async (eventId) => {
    await apiClient.updateEventStatus(eventId, 'live');
    
    setEvents(prev => prev.map(e => String(e.id) === String(eventId) ? { ...e, timerRunning: true, status: 'live' } : e));
    setParticipants(prev => prev.map(p => (String(p.eventId) === String(eventId) && p.status === 'Verified') ? { ...p, timerRunning: true } : p));
  };

  const stopEvent = async (eventId) => {
    await apiClient.updateEventStatus(eventId, 'completed');
    setEvents(prev => prev.map(e => String(e.id) === String(eventId) ? { ...e, timerRunning: false, status: 'completed' } : e));
    setParticipants(prev => prev.map(p => String(p.eventId) === String(eventId) ? { ...p, timerRunning: false } : p));
  };
  
  // (Keep startParticipantTimer, submitAllData, downloadCSV, getEventParticipants, getEvent same as before)
  const startParticipantTimer = (pid) => { setParticipants(prev => prev.map(p => p.id === pid ? { ...p, timerRunning: true } : p)); };
  
  const submitAllData = async (eventId) => {
      const eventParts = participants.filter(p => String(p.eventId) === String(eventId));
      const promises = eventParts.map(p => apiClient.submitParticipantData({
          eventId: eventId,
          participantId: p.id,
          elapsedTimeMs: p.elapsedTime * 1000,
          startedAt: new Date().toISOString(),
          endedAt: new Date().toISOString(),
          submittedBy: currentUser.email
      }));
      await Promise.all(promises);
  };
  
  const downloadCSV = async (eventId) => {
    const blob = await apiClient.exportEventCSV(eventId);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `event-${eventId}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const getEventParticipants = (eid) => participants.filter(p => String(p.eventId) === String(eid));
  const getEvent = (eid) => events.find(e => String(e.id) === String(eid));

  return (
    <AppContext.Provider value={{
      events, participants, currentUser,
      login, logout, fetchEvents,
      getEvent, getEventParticipants, loadEventDetails,
      verifyParticipant, startEvent, stopEvent,
      startParticipantTimer, submitAllData, downloadCSV
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);