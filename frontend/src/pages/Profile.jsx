import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Sparkles, Clock, FileText, MessageSquare, GraduationCap } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-left animate-slide-up">
      
      {/* Profile Info Card */}
      <div className="rounded-3xl border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card p-8 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 h-[200px] w-[200px] rounded-full bg-brand-primary/10 blur-[80px] pointer-events-none" />

        {/* Profile Letter Circle */}
        <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-brand-primary to-brand-secondary text-white font-extrabold flex items-center justify-center text-4xl shrink-0 shadow-lg shadow-brand-primary/10">
          {user?.name?.charAt(0).toUpperCase()}
        </div>

        {/* User details */}
        <div className="flex-1 space-y-4 text-center md:text-left">
          <div>
            <div className="flex flex-col md:flex-row items-center gap-2.5">
              <h2 className="text-2xl font-extrabold text-light-text-heading dark:text-dark-text-heading">
                {user?.name}
              </h2>
              <span className="px-3 py-1 rounded-full border border-brand-primary/20 bg-brand-primary/10 text-[10px] font-bold text-brand-primary capitalize">
                {user?.role} Account
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Registered academic study user</p>
          </div>

          <div className="space-y-2 text-sm max-w-sm mx-auto md:mx-0">
            <div className="flex items-center gap-3 text-slate-650 dark:text-slate-400">
              <Mail className="h-4.5 w-4.5 text-slate-400 shrink-0" />
              <span className="truncate">{user?.email}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-650 dark:text-slate-400">
              <Shield className="h-4.5 w-4.5 text-slate-400 shrink-0" />
              <span className="capitalize">{user?.role} Access Rights Granted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="rounded-2xl border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card p-6 shadow-sm">
        <h3 className="text-base font-bold text-light-text-heading dark:text-dark-text-heading mb-6 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-brand-primary" />
          Academic Performance Summary
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          
          <div className="p-4 rounded-xl border border-light-border dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/20">
            <FileText className="h-5 w-5 text-brand-primary mx-auto mb-2" />
            <span className="block text-2xl font-extrabold text-light-text-heading dark:text-dark-text-heading">Student</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Access Tier</span>
          </div>

          <div className="p-4 rounded-xl border border-light-border dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/20">
            <MessageSquare className="h-5 w-5 text-brand-secondary mx-auto mb-2" />
            <span className="block text-2xl font-extrabold text-light-text-heading dark:text-dark-text-heading">Gemini RAG</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Retrieval Engine</span>
          </div>

          <div className="p-4 rounded-xl border border-light-border dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/20">
            <GraduationCap className="h-5 w-5 text-indigo-500 mx-auto mb-2" />
            <span className="block text-2xl font-extrabold text-light-text-heading dark:text-dark-text-heading">10 MCQ</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Evaluation format</span>
          </div>

          <div className="p-4 rounded-xl border border-light-border dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/20">
            <Clock className="h-5 w-5 text-emerald-500 mx-auto mb-2" />
            <span className="block text-2xl font-extrabold text-light-text-heading dark:text-dark-text-heading">100%</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">System Uptime</span>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Profile;
