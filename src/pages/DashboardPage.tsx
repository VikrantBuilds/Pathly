import { useApp } from '../context/AppContext';
import { ProgressBar, ProgressRing, DifficultyBadge, XpBadge } from '../components/ui';
import { getLevelInfo } from '../data/progression';
import { Flame, Target, ArrowRight, Route, Trophy, Zap, TrendingUp, Clock } from 'lucide-react';

export function DashboardPage() {
  const { activePath, navigate, totalXp, streak, completedMissions, completedProjects } = useApp();

  if (!activePath) return null;

  const levelInfo = getLevelInfo(totalXp);
  const totalMissions = activePath.missions.length;
  const completedCount = activePath.missions.filter((m) => completedMissions.includes(m.id)).length;
  const overallProgress = totalMissions > 0 ? Math.round((completedCount / totalMissions) * 100) : 0;

  // Find next uncompleted mission
  const nextMission = activePath.missions.find((m) => !completedMissions.includes(m.id));

  // Current milestone
  const currentMilestone = activePath.milestones.find((m) =>
    m.missionIds.some((mid) => !completedMissions.includes(mid))
  ) ?? activePath.milestones[activePath.milestones.length - 1];

  const milestoneProgress = (() => {
    if (!currentMilestone || currentMilestone.missionIds.length === 0) return 0;
    const done = currentMilestone.missionIds.filter((id) => completedMissions.includes(id)).length;
    return Math.round((done / currentMilestone.missionIds.length) * 100);
  })();

  const completedProjectsCount = activePath.projects.filter((p) => completedProjects.includes(p.id)).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
      {/* Welcome */}
      <div className="mb-6 animate-fade-in">
        <h1 className="text-2xl font-extrabold tracking-tight text-[rgb(var(--text))] sm:text-3xl">Welcome back!</h1>
        <p className="mt-1 text-muted">Keep going — you are making great progress.</p>
      </div>

      {/* Top Cards Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Goal & Level */}
        <div className="card relative overflow-hidden p-6 animate-fade-in">
          <div className={`absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br ${activePath.gradient} opacity-10 blur-2xl`} />
          <div className="relative">
            <div className="flex items-center gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${activePath.gradient} text-2xl shadow-lg`}>
                {activePath.emoji}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-subtle">Current Goal</p>
                <p className="text-lg font-bold text-[rgb(var(--text))]">{activePath.title}</p>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2">
              <span className="chip bg-primary-100 text-primary-700 dark:bg-primary-500/15 dark:text-primary-300">
                Level {levelInfo.level}
              </span>
              <span className="chip bg-[rgb(var(--bg-soft))] text-muted">
                {levelInfo.name}
              </span>
            </div>

            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="text-muted">Overall Progress</span>
                <span className="font-bold text-[rgb(var(--text))]">{overallProgress}%</span>
              </div>
              <ProgressBar value={overallProgress} size="lg" />
            </div>
          </div>
        </div>

        {/* XP Ring */}
        <div className="card flex flex-col items-center justify-center p-6 animate-fade-in" style={{ animationDelay: '0.05s' }}>
          <ProgressRing progress={levelInfo.progress} size={130} strokeWidth={10} color="#1c80f5">
            <div className="text-center">
              <div className="text-2xl font-extrabold text-[rgb(var(--text))]">{levelInfo.current}</div>
              <div className="text-xs text-muted">/ {levelInfo.required} XP</div>
            </div>
          </ProgressRing>
          <p className="mt-3 text-sm font-semibold text-[rgb(var(--text))]">Total: {totalXp.toLocaleString()} XP</p>
          <p className="text-xs text-muted">{levelInfo.required - levelInfo.current} XP to next level</p>
        </div>

        {/* Streak & Stats */}
        <div className="card p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-100 text-accent-600 dark:bg-accent-500/15 dark:text-accent-400">
                <Flame size={20} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[rgb(var(--text))]">{streak}</p>
                <p className="text-xs text-muted">day streak</p>
              </div>
            </div>
            <div className="text-3xl">🔥</div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-[rgb(var(--bg-soft))] p-3">
              <div className="flex items-center gap-1.5 text-muted">
                <Target size={14} />
                <span className="text-xs font-medium">Missions</span>
              </div>
              <p className="mt-1 text-lg font-bold text-[rgb(var(--text))]">{completedCount}/{totalMissions}</p>
            </div>
            <div className="rounded-xl bg-[rgb(var(--bg-soft))] p-3">
              <div className="flex items-center gap-1.5 text-muted">
                <Trophy size={14} />
                <span className="text-xs font-medium">Projects</span>
              </div>
              <p className="mt-1 text-lg font-bold text-[rgb(var(--text))]">{completedProjectsCount}/{activePath.projects.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Mission */}
      {nextMission && (
        <div className="mt-4 card relative overflow-hidden p-6 animate-fade-in lg:p-8" style={{ animationDelay: '0.15s' }}>
          <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-primary-500/10 blur-3xl" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="chip bg-accent-100 text-accent-700 dark:bg-accent-500/15 dark:text-accent-300">
                  🔥 Today's Mission
                </span>
                <span className="chip bg-[rgb(var(--bg-soft))] text-muted">
                  Day {nextMission.day}
                </span>
              </div>
              <h2 className="mt-3 text-2xl font-extrabold text-[rgb(var(--text))]">{nextMission.title}</h2>
              <p className="mt-2 max-w-xl text-muted">{nextMission.description}</p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5 text-sm text-muted">
                  <Clock size={15} />
                  {nextMission.estimatedMinutes} min
                </span>
                <DifficultyBadge difficulty={nextMission.difficulty} />
                <XpBadge xp={nextMission.xpReward} />
              </div>
            </div>

            <div className="flex flex-col gap-2 lg:flex-row">
              <button onClick={() => navigate('missions')} className="btn-primary">
                START MISSION
                <ArrowRight size={16} />
              </button>
              <button onClick={() => navigate('roadmap')} className="btn-secondary">
                <Route size={16} />
                VIEW ROADMAP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Current Milestone & Quick Actions */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Current Milestone */}
        <div className="card p-6 animate-fade-in lg:col-span-2" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-subtle">Current Milestone</p>
              <h3 className="mt-1 text-xl font-bold text-[rgb(var(--text))]">{currentMilestone?.icon} {currentMilestone?.title}</h3>
              <p className="text-sm text-muted">{currentMilestone?.subtitle}</p>
            </div>
            <button onClick={() => navigate('roadmap')} className="btn-ghost shrink-0">
              View all
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="text-muted">Milestone Progress</span>
              <span className="font-bold text-[rgb(var(--text))]">{milestoneProgress}%</span>
            </div>
            <ProgressBar value={milestoneProgress} color="emerald" />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {currentMilestone?.skills.map((skill) => (
              <span key={skill} className="chip bg-[rgb(var(--bg-soft))] text-muted">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="card p-6 animate-fade-in" style={{ animationDelay: '0.25s' }}>
          <h3 className="text-lg font-bold text-[rgb(var(--text))]">Quick Actions</h3>
          <div className="mt-4 space-y-2">
            <button onClick={() => navigate('missions')} className="flex w-full items-center gap-3 rounded-xl border border-app p-3 text-left transition-colors hover:bg-[rgb(var(--bg-soft))]">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-500/15 dark:text-primary-400">
                <Target size={18} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[rgb(var(--text))]">Missions</p>
                <p className="text-xs text-muted">{totalMissions - completedCount} remaining</p>
              </div>
              <ArrowRight size={16} className="text-subtle" />
            </button>

            <button onClick={() => navigate('projects')} className="flex w-full items-center gap-3 rounded-xl border border-app p-3 text-left transition-colors hover:bg-[rgb(var(--bg-soft))]">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-50 text-accent-600 dark:bg-accent-500/15 dark:text-accent-400">
                <Trophy size={18} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[rgb(var(--text))]">Projects</p>
                <p className="text-xs text-muted">{activePath.projects.length - completedProjectsCount} to build</p>
              </div>
              <ArrowRight size={16} className="text-subtle" />
            </button>

            <button onClick={() => navigate('achievements')} className="flex w-full items-center gap-3 rounded-xl border border-app p-3 text-left transition-colors hover:bg-[rgb(var(--bg-soft))]">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-400">
                <Zap size={18} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[rgb(var(--text))]">Achievements</p>
                <p className="text-xs text-muted">View your badges</p>
              </div>
              <ArrowRight size={16} className="text-subtle" />
            </button>
          </div>
        </div>
      </div>

      {/* XP Trend */}
      <div className="mt-4 card p-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-center gap-2">
          <TrendingUp size={18} className="text-primary-500" />
          <h3 className="text-lg font-bold text-[rgb(var(--text))]">Learning Journey</h3>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {activePath.milestones.map((m, i) => {
            const mCompleted = m.missionIds.length > 0 && m.missionIds.every((id) => completedMissions.includes(id));
            const mInProgress = m.missionIds.some((id) => !completedMissions.includes(id)) && m.missionIds.some((id) => completedMissions.includes(id));
            return (
              <div key={m.id} className={`rounded-xl border p-3 ${mCompleted ? 'border-success-300 bg-success-50 dark:border-success-500/30 dark:bg-success-500/10' : mInProgress ? 'border-primary-300 bg-primary-50 dark:border-primary-500/30 dark:bg-primary-500/10' : 'border-app'}`}>
                <div className="text-2xl">{m.icon}</div>
                <p className="mt-1 text-sm font-bold text-[rgb(var(--text))]">{m.title}</p>
                <p className="text-xs text-muted">{m.missionCount} missions</p>
                {mCompleted && <p className="mt-1 text-xs font-semibold text-success-600 dark:text-success-400">Complete</p>}
                {mInProgress && <p className="mt-1 text-xs font-semibold text-primary-600 dark:text-primary-400">In progress</p>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
