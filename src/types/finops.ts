export type CloudProvider = 'all' | 'aws' | 'azure' | 'gcp';

export type ImpactTier = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type EffortLevel = 'Quick Win' | 'Medium' | 'Architectural';

export interface CloudAccount {
  id: string;
  name: string;
  provider: 'aws' | 'azure' | 'gcp';
  accountId: string;
  monthlySpend: number;
  dailyBurn: number;
  environment: 'Production' | 'Staging' | 'Data Lake' | 'Sandbox';
  status: 'active' | 'warning';
}

export interface OptimizationOpportunity {
  id: string;
  title: string;
  description: string;
  provider: 'aws' | 'azure' | 'gcp';
  service: string;
  resourceCount: number;
  affectedResources: string[];
  region: string;
  monthlySavings: number;
  annualSavings: number;
  xpReward: number;
  impact: ImpactTier;
  effort: EffortLevel;
  carbonSavingsKg: number;
  status: 'open' | 'claimed' | 'in_progress';
  claimedBy?: string;
  claimedAt?: string;
  remediationType: 'terraform' | 'cli' | 'automated';
  remediationScript: string;
  rationale: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconName: string;
  category: 'efficiency' | 'speed' | 'milestone' | 'green';
  unlocked: boolean;
  unlockedAt?: string;
  requirement: string;
}

export interface Engineer {
  id: string;
  name: string;
  role: string;
  team: string;
  level: number;
  levelTitle: string;
  avatarInitials: string;
  avatarColor: string;
  totalXp: number;
  monthlySavingsRealized: number;
  bountiesClaimed: number;
  rank: number;
  badges: string[]; // Badge IDs
  recentAchievement?: string;
  isCurrentUser?: boolean;
}

export interface TeamStanding {
  teamName: string;
  department: string;
  totalSaved: number;
  bountiesResolved: number;
  memberCount: number;
  leadingEngineer: string;
  color: string;
}

export interface MilestoneTier {
  id: string;
  title: string;
  targetSavings: number;
  badgeId: string;
  rewardDescription: string;
  unlocked: boolean;
  unlockedDate?: string;
  icon: string;
}

export interface AnomalyAlert {
  id: string;
  provider: 'aws' | 'azure' | 'gcp';
  service: string;
  title: string;
  detectedAt: string;
  spendIncreasePercent: number;
  estimatedWasteMonthly: number;
  severity: 'high' | 'medium';
  actionableOpportunityId?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  engineerName: string;
  opportunityTitle: string;
  provider: 'aws' | 'azure' | 'gcp';
  savingsAmount: number;
  xpEarned: number;
  verificationHash: string;
}

export interface SpendPoint {
  date: string;
  aws: number;
  azure: number;
  gcp: number;
  total: number;
  budget: number;
}
