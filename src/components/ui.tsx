import { useEffect, useState } from 'react';

export function ProgressBar({
  value,
  max = 100,
  className = '',
  color = 'primary',
  showLabel = false,
  size = 'md',
}: {
  value: number;
  max?: number;
  className?: string;
  color?: 'primary' | 'accent' | 'success' | 'emerald' | 'blue' | 'purple' | 'orange' | 'amber';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const percentage = Math.min(100, Math.round((value / max) * 100));

  useEffect(() => {
    const timer = setTimeout(() => setDisplayValue(percentage), 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  const colorMap: Record<string, string> = {
    primary: 'bg-primary-500',
    accent: 'bg-accent-500',
    success: 'bg-success-500',
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    amber: 'bg-amber-500',
  };

  const heightMap = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-3.5' };

  return (
    <div className={className}>
      <div className={`w-full overflow-hidden rounded-full bg-[rgb(var(--bg-soft))] ${heightMap[size]}`}>
        <div
          className={`h-full rounded-full ${colorMap[color]} transition-all duration-700 ease-out`}
          style={{ width: `${displayValue}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-right text-xs font-semibold text-muted">{percentage}%</div>
      )}
    </div>
  );
}

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  color = '#1c80f5',
  children,
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  children?: React.ReactNode;
}) {
  const [displayProgress, setDisplayProgress] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (displayProgress / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setDisplayProgress(progress), 200);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-[rgb(var(--bg-soft))]"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">{children}</div>
      )}
    </div>
  );
}

export function Confetti({ active }: { active: boolean }) {
  if (!active) return null;

  const colors = ['#1c80f5', '#f9960c', '#10b981', '#ef4444', '#8b5cf6', '#ec4899'];
  const pieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.3,
    color: colors[i % colors.length],
    size: 6 + Math.random() * 6,
  }));

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute top-0 animate-confetti-fall"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.id % 2 === 0 ? '50%' : '2px',
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const map: Record<string, { color: string; bg: string }> = {
    Beginner: { color: 'text-success-700 dark:text-success-300', bg: 'bg-success-100 dark:bg-success-500/15' },
    Intermediate: { color: 'text-accent-700 dark:text-accent-300', bg: 'bg-accent-100 dark:bg-accent-500/15' },
    Advanced: { color: 'text-error-700 dark:text-error-300', bg: 'bg-error-100 dark:bg-error-500/15' },
  };
  const style = map[difficulty] ?? map.Beginner;
  return (
    <span className={`chip ${style.bg} ${style.color}`}>
      {difficulty}
    </span>
  );
}

export function XpBadge({ xp, className = '' }: { xp: number; className?: string }) {
  return (
    <span className={`chip bg-accent-100 text-accent-700 dark:bg-accent-500/15 dark:text-accent-300 ${className}`}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13 2L4.09 12.97L7.64 13.26L5.5 22L14.5 11H10.9L13 2Z" />
      </svg>
      +{xp} XP
    </span>
  );
}

export function PageHeader({ title, subtitle, children }: { title: string; subtitle?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-[rgb(var(--text))] sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1.5 text-muted">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
