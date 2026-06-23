import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import { Layers, RotateCw, ArrowLeft, ArrowRight, Loader, AlertCircle, Sparkles } from 'lucide-react';
import Toast from '../components/Toast';

const Flashcards = () => {
  const location = useLocation();
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState('');
  const [pastDecks, setPastDecks] = useState([]);
  
  // Current active deck
  const [activeDeck, setActiveDeck] = useState(null);
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Loading states
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
        
        const params = new URLSearchParams(location.search);
        const urlDocId = params.get('docId');
        
        if (urlDocId && response.data.some(d => d._id === urlDocId)) {
          setSelectedDocId(urlDocId);
        } else if (response.data.length > 0) {
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
  }, [location.search]);

  useEffect(() => {
    if (!selectedDocId) {
      setPastDecks([]);
      return;
    }

    const fetchHistory = async () => {
      setIsLoadingHistory(true);
      try {
        const response = await api.get(`/flashcards/document/${selectedDocId}`);
        setPastDecks(response.data);
      } catch (err) {
        console.error('Error loading history:', err.message);
        triggerToast('Failed to load past decks', 'error');
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchHistory();
  }, [selectedDocId]);

  const handleGenerateDeck = async () => {
    if (!selectedDocId) {
      triggerToast('Please select a document first', 'error');
      return;
    }

    setIsGenerating(true);
    setActiveDeck(null);
    setCurrentCardIdx(0);
    setIsFlipped(false);

    try {
      const response = await api.post('/flashcards', { documentId: selectedDocId });
      setActiveDeck(response.data);
      triggerToast('Flashcards generated successfully!', 'success');
    } catch (err) {
      console.error('Error generating cards:', err);
      const msg = err.response?.data?.message || 'Failed to generate flashcards.';
      triggerToast(msg, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNext = () => {
    if (currentCardIdx < activeDeck.cards.length - 1) {
      setIsFlipped(false);
      // Wait for flip back animation to complete before changing card content
      setTimeout(() => {
        setCurrentCardIdx(currentCardIdx + 1);
      }, 150);
    }
  };

  const handleBack = () => {
    if (currentCardIdx > 0) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentCardIdx(currentCardIdx - 1);
      }, 150);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Sidebar Selector */}
      <div className="lg:col-span-1 space-y-6">
        
        {/* Selection Card */}
        <div className="rounded-2xl border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card p-6 shadow-sm">
          <h3 className="text-base font-bold text-light-text-heading dark:text-dark-text-heading mb-4 flex items-center gap-2">
            <Layers className="h-5 w-5 text-brand-primary" />
            Deck Generator
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
              onClick={handleGenerateDeck}
              disabled={isGenerating || !selectedDocId}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-50 text-white font-bold py-3.5 shadow hover:shadow-md transition-all cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  Generating Deck...
                </>
              ) : (
                'Generate Flashcards'
              )}
            </button>
          </div>
        </div>

        {/* Previous Decks */}
        <div className="rounded-2xl border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card p-6 shadow-sm">
          <h3 className="text-sm font-bold text-light-text-heading dark:text-dark-text-heading mb-4 uppercase tracking-wider">
            Previous Decks
          </h3>

          {isLoadingHistory ? (
            <div className="space-y-2">
              <div className="h-10 rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
              <div className="h-10 rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
            </div>
          ) : pastDecks.length > 0 ? (
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {pastDecks.map((deck) => {
                const dateStr = new Date(deck.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric'
                });

                return (
                  <button
                    key={deck._id}
                    onClick={() => {
                      setActiveDeck(deck);
                      setCurrentCardIdx(0);
                      setIsFlipped(false);
                    }}
                    className="w-full text-left rounded-xl p-3 border border-light-border dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-all flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="overflow-hidden">
                      <p className="font-semibold text-light-text-heading dark:text-dark-text-heading truncate">
                        Deck ({deck.cards.length} Cards)
                      </p>
                      <p className="text-slate-500 text-[10px] mt-0.5">{dateStr}</p>
                    </div>
                    <div className="px-2.5 py-1 rounded border border-light-border dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-500 font-semibold shrink-0">
                      View
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-slate-500">
              No flashcard decks generated yet. Select a document above to generate one.
            </div>
          )}
        </div>

      </div>

      {/* Card Flipper viewport */}
      <div className="lg:col-span-2 rounded-2xl border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card p-6 shadow-sm min-h-[400px] flex flex-col items-center justify-center">
        {activeDeck ? (
          <div className="w-full max-w-md space-y-8 flex flex-col items-center">
            
            {/* Card Counter Badge */}
            <div className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 font-bold text-xs border border-light-border dark:border-slate-700 text-slate-600 dark:text-slate-400">
              Card {currentCardIdx + 1} of {activeDeck.cards.length}
            </div>

            {/* 3D Card Flipper */}
            <div 
              onClick={() => setIsFlipped(!isFlipped)}
              className="w-full h-64 cursor-pointer relative rounded-3xl border border-light-border dark:border-slate-850 transition-all duration-500 shadow-md hover:shadow-lg focus:outline-none flex items-center justify-center bg-slate-50/50 dark:bg-slate-950/20 overflow-hidden"
              style={{
                perspective: '1000px'
              }}
            >
              {/* Outer Card Wrapper that rotates */}
              <div 
                className="w-full h-full transition-transform duration-500 relative"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(180deg)' : 'none'
                }}
              >
                
                {/* Front Side */}
                <div 
                  className="absolute inset-0 p-8 flex flex-col items-center justify-center bg-white dark:bg-dark-card rounded-3xl border border-light-border dark:border-dark-border"
                  style={{
                    backfaceVisibility: 'hidden'
                  }}
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary mb-3">Front (Question / Term)</span>
                  <p className="text-center font-bold text-lg md:text-xl text-light-text-heading dark:text-dark-text-heading leading-relaxed">
                    {activeDeck.cards[currentCardIdx].question}
                  </p>
                  <div className="mt-6 flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase select-none">
                    <RotateCw className="h-3 w-3" /> Click to Flip Card
                  </div>
                </div>

                {/* Back Side */}
                <div 
                  className="absolute inset-0 p-8 flex flex-col items-center justify-center bg-brand-primary/5 dark:bg-brand-primary/10 rounded-3xl border border-brand-primary/20"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-secondary mb-3">Back (Answer / Definition)</span>
                  <p className="text-center text-sm md:text-base text-light-text-heading dark:text-dark-text-heading leading-relaxed font-semibold">
                    {activeDeck.cards[currentCardIdx].answer}
                  </p>
                  <div className="mt-6 flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase select-none">
                    <RotateCw className="h-3 w-3" /> Click to Flip Card
                  </div>
                </div>

              </div>
            </div>

            {/* Navigation controls */}
            <div className="flex gap-4 items-center">
              <button
                onClick={handleBack}
                disabled={currentCardIdx === 0}
                className="rounded-xl p-3 border border-light-border dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-850 disabled:opacity-40 transition-all shadow-sm"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              <button
                onClick={() => setIsFlipped(!isFlipped)}
                className="rounded-xl bg-slate-900 dark:bg-slate-850 hover:bg-slate-800 dark:hover:bg-slate-800 border border-slate-350 dark:border-slate-800 text-white px-6 py-3 text-xs font-bold transition-all flex items-center gap-1.5 shadow"
              >
                <RotateCw className="h-4 w-4" />
                Flip Card
              </button>

              <button
                onClick={handleNext}
                disabled={currentCardIdx === activeDeck.cards.length - 1}
                className="rounded-xl p-3 border border-light-border dark:border-dark-border hover:bg-slate-50 dark:hover:bg-slate-850 disabled:opacity-40 transition-all shadow-sm"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>

          </div>
        ) : (
          <div className="text-center text-slate-500">
            <Layers className="h-16 w-16 mb-4 text-slate-350 dark:text-slate-700 animate-pulse-slow mx-auto" />
            <h4 className="font-bold text-light-text-heading dark:text-dark-text-heading">No Active Flashcard Deck</h4>
            <p className="text-xs mt-1 max-w-xs mx-auto">Select a document from the left selection pane and click Generate Flashcards to compile a double-sided study deck.</p>
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

export default Flashcards;
