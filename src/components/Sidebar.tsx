import React from 'react';
import { useTaskStore } from '../store/taskStore';
import {
  Sparkles,
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Calendar as CalendarIcon,
  BarChart3,
  Users,
  User,
  LogOut,
  Search,
  ChevronRight,
  ChevronLeft,
  Bookmark,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Sidebar: React.FC = () => {
  const {
    activeView,
    setView,
    projects,
    currentUser,
    setCommandPaletteOpen,
    logout,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    sidebarCollapsed,
    toggleSidebar
  } = useTaskStore();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tasks & Boards', icon: CheckSquare },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'calendar', label: 'Calendar View', icon: CalendarIcon },
    { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
    { id: 'team', label: 'Team Workspace', icon: Users },
    { id: 'profile', label: 'Settings & Profile', icon: User },
  ] as const;

  const favoriteProjects = projects.filter((p) => p.favorite && !p.archived);

  // Inner sidebar content renderer supporting collapsed state
  const renderSidebarContent = () => (
    <div className={`flex flex-col h-full bg-white dark:bg-slate-950 border-r border-slate-200/60 dark:border-slate-800/60 transition-all duration-355 relative ${
      sidebarCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800/85 flex items-center justify-between min-h-[65px]">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 dark:shadow-indigo-500/10 shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col truncate">
              <span className="text-base font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                Aether
              </span>
              <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-semibold uppercase tracking-wider truncate">
                {currentUser.workspace}
              </span>
            </div>
          )}
        </div>

        {/* Laptop & Desktop Collapse Toggle (Close Chevron) / Mobile Close X */}
        <button
          onClick={() => {
            if (window.innerWidth < 1024) {
              setMobileSidebarOpen(false);
            } else {
              toggleSidebar();
            }
          }}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer shrink-0"
          title={sidebarCollapsed ? "Expand Menu" : "Collapse Menu"}
        >
          {window.innerWidth < 1024 ? (
            <X className="w-4.5 h-4.5 lg:hidden" />
          ) : sidebarCollapsed ? (
            <ChevronRight className="w-4.5 h-4.5 hidden lg:block" />
          ) : (
            <ChevronLeft className="w-4.5 h-4.5 hidden lg:block" />
          )}
        </button>
      </div>

      {/* Global Search Quick Trigger */}
      <div className="px-3 py-2.5">
        <button
          onClick={() => {
            setCommandPaletteOpen(true);
            setMobileSidebarOpen(false);
          }}
          className={`w-full flex items-center bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-400 text-xs cursor-pointer rounded-xl ${
            sidebarCollapsed ? 'p-2.5 justify-center' : 'px-3 py-2 justify-between'
          }`}
          title="Search anything... (⌘K)"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-505" />
            {!sidebarCollapsed && <span className="font-medium">Search...</span>}
          </div>
          {!sidebarCollapsed && (
            <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700/65 font-mono text-[9px] text-slate-450 shadow-sm font-semibold">
              ⌘K
            </kbd>
          )}
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-2 space-y-1 select-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center transition-all group cursor-pointer rounded-xl ${
                sidebarCollapsed ? 'p-2.5 justify-center' : 'px-3 py-2.5 justify-between'
              } ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/15 dark:shadow-indigo-600/10'
                  : 'text-slate-605 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title={item.label}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-505'}`} />
                {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
              </div>
              {!sidebarCollapsed && (
                <ChevronRight className={`w-3.5 h-3.5 opacity-0 transition-all ${isActive ? 'opacity-100' : 'group-hover:opacity-45 group-hover:translate-x-0.5'}`} />
              )}
            </button>
          );
        })}

        {/* Favorite Projects Section */}
        {!sidebarCollapsed && favoriteProjects.length > 0 && (
          <div className="pt-6">
            <div className="flex items-center justify-between px-3 pb-2">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-505 flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-indigo-505" />
                Favorites
              </span>
            </div>
            <div className="space-y-0.5">
              {favoriteProjects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => setView('projects')}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-405 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200 flex items-center justify-between transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2 truncate">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-tr ${project.color}`} />
                    <span className="truncate">{project.name}</span>
                  </div>
                  <span className="text-[9px] bg-slate-100 dark:bg-slate-900 text-slate-500 px-1.5 py-0.5 rounded font-semibold border border-slate-200/10">
                    {project.progress}%
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Profile Footer Section */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => setView('profile')}
            className={`flex items-center gap-2.5 text-left group truncate cursor-pointer ${
              sidebarCollapsed ? 'justify-center w-full' : 'flex-1'
            }`}
            title={`${currentUser.name} (${currentUser.role})`}
          >
            <div className="relative shrink-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-9 h-9 rounded-xl object-cover border border-slate-200 dark:border-slate-850 group-hover:ring-2 group-hover:ring-indigo-500/50 transition-all"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-950" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col truncate">
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-200 group-hover:text-indigo-500 transition-colors truncate">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-slate-400 truncate leading-none mt-0.5">
                  {currentUser.role}
                </span>
              </div>
            )}
          </button>
          
          {!sidebarCollapsed && (
            <button
              onClick={logout}
              className="p-2 text-slate-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
              title="Log Out"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop & Laptop Sidebar */}
      <aside className={`hidden lg:flex shrink-0 h-screen sticky top-0 bg-white dark:bg-slate-950 border-r border-slate-200/60 dark:border-slate-800/60 transition-all duration-355 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      }`}>
        {renderSidebarContent()}
      </aside>

      {/* Mobile & Tablet Sidebar Slide-over Drawer */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex animate-fade-in">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            />

            {/* Sidebar Slide-in Card */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative z-10 flex flex-col h-full bg-white dark:bg-slate-950 shadow-2xl"
            >
              {renderSidebarContent()}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
