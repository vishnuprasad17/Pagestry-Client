import React from "react";

const AuditLogSkeleton: React.FC = () => (
    <div className="p-6 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1">
              <div className="h-5 bg-slate-200 rounded w-32 mb-2"></div>
              <div className="h-4 bg-slate-200 rounded w-24"></div>
            </div>
            <div className="h-6 bg-slate-200 rounded-full w-24"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="flex items-center gap-3 p-3 bg-slate-100 rounded-lg">
              <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-3 bg-slate-200 rounded w-16 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-28 mb-1"></div>
                <div className="h-3 bg-slate-200 rounded w-20"></div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-100 rounded-lg">
              <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-3 bg-slate-200 rounded w-20 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-24 mb-1"></div>
                <div className="h-3 bg-slate-200 rounded w-20"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  export default AuditLogSkeleton;