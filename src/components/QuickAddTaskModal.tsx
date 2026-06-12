import React, { useState, useEffect, useRef } from 'react';
import { useTaskStore, Task } from '../store/taskStore';
import { X, Sparkles, Calendar, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const QuickAddTaskModal: React.FC = () => {
  const {
    quickAddTaskOpen,
    setQuickAddTaskOpen,
    projects,
    addTask
  } = useTaskStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [dueDate, setDueDate] = useState('');
  const [label, setLabel] = useState('Design');

  // Checklist builder state
  const [checklistInput, setChecklistInput] = useState('');
  const [checklistItems, setChecklistItems] = useState<{ text: string; completed: boolean }[]>([]);

  const titleInputRef = useRef<HTMLInputElement>(null);

  // Set default project and due date when opened
  useEffect(() => {
    if (quickAddTaskOpen) {
      if (projects.length > 0 && !projectId) {
        setProjectId(projects[0].id);
      }
      
      // Default due date to today
      const todayStr = new Date().toISOString().split('T')[0];
      setDueDate(todayStr);
      
      // Clear forms
      setTitle('');
      setDescription('');
      setChecklistItems([]);
      setChecklistInput('');
      
      // Focus title
      setTimeout(() => titleInputRef.current?.focus(), 150);
    }
  }, [quickAddTaskOpen, projects]);

  if (!quickAddTaskOpen) return null;

  const handleAddCheckItem = () => {
    if (!checklistInput.trim()) return;
    setChecklistItems([...checklistItems, { text: checklistInput.trim(), completed: false }]);
    setChecklistInput('');
  };

  const handleRemoveCheckItem = (idx: number) => {
    setChecklistItems(checklistItems.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !projectId || !dueDate) return;

    addTask({
      projectId,
      title: title.trim(),
      description: description.trim(),
      status: 'todo',
      priority,
      dueDate,
      label,
      recurrence: 'none',
      checklist: checklistItems,
      estimatedTime: 120, // default estimation
      timeSpent: 0
    });

    setQuickAddTaskOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
        {/* Backdrop overlay click-to-close */}
        <div className="absolute inset-0" onClick={() => setQuickAddTaskOpen(false)} />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.18 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10"
        >
          {/* Header */}
          <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 dark:text-indigo-400">
                Quick Add Task
              </span>
            </div>
            <button
              onClick={() => setQuickAddTaskOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
            {/* Title */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase">Task Title</label>
              <input
                ref={titleInputRef}
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase">Notes & Guidelines</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Add secondary guidelines, URLs, or requirements..."
                className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Grid of Attributes */}
            <div className="grid grid-cols-2 gap-3 bg-slate-50/50 dark:bg-slate-900/30 p-3 rounded-2xl border border-slate-100 dark:border-slate-850">
              {/* Project Allocation */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase">Target Space</label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-750 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase">Priority Level</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-750 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              {/* Due Date */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Due Date
                </label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-750 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>

              {/* Label */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1">
                  <Tag className="w-3 h-3" /> Category Label
                </label>
                <select
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-750 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  <option value="Design">Design</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="QA Testing">QA Testing</option>
                  <option value="Security">Security</option>
                  <option value="Finances">Finances</option>
                </select>
              </div>
            </div>

            {/* Checklist subtasks */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-450 dark:text-slate-550 uppercase">Initial Subtasks</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={checklistInput}
                  onChange={(e) => setChecklistInput(e.target.value)}
                  onKeyDown={(e) => { if(e.key==='Enter'){ e.preventDefault(); handleAddCheckItem(); } }}
                  placeholder="e.g. Prototype grid layouts..."
                  className="flex-1 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddCheckItem}
                  className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200/10"
                >
                  Add
                </button>
              </div>

              {/* Subtasks list bubble wrap */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {checklistItems.map((item, idx) => (
                  <div key={idx} className="bg-slate-105 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1.5">
                    <span>{item.text}</span>
                    <button type="button" onClick={() => handleRemoveCheckItem(idx)} className="text-slate-400 hover:text-rose-500">
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer buttons */}
            <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setQuickAddTaskOpen(false)}
                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-4.5 py-2 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md shadow-indigo-600/10 cursor-pointer"
              >
                Create Task
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
