import React, { useState } from 'react';
import { X, Plus, Terminal } from 'lucide-react';
import { OptimizationOpportunity, CloudProvider, ImpactTier, EffortLevel } from '../types/finops';
import { CloudIcon } from './CloudIcon';
import { soundManager } from '../utils/audio';

interface NewBountyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBounty: (bounty: OptimizationOpportunity) => void;
}

export const NewBountyModal: React.FC<NewBountyModalProps> = ({
  isOpen,
  onClose,
  onCreateBounty
}) => {
  const [title, setTitle] = useState('');
  const [provider, setProvider] = useState<'aws' | 'azure' | 'gcp'>('aws');
  const [service, setService] = useState('');
  const [region, setRegion] = useState('us-east-1');
  const [impact, setImpact] = useState<ImpactTier>('HIGH');
  const [effort, setEffort] = useState<EffortLevel>('Quick Win');
  const [monthlySavings, setMonthlySavings] = useState(1200);
  const [description, setDescription] = useState('');
  const [resources, setResources] = useState('');
  const [remediationScript, setRemediationScript] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !service.trim()) return;

    const resourceList = resources
      .split(',')
      .map((r) => r.trim())
      .filter(Boolean);

    const xpReward = Math.round(monthlySavings * 0.25);
    const carbonSavingsKg = Math.round(monthlySavings * 0.12);

    const newOpp: OptimizationOpportunity = {
      id: `opp-custom-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || 'Identified resource allocation inefficiency with verified cost reduction path.',
      provider,
      service: service.trim(),
      resourceCount: resourceList.length || 1,
      affectedResources: resourceList.length > 0 ? resourceList : ['res-custom-target-01'],
      region,
      monthlySavings: Number(monthlySavings),
      annualSavings: Number(monthlySavings) * 12,
      xpReward,
      impact,
      effort,
      carbonSavingsKg,
      status: 'open',
      remediationType: 'cli',
      rationale: 'Optimization verified through telemetry audit. Deprovisioning safely lowers monthly cloud overhead.',
      remediationScript:
        remediationScript.trim() ||
        `# Automated execution script for ${service}\necho "Executing remediation on ${provider}..."`
    };

    onCreateBounty(newOpp);
    soundManager.playRewardClaimed();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Propose New Cost-Saving Bounty
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Submit newly identified cloud waste to the team leaderboard
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 max-h-[75vh] overflow-y-auto space-y-4">
          {/* Cloud Provider Picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Cloud Provider</label>
            <div className="grid grid-cols-3 gap-2">
              {(['aws', 'azure', 'gcp'] as const).map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => {
                    setProvider(p);
                    soundManager.playClick();
                  }}
                  className={`flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-lg border transition-all ${
                    provider === p
                      ? 'bg-slate-800 border-slate-600 text-white shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <CloudIcon provider={p} size={14} />
                  <span className="uppercase">{p}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Bounty Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Decommission 8 Orphaned Snapshots in eu-central-1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          {/* Service & Region Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Service Category</label>
              <input
                type="text"
                required
                placeholder="e.g. CloudFront / NAT / EC2"
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Region</label>
              <input
                type="text"
                placeholder="e.g. us-east-1, westeurope"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>

          {/* Monthly Savings & Effort */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Monthly Savings ($)</label>
              <input
                type="number"
                min="50"
                max="100000"
                step="50"
                value={monthlySavings}
                onChange={(e) => setMonthlySavings(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Impact</label>
              <select
                value={impact}
                onChange={(e) => setImpact(e.target.value as ImpactTier)}
                className="w-full px-2.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-300 focus:outline-none"
              >
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Effort</label>
              <select
                value={effort}
                onChange={(e) => setEffort(e.target.value as EffortLevel)}
                className="w-full px-2.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-300 focus:outline-none"
              >
                <option value="Quick Win">Quick Win (&lt; 1h)</option>
                <option value="Medium">Medium Effort</option>
                <option value="Architectural">Architectural</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Description & Root Cause</label>
            <textarea
              rows={2}
              placeholder="Explain how this waste was detected and what can be safely removed..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          {/* Target Resources */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Target Resource IDs (comma separated)</label>
            <input
              type="text"
              placeholder="e.g. vol-0931ba, vol-0291ba, asg-staging-pool"
              value={resources}
              onChange={(e) => setResources(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          {/* Remediation Script */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Remediation Script (CLI or Terraform)</label>
            <textarea
              rows={3}
              placeholder="# CLI commands or Terraform snippet to remediate this resource"
              value={remediationScript}
              onChange={(e) => setRemediationScript(e.target.value)}
              className="w-full p-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-300 font-mono focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          {/* Footer Submit */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <div className="text-xs text-slate-400">
              Reward bounty: <span className="font-mono text-amber-400 font-bold">+{Math.round(monthlySavings * 0.25)} XP</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors rounded-lg shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Publish Bounty</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
