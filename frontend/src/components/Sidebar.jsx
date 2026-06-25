import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, FileText, MessageSquare, GraduationCap,
  Layers, Calendar, BookOpen, User, LogOut, X, Brain, Sparkles
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, color: 'text-blue-600', bgColor: 'bg-blue-100/70 dark:bg-blue-900/30' },
  { name: 'Materials', path: '/documents', icon: FileText, color: 'text-cyan-600', bgColor: 'bg-cyan-100/70 dark:bg-cyan-900/30' },
  { name: 'AI Chat', path: '/chat', icon: MessageSquare, color: 'text-indigo-600', bgColor: 'bg-indigo-100/70 dark:bg-indigo-900/30' },
  { name: 'Practice Quizzes', path: '/quizzes', icon: GraduationCap, color: 'text-teal-600', bgColor: 'bg-teal-100/70 dark:bg-teal-900/30' },
  { name: 'Flashcards', path: '/flashcards', icon: Layers, color: 'text-blue-500', bgColor: 'bg-blue-100/70 dark:bg-blue-900/30' },
  { name: 'Study Planner', path: '/planner', icon: Calendar, color: 'text-cyan-600', bgColor: 'bg-cyan-100/70 dark:bg-cyan-900/30' },
  { name: 'Notes & Viva Prep', path: '/notes', icon: BookOpen, color: 'text-emerald-600', bgColor: 'bg-emerald-100/70 dark:bg-emerald-900/30' },
];

const accountItems = [
  { name: 'Profile', path: '/profile', icon: User, color: 'text-slate-600', bgColor: 'bg-slate-100 dark:bg-slate-800' },
];

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logout, user } = useAuth();
  const location = useLocation();

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white dark:bg-[#0d1b2e] border-r border-slate-200 dark:border-[#1e3150] transition-transform duration-300 lg:static lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
      style={{ boxShadow: '4px 0 24px rgba(0,0,0,0.04)' }}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-slate-100 dark:border-[#1e3150]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md shadow-blue-500/25">
              <Brain className="h-4.5 w-4.5" />
            </div>
            <div>
              <span className="text-sm font-bold block text-slate-800 dark:text-white">
                StudyFlow <span className="text-blue-600">AI</span>
              </span>
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            className="lg:hidden rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* User Profile Card */}
        <div className="px-4 py-4 border-b border-slate-100 dark:border-[#1e3150]">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#0a1628] border border-slate-100 dark:border-[#1e3150]">
            <div className="relative shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white shadow-md"
                style={{ background: 'linear-gradient(135deg, #2563eb, #0d9488)' }}
              >
                {getInitials(user?.name)}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 border-2 border-white dark:border-[#0a1628]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{user?.name}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-500 capitalize flex items-center gap-1">
                <Sparkles className="h-2.5 w-2.5 text-amber-400" />
                {user?.role || 'Student'} Plan
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          <div className="px-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">Study Tools</span>
          </div>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => toggleSidebar(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 group relative ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950/25 text-blue-700 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#122038] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <div className="absolute left-0 top-[20%] bottom-[20%] w-0.5 rounded-r-full bg-blue-600 dark:bg-blue-400" />
                )}
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all ${
                  isActive ? `${item.bgColor} ${item.color}` : 'group-hover:bg-slate-100 dark:group-hover:bg-[#1e3150]'
                }`}>
                  <item.icon className={`h-4 w-4 ${isActive ? item.color : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
                </div>
                <span className="truncate">{item.name}</span>
              </NavLink>
            );
          })}

          <div className="px-2 mb-2 mt-5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">Account</span>
          </div>
          {accountItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => toggleSidebar(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 group relative ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950/25 text-blue-700 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#122038] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-[20%] bottom-[20%] w-0.5 rounded-r-full bg-blue-600 dark:bg-blue-400" />
                )}
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all ${
                  isActive ? `${item.bgColor} ${item.color}` : 'group-hover:bg-slate-100 dark:group-hover:bg-[#1e3150]'
                }`}>
                  <item.icon className={`h-4 w-4 ${isActive ? item.color : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
                </div>
                <span className="truncate">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Pro Upgrade Banner */}
        <div className="px-3 pb-3">
          <div className="rounded-xl p-3.5 border border-blue-200 dark:border-blue-800/30 bg-gradient-to-br from-blue-50 to-slate-50 dark:from-blue-950/20 dark:to-[#0a1628]">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-xs font-bold text-blue-700 dark:text-blue-400">Upgrade to Pro</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-500 mb-2.5">
              Unlimited uploads &amp; AI questions
            </p>
            <button className="w-full rounded-lg py-1.5 text-[11px] font-bold text-white transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)' }}
            >
              Upgrade — $9/mo
            </button>
          </div>
        </div>

        {/* Logout */}
        <div className="px-3 pb-4 border-t border-slate-100 dark:border-[#1e3150] pt-3">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/15 transition-all"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 dark:bg-rose-950/20">
              <LogOut className="h-4 w-4" />
            </div>
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
