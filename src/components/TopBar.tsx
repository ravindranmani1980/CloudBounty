import React from 'react';
import { Volume2, VolumeX, Plus } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface TopBarProps {
  activeTab: 'overview' | 'opportunities' | 'leaderboard' | 'milestones' | 'simulator';
  onTabChange: (tab: 'overview' | 'opportunities' | 'leaderboard' | 'milestones' | 'simulator') => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenNewBounty: () => void;
  currentUserXp: number;
  currentUserLevel: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onTabChange,
  soundEnabled,
  onToggleSound,
  onOpenNewBounty,
  currentUserXp,
  currentUserLevel,
}) => {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-8 px-6 py-3.5 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onTabChange('overview');
            soundManager.playClick();
          }}
          className="text-lg font-bold tracking-tight text-white hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
        >
          CloudBounty
        </a>
      </div>

      {/* Zone 2: 5 clean single-line navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
        <button
          onClick={() => {
            onTabChange('overview');
            soundManager.playClick();
          }}
          className={`py-1 transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'overview'
              ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => {
            onTabChange('opportunities');
            soundManager.playClick();
          }}
          className={`py-1 transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'opportunities'
              ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Opportunities
        </button>
        <button
          onClick={() => {
            onTabChange('leaderboard');
            soundManager.playClick();
          }}
          className={`py-1 transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'leaderboard'
              ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Leaderboard
        </button>
        <button
          onClick={() => {
            onTabChange('milestones');
            soundManager.playClick();
          }}
          className={`py-1 transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'milestones'
              ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Milestones
        </button>
        <button
          onClick={() => {
            onTabChange('simulator');
            soundManager.playClick();
          }}
          className={`py-1 transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'simulator'
              ? 'text-emerald-400 border-b-2 border-emerald-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Simulator
        </button>
      </nav>

      {/* Zone 3: Primary Action & Control */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleSound}
          title={soundEnabled ? 'Mute game sound effects' : 'Unmute game sound effects'}
          aria-label={soundEnabled ? 'Mute game sound effects' : 'Unmute game sound effects'}
          className="p-2 text-slate-400 hover:text-slate-200 transition-colors rounded-md hover:bg-slate-800"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 px-2.5 py-1 rounded bg-slate-900 border border-slate-800">
          <span className="font-semibold text-emerald-400">Lv.{currentUserLevel}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="font-mono tabular-nums text-slate-200">{currentUserXp.toLocaleString()} XP</span>
        </div>

        <button
          onClick={() => {
            onOpenNewBounty();
            soundManager.playClick();
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors rounded-md whitespace-nowrap shrink-0 cursor-pointer shadow-sm shadow-emerald-500/20"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Bounty</span>
        </button>
      </div>
    </header>
  );
};
