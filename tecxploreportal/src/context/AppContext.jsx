import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { apiClient } from '../api/apiClient';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // --- AUTH STATE ---
  const [currentUser, setCurrentUser] = useState(() => {
    const email = localStorage.getItem('user_email');
    const role = localStorage.getItem('user_role');
    
    // Parse Assigned IDs (Handle both Array and String legacy)
    let assignedEventIds = [];
    try {
      const storedIds = localStorage.getItem('assigned_event_ids');
      if (storedIds) assignedEventIds = JSON.parse(storedIds);
    } catch (e) { console.error("ID Parse Error", e); }

    // Fallback for single ID legacy
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
  
  // Timer Ref
  const eventsRef = useRef(events);
  useEffect(() => { eventsRef.current = events; }, [events]);

  // Load Events on Login
  useEffect(() => {
    if (currentUser) fetchEvents();
  }, [currentUser]); 


  // --- CORE ACTIONS ---

  const fetchEvents = async () => {
    try {
      const data = await apiClient.getAllEvents();
      
      // Safety: Ensure data is an array
      const eventsList = Array.isArray(data) ? data : (data.events || []);

      const formattedEvents = eventsList.map(e => ({
        ...e,
        // CRITICAL FIX: Ensure eventId exists. Fallback to _id if missing.
        eventId: e.eventId || e._id, 
        id: e.eventId || e._id, 
        timerRunning: e.status === 'live',
        elapsedTime: e.elapsedTime || 0,
        stats: e.stats || { total: 0, verified: 0, review: 0, pending: 0 } 
      }));
      
      console.log("EVENTS LOADED:", formattedEvents); // Check Console!
      setEvents(formattedEvents);
    } catch (err) {
      console.error("Fetch Events Error:", err);
    }
  };

  const loadEventDetails = async (eventId) => {
     try {
       console.log("LOADING DETAILS FOR:", eventId);

       // 1. Fetch Event Info
       const eventData = await apiClient.getEventDetails(eventId);
       const eventPayload = eventData.event || eventData; 
       
       setEvents(prev => {
         // If event exists, update it. If not, add it.
         const exists = prev.find(e => String(e.id) === String(eventId));
         if (exists) {
            return prev.map(e => String(e.id) === String(eventId) ? { ...e, ...eventPayload } : e);
         } else {
            return [...prev, { ...eventPayload, id: eventId, eventId: eventId }];
         }
       });
       
       // 2. Fetch Participants (FIX FOR VERIFICATION PAGE)
       const participantData = await apiClient.getParticipantsByEvent(eventId);
       console.log("PARTICIPANTS FETCHED:", participantData);

       if (Array.isArray(participantData)) {
         setParticipants(prev => {
           // Remove old participants for this event to avoid duplicates
           const others = prev.filter(p => String(p.eventId) !== String(eventId));
           
           const newParticipants = participantData.map(p => ({
             ...p,
             id: p.participantId || p.id || p._id,
             // Ensure eventId is explicitly set on the participant
             eventId: eventId, 
             timerRunning: false,
             elapsedTime: p.elapsedTime || 0
           }));
           
           return [...others, ...newParticipants];
         });
       }
     } catch(err) { 
        console.error("Error loading details:", err); 
     }
  };

  const login = async (email, password) => {
    const data = await apiClient.login(email, password);
    const role = data.role || data.user?.role;
    
    // Capture Assigned IDs
    let assignedEventIds = data.assignedEventIds || data.user?.assignedEventIds || [];
    
    // Fallback if backend sends single ID string
    const singleId = data.assignedEventId || data.user?.assignedEventId;
    if (assignedEventIds.length === 0 && singleId) {
      assignedEventIds = [singleId];
    }

    if (!role) throw new Error("Login failed: No role returned.");

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
    setParticipants([]);
    window.location.href = '/login'; 
  };

  // --- ACTIONS (Unchanged Logic) ---

  const verifyParticipant = async (token, eventId) => {
    const result = await apiClient.verifyToken(token, eventId);
    setParticipants(prev => prev.map(p => 
      String(p.id) === String(result.participantId) ? { ...p, status: 'Verified' } : p
    ));
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
  
  const startParticipantTimer = (pid) => {
     setParticipants(prev => prev.map(p => p.id === pid ? { ...p, timerRunning: true } : p));
  };
  
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

  // --- GETTERS (Fixed String Comparison) ---
  const getEventParticipants = (eid) => participants.filter(p => String(p.eventId) === String(eid));
  const getEvent = (eid) => events.find(e => String(e.id) === String(eid));

  return (
    <AppContext.Provider value={{
      events, participants, currentUser,
      login, logout,
      getEvent, getEventParticipants, loadEventDetails,
      verifyParticipant, startEvent, stopEvent,
      startParticipantTimer, submitAllData, downloadCSV
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);