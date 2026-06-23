import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { Upload, Trash2, FileText, Loader, AlertCircle, CloudUpload, CheckCircle } from 'lucide-react';
import Toast from '../components/Toast';
import { SkeletonTable } from '../components/SkeletonLoader';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const triggerToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
  };

  const fetchDocuments = async () => {
    try {
      const response = await api.get('/documents');
      setDocuments(response.data);
    } catch (err) {
      triggerToast('Failed to retrieve documents', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchDocuments(); }, []);

  const processFile = async (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      triggerToast('Only PDF documents are supported!', 'error');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      triggerToast('File exceeds 10MB limit', 'error');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    setIsUploading(true);
    setUploadProgress('Extracting text and generating vector embeddings...');
    try {
      const response = await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      triggerToast(response.data.message || 'File indexed successfully!', 'success');
      fetchDocuments();
    } catch (err) {
      const msg = err.response?.data?.message || 'File upload and parsing failed.';
      triggerToast(msg, 'error');
    } finally {
      setIsUploading(false);
      setUploadProgress('');
      if (fileInputRef.current) fileInputRef.current.value = null;
    }
  };

  const handleFileUpload = (e) => processFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files[0]);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this document? This will remove all associated chat history, quizzes, and flashcards.')) return;
    try {
      const response = await api.delete(`/documents/${id}`);
      triggerToast(response.data.message || 'Document deleted', 'success');
      setDocuments(documents.filter((doc) => doc._id !== id));
    } catch (err) {
      triggerToast('Failed to delete document', 'error');
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '—';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* === UPLOAD ZONE === */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 p-10 text-center cursor-pointer group ${
          isDragging
            ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/20 scale-[1.01]'
            : isUploading
            ? 'border-violet-400/50 bg-violet-50/50 dark:bg-violet-950/10'
            : 'border-slate-300 dark:border-[#1e2d45] bg-white dark:bg-[#0e1525] hover:border-violet-400 dark:hover:border-violet-700 hover:bg-violet-50/50 dark:hover:bg-violet-950/10'
        }`}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Upload Icon */}
        <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl transition-all ${
          isDragging ? 'bg-violet-100 dark:bg-violet-900/30 scale-110' : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-violet-100 dark:group-hover:bg-violet-900/20 group-hover:scale-105'
        }`}>
          {isUploading ? (
            <Loader className="h-8 w-8 text-violet-600 animate-spin" />
          ) : isDragging ? (
            <CloudUpload className="h-8 w-8 text-violet-600" />
          ) : (
            <Upload className="h-8 w-8 text-slate-400 dark:text-slate-500 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors" />
          )}
        </div>

        {isUploading ? (
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Processing Document...</h3>
            <p className="text-sm text-violet-600 dark:text-violet-400">{uploadProgress}</p>
            <div className="mt-4 mx-auto max-w-xs h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-500 animate-[progress-bar_2s_ease-out_infinite]" style={{ width: '70%' }} />
            </div>
          </div>
        ) : isDragging ? (
          <div>
            <h3 className="text-lg font-bold text-violet-700 dark:text-violet-400">Drop to upload!</h3>
            <p className="text-sm text-violet-500/70 mt-1">Release to start processing your PDF</p>
          </div>
        ) : (
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Upload Study Materials
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-500 mb-4">
              Drag & drop your lecture PDF, or{' '}
              <span className="text-violet-600 dark:text-violet-400 font-semibold underline underline-offset-2">
                browse files
              </span>
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-slate-400 dark:text-slate-600">
              <span className="flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> PDF only</span>
              <span className="flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> Max 10MB</span>
              <span className="flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> Auto-indexed</span>
            </div>
          </div>
        )}
      </div>

      {/* === DOCUMENTS LIST === */}
      <div className="rounded-2xl border border-slate-200 dark:border-[#1e2d45] bg-white dark:bg-[#0e1525]"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-[#1e2d45]">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="h-4.5 w-4.5 text-violet-500" />
              Uploaded Materials
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-600 mt-0.5">
              {documents.length === 0 ? 'No documents yet' : `${documents.length} document${documents.length > 1 ? 's' : ''} indexed`}
            </p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-1.5 rounded-xl text-xs font-bold text-white px-3.5 py-2 transition-all disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 3px 10px rgba(124, 58, 237, 0.3)' }}
          >
            <Upload className="h-3.5 w-3.5" />
            Upload PDF
          </button>
        </div>

        {isLoading ? (
          <div className="p-5"><SkeletonTable /></div>
        ) : documents.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-[#1e2d45]">
            {documents.map((doc, i) => {
              const dateStr = new Date(doc.uploadDate).toLocaleDateString(undefined, {
                year: 'numeric', month: 'short', day: 'numeric'
              });
              return (
                <div
                  key={doc._id}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-[#141e33]/50 transition-colors group"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  {/* File Icon */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-950/20 group-hover:scale-105 transition-transform">
                    <FileText className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{doc.originalname}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-slate-400 dark:text-slate-600">{dateStr}</span>
                      <span className="text-xs text-slate-300 dark:text-slate-700">•</span>
                      <span className="text-xs text-slate-400 dark:text-slate-600">{formatBytes(doc.fileSize)}</span>
                    </div>
                  </div>

                  {/* Indexed Badge */}
                  <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/30 px-2.5 py-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Indexed
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(doc._id)}
                    className="rounded-xl p-2 text-slate-300 dark:text-slate-700 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/15 transition-all opacity-0 group-hover:opacity-100"
                    title="Delete document"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center px-6">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-slate-300 dark:text-slate-600" />
            </div>
            <p className="font-semibold text-slate-700 dark:text-slate-400 mb-1">No documents uploaded yet</p>
            <p className="text-sm text-slate-400 dark:text-slate-600 mb-5">Upload your first PDF to unlock AI tutoring features</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 4px 14px rgba(124, 58, 237, 0.3)' }}
            >
              <Upload className="h-4 w-4" />
              Upload First PDF
            </button>
          </div>
        )}
      </div>

      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
      )}
    </div>
  );
};

export default Documents;
