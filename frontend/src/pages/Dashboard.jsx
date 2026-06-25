import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { 
  FileText, MessageSquare, GraduationCap, Clock, ChevronRight, Calendar,
  AlertCircle, FileCheck, BrainCircuit, TrendingUp, Zap, Target, ArrowUpRight
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { SkeletonCard } from '../components/SkeletonLoader';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/dashboard');
        setData(response.data);
      } catch (err) {
        console.error('Error fetching dashboard:', err.message);
        setError('Failed to load dashboard statistics.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="h-8 w-64 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
        </div>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2 h-80 rounded-2xl bg-white dark:bg-[#0e1525] animate-pulse border border-slate-200 dark:border-[#1e2d45]" />
          <div className="h-80 rounded-2xl bg-white dark:bg-[#0e1525] animate-pulse border border-slate-200 dark:border-[#1e2d45]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 dark:border-rose-900/30 bg-rose-50 dark:bg-rose-950/10 p-8 text-center">
        <AlertCircle className="mx-auto h-12 w-12 mb-3 text-rose-500" />
        <p className="font-semibold text-rose-700 dark:text-rose-400 mb-1">{error}</p>
        <p className="text-sm text-rose-500/70 mb-4">Make sure the backend server is running.</p>
        <button
          onClick={() => { setIsLoading(true); setError(''); }}
          className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
          style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)' }}
        >
          Retry
        </button>
      </div>
    );
  }

  const { stats, recentActivity, analytics } = data;

  const statCards = [
    {
      name: 'Documents Indexed',
      value: stats.totalDocuments,
      desc: '+2 this week',
      icon: FileText,
      gradient: 'from-blue-600 to-indigo-700',
      shadow: 'rgba(37, 99, 235, 0.3)',
      bg: 'bg-blue-50 dark:bg-blue-950/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      link: '/documents',
      trend: '+12%',
      positive: true,
    },
    {
      name: 'AI Questions',
      value: stats.totalQuestionsAsked,
      desc: 'Document Q&A sessions',
      icon: MessageSquare,
      gradient: 'from-cyan-500 to-blue-600',
      shadow: 'rgba(6, 182, 212, 0.3)',
      bg: 'bg-cyan-50 dark:bg-cyan-950/20',
      iconColor: 'text-cyan-600 dark:text-cyan-400',
      link: '/chat',
      trend: '+28%',
      positive: true,
    },
    {
      name: 'Quizzes Taken',
      value: stats.totalQuizzesGenerated,
      desc: 'Auto-generated evaluations',
      icon: GraduationCap,
      gradient: 'from-indigo-500 to-violet-600',
      shadow: 'rgba(99, 102, 241, 0.3)',
      bg: 'bg-indigo-50 dark:bg-indigo-950/20',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      link: '/quizzes',
      trend: '+5%',
      positive: true,
    },
    {
      name: 'Study Hours',
      value: `${stats.totalStudyHours}h`,
      desc: 'Estimated revision effort',
      icon: Clock,
      gradient: 'from-emerald-500 to-teal-600',
      shadow: 'rgba(16, 185, 129, 0.3)',
      bg: 'bg-emerald-50 dark:bg-emerald-950/20',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      link: '/planner',
      trend: '+3h',
      positive: true,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Welcome Banner */}
      <div className="rounded-2xl overflow-hidden relative" style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #0d9488 100%)',
        minHeight: '120px',
      }}>
        {/* Background decorations */}
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 h-24 w-24 rounded-full bg-white/5 translate-y-1/2 pointer-events-none" />
        <div className="absolute inset-0 dot-grid opacity-[0.06] pointer-events-none" />

        <div className="relative z-10 p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-blue-200/80 text-sm font-medium mb-1">{greeting} 👋</p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                {user?.name?.split(' ')[0] || 'Student'}
              </h2>
              <p className="text-blue-200/70 text-sm mt-1">
                Ready to level up? You have {stats.totalDocuments} documents to explore.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/documents"
                className="flex items-center gap-2 rounded-xl bg-white/15 backdrop-blur-sm hover:bg-white/25 border border-white/20 px-4 py-2.5 text-xs font-bold text-white transition-all"
              >
                <FileText className="h-4 w-4" />
                Upload PDF
              </Link>
              <Link
                to="/chat"
                className="flex items-center gap-2 rounded-xl bg-white text-blue-700 px-4 py-2.5 text-xs font-bold hover:bg-blue-50 transition-colors shadow-lg"
              >
                <Zap className="h-4 w-4" />
                Start Chatting
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Link
            key={card.name}
            to={card.link}
            className="group rounded-2xl border border-slate-200 dark:border-[#1e3150] bg-white dark:bg-[#0d1b2e] p-5 transition-all duration-300 hover:-translate-y-1 block"
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${card.gradient} text-white shadow-lg group-hover:scale-110 transition-transform`}
                style={{ boxShadow: `0 4px 12px ${card.shadow}` }}
              >
                <card.icon className="h-5 w-5" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${card.positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                <TrendingUp className="h-3 w-3" />
                {card.trend}
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {card.value}
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-500 mb-0.5">{card.name}</div>
            <div className="text-[10px] text-slate-400 dark:text-slate-600">{card.desc}</div>
            <div className="mt-3 flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
              Open <ArrowUpRight className="h-3 w-3 ml-0.5" />
            </div>
          </Link>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Area Chart - Weekly Activity */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-[#1e3150] bg-white dark:bg-[#0d1b2e] p-6"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-600" />
                Weekly Activity
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-600 mt-0.5">Actions logged across all tools</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 rounded-full px-2.5 py-1">
              <TrendingUp className="h-3 w-3" />
              This week
            </div>
          </div>
          <div className="h-56">
            {analytics.weeklyActivity.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.weeklyActivity} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorActions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-100 dark:text-slate-800" />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      backgroundColor: '#0f1e3d',
                      color: '#e2e8f0',
                      border: '1px solid rgba(37, 99, 235, 0.3)',
                      fontSize: '12px',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                    }}
                  />
                  <Area type="monotone" dataKey="actions" name="Activity" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorActions)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center">
                <Target className="h-10 w-10 mb-2 text-slate-300 dark:text-slate-700" />
                <p className="text-sm font-medium text-slate-500 dark:text-slate-500">No activity yet this week</p>
                <p className="text-xs text-slate-400 dark:text-slate-600 mt-1">Upload a PDF to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* Bar Chart - Quiz Scores */}
        <div className="rounded-2xl border border-slate-200 dark:border-[#1e3150] bg-white dark:bg-[#0d1b2e] p-6"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        >
          <div className="mb-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-cyan-500" />
              Quiz Score Progress
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-600 mt-0.5">Your last {analytics.quizPerformance.length || 0} quizzes</p>
          </div>
          <div className="h-56">
            {analytics.quizPerformance.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.quizPerformance} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-100 dark:text-slate-800" />
                  <XAxis dataKey="quizNumber" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      backgroundColor: '#0c4a6e',
                      color: '#e2e8f0',
                      border: '1px solid rgba(6, 182, 212, 0.3)',
                      fontSize: '12px',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                    }}
                    formatter={(value) => [`${value}%`, 'Score']}
                  />
                  <Bar dataKey="percentage" name="Score" radius={[6, 6, 0, 0]} barSize={18}
                    fill="url(#barGradient)"
                  >
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#0891b2" />
                      </linearGradient>
                    </defs>
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <GraduationCap className="h-10 w-10 mb-2 text-slate-300 dark:text-slate-700" />
                <p className="text-sm font-medium text-slate-500 dark:text-slate-500">No quizzes yet</p>
                <Link to="/quizzes" className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-1 hover:underline">
                  Generate your first quiz →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="rounded-2xl border border-slate-200 dark:border-[#1e2d45] bg-white dark:bg-[#0e1525] p-6"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Activity</h3>
            <p className="text-xs text-slate-400 dark:text-slate-600 mt-0.5">Your latest study actions</p>
          </div>
          <Link to="/documents" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
            View all <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recentActivity.length > 0 ? (
          <div className="space-y-1">
            {recentActivity.map((log, i) => {
              const dateStr = new Date(log.timestamp).toLocaleDateString(undefined, {
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
              });

              const iconMap = {
                upload: { Icon: FileCheck, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/20' },
                chat: { Icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/20' },
                quiz: { Icon: GraduationCap, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/20' },
                flashcard: { Icon: FileText, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-950/20' },
                study_plan: { Icon: Calendar, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/20' },
                notes: { Icon: BrainCircuit, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/20' },
              };
              const { Icon, color, bg } = iconMap[log.actionType] || { Icon: Zap, color: 'text-slate-500', bg: 'bg-slate-50 dark:bg-slate-800' };

              return (
                <div key={log._id || i} className="flex items-center gap-4 py-3 border-b border-slate-100 dark:border-[#1e3150]/60 last:border-0 hover:bg-slate-50/50 dark:hover:bg-[#122038]/40 rounded-xl px-2 -mx-2 transition-colors">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${bg}`}>
                    <Icon className={`h-4.5 w-4.5 ${color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{log.details}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-600 mt-0.5">{dateStr}</p>
                  </div>
                  <div className="shrink-0">
                    <span className="inline-block rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[10px] font-semibold text-slate-500 dark:text-slate-500 capitalize">
                      {log.actionType?.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
              <BrainCircuit className="h-8 w-8 text-slate-300 dark:text-slate-600" />
            </div>
            <p className="font-semibold text-slate-600 dark:text-slate-400 mb-1">No activity yet</p>
            <p className="text-xs text-slate-400 dark:text-slate-600 mb-4">Upload your first study PDF to get started</p>
            <Link
              to="/documents"
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}
            >
              Upload a Document
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
