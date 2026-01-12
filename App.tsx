
import React, { useState, useCallback } from 'react';
import { GameStatus, Club, PlayerEntry, ValidationResult } from './types';
import { TARGET_SCORE } from './constants';
import { verifyPlayerAppearance } from './services/geminiService';
import ClubSelector from './components/ClubSelector';
import ScoreBoard from './components/ScoreBoard';
import PlayerInput from './components/PlayerInput';
import HistoryList from './components/HistoryList';

const App: React.FC = () => {
  const [status, setStatus] = useState<GameStatus>(GameStatus.SELECTING_CLUB);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [totalScore, setTotalScore] = useState(0);
  const [playerHistory, setPlayerHistory] = useState<PlayerEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [winner, setWinner] = useState<1 | 2 | null>(null);
  const [lastAppearances, setLastAppearances] = useState(0);

  const handleClubSelect = (club: Club) => {
    setSelectedClub(club);
    setStatus(GameStatus.PLAYING);
  };

  const handlePlayerSubmit = async (playerName: string) => {
    if (!selectedClub || isLoading) return;

    // Check if player name has already been used
    if (playerHistory.some(p => p.name.toLowerCase() === playerName.toLowerCase())) {
      setError(`${playerName} has already been used! Try someone else.`);
      return;
    }

    setIsLoading(true);
    setError(null);

    const result: ValidationResult = await verifyPlayerAppearance(playerName, selectedClub.name);

    setIsLoading(false);

    if (result.isValid) {
      const newScore = totalScore + result.appearances;
      const newEntry: PlayerEntry = {
        name: playerName,
        appearances: result.appearances,
        addedBy: currentPlayer,
        timestamp: Date.now(),
        sourceUrl: result.sourceUrl
      };

      setPlayerHistory(prev => [newEntry, ...prev]);
      setLastAppearances(result.appearances);
      setTotalScore(newScore);

      if (newScore === TARGET_SCORE) {
        setWinner(currentPlayer);
        setStatus(GameStatus.FINISHED);
      } else if (newScore > TARGET_SCORE) {
        // Current player went bust, other player wins
        setWinner(currentPlayer === 1 ? 2 : 1);
        setStatus(GameStatus.FINISHED);
      } else {
        // Continue game
        setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
      }
    } else {
      setError(result.error || "Player verification failed.");
    }
  };

  const resetGame = () => {
    setStatus(GameStatus.SELECTING_CLUB);
    setSelectedClub(null);
    setCurrentPlayer(1);
    setTotalScore(0);
    setPlayerHistory([]);
    setError(null);
    setWinner(null);
    setLastAppearances(0);
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col max-w-5xl">
      <header className="mb-12 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <div className="bg-emerald-500 text-slate-950 p-2 rounded-lg font-black text-2xl italic tracking-tighter">501</div>
            <div className="text-white font-black text-xl uppercase tracking-widest hidden sm:block">Challenge</div>
        </div>
        
        {status !== GameStatus.SELECTING_CLUB && (
          <button 
            onClick={resetGame}
            className="text-slate-400 hover:text-white text-sm font-bold uppercase transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset Game
          </button>
        )}
      </header>

      <main className="flex-grow flex flex-col">
        {status === GameStatus.SELECTING_CLUB && (
          <div className="my-auto">
            <ClubSelector onSelect={handleClubSelect} />
          </div>
        )}

        {status === GameStatus.PLAYING && selectedClub && (
          <div className="animate-in fade-in duration-700">
            <ScoreBoard 
              currentScore={totalScore} 
              lastAdded={lastAppearances}
              currentPlayer={currentPlayer}
              clubName={selectedClub.name}
            />
            
            <div className="mt-8">
              {error && (
                <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-center rounded-xl font-bold animate-bounce">
                  ⚠️ {error}
                </div>
              )}
              
              <PlayerInput 
                onSubmit={handlePlayerSubmit} 
                isLoading={isLoading} 
                disabled={status === GameStatus.FINISHED}
                clubName={selectedClub.name}
              />
            </div>

            <HistoryList history={playerHistory} />
          </div>
        )}

        {status === GameStatus.FINISHED && (
          <div className="text-center my-auto animate-in zoom-in duration-500">
            <div className="mb-4 inline-block px-8 py-4 bg-emerald-500 text-slate-950 rounded-2xl font-black text-6xl shadow-[0_0_50px_rgba(52,211,153,0.3)] transform -rotate-2">
              GAME OVER
            </div>
            
            <h2 className="text-4xl font-bold text-white mt-8 mb-4">
              Player {winner} is the Winner!
            </h2>
            
            <p className="text-slate-400 max-w-md mx-auto mb-10 text-lg">
              {totalScore > TARGET_SCORE 
                ? `Player ${winner === 1 ? 2 : 1} went bust with ${totalScore} appearances!` 
                : `Player ${winner} hit the perfect target of ${TARGET_SCORE}!`}
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={resetGame}
                className="px-10 py-4 bg-white text-slate-950 rounded-xl font-black text-xl hover:scale-105 transition-transform"
              >
                Play Again
              </button>
              <button 
                onClick={() => setStatus(GameStatus.SELECTING_CLUB)}
                className="px-10 py-4 bg-slate-800 text-white rounded-xl font-black text-xl hover:bg-slate-700 transition-all border border-slate-600"
              >
                Change Club
              </button>
            </div>
            
            <div className="mt-16 max-w-2xl mx-auto">
                <HistoryList history={playerHistory} />
            </div>
          </div>
        )}
      </main>

      <footer className="mt-20 pt-8 border-t border-slate-800 text-center text-slate-600 text-xs">
        <p>© {new Date().getFullYear()} Football 501 Challenge • Data verified by Gemini AI Grounding</p>
      </footer>
    </div>
  );
};

export default App;
