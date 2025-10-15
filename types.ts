
export interface SubSkill {
  id: string;
  name: string;
  progress: number; // 0-5
  description: string;
  progression: string;
  youtubeLinks: string[];
}

export interface Skill {
  id: string;
  name: string;
  subSkills: SubSkill[];
}

export interface Sport {
  id: string;
  name: string;
  skills: Skill[];
}

export interface TrainingExercise {
  id: string;
  skillId?: string; // Link to a skill
  subSkillId?: string; // Link to a sub-skill
  customName?: string;
  sets?: number;
  reps?: number;
  duration?: number; // in seconds
  youtubeLinks?: string[];
}

export interface TrainingSession {
  id: string;
  date: string;
  title: string;
  duration: number; // in minutes
  exercises: TrainingExercise[];
  notes: string;
  performance: 'Bom' | 'Ok' | 'Ruim' | null;
  isCompleted: boolean;
  youtubeLinks?: string[];
}