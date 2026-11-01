import React, { useState } from 'react';
import { Gamepad2, Play, X, User, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface LaunchGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmLaunch: (playerName: string) => void;
  defaultName?: string;
}

export const LaunchGameModal: React.FC<LaunchGameModalProps> = ({
  isOpen,
  onClose,
  onConfirmLaunch,
  defaultName = 'Alex Mercer'
}) => {
  const [playerName, setPlayerName] = useState(defaultName);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = playerName.trim() || 'Guest Engineer';
    soundManager.playRewardClaimed();
    onConfirmLaunch(finalName);
  };

  const handleSelectPreset = (name: string) => {
    setPlayerName(name);
    soundManager.playClick();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-slate-900 border border-emerald-500/40 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with Game Icon */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              Cloud Raid Arcade
            </span>
            <h2 className="text-lg font-extrabold text-white tracking-tight">
              Enter Player Call-Sign
            </h2>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Please enter your player or engineer name to record your cloud savings, earn XP, and rank on the FinOps leaderboard.
        </p>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Player Name / Handle</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              maxLength={28}
              placeholder="e.g. Alex Mercer, Cloud Hunter, Neo"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
            />
          </div>

          {/* Preset Suggestions */}
          <div className="space-y-1.5">
            <div className="text-[11px] text-slate-400">Quick Call-Signs:</div>
            <div className="flex flex-wrap gap-1.5">
              {['Alex Mercer', 'Cloud Ninja', 'Zombie Hunter', 'FinOps Titan'].map((name) => (
                <button
                  type="button"
                  key={name}
                  onClick={() => handleSelectPreset(name)}
                  className={`px-2.5 py-1 text-xs rounded-lg border transition-colors ${
                    playerName === name
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-semibold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2.5 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:brightness-110 transition-all rounded-xl shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start Cloud Raid as {playerName.trim() || 'Player'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
