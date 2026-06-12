import React, { useState, useEffect, useRef } from 'react';
import { useTaskStore } from '../store/taskStore';
import { Search, Compass, Shield, Plus, Sun, Moon, LogOut, CheckSquare, Folder, Users, BarChart3, Calendar as CalendarIcon, Keyboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CommandPalette: React.FC = () => {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    tasks,
    projects,
    setView,
    toggleTheme,
    theme,
    setQuickAddTaskOpen,
    setSelectedTaskId,
    logout
  } = useTaskStore();

  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on Escape, Navigate on Up/Down, Trigger on Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }

      if (!commandPaletteOpen) return;

      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filteredItems.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, selectedIndex, search, tasks, projects]);

  // Focus input when opened
  useEffect(() => {
    if (commandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setSearch('');
      setSelectedIndex(0);
    }
  }, [commandPaletteOpen]);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setCommandPaletteOpen(false);
      }
    };

    if (commandPaletteOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [commandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  // Build commands
  const navigationCommands = [
    { label: 'Go to Dashboard', icon: Compass, action: () => { setView('dashboard'); setCommandPaletteOpen(false); }, category: 'Navigation' },
    { label: 'Go to Tasks (Kanban & Views)', icon: CheckSquare, action: () => { setView('tasks'); setCommandPaletteOpen(false); }, category: 'Navigation' },
    { label: 'Go to Projects', icon: Folder, action: () => { setView('projects'); setCommandPaletteOpen(false); }, category: 'Navigation' },
    { label: 'Go to Calendar', icon: CalendarIcon, action: () => { setView('calendar'); setCommandPaletteOpen(false); }, category: 'Navigation' },
    { label: 'Go to Analytics & Metrics', icon: BarChart3, action: () => { setView('analytics'); setCommandPaletteOpen(false); }, category: 'Navigation' },
    { label: 'Go to Team Hub', icon: Users, action: () => { setView('team'); setCommandPaletteOpen(false); }, category: 'Navigation' },
    { label: 'Go to Profile & Settings', icon: Shield, action: () => { setView('profile'); setCommandPaletteOpen(false); }, category: 'Navigation' },
  ];

  const actionCommands = [
    { label: 'Create New Task...', icon: Plus, action: () => { setCommandPaletteOpen(false); setTimeout(() => setQuickAddTaskOpen(true), 150); }, category: 'Actions' },
    { label: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`, icon: theme === 'dark' ? Sun : Moon, action: () => { toggleTheme(); setCommandPaletteOpen(false); }, category: 'Actions' },
    { label: 'Log Out Session', icon: LogOut, action: () => { logout(); setCommandPaletteOpen(false); }, category: 'Actions' },
  ];

  const taskCommands = tasks
    .filter(t => !t.archived)
    .map(t => ({
      label: `Task: ${t.title}`,
      icon: CheckSquare,
      action: () => {
        setSelectedTaskId(t.id);
        setView('tasks');
        setCommandPaletteOpen(false);
      },
      category: 'Tasks'
    }));

  const projectCommands = projects
    .filter(p => !p.archived)
    .map(p => ({
      label: `Project: ${p.name}`,
      icon: Folder,
      action: () => {
        setView('projects');
        setCommandPaletteOpen(false);
      },
      category: 'Projects'
    }));

  const allItems = [...navigationCommands, ...actionCommands, ...projectCommands, ...taskCommands];

  const filteredItems = allItems.filter(item =>
    item.label.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300">
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: -8 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          ref={containerRef}
          className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[500px]"
        >
          {/* Search Bar */}
          <div className="flex items-center px-4 py-3 border-b border-slate-200 dark:border-slate-800 gap-3">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Type a command, task, project, or view... (e.g. 'design', 'calendar')"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedIndex(0);
              }}
              className="w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none text-base py-1"
            />
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-[10px] text-slate-500 font-mono select-none border border-slate-200/50 dark:border-slate-700/50">
              ESC
            </div>
          </div>

          {/* Items List */}
          <div className="overflow-y-auto p-2 flex-1">
            {filteredItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center mb-3">
                  <Search className="w-5 h-5 text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-300">No results found</p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                  We couldn't find anything matching "{search}"
                </p>
              </div>
            ) : (
              <div>
                {/* Group headers or flat list. Flat list is easier and cleaner. */}
                {filteredItems.map((item, index) => {
                  const Icon = item.icon;
                  const isSelected = index === selectedIndex;
                  return (
                    <button
                      key={`${item.category}-${item.label}-${index}`}
                      onClick={item.action}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between transition-all duration-150 ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
                          <Icon className="w-4 h-4 shrink-0" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{item.label}</span>
                          <span className={`text-[10px] uppercase tracking-wider ${isSelected ? 'text-indigo-200' : 'text-slate-400 dark:text-slate-500'}`}>
                            {item.category}
                          </span>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="flex items-center gap-1 text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono">
                          Enter
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Guide */}
          <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between select-none">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Keyboard className="w-3.5 h-3.5" />
                <span>Navigate:</span>
                <kbd className="bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">↑↓</kbd>
              </span>
              <span className="flex items-center gap-1">
                <span>Select:</span>
                <kbd className="bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">Enter</kbd>
              </span>
            </div>
            <span>Press <kbd className="bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">⌘</kbd> + <kbd className="bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">K</kbd> to toggle anytime</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
