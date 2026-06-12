import { useEffect } from 'react';
import { useTaskStore } from './store/taskStore';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { TasksView } from './components/TasksView';
import { ProjectsView } from './components/ProjectsView';
import { CalendarView } from './components/CalendarView';
import { AnalyticsView } from './components/AnalyticsView';
import { TeamView } from './components/TeamView';
import { ProfileView } from './components/ProfileView';
import { Onboarding } from './components/Onboarding';
import { AuthView } from './components/AuthView';
import { CommandPalette } from './components/CommandPalette';
import { QuickAddTaskModal } from './components/QuickAddTaskModal';
import { TaskModal } from './components/TaskModal';

export default function App() {
  const {
    isAuthenticated,
    activeView,
    theme,
    selectedTaskId
  } = useTaskStore();

  // Initialize theme classes
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Global Keyboard listener for theme toggle (⌘T)
  useEffect(() => {
    const handleThemeKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 't') {
        e.preventDefault();
        useTaskStore.getState().toggleTheme();
      }
    };
    window.addEventListener('keydown', handleThemeKey);
    return () => window.removeEventListener('keydown', handleThemeKey);
  }, []);

  // Render view router
  const renderViewContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'tasks':
        return <TasksView />;
      case 'projects':
        return <ProjectsView />;
      case 'calendar':
        return <CalendarView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'team':
        return <TeamView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <DashboardView />;
    }
  };

  // 1. If not authenticated, show premium Auth portal (Login/Register/OTP)
  if (!isAuthenticated) {
    return (
      <div className="dark:bg-slate-950 min-h-screen">
        <AuthView />
      </div>
    );
  }

  // 2. If onboarding step active, show custom workspace configurator
  if (activeView === 'onboarding') {
    return (
      <div className="dark:bg-slate-950 min-h-screen">
        <Onboarding />
      </div>
    );
  }

  // 3. Render premium Master Workspace layout
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-250 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Sticky Glassmorphic Header */}
        <Header />

        {/* Scrollable View Panel */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-slate-950/40">
          {renderViewContent()}
        </main>
      </div>

      {/* Global Command Palette (⌘K) */}
      <CommandPalette />

      {/* Quick Add Task Modal */}
      <QuickAddTaskModal />

      {/* Task Details & Edit Modal Drawer */}
      {selectedTaskId && <TaskModal />}
    </div>
  );
}
