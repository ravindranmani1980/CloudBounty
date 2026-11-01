import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  ArrowRight,
  Check
} from 'lucide-react';
import { OptimizationOpportunity, CloudProvider } from '../types/finops';
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
    <div className="space-y-8">
      {/* Top Postrix Command Panel */}
      <section className="xh-panel">
        <div className="xh-kicker">
          <span className="k">Maniq | Sweep · Optimization Operations &amp; Active Waste Bounties</span>
          <span className="tag">AWS · Azure · GCP · Automated Remediation</span>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4">
          <div>
            <h2 className="text-xl font-bold text-[#EEF3F1] tracking-tight">
              FinOps Opportunity &amp; Bounty Board
            </h2>
            <p className="text-xs text-[#A9B7BF] mt-1">
              Claim and execute verified optimizations across AWS, Azure, and Google Cloud to reduce burn and earn engineer XP.
            </p>
          </div>

          <div className="flex items-center gap-6 p-3.5 bg-[#102236] rounded-xl border border-[#C9D3D9]/15">
            <div>
              <div className="text-[11px] text-[#A9B7BF] font-mono">Total Bounty Pool</div>
              <div className="text-lg font-bold font-mono tabular-nums text-[#5FD3BF]">
                ${totalOpenSavings.toLocaleString()}
                <span className="text-xs font-normal text-[#A9B7BF]">/mo</span>
              </div>
            </div>
            <div className="h-8 w-px bg-[#C9D3D9]/20" />
            <div>
              <div className="text-[11px] text-[#A9B7BF] font-mono">Total Reward Pool</div>
              <div className="text-lg font-bold font-mono tabular-nums text-[#EBC385]">
                +{totalOpenXp.toLocaleString()} XP
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-4 bg-white border border-slate-200 rounded-xl">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by resource ID, cloud service, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
          />
        </div>

        {/* Filter Tabs & Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Cloud Provider Segmented Control */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {(['all', 'aws', 'azure', 'gcp'] as CloudProvider[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setProviderFilter(p);
                  soundManager.playClick();
                }}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  providerFilter === p
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {p === 'all' ? 'All' : p.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => {
                setStatusFilter('all');
                soundManager.playClick();
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({opportunities.length})
            </button>
            <button
              type="button"
              onClick={() => {
                setStatusFilter('open');
                soundManager.playClick();
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                statusFilter === 'open'
                  ? 'bg-white text-amber-800 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Open ({opportunities.filter((o) => o.status === 'open').length})
            </button>
            <button
              type="button"
              onClick={() => {
                setStatusFilter('claimed');
                soundManager.playClick();
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                statusFilter === 'claimed'
                  ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
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
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
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
            className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
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
        <div className="p-12 text-center bg-white border border-slate-200 rounded-xl space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-700 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No Matching Bounties Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your provider, status, or search filters to view other opportunities.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((opp) => (
            <div
              key={opp.id}
              className={`group p-5 bg-white border rounded-xl transition-all space-y-4 ${
                opp.status === 'claimed'
                  ? 'border-slate-200 opacity-75'
                  : 'border-slate-200 hover:border-slate-400'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                    <span className="flex items-center gap-1 font-semibold uppercase text-slate-800">
                      <CloudIcon provider={opp.provider} size={13} />
                      {opp.provider}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{opp.service}</span>
                    <span aria-hidden="true">·</span>
                    <span>{opp.effort}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight group-hover:text-[#0E2238] transition-colors">
                    {opp.title}
                  </h3>
                </div>

                {/* Impact Label */}
                <div className="text-[11px] font-mono uppercase tracking-wider shrink-0">
                  {opp.impact === 'CRITICAL' && (
                    <span className="text-red-600 font-semibold">Critical Impact</span>
                  )}
                  {opp.impact === 'HIGH' && (
                    <span className="text-amber-700 font-semibold">High Impact</span>
                  )}
                  {opp.impact === 'MEDIUM' && (
                    <span className="text-teal-700 font-semibold">Medium Impact</span>
                  )}
                  {opp.impact === 'LOW' && (
                    <span className="text-slate-500 font-semibold">Low Impact</span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {opp.description}
              </p>

              {/* Metrics Strip */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <div>
                  <div className="text-[11px] text-slate-500">Monthly Savings</div>
                  <div className="font-bold font-mono tabular-nums text-emerald-700 mt-0.5">
                    +${opp.monthlySavings.toLocaleString()}
                    <span className="text-[10px] text-slate-500 font-normal">/mo</span>
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500">XP Bounty</div>
                  <div className="font-bold font-mono tabular-nums text-amber-700 mt-0.5">
                    +{opp.xpReward} XP
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500">Carbon Offset</div>
                  <div className="font-bold font-mono tabular-nums text-slate-800 mt-0.5">
                    -{opp.carbonSavingsKg} kg
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between pt-2 text-xs border-t border-slate-200">
                <div className="flex items-center gap-1.5 text-slate-500 font-mono">
                  <span>{opp.resourceCount} resources</span>
                  <span aria-hidden="true">·</span>
                  <span>{opp.region}</span>
                </div>

                {opp.status === 'claimed' ? (
                  <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <Check className="w-3.5 h-3.5" />
                    <span>Claimed by {opp.claimedBy || 'Engineer'}</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      onSelectOpportunity(opp);
                      soundManager.playClick();
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors rounded-lg cursor-pointer"
                  >
                    <span>Execute Bounty</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#5FD3BF]" />
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
