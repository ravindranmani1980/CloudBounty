import React, { useState, useEffect } from 'react';
import {
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Play,
  Pause,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Activity,
  Layers,
  Server
} from 'lucide-react';
import { CloudAccount, AnomalyAlert, AuditLogEntry, SpendPoint, CloudProvider } from '../types/finops';
import { CloudIcon } from './CloudIcon';
import { HISTORICAL_SPEND, SERVICE_BREAKDOWN } from '../data/initialData';
import { soundManager } from '../utils/audio';

interface OverviewViewProps {
  accounts: CloudAccount[];
  totalMonthlySpend: number;
  totalMonthlySavings: number;
  openOpportunitiesSavings: number;
  openOpportunitiesCount: number;
  anomalies: AnomalyAlert[];
  auditLogs: AuditLogEntry[];
  selectedProvider: CloudProvider;
  onSelectProvider: (provider: CloudProvider) => void;
  onNavigateToOpportunities: (filterProvider?: CloudProvider) => void;
  onSelectOpportunityById: (id: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  accounts,
  totalMonthlySpend,
  totalMonthlySavings,
  openOpportunitiesSavings,
  openOpportunitiesCount,
  anomalies,
  auditLogs,
  selectedProvider,
  onSelectProvider,
  onNavigateToOpportunities,
  onSelectOpportunityById
}) => {
  // Live ticker simulation
  const [isLiveSimulating, setIsLiveSimulating] = useState(true);
  const [liveSpendOffset, setLiveSpendOffset] = useState(0);
  const [hoveredPoint, setHoveredPoint] = useState<SpendPoint | null>(null);

  // Spend velocity simulation ($3.64 / min = ~0.06 per sec)
  useEffect(() => {
    if (!isLiveSimulating) return;
    const interval = setInterval(() => {
      setLiveSpendOffset((prev) => prev + 0.05);
    }, 1000);
    return () => clearInterval(interval);
  }, [isLiveSimulating]);

  const currentDynamicSpend = totalMonthlySpend + liveSpendOffset;
  const currentDailyBurn = Math.round(currentDynamicSpend / 30);
  const currentHourlyBurn = (currentDailyBurn / 24).toFixed(2);

  // Filter accounts based on selected provider
  const filteredAccounts = selectedProvider === 'all'
    ? accounts
    : accounts.filter((a) => a.provider === selectedProvider);

  // Filter anomalies based on selected provider
  const filteredAnomalies = selectedProvider === 'all'
    ? anomalies
    : anomalies.filter((a) => a.provider === selectedProvider);

  // SVG Chart Dimensions
  const chartHeight = 220;
  const chartWidth = 760;
  const maxSpend = 3600;

  const points = HISTORICAL_SPEND.map((pt, i) => {
    const x = (i / (HISTORICAL_SPEND.length - 1)) * (chartWidth - 60) + 40;
    const yTotal = chartHeight - (pt.total / maxSpend) * (chartHeight - 40) - 20;
    const yAws = chartHeight - (pt.aws / maxSpend) * (chartHeight - 40) - 20;
    const yAzure = chartHeight - (pt.azure / maxSpend) * (chartHeight - 40) - 20;
    const yGcp = chartHeight - (pt.gcp / maxSpend) * (chartHeight - 40) - 20;
    const yBudget = chartHeight - (pt.budget / maxSpend) * (chartHeight - 40) - 20;
    return { ...pt, x, yTotal, yAws, yAzure, yGcp, yBudget };
  });

  const totalPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.yTotal}`).join(' ');
  const awsPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.yAws}`).join(' ');
  const azurePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.yAzure}`).join(' ');
  const gcpPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.yGcp}`).join(' ');
  const budgetPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.yBudget}`).join(' ');

  return (
    <div className="space-y-6">
      {/* Top Controls Bar: Provider Selector & Live Simulation Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800">
          <button
            onClick={() => {
              onSelectProvider('all');
              soundManager.playClick();
            }}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              selectedProvider === 'all'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>All Clouds</span>
          </button>
          <button
            onClick={() => {
              onSelectProvider('aws');
              soundManager.playClick();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              selectedProvider === 'aws'
                ? 'bg-slate-800 text-amber-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CloudIcon provider="aws" size={14} />
            <span>AWS</span>
          </button>
          <button
            onClick={() => {
              onSelectProvider('azure');
              soundManager.playClick();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              selectedProvider === 'azure'
                ? 'bg-slate-800 text-blue-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CloudIcon provider="azure" size={14} />
            <span>Azure</span>
          </button>
          <button
            onClick={() => {
              onSelectProvider('gcp');
              soundManager.playClick();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              selectedProvider === 'gcp'
                ? 'bg-slate-800 text-rose-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CloudIcon provider="gcp" size={14} />
            <span>Google Cloud</span>
          </button>
        </div>

        {/* Live spend simulation toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-mono tabular-nums text-emerald-400 font-semibold">
              ${currentHourlyBurn}/hr
            </span>
            <span aria-hidden="true">·</span>
            <span>Live spend velocity</span>
          </div>
          <button
            onClick={() => {
              setIsLiveSimulating(!isLiveSimulating);
              soundManager.playClick();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700 transition-colors"
          >
            {isLiveSimulating ? (
              <>
                <Pause className="w-3 h-3 text-amber-400" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-emerald-400" />
                <span>Stream</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Monthly Spend */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Monthly Run-Rate</span>
            <span className="text-slate-500">M-o-M -8.2%</span>
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white">
            ${currentDynamicSpend.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            <span className="text-xs font-normal text-slate-400 ml-1">/mo</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
            <span className="font-mono tabular-nums text-slate-300">
              ${currentDailyBurn.toLocaleString()}
            </span>
            <span>daily burn</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400">Within budget</span>
          </div>
        </div>

        {/* Card 2: Realized Monthly Savings */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Verified Realized Savings</span>
            <span className="text-emerald-400 font-medium">This Cycle</span>
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-400">
            +${totalMonthlySavings.toLocaleString()}
            <span className="text-xs font-normal text-slate-400 ml-1">/mo</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
            <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono tabular-nums text-emerald-400 font-medium">+$297,600</span>
            <span>annualized ROI</span>
          </div>
        </div>

        {/* Card 3: Actionable Bounties */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Available Waste Bounties</span>
            <span className="text-amber-400 font-medium">{openOpportunitiesCount} Open</span>
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-amber-400">
            ${openOpportunitiesSavings.toLocaleString()}
            <span className="text-xs font-normal text-slate-400 ml-1">/mo</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>Claimable by engineers</span>
            <button
              onClick={() => onNavigateToOpportunities(selectedProvider)}
              className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
            >
              <span>View Board</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 4: Multi-Cloud Efficiency Score */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Cloud Accounts</span>
            <span className="text-slate-500">4 Connected</span>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <CloudIcon provider="aws" size={14} />
              <span>2</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <CloudIcon provider="azure" size={14} />
              <span>1</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <CloudIcon provider="gcp" size={14} />
              <span>1</span>
            </div>
          </div>
          <div className="text-xs text-slate-400 pt-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Telemetry sync active (100% health)</span>
          </div>
        </div>
      </div>

      {/* Main Charts & Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Spend Trajectory & Budget Variance */}
        <div className="lg:col-span-2 p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                30-Day Multi-Cloud Spend Trajectory
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Daily aggregate multi-cloud burn vs $3,200/day hard budget ceiling
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-emerald-400 rounded-full"></span>
                <span>Total Burn</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-amber-400 rounded-full"></span>
                <span>AWS</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-blue-400 rounded-full"></span>
                <span>Azure</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-rose-400 rounded-full"></span>
                <span>GCP</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-slate-600 border-b border-dashed border-slate-500"></span>
                <span>Budget</span>
              </div>
            </div>
          </div>

          {/* SVG Chart */}
          <div className="relative w-full overflow-x-auto pt-2">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-56 select-none"
            >
              {/* Horizontal Grid lines */}
              {[1000, 2000, 3000].map((val) => {
                const y = chartHeight - (val / maxSpend) * (chartHeight - 40) - 20;
                return (
                  <g key={val}>
                    <line
                      x1="40"
                      y1={y}
                      x2={chartWidth - 20}
                      y2={y}
                      stroke="#334155"
                      strokeDasharray="4 4"
                      strokeOpacity="0.4"
                    />
                    <text
                      x="10"
                      y={y + 4}
                      fill="#64748B"
                      fontSize="10"
                      fontFamily="JetBrains Mono"
                    >
                      ${val}
                    </text>
                  </g>
                );
              })}

              {/* Budget Threshold Line */}
              <path
                d={budgetPath}
                fill="none"
                stroke="#EF4444"
                strokeWidth="1.5"
                strokeDasharray="5 5"
                strokeOpacity="0.6"
              />

              {/* Individual Provider Lines */}
              <path
                d={awsPath}
                fill="none"
                stroke="#FBBF24"
                strokeWidth="1.5"
                strokeOpacity="0.7"
              />
              <path
                d={azurePath}
                fill="none"
                stroke="#60A5FA"
                strokeWidth="1.5"
                strokeOpacity="0.7"
              />
              <path
                d={gcpPath}
                fill="none"
                stroke="#FB7185"
                strokeWidth="1.5"
                strokeOpacity="0.7"
              />

              {/* Total Spend Thick Line */}
              <path
                d={totalPath}
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
              />

              {/* Interactive Data Points */}
              {points.map((pt, idx) => (
                <g key={idx}>
                  <circle
                    cx={pt.x}
                    cy={pt.yTotal}
                    r="4"
                    fill="#0F172A"
                    stroke="#10B981"
                    strokeWidth="2"
                    className="cursor-pointer hover:r-6 transition-all"
                    onMouseEnter={() => setHoveredPoint(pt)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  {/* X Axis Labels */}
                  <text
                    x={pt.x}
                    y={chartHeight - 2}
                    fill="#64748B"
                    fontSize="10"
                    textAnchor="middle"
                    fontFamily="JetBrains Mono"
                  >
                    {pt.date}
                  </text>
                </g>
              ))}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredPoint && (
              <div
                className="absolute top-4 right-4 p-3 bg-slate-950/95 border border-slate-800 rounded-lg shadow-xl text-xs space-y-1.5 pointer-events-none"
              >
                <div className="font-semibold text-slate-200 border-b border-slate-800 pb-1">
                  {hoveredPoint.date} Daily Spend
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-400">Total:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    ${hoveredPoint.total.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-amber-400">AWS:</span>
                  <span className="font-mono text-slate-200">${hoveredPoint.aws}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-blue-400">Azure:</span>
                  <span className="font-mono text-slate-200">${hoveredPoint.azure}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-rose-400">GCP:</span>
                  <span className="font-mono text-slate-200">${hoveredPoint.gcp}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Resource Allocation by Service */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Spend Allocation by Service
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Across all linked cloud infrastructures
            </p>
          </div>

          <div className="space-y-3.5 pt-1">
            {SERVICE_BREAKDOWN.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium truncate max-w-[170px]">
                    {item.name}
                  </span>
                  <div className="flex items-center gap-2 font-mono tabular-nums">
                    <span className="text-slate-200 font-semibold">
                      ${item.amount.toLocaleString()}
                    </span>
                    <span className="text-slate-400 text-[11px] w-8 text-right">
                      {item.percentage}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cloud Accounts & Cost Anomalies Dual Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Connected Cloud Accounts Table */}
        <div className="lg:col-span-2 p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Connected Cloud Accounts ({filteredAccounts.length})
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Live billing ingestion & resource utilization metrics
              </p>
            </div>
            <button
              onClick={() => onNavigateToOpportunities()}
              className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Scan for waste →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-2.5 font-medium">Account / Project</th>
                  <th className="pb-2.5 font-medium">Provider</th>
                  <th className="pb-2.5 font-medium">Environment</th>
                  <th className="pb-2.5 font-medium text-right">Monthly Spend</th>
                  <th className="pb-2.5 font-medium text-right">Daily Burn</th>
                  <th className="pb-2.5 font-medium text-right">Health</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono tabular-nums">
                {filteredAccounts.map((account) => (
                  <tr key={account.id} className="hover:bg-slate-950/40 transition-colors">
                    <td className="py-3 pr-2">
                      <div className="font-sans font-medium text-slate-200">
                        {account.name}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {account.accountId}
                      </div>
                    </td>
                    <td className="py-3 font-sans">
                      <div className="flex items-center gap-1.5 uppercase font-semibold text-slate-300">
                        <CloudIcon provider={account.provider} size={14} />
                        <span>{account.provider}</span>
                      </div>
                    </td>
                    <td className="py-3 font-sans text-slate-400">
                      {account.environment}
                    </td>
                    <td className="py-3 text-right font-semibold text-slate-200">
                      ${account.monthlySpend.toLocaleString()}
                    </td>
                    <td className="py-3 text-right text-slate-400">
                      ${account.dailyBurn.toLocaleString()}/d
                    </td>
                    <td className="py-3 text-right font-sans">
                      {account.status === 'active' ? (
                        <span className="text-emerald-400 font-medium">Nominal</span>
                      ) : (
                        <span className="text-amber-400 font-medium">Anomalies</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Cost Anomalies & Quick-Fix Bounties */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white tracking-tight">
                Cost Anomalies ({filteredAnomalies.length})
              </h3>
            </div>
            <span className="text-xs text-slate-500">Real-time</span>
          </div>

          <div className="space-y-3">
            {filteredAnomalies.map((anom) => (
              <div
                key={anom.id}
                className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 hover:border-slate-700 transition-colors space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <CloudIcon provider={anom.provider} size={13} />
                    <span className="font-semibold text-slate-300">{anom.service}</span>
                  </div>
                  <span className="font-mono text-amber-400 font-bold">
                    +{anom.spendIncreasePercent}%
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {anom.title}
                </p>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-900">
                  <span className="text-slate-500">
                    Est. waste: ~${anom.estimatedWasteMonthly}/mo
                  </span>
                  {anom.actionableOpportunityId && (
                    <button
                      onClick={() => onSelectOpportunityById(anom.actionableOpportunityId!)}
                      className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
                    >
                      <span>Fix Bounty</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Gamified FinOps Audit Log */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Recent Optimization Activity & Bounties Signed
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live audit stream of engineer cost optimizations and claimed XP rewards
            </p>
          </div>
          <span className="text-xs text-slate-500">Tamper-proof ledger</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-2.5 font-medium">Timestamp</th>
                <th className="pb-2.5 font-medium">Engineer</th>
                <th className="pb-2.5 font-medium">Optimization Executed</th>
                <th className="pb-2.5 font-medium">Cloud</th>
                <th className="pb-2.5 font-medium text-right">Monthly Savings</th>
                <th className="pb-2.5 font-medium text-right">XP Earned</th>
                <th className="pb-2.5 font-medium text-right">Verification Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono tabular-nums">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-950/40 transition-colors">
                  <td className="py-3 text-slate-500">{log.timestamp}</td>
                  <td className="py-3 font-sans font-medium text-slate-200">
                    {log.engineerName}
                  </td>
                  <td className="py-3 font-sans text-slate-300 max-w-sm truncate">
                    {log.opportunityTitle}
                  </td>
                  <td className="py-3 font-sans">
                    <div className="flex items-center gap-1.5 uppercase font-medium text-slate-300">
                      <CloudIcon provider={log.provider} size={13} />
                      <span>{log.provider}</span>
                    </div>
                  </td>
                  <td className="py-3 text-right font-bold text-emerald-400">
                    +${log.savingsAmount.toLocaleString()}/mo
                  </td>
                  <td className="py-3 text-right font-bold text-amber-400">
                    +{log.xpEarned} XP
                  </td>
                  <td className="py-3 text-right text-slate-500 text-[11px]">
                    {log.verificationHash}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
