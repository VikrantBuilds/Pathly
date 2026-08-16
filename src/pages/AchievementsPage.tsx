import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/ui';
import { ACHIEVEMENTS } from '../data/progression';
import { Check, Lock, Trophy, Flame, Zap, BookOpen, Rocket, Target } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Trophy,
  Flame,
  Zap,
  BookOpen,
  Rocket,
  Target,
};

export function AchievementsPage() {
  const { unlockedAchievements } = useApp();

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 lg:px-6 lg:py-8">
      <PageHeader
        title="Achievements"
        subtitle={`${unlockedAchievements.length} of ${ACHIEVEMENTS.length} unlocked`}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ACHIEVEMENTS.map((achievement, i) => {
          const isUnlocked = unlockedAchievements.includes(achievement.id);
          const Icon = ICON_MAP[achievement.icon] ?? Check;

          return (
            <div
              key={achievement.id}
              className={`card relative overflow-hidden p-6 text-center transition-all animate-fade-in ${
                isUnlocked ? 'border-accent-300 dark:border-accent-500/30 shadow-glow-accent' : 'opacity-70'
              }`}
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              {isUnlocked && <div className="absolute inset-0 bg-gradient-to-br from-accent-500/5 to-primary-500/5" />}

              <div className="relative">
                <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-accent-400 to-accent-600 text-white shadow-lg animate-pop'
                    : 'bg-[rgb(var(--bg-soft))] text-subtle'
                }`}>
                  {isUnlocked ? <Icon size={28} /> : <Lock size={24} />}
                </div>

                <h3 className={`mt-3 font-bold ${isUnlocked ? 'text-[rgb(var(--text))]' : 'text-muted'}`}>
                  {achievement.title}
                </h3>
                <p className="mt-1 text-xs text-muted">{achievement.description}</p>

                {isUnlocked && (
                  <span className="mt-3 inline-flex items-center gap-1 chip bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-300">
                    <Check size={12} /> Unlocked
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
