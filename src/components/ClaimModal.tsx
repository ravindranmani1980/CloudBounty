import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { X, CheckCircle2, ShieldAlert, Terminal, ArrowRight, Loader2, Sparkles, Copy, Check } from 'lucide-react';
import { OptimizationOpportunity } from '../types/finops';
import { CloudIcon } from './CloudIcon';
import { soundManager } from '../utils/audio';

interface ClaimModalProps {
  opportunity: OptimizationOpportunity | null;
  onClose: () => void;
  onConfirmClaim: (opportunity: OptimizationOpportunity) => void;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({
  opportunity,
  onClose,
  onConfirmClaim
}) => {
  const [executionState, setExecutionState] = useState<'idle' | 'executing' | 'success'>('idle');
  const [executionStep, setExecutionStep] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    setExecutionState('idle');
    setExecutionStep(0);
  }, [opportunity]);

  if (!opportunity) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(opportunity.remediationScript);
    setCopiedCode(true);
    soundManager.playClick();
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleStartExecution = () => {
    setExecutionState('executing');
    setExecutionStep(1);
    soundManager.playClick();

    // Step 1: Snapshot and safety audit
    setTimeout(() => {
      setExecutionStep(2);
      soundManager.playClick();
    }, 900);

    // Step 2: Deprovisioning & applying fix
    setTimeout(() => {
      setExecutionStep(3);
      soundManager.playClick();
    }, 1800);

    // Step 3: Verifying zero downtime
    setTimeout(() => {
      setExecutionState('success');
      soundManager.playRewardClaimed();

      // Trigger celebratory confetti blast
      try {
        confetti({
          particleCount: 90,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#10B981', '#38BDF8', '#F59E0B', '#A855F7']
        });
      } catch {
        // ignore in case canvas is unavailable
      }
    }, 2700);
  };

  const handleFinish = () => {
    onConfirmClaim(opportunity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <CloudIcon provider={opportunity.provider} size={20} />
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="uppercase tracking-wider font-semibold text-slate-300">
                  {opportunity.provider.toUpperCase()}
                </span>
                <span aria-hidden="true">·</span>
                <span>{opportunity.service}</span>
                <span aria-hidden="true">·</span>
                <span>{opportunity.region}</span>
              </div>
              <h2 className="text-base font-bold text-white tracking-tight mt-0.5">
                {opportunity.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {executionState === 'idle' && (
            <>
              {/* Financial & Gaming Impact Grid */}
              <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-950/60 rounded-lg border border-slate-800/80">
                <div>
                  <div className="text-xs text-slate-400">Monthly Reduction</div>
                  <div className="text-xl font-bold font-mono tabular-nums text-emerald-400 mt-0.5">
                    -${opportunity.monthlySavings.toLocaleString()}
                    <span className="text-xs font-normal text-slate-400">/mo</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">XP Bounty Reward</div>
                  <div className="text-xl font-bold font-mono tabular-nums text-amber-400 mt-0.5">
                    +{opportunity.xpReward} XP
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Carbon Offset</div>
                  <div className="text-xl font-bold font-mono tabular-nums text-cyan-400 mt-0.5">
                    -{opportunity.carbonSavingsKg} kg
                    <span className="text-xs font-normal text-slate-400"> CO2e</span>
                  </div>
                </div>
              </div>

              {/* Rationale and Details */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Remediation Context & Rationale
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {opportunity.description}
                </p>
                <div className="text-xs text-slate-400 bg-slate-950/40 p-3 rounded-lg border border-slate-800/60">
                  <span className="font-semibold text-slate-200">Engineering Recommendation: </span>
                  {opportunity.rationale}
                </div>
              </div>

              {/* Affected Resources List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-slate-300 uppercase tracking-wider">
                    Target Resources ({opportunity.resourceCount})
                  </span>
                  <span>Region: {opportunity.region}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-slate-300">
                  {opportunity.affectedResources.map((res, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-slate-300"
                    >
                      {res}
                    </span>
                  ))}
                  {opportunity.resourceCount > opportunity.affectedResources.length && (
                    <span className="px-2 py-0.5 text-slate-500">
                      +{opportunity.resourceCount - opportunity.affectedResources.length} more resources
                    </span>
                  )}
                </div>
              </div>

              {/* Remediation Code Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Automated Remediation Script ({opportunity.remediationType})</span>
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
                  <code>{opportunity.remediationScript}</code>
                </pre>
              </div>
            </>
          )}

          {/* Executing Pipeline */}
          {executionState === 'executing' && (
            <div className="py-8 space-y-6 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <Loader2 className="w-7 h-7 text-emerald-400 animate-spin" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">
                  Executing Cloud Optimization
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Applying policy changes to {opportunity.service}
                </p>
              </div>

              {/* Steps Progress */}
              <div className="max-w-md mx-auto space-y-3 text-left">
                <div className="flex items-center justify-between text-xs p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-300">1. Generating safety snapshots & dependency check</span>
                  {executionStep >= 1 ? (
                    executionStep === 1 ? (
                      <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )
                  ) : (
                    <span className="text-slate-600">Pending</span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-300">2. Terminating idle resources / resizing instances</span>
                  {executionStep >= 2 ? (
                    executionStep === 2 ? (
                      <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )
                  ) : (
                    <span className="text-slate-600">Pending</span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-300">3. Validating zero downtime & signing FinOps ledger</span>
                  {executionStep >= 3 ? (
                    <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                  ) : (
                    <span className="text-slate-600">Pending</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Success Celebration */}
          {executionState === 'success' && (
            <div className="py-6 space-y-6 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-emerald-400 animate-pulse" />
              </div>

              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-emerald-400">
                  Optimization Verified & Executed
                </span>
                <h3 className="text-2xl font-extrabold text-white mt-1">
                  Bounty Claimed Successfully!
                </h3>
                <p className="text-sm text-slate-300 mt-1 max-w-md mx-auto">
                  You successfully optimized {opportunity.service} and slashed monthly cloud spend.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto p-4 bg-slate-950/80 rounded-xl border border-slate-800">
                <div className="text-center">
                  <div className="text-xs text-slate-400">Recurring Savings</div>
                  <div className="text-xl font-bold font-mono tabular-nums text-emerald-400 mt-0.5">
                    +${opportunity.monthlySavings.toLocaleString()}/mo
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-slate-400">XP Credited</div>
                  <div className="text-xl font-bold font-mono tabular-nums text-amber-400 mt-0.5">
                    +{opportunity.xpReward} XP
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Recorded to company FinOps Audit Log with verified checksum</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/60">
          {executionState === 'idle' ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStartExecution}
                className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors rounded-lg shadow-sm shadow-emerald-500/20 cursor-pointer"
              >
                <span>Execute & Claim Bounty</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          ) : executionState === 'executing' ? (
            <div className="w-full text-center text-xs text-slate-500 py-1">
              Optimization in progress... please hold while resources are decommissioned.
            </div>
          ) : (
            <button
              onClick={handleFinish}
              className="w-full py-2.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors rounded-lg shadow-sm shadow-emerald-500/20 cursor-pointer"
            >
              Collect Rewards & Return to Dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
