
import React from 'react';
import { Club } from '../types';
import { ENGLISH_CLUBS } from '../constants';

interface ClubSelectorProps {
  onSelect: (club: Club) => void;
}

const ClubSelector: React.FC<ClubSelectorProps> = ({ onSelect }) => {
  return (
    <div className="max-w-md mx-auto p-8 bg-slate-800/50 rounded-2xl border border-slate-700 shadow-2xl backdrop-blur-sm animate-in fade-in zoom-in duration-300">
      <h2 className="text-2xl font-bold text-center mb-6 text-emerald-400">Select Your Club</h2>
      <p className="text-slate-400 text-center mb-8">
        Pick a club to start the 501 Challenge. You and your opponent will name players from this team.
      </p>
      
      <div className="grid gap-4">
        <select 
          onChange={(e) => {
            const club = ENGLISH_CLUBS.find(c => c.id === e.target.value);
            if (club) onSelect(club);
          }}
          className="w-full bg-slate-900 border border-slate-600 text-white p-4 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all cursor-pointer"
          defaultValue=""
        >
          <option value="" disabled>Choose a football club...</option>
          {ENGLISH_CLUBS.map((club) => (
            <option key={club.id} value={club.id}>
              {club.name} ({club.league})
            </option>
          ))}
        </select>
      </div>
      
      <div className="mt-12 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
        <h3 className="text-sm font-semibold text-emerald-400 mb-1 uppercase tracking-wider">How to Play</h3>
        <ul className="text-sm text-slate-300 space-y-2 list-disc pl-4">
          <li>Two players take turns naming players for the club.</li>
          <li>Each player's appearance count is added to the total.</li>
          <li>Goal: Reach exactly <strong>501</strong>.</li>
          <li>Going over 501 results in an instant <strong>LOSS</strong>.</li>
        </ul>
      </div>
    </div>
  );
};

export default ClubSelector;
