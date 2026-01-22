import React, { useState, useEffect, useRef } from 'react';
import { formatTime } from '../utils/tokenValidator';
import { Play, Pause, Square } from 'lucide-react';

const TimerControls = ({ initialTime = 0, isActive = false, label = "Timer" }) => {
  const [time, setTime] = useState(initialTime);
  const [running, setRunning] = useState(isActive);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  return (
    <div className="flex flex-col items-center">
      <div className="text-2xl font-mono text-white mb-2 tracking-widest">
        {formatTime(time)}
      </div>
      <div className="flex gap-2">
        <button 
          onClick={() => setRunning(!running)}
          className={`p-2 rounded transition ${running ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'}`}
        >
          {running ? <Pause size={16} className="text-white"/> : <Play size={16} className="text-white"/>}
        </button>
        <button 
          onClick={() => { setRunning(false); setTime(0); }}
          className="p-2 rounded bg-red-600 hover:bg-red-700 transition"
        >
          <Square size={16} className="text-white"/>
        </button>
      </div>
    </div>
  );
};

export default TimerControls;