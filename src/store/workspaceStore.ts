import { create } from 'zustand';

export interface TaskNode {
  id: string;
  text: string;
  completed: boolean;
  priority: number;
  category: string;
  x?: number;
  y?: number;
}

interface WorkspaceStore {
  panels: Record<string, { x: number, y: number, visible: boolean }>;
  tasks: TaskNode[];
  timerState: { time: number, mode: 'pomodoro' | 'deep' | 'flow', running: boolean };
  updatePanel: (id: string, updates: Partial<{ x: number, y: number, visible: boolean }>) => void;
  toggleTask: (id: string) => void;
  setTimer: (updates: Partial<{ time: number, running: boolean, mode: 'pomodoro' | 'deep' | 'flow' }>) => void;
}

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  panels: {
    timer: { x: 50, y: 100, visible: true },
    tasks: { x: 400, y: 100, visible: true },
    notes: { x: 800, y: 100, visible: true },
    sounds: { x: 50, y: 500, visible: true },
  },
  tasks: [
    { id: '1', text: 'Refactor neural shaders', completed: false, priority: 2, category: 'dev' },
    { id: '2', text: 'Daily meditation', completed: true, priority: 1, category: 'health' },
    { id: '3', text: 'Draft vision document', completed: false, priority: 3, category: 'creative' },
  ],
  timerState: { time: 1500, mode: 'pomodoro', running: false },
  updatePanel: (id, updates) => set((s) => ({
    panels: { ...s.panels, [id]: { ...s.panels[id], ...updates } }
  })),
  toggleTask: (id) => set((s) => ({
    tasks: s.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
  })),
  setTimer: (updates) => set((s) => ({
    timerState: { ...s.timerState, ...updates }
  })),
}));
