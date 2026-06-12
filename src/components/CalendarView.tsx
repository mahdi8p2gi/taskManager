import React, { useState } from 'react';
import { useTaskStore } from '../store/taskStore';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock
} from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { tasks, setSelectedTaskId, setQuickAddTaskOpen } = useTaskStore();
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  const activeTasks = tasks.filter(t => !t.archived);

  // Month calculations (Feb 2026 starts on Sunday, has 28 days)
  const daysInMonth = 28;
  const startOffset = 0; // Feb 1 2026 is a Sunday (0)
  
  const monthDays = Array.from({ length: daysInMonth }, (_, idx) => idx + 1);
  const leadingEmptyDays = Array.from({ length: startOffset }, () => null);
  const calendarCells = [...leadingEmptyDays, ...monthDays];

  const handleDayClick = () => {
    // Open Quick Add Task pre-filled with this date
    setQuickAddTaskOpen(true);
  };

  const getTasksForDate = (day: number) => {
    const dateStr = `2026-02-${String(day).padStart(2, '0')}`;
    return activeTasks.filter(t => t.dueDate === dateStr);
  };

  const getPriorityBorder = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-2 border-rose-500';
      case 'medium': return 'border-l-2 border-amber-500';
      default: return 'border-l-2 border-emerald-500';
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto flex flex-col h-[calc(100vh-70px)] overflow-hidden">
      {/* Calendar Header Control Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-xl">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-950 dark:text-white">
              {viewMode === 'month' ? 'February 2026' : viewMode === 'week' ? 'Feb 15 – Feb 21, 2026' : 'February 15, 2026'}
            </h2>
            <p className="text-[10px] text-slate-400">Coordinate and plan deliverables visually across your timeline.</p>
          </div>
        </div>

        {/* View Mode Selectors */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200/10">
            {[
              { id: 'month', label: 'Month' },
              { id: 'week', label: 'Week' },
              { id: 'day', label: 'Day' }
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === mode.id
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-850'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setQuickAddTaskOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Main Calendar Render Panel */}
      <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl shadow-sm overflow-hidden flex flex-col">
        {viewMode === 'month' && (
          <div className="flex-1 flex flex-col h-full">
            {/* Days of the week labels */}
            <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50 text-center py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-500">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day}>{day}</div>
              ))}
            </div>

            {/* Monthly Calendar Grid Cells */}
            <div className="grid grid-cols-7 flex-1 divide-x divide-y divide-slate-100 dark:divide-slate-800/60 border-l border-t border-transparent">
              {calendarCells.map((day, idx) => {
                const dayTasks = day ? getTasksForDate(day) : [];
                const isToday = day === 15; // Mock today date
                
                return (
                  <div
                    key={idx}
                    onClick={() => day && handleDayClick()}
                    className={`p-2 flex flex-col justify-between min-h-[80px] hover:bg-slate-55/20 dark:hover:bg-slate-850/20 transition-all cursor-pointer group ${
                      isToday ? 'bg-indigo-500/5 dark:bg-indigo-500/2' : ''
                    }`}
                  >
                    {/* Day Number Row */}
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-[11px] font-bold font-mono px-1.5 py-0.5 rounded-md ${
                        isToday
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                      }`}>
                        {day || ''}
                      </span>
                      {isToday && (
                        <span className="text-[8px] bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.25 rounded-full font-bold uppercase shrink-0">
                          Today
                        </span>
                      )}
                    </div>

                    {/* Day Task Badges List */}
                    <div className="flex-1 space-y-1 overflow-y-auto max-h-[80px] pr-0.5">
                      {dayTasks.map((task) => (
                        <div
                          key={task.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTaskId(task.id);
                          }}
                          className={`px-2 py-1 rounded-lg text-[9px] font-semibold text-slate-700 dark:text-slate-300 truncate bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors ${getPriorityBorder(task.priority)}`}
                          title={`${task.title} (Priority: ${task.priority})`}
                        >
                          {task.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {viewMode === 'week' && (
          <div className="flex-1 overflow-y-auto p-4 flex flex-col">
            <div className="grid grid-cols-7 gap-4 h-full">
              {[
                { day: 'Sunday', date: 'Feb 15', num: 15 },
                { day: 'Monday', date: 'Feb 16', num: 16 },
                { day: 'Tuesday', date: 'Feb 17', num: 17 },
                { day: 'Wednesday', date: 'Feb 18', num: 18 },
                { day: 'Thursday', date: 'Feb 19', num: 19 },
                { day: 'Friday', date: 'Feb 20', num: 20 },
                { day: 'Saturday', date: 'Feb 21', num: 21 }
              ].map((dayObj, i) => {
                const dayTasks = getTasksForDate(dayObj.num);
                const isToday = dayObj.num === 15;

                 return (
                  <div
                    key={i}
                    onClick={() => handleDayClick()}
                    className={`flex-1 min-h-[350px] p-3 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-150 dark:border-slate-800/40 flex flex-col gap-3 hover:border-indigo-500/30 cursor-pointer transition-all ${
                      isToday ? 'ring-2 ring-indigo-600/30' : ''
                    }`}
                  >
                    <div className="flex flex-col pb-2 border-b border-slate-200/40 dark:border-slate-800/40">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{dayObj.day}</span>
                      <span className={`text-sm font-bold mt-0.5 font-mono ${isToday ? 'text-indigo-500' : 'text-slate-800 dark:text-slate-200'}`}>
                        {dayObj.date}
                      </span>
                    </div>

                    <div className="flex-1 space-y-2.5 overflow-y-auto">
                      {dayTasks.map((task) => (
                        <div
                          key={task.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTaskId(task.id);
                          }}
                          className={`bg-white dark:bg-slate-850 p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-750 shadow-sm hover:shadow-md transition-all ${getPriorityBorder(task.priority)}`}
                        >
                          <h4 className="text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate">{task.title}</h4>
                          <span className="text-[8px] text-slate-450 dark:text-slate-500 mt-1 block uppercase font-mono">
                            {task.label || 'Task'}
                          </span>
                        </div>
                      ))}
                      {dayTasks.length === 0 && (
                        <div className="h-full flex items-center justify-center py-20 text-center">
                          <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">No Events</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {viewMode === 'day' && (
          <div className="flex-1 p-6 flex gap-6 overflow-y-auto">
            {/* Left Side: Agenda Timeslot Grid */}
            <div className="flex-1 space-y-4 max-w-2xl">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800/60">
                <Clock className="w-4 h-4 text-indigo-500" />
                Schedule breakdown for Feb 15
              </h3>

              <div className="space-y-3">
                {[
                  { time: '09:00 AM', title: 'Daily Standup Call', type: 'meeting', desc: 'Sync progress on brand overhaul & task assignments.' },
                  { time: '11:00 AM', title: 'Code responsive Tailwind CSS Header', type: 'task', desc: 'Task #t3 due by tomorrow morning.' },
                  { time: '02:00 PM', title: 'QA Review & Penetration Pre-check', type: 'milestone', desc: 'Security audit phase 1 milestone due.' },
                  { time: '04:30 PM', title: 'Marketing sync & strategy planning', type: 'meeting', desc: 'Prepare collateral and draft updates.' }
                ].map((item, index) => (
                  <div key={index} className="flex gap-4 p-4 bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/30 dark:border-slate-800/20 rounded-2xl">
                    <span className="text-[10px] font-bold font-mono text-indigo-500 shrink-0 mt-0.5 w-16">{item.time}</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side: Quick Stats and widgets */}
            <div className="w-80 border-l border-slate-100 dark:border-slate-800/60 pl-6 hidden md:flex flex-col gap-5">
              <div className="p-4 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl">
                <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-1">PRO-TIP</span>
                <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Plan your weekly focus in advance. Toggle "Week" view to drag your items across columns.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase">Upcoming Deadlines</h4>
                <div className="space-y-2.5">
                  {activeTasks.slice(0, 3).map((task) => (
                    <div
                      key={task.id}
                      onClick={() => setSelectedTaskId(task.id)}
                      className="p-3 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-xl flex items-center justify-between cursor-pointer hover:border-indigo-500 transition-colors"
                    >
                      <div className="truncate pr-2">
                        <h5 className="text-[11px] font-bold text-slate-800 dark:text-slate-250 truncate">{task.title}</h5>
                        <span className="text-[9px] text-slate-450 dark:text-slate-500 font-mono">{task.dueDate}</span>
                      </div>
                      <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold uppercase shrink-0 ${getPriorityBorder(task.priority)} bg-slate-50 dark:bg-slate-800`}>
                        {task.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
