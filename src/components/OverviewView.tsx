import React, { useState, useEffect } from 'react';
import {
  TrendingDown,
  AlertTriangle,
  Play,
  Pause,
  ArrowRight,
  CheckCircle2,
  Activity,
  Gamepad2,
  Flame,
  Plug,
  RefreshCw,
  ExternalLink,
  Target,
  BarChart3,
  Leaf,
  FileDown,
  Server
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  BarChart,
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import { CloudAccount, AnomalyAlert, AuditLogEntry, SpendPoint, CloudProvider, OptimizationOpportunity } from '../types/finops';
import { CloudIcon } from './CloudIcon';
import { HISTORICAL_SPEND, SERVICE_BREAKDOWN, INITIAL_OPPORTUNITIES } from '../data/initialData';
import { soundManager } from '../utils/audio';
import { ExecutiveReportModal } from './ExecutiveReportModal';

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
  onLaunchGame: () => void;
  onOpenConnectCloud: () => void;
  onSyncAccount?: (accountId: string) => void;
  currentUserXp: number;
  currentUserLevel: number;
  opportunities?: OptimizationOpportunity[];
}

interface SavingsForecastPoint {
  month: string;
  projected: number;
  actual?: number;
  stretchTarget: number;
  awsSavings: number;
  azureSavings: number;
  gcpSavings: number;
  cumulativeProjected: number;
  cumulativeActual?: number;
  status: 'verified' | 'current' | 'projected';
}

const SIX_MONTH_SAVINGS_FORECAST: SavingsForecastPoint[] = [
  {
    month: "Nov '26",
    projected: 22000,
    actual: 24800,
    stretchTarget: 26000,
    awsSavings: 13200,
    azureSavings: 7100,
    gcpSavings: 4500,
    cumulativeProjected: 22000,
    cumulativeActual: 24800,
    status: 'verified'
  },
  {
    month: "Dec '26",
    projected: 27500,
    actual: 29400,
    stretchTarget: 32000,
    awsSavings: 15400,
    azureSavings: 8500,
    gcpSavings: 5500,
    cumulativeProjected: 49500,
    cumulativeActual: 54200,
    status: 'current'
  },
  {
    month: "Jan '27",
    projected: 33000,
    stretchTarget: 38000,
    awsSavings: 17200,
    azureSavings: 9800,
    gcpSavings: 6000,
    cumulativeProjected: 82500,
    status: 'projected'
  },
  {
    month: "Feb '27",
    projected: 38500,
    stretchTarget: 44000,
    awsSavings: 20100,
    azureSavings: 11200,
    gcpSavings: 7200,
    cumulativeProjected: 121000,
    status: 'projected'
  },
  {
    month: "Mar '27",
    projected: 44000,
    stretchTarget: 51000,
    awsSavings: 23000,
    azureSavings: 12800,
    gcpSavings: 8200,
    cumulativeProjected: 165000,
    status: 'projected'
  },
  {
    month: "Apr '27",
    projected: 50000,
    stretchTarget: 58000,
    awsSavings: 26000,
    azureSavings: 14500,
    gcpSavings: 9500,
    cumulativeProjected: 215000,
    status: 'projected'
  }
];

interface CarbonSavingsItem {
  provider: string;
  providerKey: 'aws' | 'azure' | 'gcp' | 'total';
  currentMonth: number;
  previousMonth: number;
  diff: number;
  growth: string;
}

const CARBON_SAVINGS_DATA: CarbonSavingsItem[] = [
  {
    provider: 'AWS (EC2 / EBS / S3)',
    providerKey: 'aws',
    currentMonth: 1840,
    previousMonth: 1120,
    diff: 720,
    growth: '+64.3%'
  },
  {
    provider: 'Azure (VMs / SQL / Blob)',
    providerKey: 'azure',
    currentMonth: 960,
    previousMonth: 680,
    diff: 280,
    growth: '+41.2%'
  },
  {
    provider: 'Google Cloud (GKE / BQ)',
    providerKey: 'gcp',
    currentMonth: 620,
    previousMonth: 380,
    diff: 240,
    growth: '+63.2%'
  },
  {
    provider: 'Combined Multi-Cloud',
    providerKey: 'total',
    currentMonth: 3420,
    previousMonth: 2180,
    diff: 1240,
    growth: '+56.9%'
  }
];

interface SevenDaySpendPoint {
  day: string;
  date: string;
  total: number;
  aws: number;
  azure: number;
  gcp: number;
  budget: number;
  change: string;
}

const SEVEN_DAY_SPEND_TREND: SevenDaySpendPoint[] = [
  { day: 'Mon', date: 'Oct 26', total: 3190, aws: 1640, azure: 940, gcp: 610, budget: 3200, change: '-1.8%' },
  { day: 'Tue', date: 'Oct 27', total: 3110, aws: 1590, azure: 920, gcp: 600, budget: 3200, change: '-2.5%' },
  { day: 'Wed', date: 'Oct 28', total: 3260, aws: 1690, azure: 950, gcp: 620, budget: 3200, change: '+4.8%' },
  { day: 'Thu', date: 'Oct 29', total: 2980, aws: 1520, azure: 890, gcp: 570, budget: 3200, change: '-8.6%' },
  { day: 'Fri', date: 'Oct 30', total: 2890, aws: 1470, azure: 870, gcp: 550, budget: 3200, change: '-3.0%' },
  { day: 'Sat', date: 'Oct 31', total: 2740, aws: 1390, azure: 830, gcp: 520, budget: 3200, change: '-5.2%' },
  { day: 'Sun', date: 'Nov 01', total: 2660, aws: 1350, azure: 810, gcp: 500, budget: 3200, change: '-2.9%' }
];

export const OverviewView: React.FC<OverviewViewProps> = ({
  accounts,
  totalMonthlySpend,
  totalMonthlySavings,
  openOpportunitiesSavings,
  openOpportunitiesCount,
  anomalies,
  selectedProvider,
  onSelectProvider,
  onNavigateToOpportunities,
  onSelectOpportunityById,
  onLaunchGame,
  onOpenConnectCloud,
  onSyncAccount,
  opportunities = INITIAL_OPPORTUNITIES
}) => {
  const [isLiveSimulating, setIsLiveSimulating] = useState(true);
  const [liveSpendOffset, setLiveSpendOffset] = useState(0);
  const [hoveredPoint, setHoveredPoint] = useState<SpendPoint | null>(null);
  const [syncingAccountId, setSyncingAccountId] = useState<string | null>(null);
  const [forecastMetricView, setForecastMetricView] = useState<'monthly' | 'cumulative'>('monthly');
  const [isExecutiveReportModalOpen, setIsExecutiveReportModalOpen] = useState(false);

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

  const filteredAccounts = selectedProvider === 'all'
    ? accounts
    : accounts.filter((a) => a.provider === selectedProvider);

  const filteredAnomalies = selectedProvider === 'all'
    ? anomalies
    : anomalies.filter((a) => a.provider === selectedProvider);

  const handleTriggerSync = (accId: string) => {
    setSyncingAccountId(accId);
    soundManager.playClick();
    setTimeout(() => {
      setSyncingAccountId(null);
      if (onSyncAccount) onSyncAccount(accId);
    }, 1000);
  };

  // SVG Line Chart Calculations
  const chartWidth = 680;
  const chartHeight = 200;
  const maxSpend = 3600;
  const points = HISTORICAL_SPEND.map((pt, idx) => {
    const x = (idx / (HISTORICAL_SPEND.length - 1)) * (chartWidth - 60) + 40;
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

  const CustomForecastTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as SavingsForecastPoint;
      const isCumulative = forecastMetricView === 'cumulative';
      const valActual = isCumulative ? data.cumulativeActual : data.actual;
      const valProj = isCumulative ? data.cumulativeProjected : data.projected;
      const diff = valActual !== undefined && valProj !== undefined ? valActual - valProj : null;

      return (
        <div className="p-3.5 bg-[#081420] text-[#EEF3F1] border border-[#3E6E86]/60 rounded-xl shadow-xl text-xs space-y-2 min-w-[210px]">
          <div className="flex items-center justify-between border-b border-[#3E6E86]/40 pb-1.5 font-semibold text-white">
            <span>{data.month} Forecast</span>
            <span className="text-[10px] uppercase tracking-wider text-[#5FD3BF] font-mono">
              {data.status === 'verified' ? 'Verified' : data.status === 'current' ? 'Current Pacing' : 'Projected Model'}
            </span>
          </div>

          <div className="space-y-1 font-mono tabular-nums">
            {valActual !== undefined && (
              <div className="flex justify-between items-center text-[#5FD3BF] font-bold">
                <span>Actual Realized:</span>
                <span>+${valActual.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-[#EBC385]">
              <span>Projected Target:</span>
              <span>${valProj.toLocaleString()}</span>
            </div>
            {diff !== null && (
              <div className="flex justify-between items-center text-[11px] text-[#A9B7BF] pt-1 border-t border-[#3E6E86]/40 font-sans">
                <span>Variance:</span>
                <span className={`font-mono font-semibold ${diff >= 0 ? 'text-[#5FD3BF]' : 'text-red-400'}`}>
                  {diff >= 0 ? `+${diff.toLocaleString()} (+${Math.round((diff / valProj) * 100)}%)` : `${diff.toLocaleString()}`}
                </span>
              </div>
            )}
          </div>

          <div className="pt-1.5 border-t border-[#3E6E86]/40 text-[10px] text-[#A9B7BF] space-y-0.5">
            <div className="font-semibold text-[#EEF3F1]">Provider Contribution:</div>
            <div className="flex justify-between">
              <span className="text-[#EBC385]">AWS:</span>
              <span className="font-mono text-[#EEF3F1]">${data.awsSavings.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5FD3BF]">Azure:</span>
              <span className="font-mono text-[#EEF3F1]">${data.azureSavings.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-rose-300">GCP:</span>
              <span className="font-mono text-[#EEF3F1]">${data.gcpSavings.toLocaleString()}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomCarbonTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as CarbonSavingsItem;
      return (
        <div className="p-3 bg-[#081420] text-[#EEF3F1] border border-[#3E6E86]/60 rounded-xl shadow-xl text-xs space-y-1.5 min-w-[200px]">
          <div className="font-semibold text-white border-b border-[#3E6E86]/40 pb-1">
            {data.provider}
          </div>
          <div className="flex justify-between items-center text-[#5FD3BF] font-bold font-mono tabular-nums">
            <span>Current Month (Oct):</span>
            <span>{data.currentMonth.toLocaleString()} kg CO2e</span>
          </div>
          <div className="flex justify-between items-center text-[#A9B7BF] font-mono tabular-nums">
            <span>Previous Month (Sep):</span>
            <span>{data.previousMonth.toLocaleString()} kg CO2e</span>
          </div>
          <div className="flex justify-between items-center text-[#EBC385] pt-1 border-t border-[#3E6E86]/40 font-mono tabular-nums font-semibold">
            <span>Net Abatement:</span>
            <span>+{data.diff} kg ({data.growth})</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const sevenDayTotal = SEVEN_DAY_SPEND_TREND.reduce((sum, d) => sum + d.total, 0);
  const sevenDayAvg = Math.round(sevenDayTotal / SEVEN_DAY_SPEND_TREND.length);
  const sevenDayDelta = Math.round(
    ((SEVEN_DAY_SPEND_TREND[SEVEN_DAY_SPEND_TREND.length - 1].total - SEVEN_DAY_SPEND_TREND[0].total) /
      SEVEN_DAY_SPEND_TREND[0].total) *
      1000
  ) / 10;

  const CustomSevenDayTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as SevenDaySpendPoint;
      return (
        <div className="p-3 bg-[#081420] text-[#EEF3F1] border border-[#3E6E86]/60 rounded-xl shadow-xl text-xs space-y-1.5 min-w-[185px] font-mono tabular-nums">
          <div className="flex items-center justify-between font-sans font-semibold text-white border-b border-[#3E6E86]/40 pb-1">
            <span>{data.day}, {data.date}</span>
            <span className="text-[10px] font-mono text-[#5FD3BF]">{data.change} DoD</span>
          </div>
          <div className="flex justify-between items-center text-[#5FD3BF] font-bold">
            <span>Total Spend:</span>
            <span>${data.total.toLocaleString()}</span>
          </div>
          <div className="pt-1 border-t border-[#3E6E86]/40 text-[11px] space-y-0.5 text-[#A9B7BF]">
            <div className="flex justify-between">
              <span className="text-[#EBC385]">AWS:</span>
              <span className="text-[#EEF3F1]">${data.aws.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5FD3BF]">Azure:</span>
              <span className="text-[#EEF3F1]">${data.azure.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-rose-300">GCP:</span>
              <span className="text-[#EEF3F1]">${data.gcp.toLocaleString()}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* POSTRIX SIGNATURE DARK COMMAND PANEL (.xh-panel) */}
      <section className="xh-panel">
        <div className="xh-kicker">
          <span className="k">Multi-Cloud FinOps Governance &amp; Real-Time Resource Optimization</span>
          <span className="tag">AWS · Azure · Google Cloud · Live Telemetry</span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-b border-[#C9D3D9]/12">
          <div className="flex items-center gap-3.5">
            <div className="rm-mono-mark !w-11 !h-11 !text-base" aria-hidden="true">
              RM
            </div>
            <div>
              <h1 className="text-base font-semibold text-[#EEF3F1] leading-snug m-0 font-sans">
                Maniq | Sweep — Enterprise Cloud Spend &amp; Bounty Command
                <span className="block font-mono font-normal text-xs text-[#A9B7BF] mt-0.5">
                  Author: Ravindran Mani (
                  <a
                    href="https://ravindran.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#5FD3BF] hover:underline"
                  >
                    ravindran.in
                  </a>
                  ) · Live Velocity: ${currentHourlyBurn}/hr · {accounts.length} Connected Clouds
                </span>
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                onOpenConnectCloud();
                soundManager.playClick();
              }}
              className="xh-btn"
            >
              <Plug className="w-3.5 h-3.5 text-[#5FD3BF]" />
              <span>Connect Live Cloud</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsExecutiveReportModalOpen(true);
                soundManager.playClick();
              }}
              className="xh-btn"
            >
              <FileDown className="w-3.5 h-3.5 text-[#5FD3BF]" />
              <span>Executive PDF Report</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onLaunchGame();
                soundManager.playRewardClaimed();
              }}
              className="xh-btn primary"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch Cloud Raid (Play Game)</span>
            </button>
          </div>
        </div>

        {/* 4 Postrix .xh-metric Cards inside .xh-panel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-5">
          {/* 01: Monthly Run-Rate */}
          <div className="xh-metric">
            <div className="lbl">
              <span>01 · Monthly Run-Rate</span>
              <span className="inline-flex items-center gap-1 text-[#5FD3BF]">
                -8.2% MoM
              </span>
            </div>
            <div className="num">
              ${currentDynamicSpend.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              <span className="text-sm font-normal text-[#A9B7BF] ml-1">/ mo</span>
            </div>
            <p>
              Daily burn ${currentDailyBurn.toLocaleString()}/d across {accounts.length} active environments
            </p>
          </div>

          {/* 02: Verified Realized Savings */}
          <div className="xh-metric">
            <div className="lbl">
              <span>02 · Realized Savings</span>
              <span className="text-[#5FD3BF]">Verified Cycle</span>
            </div>
            <div className="num hi">
              +${totalMonthlySavings.toLocaleString()}
              <span className="text-xs font-normal text-[#A9B7BF] ml-1.5">/ mo</span>
            </div>
            <p>+$297,600 annualized ROI from completed cloud remediations</p>
          </div>

          {/* 03: Priority Bounty Queue */}
          <div className="xh-metric">
            <div className="lbl">
              <span>03 · Open Bounty Queue</span>
              <button
                type="button"
                onClick={() => onNavigateToOpportunities(selectedProvider)}
                className="text-[#EBC385] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
              >
                Inspect board →
              </button>
            </div>
            <div className="num flex items-baseline gap-2">
              <span className="text-[#EBC385]">${openOpportunitiesSavings.toLocaleString()}</span>
              <span className="text-xs font-normal text-[#A9B7BF]">/ mo</span>
            </div>
            <p>{openOpportunitiesCount} actionable optimization bounties ready to claim</p>
          </div>

          {/* 04: Cloud Carbon Abatement */}
          <div className="xh-metric">
            <div className="lbl">
              <span>04 · Carbon Abatement</span>
              <span className="text-[#5FD3BF]">+56.9% MoM</span>
            </div>
            <div className="num hi">
              3,420
              <span className="text-xs font-normal text-[#A9B7BF] ml-1.5">kg CO2e</span>
            </div>
            <p>Equivalent to 84 mature trees · AWS, Azure &amp; GCP combined</p>
          </div>
        </div>
      </section>

      {/* COMPACT 7-DAY SPEND TREND CARD (RECHARTS) */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Left: Summary & KPI Callouts */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#081420] text-[#5FD3BF] flex items-center justify-center shrink-0">
                <TrendingDown className="w-4 h-4" />
              </div>
              <div>
                <span className="rm-kicker !mb-0">Short-Window Velocity</span>
                <h2 className="text-base font-semibold text-slate-900 leading-tight">
                  Spend Trend (Last 7 Days)
                </h2>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Total multi-cloud daily expenditure from <span className="font-mono font-medium text-slate-700">Oct 26 – Nov 01</span> following automated EBS and GKE rightsizing sweeps.
            </p>

            <div className="grid grid-cols-3 gap-2.5 pt-1 font-mono tabular-nums">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="text-[10px] text-slate-500 font-sans">7-Day Total</div>
                <div className="text-sm font-bold text-slate-900 mt-0.5">
                  ${sevenDayTotal.toLocaleString()}
                </div>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="text-[10px] text-slate-500 font-sans">Daily Avg</div>
                <div className="text-sm font-bold text-[#0E2238] mt-0.5">
                  ${sevenDayAvg.toLocaleString()}/d
                </div>
              </div>
              <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-lg">
                <div className="text-[10px] text-emerald-800 font-sans">7-Day Delta</div>
                <div className="text-sm font-bold text-emerald-700 mt-0.5">
                  {sevenDayDelta}%
                </div>
              </div>
            </div>
          </div>

          {/* Right 2 Cols: Compact Recharts AreaChart */}
          <div className="lg:col-span-2 bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2 text-xs">
              <span className="font-semibold text-slate-800">
                7-Day Total Cloud Expenditure ($/day)
              </span>
              <div className="flex items-center gap-4 text-[11px] font-mono text-slate-600">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2 rounded-xs bg-[#2BB5A0] inline-block" /> Daily Total Spend
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-0.5 bg-[#D79A45] inline-block" /> $3,200 Daily Ceiling
                </span>
              </div>
            </div>

            <div className="w-full h-40">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={SEVEN_DAY_SPEND_TREND}
                  margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="sevenDaySpendFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2BB5A0" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#0E2238" stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="#475569"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#CBD5E1' }}
                  />
                  <YAxis
                    domain={[2200, 3400]}
                    stroke="#475569"
                    fontSize={10}
                    tickLine={false}
                    axisLine={{ stroke: '#CBD5E1' }}
                    tickFormatter={(val) => `$${val}`}
                    width={48}
                  />
                  <Tooltip content={<CustomSevenDayTooltip />} />
                  <ReferenceLine
                    y={3200}
                    stroke="#D79A45"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    name="Total Cloud Spend"
                    stroke="#0E2238"
                    strokeWidth={2.5}
                    fill="url(#sevenDaySpendFill)"
                    dot={{ r: 3.5, fill: '#2BB5A0', stroke: '#0E2238', strokeWidth: 1.5 }}
                    activeDot={{ r: 5, fill: '#D79A45', stroke: '#081420', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 01: 30-DAY SPEND TRAJECTORY & CLOUD FILTER */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-[#5FD3BF] flex items-center justify-center shrink-0 mt-0.5 font-mono text-xs font-semibold">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <span className="rm-kicker">01 / Multi-Cloud Spend Telemetry &amp; Allocation</span>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold text-slate-900">
                  30-Day Spend Trajectory &amp; Service Breakdown
                </h2>
                <span className="text-xs font-mono font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  Ceiling: $3,200/day
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time multi-cloud daily burn rate across AWS, Microsoft Azure, and Google Cloud Platform
              </p>
            </div>
          </div>

          {/* Cloud Filter Segmented Control & Stream Toggle */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
              {(['all', 'aws', 'azure', 'gcp'] as CloudProvider[]).map((prov) => (
                <button
                  key={prov}
                  type="button"
                  onClick={() => {
                    onSelectProvider(prov);
                    soundManager.playClick();
                  }}
                  className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    selectedProvider === prov
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {prov !== 'all' && <CloudIcon provider={prov} size={13} />}
                  <span>{prov === 'all' ? 'All Clouds' : prov === 'gcp' ? 'Google Cloud' : prov.toUpperCase()}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                setIsLiveSimulating(!isLiveSimulating);
                soundManager.playClick();
              }}
              className="px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              {isLiveSimulating ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-amber-600" />
                  <span>Pause Stream</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Resume Stream</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Line Chart */}
          <div className="lg:col-span-2 bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-slate-800">
                Daily Burn Velocity (Oct 01 – Oct 25)
              </span>
              <div className="flex items-center gap-4 text-slate-600 font-mono">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-0.5 bg-[#0E2238] inline-block" /> Total
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-0.5 bg-[#D79A45] inline-block" /> AWS
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-0.5 bg-[#2BB5A0] inline-block" /> Azure
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-0.5 bg-[#DC2626] inline-block" /> GCP
                </span>
              </div>
            </div>

            <div className="relative w-full overflow-x-auto pt-1">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-56 select-none"
              >
                {[1000, 2000, 3000].map((val) => {
                  const y = chartHeight - (val / maxSpend) * (chartHeight - 40) - 20;
                  return (
                    <g key={val}>
                      <line
                        x1="40"
                        y1={y}
                        x2={chartWidth - 20}
                        y2={y}
                        stroke="#CBD5E1"
                        strokeDasharray="4 4"
                      />
                      <text
                        x="6"
                        y={y + 4}
                        fill="#475569"
                        fontSize="10"
                        fontFamily="IBM Plex Mono"
                      >
                        ${val}
                      </text>
                    </g>
                  );
                })}

                <path
                  d={budgetPath}
                  fill="none"
                  stroke="#DC2626"
                  strokeWidth="1.5"
                  strokeDasharray="5 5"
                  strokeOpacity="0.65"
                />
                <path d={awsPath} fill="none" stroke="#D79A45" strokeWidth="1.75" />
                <path d={azurePath} fill="none" stroke="#2BB5A0" strokeWidth="1.75" />
                <path d={gcpPath} fill="none" stroke="#E11D48" strokeWidth="1.5" strokeOpacity="0.8" />
                <path d={totalPath} fill="none" stroke="#0E2238" strokeWidth="2.5" />

                {points.map((pt, idx) => (
                  <g key={idx}>
                    <circle
                      cx={pt.x}
                      cy={pt.yTotal}
                      r="4"
                      fill="#FFFFFF"
                      stroke="#0E2238"
                      strokeWidth="2"
                      className="cursor-pointer transition-all"
                      onMouseEnter={() => setHoveredPoint(pt)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                    <text
                      x={pt.x}
                      y={chartHeight - 2}
                      fill="#475569"
                      fontSize="10"
                      textAnchor="middle"
                      fontFamily="IBM Plex Mono"
                    >
                      {pt.date}
                    </text>
                  </g>
                ))}
              </svg>

              {hoveredPoint && (
                <div className="absolute top-3 right-3 p-3 bg-[#081420] text-[#EEF3F1] border border-[#3E6E86]/60 rounded-lg shadow-lg text-xs space-y-1 pointer-events-none font-mono">
                  <div className="font-sans font-semibold text-white border-b border-[#3E6E86]/40 pb-1">
                    {hoveredPoint.date} Spend Breakdown
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-[#A9B7BF]">Total:</span>
                    <span className="font-bold text-[#5FD3BF]">${hoveredPoint.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-[#EBC385]">AWS:</span>
                    <span>${hoveredPoint.aws}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-[#5FD3BF]">Azure:</span>
                    <span>${hoveredPoint.azure}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-rose-300">GCP:</span>
                    <span>${hoveredPoint.gcp}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right 1 Col: Service Allocation */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Spend Allocation by Service
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Distribution across compute, database, storage &amp; K8s
              </p>
            </div>

            <div className="space-y-3.5 pt-1">
              {SERVICE_BREAKDOWN.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-700 font-medium truncate max-w-[175px]">
                      {item.name}
                    </span>
                    <div className="flex items-center gap-2 font-mono tabular-nums">
                      <span className="text-slate-900 font-semibold">
                        ${item.amount.toLocaleString()}
                      </span>
                      <span className="text-slate-500 text-[11px] w-8 text-right">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: idx === 0 ? '#0E2238' : idx === 1 ? '#2BB5A0' : idx === 2 ? '#D79A45' : '#3E6E86'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 02: 6-MONTH PROJECTED VS ACTUAL SAVINGS FORECAST (RECHARTS) */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-[#5FD3BF] flex items-center justify-center shrink-0 mt-0.5 font-mono text-xs font-semibold">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <span className="rm-kicker">02 / Predictive FinOps Trajectory (Recharts)</span>
              <h2 className="text-lg font-semibold text-slate-900">
                Projected vs. Actual Cloud Spend Savings (Next 6 Months)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Comparison of verified realized savings against quarterly FinOps targets across AWS, Azure, and GCP (Nov 2026 – Apr 2027)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs shrink-0">
            <button
              type="button"
              onClick={() => {
                setForecastMetricView('monthly');
                soundManager.playClick();
              }}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                forecastMetricView === 'monthly'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly Incremental ($/mo)
            </button>
            <button
              type="button"
              onClick={() => {
                setForecastMetricView('cumulative');
                soundManager.playClick();
              }}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                forecastMetricView === 'cumulative'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cumulative Realized ($)
            </button>
          </div>
        </div>

        {/* Forecast Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono tabular-nums">
          <div>
            <div className="text-[11px] text-slate-500 font-sans">Current Verified Savings</div>
            <div className="text-lg font-bold text-emerald-700 mt-0.5">
              +${totalMonthlySavings.toLocaleString()}/mo
            </div>
            <div className="text-[11px] text-emerald-700 font-sans mt-0.5">+12.7% vs forecast target</div>
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-sans">6-Mo Projected Run-Rate</div>
            <div className="text-lg font-bold text-amber-700 mt-0.5">
              +$50,000/mo
            </div>
            <div className="text-[11px] text-slate-500 font-sans mt-0.5">Target by Apr 2027</div>
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-sans">Cumulative 6-Mo Impact</div>
            <div className="text-lg font-bold text-slate-900 mt-0.5">
              +$215,000
            </div>
            <div className="text-[11px] text-slate-500 font-sans mt-0.5">Total company capital saved</div>
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-sans">Milestone Alignment</div>
            <div className="text-lg font-bold text-slate-900 mt-0.5 font-sans">
              Tier 4 Pacing
            </div>
            <div className="text-[11px] text-emerald-700 font-sans mt-0.5">On track for Platinum ($60k)</div>
          </div>
        </div>

        {/* Recharts Chart Container */}
        <div className="w-full h-72 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={SIX_MONTH_SAVINGS_FORECAST}
              margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="actualSavingsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0E2238" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#2BB5A0" stopOpacity={0.75} />
                </linearGradient>
                <linearGradient id="stretchTargetGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2BB5A0" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#2BB5A0" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />

              <XAxis
                dataKey="month"
                stroke="#475569"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#CBD5E1' }}
              />

              <YAxis
                stroke="#475569"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#CBD5E1' }}
                tickFormatter={(value) => `$${value >= 1000 ? `${Math.round(value / 1000)}k` : value}`}
              />

              <Tooltip content={<CustomForecastTooltip />} />

              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: '12px', fontSize: '11px' }}
                formatter={(value) => <span className="text-slate-700 font-sans font-medium">{value}</span>}
              />

              <Area
                type="monotone"
                dataKey={forecastMetricView === 'cumulative' ? 'cumulativeProjected' : 'stretchTarget'}
                name="Stretch Objective"
                fill="url(#stretchTargetGradient)"
                stroke="#2BB5A0"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
              />

              {forecastMetricView === 'monthly' ? (
                <Bar
                  dataKey="actual"
                  name="Actual Realized Savings"
                  fill="url(#actualSavingsGradient)"
                  radius={[4, 4, 0, 0]}
                  barSize={38}
                />
              ) : (
                <Line
                  type="monotone"
                  dataKey="cumulativeActual"
                  name="Cumulative Actual Realized"
                  stroke="#0E2238"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#2BB5A0', stroke: '#0E2238', strokeWidth: 2 }}
                />
              )}

              <Line
                type="monotone"
                dataKey={forecastMetricView === 'cumulative' ? 'cumulativeProjected' : 'projected'}
                name="Projected Target (P50)"
                stroke="#D79A45"
                strokeWidth={2.5}
                strokeDasharray={forecastMetricView === 'monthly' ? '5 5' : undefined}
                dot={{ r: 4, fill: '#D79A45', stroke: '#FFFFFF', strokeWidth: 2 }}
              />

              <ReferenceLine
                y={forecastMetricView === 'cumulative' ? 100000 : 30000}
                label={{
                  value: forecastMetricView === 'cumulative' ? 'Diamond Titan ($100k)' : 'Gold Target ($30k)',
                  fill: '#475569',
                  fontSize: 10,
                  position: 'insideTopLeft'
                }}
                stroke="#94A3B8"
                strokeDasharray="3 3"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* SECTION 03: CARBON SAVINGS BAR CHART CARD */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-[#5FD3BF] flex items-center justify-center shrink-0 mt-0.5 font-mono text-xs font-semibold">
              <Leaf className="w-4 h-4" />
            </div>
            <div>
              <span className="rm-kicker">03 / Green FinOps Sustainability Telemetry</span>
              <h2 className="text-lg font-semibold text-slate-900">
                Cloud Carbon Savings by Provider: Current vs. Previous Month
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Verified carbon abatement (kg CO2e) from idle volume termination, rightsizing, and Graviton/ARM adoption
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-3.5 py-2 bg-emerald-50 border border-emerald-200 rounded-xl shrink-0">
            <div className="text-right">
              <div className="text-[10px] text-emerald-800 uppercase tracking-wider font-semibold">Total Abatement</div>
              <div className="text-sm font-bold font-mono tabular-nums text-emerald-900">
                3,420 kg CO2e
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-700 text-white font-mono text-xs font-semibold">
              +56.9% MoM
            </span>
          </div>
        </div>

        {/* Carbon Highlights Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono tabular-nums">
          <div>
            <div className="text-[11px] text-slate-600 font-sans flex items-center gap-1.5">
              <CloudIcon provider="aws" size={13} />
              <span>AWS Carbon Savings</span>
            </div>
            <div className="text-base font-bold text-slate-900 mt-1">1,840 kg</div>
            <div className="text-[11px] text-emerald-700 font-sans mt-0.5">+64.3% (+720 kg vs Sep)</div>
          </div>

          <div>
            <div className="text-[11px] text-slate-600 font-sans flex items-center gap-1.5">
              <CloudIcon provider="azure" size={13} />
              <span>Azure Carbon Savings</span>
            </div>
            <div className="text-base font-bold text-slate-900 mt-1">960 kg</div>
            <div className="text-[11px] text-emerald-700 font-sans mt-0.5">+41.2% (+280 kg vs Sep)</div>
          </div>

          <div>
            <div className="text-[11px] text-slate-600 font-sans flex items-center gap-1.5">
              <CloudIcon provider="gcp" size={13} />
              <span>Google Cloud Savings</span>
            </div>
            <div className="text-base font-bold text-slate-900 mt-1">620 kg</div>
            <div className="text-[11px] text-emerald-700 font-sans mt-0.5">+63.2% (+240 kg vs Sep)</div>
          </div>

          <div>
            <div className="text-[11px] text-slate-600 font-sans flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-emerald-700" />
              <span>Eco Equivalency</span>
            </div>
            <div className="text-base font-bold text-emerald-800 mt-1 font-sans">84 Mature Trees</div>
            <div className="text-[11px] text-slate-500 font-sans mt-0.5">~14,800 km ICE car avoided</div>
          </div>
        </div>

        {/* Recharts Simple Bar Chart */}
        <div className="w-full h-64 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={CARBON_SAVINGS_DATA}
              margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis
                dataKey="provider"
                stroke="#475569"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#CBD5E1' }}
              />
              <YAxis
                stroke="#475569"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#CBD5E1' }}
                tickFormatter={(val) => `${val} kg`}
              />
              <Tooltip content={<CustomCarbonTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: '12px', fontSize: '11px' }}
                formatter={(value) => <span className="text-slate-700 font-sans font-medium">{value}</span>}
              />
              <Bar
                dataKey="previousMonth"
                name="Previous Month (Sep '26)"
                fill="#94A3B8"
                radius={[4, 4, 0, 0]}
                barSize={30}
              />
              <Bar
                dataKey="currentMonth"
                name="Current Month (Oct '26)"
                fill="#0E2238"
                radius={[4, 4, 0, 0]}
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* SECTION 04: LIVE CLOUD INTEGRATIONS & ANOMALIES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Connected Cloud Accounts Table */}
        <section className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-900 text-[#5FD3BF] flex items-center justify-center shrink-0 mt-0.5">
                <Server className="w-4 h-4" />
              </div>
              <div>
                <span className="rm-kicker">04 / Connected Telemetry Feeds</span>
                <h3 className="text-base font-semibold text-slate-900">
                  Live Cloud Integrations ({filteredAccounts.length})
                </h3>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onOpenConnectCloud();
                soundManager.playClick();
              }}
              className="px-3.5 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plug className="w-3.5 h-3.5 text-[#5FD3BF]" />
              <span>+ Connect Cloud Account</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="pb-2.5 font-medium">Account / Project</th>
                  <th className="pb-2.5 font-medium">Provider</th>
                  <th className="pb-2.5 font-medium">Telemetry Status</th>
                  <th className="pb-2.5 font-medium text-right">Monthly Spend</th>
                  <th className="pb-2.5 font-medium text-right">Daily Burn</th>
                  <th className="pb-2.5 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono tabular-nums">
                {filteredAccounts.map((account) => (
                  <tr key={account.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 pr-2">
                      <div className="font-sans font-semibold text-slate-900">
                        {account.name}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono truncate max-w-[200px]" title={account.credentialsMasked || account.accountId}>
                        {account.accountId}
                      </div>
                    </td>
                    <td className="py-3 font-sans">
                      <div className="flex items-center gap-1.5 uppercase font-semibold text-slate-700">
                        <CloudIcon provider={account.provider} size={14} />
                        <span>{account.provider}</span>
                      </div>
                    </td>
                    <td className="py-3 font-sans">
                      <div className="text-emerald-700 font-semibold">Live Connected</div>
                      <div className="text-[11px] text-slate-500">
                        Synced {account.lastSyncTimestamp || 'Just now'}
                      </div>
                    </td>
                    <td className="py-3 text-right font-semibold text-slate-900">
                      ${account.monthlySpend.toLocaleString()}
                    </td>
                    <td className="py-3 text-right text-slate-600">
                      ${account.dailyBurn.toLocaleString()}/d
                    </td>
                    <td className="py-3 text-right font-sans">
                      <button
                        type="button"
                        onClick={() => handleTriggerSync(account.id)}
                        disabled={syncingAccountId === account.id}
                        className="px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-white hover:bg-slate-50 rounded border border-slate-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className={`w-3 h-3 ${syncingAccountId === account.id ? 'animate-spin text-emerald-600' : 'text-slate-500'}`} />
                        <span>{syncingAccountId === account.id ? 'Syncing...' : 'Sync'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Right 1 Col: Cost Anomalies */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <span className="rm-kicker">05 / Real-Time Alerts</span>
              <h3 className="text-base font-semibold text-slate-900">
                Active Cost Anomalies ({filteredAnomalies.length})
              </h3>
            </div>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>

          <div className="space-y-3">
            {filteredAnomalies.map((anom) => (
              <div
                key={anom.id}
                className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <CloudIcon provider={anom.provider} size={13} />
                    <span className="font-semibold text-slate-900">{anom.service}</span>
                  </div>
                  <span className="font-mono text-red-600 font-bold">
                    +{anom.spendIncreasePercent}%
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {anom.title}
                </p>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200">
                  <span className="text-slate-500 font-mono">
                    Est. waste: ~${anom.estimatedWasteMonthly}/mo
                  </span>
                  {anom.actionableOpportunityId && (
                    <button
                      type="button"
                      onClick={() => onSelectOpportunityById(anom.actionableOpportunityId!)}
                      className="text-slate-900 hover:text-emerald-700 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Remediate</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Executive Report PDF Modal */}
      <ExecutiveReportModal
        isOpen={isExecutiveReportModalOpen}
        onClose={() => setIsExecutiveReportModalOpen(false)}
        accounts={accounts}
        totalMonthlySpend={totalMonthlySpend}
        totalMonthlySavings={totalMonthlySavings}
        openOpportunitiesSavings={openOpportunitiesSavings}
        openOpportunitiesCount={openOpportunitiesCount}
        anomalies={anomalies}
        opportunities={opportunities}
      />
    </div>
  );
};
