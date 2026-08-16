import { useApp, type Page } from '../context/AppContext';
import { Logo } from './Logo';
import { Sun, Moon, LayoutDashboard, Route, Target, FolderKanban, Compass, Award, User } from 'lucide-react';

const NAV_ITEMS: { page: Page; label: string; icon: typeof LayoutDashboard }[] = [
  { page: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { page: 'roadmap', label: 'My Path', icon: Route },
  { page: 'missions', label: 'Missions', icon: Target },
  { page: 'projects', label: 'Projects', icon: FolderKanban },
  { page: 'explore', label: 'Explore', icon: Compass },
  { page: 'achievements', label: 'Achievements', icon: Award },
  { page: 'profile', label: 'Profile', icon: User },
];

export function Navbar() {
  const { theme, toggleTheme, page, navigate, activePath } = useApp();

  if (!activePath) return null;

  return (
    <header className="sticky top-0 z-40 border-b bg-[rgb(var(--bg-elev))]/80 backdrop-blur-lg border-app">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-6">
        <button onClick={() => navigate('dashboard')} className="shrink-0">
          <Logo size={30} />
        </button>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = page === item.page;
            return (
              <button
                key={item.page}
                onClick={() => navigate(item.page)}
                className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <button
          onClick={toggleTheme}
          className="btn-ghost shrink-0"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>
    </header>
  );
}

const MOBILE_NAV_ITEMS: { page: Page; label: string; icon: typeof LayoutDashboard }[] = [
  { page: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { page: 'roadmap', label: 'Path', icon: Route },
  { page: 'missions', label: 'Missions', icon: Target },
  { page: 'projects', label: 'Projects', icon: FolderKanban },
  { page: 'profile', label: 'Profile', icon: User },
];

export function BottomNav() {
  const { page, navigate, activePath } = useApp();

  if (!activePath) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-[rgb(var(--bg-elev))]/95 backdrop-blur-lg border-app lg:hidden">
      <div className="flex items-center justify-around px-2 py-1.5 safe-area-inset-bottom">
        {MOBILE_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = page === item.page;
          return (
            <button
              key={item.page}
              onClick={() => navigate(item.page)}
              className={`flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-muted hover:text-[rgb(var(--text))]'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
