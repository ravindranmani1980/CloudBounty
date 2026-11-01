import React, { useState } from 'react';
import {
  Sliders,
  Sparkles,
  Leaf,
  Plus,
  CheckCircle2
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
  const [offHoursPercent, setOffHoursPercent] = useState(65);
  const [spotAdoptionPercent, setSpotAdoptionPercent] = useState(45);
  const [storageTieringPercent, setStorageTieringPercent] = useState(70);
  const [savingsPlansCoverage, setSavingsPlansCoverage] = useState(80);
  const [deployed, setDeployed] = useState(false);

  const offHoursSavings = Math.round((offHoursPercent / 100) * 7000);
  const spotSavings = Math.round((spotAdoptionPercent / 100) * 9600);
  const storageSavings = Math.round((storageTieringPercent / 100) * 3200);
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
    <div className="space-y-8">
      {/* Banner */}
      <section className="xh-panel space-y-2">
        <div className="xh-kicker">
          <span className="k">Maniq | Sweep · What-If Modeling Sandbox</span>
          <span className="tag">Strategic FinOps Projections</span>
        </div>
        <div className="pt-2">
          <h2 className="text-xl font-bold text-[#EEF3F1] tracking-tight">
            Multi-Cloud Savings &amp; Optimization Simulator
          </h2>
          <p className="text-xs text-[#A9B7BF] max-w-2xl leading-relaxed mt-1">
            Adjust infrastructure policy levers across AWS, Azure, and Google Cloud to simulate potential monthly cost reductions, carbon offset, and unlocked engineering bounty points.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Policy Levers */}
        <section className="lg:col-span-2 p-6 bg-white border border-slate-200 rounded-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-[#5FD3BF] flex items-center justify-center">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <span className="rm-kicker">01 / Policy Parameters</span>
                <h3 className="text-base font-semibold text-slate-900">
                  Interactive Cloud Governance Levers
                </h3>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setOffHoursPercent(65);
                setSpotAdoptionPercent(45);
                setStorageTieringPercent(70);
                setSavingsPlansCoverage(80);
                soundManager.playClick();
              }}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Reset to Defaults
            </button>
          </div>

          <div className="space-y-6">
            {/* Lever 1 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-900">
                    Non-Prod &amp; Staging Auto-Shutdown (Nights &amp; Weekends)
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Automatically power off test/dev EC2, Azure VMs, and GKE nodes during 68 non-working hours/week.
                  </p>
                </div>
                <div className="text-right font-mono tabular-nums shrink-0 ml-4">
                  <span className="text-sm font-bold text-slate-900">{offHoursPercent}%</span>
                  <div className="text-[11px] text-emerald-700 font-semibold">+${offHoursSavings.toLocaleString()}/mo</div>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={offHoursPercent}
                onChange={(e) => setOffHoursPercent(Number(e.target.value))}
                className="w-full accent-[#0E2238] cursor-pointer"
              />
            </div>

            {/* Lever 2 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-900">
                    Spot &amp; Preemptible Instance Adoption on Batch/Async Nodes
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Shift stateless background queue workers and ETL pipelines to excess cloud capacity.
                  </p>
                </div>
                <div className="text-right font-mono tabular-nums shrink-0 ml-4">
                  <span className="text-sm font-bold text-slate-900">{spotAdoptionPercent}%</span>
                  <div className="text-[11px] text-emerald-700 font-semibold">+${spotSavings.toLocaleString()}/mo</div>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="90"
                step="5"
                value={spotAdoptionPercent}
                onChange={(e) => setSpotAdoptionPercent(Number(e.target.value))}
                className="w-full accent-[#0E2238] cursor-pointer"
              />
            </div>

            {/* Lever 3 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-900">
                    Storage Intelligent Tiering &amp; Cold Archival Policies
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Automate transitions for AWS S3 Glacier Instant, Azure Cool Blob, and GCP Nearline.
                  </p>
                </div>
                <div className="text-right font-mono tabular-nums shrink-0 ml-4">
                  <span className="text-sm font-bold text-slate-900">{storageTieringPercent}%</span>
                  <div className="text-[11px] text-emerald-700 font-semibold">+${storageSavings.toLocaleString()}/mo</div>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={storageTieringPercent}
                onChange={(e) => setStorageTieringPercent(Number(e.target.value))}
                className="w-full accent-[#0E2238] cursor-pointer"
              />
            </div>

            {/* Lever 4 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-900">
                    Compute Savings Plans &amp; Reserved Commitments Coverage
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Lock in 1-year and 3-year commitments for predictable baseline workloads across AWS &amp; Azure.
                  </p>
                </div>
                <div className="text-right font-mono tabular-nums shrink-0 ml-4">
                  <span className="text-sm font-bold text-slate-900">{savingsPlansCoverage}%</span>
                  <div className="text-[11px] text-emerald-700 font-semibold">+${savingsPlansSavings.toLocaleString()}/mo</div>
                </div>
              </div>
              <input
                type="range"
                min="30"
                max="95"
                step="5"
                value={savingsPlansCoverage}
                onChange={(e) => setSavingsPlansCoverage(Number(e.target.value))}
                className="w-full accent-[#0E2238] cursor-pointer"
              />
            </div>
          </div>
        </section>

        {/* Right 1 Col: Projected ROI & Bounty Deployment */}
        <section className="p-6 bg-white border border-slate-200 rounded-xl flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="rm-kicker">02 / Projected Impact</span>
              <h3 className="text-base font-semibold text-slate-900">
                Simulated Outcome &amp; ROI
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Calculated on live multi-cloud telemetry baseline
              </p>
            </div>

            <div className="p-4 bg-[#0D1C2D] text-[#EEF3F1] rounded-xl border border-[#3E6E86]/40 space-y-2">
              <div className="text-xs text-[#A9B7BF] font-mono">Potential Monthly Reduction</div>
              <div className="text-3xl font-bold font-mono tabular-nums text-[#5FD3BF]">
                +${totalSimulatedMonthlySavings.toLocaleString()}
                <span className="text-xs font-normal text-[#A9B7BF] ml-1">/mo</span>
              </div>
              <div className="text-xs text-[#A9B7BF] pt-1 border-t border-[#3E6E86]/30 flex items-center justify-between">
                <span>Annualized ROI:</span>
                <span className="font-mono text-[#EBC385] font-semibold">
                  ${totalSimulatedAnnualSavings.toLocaleString()}/yr
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Engineer XP Bounty Pool</span>
                </div>
                <span className="font-mono font-bold text-amber-700">
                  +{simulatedXpReward.toLocaleString()} XP
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <Leaf className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Cloud Carbon Abatement</span>
                </div>
                <span className="font-mono font-bold text-emerald-800">
                  -{simulatedCarbonOffset.toLocaleString()} kg CO2e
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={handleDeployQuest}
              disabled={deployed}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 transition-colors rounded-lg cursor-pointer"
            >
              {deployed ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#5FD3BF]" />
                  <span>Sprint Quest Added to Board!</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-[#5FD3BF]" />
                  <span>Deploy as Team Sprint Quest</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-slate-500">
              Converts these simulation parameters into a live claimable optimization task.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
