import React from 'react';
import { Volume2, VolumeX, Globe, UserCheck, Shield } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { Engineer } from '../types/finops';

export type NavTab = 'overview' | 'game' | 'opportunities' | 'leaderboard' | 'milestones' | 'simulator';

interface TopBarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenNewBounty: () => void;
  currentUser: Engineer;
  engineers: Engineer[];
  onSwitchUser: (engineerId: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onTabChange,
  soundEnabled,
  onToggleSound,
  onOpenNewBounty,
  currentUser,
  engineers,
  onSwitchUser,
}) => {
  return (
    <>
      {/* Primary Top Bar: 3-Zone Postrix Header */}
      <header className="rm-site-header px-6 no-print">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-8 min-h-[64px] py-2">
          {/* Zone 1: Brand Wordmark */}
          <a
            href="#overview"
            onClick={(e) => {
              e.preventDefault();
              onTabChange('overview');
              soundManager.playClick();
            }}
            className="rm-brand whitespace-nowrap shrink-0"
          >
            <span className="rm-mono-mark" aria-hidden="true">
              RM
            </span>
            <span>
              Maniq <span className="text-[#3E6E86] font-normal mx-0.5">|</span>{' '}
              <span className="accent">Sweep</span>
            </span>
          </a>

          {/* Zone 2: Primary Navigation Links */}
          <nav aria-label="Main navigation" className="flex items-center gap-7 overflow-x-auto">
            <button
              type="button"
              onClick={() => {
                onTabChange('overview');
                soundManager.playClick();
              }}
              aria-current={activeTab === 'overview' ? 'page' : undefined}
              className={`rm-navlink whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'overview' ? 'rm-navlink-active' : ''
              }`}
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => {
                onTabChange('game');
                soundManager.playClick();
              }}
              aria-current={activeTab === 'game' ? 'page' : undefined}
              className={`rm-navlink whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'game' ? 'rm-navlink-active' : ''
              }`}
            >
              Cloud Raid
            </button>
            <button
              type="button"
              onClick={() => {
                onTabChange('opportunities');
                soundManager.playClick();
              }}
              aria-current={activeTab === 'opportunities' ? 'page' : undefined}
              className={`rm-navlink whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'opportunities' ? 'rm-navlink-active' : ''
              }`}
            >
              Bounties
            </button>
            <button
              type="button"
              onClick={() => {
                onTabChange('leaderboard');
                soundManager.playClick();
              }}
              aria-current={activeTab === 'leaderboard' ? 'page' : undefined}
              className={`rm-navlink whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'leaderboard' ? 'rm-navlink-active' : ''
              }`}
            >
              Leaderboard
            </button>
            <button
              type="button"
              onClick={() => {
                onTabChange('milestones');
                soundManager.playClick();
              }}
              aria-current={activeTab === 'milestones' ? 'page' : undefined}
              className={`rm-navlink whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'milestones' ? 'rm-navlink-active' : ''
              }`}
            >
              Milestones
            </button>
            <button
              type="button"
              onClick={() => {
                onTabChange('simulator');
                soundManager.playClick();
              }}
              aria-current={activeTab === 'simulator' ? 'page' : undefined}
              className={`rm-navlink whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'simulator' ? 'rm-navlink-active' : ''
              }`}
            >
              Simulator
            </button>
          </nav>

          {/* Zone 3: Single Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                onOpenNewBounty();
                soundManager.playClick();
              }}
              className="xh-btn primary whitespace-nowrap shrink-0"
            >
              New Bounty
            </button>
          </div>
        </div>
      </header>

      {/* Secondary Postrix Telemetry & Operator Sub-Bar */}
      <div className="bg-[#0D1C2D] text-[#EEF3F1] border-b border-[#3E6E86]/35 px-6 py-2.5 no-print">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          {/* Left: Active Scope & Author Context */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 font-mono text-[#EEF3F1]">
              <Globe className="w-3.5 h-3.5 text-[#5FD3BF] shrink-0" />
              <span className="font-sans text-[#A9B7BF]">Active Scope:</span>
              <strong className="font-semibold text-white">AWS · Azure · GCP</strong>
              <span className="text-[#5FD3BF] font-semibold">
                (+${currentUser.monthlySavingsRealized.toLocaleString()}/mo Saved)
              </span>
            </div>

            <span className="text-[#3E6E86]" aria-hidden="true">
              ·
            </span>

            <div className="text-[#C6D1D6]">
              <span className="text-[#A9B7BF]">Author:</span>{' '}
              <strong className="font-medium text-white">Mani Ravindran</strong>{' '}
              <a
                href="https://ravindran.in"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[#5FD3BF] hover:text-[#EBC385] underline underline-offset-2 transition-colors"
              >
                (ravindran.in)
              </a>
            </div>

            <span className="text-[#3E6E86] hidden lg:inline" aria-hidden="true">
              ·
            </span>

            <div className="hidden lg:flex items-center gap-1.5 text-[#A9B7BF]">
              <UserCheck className="w-3.5 h-3.5 text-[#5FD3BF] shrink-0" />
              <span>Instant Guest Access — No Sign-In Required</span>
            </div>
          </div>

          {/* Right: Operator Persona Selector & Audio Control */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#5FD3BF] shrink-0" />
              <label htmlFor="operator-persona-select" className="font-medium text-[#A9B7BF]">
                Engineer Persona:
              </label>
              <select
                id="operator-persona-select"
                value={currentUser.id}
                onChange={(e) => {
                  onSwitchUser(e.target.value);
                  soundManager.playClick();
                }}
                className="bg-[#102236] border border-[#3E6E86]/50 rounded-md px-2.5 py-1 text-xs font-medium text-[#EEF3F1] focus:outline-none focus:border-[#5FD3BF]"
              >
                {engineers.map((eng) => (
                  <option key={eng.id} value={eng.id}>
                    {eng.name} — Lv.{eng.level} ({eng.totalXp.toLocaleString()} XP)
                  </option>
                ))}
              </select>
            </div>

            <span className="text-[#3E6E86]" aria-hidden="true">
              ·
            </span>

            <button
              type="button"
              onClick={onToggleSound}
              title={soundEnabled ? 'Mute sound effects' : 'Unmute sound effects'}
              className="text-[#A9B7BF] hover:text-[#5FD3BF] inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors cursor-pointer"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#5FD3BF]" />
                  <span>Audio On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-[#7F909A]" />
                  <span>Audio Muted</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
