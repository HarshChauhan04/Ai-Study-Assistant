import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Sun, Moon, Bell, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const pageMeta = {
  '/dashboard':  { title: 'Dashboard', sub: 'Your learning overview' },
  '/documents':  { title: 'Study Materials', sub: 'Upload & manage your PDFs' },
  '/chat':       { title: 'AI Document Chat', sub: 'Ask questions about your documents' },
  '/quizzes':    { title: 'Practice Quizzes', sub: 'Test your knowledge' },
  '/flashcards': { title: 'Flashcards', sub: 'Review key concepts' },
  '/planner':    { title: 'Study Planner', sub: 'Your personalized study schedule' },
  '/notes':      { title: 'Notes & Viva Prep', sub: 'Revision notes and oral exam prep' },
  '/profile':    { title: 'Profile Settings', sub: 'Manage your account' },
};

const Header = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const currentPath = Object.keys(pageMeta).find(k => location.pathname.startsWith(k)) || '/dashboard';
  const meta = pageMeta[currentPath] || { title: 'StudyFlow AI', sub: '' };

  return (
    <header className="h-16 flex items-center justify-between border-b border-slate-200 dark:border-[#1e2d45] bg-white/90 dark:bg-[#0e1525]/90 backdrop-blur-xl px-5 sticky top-0 z-30"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
    >
      {/* Left: Menu + Page Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => toggleSidebar(true)}
          className="lg:hidden rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden sm:block">
          <h1 className="text-base font-bold text-slate-900 dark:text-white leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {meta.title}
          </h1>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-tight">{meta.sub}</p>
        </div>
        <h1 className="sm:hidden text-base font-bold text-slate-900 dark:text-white">{meta.title}</h1>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">

        {/* Search Button */}
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="rounded-xl p-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-700 dark:hover:text-slate-200 transition-all"
          aria-label="Search"
        >
          <Search className="h-4.5 w-4.5" />
        </button>

        {/* Notifications */}
        <button
          className="relative rounded-xl p-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-700 dark:hover:text-slate-200 transition-all"
          aria-label="Notifications"
        >
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-violet-500 border border-white dark:border-[#0e1525]" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="rounded-xl p-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-700 dark:hover:text-slate-200 transition-all border border-slate-200 dark:border-slate-700/50"
          aria-label="Toggle theme"
        >
          {darkMode
            ? <Sun className="h-4.5 w-4.5 text-amber-500" />
            : <Moon className="h-4.5 w-4.5" />
          }
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700/50 mx-1" />

        {/* User Badge */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:block text-right">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-tight">{user?.name?.split(' ')[0]}</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 capitalize">{user?.role || 'Student'}</p>
          </div>
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white cursor-pointer select-none"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', boxShadow: '0 2px 8px rgba(124, 58, 237, 0.3)' }}
            title={user?.name}
          >
            {getInitials(user?.name)}
          </div>
        </div>
      </div>

      {/* Search Dropdown (simplified) */}
      {searchOpen && (
        <div className="absolute top-full left-0 right-0 mx-5 mt-2 rounded-2xl bg-white dark:bg-[#141e33] border border-slate-200 dark:border-[#1e2d45] shadow-xl p-4 z-50" style={{ animation: 'slide-up 0.3s ease forwards' }}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              autoFocus
              placeholder="Search documents, quizzes, notes..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0e1525] text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10"
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-3 text-center">Press Esc to close</p>
        </div>
      )}
    </header>
  );
};

export default Header;
