import { create } from 'zustand';

export type AIState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'error';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface AIStore {
  state: AIState;
  messages: Message[];
  setState: (state: AIState) => void;
  addMessage: (content: string, role: 'user' | 'assistant') => void;
}

export const useAIStore = create<AIStore>((set) => ({
  state: 'idle',
  messages: [
    { id: '1', role: 'assistant', content: "Welcome to the Neural Core. I am ARIA. How shall we expand your consciousness today?", timestamp: Date.now() }
  ],
  setState: (state) => set({ state }),
  addMessage: (content, role) => set((s) => ({
    messages: [...s.messages, { id: Math.random().toString(36), role, content, timestamp: Date.now() }]
  })),
}));
