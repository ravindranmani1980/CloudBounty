import React, { useState } from 'react';
import {
  Trophy,
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
  Sparkles
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

  const nextLevelXp = (currentUser.level + 1) * 1500;
  const currentLevelBaseXp = currentUser.level * 1500;
  const xpInCurrentLevel = currentUser.totalXp - currentLevelBaseXp;
  const xpNeededForLevel = nextLevelXp - currentLevelBaseXp;
  const levelProgressPercent = Math.min(
    100,
    Math.max(0, Math.round((xpInCurrentLevel / xpNeededForLevel) * 100))
  );

  return (
    <div className="space-y-8">
      {/* Top Banner: User Passport Card in .xh-panel */}
      <section className="xh-panel space-y-5">
        <div className="xh-kicker">
          <span className="k">Maniq | Sweep · Engineer Efficiency Leaderboard &amp; Recognition</span>
          <span className="tag">Rank #{currentUser.rank} · Level {currentUser.level} {currentUser.levelTitle}</span>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-4">
            <div className="rm-mono-mark !w-14 !h-14 !text-lg">
              {currentUser.avatarInitials}
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-[#A9B7BF] font-mono">
                <span className="font-semibold text-[#5FD3BF]">Rank #{currentUser.rank}</span>
                <span aria-hidden="true">·</span>
                <span>{currentUser.role}</span>
                <span aria-hidden="true">·</span>
                <span>{currentUser.team}</span>
              </div>
              <h2 className="text-xl font-bold text-[#EEF3F1] tracking-tight mt-0.5">
                {currentUser.name}
              </h2>
              <div className="text-xs text-[#A9B7BF] mt-0.5">
                Level {currentUser.level} · {currentUser.levelTitle}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 p-3.5 bg-[#102236] rounded-xl border border-[#C9D3D9]/15">
            <div>
              <div className="text-[11px] text-[#A9B7BF] font-mono">Monthly Realized Savings</div>
              <div className="text-lg font-bold font-mono tabular-nums text-[#5FD3BF]">
                +${currentUser.monthlySavingsRealized.toLocaleString()}
                <span className="text-xs font-normal text-[#A9B7BF]">/mo</span>
              </div>
            </div>
            <div className="h-8 w-px bg-[#C9D3D9]/20" />
            <div>
              <div className="text-[11px] text-[#A9B7BF] font-mono">Bounties Claimed</div>
              <div className="text-lg font-bold font-mono tabular-nums text-white">
                {currentUser.bountiesClaimed}
              </div>
            </div>
            <div className="h-8 w-px bg-[#C9D3D9]/20" />
            <div>
              <div className="text-[11px] text-[#A9B7BF] font-mono">Total XP</div>
              <div className="text-lg font-bold font-mono tabular-nums text-[#EBC385]">
                {currentUser.totalXp.toLocaleString()} XP
              </div>
            </div>
          </div>
        </div>

        {/* Level Progression Bar */}
        <div className="pt-3 space-y-1.5 border-t border-[#C9D3D9]/15">
          <div className="flex items-center justify-between text-xs text-[#A9B7BF]">
            <span className="font-medium text-[#EEF3F1]">
              Level {currentUser.level} Progress to Level {currentUser.level + 1}
            </span>
            <span className="font-mono tabular-nums text-[#5FD3BF]">
              {currentUser.totalXp.toLocaleString()} / {nextLevelXp.toLocaleString()} XP ({levelProgressPercent}%)
            </span>
          </div>
          <div className="w-full bg-[#081420] h-2.5 rounded-full overflow-hidden border border-[#C9D3D9]/20">
            <div
              className="h-full bg-[#2BB5A0] rounded-full transition-all duration-700"
              style={{ width: `${levelProgressPercent}%` }}
            />
          </div>
        </div>
      </section>

      {/* Main Grid: Leaderboard & Team Standings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Global Engineer Leaderboard */}
        <section className="lg:col-span-2 p-6 bg-white border border-slate-200 rounded-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <span className="rm-kicker">01 / Individual Engineering Standings</span>
              <h3 className="text-base font-semibold text-slate-900">
                FinOps Champions Leaderboard
              </h3>
            </div>
            <Trophy className="w-4 h-4 text-amber-600" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="pb-2.5 font-medium w-12 text-center">Rank</th>
                  <th className="pb-2.5 font-medium">Engineer</th>
                  <th className="pb-2.5 font-medium">Tier &amp; Role</th>
                  <th className="pb-2.5 font-medium text-right">Monthly Saved</th>
                  <th className="pb-2.5 font-medium text-right">XP Points</th>
                  <th className="pb-2.5 font-medium text-center">Badges</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono tabular-nums">
                {engineers.map((eng) => (
                  <tr
                    key={eng.id}
                    className={`hover:bg-slate-50 transition-colors ${
                      eng.isCurrentUser ? 'bg-emerald-50/50' : ''
                    }`}
                  >
                    <td className="py-3 text-center">
                      {eng.rank === 1 ? (
                        <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-700 font-bold text-xs">
                          <Crown className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <span className="text-slate-700 font-semibold">#{eng.rank}</span>
                      )}
                    </td>

                    <td className="py-3 font-sans">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[#0E2238] flex items-center justify-center text-[#5FD3BF] font-mono font-bold text-[11px] shrink-0">
                          {eng.avatarInitials}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                            <span>{eng.name}</span>
                          </div>
                          <div className="text-[11px] text-slate-500">{eng.team}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 font-sans text-slate-600">
                      <div className="font-medium text-slate-800">Lv.{eng.level} {eng.levelTitle}</div>
                      <div className="text-[11px] text-slate-500">{eng.bountiesClaimed} bounties</div>
                    </td>

                    <td className="py-3 text-right font-bold text-emerald-700">
                      +${eng.monthlySavingsRealized.toLocaleString()}/mo
                    </td>

                    <td className="py-3 text-right font-bold text-amber-700">
                      {eng.totalXp.toLocaleString()} XP
                    </td>

                    <td className="py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {eng.badges.slice(0, 3).map((bId) => {
                          const badgeObj = badges.find((b) => b.id === bId);
                          if (!badgeObj) return null;
                          return (
                            <span
                              key={bId}
                              title={badgeObj.name}
                              className="p-1 rounded bg-slate-100 text-slate-700 border border-slate-200"
                            >
                              {renderBadgeIcon(badgeObj.iconName, 'w-3 h-3 text-amber-700')}
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
        </section>

        {/* Right 1 Col: Department / Team Standings */}
        <section className="p-6 bg-white border border-slate-200 rounded-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <span className="rm-kicker">02 / Organizational Units</span>
              <h3 className="text-base font-semibold text-slate-900">
                Team Division Standings
              </h3>
            </div>
            <Users className="w-4 h-4 text-slate-700" />
          </div>

          <div className="space-y-3 pt-1">
            {teams.map((team, idx) => (
              <div
                key={team.teamName}
                className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="font-semibold text-slate-900">
                    0{idx + 1}. {team.teamName}
                  </div>
                  <div className="font-mono tabular-nums text-emerald-700 font-bold">
                    +${team.totalSaved.toLocaleString()}/mo
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{team.bountiesResolved} bounties · {team.memberCount} engineers</span>
                  <span className="font-mono text-[11px] text-slate-700">Lead: {team.leadingEngineer}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Badges Showcase Gallery */}
      <section className="p-6 bg-white border border-slate-200 rounded-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <span className="rm-kicker">03 / Verified Credentials</span>
            <h3 className="text-base font-semibold text-slate-900">
              FinOps Engineering Badges &amp; Achievements ({badges.filter((b) => b.unlocked).length}/{badges.length} Unlocked)
            </h3>
          </div>
          <span className="text-xs text-slate-500">Click any badge for criteria</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
          {badges.map((badge) => (
            <button
              key={badge.id}
              type="button"
              onClick={() => {
                setSelectedBadge(badge);
                soundManager.playClick();
              }}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                badge.unlocked
                  ? 'bg-slate-50 border-slate-200 hover:border-slate-400'
                  : 'bg-slate-50/50 border-slate-200 opacity-60 hover:opacity-80'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className={`p-2.5 rounded-lg border ${
                  badge.unlocked
                    ? 'bg-[#0E2238] border-[#0E2238] text-[#5FD3BF]'
                    : 'bg-slate-200 border-slate-300 text-slate-500'
                }`}>
                  {renderBadgeIcon(badge.iconName, 'w-5 h-5')}
                </div>
                {badge.unlocked ? (
                  <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Unlocked</span>
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Locked</span>
                  </span>
                )}
              </div>

              <div className="mt-3">
                <h4 className="text-xs font-bold text-slate-900 tracking-tight">
                  {badge.name}
                </h4>
                <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {badge.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl border ${
                selectedBadge.unlocked
                  ? 'bg-[#0E2238] border-[#0E2238] text-[#5FD3BF]'
                  : 'bg-slate-100 border-slate-200 text-slate-500'
              }`}>
                {renderBadgeIcon(selectedBadge.iconName, 'w-6 h-6')}
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 tracking-tight">
                  {selectedBadge.name}
                </h4>
                <span className="text-xs text-slate-500 uppercase tracking-wider font-mono">
                  Category: {selectedBadge.category}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {selectedBadge.description}
            </p>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
              <div className="font-semibold text-slate-900">Unlock Requirement:</div>
              <div className="text-slate-600">{selectedBadge.requirement}</div>
            </div>

            {selectedBadge.unlocked && selectedBadge.unlockedAt && (
              <div className="text-xs text-emerald-700 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Earned {selectedBadge.unlockedAt}</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => setSelectedBadge(null)}
              className="w-full py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors rounded-lg cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
