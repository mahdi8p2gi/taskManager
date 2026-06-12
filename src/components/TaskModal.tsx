import React, { useState, useEffect, useRef } from 'react';
import { useTaskStore, Task, Attachment } from '../store/taskStore';
import {
  X,
  Calendar,
  Clock,
  Tag,
  Paperclip,
  MessageSquare,
  History,
  Trash2,
  Copy,
  Archive,
  Plus,
  Check,
  User,
  Send,
  Sparkles,
  Link,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const TaskModal: React.FC = () => {
  const {
    selectedTaskId,
    setSelectedTaskId,
    tasks,
    projects,
    updateTask,
    deleteTask,
    duplicateTask,
    archiveTask,
    addComment,
    addAttachment,
    toggleChecklistItem
  } = useTaskStore();

  const task = tasks.find((t) => t.id === selectedTaskId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Task['status']>('todo');
  const [priority, setPriority] = useState<Task['priority']>('low');
  const [dueDate, setDueDate] = useState('');
  const [label, setLabel] = useState('');
  const [recurrence, setRecurrence] = useState<Task['recurrence']>('none');
  const [projectId, setProjectId] = useState('');

  // Comment input & mentions dropdown state
  const [commentText, setCommentText] = useState('');
  const [mentionSearch, setMentionSearch] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  // Checklist input
  const [newChecklistItem, setNewChecklistItem] = useState('');

  // Sync state when task changes
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status);
      setPriority(task.priority);
      setDueDate(task.dueDate);
      setLabel(task.label || '');
      setRecurrence(task.recurrence || 'none');
      setProjectId(task.projectId);
    }
  }, [task, selectedTaskId]);

  if (!task) return null;

  // Handle changes and auto-save
  const handleSave = (updates: Partial<Task>) => {
    if (selectedTaskId) {
      updateTask(selectedTaskId, updates);
    }
  };

  const handleAddChecklistItem = () => {
    if (!newChecklistItem.trim()) return;
    const currentChecklist = task.checklist || [];
    const updated = [
      ...currentChecklist,
      { id: `ck_${Date.now()}`, text: newChecklistItem.trim(), completed: false }
    ];
    handleSave({ checklist: updated });
    setNewChecklistItem('');
  };

  const handleDeleteChecklistItem = (itemId: string) => {
    const currentChecklist = task.checklist || [];
    const updated = currentChecklist.filter((c) => c.id !== itemId);
    handleSave({ checklist: updated });
  };

  // Mock File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      const newAttach: Omit<Attachment, 'id'> = {
        name: file.name,
        size: `${sizeMB} MB`,
        type: file.name.split('.').pop() || 'file',
        url: '#'
      };
      addAttachment(task.id, newAttach);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(task.id, commentText.trim());
    setCommentText('');
    setShowMentions(false);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setCommentText(text);

    // Mentions trigger checking
    const words = text.split(/\s+/);
    const lastWord = words[words.length - 1];
    if (lastWord && lastWord.startsWith('@')) {
      setMentionSearch(lastWord.substring(1));
      setShowMentions(true);
    } else {
      setShowMentions(false);
    }
  };

  const insertMention = (name: string) => {
    const words = commentText.split(/\s+/);
    words.pop(); // Remove the typed @part
    const newText = [...words, `@${name} `].join(' ');
    setCommentText(newText);
    setShowMentions(false);
    commentInputRef.current?.focus();
  };

  // Mock team members for mentions
  const mockTeam = [
    { name: 'Alex Rivera', role: 'Lead Designer' },
    { name: 'Marcus Chen', role: 'Tech Lead' },
    { name: 'Elena Rostova', role: 'QA Lead' },
    { name: 'David Kim', role: 'Growth Marketer' },
    { name: 'Sophia Martinez', role: 'Product Manager' }
  ];

  const filteredTeam = mockTeam.filter(m =>
    m.name.toLowerCase().includes(mentionSearch.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/60 backdrop-blur-sm">
        {/* Overlay backdrop */}
        <div className="absolute inset-0" onClick={() => setSelectedTaskId(null)} />

        {/* Modal Content Drawer (Right-aligned slide-out) */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative w-full max-w-2xl h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col z-10"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 dark:text-indigo-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Task Details
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  duplicateTask(task.id);
                  setSelectedTaskId(null);
                }}
                className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                title="Duplicate Task"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  archiveTask(task.id);
                  setSelectedTaskId(null);
                }}
                className="p-2 text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                title="Archive Task"
              >
                <Archive className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  deleteTask(task.id);
                  setSelectedTaskId(null);
                }}
                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                title="Delete Task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1" />
              <button
                onClick={() => setSelectedTaskId(null)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Title & Space Area */}
            <div className="space-y-3">
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  handleSave({ title: e.target.value });
                }}
                className="w-full bg-transparent border-0 border-b border-transparent hover:border-slate-200 dark:hover:border-slate-800 focus:border-indigo-500 focus:ring-0 text-xl font-bold text-slate-900 dark:text-white px-0 py-1"
                placeholder="Task Title"
              />

              <div className="flex flex-wrap gap-4 text-xs">
                {/* Space Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-medium w-16 shrink-0">Space:</span>
                  <select
                    value={projectId}
                    onChange={(e) => {
                      setProjectId(e.target.value);
                      handleSave({ projectId: e.target.value });
                    }}
                    className="bg-slate-50 dark:bg-slate-800 border-0 rounded-xl px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                {/* Label Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-medium w-16 shrink-0 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" /> Label:
                  </span>
                  <input
                    type="text"
                    value={label}
                    onChange={(e) => {
                      setLabel(e.target.value);
                      handleSave({ label: e.target.value });
                    }}
                    placeholder="e.g. Design"
                    className="bg-slate-50 dark:bg-slate-800 border-0 rounded-xl px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none w-28"
                  />
                </div>
              </div>
            </div>

            <hr className="border-slate-150 dark:border-slate-800/60" />

            {/* Grid of Attributes */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50/50 dark:bg-slate-900/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</label>
                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value as any);
                    handleSave({ status: e.target.value as any });
                  }}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-750 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="in-review">In Review</option>
                  <option value="done">Completed</option>
                </select>
              </div>

              {/* Priority */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => {
                    setPriority(e.target.value as any);
                    handleSave({ priority: e.target.value as any });
                  }}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-750 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              {/* Due Date */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => {
                    setDueDate(e.target.value);
                    handleSave({ dueDate: e.target.value });
                  }}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-750 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>

              {/* Recurrence */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Recurrence
                </label>
                <select
                  value={recurrence}
                  onChange={(e) => {
                    setRecurrence(e.target.value as any);
                    handleSave({ recurrence: e.target.value as any });
                  }}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-750 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  <option value="none">No Recurrence</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">Description</label>
              <textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  handleSave({ description: e.target.value });
                }}
                rows={3}
                placeholder="Enter rich details about the goals, guidelines, or specs for this task..."
                className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/50 rounded-2xl px-4 py-3 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Checklist Section */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider">Subtask Checklist</label>
              <div className="space-y-2">
                {task.checklist && task.checklist.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-2 bg-slate-50/50 dark:bg-slate-800/30 px-3.5 py-2.5 rounded-xl border border-slate-100 dark:border-slate-800/30">
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => toggleChecklistItem(task.id, item.id)}
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                          item.completed
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'border-slate-300 dark:border-slate-700 hover:border-indigo-500'
                        }`}
                      >
                        {item.completed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </button>
                      <span className={`text-xs ${item.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'}`}>
                        {item.text}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteChecklistItem(item.id)}
                      className="text-slate-400 hover:text-rose-500 transition-colors p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newChecklistItem}
                    onChange={(e) => setNewChecklistItem(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAddChecklistItem(); }}
                    placeholder="Add a new checklist item..."
                    className="flex-1 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800/50 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    onClick={handleAddChecklistItem}
                    className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 px-3 py-2 rounded-xl text-xs font-bold transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Attachments Section */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1">
                  <Paperclip className="w-3.5 h-3.5" /> Attachments
                </label>
                <label className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 px-3 py-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer">
                  <span>Upload File</span>
                  <input type="file" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              {task.attachments.length === 0 ? (
                <div className="text-center p-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/20">
                  <span className="text-[10px] text-slate-400 dark:text-slate-600 font-semibold uppercase tracking-wider">No files attached</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {task.attachments.map((attach) => (
                    <div key={attach.id} className="p-3 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200/20 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2 truncate">
                        <div className="p-1.5 bg-indigo-500/10 text-indigo-500 rounded-lg shrink-0">
                          <Link className="w-3.5 h-3.5" />
                        </div>
                        <div className="truncate">
                          <h5 className="text-[11px] font-bold text-slate-900 dark:text-slate-100 truncate">{attach.name}</h5>
                          <span className="text-[9px] text-slate-400 font-semibold font-mono">{attach.size}</span>
                        </div>
                      </div>
                      <a href="#" className="p-1 text-slate-400 hover:text-indigo-500">
                        <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Task History Audit Log UI */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1">
                <History className="w-3.5 h-3.5" /> Task Audit Log
              </label>
              <div className="bg-slate-50/30 dark:bg-slate-900/40 p-4 border border-slate-100 dark:border-slate-800 rounded-2xl space-y-3 max-h-40 overflow-y-auto">
                {task.history.map((hist) => (
                  <div key={hist.id} className="flex items-start gap-2.5 text-[10px]">
                    <div className="w-5 h-5 rounded-full bg-slate-150 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-bold shrink-0">
                      <User className="w-3 h-3" />
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-600 dark:text-slate-400">
                        <span className="font-semibold text-slate-900 dark:text-slate-100">{hist.user}</span>{' '}
                        <span>{hist.action}</span>
                      </p>
                      <span className="text-[8px] text-slate-400 font-mono mt-0.5 block">{hist.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comments Timeline */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" /> Comments ({task.comments.length})
              </label>
              
              {/* Comment Input */}
              <form onSubmit={handleCommentSubmit} className="relative space-y-2">
                <textarea
                  ref={commentInputRef}
                  value={commentText}
                  onChange={handleCommentChange}
                  rows={2}
                  placeholder="Ask a question or post an update... Use @ to mention team members"
                  className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/50 rounded-2xl px-4 py-3 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                
                {/* Mentions Dropdown Suggestions */}
                <AnimatePresence>
                  {showMentions && filteredTeam.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute left-0 bottom-full mb-1 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 rounded-xl shadow-xl z-20 max-h-36 overflow-y-auto p-1"
                    >
                      {filteredTeam.map((member, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => insertMention(member.name)}
                          className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-indigo-600 hover:text-white transition-all flex justify-between items-center"
                        >
                          <span className="font-semibold">{member.name}</span>
                          <span className="text-[9px] opacity-70 uppercase tracking-wider">{member.role}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 shadow transition-all cursor-pointer"
                  >
                    <span>Send</span>
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </form>

              {/* Comments Stream */}
              <div className="space-y-3 mt-4">
                {task.comments.map((comment) => (
                  <div key={comment.id} className="p-3.5 bg-slate-50/40 dark:bg-slate-800/40 border border-slate-200/20 rounded-2xl flex gap-3">
                    <img src={comment.avatar} className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-800" alt={comment.author} />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h5 className="text-[11px] font-bold text-slate-800 dark:text-slate-200">{comment.author}</h5>
                        <span className="text-[8px] text-slate-400 font-mono">{comment.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed whitespace-pre-wrap">
                        {comment.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
