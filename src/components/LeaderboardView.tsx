import React, { useState } from 'react';
import {
  Trophy,
  Medal,
  Award,
  Crown,
  Ghost,
  Zap,
  Cpu,
  Leaf,
  Moon,
  Network,
  Users,
  CheckCircle2,
  Lock,
  Sparkles,
  TrendingUp,
  Info
} from 'lucide-react';
import { Engineer, TeamStanding, Badge } from '../types/finops';
import { soundManager } from '../utils/audio';

interface LeaderboardViewProps {
  engineers: Engineer[];
  teams: TeamStanding[];
  badges: Badge[];
  currentUser: Engineer;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  engineers,
  teams,
  badges,
  currentUser
}) => {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  // Helper to render badge icon by name
  const renderBadgeIcon = (iconName: string, className = 'w-4 h-4') => {
    switch (iconName) {
      case 'Ghost':
        return <Ghost className={className} />;
      case 'Zap':
        return <Zap className={className} />;
      case 'Cpu':
        return <Cpu className={className} />;
      case 'Leaf':
        return <Leaf className={className} />;
      case 'Award':
        return <Award className={className} />;
      case 'Crown':
        return <Crown className={className} />;
      case 'Moon':
        return <Moon className={className} />;
      case 'Network':
        return <Network className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  // Next level calculation: Level * 1500 XP
  const nextLevelXp = (currentUser.level + 1) * 1500;
  const currentLevelBaseXp = currentUser.level * 1500;
  const xpInCurrentLevel = currentUser.totalXp - currentLevelBaseXp;
  const xpNeededForLevel = nextLevelXp - currentLevelBaseXp;
  const levelProgressPercent = Math.min(
    100,
    Math.max(0, Math.round((xpInCurrentLevel / xpNeededForLevel) * 100))
  );

  return (
    <div className="space-y-6">
      {/* Top Banner: User Passport Card */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${currentUser.avatarColor} flex items-center justify-center text-white text-lg font-bold shadow-md shadow-emerald-500/10`}>
              {currentUser.avatarInitials}
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-semibold text-emerald-400">Rank #{currentUser.rank}</span>
                <span aria-hidden="true">·</span>
                <span>{currentUser.role}</span>
                <span aria-hidden="true">·</span>
                <span>{currentUser.team}</span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
                {currentUser.name}
              </h2>
              <div className="text-xs text-slate-400 mt-0.5">
                Level {currentUser.level} · {currentUser.levelTitle}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div>
              <div className="text-[11px] text-slate-400">Monthly Realized Savings</div>
              <div className="text-lg font-bold font-mono tabular-nums text-emerald-400">
                +${currentUser.monthlySavingsRealized.toLocaleString()}
                <span className="text-xs font-normal text-slate-400">/mo</span>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <div className="text-[11px] text-slate-400">Bounties Claimed</div>
              <div className="text-lg font-bold font-mono tabular-nums text-white">
                {currentUser.bountiesClaimed}
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <div className="text-[11px] text-slate-400">Total XP</div>
              <div className="text-lg font-bold font-mono tabular-nums text-amber-400">
                {currentUser.totalXp.toLocaleString()} XP
              </div>
            </div>
          </div>
        </div>

        {/* Level Progression Bar */}
        <div className="pt-2 space-y-1.5 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium text-slate-300">
              Level {currentUser.level} Progress to Level {currentUser.level + 1}
            </span>
            <span className="font-mono tabular-nums">
              {currentUser.totalXp.toLocaleString()} / {nextLevelXp.toLocaleString()} XP ({levelProgressPercent}%)
            </span>
          </div>
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
              style={{ width: `${levelProgressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Leaderboard & Team Standings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Global Engineer Leaderboard */}
        <div className="lg:col-span-2 p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white tracking-tight">
                FinOps Champions Leaderboard
              </h3>
            </div>
            <span className="text-xs text-slate-500">October 2026 Cycle</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-2.5 font-medium w-12 text-center">Rank</th>
                  <th className="pb-2.5 font-medium">Engineer</th>
                  <th className="pb-2.5 font-medium">Tier & Role</th>
                  <th className="pb-2.5 font-medium text-right">Monthly Saved</th>
                  <th className="pb-2.5 font-medium text-right">XP Points</th>
                  <th className="pb-2.5 font-medium text-center">Badges</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono tabular-nums">
                {engineers.map((eng) => (
                  <tr
                    key={eng.id}
                    className={`hover:bg-slate-950/40 transition-colors ${
                      eng.isCurrentUser ? 'bg-emerald-500/5' : ''
                    }`}
                  >
                    {/* Rank with Medals */}
                    <td className="py-3 text-center">
                      {eng.rank === 1 ? (
                        <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-400/20 text-amber-400 font-bold text-xs">
                          <Crown className="w-3.5 h-3.5" />
                        </div>
                      ) : eng.rank === 2 ? (
                        <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-400/20 text-slate-300 font-bold text-xs">
                          2
                        </div>
                      ) : eng.rank === 3 ? (
                        <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700/20 text-amber-600 font-bold text-xs">
                          3
                        </div>
                      ) : (
                        <span className="text-slate-500 font-medium">{eng.rank}</span>
                      )}
                    </td>

                    {/* Engineer info */}
                    <td className="py-3 font-sans">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${eng.avatarColor} flex items-center justify-center text-white font-bold text-[11px] shrink-0`}>
                          {eng.avatarInitials}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                            <span>{eng.name}</span>
                            {eng.isCurrentUser && (
                              <span className="text-[10px] text-emerald-400 font-medium">
                                (You)
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {eng.team}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Tier Title */}
                    <td className="py-3 font-sans text-slate-400">
                      <div>Lv.{eng.level} {eng.levelTitle}</div>
                      <div className="text-[11px] text-slate-500">{eng.bountiesClaimed} bounties</div>
                    </td>

                    {/* Monthly Saved */}
                    <td className="py-3 text-right font-bold text-emerald-400">
                      +${eng.monthlySavingsRealized.toLocaleString()}/mo
                    </td>

                    {/* Total XP */}
                    <td className="py-3 text-right font-bold text-amber-400">
                      {eng.totalXp.toLocaleString()} XP
                    </td>

                    {/* Badges preview */}
                    <td className="py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {eng.badges.slice(0, 3).map((bId) => {
                          const badgeObj = badges.find((b) => b.id === bId);
                          if (!badgeObj) return null;
                          return (
                            <span
                              key={bId}
                              title={badgeObj.name}
                              className="p-1 rounded bg-slate-950 text-slate-300 border border-slate-800"
                            >
                              {renderBadgeIcon(badgeObj.iconName, 'w-3 h-3 text-amber-400')}
                            </span>
                          );
                        })}
                        {eng.badges.length > 3 && (
                          <span className="text-[10px] text-slate-500">
                            +{eng.badges.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Department / Team Standings */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white tracking-tight">
                Team Division Standings
              </h3>
            </div>
            <span className="text-xs text-slate-500">Sprint 42</span>
          </div>

          <div className="space-y-3 pt-1">
            {teams.map((team, idx) => (
              <div
                key={team.teamName}
                className="p-3.5 bg-slate-950 rounded-lg border border-slate-800/80 space-y-2 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="font-semibold text-slate-200">
                    {idx + 1}. {team.teamName}
                  </div>
                  <div className="font-mono tabular-nums text-emerald-400 font-bold">
                    +${team.totalSaved.toLocaleString()}/mo
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{team.bountiesResolved} bounties · {team.memberCount} engineers</span>
                  <span className="text-slate-500 text-[11px]">Top: {team.leadingEngineer}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Badges Showcase Gallery */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              FinOps Engineering Badges & Achievements ({badges.filter((b) => b.unlocked).length}/{badges.length} Unlocked)
            </h3>
          </div>
          <span className="text-xs text-slate-500">Click any badge for criteria</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
          {badges.map((badge) => (
            <button
              key={badge.id}
              onClick={() => {
                setSelectedBadge(badge);
                soundManager.playClick();
              }}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                badge.unlocked
                  ? 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:shadow-md'
                  : 'bg-slate-950/30 border-slate-900 opacity-60 hover:opacity-80'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className={`p-2.5 rounded-lg border ${
                  badge.unlocked
                    ? 'bg-amber-400/10 border-amber-400/30 text-amber-400'
                    : 'bg-slate-900 border-slate-800 text-slate-600'
                }`}>
                  {renderBadgeIcon(badge.iconName, 'w-5 h-5')}
                </div>
                {badge.unlocked ? (
                  <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Unlocked</span>
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>Locked</span>
                  </span>
                )}
              </div>

              <div className="mt-3">
                <h4 className="text-xs font-bold text-white tracking-tight">
                  {badge.name}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {badge.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl border ${
                selectedBadge.unlocked
                  ? 'bg-amber-400/10 border-amber-400/30 text-amber-400'
                  : 'bg-slate-950 border-slate-800 text-slate-500'
              }`}>
                {renderBadgeIcon(selectedBadge.iconName, 'w-6 h-6')}
              </div>
              <div>
                <h4 className="text-base font-bold text-white tracking-tight">
                  {selectedBadge.name}
                </h4>
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                  Category: {selectedBadge.category}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedBadge.description}
            </p>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1">
              <div className="font-semibold text-slate-300">Unlock Requirement:</div>
              <div className="text-slate-400">{selectedBadge.requirement}</div>
            </div>

            {selectedBadge.unlocked && selectedBadge.unlockedAt && (
              <div className="text-xs text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Earned {selectedBadge.unlockedAt}</span>
              </div>
            )}

            <button
              onClick={() => setSelectedBadge(null)}
              className="w-full py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors rounded-lg cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
