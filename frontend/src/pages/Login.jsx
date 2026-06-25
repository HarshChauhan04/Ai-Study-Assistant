import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Brain, Zap, ShieldCheck, MessageSquare, GraduationCap, Layers } from 'lucide-react';
import Toast from '../components/Toast';

const leftFeatures = [
  { icon: MessageSquare, text: 'Chat with your PDFs using RAG AI' },
  { icon: GraduationCap, text: 'Auto-generate quizzes from your notes' },
  { icon: Layers, text: 'Build smart flashcard decks instantly' },
  { icon: ShieldCheck, text: 'Your data is encrypted and private' },
];

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const triggerToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      triggerToast('Please fill in all fields', 'error');
      return;
    }
    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      triggerToast(result.message || 'Login failed. Check your credentials.', 'error');
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#080c14]">

      {/* === LEFT PANEL (Decorative) === */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] relative overflow-hidden flex-col justify-between p-12" style={{
        background: 'linear-gradient(145deg, #1e3a8a 0%, #1d4ed8 50%, #0d9488 100%)',
      }}>
        {/* Background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[10%] left-[20%] h-[300px] w-[300px] rounded-full bg-blue-400/20 blur-[80px]" />
          <div className="absolute bottom-[20%] right-[10%] h-[250px] w-[250px] rounded-full bg-teal-400/15 blur-[60px]" />
          <div className="absolute inset-0 line-grid opacity-10" />
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white">StudyFlow AI</span>
        </div>

        {/* Main content */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-blue-100 mb-8">
            <Zap className="h-3.5 w-3.5" />
            Enterprise-grade academic platform
          </div>
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4 tracking-tight">
            Your personal<br />AI study tutor
          </h2>
          <p className="text-blue-200/80 mb-10 leading-relaxed">
            Upload your study materials and let AI do the heavy lifting — from complex explanations to personalized exam prep.
          </p>

          <div className="space-y-4">
            {leftFeatures.map((f) => (
              <div key={f.text} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white/70">
                  <f.icon className="h-4 w-4" />
                </div>
                <span className="text-sm text-blue-100/90 font-medium">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom testimonial */}
        <div className="relative z-10 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 p-5">
          <div className="flex gap-0.5 mb-3">
            {[...Array(5)].map((_, i) => <span key={i} className="text-amber-400 text-sm">★</span>)}
          </div>
          <p className="text-sm text-blue-100/90 italic leading-relaxed mb-3">
            "I studied for my finals using only StudyFlow and improved my grade by two levels. The quiz generator is crazy good."
          </p>
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold">RK</div>
            <div>
              <div className="text-xs font-bold text-white">Rahul Kapoor</div>
              <div className="text-[10px] text-blue-200">B.Tech Final Year</div>
            </div>
          </div>
        </div>
      </div>

      {/* === RIGHT PANEL (Form) === */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative">
        {/* Back button */}
        <Link
          to="/"
          className="absolute top-6 left-6 flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {/* Mobile logo (hidden on lg+) */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Brain className="h-5 w-5" />
          </div>
          <span className="text-base font-bold text-slate-800 dark:text-white">StudyFlow AI</span>
        </div>

        <div className="w-full max-w-md" style={{ animation: 'slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
              Welcome back
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Sign in to continue your study session
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@university.edu"
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#0e1525] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 outline-none transition-all text-sm font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#0e1525] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 outline-none transition-all text-sm font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2.5 rounded-xl py-3.5 text-sm font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5 active:translate-y-0"
              style={{
                background: isLoading ? '#1d4ed8' : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                boxShadow: '0 6px 20px rgba(37, 99, 235, 0.35)',
              }}
            >
              {isLoading ? (
                <>
                  <div className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in...
                </>
              ) : (
                'Sign In to StudyFlow'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
            <span className="text-xs text-slate-400 font-medium">or</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
          </div>

          {/* Register link */}
          <div className="text-center text-sm text-slate-600 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-blue-600 dark:text-blue-400 hover:underline underline-offset-2">
              Create one free
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-center gap-5">
            <span className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-600">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              256-bit encrypted
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-600">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
              GDPR compliant
            </span>
          </div>
        </div>
      </div>

      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
      )}
    </div>
  );
};

export default Login;
