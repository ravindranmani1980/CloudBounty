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
  Sparkles
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

  const nextMilestone = milestones.find((m) => currentSavings < m.targetSavings) || milestones[milestones.length - 1];
  const maxTarget = milestones[milestones.length - 1].targetSavings;
  const overallProgressPercent = Math.min(100, Math.round((currentSavings / maxTarget) * 100));

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
    <div className="space-y-8">
      {/* Top Hero Banner with Animated Milestone Progress */}
      <section className="xh-panel space-y-6">
        <div className="xh-kicker">
          <span className="k">Maniq | Sweep · Quarterly FinOps Milestone Ladder</span>
          <span className="tag">{overallProgressPercent}% of $100k Titan Goal</span>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#EEF3F1] tracking-tight">
              Cloud Cost Milestone Road &amp; Engineering Perks
            </h2>
            <p className="text-xs text-[#A9B7BF] mt-1">
              Unlock department perks, conference sponsorships, and tech grants as cumulative verified savings grow.
            </p>
          </div>

          <div className="flex items-center gap-6 p-3.5 bg-[#102236] rounded-xl border border-[#C9D3D9]/15">
            <div>
              <div className="text-[11px] text-[#A9B7BF] font-mono">Current Validated Savings</div>
              <div className="text-xl font-bold font-mono tabular-nums text-[#5FD3BF]">
                +${currentSavings.toLocaleString()}
                <span className="text-xs font-normal text-[#A9B7BF]">/mo</span>
              </div>
            </div>
            <div className="h-8 w-px bg-[#C9D3D9]/20" />
            <div>
              <div className="text-[11px] text-[#A9B7BF] font-mono">Next Objective ({nextMilestone.title})</div>
              <div className="text-xl font-bold font-mono tabular-nums text-[#EBC385]">
                ${remainingDollars.toLocaleString()} left
              </div>
            </div>
          </div>
        </div>

        {/* Big Animated Milestone Road Visual */}
        <div className="space-y-3 pt-3 border-t border-[#C9D3D9]/15">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#EEF3F1]">
              Next Tier Progress: {nextTierPercent}% toward {nextMilestone.title}
            </span>
            <span className="font-mono tabular-nums text-[#5FD3BF]">
              ${currentSavings.toLocaleString()} / ${nextMilestone.targetSavings.toLocaleString()}
            </span>
          </div>

          <div className="relative w-full bg-[#081420] h-3.5 rounded-full overflow-hidden border border-[#C9D3D9]/20 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-[#2BB5A0] via-[#5FD3BF] to-[#D79A45] rounded-full transition-all duration-1000"
              style={{ width: `${overallProgressPercent}%` }}
            />
          </div>

          <div className="grid grid-cols-5 gap-2 pt-1 text-center text-xs">
            {milestones.map((m) => {
              const isPassed = currentSavings >= m.targetSavings;
              return (
                <div key={m.id} className="space-y-1">
                  <div className={`mx-auto w-7 h-7 rounded-full flex items-center justify-center border transition-all ${
                    isPassed
                      ? 'bg-[#2BB5A0]/20 border-[#5FD3BF] text-[#5FD3BF]'
                      : 'bg-[#081420] border-[#C9D3D9]/20 text-[#7F909A]'
                  }`}>
                    {renderMilestoneIcon(m.icon, 'w-3.5 h-3.5')}
                  </div>
                  <div className={`font-mono text-[11px] font-semibold ${isPassed ? 'text-[#5FD3BF]' : 'text-[#A9B7BF]'}`}>
                    ${m.targetSavings / 1000}k
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Milestone Tiers Detailed Cards */}
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
              className={`p-5 rounded-xl border transition-all flex flex-col justify-between space-y-4 bg-white ${
                isUnlocked ? 'border-slate-300' : 'border-slate-200 opacity-85'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg border ${
                    isUnlocked
                      ? 'bg-[#0E2238] border-[#0E2238] text-[#5FD3BF]'
                      : 'bg-slate-100 border-slate-200 text-slate-500'
                  }`}>
                    {renderMilestoneIcon(tier.icon, 'w-5 h-5')}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                      {tier.title}
                    </h4>
                    <div className="font-mono text-xs text-emerald-700 font-semibold mt-0.5">
                      ${tier.targetSavings.toLocaleString()} Target
                    </div>
                  </div>
                </div>

                {isUnlocked ? (
                  <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Unlocked</span>
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" />
                    <span>{progressToTier}%</span>
                  </span>
                )}
              </div>

              {!isUnlocked && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Progress</span>
                    <span className="font-mono tabular-nums">
                      ${currentSavings.toLocaleString()} / ${tier.targetSavings.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className="h-full bg-[#0E2238] rounded-full"
                      style={{ width: `${progressToTier}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-amber-800 font-semibold text-[11px] uppercase tracking-wider font-mono">
                  <Gift className="w-3.5 h-3.5" />
                  <span>Unlocked Reward &amp; Perk</span>
                </div>
                <p className="text-slate-700 leading-relaxed text-xs">
                  {tier.rewardDescription}
                </p>
              </div>

              <div className="pt-1">
                {isUnlocked ? (
                  isClaimed ? (
                    <div className="w-full py-2 text-center text-xs font-medium text-emerald-800 bg-emerald-50 rounded-lg border border-emerald-200">
                      Voucher Issued &amp; Claimed
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleClaimPerk(tier.id)}
                      className="w-full py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors rounded-lg cursor-pointer"
                    >
                      Claim Department Perk Voucher
                    </button>
                  )
                ) : (
                  <div className="w-full py-2 text-center text-xs text-slate-500 bg-slate-50 rounded-lg border border-slate-200 font-mono">
                    Save ${(tier.targetSavings - currentSavings).toLocaleString()} more to unlock
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
