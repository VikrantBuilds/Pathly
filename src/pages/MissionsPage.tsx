import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader, DifficultyBadge, XpBadge, ProgressBar, Confetti } from '../components/ui';
import type { Challenge, Mission } from '../types';
import { Check, Clock, Play, ChevronRight, ArrowLeft, Lightbulb, Award, RefreshCw } from 'lucide-react';

export function MissionsPage() {
  const { activePath, completedMissions, completeMission, navigate } = useApp();
  const [activeMission, setActiveMission] = useState<Mission | null>(null);

  if (!activePath) return null;

  if (activeMission) {
    return (
      <MissionDetail
        mission={activeMission}
        challenges={activePath.challenges.filter((c) => activeMission.challengeIds.includes(c.id))}
        isCompleted={completedMissions.includes(activeMission.id)}
        onBack={() => setActiveMission(null)}
        onComplete={() => {
          completeMission(activeMission.id, activeMission.xpReward);
        }}
        navigate={navigate}
      />
    );
  }

  const missions = activePath.missions;
  const completedCount = missions.filter((m) => completedMissions.includes(m.id)).length;

  // Group by milestone
  const grouped = activePath.milestones.map((m) => ({
    milestone: m,
    missions: m.missionIds.length > 0
      ? m.missionIds.map((id) => missions.find((mi) => mi.id === id)!).filter(Boolean)
      : [], // custom paths: missions listed separately
  }));

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 lg:px-6 lg:py-8">
      <PageHeader title="Missions" subtitle={`${completedCount} of ${missions.length} completed`}>
        <div className="hidden text-right sm:block">
          <p className="text-2xl font-extrabold text-[rgb(var(--text))]">{Math.round((completedCount / missions.length) * 100)}%</p>
          <p className="text-xs text-muted">Complete</p>
        </div>
      </PageHeader>

      <div className="mb-6">
        <ProgressBar value={completedCount} max={missions.length} size="lg" />
      </div>

      {/* Mission groups by milestone */}
      <div className="space-y-6">
        {grouped.map((group, gi) => {
          if (group.missions.length === 0) return null;
          const groupCompleted = group.missions.filter((m) => completedMissions.includes(m.id)).length;
          return (
            <div key={group.milestone.id} className="animate-fade-in" style={{ animationDelay: `${gi * 0.08}s` }}>
              <div className="mb-3 flex items-center gap-2">
                <span className="text-xl">{group.milestone.icon}</span>
                <h3 className="text-lg font-bold text-[rgb(var(--text))]">{group.milestone.title}</h3>
                <span className="text-sm text-muted">({groupCompleted}/{group.missions.length})</span>
              </div>

              <div className="space-y-2">
                {group.missions.map((mission) => {
                  // Determine if previous mission is completed (for lock state)
                  const allMissions = missions;
                  const missionIdx = allMissions.findIndex((m) => m.id === mission.id);
                  const prevCompleted = missionIdx === 0 || completedMissions.includes(allMissions[missionIdx - 1].id);
                  const isCompleted = completedMissions.includes(mission.id);
                  const isLocked = !isCompleted && !prevCompleted;

                  return (
                    <button
                      key={mission.id}
                      onClick={() => !isLocked && setActiveMission(mission)}
                      disabled={isLocked}
                      className={`card flex w-full items-center gap-4 p-4 text-left transition-all ${
                        isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-0.5 hover:shadow-glow'
                      } ${isCompleted ? 'border-success-300 dark:border-success-500/30' : ''}`}
                    >
                      {/* Status icon */}
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        isCompleted
                          ? 'bg-success-100 text-success-600 dark:bg-success-500/15 dark:text-success-400'
                          : isLocked
                          ? 'bg-[rgb(var(--bg-soft))] text-subtle'
                          : 'bg-primary-100 text-primary-600 dark:bg-primary-500/15 dark:text-primary-400'
                      }`}>
                        {isCompleted ? <Check size={18} /> : isLocked ? <span className="text-sm">🔒</span> : <Play size={16} />}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-subtle">Day {mission.day}</span>
                          {isCompleted && <span className="chip bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-300 !py-0.5">Done</span>}
                        </div>
                        <h4 className={`truncate text-sm font-bold ${isCompleted ? 'text-muted line-through' : 'text-[rgb(var(--text))]'}`}>
                          {mission.title}
                        </h4>
                        <div className="mt-1 flex items-center gap-3 text-xs text-muted">
                          <span className="flex items-center gap-1"><Clock size={12} /> {mission.estimatedMinutes}m</span>
                          <span>{mission.difficulty}</span>
                          <span className="text-accent-600 dark:text-accent-400 font-semibold">+{mission.xpReward} XP</span>
                        </div>
                      </div>

                      <ChevronRight size={18} className="shrink-0 text-subtle" />
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MissionDetail({
  mission,
  challenges,
  isCompleted,
  onBack,
  onComplete,
  navigate,
}: {
  mission: Mission;
  challenges: Challenge[];
  isCompleted: boolean;
  onBack: () => void;
  onComplete: () => void;
  navigate: (page: 'dashboard' | 'missions' | 'roadmap') => void;
}) {
  const [showChallenges, setShowChallenges] = useState(false);
  const [challengesDone, setChallengesDone] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleComplete = () => {
    onComplete();
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
      navigate('missions');
    }, 2000);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 lg:px-6 lg:py-8">
      <Confetti active={showConfetti} />

      <button onClick={onBack} className="btn-ghost mb-4">
        <ArrowLeft size={16} />
        Back to missions
      </button>

      {/* Mission header */}
      <div className="card relative overflow-hidden p-6 animate-fade-in lg:p-8">
        <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-primary-500/10 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2">
            <span className="chip bg-accent-100 text-accent-700 dark:bg-accent-500/15 dark:text-accent-300">
              🔥 Mission · Day {mission.day}
            </span>
            {isCompleted && (
              <span className="chip bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-300">
                <Check size={12} /> Completed
              </span>
            )}
          </div>

          <h1 className="mt-3 text-2xl font-extrabold text-[rgb(var(--text))] sm:text-3xl">{mission.title}</h1>
          <p className="mt-2 text-muted">{mission.description}</p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 text-sm text-muted">
              <Clock size={15} />
              {mission.estimatedMinutes} minutes
            </span>
            <DifficultyBadge difficulty={mission.difficulty} />
            <XpBadge xp={mission.xpReward} />
          </div>
        </div>
      </div>

      {/* Challenges section */}
      {challenges.length > 0 && (
        <div className="mt-4">
          {!showChallenges && !isCompleted && (
            <div className="card p-6 text-center animate-fade-in">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-500/15 dark:text-primary-400">
                <Lightbulb size={22} />
              </div>
              <h3 className="mt-3 text-lg font-bold text-[rgb(var(--text))]">Ready to practice?</h3>
              <p className="mt-1 text-sm text-muted">
                This mission has {challenges.length} challenge{challenges.length > 1 ? 's' : ''} to test your understanding.
              </p>
              <button onClick={() => setShowChallenges(true)} className="btn-primary mt-4">
                <Play size={16} />
                Start Challenges
              </button>
            </div>
          )}

          {showChallenges && !challengesDone && (
            <ChallengeRunner
              challenges={challenges}
              onComplete={() => setChallengesDone(true)}
            />
          )}
        </div>
      )}

      {/* Completion section */}
      {(challengesDone || challenges.length === 0) && !isCompleted && (
        <div className="mt-4 card relative overflow-hidden p-6 text-center animate-scale-in lg:p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-success-500/10 to-primary-500/10" />
          <div className="relative">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-success-100 text-success-600 dark:bg-success-500/15 dark:text-success-400 animate-pop">
              <Award size={28} />
            </div>
            <h3 className="mt-3 text-xl font-extrabold text-[rgb(var(--text))]">Ready to complete!</h3>
            <p className="mt-1 text-muted">Mark this mission as complete and earn your XP.</p>
            <button onClick={handleComplete} className="btn-primary mt-4 px-8">
              <Check size={18} />
              MARK COMPLETE · +{mission.xpReward} XP
            </button>
          </div>
        </div>
      )}

      {/* Already completed */}
      {isCompleted && (
        <div className="mt-4 card p-6 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-success-100 text-success-600 dark:bg-success-500/15 dark:text-success-400">
            <Check size={28} />
          </div>
          <h3 className="mt-3 text-xl font-extrabold text-[rgb(var(--text))]">Mission Complete!</h3>
          <p className="mt-1 text-muted">You earned +{mission.xpReward} XP from this mission.</p>
        </div>
      )}
    </div>
  );
}

function ChallengeRunner({ challenges, onComplete }: { challenges: Challenge[]; onComplete: () => void }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [reflectionText, setReflectionText] = useState('');
  const [correctCount, setCorrectCount] = useState(0);

  const challenge = challenges[currentIdx];
  const isLast = currentIdx === challenges.length - 1;

  const handleCheck = () => {
    if (challenge.type === 'reflection') {
      setShowResult(true);
      return;
    }
    if (challenge.type === 'coding') {
      setShowResult(true);
      return;
    }
    const correct = challenge.options?.find((o) => o.correct);
    if (correct && selectedAnswer === correct.id) {
      setCorrectCount((c) => c + 1);
    }
    setShowResult(true);
  };

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setCurrentIdx((i) => i + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setReflectionText('');
    }
  };

  const handleRetry = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setReflectionText('');
  };

  const selectedOption = challenge.options?.find((o) => o.id === selectedAnswer);
  const isCorrect = selectedOption?.correct === true;

  return (
    <div className="card p-6 animate-fade-in lg:p-8">
      {/* Progress */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-semibold text-muted">
          Challenge {currentIdx + 1} of {challenges.length}
        </span>
        <span className="chip bg-primary-100 text-primary-700 dark:bg-primary-500/15 dark:text-primary-300 capitalize">
          {challenge.type}
        </span>
      </div>
      <ProgressBar value={currentIdx} max={challenges.length} size="sm" className="mb-6" />

      {/* Question */}
      <h3 className="text-lg font-bold text-[rgb(var(--text))]">{challenge.question}</h3>

      {/* MCQ / Scenario */}
      {challenge.options && (
        <div className="mt-4 space-y-2">
          {challenge.options.map((opt) => {
            const isSelected = selectedAnswer === opt.id;
            const isCorrectOpt = opt.correct === true;
            let style = 'border-app hover:bg-[rgb(var(--bg-soft))]';

            if (showResult) {
              if (isCorrectOpt) {
                style = 'border-success-300 bg-success-50 dark:border-success-500/30 dark:bg-success-500/10';
              } else if (isSelected && !isCorrectOpt) {
                style = 'border-error-300 bg-error-50 dark:border-error-500/30 dark:bg-error-500/10';
              } else {
                style = 'border-app opacity-60';
              }
            } else if (isSelected) {
              style = 'border-primary-500 bg-primary-50 dark:bg-primary-500/10';
            }

            return (
              <button
                key={opt.id}
                onClick={() => !showResult && setSelectedAnswer(opt.id)}
                disabled={showResult}
                className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-all ${style}`}
              >
                <span className="text-sm font-medium text-[rgb(var(--text))]">{opt.text}</span>
                {showResult && isCorrectOpt && <Check size={18} className="text-success-500 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}

      {/* Coding Challenge */}
      {challenge.type === 'coding' && (
        <div className="mt-4">
          <textarea
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            placeholder="Write your code here..."
            className="input font-mono text-sm"
            rows={6}
            disabled={showResult}
          />
        </div>
      )}

      {/* Reflection */}
      {challenge.type === 'reflection' && (
        <div className="mt-4">
          <textarea
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            placeholder="Write your thoughts here..."
            className="input text-sm"
            rows={4}
            disabled={showResult}
          />
        </div>
      )}

      {/* Result */}
      {showResult && (
        <div className="mt-4 animate-fade-in-fast">
          {challenge.type === 'mcq' || challenge.type === 'scenario' ? (
            <div className={`rounded-xl border p-4 ${isCorrect ? 'border-success-300 bg-success-50 dark:border-success-500/30 dark:bg-success-500/10' : 'border-accent-300 bg-accent-50 dark:border-accent-500/30 dark:bg-accent-500/10'}`}>
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <><Check size={18} className="text-success-500" /><span className="font-bold text-success-700 dark:text-success-300">Correct!</span></>
                ) : (
                  <><Lightbulb size={18} className="text-accent-600 dark:text-accent-400" /><span className="font-bold text-accent-700 dark:text-accent-300">Not quite — here is the answer:</span></>
                )}
              </div>
              <p className="mt-2 text-sm text-[rgb(var(--text))]">{challenge.explanation}</p>
              {challenge.correctAnswer && (
                <pre className="mt-2 whitespace-pre-wrap rounded-lg bg-[rgb(var(--bg-soft))] p-3 text-sm font-mono text-[rgb(var(--text))]">{challenge.correctAnswer}</pre>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-primary-300 bg-primary-50 p-4 dark:border-primary-500/30 dark:bg-primary-500/10">
              <div className="flex items-center gap-2">
                <Lightbulb size={18} className="text-primary-600 dark:text-primary-400" />
                <span className="font-bold text-primary-700 dark:text-primary-300">Reference Answer</span>
              </div>
              <p className="mt-2 text-sm text-[rgb(var(--text))]">{challenge.explanation}</p>
              {challenge.correctAnswer && (
                <pre className="mt-2 whitespace-pre-wrap rounded-lg bg-[rgb(var(--bg-soft))] p-3 text-sm font-mono text-[rgb(var(--text))]">{challenge.correctAnswer}</pre>
              )}
            </div>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="mt-6 flex items-center justify-between gap-3">
        {!showResult ? (
          <button
            onClick={handleCheck}
            disabled={!selectedAnswer && !reflectionText && challenge.type !== 'coding'}
            className="btn-primary w-full"
          >
            Check Answer
          </button>
        ) : (
          <div className="flex w-full gap-3">
            <button onClick={handleRetry} className="btn-secondary">
              <RefreshCw size={16} />
              Retry
            </button>
            <button onClick={handleNext} className="btn-primary flex-1">
              {isLast ? 'Finish Challenges' : 'Next Challenge'}
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
