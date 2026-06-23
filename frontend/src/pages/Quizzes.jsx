import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { GraduationCap, FileText, CheckCircle2, XCircle, Loader, RotateCcw, AlertCircle, Sparkles } from 'lucide-react';
import Toast from '../components/Toast';
import { SkeletonTable } from '../components/SkeletonLoader';

const Quizzes = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState('');
  const [pastQuizzes, setPastQuizzes] = useState([]);
  
  // Current active quiz
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { questionIdx: selectedOption }
  const [quizFinished, setQuizFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(null);

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
      setPastQuizzes([]);
      return;
    }

    const fetchHistory = async () => {
      setIsLoadingHistory(true);
      try {
        const response = await api.get(`/quizzes/document/${selectedDocId}`);
        setPastQuizzes(response.data);
      } catch (err) {
        console.error('Error fetching quiz history:', err.message);
        triggerToast('Failed to load past quizzes', 'error');
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchHistory();
  }, [selectedDocId]);

  const handleGenerateQuiz = async () => {
    if (!selectedDocId) {
      triggerToast('Please select a document first', 'error');
      return;
    }

    setIsGenerating(true);
    setActiveQuiz(null);
    setQuizFinished(false);
    setFinalScore(null);
    setSelectedAnswers({});
    setCurrentQuestionIdx(0);

    try {
      const response = await api.post('/quizzes', { documentId: selectedDocId });
      setActiveQuiz(response.data);
      triggerToast('New quiz generated successfully!', 'success');
    } catch (err) {
      console.error('Error generating quiz:', err);
      const msg = err.response?.data?.message || 'Failed to generate quiz. Try again.';
      triggerToast(msg, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOptionSelect = (option) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIdx]: option,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIdx < activeQuiz.questions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(currentQuestionIdx - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    // Grade the quiz
    let correctCount = 0;
    activeQuiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correctCount++;
      }
    });

    setFinalScore(correctCount);
    setQuizFinished(true);

    // Submit score to backend
    try {
      await api.post(`/quizzes/${activeQuiz._id}/score`, { score: correctCount });
      triggerToast(`Quiz completed! Score: ${correctCount}/${activeQuiz.questions.length}`, 'success');
      
      // Refresh history list
      const response = await api.get(`/quizzes/document/${selectedDocId}`);
      setPastQuizzes(response.data);
    } catch (err) {
      console.error('Error submitting quiz score:', err.message);
      triggerToast('Failed to submit score to dashboard', 'error');
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setCurrentQuestionIdx(0);
    setQuizFinished(false);
    setFinalScore(null);
  };

  // Grade badge calculator
  const getGradeBadge = (score, max) => {
    const pct = (score / max) * 100;
    if (pct >= 90) return { label: 'Grade A', style: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' };
    if (pct >= 80) return { label: 'Grade B', style: 'bg-blue-500/10 text-blue-600 border-blue-500/20' };
    if (pct >= 70) return { label: 'Grade C', style: 'bg-amber-500/10 text-amber-600 border-amber-500/20' };
    return { label: 'Grade F', style: 'bg-rose-500/10 text-rose-600 border-rose-500/20' };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Settings Selector */}
      <div className="lg:col-span-1 space-y-6">
        
        {/* Selection Card */}
        <div className="rounded-2xl border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card p-6 shadow-sm">
          <h3 className="text-base font-bold text-light-text-heading dark:text-dark-text-heading mb-4 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-brand-primary" />
            Quiz Generator
          </h3>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Study Material
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

            <button
              onClick={handleGenerateQuiz}
              disabled={isGenerating || !selectedDocId}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-50 text-white font-bold py-3.5 shadow hover:shadow-md transition-all cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  Generating Quiz...
                </>
              ) : (
                'Generate 10 MCQ Quiz'
              )}
            </button>
          </div>
        </div>

        {/* Past Quizzes */}
        <div className="rounded-2xl border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card p-6 shadow-sm">
          <h3 className="text-sm font-bold text-light-text-heading dark:text-dark-text-heading mb-4 uppercase tracking-wider">
            Previous Evaluations
          </h3>

          {isLoadingHistory ? (
            <div className="space-y-2">
              <div className="h-10 rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
              <div className="h-10 rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
            </div>
          ) : pastQuizzes.length > 0 ? (
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {pastQuizzes.map((quiz) => {
                const badge = quiz.score !== null ? getGradeBadge(quiz.score, quiz.maxScore) : null;
                const dateStr = new Date(quiz.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric'
                });

                return (
                  <button
                    key={quiz._id}
                    onClick={() => {
                      setActiveQuiz(quiz);
                      setQuizFinished(quiz.score !== null);
                      setFinalScore(quiz.score);
                      setSelectedAnswers({});
                      setCurrentQuestionIdx(0);
                    }}
                    className="w-full text-left rounded-xl p-3 border border-light-border dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-all flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="overflow-hidden">
                      <p className="font-semibold text-light-text-heading dark:text-dark-text-heading truncate">
                        Quiz ({quiz.questions.length} Items)
                      </p>
                      <p className="text-slate-500 text-[10px] mt-0.5">{dateStr}</p>
                    </div>
                    {quiz.score !== null ? (
                      <div className={`px-2 py-1 rounded border font-semibold ${badge.style}`}>
                        {quiz.score}/{quiz.maxScore}
                      </div>
                    ) : (
                      <div className="px-2 py-1 rounded border border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-500 font-medium">
                        Pending
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-slate-500">
              No quiz logs recorded. Generate a quiz above to start practicing.
            </div>
          )}
        </div>

      </div>

      {/* Quiz Area */}
      <div className="lg:col-span-2 rounded-2xl border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card p-6 shadow-sm min-h-[400px] flex flex-col">
        {activeQuiz ? (
          !quizFinished ? (
            // Quiz taking mode
            <div className="flex-1 flex flex-col">
              
              {/* Quiz Header Info */}
              <div className="flex items-center justify-between border-b border-light-border dark:border-dark-border pb-4 mb-6">
                <div>
                  <h4 className="font-bold text-light-text-heading dark:text-dark-text-heading text-lg">Active Quiz Session</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Please choose the correct option for each question</p>
                </div>
                <div className="rounded-full bg-brand-primary/10 text-brand-primary px-3 py-1 font-bold text-xs border border-brand-primary/20">
                  Question {currentQuestionIdx + 1} of {activeQuiz.questions.length}
                </div>
              </div>

              {/* Question Text */}
              <div className="flex-1 space-y-6">
                <h3 className="text-base font-bold text-light-text-heading dark:text-dark-text-heading leading-relaxed">
                  {activeQuiz.questions[currentQuestionIdx].question}
                </h3>

                {/* Option list */}
                <div className="space-y-3">
                  {activeQuiz.questions[currentQuestionIdx].options.map((option, idx) => {
                    const isSelected = selectedAnswers[currentQuestionIdx] === option;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleOptionSelect(option)}
                        className={`w-full text-left rounded-xl p-4 text-sm font-semibold border transition-all flex items-center gap-3 ${
                          isSelected
                            ? 'bg-brand-primary/15 border-brand-primary text-brand-primary shadow-sm'
                            : 'border-light-border dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/40 text-slate-700 dark:text-slate-400'
                        }`}
                      >
                        <div className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 text-xs ${
                          isSelected
                            ? 'border-brand-primary bg-brand-primary text-white font-bold'
                            : 'border-slate-400 dark:border-slate-700'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span>{option}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation controls */}
              <div className="flex items-center justify-between border-t border-light-border dark:border-dark-border pt-6 mt-8">
                <button
                  onClick={handleBack}
                  disabled={currentQuestionIdx === 0}
                  className="rounded-xl border border-light-border dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-900/60 px-5 py-2.5 text-xs font-bold disabled:opacity-40 transition-all"
                >
                  Previous Question
                </button>

                {currentQuestionIdx === activeQuiz.questions.length - 1 ? (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(selectedAnswers).length < activeQuiz.questions.length}
                    className="rounded-xl bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-50 text-white px-6 py-2.5 text-xs font-bold shadow hover:shadow-md transition-all cursor-pointer"
                  >
                    Submit Quiz Evaluation
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white px-5 py-2.5 text-xs font-bold transition-all"
                  >
                    Next Question
                  </button>
                )}
              </div>

            </div>
          ) : (
            // Quiz finished / results mode
            <div className="flex-1 flex flex-col">
              
              {/* Score summary panel */}
              <div className="text-center py-8 border-b border-light-border dark:border-dark-border mb-6">
                <GraduationCap className="h-12 w-12 mx-auto text-brand-primary mb-3" />
                <h3 className="text-2xl font-extrabold text-light-text-heading dark:text-dark-text-heading">Quiz Assessment Complete</h3>
                
                <div className="mt-4 flex items-center justify-center gap-4">
                  <div className="text-center">
                    <span className="block text-4xl font-extrabold bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
                      {finalScore} / {activeQuiz.questions.length}
                    </span>
                    <span className="text-xs text-slate-500">Correct Answers</span>
                  </div>
                  <div className="h-8 w-px bg-slate-350 dark:bg-slate-800" />
                  <div className="text-left">
                    <span className={`inline-block px-3 py-1 rounded-full border text-xs font-semibold ${getGradeBadge(finalScore, activeQuiz.questions.length).style}`}>
                      {getGradeBadge(finalScore, activeQuiz.questions.length).label}
                    </span>
                    <span className="block text-[10px] text-slate-500 mt-1">Status Saved</span>
                  </div>
                </div>

                <div className="mt-6 flex justify-center gap-3">
                  <button
                    onClick={handleRetake}
                    className="flex items-center gap-1.5 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card hover:bg-slate-50 dark:hover:bg-slate-850 px-5 py-2.5 text-xs font-bold transition-all shadow-sm"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Retake Quiz
                  </button>
                  <button
                    onClick={handleGenerateQuiz}
                    className="flex items-center gap-1.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover px-5 py-2.5 text-xs font-bold text-white shadow transition-all"
                  >
                    Generate New Quiz
                  </button>
                </div>
              </div>

              {/* Questions correction feedback review */}
              <div className="flex-1 space-y-6 overflow-y-auto max-h-[350px] pr-1">
                <h4 className="font-bold text-sm text-light-text-heading dark:text-dark-text-heading uppercase tracking-wider mb-4">
                  Review Assessment Answers
                </h4>
                {activeQuiz.questions.map((q, idx) => {
                  const selected = selectedAnswers[idx];
                  const correct = q.correctAnswer;
                  const isCorrect = selected === correct || (finalScore !== null && selected === undefined); // fallback for review mode from past logs where selected is undefined

                  return (
                    <div key={idx} className="rounded-xl border border-light-border dark:border-slate-850 p-4 space-y-3 bg-slate-50 dark:bg-slate-950/40">
                      <div className="flex items-start justify-between gap-3">
                        <h5 className="font-semibold text-sm text-light-text-heading dark:text-dark-text-heading">
                          {idx + 1}. {q.question}
                        </h5>
                        {isCorrect ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-rose-500 shrink-0" />
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                        {q.options.map((option, oIdx) => {
                          const optionChar = String.fromCharCode(65 + oIdx);
                          let optionStyle = 'border-slate-200 dark:border-slate-800 text-slate-500';
                          
                          if (option === correct) {
                            optionStyle = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-semibold';
                          } else if (option === selected && !isCorrect) {
                            optionStyle = 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-400 font-semibold';
                          }

                          return (
                            <div key={oIdx} className={`rounded-lg border p-2.5 flex items-center gap-2 ${optionStyle}`}>
                              <span className="font-bold">{optionChar}.</span>
                              <span>{option}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500">
            <GraduationCap className="h-16 w-16 mb-4 text-slate-350 dark:text-slate-700 animate-pulse-slow" />
            <h4 className="font-bold text-light-text-heading dark:text-dark-text-heading">No Active Quiz Session</h4>
            <p className="text-xs mt-1 max-w-xs mx-auto">Select an uploaded PDF from the side menu and click Generate to parse it into an interactive 10-MCQ assessment.</p>
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

export default Quizzes;
