import { useEffect } from 'react';
import { useWorkspaceStore } from '../store/workspaceStore';
import { useDataStore } from '../store/dataStore';

export default function GlobalTimer() {
  const { timerState, setTimer, appendToNote } = useWorkspaceStore();
  const { logFocusSession } = useDataStore();

  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Track start/stop for timestamps
  useEffect(() => {
    if (timerState.running) {
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      appendToNote(`[SESSION STARTED: ${timeStr}]`);
    }
  }, [timerState.running, appendToNote]); // Only triggers when running toggles

  useEffect(() => {
    let interval: number;
    if (timerState.running && timerState.time > 0) {
      interval = window.setInterval(() => {
        // Use functional update to avoid stale closure issues if needed, 
        // but setTimer in workspaceStore already handles it.
        // However, we need to check the time here to stop it.
        setTimer({ time: timerState.time - 1 });
      }, 1000);
    } else if (timerState.time === 0 && timerState.running) {
      setTimer({ running: false });
      
      // Calculate hours based on mode
      let hours = 0.5; // default pomodoro
      if (timerState.mode === 'deep') hours = 1.5;
      if (timerState.mode === 'flow') hours = 2.0;
      if (timerState.mode === 'custom') hours = 1.0; 
      
      logFocusSession(hours);
      
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      appendToNote(`[SESSION COMPLETED: ${timeStr} | ${hours} hrs logged]`);
      
      // Notification
      if (Notification.permission === 'granted') {
        new Notification('NeuroScape', { body: 'Focus Session Complete!' });
      } else {
        alert(`Focus Session Complete! Logged ${hours} hours.`);
      }
    }
    
    return () => clearInterval(interval);
  }, [timerState.running, timerState.time, timerState.mode, setTimer, logFocusSession]);

  // This component doesn't render anything visible
  return null;
}
