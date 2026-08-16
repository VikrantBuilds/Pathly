import { useApp } from '../context/AppContext';
import { PageHeader, ProgressBar } from '../components/ui';
import { Check, Lock, Clock, Target, ArrowDown } from 'lucide-react';

const COLOR_MAP: Record<string, { bg: string; text: string; border: string; bar: string }> = {
  emerald: { bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-300 dark:border-emerald-500/30', bar: 'bg-emerald-500' },
  blue: { bg: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-300 dark:border-blue-500/30', bar: 'bg-blue-500' },
  purple: { bg: 'bg-purple-50 dark:bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-300 dark:border-purple-500/30', bar: 'bg-purple-500' },
  orange: { bg: 'bg-orange-50 dark:bg-orange-500/10', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-300 dark:border-orange-500/30', bar: 'bg-orange-500' },
  amber: { bg: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-300 dark:border-amber-500/30', bar: 'bg-amber-500' },
};

export function RoadmapPage() {
  const { activePath, completedMissions, navigate } = useApp();

  if (!activePath) return null;

  const milestones = activePath.milestones;

  // Determine milestone status — compute sequentially to allow each milestone
  // to check the previous milestone's status without a self-referencing array
  type MilestoneStatus = { status: 'complete' | 'available' | 'locked'; progress: number };
  const milestoneStatus: MilestoneStatus[] = [];
  for (let i = 0; i < milestones.length; i++) {
    const m = milestones[i];
    if (m.missionIds.length === 0) {
      const prevDone = i === 0 || milestoneStatus[i - 1].status === 'complete';
      milestoneStatus.push({ status: prevDone ? 'available' : 'locked', progress: 0 });
      continue;
    }
    const done = m.missionIds.filter((id) => completedMissions.includes(id)).length;
    const total = m.missionIds.length;
    const isComplete = done === total;
    const prevComplete = i === 0 || milestoneStatus[i - 1].status === 'complete';
    const isLocked = !isComplete && !prevComplete && done === 0;
    milestoneStatus.push({
      status: isComplete ? 'complete' : isLocked ? 'locked' : 'available',
      progress: total > 0 ? Math.round((done / total) * 100) : 0,
    });
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 lg:px-6 lg:py-8">
      <PageHeader title="Your Roadmap" subtitle={`${activePath.emoji} ${activePath.title} — ${activePath.defaultDays} day journey`}>
        <button onClick={() => navigate('missions')} className="btn-secondary hidden sm:inline-flex">
          <Target size={16} />
          View Missions
        </button>
      </PageHeader>

      {/* Goal card */}
      <div className={`card relative overflow-hidden p-6 animate-fade-in`}>
        <div className={`absolute inset-0 bg-gradient-to-r ${activePath.gradient} opacity-5`} />
        <div className="relative flex items-center gap-4">
          <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${activePath.gradient} text-3xl shadow-lg`}>
            🎯
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-subtle">Your Goal</p>
            <h2 className="text-2xl font-extrabold text-[rgb(var(--text))]">{activePath.title}</h2>
            <p className="text-sm text-muted">{activePath.description}</p>
          </div>
        </div>
      </div>

      {/* Milestone path */}
      <div className="mt-6 space-y-0">
        {milestones.map((m, i) => {
          const status = milestoneStatus[i];
          const colors = COLOR_MAP[m.color] ?? COLOR_MAP.blue;
          const isComplete = status.status === 'complete';
          const isLocked = status.status === 'locked';
          const isAvailable = status.status === 'available';

          return (
            <div key={m.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
              {/* Milestone Card */}
              <div
                className={`card relative overflow-hidden p-6 transition-all ${
                  isLocked ? 'opacity-60' : isComplete ? `${colors.border}` : isAvailable ? 'shadow-glow' : ''
                }`}
              >
                {isComplete && <div className={`absolute inset-0 ${colors.bg} opacity-50`} />}

                <div className="relative flex items-start gap-4">
                  {/* Status Icon */}
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl shadow-md ${
                    isComplete ? `${colors.bg} ${colors.text}` : isLocked ? 'bg-[rgb(var(--bg-soft))] text-subtle' : `${colors.bg} ${colors.text}`
                  }`}>
                    {isComplete ? (
                      <Check size={24} className={colors.text} />
                    ) : isLocked ? (
                      <Lock size={20} />
                    ) : (
                      m.icon
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-[rgb(var(--text))]">
                        Level {i + 1} — {m.title}
                      </h3>
                      {isComplete && (
                        <span className={`chip ${colors.bg} ${colors.text}`}>
                          <Check size={12} />
                          Complete
                        </span>
                      )}
                      {isAvailable && (
                        <span className="chip bg-primary-100 text-primary-700 dark:bg-primary-500/15 dark:text-primary-300">
                          Available
                        </span>
                      )}
                      {isLocked && (
                        <span className="chip bg-[rgb(var(--bg-soft))] text-subtle">
                          <Lock size={12} />
                          Locked
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-sm text-muted">{m.subtitle}</p>

                    {/* Stats */}
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted">
                      <span className="flex items-center gap-1.5">
                        <Clock size={13} />
                        {m.estimatedDays} days
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Target size={13} />
                        {m.missionCount} missions
                      </span>
                      {!isLocked && m.projectIds.length > 0 && (
                        <span className="flex items-center gap-1.5">
                          <span>📁</span>
                          {m.projectIds.length} project{m.projectIds.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>

                    {/* Skills */}
                    {!isLocked && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {m.skills.map((skill) => (
                          <span key={skill} className={`chip ${colors.bg} ${colors.text}`}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Progress */}
                    {!isLocked && m.missionIds.length > 0 && (
                      <div className="mt-4">
                        <div className="mb-1.5 flex items-center justify-between text-xs">
                          <span className="text-muted">Progress</span>
                          <span className="font-bold text-[rgb(var(--text))]">{status.progress}%</span>
                        </div>
                        <ProgressBar value={status.progress} color={m.color as 'emerald' | 'blue' | 'purple' | 'orange' | 'amber'} size="sm" />
                      </div>
                    )}

                    {/* Action button */}
                    {isAvailable && (
                      <button
                        onClick={() => navigate('missions')}
                        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400"
                      >
                        Continue learning
                        <ArrowDown size={14} className="rotate-[-90deg]" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Connector Line */}
              {i < milestones.length - 1 && (
                <div className="flex justify-center py-3">
                  <div className={`h-8 w-0.5 rounded-full ${isComplete ? colors.bar : 'bg-[rgb(var(--border))]'}`} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Final achievement */}
      <div className="mt-6 card relative overflow-hidden p-6 text-center animate-fade-in">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 to-orange-500/10" />
        <div className="relative">
          <div className="text-4xl">🏆</div>
          <h3 className="mt-2 text-lg font-bold text-[rgb(var(--text))]">Path Complete</h3>
          <p className="mt-1 text-sm text-muted">
            Finish all milestones to complete your path and earn the Path Completed achievement.
          </p>
        </div>
      </div>
    </div>
  );
}
