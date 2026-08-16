import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/ui';
import { PREDEFINED_PATHS } from '../data/paths';
import { Search, ArrowRight, Sparkles, Plus, Clock, Target, Layers } from 'lucide-react';

export function ExplorePage() {
  const { activePath, startPath, navigate, customPaths } = useApp();
  const [search, setSearch] = useState('');

  const allPaths = [...PREDEFINED_PATHS, ...customPaths];
  const filtered = allPaths.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 lg:px-6 lg:py-8">
      <PageHeader title="Explore Paths" subtitle="Browse learning paths or create your own.">
        <button onClick={() => navigate('onboarding')} className="btn-primary">
          <Plus size={16} />
          Create Custom Path
        </button>
      </PageHeader>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtle" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search paths..."
          className="input pl-12"
        />
      </div>

      {/* Custom path prompt */}
      <div className="mb-6 card relative overflow-hidden p-6">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-accent-500/5" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-white">
            <Sparkles size={22} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-[rgb(var(--text))]">Can't find what you're looking for?</h3>
            <p className="text-sm text-muted">Tell Pathly your goal and we'll build a custom path for you.</p>
          </div>
          <button onClick={() => navigate('onboarding')} className="btn-secondary shrink-0">
            Create
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Path Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((path, i) => {
          const isActive = activePath?.id === path.id;
          return (
            <div
              key={path.id}
              className="card group relative overflow-hidden p-6 transition-all hover:-translate-y-1 hover:shadow-glow animate-fade-in"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${path.gradient} opacity-0 transition-opacity group-hover:opacity-5`} />

              <div className="relative flex items-start justify-between">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${path.gradient} text-2xl shadow-lg`}>
                  {path.emoji}
                </div>
                {isActive && (
                  <span className="chip bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-300">
                    Active
                  </span>
                )}
              </div>

              <h3 className="relative mt-4 text-xl font-bold text-[rgb(var(--text))]">{path.title}</h3>
              <p className="relative mt-1 text-sm text-muted line-clamp-2">{path.description}</p>

              <div className="relative mt-4 flex items-center gap-3 text-xs text-subtle">
                <span className="flex items-center gap-1"><Clock size={12} /> {path.defaultDays}d</span>
                <span className="flex items-center gap-1"><Layers size={12} /> {path.milestones.length} levels</span>
                <span className="flex items-center gap-1"><Target size={12} /> {path.missions.length || path.milestones.reduce((a, m) => a + m.missionCount, 0)} missions</span>
              </div>

              <div className="relative mt-5">
                {isActive ? (
                  <button onClick={() => navigate('dashboard')} className="btn-secondary w-full">
                    Continue Learning
                    <ArrowRight size={16} />
                  </button>
                ) : (
                  <button onClick={() => startPath(path.id)} className="btn-primary w-full">
                    Start Path
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="card p-12 text-center">
          <p className="text-muted">No paths found for "{search}".</p>
        </div>
      )}
    </div>
  );
}
