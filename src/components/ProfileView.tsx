import React, { useState } from 'react';
import { useTaskStore } from '../store/taskStore';
import {
  User,
  Shield,
  Bell,
  Check,
  Camera,
  Mail,
  Briefcase,
  Clock,
  KeyRound
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ProfileView: React.FC = () => {
  const { currentUser, updateProfile } = useTaskStore();
  const [successToast, setSuccessToast] = useState(false);

  // Form State
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [role, setRole] = useState(currentUser.role);
  const [bio, setBio] = useState(currentUser.bio);
  const [timezone, setTimezone] = useState(currentUser.timezone);
  
  // Settings switches
  const [twoFactor, setTwoFactor] = useState(currentUser.twoFactorEnabled);
  const [emailNotif, setEmailNotif] = useState(currentUser.emailNotifications);
  const [desktopNotif, setDesktopNotif] = useState(currentUser.desktopNotifications);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateProfile({
      name,
      email,
      role,
      bio,
      timezone,
      twoFactorEnabled: twoFactor,
      emailNotifications: emailNotif,
      desktopNotifications: desktopNotif
    });

    setSuccessToast(true);
    setTimeout(() => {
      setSuccessToast(false);
    }, 3000);
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto overflow-y-auto">
      {/* Top Banner Card */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-xl">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-950 dark:text-white">Workspace Profile</h2>
            <p className="text-[10px] text-slate-400">Manage your profile details, localization settings, security parameters, and notification alerts.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: Avatar & Details Summary Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-6 rounded-3xl shadow-sm text-center flex flex-col items-center gap-4 h-fit">
          <div className="relative group cursor-pointer">
            <img
              src={currentUser.avatar}
              className="w-24 h-24 rounded-3xl object-cover ring-4 ring-indigo-500/10 border-2 border-slate-200 dark:border-slate-800"
              alt={currentUser.name}
            />
            <div className="absolute inset-0 bg-slate-950/40 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <Camera className="w-5 h-5" />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-950 dark:text-white">{currentUser.name}</h3>
            <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-bold uppercase tracking-wider">
              {currentUser.role}
            </span>
            <p className="text-[10px] text-slate-450 dark:text-slate-500 font-semibold mt-1 font-mono">{currentUser.workspace}</p>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed italic border-t border-slate-100 dark:border-slate-800/60 pt-4 w-full">
            "{currentUser.bio || 'Productivity explorer.'}"
          </p>
        </div>

        {/* Right Side: Configuration Forms */}
        <div className="md:col-span-2 space-y-6">
          {/* Account Settings */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-5 rounded-3xl shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800/60">
              <User className="w-4 h-4 text-indigo-500" />
              Account Settings
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800/50 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1">
                  <Mail className="w-3 h-3" /> Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800/50 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1">
                  <Briefcase className="w-3 h-3" /> Professional Role
                </label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800/50 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Timezone & Locale
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800/50 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none"
                >
                  <option value="America/New_York (EST)">America/New_York (EST)</option>
                  <option value="Europe/London (GMT)">Europe/London (GMT)</option>
                  <option value="Asia/Tokyo (JST)">Asia/Tokyo (JST)</option>
                  <option value="Australia/Sydney (AEDT)">Australia/Sydney (AEDT)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase">Short Biography</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800/50 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Notifications & Security settings row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Notification Preferences */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-5 rounded-3xl shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800/60">
                <Bell className="w-4 h-4 text-indigo-500" />
                Alert Settings
              </h3>

              <div className="space-y-3.5">
                {/* Email Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">Email Updates</h5>
                    <p className="text-[9px] text-slate-450 dark:text-slate-500">Receive daily workspace task briefings.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEmailNotif(!emailNotif)}
                    className={`w-9 h-5 rounded-full transition-all relative ${
                      emailNotif ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'
                    }`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${
                      emailNotif ? 'right-0.5' : 'left-0.5'
                    }`} />
                  </button>
                </div>

                {/* Desktop Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">Desktop Notifications</h5>
                    <p className="text-[9px] text-slate-450 dark:text-slate-500">Receive real-time sound & banner alerts.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDesktopNotif(!desktopNotif)}
                    className={`w-9 h-5 rounded-full transition-all relative ${
                      desktopNotif ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'
                    }`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${
                      desktopNotif ? 'right-0.5' : 'left-0.5'
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Security Preferences */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-5 rounded-3xl shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800/60">
                <Shield className="w-4 h-4 text-indigo-500" />
                Workspace Security
              </h3>

              <div className="space-y-3.5">
                {/* 2FA Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">Two-Factor Auth (2FA)</h5>
                    <p className="text-[9px] text-slate-450 dark:text-slate-500">Secure credentials via TOTP app.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTwoFactor(!twoFactor)}
                    className={`w-9 h-5 rounded-full transition-all relative ${
                      twoFactor ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'
                    }`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${
                      twoFactor ? 'right-0.5' : 'left-0.5'
                    }`} />
                  </button>
                </div>

                {/* Simulated Change Password */}
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">Auth Credentials</h5>
                    <p className="text-[9px] text-slate-450 dark:text-slate-500">Rotate security password.</p>
                  </div>
                  <button
                    type="button"
                    className="p-1 text-xs font-bold text-indigo-500 hover:underline flex items-center gap-0.5"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/60 items-center">
            <AnimatePresence>
              {successToast && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3.5 py-1.5 rounded-xl flex items-center gap-1 text-xs font-semibold"
                >
                  <Check className="w-4 h-4" />
                  <span>Workspace profile updated successfully!</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-indigo-600/10 transition-all cursor-pointer"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
