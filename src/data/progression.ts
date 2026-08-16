import type { Achievement, LevelInfo, UserStats } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-mission',
    title: 'First Mission',
    description: 'Complete your first mission',
    icon: 'Trophy',
    condition: (s) => s.missionsCompleted >= 1,
  },
  {
    id: 'streak-3',
    title: '3-Day Streak',
    description: 'Keep a 3-day learning streak',
    icon: 'Flame',
    condition: (s) => s.longestStreak >= 3,
  },
  {
    id: 'streak-7',
    title: '7-Day Streak',
    description: 'Keep a 7-day learning streak',
    icon: 'Zap',
    condition: (s) => s.longestStreak >= 7,
  },
  {
    id: 'missions-10',
    title: '10 Missions Completed',
    description: 'Finish 10 missions',
    icon: 'BookOpen',
    condition: (s) => s.missionsCompleted >= 10,
  },
  {
    id: 'first-project',
    title: 'First Project',
    description: 'Complete your first project',
    icon: 'Rocket',
    condition: (s) => s.projectsCompleted >= 1,
  },
  {
    id: 'path-completed',
    title: 'Path Completed',
    description: 'Finish an entire learning path',
    icon: 'Target',
    condition: (s) => s.pathsCompleted >= 1,
  },
];

export const LEVELS = [
  { name: 'Explorer', xp: 0 },
  { name: 'Apprentice', xp: 500 },
  { name: 'Builder', xp: 1200 },
  { name: 'Practitioner', xp: 2000 },
  { name: 'Specialist', xp: 3000 },
  { name: 'Expert', xp: 4500 },
  { name: 'Master', xp: 6500 },
  { name: 'Pathfinder', xp: 9000 },
];

export function getLevelInfo(totalXp: number): LevelInfo {
  let levelIdx = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (totalXp >= LEVELS[i].xp) levelIdx = i;
    else break;
  }
  const current = LEVELS[levelIdx];
  const next = LEVELS[levelIdx + 1];
  const level = levelIdx + 1;
  if (!next) {
    return { level, name: current.name, current: totalXp, required: current.xp, progress: 100 };
  }
  const xpIntoLevel = totalXp - current.xp;
  const xpForLevel = next.xp - current.xp;
  return {
    level,
    name: current.name,
    current: xpIntoLevel,
    required: xpForLevel,
    progress: Math.min(100, Math.round((xpIntoLevel / xpForLevel) * 100)),
  };
}
