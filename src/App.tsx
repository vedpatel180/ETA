import React from 'react';
import { Sparkles, PlusCircle } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-6 selection:bg-slate-900 selection:text-white">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-sm">
          <Sparkles className="w-8 h-8" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Fresh Canvas Ready
          </h1>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            All previous files and components have been cleared. Tell me what you would like to build next!
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600 flex items-center justify-center gap-2">
          <PlusCircle className="w-4 h-4 text-slate-400" />
          <span>Ready for your new prompt & specifications</span>
        </div>
      </div>
    </div>
  );
}
