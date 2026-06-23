import React from 'react';

const shimmer = 'bg-slate-200 dark:bg-slate-800/80 animate-pulse rounded-xl';

export const SkeletonCard = () => (
  <div className={`p-5 rounded-2xl border border-slate-200 dark:border-[#1e2d45] bg-white dark:bg-[#0e1525] space-y-4 animate-pulse`}>
    <div className="flex items-center justify-between">
      <div className={`h-3 w-24 ${shimmer}`} />
      <div className={`h-9 w-9 rounded-xl ${shimmer}`} />
    </div>
    <div className={`h-9 w-16 ${shimmer}`} />
    <div className={`h-2.5 w-32 ${shimmer}`} />
  </div>
);

export const SkeletonTable = () => (
  <div className="space-y-3 animate-pulse">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="flex items-center gap-4 py-3">
        <div className={`h-10 w-10 rounded-xl flex-shrink-0 ${shimmer}`} />
        <div className="flex-1 space-y-2">
          <div className={`h-3 w-3/4 ${shimmer}`} />
          <div className={`h-2.5 w-1/2 ${shimmer}`} />
        </div>
        <div className={`h-2.5 w-16 ${shimmer}`} />
      </div>
    ))}
  </div>
);

export const SkeletonChat = () => (
  <div className="space-y-4 w-full animate-pulse">
    {/* AI bubble */}
    <div className="flex gap-3 items-start">
      <div className={`h-8 w-8 rounded-full flex-shrink-0 ${shimmer}`} />
      <div className="space-y-2 flex-1 max-w-[75%]">
        <div className={`h-3 w-16 ${shimmer}`} />
        <div className={`h-16 w-full rounded-2xl ${shimmer}`} />
      </div>
    </div>
  </div>
);
