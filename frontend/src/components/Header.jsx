import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  Menu, Sun, Moon, Bell, Search, User, LogOut, 
  LayoutDashboard, FileText, BookOpen, GraduationCap, Layers, Calendar 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

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

const pages = [
  { name: 'Dashboard', path: '/dashboard', desc: 'Overall learning statistics', icon: LayoutDashboard },
  { name: 'Materials', path: '/documents', desc: 'Manage your syllabus & PDFs', icon: FileText },
  { name: 'AI Chat', path: '/chat', desc: 'Chat with uploaded PDF documents', icon: BookOpen },
  { name: 'Practice Quizzes', path: '/quizzes', desc: 'Assessments from syllabus content', icon: GraduationCap },
  { name: 'Flashcards', path: '/flashcards', desc: 'Generate double-sided study decks', icon: Layers },
  { name: 'Notes & Viva Prep', path: '/notes', desc: 'Notes and oral exam preparation', icon: BookOpen },
  { name: 'Study Planner', path: '/planner', desc: 'Weekly learning schedules', icon: Calendar },
  { name: 'Profile Settings', path: '/profile', desc: 'Manage your settings', icon: User }
];

const Header = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [documents, setDocuments] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const searchInputRef = useRef(null);

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

  // Close menus on path changes
  useEffect(() => {
    setSearchOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  // Fetch documents when search opens
  useEffect(() => {
    if (searchOpen) {
      const fetchDocs = async () => {
        setLoadingDocs(true);
        try {
          const response = await api.get('/documents');
          setDocuments(response.data);
        } catch (err) {
          console.error('Failed to load documents for search', err);
        } finally {
          setLoadingDocs(false);
        }
      };
      fetchDocs();
      // focus search input
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchQuery('');
    }
  }, [searchOpen]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setProfileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentPath = Object.keys(pageMeta).find(k => location.pathname.startsWith(k)) || '/dashboard';
  const meta = pageMeta[currentPath] || { title: 'StudyFlow AI', sub: '' };

  const handleSearchNavigate = (path) => {
    setSearchOpen(false);
    navigate(path);
  };

  // Filtering results
  const filteredPages = pages.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDocs = documents.filter(d => 
    d.originalname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="h-16 flex items-center justify-between border-b border-slate-200 dark:border-[#1e3150] bg-white/90 dark:bg-[#0d1b2e]/90 backdrop-blur-xl px-5 sticky top-0 z-30"
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
          className="rounded-xl p-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-700 dark:hover:text-slate-200 transition-all animate-fade-in"
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
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-blue-500 border border-white dark:border-[#0d1b2e]" />
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

        {/* User Badge / Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 hover:opacity-95 transition-all focus:outline-none cursor-pointer"
          >
            <div className="hidden sm:block text-right select-none">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-tight">{user?.name?.split(' ')[0]}</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 capitalize">{user?.role || 'Student'}</p>
            </div>
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white select-none shadow-sm"
              style={{ background: 'linear-gradient(135deg, #2563eb, #0d9488)', boxShadow: '0 2px 8px rgba(37, 99, 235, 0.2)' }}
            >
              {getInitials(user?.name)}
            </div>
          </button>
          
          {profileOpen && (
            <>
              {/* Invisible overlay to catch clicks */}
              <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
              
              {/* Dropdown menu */}
              <div 
                className="absolute right-0 mt-2.5 w-52 rounded-2xl border border-slate-200 dark:border-[#1e3150] bg-white dark:bg-[#0d1b2e] shadow-xl p-2 z-50"
                style={{ animation: 'slide-up 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
              >
                {/* Header */}
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800/80 mb-1.5 select-none">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.name}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">{user?.email}</p>
                </div>
                
                {/* Options */}
                <Link
                  to="/profile"
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#0e1525] transition-colors"
                >
                  <User className="h-4 w-4 text-slate-400" />
                  Profile Settings
                </Link>
                
                <button
                  onClick={() => {
                    logout();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/15 transition-colors text-left cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Command Palette Search Overlay */}
      {searchOpen && (
        <>
          {/* Backdrop Click Catch */}
          <div 
            className="fixed inset-0 z-40 bg-slate-900/10 dark:bg-black/35 backdrop-blur-xs" 
            onClick={() => setSearchOpen(false)} 
          />
          
          {/* Search Dropdown */}
          <div 
            className="absolute top-full left-0 right-0 mx-5 mt-2 rounded-2xl bg-white dark:bg-[#0d1b2e] border border-slate-200 dark:border-[#1e3150] shadow-2xl z-50 flex flex-col overflow-hidden"
            style={{ animation: 'slide-up 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
          >
            {/* Input Field */}
            <div className="p-4 border-b border-slate-100 dark:border-[#1e3150] bg-slate-50/50 dark:bg-[#0a1628]/30 flex items-center gap-3.5">
              <Search className="h-5 w-5 text-slate-400 shrink-0 animate-pulse-slow" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools, dashboard sections, or uploaded PDFs..."
                className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Scrollable Results Pane */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[320px]">
              
              {/* Section 1: Pages / Tools */}
              {filteredPages.length > 0 && (
                <div className="space-y-1">
                  <h4 className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2 mb-1.5">Tools & Sections</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                    {filteredPages.map((p) => {
                      const Icon = p.icon;
                      return (
                        <button
                          key={p.name}
                          onClick={() => handleSearchNavigate(p.path)}
                          className="flex items-center gap-3 rounded-xl p-2 hover:bg-slate-50 dark:hover:bg-[#0e1525] transition-all text-left w-full group"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-250 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{p.name}</p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{p.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Section 2: Uploaded Documents */}
              <div>
                <h4 className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2 mb-1.5">Study Materials</h4>
                
                {loadingDocs ? (
                  <div className="flex items-center justify-center py-6 text-xs text-slate-400 gap-2">
                    <span className="h-4 w-4 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin" />
                    Searching database...
                  </div>
                ) : filteredDocs.length > 0 ? (
                  <div className="space-y-1">
                    {filteredDocs.map((doc) => (
                      <div 
                        key={doc._id}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-[#0e1525] transition-all group border border-transparent hover:border-slate-100 dark:hover:border-[#1e2d45]/30"
                      >
                        <div 
                          className="flex items-center gap-3 cursor-pointer flex-1 min-w-0" 
                          onClick={() => handleSearchNavigate(`/chat?docId=${doc._id}`)}
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-500 shrink-0">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{doc.originalname}</p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500">
                              PDF • {((doc.size || 0) / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        
                        {/* Interactive Shortcuts */}
                        <div className="flex items-center gap-1 opacity-70 md:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleSearchNavigate(`/chat?docId=${doc._id}`)}
                            className="px-2 py-1 text-[9px] font-bold rounded-lg bg-blue-500/10 text-blue-600 hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
                            title="Chat with AI"
                          >
                            Chat
                          </button>
                          <button
                            onClick={() => handleSearchNavigate(`/quizzes?docId=${doc._id}`)}
                            className="px-2 py-1 text-[9px] font-bold rounded-lg bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500 hover:text-white transition-all cursor-pointer"
                            title="Start Quiz"
                          >
                            Quiz
                          </button>
                          <button
                            onClick={() => handleSearchNavigate(`/flashcards?docId=${doc._id}`)}
                            className="px-2 py-1 text-[9px] font-bold rounded-lg bg-teal-500/10 text-teal-600 hover:bg-teal-600 hover:text-white transition-all cursor-pointer"
                            title="Flashcards"
                          >
                            Cards
                          </button>
                          <button
                            onClick={() => handleSearchNavigate(`/notes?docId=${doc._id}`)}
                            className="px-2 py-1 text-[9px] font-bold rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all cursor-pointer"
                            title="Revision Notes"
                          >
                            Notes
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-xs text-slate-400">
                    {searchQuery ? 'No documents match your query' : 'No documents uploaded yet. Go to Materials to upload.'}
                  </div>
                )}
              </div>

              {/* Zero match state */}
              {filteredPages.length === 0 && filteredDocs.length === 0 && !loadingDocs && (
                <div className="text-center py-8">
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-450">No results found for "{searchQuery}"</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Try another search term or upload a PDF first.</p>
                </div>
              )}

            </div>

            {/* Footer Actions */}
            <div className="p-3 border-t border-slate-150 dark:border-[#1e3150] bg-slate-50/50 dark:bg-[#0a1628]/30 text-center flex items-center justify-between px-4">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 leading-none">
                💡 Clicking shortcuts will automatically select the document inside that tool.
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 leading-none hidden sm:inline">
                 <kbd className="px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0d1b2e] text-[9px]">Esc</kbd>
              </span>
            </div>

          </div>
        </>
      )}
    </header>
  );
};

export default Header;
