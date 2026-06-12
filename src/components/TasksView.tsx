import React, { useState } from 'react';
import { useTaskStore, Task } from '../store/taskStore';
import {
  KanbanSquare,
  List,
  Grid,
  Search,
  Plus,
  Calendar as CalendarIcon,
  MessageSquare,
  Paperclip,
  Bookmark,
  Copy,
  Archive,
  Trash2,
  Clock,
  ArrowUpDown,
  CheckSquare
} from 'lucide-react';

export const TasksView: React.FC = () => {
  const {
    tasks,
    projects,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    projectFilter,
    setProjectFilter,
    sortBy,
    setSortBy,
    updateTask,
    deleteTask,
    duplicateTask,
    archiveTask,
    toggleBookmarkTask,
    setSelectedTaskId,
    setQuickAddTaskOpen,
    moveTask
  } = useTaskStore();

  const [activeTab, setActiveTab] = useState<'kanban' | 'list' | 'grid'>('kanban');

  // Filter and sort tasks
  const filteredTasks = tasks
    .filter((task) => {
      if (task.archived) return false;
      
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.label.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      const matchesProject = projectFilter === 'all' || task.projectId === projectFilter;
      
      return matchesSearch && matchesStatus && matchesPriority && matchesProject;
    })
    .sort((a, b) => {
      if (sortBy === 'dueDate') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (sortBy === 'priority') {
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      return a.title.localeCompare(b.title);
    });

  // Kanban Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: Task['status']) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      moveTask(taskId, status);
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-rose-500/15 text-rose-500 border border-rose-500/10';
      case 'medium': return 'bg-amber-500/15 text-amber-500 border border-amber-500/10';
      default: return 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/10';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-slate-400 dark:bg-slate-500';
      case 'in-progress': return 'bg-indigo-500';
      case 'in-review': return 'bg-amber-500';
      default: return 'bg-emerald-500';
    }
  };

  const getProjectName = (projId: string) => {
    const proj = projects.find(p => p.id === projId);
    return proj ? proj.name : 'No Project';
  };

  const getProjectColor = (projId: string) => {
    const proj = projects.find(p => p.id === projId);
    return proj ? proj.color : 'from-slate-400 to-slate-500';
  };

  // Render Kanban Board Column
  const renderKanbanColumn = (status: Task['status'], title: string) => {
    const columnTasks = filteredTasks.filter((t) => t.status === status);
    return (
      <div
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, status)}
        className="flex-1 min-w-[280px] bg-slate-50/50 dark:bg-slate-900/35 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl p-4 flex flex-col max-h-[calc(100vh-220px)]"
      >
        {/* Column Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200/40 dark:border-slate-800/40">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${getStatusColor(status)}`} />
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">{title}</h3>
          </div>
          <span className="text-[10px] bg-slate-200/60 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full font-bold">
            {columnTasks.length}
          </span>
        </div>

        {/* Column Scrollable Container */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-[150px]">
          {columnTasks.map((task) => (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => handleDragStart(e, task.id)}
              onClick={() => setSelectedTaskId(task.id)}
              className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-4 rounded-xl shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700/60 transition-all cursor-grab active:cursor-grabbing relative group"
            >
              {/* Task Header: Project Badge & Bookmark */}
              <div className="flex justify-between items-start gap-2 mb-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-tr ${getProjectColor(task.projectId)} shrink-0`} />
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 truncate uppercase">
                    {getProjectName(task.projectId)}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmarkTask(task.id);
                  }}
                  className={`p-0.5 rounded transition-colors ${
                    task.bookmarked ? 'text-amber-500' : 'text-slate-300 hover:text-slate-500 dark:text-slate-700 dark:hover:text-slate-500'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>

              {/* Title & Description */}
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-500 transition-colors line-clamp-2 leading-tight">
                {task.title}
              </h4>
              {task.description && (
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {task.description}
                </p>
              )}

              {/* Checklist Progress Bar (if checklist exists) */}
              {task.checklist && task.checklist.length > 0 && (
                <div className="mt-3">
                  <div className="flex justify-between items-center text-[9px] text-slate-400 font-semibold mb-1">
                    <span>Checklist</span>
                    <span>
                      {task.checklist.filter(c => c.completed).length}/{task.checklist.length}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-500 h-full rounded-full"
                      style={{
                        width: `${
                          (task.checklist.filter(c => c.completed).length / task.checklist.length) * 100
                        }%`
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Task Footer: Priority, Metadata & Actions */}
              <div className="flex justify-between items-center mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/60 gap-2">
                <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-semibold ${getPriorityStyle(task.priority)}`}>
                  {task.priority}
                </span>

                <div className="flex items-center gap-2.5 text-[10px] text-slate-400 dark:text-slate-500 shrink-0 font-mono">
                  {task.comments.length > 0 && (
                    <span className="flex items-center gap-0.5" title="Comments">
                      <MessageSquare className="w-3 h-3" />
                      {task.comments.length}
                    </span>
                  )}
                  {task.attachments.length > 0 && (
                    <span className="flex items-center gap-0.5" title="Attachments">
                      <Paperclip className="w-3 h-3" />
                      {task.attachments.length}
                    </span>
                  )}
                  <span className="flex items-center gap-0.5" title="Due Date">
                    <CalendarIcon className="w-3 h-3" />
                    {task.dueDate.split('-')[1]}/{task.dueDate.split('-')[2]}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {columnTasks.length === 0 && (
            <div className="flex-1 border border-dashed border-slate-200 dark:border-slate-800/50 rounded-xl flex items-center justify-center py-10">
              <span className="text-[10px] text-slate-400 dark:text-slate-600 uppercase font-semibold tracking-wider">Drop tasks here</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto flex flex-col h-[calc(100vh-70px)] overflow-hidden">
      {/* Search and Filter Control Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm shrink-0">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* View Tab Buttons */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200/10 shrink-0">
            {[
              { id: 'kanban', label: 'Kanban', icon: KanbanSquare },
              { id: 'list', label: 'List View', icon: List },
              { id: 'grid', label: 'Grid View', icon: Grid }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Add Task Trigger */}
          <button
            onClick={() => setQuickAddTaskOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Task</span>
          </button>
        </div>

        {/* Filters and Sorting Inputs */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Search bar */}
          <div className="relative w-full sm:w-44">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800/50 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800/50 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="in-review">In Review</option>
            <option value="done">Done</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800/50 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Project Filter */}
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800/50 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none max-w-[120px] truncate"
          >
            <option value="all">All Projects</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          {/* Sort By */}
          <button
            type="button"
            onClick={() => {
              const nextSort = sortBy === 'dueDate' ? 'priority' : sortBy === 'priority' ? 'title' : 'dueDate';
              setSortBy(nextSort);
            }}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 flex items-center gap-1 text-xs cursor-pointer"
            title={`Sorting by ${sortBy}`}
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-indigo-500" />
            <span className="font-semibold capitalize">{sortBy === 'dueDate' ? 'Due Date' : sortBy}</span>
          </button>
        </div>
      </div>

      {/* Main Views Render Container */}
      <div className="flex-1 overflow-hidden">
        {filteredTasks.length === 0 ? (
          /* Gorgeous Empty State */
          <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-slate-50/20 dark:bg-slate-900/10 border border-dashed border-slate-200 dark:border-slate-800/60 rounded-3xl">
            <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 animate-pulse">
              <CheckSquare className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No tasks matching your filters</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1 leading-relaxed">
              Try adjusting your query, switching to a different project space, or create a brand new task to get things moving.
            </p>
            <button
              onClick={() => setQuickAddTaskOpen(true)}
              className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-indigo-600/15 transition-all cursor-pointer"
            >
              Create New Task
            </button>
          </div>
        ) : (
          <div className="h-full overflow-hidden">
            {activeTab === 'kanban' && (
              /* Kanban Columns Grid */
              <div className="flex gap-4 overflow-x-auto h-full pb-4 items-start">
                {renderKanbanColumn('todo', 'To Do')}
                {renderKanbanColumn('in-progress', 'In Progress')}
                {renderKanbanColumn('in-review', 'In Review')}
                {renderKanbanColumn('done', 'Completed')}
              </div>
            )}

            {activeTab === 'list' && (
              /* High-density List View */
              <div className="h-full overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-150 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">
                      <th className="py-3 px-4 w-10 text-center">Done</th>
                      <th className="py-3 px-3">Task Title</th>
                      <th className="py-3 px-3">Project</th>
                      <th className="py-3 px-3">Priority</th>
                      <th className="py-3 px-3">Label</th>
                      <th className="py-3 px-3">Due Date</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                    {filteredTasks.map((task) => (
                      <tr
                        key={task.id}
                        onClick={() => setSelectedTaskId(task.id)}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all cursor-pointer group"
                      >
                        <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={task.status === 'done'}
                            onChange={(e) => {
                              updateTask(task.id, { status: e.target.checked ? 'done' : 'in-progress' });
                            }}
                            className="w-4.5 h-4.5 rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-900 dark:text-slate-255">
                          <span className={task.status === 'done' ? 'line-through text-slate-400 dark:text-slate-500' : 'group-hover:text-indigo-500 transition-colors'}>
                            {task.title}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-semibold">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-tr ${getProjectColor(task.projectId)} text-white`}>
                            {getProjectName(task.projectId)}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold ${getPriorityStyle(task.priority)}`}>
                            {task.priority}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{task.label || 'None'}</span>
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-600 dark:text-slate-400">
                          {task.dueDate}
                        </td>
                        <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => duplicateTask(task.id)}
                              className="p-1 text-slate-400 hover:text-indigo-500 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                              title="Duplicate"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => archiveTask(task.id)}
                              className="p-1 text-slate-400 hover:text-amber-500 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                              title="Archive"
                            >
                              <Archive className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="p-1 text-slate-400 hover:text-rose-500 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'grid' && (
              /* Grid Layout view */
              <div className="h-full overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-12">
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTaskId(task.id)}
                    className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700/60 transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      {/* Grid card header */}
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-tr ${getProjectColor(task.projectId)} text-white font-bold`}>
                          {getProjectName(task.projectId)}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleBookmarkTask(task.id);
                            }}
                            className={`p-0.5 rounded ${task.bookmarked ? 'text-amber-500' : 'text-slate-300 hover:text-slate-500'}`}
                          >
                            <Bookmark className="w-3.5 h-3.5 fill-current" />
                          </button>
                        </div>
                      </div>

                      {/* Title & Description */}
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-500 transition-colors line-clamp-2 mt-2 leading-tight">
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-3 leading-relaxed">
                          {task.description}
                        </p>
                      )}
                    </div>

                    {/* Progress details & actions footer */}
                    <div className="mt-4 pt-4 border-t border-slate-150 dark:border-slate-800/60">
                      {task.checklist && task.checklist.length > 0 && (
                        <div className="mb-4">
                          <div className="flex justify-between items-center text-[9px] text-slate-400 font-semibold mb-1">
                            <span>Checklist progress</span>
                            <span>{task.checklist.filter(c => c.completed).length}/{task.checklist.length}</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                            <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${(task.checklist.filter(c => c.completed).length / task.checklist.length) * 100}%` }} />
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold ${getPriorityStyle(task.priority)}`}>
                          {task.priority}
                        </span>

                        <span className="text-[9px] text-slate-400 dark:text-slate-500 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-indigo-500" />
                          {task.dueDate}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
