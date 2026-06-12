import React, { useState, useEffect, useRef } from 'react';
import { useTaskStore } from '../store/taskStore';
import { Bell, Sun, Moon, Plus, Search, Check, Sparkles, AlertCircle, Bookmark, MessageSquare, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Header: React.FC = () => {
  const {
    activeView,
    theme,
    toggleTheme,
    currentUser,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setCommandPaletteOpen,
    setQuickAddTaskOpen,
    toggleMobileSidebar
  } = useTaskStore();

  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setNotifDropdownOpen(false);
      }
    };
    if (notifDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [notifDropdownOpen]);

  // Generate greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getViewTitle = () => {
    switch (activeView) {
      case 'dashboard': return 'Productivity Hub';
      case 'tasks': return 'Task Command Center';
      case 'projects': return 'Project Spaces';
      case 'calendar': return 'Interactive Calendar';
      case 'analytics': return 'Performance Metrics';
      case 'team': return 'Team Space';
      case 'profile': return 'Account Settings';
      default: return 'Overview';
    }
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'reminder': return <Bookmark className="w-4 h-4 text-amber-500" />;
      case 'alert': return <AlertCircle className="w-4 h-4 text-rose-500" />;
      case 'mention': return <MessageSquare className="w-4 h-4 text-indigo-500" />;
      default: return <Sparkles className="w-4 h-4 text-emerald-500" />;
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md">
      {/* Left Area: Hamburger and Title */}
      <div className="flex items-center gap-3">
        {/* Hamburger Menu on Mobile */}
        <button
          onClick={toggleMobileSidebar}
          className="lg:hidden p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-all cursor-pointer shrink-0"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* View Title & Greetings */}
        <div className="flex flex-col">
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
            {getViewTitle()}
          </h1>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            <span>{getGreeting()}, {currentUser.name.split(' ')[0]}</span>
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Global Actions */}
      <div className="flex items-center gap-3">
        {/* Quick Search Bar */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/50 text-slate-400 text-xs w-48 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors cursor-pointer text-left"
        >
          <Search className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Search tasks (⌘K)</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer relative overflow-hidden"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          <motion.div
            key={theme}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
          </motion.div>
        </button>

        {/* Notification Bell with Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className={`p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer relative ${
              notifDropdownOpen ? 'bg-slate-50 dark:bg-slate-800' : ''
            }`}
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-slate-950 animate-pulse" />
            )}
          </button>

          <AnimatePresence>
            {notifDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden z-40"
              >
                {/* Dropdown Header */}
                <div className="px-4 py-3 bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[10px] text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      Mark all read
                    </button>
                  )}
                </div>

                {/* Notifications List */}
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                  {notifications.length === 0 ? (
                    <div className="py-8 px-4 text-center flex flex-col items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center mb-2 text-slate-400">
                        <Bell className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">All caught up!</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">No new notifications to show.</p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <button
                        key={notif.id}
                        onClick={() => {
                          markNotificationRead(notif.id);
                        }}
                        className={`w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-850/50 transition-colors flex gap-3 ${
                          !notif.read ? 'bg-indigo-500/5 dark:bg-indigo-500/2' : ''
                        }`}
                      >
                        <div className="shrink-0 mt-0.5">
                          <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            {getNotifIcon(notif.type)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h4 className={`text-xs font-semibold truncate ${!notif.read ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                              {notif.title}
                            </h4>
                            <span className="text-[9px] text-slate-400 shrink-0 ml-1">{notif.timestamp}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                            {notif.description}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>

                {/* View All */}
                <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-800 text-center bg-slate-50/50 dark:bg-slate-900/40">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                    Auto-cleans read activities in 30 days
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Create Task Button */}
        <button
          onClick={() => setQuickAddTaskOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-600/20 dark:shadow-indigo-600/10 hover:shadow-indigo-600/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Task</span>
        </button>
      </div>
    </header>
  );
};
