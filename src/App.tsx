import { AppProvider, useApp } from './context/AppContext';
import { Navbar, BottomNav } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { MissionsPage } from './pages/MissionsPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ExplorePage } from './pages/ExplorePage';
import { AchievementsPage } from './pages/AchievementsPage';
import { ProfilePage } from './pages/ProfilePage';

function AppContent() {
  const { page, activePath } = useApp();

  // Landing and Onboarding are standalone (no app chrome)
  if (page === 'landing' || !activePath) {
    return <LandingPage />;
  }

  if (page === 'onboarding') {
    return <OnboardingPage />;
  }

  // App pages with navbar and bottom nav
  return (
    <div className="min-h-screen bg-[rgb(var(--bg))]">
      <Navbar />
      <main className="pb-20 lg:pb-8">
        {page === 'dashboard' && <DashboardPage />}
        {page === 'roadmap' && <RoadmapPage />}
        {page === 'missions' && <MissionsPage />}
        {page === 'projects' && <ProjectsPage />}
        {page === 'explore' && <ExplorePage />}
        {page === 'achievements' && <AchievementsPage />}
        {page === 'profile' && <ProfilePage />}
      </main>
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
