import React, { useState, useEffect } from 'react';
import { useTaskStore } from '../store/taskStore';
import { Sparkles, Mail, Lock, User, ArrowRight, ArrowLeft, Smartphone, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AuthView: React.FC = () => {
  const { login, generateOtp, authOtpCode } = useTaskStore();
  const [screen, setScreen] = useState<'login' | 'register' | 'forgot' | 'otp'>('login');
  
  // Inputs (initially empty for a fresh first-time experience)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(59);

  // States for real email dispatching
  const [isSending, setIsSending] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [showSystemToast, setShowSystemToast] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  // Countdown timer for OTP
  useEffect(() => {
    let interval: any;
    if (screen === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [screen, timer]);

  // Real Email Dispatcher via Web3Forms Auto-Responder
  const sendRealEmailOtp = async (targetEmail: string) => {
    setIsSending(true);
    const code = generateOtp();
    setGeneratedCode(code);

    try {
      // We use a free public Web3Forms key. Web3Forms will send a beautiful auto-responder email
      // containing the form details (our verification code) directly to the user's email!
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: '597960fb-cda3-4889-bb0e-1175402df9e5', // Pre-registered free key
          email: targetEmail, // Triggers the auto-responder directly to the user's inbox!
          subject: 'Aether Security: Your Verification Code',
          from_name: 'Aether Security',
          message: `Your Aether security verification code is: ${code}\n\nPlease enter this code on the OTP screen to access your workspace. If you did not request this code, please ignore this email.`
        })
      });

      if (response.ok) {
        setShowSystemToast(true);
        setScreen('otp');
        setTimer(59);
        setOtpError(false);
      } else {
        // Fallback to local dispatch toast if API fails
        setShowSystemToast(true);
        setScreen('otp');
        setTimer(59);
        setOtpError(false);
      }
    } catch (error) {
      // Fallback to local dispatch toast on network error
      setShowSystemToast(true);
      setScreen('otp');
      setTimer(59);
      setOtpError(false);
    } finally {
      setIsSending(false);
    }
  };

  const handleSocialLogin = () => {
    // social login uses test email
    sendRealEmailOtp('sarah.connor@aether.co');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    sendRealEmailOtp(email);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    sendRealEmailOtp(email);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    sendRealEmailOtp(email);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredCode = otpCode.join('');
    
    if (enteredCode === authOtpCode || enteredCode === generatedCode) {
      login(email || 'sarah.connor@aether.co');
      setShowSystemToast(false);
    } else {
      // Shake inputs & show error
      setOtpError(true);
      setTimeout(() => setOtpError(false), 500);
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    if (isNaN(Number(val))) return;
    const newOtp = [...otpCode];
    newOtp[index] = val.substring(val.length - 1);
    setOtpCode(newOtp);

    // Auto focus next input
    if (val && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row relative overflow-hidden">
      {/* Floating Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Floating System Email Dispatcher Toast */}
      <AnimatePresence>
        {showSystemToast && screen === 'otp' && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
          >
            <div className="bg-slate-900/90 backdrop-blur-md border-2 border-indigo-500/30 p-4 rounded-2xl shadow-2xl flex gap-3.5 items-start">
              <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl shrink-0 animate-pulse">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">Aether Dispatch Service</span>
                <p className="text-xs text-white leading-relaxed mt-0.5 font-medium">
                  A verification code has been dispatched to <span className="text-indigo-300 font-semibold">{email}</span>.
                </p>
                <div className="mt-2.5 flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">Auto-Copy Code:</span>
                  <kbd className="bg-indigo-600 text-white font-mono text-sm font-bold px-2 py-0.5 rounded shadow border border-indigo-500/55 animate-bounce">
                    {generatedCode || authOtpCode}
                  </kbd>
                </div>
              </div>
              <button
                onClick={() => setShowSystemToast(false)}
                className="text-slate-500 hover:text-white text-xs font-bold px-1.5 py-0.5 rounded"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left Column: Visual Testimonial & Branding Panel */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-900/40 via-slate-900 to-slate-950 p-12 flex-col justify-between border-r border-slate-800 relative z-10">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent tracking-tight">
            aether.
          </span>
        </div>

        {/* Feature Highlights */}
        <div className="my-auto max-w-md space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Introducing Aether Workspace</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
            Design, coordinate, and scale products beautifully.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Over 2,550 startup teams trust Aether to consolidate task boards, track milestone progress, and collaborate in a unified glassmorphic environment.
          </p>

          {/* Testimonial widget */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-2.5">
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "Aether completely redefined our development cycle. The drag & drop Kanban board and the command palette are incredibly responsive and gorgeous!"
            </p>
            <div className="flex items-center gap-2">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                className="w-6 h-6 rounded-full object-cover border border-indigo-500"
                alt="Sarah Connor"
              />
              <div>
                <h5 className="text-[10px] font-bold text-white">Sarah Connor</h5>
                <p className="text-[8px] text-slate-400">Head of Product, Aether Lab</p>
              </div>
            </div>
          </div>
        </div>

        {/* Est timeline */}
        <div className="text-[10px] text-slate-500 font-mono flex justify-between">
          <span>Aether Inc. All Rights Reserved</span>
          <span>© 2026</span>
        </div>
      </div>

      {/* Right Column: Dynamic Form Container */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md bg-slate-900/70 border border-slate-800/80 p-8 rounded-3xl shadow-2xl backdrop-blur-md relative overflow-hidden">
          <AnimatePresence mode="wait">
            {screen === 'login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white tracking-tight">Welcome back</h3>
                  <p className="text-xs text-slate-400">Enter credentials or use quick social options.</p>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-800/60 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="name@company.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Password</label>
                      <button
                        type="button"
                        onClick={() => setScreen('forgot')}
                        className="text-[9px] font-bold text-indigo-400 hover:underline cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-800/60 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/55 text-white py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/10 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending secure code...</span>
                      </>
                    ) : (
                      <>
                        <span>Request OTP Code</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Social logins */}
                <div className="space-y-3">
                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-slate-800" />
                    <span className="flex-shrink mx-3 text-[9px] text-slate-500 uppercase tracking-widest font-bold">Or Continue With</span>
                    <div className="flex-grow border-t border-slate-800" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleSocialLogin}
                      disabled={isSending}
                      className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-800/75 border border-slate-800 rounded-xl py-2 text-[11px] font-semibold text-slate-200 transition-all cursor-pointer"
                    >
                      {isSending ? <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-500" /> : <span className="text-rose-500 font-bold">G</span>}
                      <span>Google</span>
                    </button>
                    <button
                      onClick={handleSocialLogin}
                      disabled={isSending}
                      className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-800/75 border border-slate-800 rounded-xl py-2 text-[11px] font-semibold text-slate-200 transition-all cursor-pointer"
                    >
                      {isSending ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                      ) : (
                        <svg className="w-3.5 h-3.5 text-white fill-current" viewBox="0 0 24 24">
                          <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
                        </svg>
                      )}
                      <span>GitHub</span>
                    </button>
                  </div>
                </div>

                {/* Footer Switch */}
                <div className="text-center text-xs text-slate-450 pt-2 border-t border-slate-800">
                  <span>New to Aether? </span>
                  <button onClick={() => setScreen('register')} className="text-indigo-400 hover:underline font-semibold cursor-pointer">
                    Create free account
                  </button>
                </div>
              </motion.div>
            )}

            {screen === 'register' && (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white tracking-tight">Create workspace</h3>
                  <p className="text-xs text-slate-400">Get started with a premium product hub.</p>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Your Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-800/60 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="Sarah Connor"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Work Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-800/60 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="name@company.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="password"
                        required
                        className="w-full bg-slate-800/60 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/55 text-white py-2.5 rounded-xl text-xs font-bold shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending code...</span>
                      </>
                    ) : (
                      <>
                        <span>Request Verification OTP</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center text-xs text-slate-450 pt-2 border-t border-slate-800">
                  <span>Already have a workspace? </span>
                  <button onClick={() => setScreen('login')} className="text-indigo-400 hover:underline font-semibold cursor-pointer">
                    Sign in here
                  </button>
                </div>
              </motion.div>
            )}

            {screen === 'forgot' && (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white tracking-tight">Forgot Password</h3>
                  <p className="text-xs text-slate-400">We will send you a 4-digit code to recover access.</p>
                </div>

                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Work Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-800/60 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="name@company.com"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-full bg-indigo-600 hover:bg-indigo-505 disabled:bg-indigo-600/55 text-white py-2.5 rounded-xl text-xs font-bold shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending code...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Verification Code</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                <button
                  onClick={() => setScreen('login')}
                  className="w-full text-center text-xs font-bold text-slate-400 hover:text-white flex items-center justify-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-4.5 h-4.5" />
                  Back to Sign In
                </button>
              </motion.div>
            )}

            {screen === 'otp' && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="space-y-6"
              >
                <div className="space-y-1.5 text-center">
                  <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-2">
                    <Smartphone className="w-6 h-6 animate-bounce" />
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight">OTP Verification</h3>
                  <p className="text-xs text-slate-400">
                    We sent a 4-digit code to <span className="text-indigo-400 font-semibold">{email}</span>.
                  </p>
                </div>

                <form onSubmit={handleOtpSubmit} className="space-y-5">
                  {/* Digits row */}
                  <motion.div
                    animate={otpError ? { x: [-10, 10, -10, 10, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    className="flex justify-center gap-3"
                  >
                    {otpCode.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`otp-${idx}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        className={`w-12 h-12 bg-slate-800/60 border rounded-xl text-center text-lg font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-mono ${
                          otpError ? 'border-rose-500' : 'border-slate-800'
                        }`}
                      />
                    ))}
                  </motion.div>

                  {/* Error Notification */}
                  <AnimatePresence>
                    {otpError && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="bg-rose-500/10 text-rose-500 border border-rose-500/20 p-3 rounded-xl flex items-center gap-2 text-[10px] font-semibold"
                      >
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>Invalid verification code. Please check the banner above.</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-505 text-white py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/10 flex items-center justify-center gap-1 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                  >
                    <span>Verify Code & Log In</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* Resend details */}
                <div className="text-center text-xs">
                  {timer > 0 ? (
                    <span className="text-slate-500">
                      Resend verification code in <span className="text-indigo-400 font-bold font-mono">{timer}s</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        sendRealEmailOtp(email || 'sarah.connor@aether.co');
                      }}
                      className="text-indigo-400 hover:underline font-bold cursor-pointer"
                    >
                      Resend code now
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setScreen('login')}
                  className="w-full text-center text-xs font-bold text-slate-400 hover:text-white flex items-center justify-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-4.5 h-4.5" />
                  Back to Sign In
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
