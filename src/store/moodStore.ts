import { create } from 'zustand';

export type Mood = 'calm' | 'focus' | 'stress' | 'create';

interface MoodState {
  mood: Mood;
  intensity: number;
  introComplete: boolean;
  setMood: (mood: Mood) => void;
  setIntensity: (intensity: number) => void;
  setIntroComplete: (complete: boolean) => void;
}

export const moodColors: Record<Mood, string> = {
  calm: '#4488FF',
  focus: '#00FFFF',
  stress: '#FF3344',
  create: '#FF66AA',
};

export const useMoodStore = create<MoodState>((set) => ({
  mood: 'calm',
  intensity: 50,
  introComplete: false,
  setMood: (mood) => set({ mood }),
  setIntensity: (intensity) => set({ intensity }),
  setIntroComplete: (complete) => set({ introComplete: complete }),
}));
