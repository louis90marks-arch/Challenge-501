
import React from 'react';
import { TARGET_SCORE } from '../constants';

interface ScoreBoardProps {
  currentScore: number;
  lastAdded: number;
  currentPlayer: 1 | 2;
  clubName: string;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ currentScore, lastAdded, currentPlayer, clubName }) => {
  const percentage = Math.min((currentScore / TARGET_SCORE) * 100, 100);
  const remaining = TARGET_SCORE - currentScore;

  return (
    <div className="w-full mb-10">
      <div className="flex flex-col md:flex-row justify-between items-end mb-4 gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter">{clubName}</h1>
          <p className="text-slate-400 font-medium">Road to 501 Appearances</p>
        </div>
        
        <div className="text-right">
          <div className="text-6xl font-black text-emerald-400 tabular-nums">
            {currentScore}<span className="text-slate-600 text-2xl font-bold"> / {TARGET_SCORE}</span>
          </div>
          <div className="text-slate-400 font-semibold uppercase tracking-widest text-sm">
            {remaining > 0 ? `${remaining} to go` : 'Goal reached!'}
          </div>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="relative h-6 bg-slate-800 rounded-full overflow-hidden border border-slate-700 shadow-inner">
        {/* Progress Fill */}
        <div 
          className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(52,211,153,0.3)]"
          style={{ width: `${percentage}%` }}
        />
        
        {/* Tick Marks */}
        <div className="absolute inset-0 flex justify-between px-1 pointer-events-none opacity-20">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="w-px h-full bg-white" />
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-8 gap-8">
        <div className={`transition-all duration-300 flex flex-col items-center p-4 rounded-2xl w-40 border-2 ${currentPlayer === 1 ? 'bg-emerald-500/10 border-emerald-500 scale-110 shadow-lg' : 'bg-slate-800/30 border-transparent opacity-50'}`}>
           <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-slate-900 font-bold mb-2">P1</div>
           <span className="text-white font-bold">Player One</span>
           {currentPlayer === 1 && <span className="text-[10px] text-emerald-400 font-black animate-pulse uppercase mt-1">Thinking...</span>}
        </div>
        
        <div className="flex items-center">
            <div className="w-px h-12 bg-slate-700" />
        </div>

        <div className={`transition-all duration-300 flex flex-col items-center p-4 rounded-2xl w-40 border-2 ${currentPlayer === 2 ? 'bg-emerald-500/10 border-emerald-500 scale-110 shadow-lg' : 'bg-slate-800/30 border-transparent opacity-50'}`}>
           <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-slate-900 font-bold mb-2">P2</div>
           <span className="text-white font-bold">Player Two</span>
           {currentPlayer === 2 && <span className="text-[10px] text-emerald-400 font-black animate-pulse uppercase mt-1">Thinking...</span>}
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;
