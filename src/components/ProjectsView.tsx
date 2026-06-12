import React, { useState } from 'react';
import { useTaskStore } from '../store/taskStore';
import {
  Folder,
  Plus,
  Calendar,
  Star,
  CheckSquare,
  ChevronRight,
  ChevronDown,
  FolderPlus,
  Trash2,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ProjectsView: React.FC = () => {
  const {
    projects,
    tasks,
    addProject,
    toggleFavoriteProject,
    toggleMilestone,
    archiveProject
  } = useTaskStore();

  const [isCreating, setIsCreating] = useState(false);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  // New Project Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [color, setColor] = useState('from-indigo-500 via-purple-500 to-pink-500');
  const [borderColor, setBorderColor] = useState('border-indigo-500/20');
  const [textColor, setTextColor] = useState('text-indigo-500');
  const [icon, setIcon] = useState('Layers');
  const [milestoneInput, setMilestoneInput] = useState('');
  const [milestones, setMilestones] = useState<{ title: string }[]>([]);

  const activeProjects = projects.filter(p => !p.archived);

  // Gradient presets
  const gradients = [
    { name: 'Aether Pink', gradient: 'from-indigo-500 via-purple-500 to-pink-500', border: 'border-indigo-500/20', text: 'text-indigo-500' },
    { name: 'Mint Emerald', gradient: 'from-emerald-500 to-teal-600', border: 'border-emerald-500/20', text: 'text-emerald-500' },
    { name: 'Sunset Amber', gradient: 'from-amber-500 to-rose-500', border: 'border-amber-500/20', text: 'text-amber-500' },
    { name: 'Sky Indigo', gradient: 'from-blue-500 to-indigo-600', border: 'border-blue-500/20', text: 'text-blue-500' }
  ];

  const handleAddMilestone = () => {
    if (!milestoneInput.trim()) return;
    setMilestones([...milestones, { title: milestoneInput.trim() }]);
    setMilestoneInput('');
  };

  const handleRemoveMilestone = (idx: number) => {
    setMilestones(milestones.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dueDate) return;

    addProject({
      name: name.trim(),
      description: description.trim(),
      dueDate,
      color,
      borderColor,
      textColor,
      icon,
      status: 'active',
      favorite: false,
      milestones: milestones as any,
      members: [] // Seeded with empty, user can add in team hub
    });

    // Reset Form
    setName('');
    setDescription('');
    setDueDate('');
    setMilestones([]);
    setIsCreating(false);
  };

  const getTaskStats = (projId: string) => {
    const projTasks = tasks.filter(t => t.projectId === projId && !t.archived);
    const completed = projTasks.filter(t => t.status === 'done').length;
    return {
      total: projTasks.length,
      completed,
      pending: projTasks.length - completed
    };
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      {/* Top Header Panel */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-xl">
            <Folder className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-950 dark:text-white">Workspace Spaces</h2>
            <p className="text-[10px] text-slate-400">Organize tasks, track milestone health, and monitor team velocity.</p>
          </div>
        </div>
        
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Slide-down Project Creator Form */}
      <AnimatePresence>
        {isCreating && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="bg-white dark:bg-slate-900 border border-slate-250/60 dark:border-slate-800/60 p-6 rounded-3xl shadow-md space-y-4 overflow-hidden"
          >
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 dark:text-indigo-400 flex items-center gap-1">
                <FolderPlus className="w-4 h-4" /> Create New Space
              </span>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Project Title</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Acme Billing Dashboard"
                    className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800/50 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    placeholder="Brief overview of the project objectives..."
                    className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800/50 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Target Due Date</label>
                    <input
                      type="date"
                      required
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800/50 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">System Icon</label>
                    <select
                      value={icon}
                      onChange={(e) => setIcon(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800/50 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none"
                    >
                      <option value="Layers">Layers</option>
                      <option value="Smartphone">Smartphone</option>
                      <option value="Rocket">Rocket</option>
                      <option value="Brain">Brain</option>
                      <option value="Globe">Globe</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Theme & Milestones Panel */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase block">Workspace Color Vibe</label>
                  <div className="flex gap-2">
                    {gradients.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setColor(preset.gradient);
                          setBorderColor(preset.border);
                          setTextColor(preset.text);
                        }}
                        className={`flex-1 h-9 rounded-xl bg-gradient-to-tr ${preset.gradient} border-2 transition-all shadow-sm ${
                          color === preset.gradient ? 'border-white scale-105 ring-2 ring-indigo-500' : 'border-transparent opacity-80'
                        }`}
                        title={preset.name}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Project Milestones</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={milestoneInput}
                      onChange={(e) => setMilestoneInput(e.target.value)}
                      placeholder="Add milestone (e.g., Wireframe Sign-off)"
                      className="flex-1 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800/50 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddMilestone}
                      className="bg-slate-105 dark:bg-slate-800 text-slate-850 dark:text-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-250/20"
                    >
                      Add
                    </button>
                  </div>

                  {/* Milestones list */}
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pt-1">
                    {milestones.map((ms, idx) => (
                      <div key={idx} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-350 px-2.5 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1.5">
                        <span>{ms.title}</span>
                        <button type="button" onClick={() => handleRemoveMilestone(idx)} className="text-slate-400 hover:text-rose-500">
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800/60">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-4 py-2 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md shadow-indigo-600/10"
              >
                Launch Space
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Projects Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeProjects.map((project) => {
          const stats = getTaskStats(project.id);
          const isExpanded = expandedProject === project.id;
          
          return (
            <motion.div
              key={project.id}
              layout
              className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Card Header Gradient Strip */}
              <div className={`h-2.5 bg-gradient-to-r ${project.color}`} />
              
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                {/* Space Title & Favoriting */}
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-950 dark:text-white truncate">
                        {project.name}
                      </h3>
                      <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0">
                        {project.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => toggleFavoriteProject(project.id)}
                      className={`p-1.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-850/50 transition-colors ${
                        project.favorite ? 'text-amber-400' : 'text-slate-300 hover:text-slate-500'
                      }`}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                    <button
                      onClick={() => archiveProject(project.id)}
                      className="p-1.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-850/50 text-slate-300 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
                      title="Archive Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Indicators */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono font-bold">
                    <span className="text-slate-400">Completion rate</span>
                    <span className="text-slate-700 dark:text-slate-300">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all duration-550"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Task Stats Metadata */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 dark:border-slate-800/60 text-center">
                  <div>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">Total Tasks</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{stats.total}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">Completed</span>
                    <span className="text-sm font-bold text-emerald-500">{stats.completed}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">Pending</span>
                    <span className="text-sm font-bold text-indigo-500">{stats.pending}</span>
                  </div>
                </div>

                {/* Milestones Toggle Area */}
                {project.milestones && project.milestones.length > 0 && (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setExpandedProject(isExpanded ? null : project.id)}
                      className="w-full flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 hover:underline py-1"
                    >
                      <span className="font-bold flex items-center gap-1.5">
                        <CheckSquare className="w-4 h-4 text-indigo-500" />
                        Milestones ({project.milestones.filter(m => m.completed).length}/{project.milestones.length})
                      </span>
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-1.5 overflow-hidden pl-1"
                        >
                          {project.milestones.map((milestone) => (
                            <div
                              key={milestone.id}
                              onClick={() => toggleMilestone(project.id, milestone.id)}
                              className="flex items-center gap-2 px-2 py-1.5 bg-slate-50 dark:bg-slate-800/30 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-slate-200/20 cursor-pointer transition-all"
                            >
                              <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                                milestone.completed ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 dark:border-slate-700'
                              }`}>
                                {milestone.completed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                              </div>
                              <span className={`text-[11px] ${milestone.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200 font-semibold'}`}>
                                {milestone.title}
                              </span>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Project Card Footer */}
              <div className="px-5 py-3.5 bg-slate-50/50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 font-mono font-semibold">
                  <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                  Target: {project.dueDate}
                </span>

                {/* Team overlapping avatars */}
                {project.members && project.members.length > 0 ? (
                  <div className="flex -space-x-1.5 overflow-hidden">
                    {project.members.map((member) => (
                      <img
                        key={member.id}
                        src={member.avatar}
                        alt={member.name}
                        className="inline-block h-6 w-6 rounded-full object-cover ring-2 ring-white dark:ring-slate-900"
                        title={`${member.name} (${member.role})`}
                      />
                    ))}
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-400 italic">No members assigned</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// Quick missing X icon definition
const X: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);
