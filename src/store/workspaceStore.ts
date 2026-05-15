import { create } from 'zustand';

interface WorkspaceStore {
  panels: Record<string, { x: number, y: number, visible: boolean }>;
  timerState: { time: number, mode: 'pomodoro' | 'deep' | 'flow', running: boolean };
  updatePanel: (id: string, updates: Partial<{ x: number, y: number, visible: boolean }>) => void;
  setTimer: (updates: Partial<{ time: number, running: boolean, mode: 'pomodoro' | 'deep' | 'flow' }>) => void;
  setTimerMode: (mode: 'pomodoro' | 'deep' | 'flow') => void;
}

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  panels: {
    timer: { x: 50, y: 100, visible: true },
    tasks: { x: 400, y: 100, visible: true },
    notes: { x: 800, y: 100, visible: true },
    sounds: { x: 50, y: 500, visible: true },
  },
  timerState: { time: 1500, mode: 'pomodoro', running: false },
  updatePanel: (id, updates) => set((s) => ({
    panels: { ...s.panels, [id]: { ...s.panels[id], ...updates } }
  })),
  setTimer: (updates) => set((s) => ({
    timerState: { ...s.timerState, ...updates }
  })),
  setTimerMode: (mode) => set((s) => {
    let time = 1500; // 25m
    if (mode === 'deep') time = 5400; // 90m
    if (mode === 'flow') time = 7200; // 120m
    return { timerState: { ...s.timerState, mode, time, running: false } };
  }),
}));
