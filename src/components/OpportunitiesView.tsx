import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  Zap,
  ArrowRight,
  Sparkles,
  Leaf,
  Filter,
  Check
} from 'lucide-react';
import { OptimizationOpportunity, CloudProvider, ImpactTier, EffortLevel } from '../types/finops';
import { CloudIcon } from './CloudIcon';
import { soundManager } from '../utils/audio';

interface OpportunitiesViewProps {
  opportunities: OptimizationOpportunity[];
  onSelectOpportunity: (opportunity: OptimizationOpportunity) => void;
  initialProviderFilter?: CloudProvider;
}

export const OpportunitiesView: React.FC<OpportunitiesViewProps> = ({
  opportunities,
  onSelectOpportunity,
  initialProviderFilter = 'all'
}) => {
  const [providerFilter, setProviderFilter] = useState<CloudProvider>(initialProviderFilter);
  const [impactFilter, setImpactFilter] = useState<string>('all');
  const [effortFilter, setEffortFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'claimed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering logic
  const filtered = opportunities.filter((opp) => {
    if (providerFilter !== 'all' && opp.provider !== providerFilter) return false;
    if (impactFilter !== 'all' && opp.impact !== impactFilter) return false;
    if (effortFilter !== 'all' && opp.effort !== effortFilter) return false;
    if (statusFilter !== 'all' && opp.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = opp.title.toLowerCase().includes(q);
      const matchService = opp.service.toLowerCase().includes(q);
      const matchDesc = opp.description.toLowerCase().includes(q);
      const matchRes = opp.affectedResources.some((r) => r.toLowerCase().includes(q));
      if (!matchTitle && !matchService && !matchDesc && !matchRes) return false;
    }
    return true;
  });

  const totalOpenSavings = opportunities
    .filter((o) => o.status === 'open')
    .reduce((acc, curr) => acc + curr.monthlySavings, 0);

  const totalOpenXp = opportunities
    .filter((o) => o.status === 'open')
    .reduce((acc, curr) => acc + curr.xpReward, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 bg-slate-900 border border-slate-800 rounded-xl">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Optimization Operations</span>
            <span aria-hidden="true">·</span>
            <span>Active Waste Bounties</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight mt-1">
            FinOps Opportunity & Bounty Board
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Claim and execute verified optimizations across AWS, Azure, and Google Cloud to earn engineer XP.
          </p>
        </div>

        <div className="flex items-center gap-6 p-3 bg-slate-950 rounded-lg border border-slate-800">
          <div>
            <div className="text-[11px] text-slate-400">Total Bounty Pool</div>
            <div className="text-lg font-bold font-mono tabular-nums text-emerald-400">
              ${totalOpenSavings.toLocaleString()}
              <span className="text-xs font-normal text-slate-400">/mo</span>
            </div>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <div className="text-[11px] text-slate-400">Total Reward Pool</div>
            <div className="text-lg font-bold font-mono tabular-nums text-amber-400">
              +{totalOpenXp.toLocaleString()} XP
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by resource, service, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        {/* Filter Tabs & Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Cloud Provider Segmented Control */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
            {(['all', 'aws', 'azure', 'gcp'] as CloudProvider[]).map((p) => (
              <button
                key={p}
                onClick={() => {
                  setProviderFilter(p);
                  soundManager.playClick();
                }}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  providerFilter === p
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {p === 'all' ? 'All' : p.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
            <button
              onClick={() => {
                setStatusFilter('all');
                soundManager.playClick();
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                statusFilter === 'all'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({opportunities.length})
            </button>
            <button
              onClick={() => {
                setStatusFilter('open');
                soundManager.playClick();
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                statusFilter === 'open'
                  ? 'bg-slate-800 text-amber-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Open ({opportunities.filter((o) => o.status === 'open').length})
            </button>
            <button
              onClick={() => {
                setStatusFilter('claimed');
                soundManager.playClick();
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                statusFilter === 'claimed'
                  ? 'bg-slate-800 text-emerald-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Claimed ({opportunities.filter((o) => o.status === 'claimed').length})
            </button>
          </div>

          {/* Effort filter dropdown */}
          <select
            value={effortFilter}
            onChange={(e) => {
              setEffortFilter(e.target.value);
              soundManager.playClick();
            }}
            className="px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-300 focus:outline-none"
          >
            <option value="all">All Efforts</option>
            <option value="Quick Win">Quick Win (&lt; 1 hr)</option>
            <option value="Medium">Medium Effort</option>
            <option value="Architectural">Architectural</option>
          </select>

          {/* Impact filter dropdown */}
          <select
            value={impactFilter}
            onChange={(e) => {
              setImpactFilter(e.target.value);
              soundManager.playClick();
            }}
            className="px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-300 focus:outline-none"
          >
            <option value="all">All Impacts</option>
            <option value="CRITICAL">Critical Impact</option>
            <option value="HIGH">High Impact</option>
            <option value="MEDIUM">Medium Impact</option>
            <option value="LOW">Low Impact</option>
          </select>
        </div>
      </div>

      {/* Opportunities Cards Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-xl space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
          <h3 className="text-base font-bold text-white">No Matching Bounties Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your provider, status, or search filters to view other opportunities.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((opp) => (
            <div
              key={opp.id}
              className={`group p-5 bg-slate-900 border rounded-xl transition-all space-y-4 ${
                opp.status === 'claimed'
                  ? 'border-slate-800/60 opacity-80'
                  : 'border-slate-800 hover:border-slate-700 hover:shadow-lg hover:shadow-slate-950/40'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  {/* Clean unboxed metadata with separators */}
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1 font-semibold uppercase text-slate-300">
                      <CloudIcon provider={opp.provider} size={13} />
                      {opp.provider}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{opp.service}</span>
                    <span aria-hidden="true">·</span>
                    <span>{opp.effort}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white tracking-tight group-hover:text-emerald-300 transition-colors">
                    {opp.title}
                  </h3>
                </div>

                {/* Impact Label */}
                <div className="text-[11px] font-mono uppercase tracking-wider shrink-0">
                  {opp.impact === 'CRITICAL' && (
                    <span className="text-rose-400 font-semibold">Critical Impact</span>
                  )}
                  {opp.impact === 'HIGH' && (
                    <span className="text-amber-400 font-semibold">High Impact</span>
                  )}
                  {opp.impact === 'MEDIUM' && (
                    <span className="text-blue-400 font-semibold">Medium Impact</span>
                  )}
                  {opp.impact === 'LOW' && (
                    <span className="text-slate-400 font-semibold">Low Impact</span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {opp.description}
              </p>

              {/* Metrics Strip */}
              <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-950/60 rounded-lg border border-slate-800/80 text-xs">
                <div>
                  <div className="text-[11px] text-slate-500">Monthly Savings</div>
                  <div className="font-bold font-mono tabular-nums text-emerald-400 mt-0.5">
                    +${opp.monthlySavings.toLocaleString()}
                    <span className="text-[10px] text-slate-500 font-normal">/mo</span>
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500">XP Bounty</div>
                  <div className="font-bold font-mono tabular-nums text-amber-400 mt-0.5">
                    +{opp.xpReward} XP
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500">Carbon Offset</div>
                  <div className="font-bold font-mono tabular-nums text-cyan-400 mt-0.5">
                    -{opp.carbonSavingsKg} kg
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between pt-1 text-xs border-t border-slate-800/60">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span>{opp.resourceCount} affected items</span>
                  <span aria-hidden="true">·</span>
                  <span>{opp.region}</span>
                </div>

                {opp.status === 'claimed' ? (
                  <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                    <Check className="w-3.5 h-3.5" />
                    <span>Claimed by {opp.claimedBy || 'Engineer'}</span>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      onSelectOpportunity(opp);
                      soundManager.playClick();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors rounded-md shadow-sm shadow-emerald-500/20 cursor-pointer"
                  >
                    <span>Execute Bounty</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
