export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type TimePerDay = 15 | 30 | 60 | 90;

export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type ChallengeType = 'mcq' | 'scenario' | 'reflection' | 'coding';

export interface ChallengeOption {
  id: string;
  text: string;
  correct?: boolean;
}

export interface Challenge {
  id: string;
  type: ChallengeType;
  question: string;
  options?: ChallengeOption[];
  correctAnswer?: string;
  explanation: string;
  xp: number;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  difficulty: Difficulty;
  xpReward: number;
  challengeIds: string[];
  completed: boolean;
  day: number;
}

export interface Project {
  id: string;
  title: string;
  goal: string;
  skillsRequired: string[];
  difficulty: Difficulty;
  estimatedHours: number;
  steps: string[];
  xpReward: number;
  completed: boolean;
  milestoneId: string;
}

export interface Milestone {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  estimatedDays: number;
  skills: string[];
  missionCount: number;
  missionIds: string[];
  projectIds: string[];
}

export interface LearningPath {
  id: string;
  title: string;
  emoji: string;
  category: string;
  description: string;
  gradient: string;
  defaultDays: number;
  experience: ExperienceLevel;
  milestones: Milestone[];
  missions: Mission[];
  projects: Project[];
  challenges: Challenge[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (stats: UserStats) => boolean;
}

export interface UserStats {
  totalXp: number;
  missionsCompleted: number;
  projectsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  pathsCompleted: number;
  daysActive: number;
}

export interface UserProgress {
  pathId: string;
  completedMissionIds: string[];
  completedProjectIds: string[];
  xp: number;
  startedAt: string;
  lastActiveDate: string;
}

export interface LevelInfo {
  level: number;
  name: string;
  current: number;
  required: number;
  progress: number;
}
