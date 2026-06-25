import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, GraduationCap, Layers, Calendar, BookOpen, 
  UploadCloud, ArrowRight, ShieldCheck, Zap, Brain, Star,
  ChevronRight, FileText, BarChart3, Check, Menu, X, 
  Building2, Globe, Lock, TrendingUp, Users, Award
} from 'lucide-react';

const stats = [
  { value: '50K+', label: 'Study Sessions' },
  { value: '2.8M+', label: 'Questions Answered' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '180+', label: 'Universities' },
];

const features = [
  {
    icon: MessageSquare,
    title: 'Semantic Document Chat',
    desc: 'Ask anything about your uploaded PDFs. Our RAG engine retrieves the most relevant passages and crafts precise, cited answers grounded entirely in your document.',
    color: 'bg-blue-600',
    border: 'border-blue-100 dark:border-blue-900/30',
    tag: 'Most Used',
    tagColor: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/30',
  },
  {
    icon: GraduationCap,
    title: 'AI Quiz Generator',
    desc: 'Generate 10-question multiple-choice exams from any topic in your notes. Track your score trends and review detailed answer explanations.',
    color: 'bg-teal-600',
    border: 'border-teal-100 dark:border-teal-900/30',
    tag: null,
    tagColor: '',
  },
  {
    icon: Layers,
    title: 'Smart Flashcards',
    desc: 'Instantly synthesize key definitions and formulas into interactive flip-card decks. Study anywhere with click-to-reveal animations.',
    color: 'bg-indigo-600',
    border: 'border-indigo-100 dark:border-indigo-900/30',
    tag: null,
    tagColor: '',
  },
  {
    icon: Calendar,
    title: 'Dynamic Study Planner',
    desc: 'Enter your exam date and subjects. Our AI builds a day-by-day revision calendar, breaking down the syllabus into achievable daily targets.',
    color: 'bg-cyan-600',
    border: 'border-cyan-100 dark:border-cyan-900/30',
    tag: null,
    tagColor: '',
  },
  {
    icon: BookOpen,
    title: 'Viva Prep & AI Notes',
    desc: 'Get 20 curated verbal exam questions with model answers. Automatically generate concise, high-signal revision notes from complex material.',
    color: 'bg-emerald-600',
    border: 'border-emerald-100 dark:border-emerald-900/30',
    tag: 'New',
    tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/30',
  },
  {
    icon: UploadCloud,
    title: 'RAG File Indexing',
    desc: 'Drop in any academic PDF up to 10MB. Text extraction, semantic chunking, and vector embedding happen in seconds via our batch pipeline.',
    color: 'bg-slate-600',
    border: 'border-slate-100 dark:border-slate-900/30',
    tag: null,
    tagColor: '',
  },
];

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'MSc Computer Science',
    text: 'StudyFlow turned 300-page textbooks into bite-sized flashcards in minutes. I went from a B- to an A in my algorithms paper.',
    rating: 5,
    initials: 'PS',
    color: 'bg-blue-600',
  },
  {
    name: 'James Okafor',
    role: 'Medical Student, Year 3',
    text: 'The viva prep feature is unreal. Twenty targeted questions with model answers — it felt like having a consultant review my notes.',
    rating: 5,
    initials: 'JO',
    color: 'bg-teal-600',
  },
  {
    name: 'Anika Bose',
    role: 'Engineering Undergrad',
    text: 'The study planner figured out my exam schedule and organized my revision week by week. I finally stopped cramming the night before.',
    rating: 5,
    initials: 'AB',
    color: 'bg-indigo-600',
  },
];

const trustedBy = ['MIT', 'IIT Delhi', 'Oxford', 'Stanford', 'Cambridge', 'NUS'];

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#060b18] text-slate-800 dark:text-slate-300 transition-colors duration-300 overflow-x-hidden">

      {/* === NAVIGATION === */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 dark:bg-[#0d1b2e]/95 backdrop-blur-xl border-b border-slate-200 dark:border-[#1e3150] shadow-sm' 
          : 'bg-transparent'
      }`}>
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md shadow-blue-500/25">
              <Brain className="h-4.5 w-4.5" />
            </div>
            <span className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              StudyFlow <span className="text-blue-600">AI</span>
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-400">
            <a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">How It Works</a>
            <a href="#testimonials" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Reviews</a>
            <a href="#pricing" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Pricing</a>
          </div>

          {/* CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5">
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-[#0d1b2e] border-b border-slate-200 dark:border-[#1e3150] px-6 py-4 space-y-3">
            <a href="#features" className="block text-sm font-medium text-slate-600 dark:text-slate-400 py-2">Features</a>
            <a href="#how-it-works" className="block text-sm font-medium text-slate-600 dark:text-slate-400 py-2">How It Works</a>
            <a href="#testimonials" className="block text-sm font-medium text-slate-600 dark:text-slate-400 py-2">Reviews</a>
            <div className="flex gap-3 pt-2">
              <Link to="/login" className="flex-1 text-center py-2.5 text-sm font-semibold border border-slate-200 dark:border-slate-700 rounded-lg">Sign In</Link>
              <Link to="/register" className="flex-1 text-center py-2.5 text-sm font-bold bg-blue-600 text-white rounded-lg">Get Started</Link>
            </div>
          </div>
        )}
      </nav>

      {/* === HERO SECTION === */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 overflow-hidden">

        {/* Subtle corporate grid background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 line-grid opacity-60 dark:opacity-30" />
          <div className="absolute top-[15%] left-[10%] h-[400px] w-[400px] rounded-full bg-blue-500/6 dark:bg-blue-500/8 blur-[100px]" />
          <div className="absolute bottom-[20%] right-[8%] h-[350px] w-[350px] rounded-full bg-teal-500/5 dark:bg-teal-500/8 blur-[90px]" />
          <div className="absolute top-[40%] right-[20%] h-3 w-3 rounded-full bg-blue-400/50 dark:bg-blue-400/70" style={{ animation: 'float 7s ease-in-out infinite' }} />
          <div className="absolute bottom-[30%] left-[15%] h-2 w-2 rounded-full bg-teal-400/50 dark:bg-teal-400/60" style={{ animation: 'float 9s ease-in-out infinite 1s' }} />
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto">
          {/* Enterprise badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-800/50 bg-blue-50 dark:bg-blue-950/30 px-4 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 mb-8">
            <Building2 className="h-3.5 w-3.5" />
            Enterprise-Grade AI Learning Platform
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6 text-slate-900 dark:text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            The AI platform your
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #0d9488 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              academics demand
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
            Upload your lecture PDFs and unlock instant AI tutoring — document Q&A, adaptive quizzes, 
            smart flashcards, and personalized study plans — trusted by students at leading universities.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              to="/register"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl px-8 py-4 text-base font-bold text-white transition-all hover:-translate-y-1 bg-blue-600 hover:bg-blue-700"
              style={{ boxShadow: '0 8px 24px rgba(37, 99, 235, 0.35)' }}
            >
              Start Learning Free
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="#features"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-[#1e3150] bg-white dark:bg-[#0d1b2e] hover:bg-slate-50 dark:hover:bg-[#122038] px-8 py-4 text-base font-bold transition-all hover:-translate-y-1 text-slate-700 dark:text-slate-300"
            >
              See How It Works
            </a>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {stat.value}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-500 mt-1 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Trusted By */}
        <div className="relative z-10 mt-16 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-600 mb-4">Trusted by students at</p>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {trustedBy.map((uni) => (
              <span key={uni} className="text-sm font-bold text-slate-400 dark:text-slate-600 tracking-wide">{uni}</span>
            ))}
          </div>
        </div>
      </section>

      {/* === FEATURES SECTION === */}
      <section id="features" className="relative py-24 px-6 bg-white dark:bg-[#0a1628]">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-[#1e3150] to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-[#1e3150] to-transparent" />

        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <span className="inline-block rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/30 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-4">
              Feature Suite
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Everything you need to ace your exams
            </h2>
            <p className="mx-auto max-w-xl text-slate-600 dark:text-slate-400 text-lg">
              Six powerful tools that work together to transform how you absorb and retain academic material.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className={`group relative rounded-2xl border ${feature.border} bg-[#f8fafc] dark:bg-[#0d1b2e] p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-blue-500/8 overflow-hidden`}
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                {feature.tag && (
                  <span className={`absolute top-5 right-5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${feature.tagColor}`}>
                    {feature.tag}
                  </span>
                )}

                <div className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl ${feature.color} text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-5.5 w-5.5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2.5">{feature.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>

                <div className="mt-5 flex items-center text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:gap-1.5 gap-1 transition-all">
                  Learn more <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === HOW IT WORKS === */}
      <section id="how-it-works" className="py-24 px-6 bg-[#f8fafc] dark:bg-[#060b18]">
        <div className="mx-auto max-w-5xl text-center">
          <span className="inline-block rounded-full bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/30 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-4">
            How It Works
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-16 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            From PDF to exam-ready in 3 steps
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Upload Your Materials',
                desc: 'Drop in lecture slides, textbook chapters, or past papers as PDFs. Our engine processes and indexes them instantly.',
                icon: UploadCloud,
                bg: 'bg-blue-600',
              },
              {
                step: '02',
                title: 'Let AI Analyze Them',
                desc: 'Our Llama 3.3-powered system chunks your content, generates embeddings, and maps the knowledge graph.',
                icon: Brain,
                bg: 'bg-teal-600',
              },
              {
                step: '03',
                title: 'Study Intelligently',
                desc: 'Chat, quiz yourself, build flashcard decks, and generate a revision plan — all powered by your specific documents.',
                icon: BarChart3,
                bg: 'bg-indigo-600',
              },
            ].map((step, i) => (
              <div key={step.step} className="relative text-left bg-white dark:bg-[#0d1b2e] rounded-2xl border border-slate-200 dark:border-[#1e3150] p-8 hover:shadow-md transition-shadow">
                <div className="text-6xl font-black text-slate-100 dark:text-[#122038]/80 absolute top-4 right-5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{step.step}</div>
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${step.bg} text-white shadow-md mb-5`}>
                  <step.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{step.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === TESTIMONIALS === */}
      <section id="testimonials" className="py-24 px-6 bg-white dark:bg-[#0a1628]">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-[#1e3150] to-transparent" />
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <span className="inline-block rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/30 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-4">
              Student Reviews
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Students love StudyFlow AI
            </h2>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
              ))}
              <span className="ml-2 text-sm font-semibold text-slate-600 dark:text-slate-400">4.9/5 from 2,400+ reviews</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl border border-slate-200 dark:border-[#1e3150] bg-[#f8fafc] dark:bg-[#0d1b2e] p-7 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6 text-sm italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full ${t.color} text-white font-bold text-sm`}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">{t.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === PRICING === */}
      <section id="pricing" className="py-24 px-6 bg-[#f8fafc] dark:bg-[#060b18]">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-block rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/30 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-4">
            Simple Pricing
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Free to start. Always.
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-12 text-lg">Every feature available from day one — no credit card required.</p>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free Plan */}
            <div className="rounded-2xl border border-slate-200 dark:border-[#1e3150] bg-white dark:bg-[#0d1b2e] p-8 text-left">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-500 mb-2">Free Plan</div>
              <div className="text-4xl font-black text-slate-900 dark:text-white mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>$0</div>
              <div className="text-slate-500 text-sm mb-6">Forever free</div>
              <ul className="space-y-3 mb-8">
                {['5 PDF uploads', '100 AI chat questions/month', '10 quiz generations', 'Unlimited flashcards', 'Basic study planner'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="block text-center py-3 px-6 rounded-xl border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-500 font-bold text-sm hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors">
                Get Started Free
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="rounded-2xl p-8 text-left relative overflow-hidden" style={{
              background: 'linear-gradient(145deg, #1e3a8a 0%, #1d4ed8 50%, #0d9488 100%)',
              boxShadow: '0 12px 40px rgba(37, 99, 235, 0.35)',
            }}>
              <div className="absolute top-5 right-5 bg-amber-400 text-amber-900 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide">
                Popular
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-200 mb-2">Pro Plan</div>
              <div className="text-4xl font-black text-white mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>$9</div>
              <div className="text-blue-200 text-sm mb-6">per month</div>
              <ul className="space-y-3 mb-8">
                {['Unlimited PDF uploads', 'Unlimited AI chat', 'Unlimited quiz & flashcards', 'Smart study planner', 'Priority Llama 3.3 model', 'Advanced viva prep'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-blue-100">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="block text-center py-3 px-6 rounded-xl bg-white text-blue-700 font-bold text-sm hover:bg-blue-50 transition-colors">
                Start Pro Trial Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* === CTA SECTION === */}
      <section className="py-24 px-6 bg-white dark:bg-[#0a1628]">
        <div className="mx-auto max-w-4xl">
          <div className="relative rounded-2xl overflow-hidden text-center p-12 md:p-16 border border-blue-100 dark:border-[#1e3150]" style={{
            background: 'linear-gradient(145deg, #1e3a8a 0%, #1d4ed8 50%, #0d9488 100%)',
          }}>
            <div className="absolute top-0 right-0 h-56 w-56 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-blue-200 mb-6">
                <Zap className="h-3.5 w-3.5" />
                Ready to start your journey?
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Ace your next exam with AI
              </h2>
              <p className="mx-auto max-w-md text-blue-200 mb-10 text-lg">
                Join thousands of students who've already transformed how they study. Set up your workspace in under 60 seconds.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-10 py-4 text-base font-bold text-blue-700 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
              >
                Create Your Free Account
                <ArrowRight className="h-5 w-5" />
              </Link>
              <div className="mt-6 flex items-center justify-center gap-4 text-xs text-blue-300">
                <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5" /> No credit card</span>
                <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5" /> Free forever plan</span>
                <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5" /> Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === FOOTER === */}
      <footer className="border-t border-slate-200 dark:border-[#1e3150] bg-[#f8fafc] dark:bg-[#060b18] py-10 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Brain className="h-4 w-4" />
              </div>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">StudyFlow AI</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-5 text-xs font-medium text-slate-500 dark:text-slate-600">
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> GDPR Compliant</span>
              <span className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5 text-blue-500" /> Data Encrypted</span>
              <a href="/login" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Sign In</a>
              <a href="/register" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Register</a>
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-600">
              © {new Date().getFullYear()} StudyFlow AI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
