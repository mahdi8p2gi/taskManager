import React from 'react';
import { useTaskStore } from '../store/taskStore';
import {
  BarChart3,
  TrendingUp,
  Clock,
  AlertCircle,
  FileSpreadsheet,
  Download,
  Flame
} from 'lucide-react';
import { motion } from 'framer-motion';

export const AnalyticsView: React.FC = () => {
  const { tasks } = useTaskStore();

  const activeTasks = tasks.filter(t => !t.archived);
  
  // Calculate task counts by priority
  const highPriorityCount = activeTasks.filter(t => t.priority === 'high').length;
  const mediumPriorityCount = activeTasks.filter(t => t.priority === 'medium').length;
  const lowPriorityCount = activeTasks.filter(t => t.priority === 'low').length;
  const totalPriorityCount = highPriorityCount + mediumPriorityCount + lowPriorityCount || 1;

  const highPct = Math.round((highPriorityCount / totalPriorityCount) * 100);
  const mediumPct = Math.round((mediumPriorityCount / totalPriorityCount) * 100);
  const lowPct = Math.round((lowPriorityCount / totalPriorityCount) * 100);

  // Time metrics
  const totalEstimated = activeTasks.reduce((sum, t) => sum + (t.estimatedTime || 0), 0);
  const totalSpent = activeTasks.reduce((sum, t) => sum + (t.timeSpent || 0), 0);
  const timeSpentHours = Math.round(totalSpent / 60);
  const timeEstHours = Math.round(totalEstimated / 60);

  // SVG Donut Chart Calculations
  // Total circumference is 2 * PI * r = 2 * 3.14159 * 25 = 157
  const r = 25;
  const c = 2 * Math.PI * r; // ~157.08
  
  const highOffset = c - (c * highPct) / 100;
  const medOffset = c - (c * mediumPct) / 100;

  // Weekly Completions Bar Chart Mock Data
  const weeklyData = [
    { name: 'Wk 1', completed: 6, target: 8, height: 110 },
    { name: 'Wk 2', completed: 10, target: 8, height: 160 },
    { name: 'Wk 3', completed: 8, target: 8, height: 130 },
    { name: 'Wk 4', completed: 12, target: 10, height: 190 },
    { name: 'Wk 5', completed: 9, target: 10, height: 145 }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      {/* Top Title Card */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-xl">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-950 dark:text-white">Workspace Intelligence</h2>
            <p className="text-[10px] text-slate-400">Deep-dive performance analytics, team workloads, and time tracking audits.</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 border border-slate-200/20 transition-all cursor-pointer">
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button className="bg-indigo-600 hover:bg-indigo-505 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow transition-all cursor-pointer">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Grid of Key Analytics Dials */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Radial Productivity Gauge */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-5 rounded-3xl shadow-sm flex flex-col justify-between items-center text-center space-y-4">
          <div className="w-full flex justify-between items-start">
            <h3 className="text-xs font-bold text-slate-450 uppercase">Productivity Index</h3>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>

          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* SVG Double Gauge */}
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="54" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="8" fill="transparent" />
              <motion.circle
                cx="64"
                cy="64"
                r="54"
                className="stroke-indigo-600 dark:stroke-indigo-500"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={339.3}
                initial={{ strokeDashoffset: 339.3 }}
                animate={{ strokeDashoffset: 339.3 - (339.3 * 84) / 100 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">84</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">INDEX SCORE</span>
            </div>
          </div>

          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Elite Performance Level</h4>
            <p className="text-[10px] text-slate-400">Your task completion velocity is in the top 5% of workspaces.</p>
          </div>
        </div>

        {/* Time Tracking Analysis */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-5 rounded-3xl shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <h3 className="text-xs font-bold text-slate-450 uppercase">Time Allocations</h3>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>

          <div className="space-y-4 my-3">
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-semibold">
                <span className="text-slate-500">Tracked Development Hours</span>
                <span className="text-slate-900 dark:text-slate-100 font-bold">{timeSpentHours}h / {timeEstHours}h</span>
              </div>
              <div className="w-full bg-slate-105 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full"
                  style={{ width: `${Math.min((totalSpent / (totalEstimated || 1)) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-semibold">
                <span className="text-slate-500">On-Time Deliveries</span>
                <span className="text-slate-900 dark:text-slate-100 font-bold">92%</span>
              </div>
              <div className="w-full bg-slate-105 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '92%' }} />
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/50 rounded-xl text-[10px] text-slate-500 dark:text-slate-400">
            <span className="font-bold text-slate-900 dark:text-slate-300 block mb-0.5">Time Efficiency Indicator:</span>
            Tasks are being resolved 12% faster than initial estimations. Excellent sprint planning!
          </div>
        </div>

        {/* Task Priority Distribution Donut Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-5 rounded-3xl shadow-sm flex flex-col justify-between items-center text-center">
          <div className="w-full flex justify-between items-start">
            <h3 className="text-xs font-bold text-slate-450 uppercase">Task Priorities</h3>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>

          {/* SVG Donut Chart */}
          <div className="relative w-32 h-32 flex items-center justify-center my-2">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="25" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="6" fill="transparent" />
              {/* High Priority Segment */}
              <circle
                cx="32" cy="32" r="25"
                className="stroke-rose-500"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={c}
                strokeDashoffset={highOffset}
              />
              {/* Medium Priority Segment (simple visual stack) */}
              <circle
                cx="32" cy="32" r="25"
                className="stroke-amber-500"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={c}
                strokeDashoffset={medOffset}
                style={{ transform: `rotate(${(highPct / 100) * 360}deg)`, transformOrigin: '32px 32px' }}
              />
            </svg>
            <div className="absolute flex flex-col">
              <span className="text-2xl font-bold text-slate-950 dark:text-white font-mono">{activeTasks.length}</span>
              <span className="text-[9px] text-slate-405 dark:text-slate-500 font-bold uppercase tracking-wider">Active</span>
            </div>
          </div>

          {/* Donut Legend */}
          <div className="flex gap-4 text-[10px] font-semibold mt-2">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" />High ({highPct}%)</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" />Med ({mediumPct}%)</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500" />Low ({lowPct}%)</span>
          </div>
        </div>
      </div>

      {/* Monthly Task Completion Velocity Bar Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-6 rounded-3xl shadow-sm">
        <div className="flex justify-between items-center pb-4 border-b border-slate-150 dark:border-slate-800/60 mb-6">
          <div>
            <h3 className="text-sm font-bold text-slate-950 dark:text-white flex items-center gap-1.5">
              <TrendingUp className="w-4.5 h-4.5 text-indigo-500" />
              Task Completion Velocity
            </h3>
            <p className="text-[10px] text-slate-500">Weekly breakdown of completed goals vs targets.</p>
          </div>
          
          <div className="flex gap-4 text-xs font-semibold font-mono">
            <span className="flex items-center gap-1.5 text-indigo-600"><span className="w-2.5 h-2.5 rounded bg-indigo-600" />Completed</span>
            <span className="flex items-center gap-1.5 text-slate-300 dark:text-slate-700"><span className="w-2.5 h-2.5 rounded bg-slate-200 dark:bg-slate-800" />Target</span>
          </div>
        </div>

        {/* Custom Bar Chart Drawing */}
        <div className="flex items-end justify-between h-56 max-w-xl mx-auto px-4 relative pt-6">
          {/* Horizontal grid lines */}
          <div className="absolute inset-x-0 bottom-0 top-6 flex flex-col justify-between pointer-events-none">
            <div className="border-t border-slate-100 dark:border-slate-800/60 w-full" />
            <div className="border-t border-slate-100 dark:border-slate-800/60 w-full" />
            <div className="border-t border-slate-100 dark:border-slate-800/60 w-full" />
            <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
          </div>

          {weeklyData.map((week, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 relative z-10 w-16">
              {/* Double Column Bars */}
              <div className="flex items-end gap-1.5 h-40 w-full justify-center">
                {/* Completed Bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(week.completed / 15) * 100}%` }}
                  transition={{ duration: 1, delay: idx * 0.1 }}
                  className="bg-indigo-600 dark:bg-indigo-500 w-4.5 rounded-t-lg relative group shadow-lg shadow-indigo-600/10"
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-slate-950 text-white text-[9px] font-bold py-0.5 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                    {week.completed} Tasks
                  </div>
                </motion.div>

                {/* Target Bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(week.target / 15) * 100}%` }}
                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                  className="bg-slate-200 dark:bg-slate-800 w-4.5 rounded-t-lg relative group"
                >
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-slate-950 text-white text-[9px] font-bold py-0.5 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                    Target: {week.target}
                  </div>
                </motion.div>
              </div>

              <span className="text-[10px] font-bold text-slate-550 dark:text-slate-500 font-mono mt-1">{week.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
