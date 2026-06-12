import React from 'react';
import { useTaskStore } from '../store/taskStore';
import {
  TrendingUp,
  CheckCircle,
  Clock,
  Calendar as CalendarIcon,
  Layers,
  ArrowUpRight,
  Sparkles,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

export const DashboardView: React.FC = () => {
  const {
    tasks,
    projects,
    activities,
    setView,
    updateTask,
    setSelectedTaskId
  } = useTaskStore();

  // Calculate statistics
  const activeTasks = tasks.filter(t => !t.archived);
  const completedTasks = activeTasks.filter(t => t.status === 'done');
  const pendingTasks = activeTasks.filter(t => t.status !== 'done');
  const completionRate = activeTasks.length > 0 ? Math.round((completedTasks.length / activeTasks.length) * 100) : 0;

  // Time spent analytics
  const totalEstimated = activeTasks.reduce((sum, t) => sum + (t.estimatedTime || 0), 0);
  const totalSpent = activeTasks.reduce((sum, t) => sum + (t.timeSpent || 0), 0);
  const timeSpentHours = Math.round(totalSpent / 60);
  const timeEstHours = Math.round(totalEstimated / 60);

  // Focus tasks (high priority, not done, due soon)
  const focusTasks = pendingTasks
    .filter(t => t.priority === 'high')
    .slice(0, 3);

  // Weekly productivity score mock values
  const weeklyScores = [
    { day: 'Mon', completed: 3, score: 75 },
    { day: 'Tue', completed: 5, score: 90 },
    { day: 'Wed', completed: 4, score: 80 },
    { day: 'Thu', completed: 6, score: 95 },
    { day: 'Fri', completed: 2, score: 60 },
    { day: 'Sat', completed: 1, score: 30 },
    { day: 'Sun', completed: 0, score: 10 }
  ];

  // SVG Chart Mock Data - last 7 days completions
  // Rendered as a sleek glowing line chart
  const chartPoints = [
    { x: 30, y: 150 },
    { x: 90, y: 120 },
    { x: 150, y: 140 },
    { x: 210, y: 80 },
    { x: 270, y: 95 },
    { x: 330, y: 50 },
    { x: 390, y: 40 }
  ];

  const chartPath = chartPoints.reduce((path, point, index) => {
    return index === 0 ? `M ${point.x} ${point.y}` : `${path} L ${point.x} ${point.y}`;
  }, '');

  const chartAreaPath = `${chartPath} L 390 180 L 30 180 Z`;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-rose-500/10 text-rose-500 border border-rose-500/20';
      case 'medium': return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
      default: return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
    }
  };

  const containerVariants: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const cardVariants: any = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 25 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto"
    >
      {/* Welcome Banner Card */}
      <motion.div
        variants={cardVariants}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 border border-indigo-500/20 dark:border-indigo-500/10 p-6 sm:p-8 text-white shadow-xl shadow-indigo-950/20"
      >
        <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Production Platform Ready</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Unlock Team Velocity with Aether
            </h2>
            <p className="text-slate-300 text-sm max-w-xl leading-relaxed">
              Your workspace is running at peak capacity. You have completed {completedTasks.length} out of {activeTasks.length} active tasks. Focus on high priority items to achieve your goals!
            </p>
          </div>
          
          {/* Circular Progress Gauge */}
          <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl shrink-0">
            <div className="relative w-16 h-16 flex items-center justify-center">
              {/* SVG Radial Progress */}
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="26" className="stroke-slate-700" strokeWidth="4" fill="transparent" />
                <motion.circle
                  cx="32" cy="32" r="26"
                  className="stroke-indigo-400"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={163.3}
                  initial={{ strokeDashoffset: 163.3 }}
                  animate={{ strokeDashoffset: 163.3 - (163.3 * completionRate) / 100 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />
              </svg>
              <span className="absolute text-sm font-bold">{completionRate}%</span>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-200">Tasks Completed</h4>
              <p className="text-[10px] text-slate-400">Target: 80% completion rate</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Widgets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Tasks', value: activeTasks.length, sub: 'Across all spaces', icon: Layers, color: 'text-indigo-500 bg-indigo-500/10' },
          { title: 'Completed Tasks', value: completedTasks.length, sub: `${completionRate}% Completion Rate`, icon: CheckCircle, color: 'text-emerald-500 bg-emerald-500/10' },
          { title: 'In Progress', value: activeTasks.filter(t => t.status === 'in-progress').length, sub: 'Currently active', icon: TrendingUp, color: 'text-sky-500 bg-sky-500/10' },
          { title: 'Tracked Hours', value: `${timeSpentHours}h / ${timeEstHours}h`, sub: 'Actual vs Estimated', icon: Clock, color: 'text-amber-500 bg-amber-500/10' }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              variants={cardVariants}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between shadow-sm hover:shadow-md transition-all hover:translate-y-[-2px] group"
            >
              <div className="space-y-1">
                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">{stat.title}</span>
                <h3 className="text-2xl font-bold text-slate-950 dark:text-white tracking-tight">{stat.value}</h3>
                <p className="text-[10px] text-slate-500">{stat.sub}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.color} transition-transform group-hover:scale-110`}>
                <Icon className="w-5 h-5" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Charts & Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Productivity Chart */}
        <motion.div
          variants={cardVariants}
          className="lg:col-span-2 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-sm flex flex-col justify-between"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/60">
            <div>
              <h3 className="text-sm font-bold text-slate-950 dark:text-white flex items-center gap-1.5">
                <TrendingUp className="w-4.5 h-4.5 text-indigo-500" />
                Productivity Trend
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Completions by day (moving 7-day average)</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs text-emerald-500 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                +18.4%
              </span>
              <button onClick={() => setView('analytics')} className="text-xs text-indigo-500 font-bold hover:underline flex items-center gap-0.5">
                Full Report
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Glowing Custom SVG Line Chart */}
          <div className="w-full py-6 flex justify-center relative">
            <svg className="w-full max-w-[480px] h-[180px]" viewBox="0 0 420 200">
              <defs>
                <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="30" y1="40" x2="390" y2="40" className="stroke-slate-100 dark:stroke-slate-800" strokeDasharray="3 3" />
              <line x1="30" y1="95" x2="390" y2="95" className="stroke-slate-100 dark:stroke-slate-800" strokeDasharray="3 3" />
              <line x1="30" y1="150" x2="390" y2="150" className="stroke-slate-100 dark:stroke-slate-800" strokeDasharray="3 3" />
              <line x1="30" y1="180" x2="390" y2="180" className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="1.5" />

              {/* Area Under Line */}
              <motion.path
                d={chartAreaPath}
                fill="url(#chartGlow)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              />

              {/* Line Path */}
              <motion.path
                d={chartPath}
                fill="none"
                stroke="#6366f1"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
              />

              {/* Data Dots & Tooltips */}
              {chartPoints.map((pt, i) => (
                <g key={i}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="5"
                    className="fill-indigo-600 dark:fill-indigo-400 stroke-white dark:stroke-slate-900"
                    strokeWidth="2.5"
                  />
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="10"
                    className="fill-indigo-500/10 opacity-0 hover:opacity-100 transition-all cursor-pointer"
                  />
                </g>
              ))}

              {/* Labels */}
              {weeklyScores.map((score, idx) => (
                <text
                  key={idx}
                  x={chartPoints[idx].x}
                  y="196"
                  textAnchor="middle"
                  className="fill-slate-400 dark:fill-slate-500 text-[9px] font-semibold font-mono"
                >
                  {score.day}
                </text>
              ))}
            </svg>
          </div>

          {/* Weekly Mini Indicators */}
          <div className="grid grid-cols-7 gap-2 pt-4 border-t border-slate-100 dark:border-slate-800/60">
            {weeklyScores.map((score, index) => (
              <div key={index} className="flex flex-col items-center gap-1">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono font-medium">{score.day}</span>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full"
                    style={{ width: `${score.score}%` }}
                  />
                </div>
                <span className="text-[9px] text-slate-700 dark:text-slate-300 font-bold font-mono">
                  {score.completed}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right 1 Column: Today's Focus List */}
        <motion.div
          variants={cardVariants}
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-sm flex flex-col justify-between"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/60">
            <div>
              <h3 className="text-sm font-bold text-slate-950 dark:text-white flex items-center gap-1.5">
                <AlertCircle className="w-4.5 h-4.5 text-rose-500" />
                Focus of the Day
              </h3>
              <p className="text-[10px] text-slate-400">High priority tasks due shortly</p>
            </div>
            <button
              onClick={() => setView('tasks')}
              className="text-[10px] text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-0.5"
            >
              View Board
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex-1 my-3 overflow-y-auto space-y-2.5">
            {focusTasks.length === 0 ? (
              <div className="py-12 text-center flex flex-col items-center justify-center">
                <CheckCircle className="w-10 h-10 text-emerald-500/20 mb-2" />
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">No high priority focus today</p>
                <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">All urgent items have been handled.</p>
              </div>
            ) : (
              focusTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/60 hover:border-slate-200 dark:hover:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/30 transition-all flex gap-3 cursor-pointer group"
                  onClick={() => setSelectedTaskId(task.id)}
                >
                  <input
                    type="checkbox"
                    checked={task.status === 'done'}
                    onChange={(e) => {
                      e.stopPropagation();
                      updateTask(task.id, { status: e.target.checked ? 'done' : 'in-progress' });
                    }}
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 mt-0.5 shrink-0 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-500 transition-colors">
                      {task.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-semibold ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className="text-[9px] text-slate-400 flex items-center gap-1 font-mono">
                        <CalendarIcon className="w-2.5 h-2.5" />
                        {task.dueDate}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Custom Illustration or Workspace Quote */}
          <div className="p-3.5 bg-gradient-to-tr from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-2xl border border-indigo-100/50 dark:border-indigo-900/30 text-center">
            <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-1">PRO-TIP</span>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 italic">
              "Focus is a muscle, and task completion is its gym. Flex daily!"
            </p>
          </div>
        </motion.div>
      </div>

      {/* Projects Status & Activity Feed Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project List Widget */}
        <motion.div
          variants={cardVariants}
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-sm"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/60">
            <div>
              <h3 className="text-sm font-bold text-slate-950 dark:text-white">Active Projects</h3>
              <p className="text-[10px] text-slate-400">Status & target milestones</p>
            </div>
            <button onClick={() => setView('projects')} className="text-[10px] text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 font-bold">
              View All
            </button>
          </div>

          <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800/60">
            {projects.slice(0, 3).map((proj) => (
              <div key={proj.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 truncate">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-tr ${proj.color} shrink-0`} />
                  <div className="truncate">
                    <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{proj.name}</h4>
                    <span className="text-[9px] text-slate-400 font-mono">Due: {proj.dueDate}</span>
                  </div>
                </div>
                
                {/* Horizontal Progress Bar */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-16 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full" style={{ width: `${proj.progress}%` }} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 font-mono">{proj.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Activity Timeline Feed */}
        <motion.div
          variants={cardVariants}
          className="lg:col-span-2 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-sm flex flex-col justify-between"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/60">
            <div>
              <h3 className="text-sm font-bold text-slate-950 dark:text-white">Workspace Timeline</h3>
              <p className="text-[10px] text-slate-400">Real-time team activity logs</p>
            </div>
            <button onClick={() => setView('team')} className="text-[10px] text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 font-bold">
              Activity Hub
            </button>
          </div>

          <div className="mt-3 flex-1 overflow-y-auto space-y-3.5 max-h-48 pr-1">
            {activities.slice(0, 4).map((act) => (
              <div key={act.id} className="flex items-start gap-3 text-xs">
                <img src={act.avatar} className="w-6.5 h-6.5 rounded-full object-cover border border-slate-200 dark:border-slate-800 mt-0.5 shrink-0" alt={act.user} />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                    <span className="font-semibold text-slate-900 dark:text-slate-200">{act.user}</span>{' '}
                    <span>{act.action}</span>{' '}
                    <span className="font-semibold text-slate-800 dark:text-slate-300">"{act.target}"</span>
                  </p>
                  <span className="text-[9px] text-slate-400 font-mono block mt-0.5">{act.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
