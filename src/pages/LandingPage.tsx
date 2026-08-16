import { useApp } from '../context/AppContext';
import { Logo } from '../components/Logo';
import { PREDEFINED_PATHS } from '../data/paths';
import { Sun, Moon, ArrowRight, Sparkles, Route, Target, Trophy, Zap, Check } from 'lucide-react';

export function LandingPage() {
  const { theme, toggleTheme, navigate, startPath } = useApp();

  const examplePaths = [
    { id: 'ai-engineering', emoji: '🤖', title: 'AI Engineering', desc: 'Master ML & AI' },
    { id: 'python', emoji: '🐍', title: 'Python', desc: 'From zero to developer' },
    { id: 'web-development', emoji: '🌐', title: 'Web Development', desc: 'Build modern web apps' },
    { id: 'graphic-design', emoji: '🎨', title: 'Design', desc: 'Master visual design' },
    { id: 'public-speaking', emoji: '🎤', title: 'Public Speaking', desc: 'Speak with confidence' },
    { id: 'video-editing', emoji: '🎬', title: 'Video Editing', desc: 'Edit pro videos' },
  ];

  const features = [
    { icon: Route, title: 'Personalized Roadmaps', desc: 'Turn any goal into a structured path with milestones, daily missions, and projects.' },
    { icon: Target, title: 'Daily Missions', desc: 'Bite-sized tasks that fit your schedule. Learn, practice, and complete — one mission at a time.' },
    { icon: Zap, title: 'Interactive Challenges', desc: 'Test your knowledge with quizzes, coding tasks, and real-world scenarios with instant feedback.' },
    { icon: Trophy, title: 'Gamified Progress', desc: 'Earn XP, level up, build streaks, and unlock achievements as you learn.' },
  ];

  const stats = [
    { value: '6', label: 'Learning Paths' },
    { value: '100+', label: 'Daily Missions' },
    { value: '24+', label: 'Projects' },
    { value: '8', label: 'Levels' },
  ];

  return (
    <div className="min-h-screen bg-[rgb(var(--bg))]">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b bg-[rgb(var(--bg-elev))]/80 backdrop-blur-lg border-app">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-6">
          <Logo size={30} />
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="btn-ghost" aria-label="Toggle theme">
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button onClick={() => navigate('onboarding')} className="btn-primary !py-2">
              Get Started
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-60" />
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-primary-500/10 blur-3xl" />
        <div className="absolute -right-40 top-40 h-96 w-96 rounded-full bg-accent-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 lg:px-6 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-[rgb(var(--bg-elev))]/80 px-4 py-1.5 text-sm font-medium text-muted backdrop-blur border-app animate-fade-in">
              <Sparkles size={14} className="text-primary-500" />
              AI-powered learning paths
            </div>

            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-[rgb(var(--text))] animate-fade-in sm:text-5xl lg:text-6xl">
              Turn your goal into a{' '}
              <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                path.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted animate-fade-in sm:text-xl" style={{ animationDelay: '0.1s' }}>
              Tell Pathly what you want to learn. Get a personalized roadmap, daily missions,
              projects, and progress tracking — all in one place.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 animate-fade-in sm:flex-row" style={{ animationDelay: '0.2s' }}>
              <button
                onClick={() => navigate('onboarding')}
                className="btn-primary w-full px-8 text-base sm:w-auto"
              >
                CREATE MY PATH
                <ArrowRight size={18} />
              </button>
              <button
                onClick={() => navigate('explore')}
                className="btn-secondary w-full px-8 text-base sm:w-auto"
              >
                EXPLORE PATHS
              </button>
            </div>

            {/* Stats */}
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-2 gap-4 animate-fade-in sm:grid-cols-4" style={{ animationDelay: '0.3s' }}>
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-3xl font-extrabold text-[rgb(var(--text))]">{s.value}</div>
                  <div className="mt-1 text-sm text-muted">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Example Paths */}
      <section className="border-t border-app py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-[rgb(var(--text))]">Popular Learning Paths</h2>
            <p className="mt-2 text-muted">Pick a path and start learning right away.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {examplePaths.map((p, i) => {
              const path = PREDEFINED_PATHS.find((pp) => pp.id === p.id);
              if (!path) return null;
              return (
                <button
                  key={p.id}
                  onClick={() => startPath(p.id)}
                  className="group card relative overflow-hidden p-6 text-left transition-all hover:shadow-glow hover:-translate-y-1 animate-fade-in"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${path.gradient} opacity-0 transition-opacity group-hover:opacity-5`} />
                  <div className="relative flex items-start justify-between">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${path.gradient} text-2xl shadow-lg`}>
                      {p.emoji}
                    </div>
                    <ArrowRight size={20} className="text-subtle transition-all group-hover:text-primary-500 group-hover:translate-x-1" />
                  </div>
                  <h3 className="relative mt-4 text-xl font-bold text-[rgb(var(--text))]">{p.title}</h3>
                  <p className="relative mt-1 text-sm text-muted">{p.desc}</p>
                  <div className="relative mt-4 flex items-center gap-3 text-xs text-subtle">
                    <span>{path.defaultDays} days</span>
                    <span>·</span>
                    <span>{path.milestones.length} levels</span>
                    <span>·</span>
                    <span>{path.missions.length} missions</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-app bg-[rgb(var(--bg-soft))] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-[rgb(var(--text))]">How Pathly Works</h2>
            <p className="mt-2 text-muted">It is not just about knowing — it is about doing.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="card p-6 animate-fade-in" style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-500/15 dark:text-primary-400">
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-[rgb(var(--text))]">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted">{f.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Core Loop */}
          <div className="mt-16 card p-8 lg:p-12">
            <h3 className="text-center text-2xl font-extrabold text-[rgb(var(--text))]">The Pathly Core Loop</h3>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm font-semibold">
              {['GOAL', 'ROADMAP', "TODAY'S MISSION", 'LEARN', 'PRACTICE', 'COMPLETE', 'EARN XP', 'LEVEL UP'].map((step, i) => (
                <div key={step} className="flex items-center gap-3">
                  <span className="rounded-xl bg-primary-50 px-4 py-2 text-primary-700 dark:bg-primary-500/15 dark:text-primary-300">
                    {step}
                  </span>
                  {i < 7 && <ArrowRight size={16} className="text-subtle" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="border-t border-app py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 lg:px-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="card p-8">
              <h3 className="text-xl font-bold text-[rgb(var(--text))]">Free</h3>
              <p className="mt-1 text-sm text-muted">Everything you need to start learning.</p>
              <ul className="mt-6 space-y-3">
                {['One active learning path', 'Daily missions & challenges', 'Progress tracking', 'Basic gamification'].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-[rgb(var(--text))]">
                    <Check size={16} className="text-success-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate('onboarding')} className="btn-secondary mt-6 w-full">
                Start Free
              </button>
            </div>
            <div className="card relative overflow-hidden p-8 shadow-glow">
              <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-accent-500/10 blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-[rgb(var(--text))]">Pathly Pro</h3>
                  <span className="chip bg-accent-100 text-accent-700 dark:bg-accent-500/15 dark:text-accent-300">Coming Soon</span>
                </div>
                <p className="mt-1 text-sm text-muted">Supercharge your learning journey.</p>
                <ul className="mt-6 space-y-3">
                  {['Unlimited learning paths', 'Advanced AI-personalized roadmaps', 'AI learning coach', 'Detailed analytics', 'Custom learning plans'].map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-[rgb(var(--text))]">
                      <Check size={16} className="text-accent-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button disabled className="btn-primary mt-6 w-full opacity-60 cursor-not-allowed">
                  Coming Soon
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-app py-20">
        <div className="mx-auto max-w-3xl px-4 text-center lg:px-6">
          <h2 className="text-3xl font-extrabold tracking-tight text-[rgb(var(--text))] sm:text-4xl">
            Ready to start your journey?
          </h2>
          <p className="mt-4 text-lg text-muted">
            Pick a goal, choose your pace, and let Pathly build the path for you.
          </p>
          <button onClick={() => navigate('onboarding')} className="btn-primary mt-8 px-8 text-base">
            CREATE MY PATH
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-app py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row lg:px-6">
          <Logo size={24} />
          <p className="text-sm text-subtle">Turn your goal into a path.</p>
        </div>
      </footer>
    </div>
  );
}
