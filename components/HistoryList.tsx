
import React from 'react';
import { PlayerEntry } from '../types';

interface HistoryListProps {
  history: PlayerEntry[];
}

const HistoryList: React.FC<HistoryListProps> = ({ history }) => {
  if (history.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h3 className="text-slate-400 font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        Squad History
      </h3>
      <div className="space-y-3">
        {history.map((entry, idx) => (
          <div 
            key={entry.timestamp}
            className="flex items-center justify-between p-4 bg-slate-800/40 border border-slate-700/50 rounded-xl hover:bg-slate-800/60 transition-colors animate-in slide-in-from-bottom-4 duration-300"
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${entry.addedBy === 1 ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                P{entry.addedBy}
              </div>
              <div>
                <div className="text-white font-bold text-lg leading-tight">{entry.name}</div>
                {entry.sourceUrl && (
                  <a 
                    href={entry.sourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1 uppercase tracking-tighter"
                  >
                    View Stats ↗
                  </a>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-emerald-400 font-black text-2xl">+{entry.appearances}</div>
              <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Appearances</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryList;
