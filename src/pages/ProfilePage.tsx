import { useApp } from '../context/AppContext';
import { PageHeader, ProgressBar, ProgressRing } from '../components/ui';
import { ACHIEVEMENTS } from '../data/progression';
import { getLevelInfo } from '../data/progression';
import { Flame, Target, Trophy, Zap, Clock, Award, LogOut, ChevronRight } from 'lucide-react';

export function ProfilePage() {
  const { activePath, totalXp, streak, longestStreak, completedMissions, completedProjects, unlockedAchievements, resetProgress, navigate } = useApp();

  if (!activePath) return null;

  const levelInfo = getLevelInfo(totalXp);
  const totalMissions = activePath.missions.length;
  const completedMissionsCount = completedMissions.length;
  const totalProjects = activePath.projects.length;
  const completedProjectsCount = completedProjects.length;
  const overallProgress = totalMissions > 0 ? Math.round((completedMissionsCount / totalMissions) * 100) : 0;

  const stats = [
    { icon: Target, label: 'Missions Completed', value: `${completedMissionsCount}/${totalMissions}`, color: 'primary' },
    { icon: Trophy, label: 'Projects Completed', value: `${completedProjectsCount}/${totalProjects}`, color: 'accent' },
    { icon: Flame, label: 'Current Streak', value: `${streak} days`, color: 'error' },
    { icon: Zap, label: 'Longest Streak', value: `${longestStreak} days`, color: 'warning' },
  ];

  const unlockedAch = ACHIEVEMENTS.filter((a) => unlockedAchievements.includes(a.id));

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 lg:px-6 lg:py-8">
      <PageHeader title="Profile" subtitle="Your learning journey at a glance.">
        <button onClick={resetProgress} className="btn-secondary !text-error-600 dark:!text-error-400">
          <LogOut size={16} />
          Reset
        </button>
      </PageHeader>

      {/* Profile Card */}
      <div className="card relative overflow-hidden p-6 animate-fade-in lg:p-8">
        <div className={`absolute inset-0 bg-gradient-to-br ${activePath.gradient} opacity-5`} />
        <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div className={`flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br ${activePath.gradient} text-4xl shadow-xl`}>
            {activePath.emoji}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-extrabold text-[rgb(var(--text))]">{activePath.title}</h2>
            <p className="text-muted">{activePath.category}</p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <span className="chip bg-primary-100 text-primary-700 dark:bg-primary-500/15 dark:text-primary-300">
                Level {levelInfo.level} · {levelInfo.name}
              </span>
              <span className="chip bg-accent-100 text-accent-700 dark:bg-accent-500/15 dark:text-accent-300">
                {totalXp.toLocaleString()} XP
              </span>
              <span className="chip bg-error-100 text-error-700 dark:bg-error-500/15 dark:text-error-300">
                <Flame size={12} /> {streak} day streak
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Level Progress Ring */}
      <div className="mt-4 card flex flex-col items-center p-6 animate-fade-in sm:flex-row sm:gap-8" style={{ animationDelay: '0.05s' }}>
        <ProgressRing progress={levelInfo.progress} size={140} strokeWidth={12} color="#1c80f5">
          <div className="text-center">
            <div className="text-3xl font-extrabold text-[rgb(var(--text))]">{levelInfo.level}</div>
            <div className="text-xs text-muted">Level</div>
          </div>
        </ProgressRing>
        <div className="mt-4 flex-1 sm:mt-0">
          <h3 className="text-lg font-bold text-[rgb(var(--text))]">{levelInfo.name}</h3>
          <p className="text-sm text-muted">{levelInfo.current} / {levelInfo.required} XP to next level</p>
          <div className="mt-3">
            <ProgressBar value={levelInfo.current} max={levelInfo.required} size="md" />
          </div>
          <p className="mt-2 text-xs text-subtle">{levelInfo.required - levelInfo.current} XP until you reach the next level</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          const colorMap: Record<string, string> = {
            primary: 'bg-primary-50 text-primary-600 dark:bg-primary-500/15 dark:text-primary-400',
            accent: 'bg-accent-50 text-accent-600 dark:bg-accent-500/15 dark:text-accent-400',
            error: 'bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-400',
            warning: 'bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-400',
          };
          return (
            <div key={stat.label} className="card p-4 animate-fade-in" style={{ animationDelay: `${0.1 + i * 0.05}s` }}>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colorMap[stat.color]}`}>
                <Icon size={18} />
              </div>
              <p className="mt-3 text-2xl font-extrabold text-[rgb(var(--text))]">{stat.value}</p>
              <p className="text-xs text-muted">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Overall Progress */}
      <div className="mt-4 card p-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[rgb(var(--text))]">Overall Path Progress</h3>
          <span className="text-2xl font-extrabold text-primary-600 dark:text-primary-400">{overallProgress}%</span>
        </div>
        <div className="mt-3">
          <ProgressBar value={overallProgress} size="lg" />
        </div>
      </div>

      {/* Achievements Summary */}
      <div className="mt-4 card p-6 animate-fade-in" style={{ animationDelay: '0.35s' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award size={18} className="text-accent-500" />
            <h3 className="text-lg font-bold text-[rgb(var(--text))]">Achievements</h3>
          </div>
          <button onClick={() => navigate('achievements')} className="btn-ghost">
            View all
            <ChevronRight size={14} />
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          {ACHIEVEMENTS.map((a) => {
            const isUnlocked = unlockedAchievements.includes(a.id);
            return (
              <div
                key={a.id}
                className={`flex items-center gap-2 rounded-xl border p-3 ${
                  isUnlocked ? 'border-accent-300 bg-accent-50 dark:border-accent-500/30 dark:bg-accent-500/10' : 'border-app opacity-60'
                }`}
              >
                <span className="text-xl">{isUnlocked ? '🏆' : '🔒'}</span>
                <div>
                  <p className={`text-sm font-bold ${isUnlocked ? 'text-[rgb(var(--text))]' : 'text-muted'}`}>{a.title}</p>
                  <p className="text-xs text-muted">{a.description}</p>
                </div>
              </div>
            );
          })}
        </div>
        {unlockedAch.length === 0 && (
          <p className="mt-3 text-sm text-muted">Complete missions and projects to unlock achievements!</p>
        )}
      </div>

      {/* Path Info */}
      <div className="mt-4 card p-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <h3 className="text-lg font-bold text-[rgb(var(--text))]">Path Details</h3>
        <div className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between border-b border-app pb-2">
            <span className="text-muted">Path</span>
            <span className="font-semibold text-[rgb(var(--text))]">{activePath.title}</span>
          </div>
          <div className="flex justify-between border-b border-app pb-2">
            <span className="text-muted">Duration</span>
            <span className="font-semibold text-[rgb(var(--text))]">{activePath.defaultDays} days</span>
          </div>
          <div className="flex justify-between border-b border-app pb-2">
            <span className="flex items-center gap-1 text-muted"><Clock size={13} /> Milestones</span>
            <span className="font-semibold text-[rgb(var(--text))]">{activePath.milestones.length} levels</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Experience Level</span>
            <span className="font-semibold text-[rgb(var(--text))]">{activePath.experience}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
