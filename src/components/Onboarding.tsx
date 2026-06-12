import React, { useState } from 'react';
import { useTaskStore } from '../store/taskStore';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, CheckSquare, Layers, Brain, ArrowLeft, Paintbrush, Moon, Sun, Check } from 'lucide-react';

export const Onboarding: React.FC = () => {
  const { setView, currentUser, updateProfile, theme, setTheme } = useTaskStore();
  const [step, setStep] = useState(0);
  const [workspaceName, setWorkspaceName] = useState('Aether Studio');
  const [selectedAvatar, setSelectedAvatar] = useState(currentUser.avatar);
  
  const avatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', // Default
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
  ];

  const handleFinish = () => {
    updateProfile({
      workspace: workspaceName,
      avatar: selectedAvatar
    });
    setView('dashboard');
  };

  const stepsContent = [
    {
      title: "Welcome to Aether Labs",
      subtitle: "The ultimate command center for product-focused teams.",
      description: "Manage your tasks, collaborate with your team, track performance analytics, and schedule deadlines on a gorgeous, high-fidelity workspace designed for peak productivity.",
    },
    {
      title: "Configure your Workspace",
      subtitle: "Personalize your workspace and identity.",
      description: "Give your team hub a name, and select your profile avatar. You can always change this later in settings.",
    },
    {
      title: "Choose your Vibe",
      subtitle: "Customize your lighting and aesthetic preference.",
      description: "Toggle between our bespoke Dark Mode (recommended for visual comfort and elite SaaS styling) and Light Mode.",
    },
    {
      title: "Ready for Lift-off",
      subtitle: "You are all set to experience next-level task management.",
      description: "Unlock powerful command palette operations (Press ⌘K), drag & drop kanban workflows, interactive gantt-like calendars, and beautifully animated productivity analytics dashboards.",
    }
  ];

  const containerVariants: any = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.98, transition: { duration: 0.3 } }
  };

  const slideVariants: any = {
    initial: (direction: number) => ({ x: direction > 0 ? 100 : -100, opacity: 0 }),
    animate: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    exit: (direction: number) => ({ x: direction > 0 ? -100 : 100, opacity: 0, transition: { duration: 0.2 } })
  };

  const [direction, setDirection] = useState(1);

  const nextStep = () => {
    setDirection(1);
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setDirection(-1);
    setStep(prev => prev - 1);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Dynamic ambient backgrounds */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse delay-1000" />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full max-w-4xl bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[550px] relative z-10"
      >
        {/* Left Side: Dynamic Visual Showcase */}
        <div className="md:w-1/2 bg-gradient-to-br from-indigo-900/50 via-slate-900 to-slate-950 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent tracking-tight">
              aether.
            </span>
          </div>

          {/* Interactive visual aids based on current step */}
          <div className="my-8 flex-1 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="v0"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative flex flex-col gap-3 w-64"
                >
                  <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-4 shadow-lg flex items-center gap-3 transform rotate-[-2deg]">
                    <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                      <CheckSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-200">Interactive Kanban</h4>
                      <p className="text-[10px] text-slate-400">Drag, drop, and coordinate</p>
                    </div>
                  </div>
                  <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-4 shadow-lg flex items-center gap-3 transform translate-x-4 rotate-[2deg]">
                    <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                      <Brain className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-200">AI Summary Reports</h4>
                      <p className="text-[10px] text-slate-400">Automatic executive updates</p>
                    </div>
                  </div>
                  <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-4 shadow-lg flex items-center gap-3 transform rotate-[-1deg] translate-y-2">
                    <div className="p-2 bg-pink-500/10 text-pink-400 rounded-lg">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-200">Interactive Gantt</h4>
                      <p className="text-[10px] text-slate-400">Timelines and milestones</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="v1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-72 bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 flex flex-col gap-4 shadow-xl"
                >
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-700/50">
                    <img src={selectedAvatar} className="w-12 h-12 rounded-full border-2 border-indigo-500 object-cover shadow" alt="Avatar Preview" />
                    <div>
                      <h4 className="text-sm font-semibold text-slate-200">{currentUser.name}</h4>
                      <p className="text-xs text-slate-400">{workspaceName || 'My Workspace'}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-3/4 bg-slate-700 rounded-full" />
                    <div className="h-2 w-1/2 bg-slate-700 rounded-full" />
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="v2"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="w-full max-w-[280px] flex flex-col items-center gap-4"
                >
                  <div className={`w-full p-6 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-3 ${
                    theme === 'dark'
                      ? 'bg-slate-900 border-slate-800 shadow-xl shadow-slate-950/50'
                      : 'bg-white border-slate-200 shadow-xl shadow-slate-200/50'
                  }`}>
                    <div className="flex justify-between w-full">
                      <div className={`w-3.5 h-3.5 rounded-full ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`} />
                      <div className={`w-12 h-2 rounded-full ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`} />
                    </div>
                    <div className="my-2 p-3 rounded-xl bg-indigo-500/10 text-indigo-500">
                      <Paintbrush className="w-6 h-6 animate-bounce" />
                    </div>
                    <p className={`text-xs font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-800'}`}>
                      {theme === 'dark' ? 'Dark Mode Active' : 'Light Mode Active'}
                    </p>
                    <span className="text-[10px] text-slate-400">Silky smooth glassmorphism</span>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="v3"
                  initial={{ opacity: 0, rotate: -3 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 3 }}
                  className="w-72 bg-gradient-to-br from-indigo-900/60 to-purple-900/60 rounded-2xl p-6 text-white flex flex-col justify-between shadow-2xl min-h-[180px] relative overflow-hidden border border-indigo-500/30"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full font-medium">System Ready</span>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </div>
                  <div className="space-y-1 mt-4">
                    <h4 className="text-base font-semibold font-sans">Full Access Granted</h4>
                    <p className="text-xs text-indigo-200">Ready to boost your productivity. Press ⌘K anywhere to query commands.</p>
                  </div>
                  <div className="w-full bg-white/20 h-1.5 rounded-full mt-4 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                      className="bg-white h-full"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="text-[11px] text-slate-500 flex justify-between items-center">
            <span>Powered by Aether OS</span>
            <span>Est. 2026</span>
          </div>
        </div>

        {/* Right Side: Navigation & Input Forms */}
        <div className="md:w-1/2 p-8 flex flex-col justify-between bg-slate-900/60">
          <div className="flex justify-end gap-1.5">
            {stepsContent.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === step ? 'w-6 bg-indigo-500' : 'w-1.5 bg-slate-800'
                }`}
              />
            ))}
          </div>

          <div className="my-auto py-8">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-5"
              >
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Step {step + 1} of 4</span>
                  <h2 className="text-2xl font-bold text-white tracking-tight">{stepsContent[step].title}</h2>
                  <p className="text-sm font-semibold text-slate-300">{stepsContent[step].subtitle}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{stepsContent[step].description}</p>
                </div>

                {/* Custom Interactive Elements per Step */}
                {step === 1 && (
                  <div className="space-y-4 pt-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-400">WORKSPACE NAME</label>
                      <input
                        type="text"
                        value={workspaceName}
                        onChange={(e) => setWorkspaceName(e.target.value)}
                        className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="Enter Workspace Name"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-400">CHOOSE PROFILE AVATAR</label>
                      <div className="flex items-center gap-3">
                        {avatars.map((avUrl, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedAvatar(avUrl)}
                            className={`relative rounded-full overflow-hidden border-2 transition-all ${
                              selectedAvatar === avUrl ? 'border-indigo-500 scale-110 shadow-lg' : 'border-slate-800 opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img src={avUrl} className="w-10 h-10 object-cover" alt={`Avatar option ${idx}`} />
                            {selectedAvatar === avUrl && (
                              <div className="absolute inset-0 bg-indigo-600/30 flex items-center justify-center">
                                <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setTheme('light')}
                      className={`flex-1 p-4 rounded-2xl border text-left flex flex-col justify-between items-center gap-3 transition-all cursor-pointer ${
                        theme === 'light'
                          ? 'bg-indigo-600/10 border-indigo-500 shadow text-white'
                          : 'bg-slate-800/30 border-slate-800 text-slate-450 hover:bg-slate-800/60'
                      }`}
                    >
                      <Sun className={`w-6 h-6 ${theme === 'light' ? 'text-indigo-400' : 'text-slate-500'}`} />
                      <span className="text-xs font-semibold">Light Mode</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheme('dark')}
                      className={`flex-1 p-4 rounded-2xl border text-left flex flex-col justify-between items-center gap-3 transition-all cursor-pointer ${
                        theme === 'dark'
                          ? 'bg-indigo-600/10 border-indigo-500 shadow text-white'
                          : 'bg-slate-800/30 border-slate-800 text-slate-450 hover:bg-slate-800/60'
                      }`}
                    >
                      <Moon className={`w-6 h-6 ${theme === 'dark' ? 'text-indigo-400' : 'text-slate-500'}`} />
                      <span className="text-xs font-semibold">Dark Mode</span>
                    </button>
                  </div>
                )}

                {step === 3 && (
                  <div className="bg-slate-800/20 border border-slate-800/80 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold">
                      <Keyboard className="w-4 h-4 text-indigo-400" />
                      <span>Pro Keyboard Shortcuts Ready:</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                      <div className="flex justify-between items-center bg-slate-800/40 p-2 rounded-lg">
                        <span>Command Palette</span>
                        <kbd className="bg-slate-800 px-1 py-0.5 rounded text-[8px] font-mono">⌘K</kbd>
                      </div>
                      <div className="flex justify-between items-center bg-slate-800/40 p-2 rounded-lg">
                        <span>Toggle Theme</span>
                        <kbd className="bg-slate-800 px-1 py-0.5 rounded text-[8px] font-mono">⌘T</kbd>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-slate-800">
            {step > 0 ? (
              <button
                onClick={prevStep}
                className="flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                onClick={nextStep}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all hover:translate-x-0.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all hover:shadow-indigo-500/30"
              >
                <span>Launch Workspace</span>
                <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '3s' }} />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Simple icon for Keyboard
const Keyboard: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <rect width="20" height="12" x="2" y="6" rx="2" />
    <path d="M6 10h.01" />
    <path d="M10 10h.01" />
    <path d="M14 10h.01" />
    <path d="M18 10h.01" />
    <path d="M6 14h.01" />
    <path d="M18 14h.01" />
    <path d="M10 14h4" />
  </svg>
);
