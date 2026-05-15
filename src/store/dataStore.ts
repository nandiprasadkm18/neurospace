import { create } from 'zustand';

export interface Goal {
  id: string;
  title: string;
  category: 'health' | 'career' | 'creative' | 'finance' | 'personal';
  completion: number;
  tasks: { id: string; title: string; done: boolean }[];
  color: string;
}

export interface Memory {
  id: string;
  date: string;
  title: string;
  description: string;
  emotion: 'happy' | 'calm' | 'excited' | 'reflective' | 'sad';
  tags: string[];
}

export interface FocusSession {
  day: string;
  hours: number;
}

interface DataState {
  goals: Goal[];
  memories: Memory[];
  focusSessions: FocusSession[];
  habitGrid: number[][];
  focusScore: number;
  habitsComplete: number;
  habitsTotal: number;
  energy: string;
  toggleTaskStatus: (goalId: string, taskId: string) => void;
  addMemory: (memory: Omit<Memory, 'id' | 'date'>) => void;
  logFocusSession: (hours: number) => void;
  addWorkspaceTask: (title: string) => void;
}

const GOALS: Goal[] = [
  {
    id: 'g1', title: 'Run a Marathon', category: 'health', completion: 68, color: '#00FF88',
    tasks: [
      { id: 't1', title: '5K training', done: true },
      { id: 't2', title: '10K training', done: true },
      { id: 't3', title: 'Half marathon', done: false },
    ],
  },
  {
    id: 'g2', title: 'Ship Neural App', category: 'career', completion: 45, color: '#4488FF',
    tasks: [
      { id: 't4', title: 'Design system', done: true },
      { id: 't5', title: 'API layer', done: false },
      { id: 't6', title: 'Launch', done: false },
      { id: 't7', title: 'Marketing', done: false },
    ],
  },
  {
    id: 'g3', title: 'Write a Novel', category: 'creative', completion: 22, color: '#7B2FFF',
    tasks: [
      { id: 't8', title: 'Outline', done: true },
      { id: 't9', title: 'Draft ch.1-5', done: false },
    ],
  },
  {
    id: 'g4', title: 'Emergency Fund', category: 'finance', completion: 81, color: '#FFAA00',
    tasks: [
      { id: 't10', title: 'Save $5K', done: true },
      { id: 't11', title: 'Save $10K', done: true },
      { id: 't12', title: 'Save $15K', done: false },
    ],
  },
  {
    id: 'g5', title: 'Learn Japanese', category: 'personal', completion: 35, color: '#FF66AA',
    tasks: [
      { id: 't13', title: 'Hiragana', done: true },
      { id: 't14', title: 'Katakana', done: false },
      { id: 't15', title: 'N5 Kanji', done: false },
    ],
  },
];

const MEMORIES: Memory[] = [
  { id: 'm1', date: '2026-05-15', title: 'First neural sync completed', description: 'The interface mapped my consciousness for the first time. Everything felt connected — thoughts, goals, memories flowing as one stream of light.', emotion: 'excited', tags: ['milestone', 'neuroscape'] },
  { id: 'm2', date: '2026-05-10', title: 'Midnight coding session', description: 'Built the entire particle system in one sitting. The flow state lasted 4 hours — the longest unbroken focus streak this month.', emotion: 'happy', tags: ['coding', 'flow'] },
  { id: 'm3', date: '2026-04-28', title: 'Rain walk through the city', description: 'Left the screen behind. Walked 8 miles through rain-slicked streets. Ideas came faster than I could capture them.', emotion: 'reflective', tags: ['nature', 'ideas'] },
  { id: 'm4', date: '2026-04-15', title: 'Team dinner at the rooftop', description: 'Celebrated the product milestone with the team. City skyline at sunset. Conversations about consciousness and code.', emotion: 'happy', tags: ['team', 'celebration'] },
  { id: 'm5', date: '2026-03-20', title: 'Started meditation practice', description: 'Day one of a 30-day commitment. Ten minutes of silence. The mind resists stillness but the signal is clearer afterward.', emotion: 'calm', tags: ['meditation', 'habit'] },
  { id: 'm6', date: '2026-03-01', title: 'Quantum dreams journal entry', description: 'Dreamt in code again. Arrays of light folding into recursive patterns. Woke up with the solution to the rendering bug.', emotion: 'excited', tags: ['dreams', 'creative'] },
  { id: 'm7', date: '2026-02-14', title: 'Valentine\'s solo adventure', description: 'Took myself to the observatory. Watched Saturn through the telescope. Self-love is its own constellation.', emotion: 'reflective', tags: ['solo', 'space'] },
  { id: 'm8', date: '2026-01-20', title: 'The great system crash', description: 'Lost 3 days of work to a corrupted drive. Rebuilt everything from memory. What survived was what mattered most.', emotion: 'sad', tags: ['setback', 'resilience'] },
  { id: 'm9', date: '2026-01-01', title: 'New Year: Year of the Mind', description: 'Set the intention: this year belongs to consciousness expansion. Every day is a chance to map new neural territory.', emotion: 'excited', tags: ['newyear', 'intention'] },
  { id: 'm10', date: '2025-12-15', title: 'Northern lights from Iceland', description: 'Green curtains of light dancing across the arctic sky. Nature\'s own neural network, firing in slow motion.', emotion: 'happy', tags: ['travel', 'nature'] },
];

const generateHabitGrid = (): number[][] => {
  const grid: number[][] = [];
  for (let w = 0; w < 52; w++) {
    const week: number[] = [];
    for (let d = 0; d < 7; d++) {
      week.push(Math.random() > 0.3 ? Math.floor(Math.random() * 4) + 1 : 0);
    }
    grid.push(week);
  }
  return grid;
};

export const useDataStore = create<DataState>()(() => ({
  goals: GOALS,
  memories: MEMORIES,
  focusSessions: [
    { day: 'Mon', hours: 4.2 },
    { day: 'Tue', hours: 6.1 },
    { day: 'Wed', hours: 3.5 },
    { day: 'Thu', hours: 7.8 },
    { day: 'Fri', hours: 5.4 },
    { day: 'Sat', hours: 2.1 },
    { day: 'Sun', hours: 1.8 },
  ],
  habitGrid: generateHabitGrid(),
  focusScore: 87,
  habitsComplete: 5,
  habitsTotal: 7,
  energy: 'HIGH',
  toggleTaskStatus: (goalId, taskId) => set((state) => {
    const updatedGoals = state.goals.map(goal => {
      if (goal.id === goalId) {
        const updatedTasks = goal.tasks.map(task => 
          task.id === taskId ? { ...task, done: !task.done } : task
        );
        const completedTasks = updatedTasks.filter(t => t.done).length;
        const newCompletion = Math.round((completedTasks / updatedTasks.length) * 100);
        return { ...goal, tasks: updatedTasks, completion: newCompletion };
      }
      return goal;
    });
    return { goals: updatedGoals };
  }),
  addMemory: (memory) => set((state) => ({
    memories: [{
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
      ...memory
    }, ...state.memories]
  })),
  logFocusSession: (hours) => set((state) => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
    const existingSession = state.focusSessions.find(s => s.day === today);
    if (existingSession) {
      return {
        focusSessions: state.focusSessions.map(s => 
          s.day === today ? { ...s, hours: s.hours + hours } : s
        )
      };
    } else {
      return {
        focusSessions: [...state.focusSessions.slice(1), { day: today, hours }]
      };
    }
  }),
  addWorkspaceTask: (title) => set((state) => {
    const workspaceGoalIndex = state.goals.findIndex(g => g.id === 'workspace');
    const newTask = { id: Math.random().toString(36).substr(2, 9), title, done: false };
    
    if (workspaceGoalIndex === -1) {
      const newGoal: Goal = {
        id: 'workspace', title: 'Ad-hoc Tasks', category: 'personal', completion: 0, color: '#00FFFF',
        tasks: [newTask]
      };
      return { goals: [...state.goals, newGoal] };
    } else {
      const updatedGoals = [...state.goals];
      updatedGoals[workspaceGoalIndex] = {
        ...updatedGoals[workspaceGoalIndex],
        tasks: [...updatedGoals[workspaceGoalIndex].tasks, newTask]
      };
      // update completion
      const completedTasks = updatedGoals[workspaceGoalIndex].tasks.filter(t => t.done).length;
      updatedGoals[workspaceGoalIndex].completion = Math.round((completedTasks / updatedGoals[workspaceGoalIndex].tasks.length) * 100);
      
      return { goals: updatedGoals };
    }
  }),
}));
