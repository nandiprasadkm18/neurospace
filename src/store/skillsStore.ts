import { create } from 'zustand';

export interface SkillNode {
  id: string;
  name: string;
  domain: 'Health' | 'Craft' | 'Mind' | 'Wealth' | 'Social' | 'Spirit';
  mastery: number; // 0-100
  locked: boolean;
  parentId?: string;
  x?: number;
  y?: number;
  z?: number;
}

interface SkillsStore {
  skills: SkillNode[];
  level: number;
  xp: number;
  unlockSkill: (id: string) => void;
}

const INITIAL_SKILLS: SkillNode[] = [
  { id: 'root-health', name: 'Health', domain: 'Health', mastery: 65, locked: false },
  { id: 'fitness', name: 'Fitness', domain: 'Health', mastery: 40, locked: false, parentId: 'root-health' },
  { id: 'calisthenics', name: 'Calisthenics', domain: 'Health', mastery: 15, locked: true, parentId: 'fitness' },
  
  { id: 'root-craft', name: 'Craft', domain: 'Craft', mastery: 80, locked: false },
  { id: 'coding', name: 'Neural Code', domain: 'Craft', mastery: 75, locked: false, parentId: 'root-craft' },
  { id: 'shaders', name: 'GLSL Arts', domain: 'Craft', mastery: 45, locked: false, parentId: 'coding' },

  { id: 'root-mind', name: 'Mind', domain: 'Mind', mastery: 50, locked: false },
  { id: 'meditation', name: 'Meditation', domain: 'Mind', mastery: 55, locked: false, parentId: 'root-mind' },
];

export const useSkillsStore = create<SkillsStore>((set) => ({
  skills: INITIAL_SKILLS,
  level: 14,
  xp: 340,
  unlockSkill: (id) => set((s) => ({
    skills: s.skills.map(sk => sk.id === id ? { ...sk, locked: false } : sk)
  })),
}));
