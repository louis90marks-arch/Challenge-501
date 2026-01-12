
import React, { useState, useEffect } from 'react';

interface PlayerInputProps {
  onSubmit: (playerName: string) => void;
  isLoading: boolean;
  disabled: boolean;
  clubName: string;
}

const PlayerInput: React.FC<PlayerInputProps> = ({ onSubmit, isLoading, disabled, clubName }) => {
  const [value, setValue] = useState('');
  const [loadingMsg, setLoadingMsg] = useState('Checking');

  useEffect(() => {
    let interval: number;
    if (isLoading) {
      const messages = ['Verifying', 'Searching', 'Calculating', 'Confirming'];
      let i = 0;
      // Faster interval for more "active" feel
      interval = window.setInterval(() => {
        setLoadingMsg(messages[i % messages.length]);
        i++;
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !isLoading && !disabled) {
      onSubmit(value.trim());
      setValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mb-8">
      <div className="relative group">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={isLoading || disabled}
          placeholder={isLoading ? `${loadingMsg}...` : `Name a player who played for ${clubName}...`}
          className="w-full bg-slate-900 border-2 border-slate-700 text-white text-xl p-6 pr-40 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
          autoFocus
        />
        <button
          type="submit"
          disabled={isLoading || disabled || !value.trim()}
          className="absolute right-3 top-3 bottom-3 px-8 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 text-slate-950 font-black rounded-xl transition-all flex items-center justify-center min-w-[140px] gap-2"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-slate-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-xs uppercase tracking-tight">Wait</span>
            </div>
          ) : (
            <span>Submit</span>
          )}
        </button>
      </div>
      <p className="text-center text-slate-500 text-[10px] mt-3 uppercase tracking-widest font-bold">
        {isLoading ? 'Optimizing data stream...' : 'Verified by Gemini AI Real-time Grounding'}
      </p>
    </form>
  );
};

export default PlayerInput;
