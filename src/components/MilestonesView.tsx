import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  ShieldCheck,
  Zap,
  Crown,
  Gem,
  CheckCircle2,
  Lock,
  Gift,
  ArrowRight,
  Sparkles,
  Calendar
} from 'lucide-react';
import { MilestoneTier } from '../types/finops';
import { soundManager } from '../utils/audio';

interface MilestonesViewProps {
  milestones: MilestoneTier[];
  currentSavings: number;
  onClaimMilestoneReward: (milestoneId: string) => void;
}

export const MilestonesView: React.FC<MilestonesViewProps> = ({
  milestones,
  currentSavings,
  onClaimMilestoneReward
}) => {
  const [claimedPerks, setClaimedPerks] = useState<Record<string, boolean>>({
    'tier-1': true,
    'tier-2': true
  });

  // Find next upcoming milestone
  const nextMilestone = milestones.find((m) => currentSavings < m.targetSavings) || milestones[milestones.length - 1];
  const maxTarget = milestones[milestones.length - 1].targetSavings;
  const overallProgressPercent = Math.min(100, Math.round((currentSavings / maxTarget) * 100));

  // Next milestone progress
  const prevMilestoneSavings = milestones
    .filter((m) => m.targetSavings <= currentSavings)
    .reduce((max, m) => Math.max(max, m.targetSavings), 0);

  const nextTierGap = nextMilestone.targetSavings - prevMilestoneSavings;
  const currentTierProgress = currentSavings - prevMilestoneSavings;
  const nextTierPercent = Math.min(100, Math.max(0, Math.round((currentTierProgress / nextTierGap) * 100)));
  const remainingDollars = Math.max(0, nextMilestone.targetSavings - currentSavings);

  const renderMilestoneIcon = (icon: string, className = 'w-5 h-5') => {
    switch (icon) {
      case 'ShieldCheck':
        return <ShieldCheck className={className} />;
      case 'Zap':
        return <Zap className={className} />;
      case 'Trophy':
        return <Trophy className={className} />;
      case 'Crown':
        return <Crown className={className} />;
      case 'Gem':
        return <Gem className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  const handleClaimPerk = (tierId: string) => {
    setClaimedPerks((prev) => ({ ...prev, [tierId]: true }));
    soundManager.playRewardClaimed();
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
    onClaimMilestoneReward(tierId);
  };

  return (
    <div className="space-y-6">
      {/* Top Hero Banner with Animated Milestone Progress */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Savings Milestone Road</span>
              <span aria-hidden="true">·</span>
              <span>Quarterly Engineering Objectives</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mt-1">
              Cloud Cost Milestone Ladder
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Unlock department perks, conference sponsorships, and tech grants as cumulative savings grow.
            </p>
          </div>

          <div className="flex items-center gap-6 p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div>
              <div className="text-[11px] text-slate-400">Current Validated Savings</div>
              <div className="text-xl font-bold font-mono tabular-nums text-emerald-400">
                +${currentSavings.toLocaleString()}
                <span className="text-xs font-normal text-slate-400">/mo</span>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <div className="text-[11px] text-slate-400">Next Objective ({nextMilestone.title})</div>
              <div className="text-xl font-bold font-mono tabular-nums text-amber-400">
                ${remainingDollars.toLocaleString()} left
              </div>
            </div>
          </div>
        </div>

        {/* Big Animated Milestone Road Visual */}
        <div className="space-y-3 pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">
              Next Tier Progress: {nextTierPercent}% toward {nextMilestone.title}
            </span>
            <span className="font-mono tabular-nums text-slate-400">
              ${currentSavings.toLocaleString()} / ${nextMilestone.targetSavings.toLocaleString()}
            </span>
          </div>

          {/* Animated Glow Bar */}
          <div className="relative w-full bg-slate-950 h-3.5 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 rounded-full transition-all duration-1000 shadow-lg shadow-emerald-500/20"
              style={{ width: `${overallProgressPercent}%` }}
            />
          </div>

          {/* Milestones Node Markers */}
          <div className="grid grid-cols-5 gap-2 pt-1 text-center text-xs">
            {milestones.map((m) => {
              const isPassed = currentSavings >= m.targetSavings;
              return (
                <div key={m.id} className="space-y-1">
                  <div className={`mx-auto w-7 h-7 rounded-full flex items-center justify-center border transition-all ${
                    isPassed
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                      : 'bg-slate-950 border-slate-800 text-slate-600'
                  }`}>
                    {renderMilestoneIcon(m.icon, 'w-3.5 h-3.5')}
                  </div>
                  <div className={`font-mono text-[11px] font-semibold ${isPassed ? 'text-emerald-400' : 'text-slate-500'}`}>
                    ${(m.targetSavings / 1000)}k
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Milestone Tiers Detailed Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white tracking-tight">
          Milestone Progression Tiers & Rewards
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {milestones.map((tier) => {
            const isUnlocked = currentSavings >= tier.targetSavings;
            const isClaimed = claimedPerks[tier.id];
            const progressToTier = Math.min(
              100,
              Math.max(0, Math.round((currentSavings / tier.targetSavings) * 100))
            );

            return (
              <div
                key={tier.id}
                className={`p-5 rounded-xl border transition-all flex flex-col justify-between space-y-4 ${
                  isUnlocked
                    ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    : 'bg-slate-900/60 border-slate-800/60 opacity-80'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-lg border ${
                      isUnlocked
                        ? 'bg-amber-400/10 border-amber-400/30 text-amber-400'
                        : 'bg-slate-950 border-slate-800 text-slate-600'
                    }`}>
                      {renderMilestoneIcon(tier.icon, 'w-5 h-5')}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white tracking-tight">
                        {tier.title}
                      </h4>
                      <div className="font-mono text-xs text-emerald-400 font-semibold mt-0.5">
                        ${tier.targetSavings.toLocaleString()} Target
                      </div>
                    </div>
                  </div>

                  {isUnlocked ? (
                    <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Unlocked</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" />
                      <span>{progressToTier}%</span>
                    </span>
                  )}
                </div>

                {/* Progress bar inside card */}
                {!isUnlocked && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Progress</span>
                      <span className="font-mono tabular-nums">
                        ${currentSavings.toLocaleString()} / ${tier.targetSavings.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${progressToTier}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Reward Description */}
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-[11px] uppercase tracking-wider">
                    <Gift className="w-3.5 h-3.5" />
                    <span>Unlocked Reward & Perk</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-xs">
                    {tier.rewardDescription}
                  </p>
                </div>

                {/* Action Button */}
                <div className="pt-1">
                  {isUnlocked ? (
                    isClaimed ? (
                      <div className="w-full py-2 text-center text-xs text-slate-400 bg-slate-950 rounded-lg border border-slate-800">
                        Voucher Issued & Claimed
                      </div>
                    ) : (
                      <button
                        onClick={() => handleClaimPerk(tier.id)}
                        className="w-full py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors rounded-lg shadow-sm cursor-pointer"
                      >
                        Claim Department Perk Voucher
                      </button>
                    )
                  ) : (
                    <div className="w-full py-2 text-center text-xs text-slate-500 bg-slate-950/40 rounded-lg border border-slate-800/50">
                      Save ${(tier.targetSavings - currentSavings).toLocaleString()} more to unlock
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
