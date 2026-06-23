import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Notebook, Award, ShieldAlert, Loader, AlertCircle, ChevronDown, ChevronUp, Sparkles, BookOpen } from 'lucide-react';
import Toast from '../components/Toast';

const StudyNotes = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState('');
  const [activeTab, setActiveTab] = useState('notes'); // 'notes', 'viva', 'topics'

  // Tab Data States
  const [notesData, setNotesData] = useState(null);
  const [vivaQuestions, setVivaQuestions] = useState([]);
  const [importantTopics, setImportantTopics] = useState([]);

  // Accordion state for Viva Questions
  const [expandedVivaIdx, setExpandedVivaIdx] = useState(null);

  // States
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);
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

  const handleGenerate = async (tabName = activeTab) => {
    if (!selectedDocId) {
      triggerToast('Please select a document first', 'error');
      return;
    }

    setIsGenerating(true);
    setExpandedVivaIdx(null);

    try {
      if (tabName === 'notes') {
        const response = await api.post('/study-notes/generate', { documentId: selectedDocId });
        setNotesData(response.data);
        triggerToast('Study Notes compiled successfully!', 'success');
      } else if (tabName === 'viva') {
        const response = await api.post('/study-notes/viva', { documentId: selectedDocId });
        setVivaQuestions(response.data);
        triggerToast('Top 20 Viva Questions generated!', 'success');
      } else if (tabName === 'topics') {
        const response = await api.post('/study-notes/topics', { documentId: selectedDocId });
        setImportantTopics(response.data);
        triggerToast('Important topics detected!', 'success');
      }
    } catch (err) {
      console.error(`Error generating ${tabName}:`, err);
      const msg = err.response?.data?.message || `Failed to generate ${tabName}.`;
      triggerToast(msg, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // Reset tab values when changing documents to prevent cross-document confusion
  useEffect(() => {
    setNotesData(null);
    setVivaQuestions([]);
    setImportantTopics([]);
  }, [selectedDocId]);

  // Handle Tab Switch
  const switchTab = (tab) => {
    setActiveTab(tab);
    // If no data exists for that tab, trigger generation automatically
    if (selectedDocId) {
      if (tab === 'notes' && !notesData) handleGenerate('notes');
      if (tab === 'viva' && vivaQuestions.length === 0) handleGenerate('viva');
      if (tab === 'topics' && importantTopics.length === 0) handleGenerate('topics');
    }
  };

  // Auto trigger first load when document selected
  useEffect(() => {
    if (selectedDocId && activeTab === 'notes' && !notesData) {
      handleGenerate('notes');
    }
  }, [selectedDocId]);

  return (
    <div className="space-y-8">
      
      {/* Control Selector bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border border-light-border dark:border-dark-border rounded-2xl p-4 bg-light-card dark:bg-dark-card shadow-sm">
        
        {/* Document Select */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <BookOpen className="h-5 w-5 text-brand-primary shrink-0" />
          {isLoadingDocs ? (
            <div className="h-10 w-48 rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ) : documents.length > 0 ? (
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-light-border dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:border-brand-primary text-light-text-heading dark:text-dark-text-heading w-full md:w-64"
            >
              {documents.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.originalname}
                </option>
              ))}
            </select>
          ) : (
            <span className="text-xs text-rose-500 font-semibold">No materials uploaded. Upload PDF.</span>
          )}
        </div>

        {/* Action Toggles */}
        <div className="flex bg-slate-100 dark:bg-slate-900 rounded-xl p-1 w-full md:w-auto overflow-x-auto">
          {[
            { id: 'notes', label: 'AI Notes', icon: <Notebook className="h-4 w-4" /> },
            { id: 'viva', label: 'Viva Q&A (20)', icon: <Award className="h-4 w-4" /> },
            { id: 'topics', label: 'Topics Detector', icon: <ShieldAlert className="h-4 w-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => switchTab(tab.id)}
              className={`flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex-1 md:flex-none ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-dark-card text-brand-primary shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Generate/Refresh Button */}
        <button
          onClick={() => handleGenerate()}
          disabled={isGenerating || !selectedDocId}
          className="flex items-center gap-1.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-50 text-white font-bold px-4 py-2.5 text-xs shadow-md transition-all w-full md:w-auto shrink-0 justify-center"
        >
          {isGenerating ? (
            <>
              <Loader className="h-4.5 w-4.5 animate-spin" />
              Compiling...
            </>
          ) : (
            <>
              <Sparkles className="h-4.5 w-4.5 fill-white" />
              Regenerate AI Content
            </>
          )}
        </button>
      </div>

      {/* Main Output Box */}
      <div className="rounded-2xl border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card p-6 shadow-sm min-h-[400px]">
        
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center h-[350px] space-y-3">
            <Loader className="h-10 w-10 text-brand-primary animate-spin" />
            <h4 className="font-bold text-sm text-light-text-heading dark:text-dark-text-heading">AI Engine Processing Document</h4>
            <p className="text-xs text-slate-500">Retrieving vector contexts and structuring markdown summary profiles...</p>
          </div>
        ) : selectedDocId ? (
          
          /* Tab 1: AI Study Notes */
          activeTab === 'notes' && (
            notesData ? (
              <div className="space-y-8 animate-fade-in text-left">
                {/* Short summary banner */}
                <div className="rounded-2xl bg-brand-primary/5 dark:bg-brand-primary/10 border border-brand-primary/15 p-6">
                  <h4 className="font-bold text-brand-primary text-xs uppercase tracking-wider mb-2">Short Abstract</h4>
                  <p className="text-sm font-medium leading-relaxed text-light-text-heading dark:text-dark-text-heading">
                    {notesData.shortSummary}
                  </p>
                </div>

                {/* Grid for Detailed summary & key topics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Detailed Summary bulletpoints */}
                  <div className="md:col-span-2 space-y-4">
                    <h4 className="font-bold text-sm text-light-text-heading dark:text-dark-text-heading border-b border-light-border dark:border-dark-border pb-2 flex items-center gap-1.5">
                      Detailed Summary Points
                    </h4>
                    <ul className="space-y-3 text-xs leading-relaxed text-slate-700 dark:text-slate-400">
                      {notesData.detailedSummary.map((point, idx) => (
                        <li key={idx} className="flex gap-2 items-start">
                          <span className="h-5 w-5 rounded bg-brand-primary/10 text-brand-primary font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">{idx + 1}</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Core Topics Checklist */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-sm text-light-text-heading dark:text-dark-text-heading border-b border-light-border dark:border-dark-border pb-2">
                      Key Core Syllabus
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {notesData.keyTopics.map((topic, idx) => (
                        <span key={idx} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold px-3 py-1.5 rounded-xl text-[10px] border border-light-border dark:border-slate-750">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Important definitions definitions */}
                <div className="space-y-4">
                  <h4 className="font-bold text-sm text-light-text-heading dark:text-dark-text-heading border-b border-light-border dark:border-dark-border pb-2">
                    Key Definitions Glossary
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {notesData.importantDefinitions.map((def, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-light-border dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/20">
                        <h5 className="font-bold text-brand-secondary text-xs mb-1.5">{def.term}</h5>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
                          "{def.definition}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-slate-500">Click Generate above to load Study Notes.</div>
            )
          ) ||

          /* Tab 2: Viva Q&A Accordion */
          activeTab === 'viva' && (
            vivaQuestions.length > 0 ? (
              <div className="space-y-3 animate-fade-in text-left">
                <div className="mb-4">
                  <h4 className="font-bold text-sm text-light-text-heading dark:text-dark-text-heading">Top 20 Viva Questions</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Click on a question to expand the model professor answer</p>
                </div>
                
                {vivaQuestions.map((viva, idx) => {
                  const isExpanded = expandedVivaIdx === idx;
                  return (
                    <div 
                      key={idx}
                      className="rounded-xl border border-light-border dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/20 overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedVivaIdx(isExpanded ? null : idx)}
                        className="w-full flex items-center justify-between gap-4 p-4 text-xs font-bold text-left text-light-text-heading dark:text-dark-text-heading"
                      >
                        <span className="flex-1">Q{idx + 1}: {viva.question}</span>
                        {isExpanded ? <ChevronUp className="h-4 w-4 shrink-0" /> : <ChevronDown className="h-4 w-4 shrink-0" />}
                      </button>
                      
                      {isExpanded && (
                        <div className="px-4 pb-4 pt-1 text-xs leading-relaxed text-slate-650 dark:text-slate-400 border-t border-light-border/60 dark:border-slate-850/80 bg-white dark:bg-dark-card/30">
                          <span className="block font-bold text-brand-secondary text-[9px] uppercase tracking-wider mb-1.5">Model Academic Answer</span>
                          <p className="italic">"{viva.answer}"</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-16 text-center text-slate-500">No Viva questions generated yet. Click compile above.</div>
            )
          ) ||

          /* Tab 3: Important Topics detector */
          activeTab === 'topics' && (
            importantTopics.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in text-left">
                {importantTopics.map((topic, idx) => {
                  
                  const importanceStyles = {
                    High: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
                    Medium: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
                    Low: 'bg-slate-200 text-slate-600 border-slate-350 dark:bg-slate-800 dark:text-slate-350'
                  };

                  return (
                    <div key={idx} className="rounded-2xl border border-light-border dark:border-slate-850 p-5 bg-white dark:bg-dark-card/50 flex flex-col justify-between space-y-4 hover:border-brand-primary/20 transition-all shadow-sm">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-3">
                          <h5 className="font-bold text-sm text-light-text-heading dark:text-dark-text-heading">{topic.topic}</h5>
                          <span className={`px-2 py-0.5 rounded border text-[9px] font-bold ${importanceStyles[topic.importance]}`}>
                            {topic.importance} Importance
                          </span>
                        </div>
                        <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed">
                          {topic.description}
                        </p>
                      </div>

                      {/* Subtopics tags */}
                      {topic.subtopics && topic.subtopics.length > 0 && (
                        <div className="border-t border-light-border dark:border-slate-850/80 pt-3">
                          <span className="block text-[9px] font-bold text-slate-500 uppercase mb-2">Detailed syllabus components:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {topic.subtopics.map((sub, sIdx) => (
                              <span key={sIdx} className="bg-slate-100 dark:bg-slate-800/80 px-2 py-1 rounded-lg text-[9px] font-medium text-slate-600 dark:text-slate-400">
                                {sub}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-16 text-center text-slate-500">No core topics detected yet. Click compile above.</div>
            )
          )

        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500">
            <Notebook className="h-16 w-16 mb-4 text-slate-350 dark:text-slate-700 animate-pulse-slow mx-auto" />
            <h4 className="font-bold text-light-text-heading dark:text-dark-text-heading">No Active Study Profile</h4>
            <p className="text-xs mt-1 max-w-xs mx-auto">Upload a syllabus file in the Materials tab and choose it from the header dropdown to run AI study analyses.</p>
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

export default StudyNotes;
