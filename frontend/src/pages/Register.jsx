import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft, Brain, Zap, ShieldCheck, BarChart3, Calendar, Check } from 'lucide-react';
import Toast from '../components/Toast';

const perks = [
  { icon: BarChart3, text: 'Track your quiz performance over time' },
  { icon: Calendar, text: 'AI-personalized daily study schedule' },
  { icon: Brain, text: 'Llama 3.3-powered academic intelligence' },
  { icon: ShieldCheck, text: 'Your notes never leave your account' },
];

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    if (!name || !email || !password || !confirmPassword) {
      triggerToast('Please fill in all fields', 'error');
      return;
    }
    if (password.length < 6) {
      triggerToast('Password must be at least 6 characters', 'error');
      return;
    }
    if (password !== confirmPassword) {
      triggerToast('Passwords do not match', 'error');
      return;
    }
    setIsLoading(true);
    const result = await register(name, email, password);
    setIsLoading(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      triggerToast(result.message || 'Registration failed', 'error');
    }
  };

  const passwordStrength = () => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 6) s++;
    if (password.length >= 10) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    return s;
  };

  const strength = passwordStrength();
  const strengthColors = ['bg-slate-200 dark:bg-slate-700', 'bg-rose-500', 'bg-amber-500', 'bg-emerald-400', 'bg-emerald-500'];
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#080c14]">

      {/* === LEFT PANEL === */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] relative overflow-hidden flex-col justify-between p-12" style={{
        background: 'linear-gradient(145deg, #0c4a6e 0%, #075985 30%, #1e1b4b 100%)',
      }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[15%] right-[20%] h-[300px] w-[300px] rounded-full bg-cyan-500/20 blur-[80px]" />
          <div className="absolute bottom-[15%] left-[10%] h-[250px] w-[250px] rounded-full bg-indigo-500/15 blur-[60px]" />
          <div className="absolute inset-0 dot-grid opacity-10" />
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
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-cyan-200 mb-8">
            <Zap className="h-3.5 w-3.5" />
            Join 50,000+ students worldwide
          </div>
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4 tracking-tight">
            Built for ambitious<br />students like you
          </h2>
          <p className="text-cyan-200/80 mb-10 leading-relaxed">
            Everything you need to study efficiently and score higher — in one intelligent platform.
          </p>

          <div className="space-y-4">
            {perks.map((p) => (
              <div key={p.text} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white/70">
                  <p.icon className="h-4 w-4" />
                </div>
                <span className="text-sm text-cyan-100/90 font-medium">{p.text}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mt-10">
            {[
              { value: '50K+', label: 'Active Students' },
              { value: '2.8M+', label: 'Questions Answered' },
              { value: '98%', label: 'Would Recommend' },
              { value: '4.9★', label: 'Average Rating' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-white/8 backdrop-blur-sm border border-white/10 p-4">
                <div className="text-2xl font-black text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.value}</div>
                <div className="text-xs text-cyan-300/70 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-cyan-400/50">
          © {new Date().getFullYear()} StudyFlow AI. Free to use, always.
        </div>
      </div>

      {/* === RIGHT PANEL (Form) === */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative overflow-y-auto">
        {/* Back button */}
        <Link
          to="/"
          className="absolute top-6 left-6 flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 text-white">
            <Brain className="h-5 w-5" />
          </div>
          <span className="text-base font-bold text-slate-800 dark:text-white">StudyFlow AI</span>
        </div>

        <div className="w-full max-w-md" style={{ animation: 'slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
              Create your account
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Start for free — no credit card required
            </p>
          </div>

          {/* Free badge */}
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/30 p-3.5 mb-6">
            <Check className="h-4 w-4 text-emerald-500 shrink-0" />
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              Free plan includes 5 PDFs, 100 AI questions, unlimited flashcards
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Johnson"
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#0e1525] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15 outline-none transition-all text-sm font-medium"
                />
              </div>
            </div>

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
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#0e1525] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15 outline-none transition-all text-sm font-medium"
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
                  placeholder="Min 6 characters"
                  required
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#0e1525] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15 outline-none transition-all text-sm font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>

              {/* Password Strength Bar */}
              {password && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColors[strength] : 'bg-slate-200 dark:bg-slate-700'}`} />
                    ))}
                  </div>
                  {strength > 0 && (
                    <p className={`text-xs font-semibold ${strength >= 3 ? 'text-emerald-600 dark:text-emerald-400' : strength === 2 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {strengthLabels[strength]} password
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  required
                  className={`w-full pl-11 pr-4 py-3.5 rounded-xl border bg-white dark:bg-[#0e1525] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none transition-all text-sm font-medium ${
                    confirmPassword && password !== confirmPassword
                      ? 'border-rose-400 dark:border-rose-600 focus:ring-2 focus:ring-rose-500/15'
                      : confirmPassword && password === confirmPassword
                      ? 'border-emerald-400 dark:border-emerald-600 focus:ring-2 focus:ring-emerald-500/15'
                      : 'border-slate-200 dark:border-slate-700/60 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15'
                  }`}
                />
                {confirmPassword && (
                  <div className={`absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold ${password === confirmPassword ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {password === confirmPassword ? '✓' : '✗'}
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2.5 rounded-xl py-3.5 text-sm font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5 active:translate-y-0 mt-2"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                boxShadow: '0 6px 20px rgba(124, 58, 237, 0.35)',
              }}
            >
              {isLoading ? (
                <>
                  <div className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Creating account...
                </>
              ) : (
                'Create Free Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
            <span className="text-xs text-slate-400 font-medium">or</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
          </div>

          <div className="text-center text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-violet-600 dark:text-violet-400 hover:underline underline-offset-2">
              Sign in
            </Link>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-600">
            By creating an account you agree to our{' '}
            <a href="#" className="underline hover:text-violet-600 dark:hover:text-violet-400">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="underline hover:text-violet-600 dark:hover:text-violet-400">Privacy Policy</a>.
          </p>
        </div>
      </div>

      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
      )}
    </div>
  );
};

export default Register;
