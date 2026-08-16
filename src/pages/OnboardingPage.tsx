import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/Logo';
import { PREDEFINED_PATHS } from '../data/paths';
import { ArrowLeft, ArrowRight, Clock, Sparkles, Check } from 'lucide-react';

const TIME_OPTIONS = [
  { value: 15, label: '15 minutes', desc: 'Light pace' },
  { value: 30, label: '30 minutes', desc: 'Steady pace' },
  { value: 60, label: '60 minutes', desc: 'Focused pace' },
  { value: 90, label: '90+ minutes', desc: 'Intensive pace' },
];

const LEVEL_OPTIONS = [
  { value: 'Beginner', desc: 'New to this field' },
  { value: 'Intermediate', desc: 'Some experience' },
  { value: 'Advanced', desc: 'Experienced and looking to level up' },
];

export function OnboardingPage() {
  const { navigate, startPath, startCustomPath } = useApp();
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState('');
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);
  const [timePerDay, setTimePerDay] = useState<number>(30);
  const [level, setLevel] = useState<string>('Beginner');

  const handlePathSelect = (pathId: string) => {
    setSelectedPathId(pathId);
    const path = PREDEFINED_PATHS.find((p) => p.id === pathId);
    if (path) setGoal(path.title);
  };

  const handleGenerate = () => {
    if (selectedPathId) {
      startPath(selectedPathId);
    } else if (goal.trim()) {
      startCustomPath(goal.trim(), timePerDay, level);
    }
  };

  const canProceed = step === 0 ? (selectedPathId || goal.trim().length > 0) : true;

  return (
    <div className="min-h-screen bg-[rgb(var(--bg))]">
      <header className="border-b border-app">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 lg:px-6">
          <button onClick={() => navigate('landing')}>
            <Logo size={28} />
          </button>
          <button onClick={() => navigate('landing')} className="btn-ghost">
            Back to home
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-8 lg:py-16">
        {/* Progress Steps */}
        <div className="mb-10 flex items-center justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i <= step ? 'bg-primary-500 w-8' : 'bg-[rgb(var(--bg-soft))] w-2'
              }`}
            />
          ))}
        </div>

        {/* Step 0: Goal */}
        {step === 0 && (
          <div className="animate-fade-in">
            <div className="mb-8 text-center">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-500/15 dark:text-primary-400">
                <Sparkles size={24} />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[rgb(var(--text))]">What do you want to learn?</h1>
              <p className="mt-2 text-muted">Pick a popular path or type your own goal.</p>
            </div>

            {/* Popular paths */}
            <div className="mb-6">
              <p className="mb-3 text-sm font-semibold text-muted">Popular paths</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {PREDEFINED_PATHS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handlePathSelect(p.id)}
                    className={`card flex flex-col items-center gap-2 p-4 text-center transition-all hover:-translate-y-0.5 ${
                      selectedPathId === p.id ? 'ring-2 ring-primary-500 shadow-glow' : ''
                    }`}
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${p.gradient} text-xl shadow-md`}>
                      {p.emoji}
                    </div>
                    <span className="text-sm font-semibold text-[rgb(var(--text))]">{p.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom goal */}
            <div>
              <p className="mb-3 text-sm font-semibold text-muted">Or type your own goal</p>
              <input
                type="text"
                value={goal}
                onChange={(e) => {
                  setGoal(e.target.value);
                  setSelectedPathId(null);
                }}
                placeholder="e.g., I want to learn photography..."
                className="input"
                onKeyDown={(e) => e.key === 'Enter' && canProceed && setStep(1)}
              />
            </div>
          </div>
        )}

        {/* Step 1: Time */}
        {step === 1 && (
          <div className="animate-fade-in">
            <div className="mb-8 text-center">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-500/15 dark:text-primary-400">
                <Clock size={24} />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[rgb(var(--text))]">How much time per day?</h1>
              <p className="mt-2 text-muted">Be realistic — consistency beats intensity.</p>
            </div>

            <div className="space-y-3">
              {TIME_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTimePerDay(opt.value)}
                  className={`card flex w-full items-center justify-between p-5 text-left transition-all hover:-translate-y-0.5 ${
                    timePerDay === opt.value ? 'ring-2 ring-primary-500 shadow-glow' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold ${
                      timePerDay === opt.value
                        ? 'bg-primary-500 text-white'
                        : 'bg-[rgb(var(--bg-soft))] text-muted'
                    }`}>
                      {opt.value}
                    </div>
                    <div>
                      <div className="font-semibold text-[rgb(var(--text))]">{opt.label}</div>
                      <div className="text-sm text-muted">{opt.desc}</div>
                    </div>
                  </div>
                  {timePerDay === opt.value && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-white">
                      <Check size={14} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Level */}
        {step === 2 && (
          <div className="animate-fade-in">
            <div className="mb-8 text-center">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-500/15 dark:text-primary-400">
                <Sparkles size={24} />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[rgb(var(--text))]">What is your current level?</h1>
              <p className="mt-2 text-muted">We will adapt the path to your experience.</p>
            </div>

            <div className="space-y-3">
              {LEVEL_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setLevel(opt.value)}
                  className={`card flex w-full items-center justify-between p-5 text-left transition-all hover:-translate-y-0.5 ${
                    level === opt.value ? 'ring-2 ring-primary-500 shadow-glow' : ''
                  }`}
                >
                  <div>
                    <div className="font-semibold text-[rgb(var(--text))]">{opt.value}</div>
                    <div className="text-sm text-muted">{opt.desc}</div>
                  </div>
                  {level === opt.value && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-white">
                      <Check size={14} />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-8 card-soft p-5">
              <p className="text-sm font-semibold text-muted">Your Path</p>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Goal</span>
                  <span className="font-semibold text-[rgb(var(--text))]">{goal || selectedPathId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Daily time</span>
                  <span className="font-semibold text-[rgb(var(--text))]">{timePerDay} min/day</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Level</span>
                  <span className="font-semibold text-[rgb(var(--text))]">{level}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex items-center justify-between gap-3">
          <button
            onClick={() => (step === 0 ? navigate('landing') : setStep(step - 1))}
            className="btn-secondary"
          >
            <ArrowLeft size={16} />
            {step === 0 ? 'Cancel' : 'Back'}
          </button>

          {step < 2 ? (
            <button
              onClick={() => canProceed && setStep(step + 1)}
              disabled={!canProceed}
              className="btn-primary"
            >
              Continue
              <ArrowRight size={16} />
            </button>
          ) : (
            <button onClick={handleGenerate} className="btn-primary">
              Generate My Path
              <Sparkles size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
