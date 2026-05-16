import { create } from 'zustand';

export interface Milestone {
  id: string;
  title: string;
  status: 'locked' | 'active' | 'done';
}

export interface Vision {
  fiveYearHorizon: string;
  fiveYearDescription: string;
  oneYearObjective: string;
}

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
  vision: Vision;
  milestones: Milestone[];
  toggleTaskStatus: (goalId: string, taskId: string) => void;
  addMemory: (memory: Omit<Memory, 'id' | 'date'>) => void;
  logFocusSession: (hours: number) => void;
  addWorkspaceTask: (title: string) => void;
  addTaskToGoal: (goalId: string, title: string) => void;
  updateVision: (updates: Partial<Vision>) => void;
  addMilestone: (title: string) => void;
  cycleMilestoneStatus: (id: string) => void;
  addGoal: (title: string, category: Goal['category']) => void;
}

const GOALS: Goal[] = [];
const MEMORIES: Memory[] = [];

const INITIAL_VISION: Vision = {
  fiveYearHorizon: '',
  fiveYearDescription: '',
  oneYearObjective: ''
};

const INITIAL_MILESTONES: Milestone[] = [];

const generateEmptyHabitGrid = (): number[][] => {
  const grid: number[][] = [];
  for (let w = 0; w < 52; w++) {
    const week: number[] = [];
    for (let d = 0; d < 7; d++) {
      week.push(0);
    }
    grid.push(week);
  }
  return grid;
};

export const useDataStore = create<DataState>()((set) => ({
  goals: GOALS,
  memories: MEMORIES,
  focusSessions: [],
  habitGrid: generateEmptyHabitGrid(),
  focusScore: 0,
  habitsComplete: 0,
  habitsTotal: 0,
  energy: 'STABLE',
  vision: INITIAL_VISION,
  milestones: INITIAL_MILESTONES,
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
  addTaskToGoal: (goalId, title) => set((state) => {
    const updatedGoals = state.goals.map(g => {
      if (g.id === goalId) {
        const newTask = { id: Math.random().toString(36).substr(2, 9), title, done: false };
        const updatedTasks = [...g.tasks, newTask];
        const completed = updatedTasks.filter(t => t.done).length;
        return { ...g, tasks: updatedTasks, completion: Math.round((completed / updatedTasks.length) * 100) };
      }
      return g;
    });
    return { goals: updatedGoals };
  }),
  updateVision: (updates) => set((state) => ({ vision: { ...state.vision, ...updates } })),
  addMilestone: (title) => set((state) => ({
    milestones: [...state.milestones, { id: Math.random().toString(36).substr(2, 9), title, status: 'locked' }]
  })),
  cycleMilestoneStatus: (id) => set((state) => {
    const updated = state.milestones.map(m => {
      if (m.id === id) {
        let nextStatus: 'locked' | 'active' | 'done' = 'active';
        if (m.status === 'locked') nextStatus = 'active';
        else if (m.status === 'active') nextStatus = 'done';
        else if (m.status === 'done') nextStatus = 'locked';
        return { ...m, status: nextStatus };
      }
      return m;
    });
    return { milestones: updated };
  }),
  addGoal: (title, category) => set((state) => {
    const colors = { health: '#00FF88', career: '#00FFFF', creative: '#FF00FF', finance: '#FFD700', personal: '#FF66AA' };
    const newGoal: Goal = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      category,
      completion: 0,
      tasks: [],
      color: colors[category] || '#ffffff'
    };
    return { goals: [...state.goals, newGoal] };
  }),
}));
