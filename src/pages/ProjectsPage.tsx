import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader, DifficultyBadge, XpBadge, ProgressBar, Confetti } from '../components/ui';
import type { Project } from '../types';
import { Check, Clock, ArrowLeft, FolderKanban, ListChecks, Award } from 'lucide-react';

export function ProjectsPage() {
  const { activePath, completedProjects, completeProject, navigate } = useApp();
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  if (!activePath) return null;

  if (activeProject) {
    return (
      <ProjectDetail
        project={activeProject}
        isCompleted={completedProjects.includes(activeProject.id)}
        onBack={() => setActiveProject(null)}
        onComplete={() => {
          completeProject(activeProject.id, activeProject.xpReward);
        }}
        navigate={navigate}
      />
    );
  }

  const projects = activePath.projects;
  const completedCount = projects.filter((p) => completedProjects.includes(p.id)).length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 lg:px-6 lg:py-8">
      <PageHeader title="Projects" subtitle="Apply what you have learned by building real projects.">
        <div className="hidden text-right sm:block">
          <p className="text-2xl font-extrabold text-[rgb(var(--text))]">{completedCount}/{projects.length}</p>
          <p className="text-xs text-muted">Completed</p>
        </div>
      </PageHeader>

      {projects.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgb(var(--bg-soft))] text-subtle">
            <FolderKanban size={24} />
          </div>
          <h3 className="mt-3 text-lg font-bold text-[rgb(var(--text))]">No projects yet</h3>
          <p className="mt-1 text-sm text-muted">Projects will appear as you progress through your path.</p>
          <button onClick={() => navigate('missions')} className="btn-primary mt-4">Start a Mission</button>
        </div>
      ) : (
        <div className="mb-6">
          <ProgressBar value={completedCount} max={projects.length} size="lg" />
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {projects.map((project, i) => {
          const isCompleted = completedProjects.includes(project.id);
          const milestone = activePath.milestones.find((m) => m.id === project.milestoneId);
          const milestoneMissions = milestone?.missionIds ?? [];
          const prerequisiteDone = milestoneMissions.length === 0 ||
            milestoneMissions.filter((id) => {
              const allMissions = activePath.missions;
              return allMissions.some((m) => m.id === id);
            }).every((id) => completedProjects.includes(id) || true); // simplified: always available

          return (
            <button
              key={project.id}
              onClick={() => setActiveProject(project)}
              className={`card group relative overflow-hidden p-6 text-left transition-all hover:-translate-y-1 hover:shadow-glow animate-fade-in ${
                isCompleted ? 'border-success-300 dark:border-success-500/30' : ''
              }`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {isCompleted && <div className="absolute inset-0 bg-success-50/50 dark:bg-success-500/5" />}

              <div className="relative flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-500/15 dark:text-primary-400">
                  <FolderKanban size={22} />
                </div>
                {isCompleted ? (
                  <span className="chip bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-300">
                    <Check size={12} /> Done
                  </span>
                ) : (
                  <XpBadge xp={project.xpReward} />
                )}
              </div>

              <h3 className="relative mt-4 text-lg font-bold text-[rgb(var(--text))]">{project.title}</h3>
              <p className="relative mt-1 text-sm text-muted line-clamp-2">{project.goal}</p>

              <div className="relative mt-4 flex flex-wrap items-center gap-2">
                <DifficultyBadge difficulty={project.difficulty} />
                <span className="flex items-center gap-1 text-xs text-muted">
                  <Clock size={12} /> {project.estimatedHours}h
                </span>
                <span className="text-xs text-muted">{project.steps.length} steps</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ProjectDetail({
  project,
  isCompleted,
  onBack,
  onComplete,
  navigate,
}: {
  project: Project;
  isCompleted: boolean;
  onBack: () => void;
  onComplete: () => void;
  navigate: (page: 'projects' | 'dashboard') => void;
}) {
  const [showConfetti, setShowConfetti] = useState(false);

  const handleComplete = () => {
    onComplete();
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
      navigate('projects');
    }, 2000);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 lg:px-6 lg:py-8">
      <Confetti active={showConfetti} />

      <button onClick={onBack} className="btn-ghost mb-4">
        <ArrowLeft size={16} />
        Back to projects
      </button>

      <div className="card relative overflow-hidden p-6 animate-fade-in lg:p-8">
        <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-accent-500/10 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2">
            <span className="chip bg-accent-100 text-accent-700 dark:bg-accent-500/15 dark:text-accent-300">
              Project
            </span>
            {isCompleted && (
              <span className="chip bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-300">
                <Check size={12} /> Completed
              </span>
            )}
          </div>

          <h1 className="mt-3 text-2xl font-extrabold text-[rgb(var(--text))] sm:text-3xl">{project.title}</h1>
          <p className="mt-2 text-muted">{project.goal}</p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <DifficultyBadge difficulty={project.difficulty} />
            <span className="flex items-center gap-1.5 text-sm text-muted">
              <Clock size={15} /> {project.estimatedHours} hours
            </span>
            <XpBadge xp={project.xpReward} />
          </div>

          <div className="mt-4">
            <p className="text-sm font-semibold text-muted">Skills required</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {project.skillsRequired.map((skill) => (
                <span key={skill} className="chip bg-primary-50 text-primary-700 dark:bg-primary-500/15 dark:text-primary-300">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 card p-6 animate-fade-in">
        <div className="flex items-center gap-2">
          <ListChecks size={18} className="text-primary-500" />
          <h3 className="text-lg font-bold text-[rgb(var(--text))]">Steps</h3>
        </div>

        <div className="mt-4 space-y-3">
          {project.steps.map((step, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl border border-app p-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-sm font-bold text-primary-600 dark:bg-primary-500/15 dark:text-primary-400">
                {i + 1}
              </div>
              <p className="text-sm text-[rgb(var(--text))] pt-1">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {!isCompleted && (
        <div className="mt-4 card relative overflow-hidden p-6 text-center animate-scale-in lg:p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-success-500/10 to-accent-500/10" />
          <div className="relative">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-success-100 text-success-600 dark:bg-success-500/15 dark:text-success-400 animate-pop">
              <Award size={28} />
            </div>
            <h3 className="mt-3 text-xl font-extrabold text-[rgb(var(--text))]">Built it? Claim your XP!</h3>
            <p className="mt-1 text-muted">Mark this project complete and earn your reward.</p>
            <button onClick={handleComplete} className="btn-primary mt-4 px-8">
              <Check size={18} />
              MARK COMPLETE · +{project.xpReward} XP
            </button>
          </div>
        </div>
      )}

      {isCompleted && (
        <div className="mt-4 card p-6 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-success-100 text-success-600 dark:bg-success-500/15 dark:text-success-400">
            <Check size={28} />
          </div>
          <h3 className="mt-3 text-xl font-extrabold text-[rgb(var(--text))]">Project Complete!</h3>
          <p className="mt-1 text-muted">You earned +{project.xpReward} XP from this project.</p>
        </div>
      )}
    </div>
  );
}
