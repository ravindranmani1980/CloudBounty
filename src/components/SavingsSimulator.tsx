import React, { useState } from 'react';
import {
  Sliders,
  DollarSign,
  TrendingDown,
  Sparkles,
  Leaf,
  Plus,
  CheckCircle2,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface SavingsSimulatorProps {
  onDeploySimulatedQuest: (quest: {
    title: string;
    description: string;
    provider: 'aws' | 'azure' | 'gcp';
    service: string;
    monthlySavings: number;
    xpReward: number;
  }) => void;
}

export const SavingsSimulator: React.FC<SavingsSimulatorProps> = ({
  onDeploySimulatedQuest
}) => {
  // Lever States
  const [offHoursPercent, setOffHoursPercent] = useState(65);
  const [spotAdoptionPercent, setSpotAdoptionPercent] = useState(45);
  const [storageTieringPercent, setStorageTieringPercent] = useState(70);
  const [savingsPlansCoverage, setSavingsPlansCoverage] = useState(80);
  const [deployed, setDeployed] = useState(false);

  // Real-time calculation math
  // Base non-prod compute: ~$14,000/mo. If 65% shut down during nights/weekends -> saves ~$4,550
  const offHoursSavings = Math.round((offHoursPercent / 100) * 7000);

  // Base batch & async worker compute: ~$16,000/mo. Spot discount ~60% -> saves ~$5,760
  const spotSavings = Math.round((spotAdoptionPercent / 100) * 9600);

  // Base storage footprint: 240TB across AWS S3, Azure Blob, GCS (~$5,000/mo) -> saves ~$2,250
  const storageSavings = Math.round((storageTieringPercent / 100) * 3200);

  // Base steady-state on-demand compute: ~$25,000/mo. Savings plans discount ~35% -> saves ~$6,300
  const savingsPlansSavings = Math.round(((savingsPlansCoverage - 30) / 70) * 6300);

  const totalSimulatedMonthlySavings =
    offHoursSavings + spotSavings + storageSavings + savingsPlansSavings;
  const totalSimulatedAnnualSavings = totalSimulatedMonthlySavings * 12;
  const simulatedXpReward = Math.round(totalSimulatedMonthlySavings * 0.22);
  const simulatedCarbonOffset = Math.round(totalSimulatedMonthlySavings * 0.12);

  const handleDeployQuest = () => {
    onDeploySimulatedQuest({
      title: `Multi-Cloud Strategic Policy Sprint (${savingsPlansCoverage}% SP / ${spotAdoptionPercent}% Spot)`,
      description: `Targeted organizational sprint executing weekend non-prod auto-shutdown (${offHoursPercent}%), batch worker spot migration (${spotAdoptionPercent}%), and storage tiering.`,
      provider: 'aws',
      service: 'Compute & Storage Governance',
      monthlySavings: totalSimulatedMonthlySavings,
      xpReward: simulatedXpReward
    });
    setDeployed(true);
    soundManager.playRewardClaimed();
    setTimeout(() => setDeployed(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>What-If Modeling Sandbox</span>
          <span aria-hidden="true">·</span>
          <span>Strategic FinOps Projections</span>
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Multi-Cloud Savings & Optimization Simulator
        </h2>
        <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
          Adjust infrastructure policy levers across AWS, Azure, and Google Cloud to simulate potential monthly cost reductions, carbon offset, and unlocked engineering bounty points.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Policy Levers */}
        <div className="lg:col-span-2 p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white tracking-tight">
                Policy Parameters & Optimization Levers
              </h3>
            </div>
            <button
              onClick={() => {
                setOffHoursPercent(65);
                setSpotAdoptionPercent(45);
                setStorageTieringPercent(70);
                setSavingsPlansCoverage(80);
                soundManager.playClick();
              }}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              Reset to Defaults
            </button>
          </div>

          <div className="space-y-6">
            {/* Lever 1: Off-Hours Dev Shutdown */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-200">
                    Non-Prod & Staging Auto-Shutdown (Nights & Weekends)
                  </span>
                  <p className="text-[11px] text-slate-400">
                    Automatically power off test/dev EC2, Azure VMs, and GKE nodes during 68 non-working hours/week.
                  </p>
                </div>
                <div className="text-right font-mono tabular-nums shrink-0 ml-4">
                  <span className="text-sm font-bold text-emerald-400">{offHoursPercent}%</span>
                  <div className="text-[11px] text-slate-400">+${offHoursSavings.toLocaleString()}/mo</div>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={offHoursPercent}
                onChange={(e) => setOffHoursPercent(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>

            {/* Lever 2: Spot & Preemptible Adoption */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-200">
                    Spot & Preemptible Instance Adoption on Batch/Async Nodes
                  </span>
                  <p className="text-[11px] text-slate-400">
                    Shift stateless background queue workers and ETL pipelines to excess cloud capacity.
                  </p>
                </div>
                <div className="text-right font-mono tabular-nums shrink-0 ml-4">
                  <span className="text-sm font-bold text-emerald-400">{spotAdoptionPercent}%</span>
                  <div className="text-[11px] text-slate-400">+${spotSavings.toLocaleString()}/mo</div>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="90"
                step="5"
                value={spotAdoptionPercent}
                onChange={(e) => setSpotAdoptionPercent(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>

            {/* Lever 3: Storage Intelligent Tiering */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-200">
                    Storage Intelligent Tiering & Cold Archival Policies
                  </span>
                  <p className="text-[11px] text-slate-400">
                    Automate transitions for AWS S3 Glacier Instant, Azure Cool Blob, and GCP Nearline.
                  </p>
                </div>
                <div className="text-right font-mono tabular-nums shrink-0 ml-4">
                  <span className="text-sm font-bold text-emerald-400">{storageTieringPercent}%</span>
                  <div className="text-[11px] text-slate-400">+${storageSavings.toLocaleString()}/mo</div>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={storageTieringPercent}
                onChange={(e) => setStorageTieringPercent(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>

            {/* Lever 4: Savings Plans & RIs Coverage */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-200">
                    Compute Savings Plans & Reserved Commitments Coverage
                  </span>
                  <p className="text-[11px] text-slate-400">
                    Lock in 1-year and 3-year commitments for predictable baseline workloads across AWS & Azure.
                  </p>
                </div>
                <div className="text-right font-mono tabular-nums shrink-0 ml-4">
                  <span className="text-sm font-bold text-emerald-400">{savingsPlansCoverage}%</span>
                  <div className="text-[11px] text-slate-400">+${savingsPlansSavings.toLocaleString()}/mo</div>
                </div>
              </div>
              <input
                type="range"
                min="30"
                max="95"
                step="5"
                value={savingsPlansCoverage}
                onChange={(e) => setSavingsPlansCoverage(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right 1 Col: Projected ROI & Bounty Deployment */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Simulated Outcome & Impact
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Calculated on real multi-cloud telemetry baseline
              </p>
            </div>

            {/* Big Projected Savings */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="text-xs text-slate-400">Potential Monthly Reduction</div>
              <div className="text-3xl font-extrabold font-mono tabular-nums text-emerald-400">
                +${totalSimulatedMonthlySavings.toLocaleString()}
                <span className="text-xs font-normal text-slate-400 ml-1">/mo</span>
              </div>
              <div className="text-xs text-slate-400 pt-1 flex items-center justify-between">
                <span>Annualized ROI:</span>
                <span className="font-mono text-slate-200 font-semibold">
                  ${totalSimulatedAnnualSavings.toLocaleString()}/yr
                </span>
              </div>
            </div>

            {/* Gaming & Sustainability Perks */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
                <div className="flex items-center gap-2 text-slate-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Engineer XP Bounty Pool</span>
                </div>
                <span className="font-mono font-bold text-amber-400">
                  +{simulatedXpReward.toLocaleString()} XP
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-lg border border-slate-800">
                <div className="flex items-center gap-2 text-slate-300">
                  <Leaf className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Cloud Carbon Abatement</span>
                </div>
                <span className="font-mono font-bold text-cyan-400">
                  -{simulatedCarbonOffset.toLocaleString()} kg CO2e
                </span>
              </div>
            </div>
          </div>

          {/* Action Button: Deploy Sprint Quest */}
          <div className="space-y-2">
            <button
              onClick={handleDeployQuest}
              disabled={deployed}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 transition-colors rounded-lg shadow-sm shadow-emerald-500/20 cursor-pointer"
            >
              {deployed ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  <span>Sprint Quest Added to Board!</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-slate-950" />
                  <span>Deploy as Team Sprint Quest</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-slate-500">
              Converts these simulation parameters into a live claimable optimization task.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
