import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 4000 }) => {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev - (100 / (duration / 100));
        if (next <= 0) { clearInterval(interval); return 0; }
        return next;
      });
    }, 100);

    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => { clearTimeout(timer); clearInterval(interval); };
  }, [onClose, duration]);

  const config = {
    success: {
      icon: <CheckCircle className="h-4.5 w-4.5 text-emerald-500 shrink-0" />,
      bar: 'bg-emerald-500',
      bg: 'bg-white dark:bg-[#0e1525]',
      border: 'border-emerald-200 dark:border-emerald-800/40',
      text: 'text-slate-800 dark:text-slate-200',
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/30',
    },
    error: {
      icon: <AlertCircle className="h-4.5 w-4.5 text-rose-500 shrink-0" />,
      bar: 'bg-rose-500',
      bg: 'bg-white dark:bg-[#0e1525]',
      border: 'border-rose-200 dark:border-rose-800/40',
      text: 'text-slate-800 dark:text-slate-200',
      iconBg: 'bg-rose-50 dark:bg-rose-950/30',
    },
    info: {
      icon: <Info className="h-4.5 w-4.5 text-blue-500 shrink-0" />,
      bar: 'bg-blue-500',
      bg: 'bg-white dark:bg-[#0e1525]',
      border: 'border-blue-200 dark:border-blue-800/40',
      text: 'text-slate-800 dark:text-slate-200',
      iconBg: 'bg-blue-50 dark:bg-blue-950/30',
    },
  };

  const c = config[type] || config.info;

  return (
    <div
      className={`fixed bottom-5 right-5 z-[9999] max-w-sm w-full rounded-2xl border ${c.border} ${c.bg} shadow-xl overflow-hidden transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
      style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12)', animation: 'slide-up 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
    >
      {/* Progress bar at top */}
      <div className="h-0.5 bg-slate-100 dark:bg-slate-800">
        <div
          className={`h-full ${c.bar} transition-all duration-100 rounded-full`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-start gap-3 p-4">
        {/* Icon */}
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${c.iconBg}`}>
          {c.icon}
        </div>

        {/* Message */}
        <div className="flex-1 min-w-0 pt-0.5">
          <p className={`text-sm font-semibold ${c.text}`}>{message}</p>
        </div>

        {/* Close */}
        <button
          onClick={() => { setVisible(false); setTimeout(onClose, 300); }}
          className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
