import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import { Send, Bot, BookOpenCheck, Layers, AlertCircle, Paperclip, ChevronDown } from 'lucide-react';
import Toast from '../components/Toast';
import { SkeletonChat } from '../components/SkeletonLoader';

const Chat = () => {
  const location = useLocation();
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [selectedSources, setSelectedSources] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

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
      } catch {
        triggerToast('Could not load documents', 'error');
      } finally {
        setIsLoadingDocs(false);
      }
    };
    fetchDocs();
  }, [location.search]);

  useEffect(() => {
    if (!selectedDocId) { setMessages([]); return; }
    const fetchHistory = async () => {
      try {
        const response = await api.get(`/chat/${selectedDocId}`);
        setMessages(response.data.map(c => ({
          _id: c._id, question: c.question, answer: c.answer, sources: c.sources || [],
        })));
        setSelectedSources(null);
      } catch {
        triggerToast('Failed to load chat history', 'error');
      }
    };
    fetchHistory();
  }, [selectedDocId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!selectedDocId) { triggerToast('Please select a document first', 'error'); return; }
    if (!inputMessage.trim()) return;

    const userMsg = inputMessage;
    setInputMessage('');
    setIsSending(true);

    try {
      const response = await api.post('/chat', { documentId: selectedDocId, question: userMsg });
      setMessages(prev => [...prev, {
        _id: response.data._id,
        question: response.data.question,
        answer: response.data.answer,
        sources: response.data.sources || [],
      }]);
    } catch (err) {
      triggerToast(err.response?.data?.message || 'Failed to get AI response.', 'error');
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  const selectedDoc = documents.find(d => d._id === selectedDocId);

  return (
    <div className="flex gap-5 h-[calc(100vh-7rem)]">

      {/* === DOCUMENT SIDEBAR === */}
      <div className="hidden lg:flex w-64 shrink-0 flex-col rounded-2xl border border-slate-200 dark:border-[#1e2d45] bg-white dark:bg-[#0e1525] overflow-hidden"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
      >
        <div className="p-4 border-b border-slate-100 dark:border-[#1e2d45]">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">
            Select Document
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {isLoadingDocs ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-12 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
              ))}
            </div>
          ) : documents.length > 0 ? (
            documents.map((doc) => (
              <button
                key={doc._id}
                onClick={() => setSelectedDocId(doc._id)}
                className={`w-full text-left rounded-xl px-3 py-2.5 flex items-center gap-2.5 transition-all group ${
                  selectedDocId === doc._id
                    ? 'bg-violet-50 dark:bg-violet-950/25 border border-violet-200 dark:border-violet-800/30 text-violet-700 dark:text-violet-400'
                    : 'border border-transparent hover:bg-slate-50 dark:hover:bg-[#141e33] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors ${
                  selectedDocId === doc._id ? 'bg-violet-100 dark:bg-violet-900/40' : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-violet-100 dark:group-hover:bg-violet-900/20'
                }`}>
                  <BookOpenCheck className={`h-3.5 w-3.5 ${selectedDocId === doc._id ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400 dark:text-slate-500'}`} />
                </div>
                <span className="text-xs font-semibold truncate">{doc.originalname}</span>
              </button>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-8 px-2">
              <AlertCircle className="h-8 w-8 text-slate-300 dark:text-slate-700 mb-2" />
              <p className="text-xs font-medium text-slate-500 dark:text-slate-500">No documents yet</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-600 mt-1">Upload a PDF in Materials page</p>
            </div>
          )}
        </div>
      </div>

      {/* === MAIN CHAT AREA === */}
      <div className={`flex-1 flex flex-col rounded-2xl border border-slate-200 dark:border-[#1e2d45] bg-white dark:bg-[#0e1525] overflow-hidden ${selectedSources ? '' : ''}`}
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
      >
        {/* Chat Header */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-100 dark:border-[#1e2d45]">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-md">
            <Bot className="h-4.5 w-4.5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 dark:text-white">AI Study Assistant</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-600 truncate">
              {selectedDoc ? `Chatting with: ${selectedDoc.originalname}` : 'Select a document to begin'}
            </p>
          </div>
          {/* Mobile doc selector */}
          <div className="lg:hidden">
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#141e33] text-slate-800 dark:text-white px-2 py-1.5 outline-none focus:border-violet-500"
            >
              <option value="">Select doc...</option>
              {documents.map(d => <option key={d._id} value={d._id}>{d.originalname}</option>)}
            </select>
          </div>
        </div>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          {!selectedDocId ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto py-12">
              <div className="h-16 w-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                <BookOpenCheck className="h-8 w-8 text-slate-300 dark:text-slate-600" />
              </div>
              <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-1">No Document Selected</h4>
              <p className="text-xs text-slate-400 dark:text-slate-600">Select a PDF from the sidebar to start an AI-powered Q&A session.</p>
            </div>
          ) : messages.length === 0 && !isSending ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto py-12">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/20 border border-violet-100 dark:border-violet-900/30 flex items-center justify-center mb-4">
                <Bot className="h-8 w-8 text-violet-500" />
              </div>
              <h4 className="font-bold text-slate-800 dark:text-white mb-2">Chat with Your Document</h4>
              <p className="text-xs text-slate-500 dark:text-slate-500 mb-5">
                Ask questions and I'll answer using only the content of your PDF.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {['Summarize key points', 'List main concepts', 'Explain section 1'].map(s => (
                  <button
                    key={s}
                    onClick={() => setInputMessage(s)}
                    className="rounded-xl border border-violet-200 dark:border-violet-800/40 bg-violet-50 dark:bg-violet-950/20 px-3 py-1.5 text-xs font-medium text-violet-700 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={msg._id || idx} className="space-y-3 animate-fade-in">
                {/* User Message */}
                <div className="flex gap-3 justify-end">
                  <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-gradient-to-br from-violet-600 to-purple-600 px-4 py-3 text-sm text-white shadow-md shadow-violet-500/15">
                    {msg.question}
                  </div>
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-md select-none">
                    U
                  </div>
                </div>

                {/* AI Message */}
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-600 to-purple-700 text-white flex items-center justify-center shrink-0 shadow-md select-none">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="max-w-[80%] space-y-2">
                    <div className="rounded-2xl rounded-tl-sm border border-slate-200 dark:border-[#1e2d45] bg-slate-50 dark:bg-[#141e33] px-4 py-3 text-sm text-slate-800 dark:text-slate-200 leading-relaxed shadow-sm">
                      <p className="whitespace-pre-wrap">{msg.answer}</p>
                    </div>
                    {msg.sources?.length > 0 && (
                      <button
                        onClick={() => setSelectedSources(selectedSources === msg.sources ? null : msg.sources)}
                        className="flex items-center gap-1.5 text-[11px] text-violet-600 dark:text-violet-400 font-bold hover:underline underline-offset-2"
                      >
                        <Layers className="h-3 w-3" />
                        {selectedSources === msg.sources ? 'Hide' : 'Show'} {msg.sources.length} source chunk{msg.sources.length > 1 ? 's' : ''}
                        <ChevronDown className={`h-3 w-3 transition-transform ${selectedSources === msg.sources ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}

          {isSending && <SkeletonChat />}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="px-4 py-3 border-t border-slate-100 dark:border-[#1e2d45] bg-slate-50/50 dark:bg-[#0e1525]">
          <form onSubmit={handleSend} className="flex gap-2.5 items-end">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={!selectedDocId || isSending}
                placeholder={selectedDocId ? "Ask a question about the document..." : "Select a document to begin..."}
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#141e33] px-4 py-3 pr-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 outline-none transition-all disabled:opacity-50"
              />
            </div>
            <button
              type="submit"
              disabled={!selectedDocId || isSending || !inputMessage.trim()}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white disabled:opacity-40 transition-all hover:scale-105 active:scale-95 shadow-lg"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 4px 12px rgba(124, 58, 237, 0.35)' }}
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          </form>
        </div>
      </div>

      {/* === RAG SOURCES PANEL === */}
      {selectedSources && (
        <div className="hidden lg:flex w-72 flex-col rounded-2xl border border-slate-200 dark:border-[#1e2d45] bg-white dark:bg-[#0e1525] overflow-hidden"
          style={{ animation: 'slide-in-right 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
        >
          <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-[#1e2d45]">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-violet-500" />
              <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                Source Chunks
              </h3>
            </div>
            <button
              onClick={() => setSelectedSources(null)}
              className="text-xs font-bold text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
            >
              Close
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {selectedSources.map((source, idx) => (
              <div key={idx} className="rounded-xl border border-slate-200 dark:border-[#1e2d45] bg-slate-50 dark:bg-[#141e33] p-3 relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider">Chunk {idx + 1}</span>
                  <span className="text-[10px] font-bold rounded-full bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400 px-2 py-0.5 border border-violet-200 dark:border-violet-800/30">
                    {Math.round(source.score * 100)}% match
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed italic">"{source.text}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
      )}
    </div>
  );
};

export default Chat;
