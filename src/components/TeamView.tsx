import React, { useState } from 'react';
import { useTaskStore } from '../store/taskStore';
import {
  Users,
  Mail,
  Clock,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const TeamView: React.FC = () => {
  const { activities } = useTaskStore();
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Editor');
  const [successMessage, setSuccessMessage] = useState(false);

  // Pre-defined team members
  const [teamMembers, setTeamMembers] = useState([
    { id: 'm1', name: 'Alex Rivera', role: 'Lead Designer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', email: 'alex@aether.design', status: 'online', tasks: 12 },
    { id: 'm2', name: 'Marcus Chen', role: 'Tech Lead', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80', email: 'marcus@aether.dev', status: 'online', tasks: 9 },
    { id: 'm3', name: 'Elena Rostova', role: 'QA Lead', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', email: 'elena@aether.qa', status: 'away', tasks: 3 },
    { id: 'm4', name: 'David Kim', role: 'Growth Marketer', avatar: 'https://images.unsplash.com/photo-1489980508314-941910ded1f4?w=150&auto=format&fit=crop&q=80', email: 'david@aether.marketing', status: 'offline', tasks: 5 },
    { id: 'm5', name: 'Sophia Martinez', role: 'Product Manager', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', email: 'sophia@aether.co', status: 'online', tasks: 14 }
  ]);

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    // Simulate adding member
    const newMember = {
      id: `m_${Date.now()}`,
      name: inviteEmail.split('@')[0].replace('.', ' ').replace(/\b\w/g, c => c.toUpperCase()),
      role: inviteRole,
      avatar: `https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80`,
      email: inviteEmail,
      status: 'offline',
      tasks: 0
    };

    setTeamMembers([...teamMembers, newMember]);
    setInviteEmail('');
    setSuccessMessage(true);

    setTimeout(() => {
      setSuccessMessage(false);
    }, 3000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online': return <span className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/10" />;
      case 'away': return <span className="w-2 h-2 rounded-full bg-amber-500 ring-4 ring-amber-500/10" />;
      default: return <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-750" />;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto">
      {/* Top Banner Card */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-950 dark:text-white">Workspace Teammates</h2>
            <p className="text-[10px] text-slate-400">Invite developers, coordinate task delegations, and monitor live collaboration flows.</p>
          </div>
        </div>
        
        <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 px-3 py-1.5 rounded-xl font-bold border border-slate-200/10">
          {teamMembers.length} Members Registered
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Teammates Grid */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Teammates Roster</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-4 rounded-2xl shadow-sm flex items-center justify-between hover:border-slate-300 dark:hover:border-slate-700/60 transition-all"
              >
                <div className="flex items-center gap-3 truncate">
                  <div className="relative shrink-0">
                    <img src={member.avatar} className="w-11 h-11 rounded-xl object-cover border border-slate-200 dark:border-slate-800" alt={member.name} />
                    <div className="absolute -bottom-0.5 -right-0.5 bg-white dark:bg-slate-900 p-0.5 rounded-full">
                      {getStatusBadge(member.status)}
                    </div>
                  </div>
                  <div className="truncate">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{member.name}</h4>
                    <span className="text-[9px] bg-slate-50 dark:bg-slate-850 text-slate-450 dark:text-slate-500 px-1.5 py-0.25 rounded border border-slate-250/10 font-bold uppercase tracking-wide">
                      {member.role}
                    </span>
                    <p className="text-[10px] text-slate-400 truncate mt-1">{member.email}</p>
                  </div>
                </div>

                {/* Task Count widget */}
                <div className="text-right shrink-0 bg-slate-50 dark:bg-slate-850/50 px-2.5 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800/50">
                  <span className="text-[8px] text-slate-400 dark:text-slate-500 font-bold uppercase block leading-none">TASKS</span>
                  <span className="text-xs font-bold text-indigo-500">{member.tasks}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Column: Invite Form & Live Activities */}
        <div className="space-y-6">
          {/* Invite Teammate Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-5 rounded-3xl shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-indigo-500" />
              Invite Teammate
            </h3>
            <p className="text-[10px] text-slate-550 dark:text-slate-400 leading-relaxed">
              Add collaborators to your workspace. They will receive a registration invite link instantly.
            </p>

            <form onSubmit={handleInviteSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase">Email Address</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800/50 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-405 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase">Workspace Access Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800/50 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none"
                >
                  <option value="Viewer">Workspace Viewer (Read-only)</option>
                  <option value="Editor">Workspace Editor (Full Editing)</option>
                  <option value="Admin">Workspace Admin (Owner access)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-xl text-xs font-bold shadow-md shadow-indigo-600/10 transition-all cursor-pointer"
              >
                Send Workspace Invite
              </button>
            </form>

            {/* Invite Success Alert */}
            <AnimatePresence>
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 p-3 rounded-xl flex items-center gap-2 text-[10px] font-semibold"
                >
                  <UserCheck className="w-4 h-4 shrink-0" />
                  <span>Teammate invitation successfully queued!</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Collaborative Activity Feed */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-5 rounded-3xl shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-indigo-500" />
              Live Workspace Stream
            </h3>
            
            <div className="space-y-4 max-h-56 overflow-y-auto pr-1">
              {activities.map((act) => (
                <div key={act.id} className="flex gap-2.5 items-start text-[11px]">
                  <img src={act.avatar} className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5" alt={act.user} />
                  <div>
                    <p className="text-slate-605 dark:text-slate-400">
                      <span className="font-semibold text-slate-900 dark:text-slate-200">{act.user}</span>{' '}
                      <span>{act.action}</span>{' '}
                      <span className="font-semibold text-slate-800 dark:text-slate-300">"{act.target}"</span>
                    </p>
                    <span className="text-[8px] text-slate-400 font-mono mt-0.5 block">{act.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
