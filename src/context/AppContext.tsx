import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { LearningPath, UserProgress, UserStats } from '../types';
import { PREDEFINED_PATHS, getPathById } from '../data/paths';
import { ACHIEVEMENTS } from '../data/progression';

type Theme = 'light' | 'dark';

export type Page =
  | 'landing'
  | 'onboarding'
  | 'dashboard'
  | 'roadmap'
  | 'missions'
  | 'projects'
  | 'explore'
  | 'achievements'
  | 'profile';

interface AppState {
  theme: Theme;
  toggleTheme: () => void;

  page: Page;
  navigate: (page: Page) => void;

  activePath: LearningPath | null;
  progress: UserProgress | null;
  customPaths: LearningPath[];

  startPath: (pathId: string) => void;
  startCustomPath: (goal: string, timePerDay: number, level: string) => void;
  resetProgress: () => void;

  completedMissions: string[];
  completedProjects: string[];
  totalXp: number;
  streak: number;
  longestStreak: number;

  completeMission: (missionId: string, xpReward: number) => void;
  completeProject: (projectId: string, xpReward: number) => void;

  stats: UserStats;
  unlockedAchievements: string[];
  newlyUnlocked: string[];
  clearNewlyUnlocked: () => void;
}

const AppContext = createContext<AppState | null>(null);

const STORAGE_KEY = 'pathly-state-v1';

interface StoredState {
  theme: Theme;
  activePathId: string | null;
  progress: UserProgress | null;
  customPaths: LearningPath[];
  completedMissions: string[];
  completedProjects: string[];
  totalXp: number;
  streak: number;
  longestStreak: number;
  lastActiveDate: string;
}

function loadState(): StoredState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredState;
  } catch {
    return null;
  }
}

function saveState(state: StoredState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

function daysBetween(a: string, b: string) {
  const d1 = new Date(a + 'T00:00:00');
  const d2 = new Date(b + 'T00:00:00');
  return Math.round((d2.getTime() - d1.getTime()) / 86400000);
}

export function AppProvider({ children }: { children: ReactNode }) {
  const stored = loadState();

  const [theme, setTheme] = useState<Theme>(stored?.theme ?? 'light');
  const [page, setPage] = useState<Page>(stored?.activePathId ? 'dashboard' : 'landing');
  const [activePathId, setActivePathId] = useState<string | null>(stored?.activePathId ?? null);
  const [progress, setProgress] = useState<UserProgress | null>(stored?.progress ?? null);
  const [customPaths, setCustomPaths] = useState<LearningPath[]>(stored?.customPaths ?? []);
  const [completedMissions, setCompletedMissions] = useState<string[]>(stored?.completedMissions ?? []);
  const [completedProjects, setCompletedProjects] = useState<string[]>(stored?.completedProjects ?? []);
  const [totalXp, setTotalXp] = useState<number>(stored?.totalXp ?? 0);
  const [streak, setStreak] = useState<number>(stored?.streak ?? 0);
  const [longestStreak, setLongestStreak] = useState<number>(stored?.longestStreak ?? 0);
  const [lastActiveDate, setLastActiveDate] = useState<string>(stored?.lastActiveDate ?? todayStr());
  const [newlyUnlocked, setNewlyUnlocked] = useState<string[]>([]);

  const activePath: LearningPath | null = (() => {
    if (!activePathId) return null;
    return getPathById(activePathId) ?? customPaths.find((p) => p.id === activePathId) ?? null;
  })();

  // Theme management
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [theme]);

  // Persist state
  useEffect(() => {
    saveState({
      theme,
      activePathId,
      progress,
      customPaths,
      completedMissions,
      completedProjects,
      totalXp,
      streak,
      longestStreak,
      lastActiveDate,
    });
  }, [theme, activePathId, progress, customPaths, completedMissions, completedProjects, totalXp, streak, longestStreak, lastActiveDate]);

  const stats: UserStats = {
    totalXp,
    missionsCompleted: completedMissions.length,
    projectsCompleted: completedProjects.length,
    currentStreak: streak,
    longestStreak,
    pathsCompleted: activePath && activePath.missions.length > 0
      ? activePath.missions.every((m) => completedMissions.includes(m.id)) ? 1 : 0
      : 0,
    daysActive: streak,
  };

  const unlockedAchievements = ACHIEVEMENTS.filter((a) => a.condition(stats)).map((a) => a.id);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  }, []);

  const navigate = useCallback((p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const startPath = useCallback((pathId: string) => {
    const path = getPathById(pathId);
    if (!path) return;
    setActivePathId(pathId);
    setProgress({
      pathId,
      completedMissionIds: [],
      completedProjectIds: [],
      xp: 0,
      startedAt: todayStr(),
      lastActiveDate: todayStr(),
    });
    setCompletedMissions([]);
    setCompletedProjects([]);
    setTotalXp(0);
    setStreak(1);
    setLongestStreak(1);
    setLastActiveDate(todayStr());
    setPage('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const startCustomPath = useCallback((goal: string, timePerDay: number, level: string) => {
    // Generate custom path inline
    const id = 'custom-' + goal.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30);
    const estimatedDays = Math.round(60 * (timePerDay / 30));
    const basePath = PREDEFINED_PATHS[0]; // use python missions as template for custom
    const customPath: LearningPath = {
      ...basePath,
      id,
      title: goal.charAt(0).toUpperCase() + goal.slice(1),
      emoji: '🎯',
      category: 'Custom Path',
      description: `Your personalized learning path to ${goal}.`,
      gradient: 'from-primary-500 to-primary-700',
      defaultDays: estimatedDays,
      experience: level as 'Beginner' | 'Intermediate' | 'Advanced',
      milestones: basePath.milestones.map((m, i) => ({
        ...m,
        id: `${id}-m${i + 1}`,
        title: ['Foundations', 'Core Skills', 'Practice & Application', 'Advanced Projects', 'Final Challenge'][i] ?? m.title,
        subtitle: ['Build core knowledge', 'Develop essential abilities', 'Apply what you learned', 'Build and create', 'Showcase your mastery'][i] ?? m.subtitle,
        estimatedDays: Math.round(estimatedDays * [0.2, 0.25, 0.25, 0.2, 0.1][i]),
        missionIds: [],
        projectIds: [],
      })),
      missions: basePath.missions.map((m) => ({ ...m, id: `${id}-${m.id}` })),
      projects: basePath.projects.map((p) => ({ ...p, id: `${id}-${p.id}`, milestoneId: `${id}-m${p.milestoneId.split('-').pop()}` })),
      challenges: basePath.challenges.map((c) => ({ ...c, id: `${id}-${c.id}` })),
    };
    // Fix mission challenge references
    customPath.missions = customPath.missions.map((m) => ({
      ...m,
      challengeIds: m.challengeIds.map((cId) => `${id}-${cId}`),
    }));

    setCustomPaths((prev) => [...prev.filter((p) => p.id !== id), customPath]);
    setActivePathId(id);
    setProgress({
      pathId: id,
      completedMissionIds: [],
      completedProjectIds: [],
      xp: 0,
      startedAt: todayStr(),
      lastActiveDate: todayStr(),
    });
    setCompletedMissions([]);
    setCompletedProjects([]);
    setTotalXp(0);
    setStreak(1);
    setLongestStreak(1);
    setLastActiveDate(todayStr());
    setPage('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const resetProgress = useCallback(() => {
    setActivePathId(null);
    setProgress(null);
    setCompletedMissions([]);
    setCompletedProjects([]);
    setTotalXp(0);
    setStreak(0);
    setLongestStreak(0);
    setNewlyUnlocked([]);
    setPage('landing');
  }, []);

  const updateStreak = useCallback(() => {
    const today = todayStr();
    if (lastActiveDate === today) return;
    const diff = daysBetween(lastActiveDate, today);
    if (diff === 1) {
      setStreak((s) => {
        const newStreak = s + 1;
        setLongestStreak((l) => Math.max(l, newStreak));
        return newStreak;
      });
    } else if (diff > 1) {
      setStreak(1);
    }
    setLastActiveDate(today);
  }, [lastActiveDate]);

  const completeMission = useCallback((missionId: string, xpReward: number) => {
    if (completedMissions.includes(missionId)) return;
    setCompletedMissions((prev) => [...prev, missionId]);
    setTotalXp((prev) => prev + xpReward);
    setProgress((prev) => prev ? { ...prev, xp: prev.xp + xpReward, lastActiveDate: todayStr() } : prev);
    updateStreak();
  }, [completedMissions, updateStreak]);

  const completeProject = useCallback((projectId: string, xpReward: number) => {
    if (completedProjects.includes(projectId)) return;
    setCompletedProjects((prev) => [...prev, projectId]);
    setTotalXp((prev) => prev + xpReward);
    setProgress((prev) => prev ? { ...prev, xp: prev.xp + xpReward } : prev);
    updateStreak();
  }, [completedProjects, updateStreak]);

  const clearNewlyUnlocked = useCallback(() => setNewlyUnlocked([]), []);

  const value: AppState = {
    theme,
    toggleTheme,
    page,
    navigate,
    activePath,
    progress,
    customPaths,
    startPath,
    startCustomPath,
    resetProgress,
    completedMissions,
    completedProjects,
    totalXp,
    streak,
    longestStreak,
    completeMission,
    completeProject,
    stats,
    unlockedAchievements,
    newlyUnlocked,
    clearNewlyUnlocked,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
