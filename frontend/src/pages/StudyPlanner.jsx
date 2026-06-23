import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Calendar, ListTodo, Loader, CheckCircle, AlertCircle, Clock, Sparkles } from 'lucide-react';
import Toast from '../components/Toast';

const StudyPlanner = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState('');
  const [pastPlans, setPastPlans] = useState([]);
  
  // Active study plan
  const [activePlan, setActivePlan] = useState(null);
  const [examDate, setExamDate] = useState('');
  const [completedTasks, setCompletedTasks] = useState({}); // { 'day-taskIndex': boolean }

  // States
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const triggerToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
  };

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const response = await api.get('/documents');
        setDocuments(response.data);
        if (response.data.length > 0) {
          setSelectedDocId(response.data[0]._id);
        }
      } catch (err) {
        console.error('Error fetching documents:', err.message);
        triggerToast('Could not load documents', 'error');
      } finally {
        setIsLoadingDocs(false);
      }
    };
    fetchDocs();
  }, []);

  useEffect(() => {
    if (!selectedDocId) {
      setPastPlans([]);
      return;
    }

    const fetchHistory = async () => {
      setIsLoadingHistory(true);
      try {
        const response = await api.get(`/study-plans/document/${selectedDocId}`);
        setPastPlans(response.data);
      } catch (err) {
        console.error('Error loading history:', err.message);
        triggerToast('Failed to load past plans', 'error');
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchHistory();
  }, [selectedDocId]);

  const handleGeneratePlan = async (e) => {
    e.preventDefault();
    if (!selectedDocId) {
      triggerToast('Please select a document', 'error');
      return;
    }
    if (!examDate) {
      triggerToast('Please pick an exam date', 'error');
      return;
    }

    setIsGenerating(true);
    setActivePlan(null);
    setCompletedTasks({});

    try {
      const response = await api.post('/study-plans', {
        documentId: selectedDocId,
        examDate,
      });
      setActivePlan(response.data);
      triggerToast('AI Study schedule generated!', 'success');
      
      // Refresh history
      const histResponse = await api.get(`/study-plans/document/${selectedDocId}`);
      setPastPlans(histResponse.data);
    } catch (err) {
      console.error('Error generating plan:', err);
      const msg = err.response?.data?.message || 'Failed to generate study plan.';
      triggerToast(msg, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleTask = (dayIdx, taskIdx) => {
    const key = `${dayIdx}-${taskIdx}`;
    setCompletedTasks((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Planner Controls Sidebar */}
      <div className="lg:col-span-1 space-y-6">
        
        {/* Planner Inputs Card */}
        <div className="rounded-2xl border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card p-6 shadow-sm">
          <h3 className="text-base font-bold text-light-text-heading dark:text-dark-text-heading mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-brand-primary" />
            Study Planner
          </h3>

          <form onSubmit={handleGeneratePlan} className="space-y-4">
            
            {/* Document select */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Syllabus Material
              </label>
              {isLoadingDocs ? (
                <div className="h-10 rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
              ) : documents.length > 0 ? (
                <select
                  value={selectedDocId}
                  onChange={(e) => setSelectedDocId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-light-border dark:border-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-primary text-light-text-heading dark:text-dark-text-heading"
                >
                  {documents.map((doc) => (
                    <option key={doc._id} value={doc._id}>
                      {doc.originalname}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  No documents found. Upload a PDF first.
                </div>
              )}
            </div>

            {/* Exam Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Exam Date
              </label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                required
                className="w-full bg-slate-50 dark:bg-slate-950 border border-light-border dark:border-slate-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-primary text-light-text-heading dark:text-dark-text-heading"
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating || !selectedDocId || !examDate}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-50 text-white font-bold py-3.5 shadow hover:shadow-md transition-all cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  Generating Plan...
                </>
              ) : (
                'Generate Custom Schedule'
              )}
            </button>
          </form>
        </div>

        {/* Saved Plans */}
        <div className="rounded-2xl border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card p-6 shadow-sm">
          <h3 className="text-sm font-bold text-light-text-heading dark:text-dark-text-heading mb-4 uppercase tracking-wider">
            Previous Schedules
          </h3>

          {isLoadingHistory ? (
            <div className="space-y-2">
              <div className="h-10 rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
              <div className="h-10 rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
            </div>
          ) : pastPlans.length > 0 ? (
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {pastPlans.map((plan) => {
                const dateStr = new Date(plan.examDate).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                });

                return (
                  <button
                    key={plan._id}
                    onClick={() => {
                      setActivePlan(plan);
                      setCompletedTasks({});
                    }}
                    className="w-full text-left rounded-xl p-3 border border-light-border dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-all flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="overflow-hidden">
                      <p className="font-semibold text-light-text-heading dark:text-dark-text-heading truncate">
                        Exam prep ({plan.dailyPlan.length} Days)
                      </p>
                      <p className="text-slate-500 text-[10px] mt-0.5">Exam: {dateStr}</p>
                    </div>
                    <div className="px-2.5 py-1 rounded border border-light-border dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-500 font-semibold shrink-0">
                      Load
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-slate-500">
              No schedules generated yet. Set an exam date and click Generate.
            </div>
          )}
        </div>

      </div>

      {/* Plan Dashboard Grid */}
      <div className="lg:col-span-2 rounded-2xl border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card p-6 shadow-sm min-h-[400px] flex flex-col">
        {activePlan ? (
          <div className="space-y-6 flex-1 flex flex-col">
            
            {/* Plan Header */}
            <div className="flex items-center justify-between border-b border-light-border dark:border-dark-border pb-4 mb-4">
              <div>
                <h4 className="font-bold text-light-text-heading dark:text-dark-text-heading text-lg">AI Revision Calendar</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Exam scheduled: <span className="font-semibold text-brand-primary">{new Date(activePlan.examDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full font-bold">
                <CheckCircle className="h-4 w-4" /> Active Program
              </div>
            </div>

            {/* Daily timeline grid */}
            <div className="flex-1 space-y-6 overflow-y-auto max-h-[500px] pr-1">
              {activePlan.dailyPlan.map((dayPlan, dayIdx) => (
                <div 
                  key={dayPlan.day}
                  className="rounded-2xl border border-light-border dark:border-slate-850 p-5 bg-slate-50 dark:bg-slate-950/40 grid grid-cols-1 md:grid-cols-3 gap-6 hover:border-brand-primary/30 transition-colors"
                >
                  {/* Left segment - Day indicator & Topic */}
                  <div className="md:col-span-1 space-y-2 border-r-0 md:border-r border-light-border dark:border-slate-800 md:pr-4 flex flex-col justify-center">
                    <div className="flex items-center gap-1.5">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary text-white text-[10px] font-bold">
                        {dayPlan.day}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">Day {dayPlan.day} Focus</span>
                    </div>
                    <h5 className="font-bold text-sm text-light-text-heading dark:text-dark-text-heading leading-tight">
                      {dayPlan.topic}
                    </h5>
                  </div>

                  {/* Middle segment - Checklists */}
                  <div className="md:col-span-1 space-y-3">
                    <div className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                      <ListTodo className="h-3.5 w-3.5" /> Study Checklists
                    </div>
                    <ul className="space-y-2 text-xs">
                      {dayPlan.tasks.map((task, tIdx) => {
                        const isChecked = completedTasks[`${dayIdx}-${tIdx}`] || false;
                        return (
                          <li 
                            key={tIdx} 
                            onClick={() => toggleTask(dayIdx, tIdx)}
                            className="flex items-start gap-2.5 cursor-pointer select-none group"
                          >
                            <div className={`mt-0.5 h-4 w-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                              isChecked
                                ? 'border-brand-primary bg-brand-primary text-white'
                                : 'border-slate-400 dark:border-slate-700 group-hover:border-brand-primary'
                            }`}>
                              {isChecked && (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <span className={`leading-snug ${isChecked ? 'line-through text-slate-400 dark:text-slate-650' : 'text-slate-700 dark:text-slate-400'}`}>
                              {task}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* Right segment - Revision Strategy */}
                  <div className="md:col-span-1 space-y-2 bg-brand-primary/5 dark:bg-slate-900/40 rounded-xl p-3.5 flex flex-col justify-center">
                    <div className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-brand-primary" /> Evening Review
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
                      "{dayPlan.revisionSchedule}"
                    </p>
                  </div>

                </div>
              ))}
            </div>

          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500">
            <Calendar className="h-16 w-16 mb-4 text-slate-350 dark:text-slate-700 animate-pulse-slow mx-auto" />
            <h4 className="font-bold text-light-text-heading dark:text-dark-text-heading">No Active Study Calendar</h4>
            <p className="text-xs mt-1 max-w-xs mx-auto">Input your scheduled exam date on the left sidebar and select the syllabus text to generate a customized AI study program.</p>
          </div>
        )}
      </div>

      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage('')}
        />
      )}
    </div>
  );
};

export default StudyPlanner;
