import {
  CloudAccount,
  OptimizationOpportunity,
  Badge,
  Engineer,
  TeamStanding,
  MilestoneTier,
  AnomalyAlert,
  AuditLogEntry,
  SpendPoint
} from '../types/finops';

export const INITIAL_ACCOUNTS: CloudAccount[] = [
  {
    id: 'aws-prod',
    name: 'AWS Primary Production',
    provider: 'aws',
    accountId: '1849-3021-9941',
    monthlySpend: 46250,
    dailyBurn: 1541,
    environment: 'Production',
    status: 'active'
  },
  {
    id: 'azure-core',
    name: 'Azure Enterprise Services',
    provider: 'azure',
    accountId: 'sub-8812-401f-9c02',
    monthlySpend: 24320,
    dailyBurn: 810,
    environment: 'Production',
    status: 'active'
  },
  {
    id: 'gcp-lake',
    name: 'GCP BigData & Analytics Lake',
    provider: 'gcp',
    accountId: 'prj-analytics-lake-v2',
    monthlySpend: 15840,
    dailyBurn: 528,
    environment: 'Data Lake',
    status: 'warning'
  },
  {
    id: 'aws-staging',
    name: 'AWS Staging & Pre-prod Sandbox',
    provider: 'aws',
    accountId: '9032-4412-1082',
    monthlySpend: 8120,
    dailyBurn: 270,
    environment: 'Staging',
    status: 'warning'
  }
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'badge-zombie-slayer',
    name: 'Zombie Slayer',
    description: 'Decommissioned 10+ unattached EBS volumes or unreferenced managed disks.',
    iconName: 'Ghost',
    category: 'efficiency',
    unlocked: true,
    unlockedAt: '2 days ago',
    requirement: 'Delete or snapshot 10 unattached cloud storage volumes'
  },
  {
    id: 'badge-spot-savant',
    name: 'Spot Savant',
    description: 'Converted fault-tolerant batch or build workloads to Spot/Preemptible instances.',
    iconName: 'Zap',
    category: 'efficiency',
    unlocked: true,
    unlockedAt: '1 week ago',
    requirement: 'Achieve > 60% spot coverage on batch processing worker pools'
  },
  {
    id: 'badge-cluster-trimmer',
    name: 'K8s Cluster Trimmer',
    description: 'Optimized Kubernetes pod CPU/memory requests saving over $3,000/mo.',
    iconName: 'Cpu',
    category: 'efficiency',
    unlocked: true,
    unlockedAt: '3 weeks ago',
    requirement: 'Rightsize 5+ Kubernetes deployment resource requests'
  },
  {
    id: 'badge-green-guardian',
    name: 'Green Cloud Guardian',
    description: 'Reduced infrastructure cloud carbon footprint by over 2,500 kg CO2e.',
    iconName: 'Leaf',
    category: 'green',
    unlocked: true,
    unlockedAt: '1 month ago',
    requirement: 'Offset or reduce 2,500 kg of cloud emissions'
  },
  {
    id: 'badge-five-figure',
    name: 'Five-Figure Saver',
    description: 'Single-handedly delivered over $10,000 in monthly recurring cost reductions.',
    iconName: 'Award',
    category: 'milestone',
    unlocked: true,
    unlockedAt: '5 days ago',
    requirement: 'Cross $10,000 in validated monthly savings'
  },
  {
    id: 'badge-six-figure-legend',
    name: 'Six-Figure Legend',
    description: 'Elite FinOps architect with over $100,000 cumulative validated savings.',
    iconName: 'Crown',
    category: 'milestone',
    unlocked: false,
    requirement: 'Cross $100,000 in cumulative verified savings'
  },
  {
    id: 'badge-night-owl-shutdown',
    name: 'Off-Peak Master',
    description: 'Automated off-hours and weekend shutdown policies for non-production environments.',
    iconName: 'Moon',
    category: 'speed',
    unlocked: false,
    requirement: 'Implement automated dev environment off-hours scaling'
  },
  {
    id: 'badge-nat-hunter',
    name: 'Network Ninja',
    description: 'Eliminated idle VPC NAT Gateways and inter-AZ data transfer bottlenecks.',
    iconName: 'Network',
    category: 'efficiency',
    unlocked: false,
    requirement: 'Remediate 3+ networking waste or NAT Gateway anomalies'
  }
];

export const INITIAL_ENGINEERS: Engineer[] = [
  {
    id: 'eng-alex',
    name: 'Alex Mercer (You)',
    role: 'Principal Cloud Architect',
    team: 'Platform & Infrastructure',
    level: 7,
    levelTitle: 'FinOps Champion',
    avatarInitials: 'AM',
    avatarColor: 'from-emerald-500 to-teal-700',
    totalXp: 8450,
    monthlySavingsRealized: 24800,
    bountiesClaimed: 14,
    rank: 1,
    badges: ['badge-zombie-slayer', 'badge-spot-savant', 'badge-cluster-trimmer', 'badge-green-guardian', 'badge-five-figure'],
    recentAchievement: 'Terminated 18 idle EBS volumes across us-east-1 and eu-west-1',
    isCurrentUser: true
  },
  {
    id: 'eng-sarah',
    name: 'Sarah Chen',
    role: 'Lead Site Reliability Engineer',
    team: 'Core Platform',
    level: 7,
    levelTitle: 'FinOps Champion',
    avatarInitials: 'SC',
    avatarColor: 'from-blue-500 to-indigo-700',
    totalXp: 7890,
    monthlySavingsRealized: 21450,
    bountiesClaimed: 12,
    rank: 2,
    badges: ['badge-spot-savant', 'badge-cluster-trimmer', 'badge-five-figure'],
    recentAchievement: 'Migrated 40 EKS staging nodes to AWS Graviton3'
  },
  {
    id: 'eng-marcus',
    name: 'Marcus Vance',
    role: 'Senior Data Platform Engineer',
    team: 'Data & Analytics',
    level: 6,
    levelTitle: 'Cloud Optimizer',
    avatarInitials: 'MV',
    avatarColor: 'from-amber-500 to-orange-700',
    totalXp: 6240,
    monthlySavingsRealized: 16900,
    bountiesClaimed: 9,
    rank: 3,
    badges: ['badge-zombie-slayer', 'badge-five-figure'],
    recentAchievement: 'Optimized BigQuery scheduled query partition caching'
  },
  {
    id: 'eng-elena',
    name: 'Elena Rostova',
    role: 'Cloud Security & DevOps',
    team: 'Core Services',
    level: 5,
    levelTitle: 'Waste Hunter',
    avatarInitials: 'ER',
    avatarColor: 'from-purple-500 to-pink-700',
    totalXp: 4950,
    monthlySavingsRealized: 12300,
    bountiesClaimed: 7,
    rank: 4,
    badges: ['badge-green-guardian', 'badge-five-figure'],
    recentAchievement: 'Archived obsolete Azure Blob snapshots to Cold Tier'
  },
  {
    id: 'eng-david',
    name: 'David Kim',
    role: 'Backend Systems Engineer',
    team: 'Product Core',
    level: 4,
    levelTitle: 'Cloud Sentinel',
    avatarInitials: 'DK',
    avatarColor: 'from-cyan-500 to-blue-700',
    totalXp: 3820,
    monthlySavingsRealized: 8400,
    bountiesClaimed: 5,
    rank: 5,
    badges: ['badge-zombie-slayer'],
    recentAchievement: 'Cleaned unattached Azure public IPs in test VNet'
  },
  {
    id: 'eng-priya',
    name: 'Priya Sharma',
    role: 'MLOps Engineer',
    team: 'AI Labs',
    level: 4,
    levelTitle: 'Cloud Sentinel',
    avatarInitials: 'PS',
    avatarColor: 'from-rose-500 to-pink-700',
    totalXp: 3410,
    monthlySavingsRealized: 7650,
    bountiesClaimed: 4,
    rank: 6,
    badges: ['badge-spot-savant'],
    recentAchievement: 'Downscaled idle Vertex AI custom training endpoints'
  }
];

export const INITIAL_TEAMS: TeamStanding[] = [
  {
    teamName: 'Platform & Infrastructure',
    department: 'Engineering Operations',
    totalSaved: 46250,
    bountiesResolved: 26,
    memberCount: 5,
    leadingEngineer: 'Alex Mercer',
    color: 'emerald'
  },
  {
    teamName: 'Data Platform & BI',
    department: 'Analytics Division',
    totalSaved: 28400,
    bountiesResolved: 16,
    memberCount: 4,
    leadingEngineer: 'Marcus Vance',
    color: 'amber'
  },
  {
    teamName: 'Core Backend Services',
    department: 'Product Engineering',
    totalSaved: 20700,
    bountiesResolved: 12,
    memberCount: 6,
    leadingEngineer: 'Elena Rostova',
    color: 'purple'
  },
  {
    teamName: 'AI & Machine Learning Labs',
    department: 'R&D Innovation',
    totalSaved: 15300,
    bountiesResolved: 8,
    memberCount: 3,
    leadingEngineer: 'Priya Sharma',
    color: 'rose'
  }
];

export const INITIAL_MILESTONES: MilestoneTier[] = [
  {
    id: 'tier-1',
    title: 'Tier 1: Bronze Optimizer',
    targetSavings: 5000,
    badgeId: 'badge-bronze',
    rewardDescription: 'Custom Cloud FinOps Swag Box & Hall of Fame Digital Pin',
    unlocked: true,
    unlockedDate: 'Oct 02, 2026',
    icon: 'ShieldCheck'
  },
  {
    id: 'tier-2',
    title: 'Tier 2: Silver Sentinel',
    targetSavings: 15000,
    badgeId: 'badge-silver',
    rewardDescription: 'Noise-Cancelling Hardware Upgrade Budget ($350)',
    unlocked: true,
    unlockedDate: 'Oct 14, 2026',
    icon: 'Zap'
  },
  {
    id: 'tier-3',
    title: 'Tier 3: Gold Architect',
    targetSavings: 30000,
    badgeId: 'badge-gold',
    rewardDescription: '$600 Team Celebration Dinner & Quarterly Award Trophy',
    unlocked: false,
    icon: 'Trophy'
  },
  {
    id: 'tier-4',
    title: 'Tier 4: Platinum Strategist',
    targetSavings: 60000,
    badgeId: 'badge-platinum',
    rewardDescription: 'Full Sponsorship for AWS re:Invent, Google Cloud Next, or Microsoft Ignite',
    unlocked: false,
    icon: 'Crown'
  },
  {
    id: 'tier-5',
    title: 'Tier 5: Diamond Cloud Titan',
    targetSavings: 100000,
    badgeId: 'badge-diamond',
    rewardDescription: '$5,000 Personal Learning & Tech Fellowship Grant',
    unlocked: false,
    icon: 'Gem'
  }
];

export const INITIAL_OPPORTUNITIES: OptimizationOpportunity[] = [
  {
    id: 'opp-aws-ebs-01',
    title: 'Purge 18 Unattached EBS gp2 Volumes Lingering > 30 Days',
    description: 'Found 18 unattached EBS volumes in us-east-1 and eu-west-1 orphaned following worker node recycles, accumulating ongoing IOPS and GB-month storage charges without attachment.',
    provider: 'aws',
    service: 'Elastic Block Store (EBS)',
    resourceCount: 18,
    affectedResources: ['vol-0498b2e1a90c', 'vol-0f2c4189283e', 'vol-012984abf829', 'vol-078bc1294811', 'vol-05a828114f90'],
    region: 'us-east-1 / eu-west-1',
    monthlySavings: 1420,
    annualSavings: 17040,
    xpReward: 320,
    impact: 'HIGH',
    effort: 'Quick Win',
    carbonSavingsKg: 180,
    status: 'open',
    remediationType: 'terraform',
    rationale: 'Unattached volumes carry zero operational utility. Creating a pre-deletion snapshot ensures complete rollback safety.',
    remediationScript: `# AWS CLI: Create final safety snapshots and delete unattached volumes
for vol in $(aws ec2 describe-volumes --filters Name=status,Values=available --query "Volumes[*].VolumeId" --output text); do
  echo "Snapshotting $vol..."
  aws ec2 create-snapshot --volume-id $vol --description "Pre-purge archive for $vol"
  echo "Deleting volume $vol..."
  aws ec2 delete-volume --volume-id $vol
done`
  },
  {
    id: 'opp-gcp-gke-02',
    title: 'Rightsize Overprovisioned GKE Node Pools (Average CPU 7%)',
    description: 'Staging Kubernetes cluster "gke-staging-cluster-01" allocates 6 n2-standard-16 nodes despite 90th percentile CPU demand peaking at just 1.1 cores across all pods.',
    provider: 'gcp',
    service: 'Google Kubernetes Engine (GKE)',
    resourceCount: 6,
    affectedResources: ['gke-staging-pool-primary-01', 'gke-staging-pool-primary-02'],
    region: 'us-central1-a',
    monthlySavings: 2850,
    annualSavings: 34200,
    xpReward: 540,
    impact: 'CRITICAL',
    effort: 'Medium',
    carbonSavingsKg: 340,
    status: 'open',
    remediationType: 'cli',
    rationale: 'Downsizing to e2-standard-4 with Cluster Autoscaler enabled preserves burst capacity while slashes compute overhead by 68%.',
    remediationScript: `# gcloud: Resize node pool and enable autoscaling
gcloud container clusters update gke-staging-cluster-01 \\
  --enable-autoscaling \\
  --min-nodes=2 \\
  --max-nodes=4 \\
  --node-pool=primary-pool \\
  --zone=us-central1-a

# Update machine-type to cost-effective e2-standard-4
gcloud container node-pools update primary-pool \\
  --cluster=gke-staging-cluster-01 \\
  --machine-type=e2-standard-4 \\
  --zone=us-central1-a`
  },
  {
    id: 'opp-azure-sql-03',
    title: 'Downscale Idle Azure SQL Database Dev Sandbox',
    description: 'Database "db-dev-sandbox-qa" in UK South has maintained 0 active client connections and 0 DTU consumption for 19 consecutive days.',
    provider: 'azure',
    service: 'Azure SQL Database',
    resourceCount: 1,
    affectedResources: ['db-dev-sandbox-qa (General Purpose - Gen5 8 vCores)'],
    region: 'uksouth',
    monthlySavings: 940,
    annualSavings: 11280,
    xpReward: 210,
    impact: 'MEDIUM',
    effort: 'Quick Win',
    carbonSavingsKg: 95,
    status: 'open',
    remediationType: 'cli',
    rationale: 'Switching to Serverless compute tier with 1-hour auto-pause preserves data while eliminating idle compute charges.',
    remediationScript: `# Azure CLI: Convert to Serverless with Auto-Pause
az sql db update \\
  --resource-group rg-core-dev \\
  --server sql-srv-dev-sand \\
  --name db-dev-sandbox-qa \\
  --edition GeneralPurpose \\
  --family Gen5 \\
  --capacity 2 \\
  --compute-model Serverless \\
  --auto-pause-delay 60`
  },
  {
    id: 'opp-aws-nat-04',
    title: 'Decommission Idle Secondary VPC NAT Gateway',
    description: 'NAT Gateway in legacy VPC "vpc-09c3140" handled less than 1.4 MB of traffic over the previous 30 days while incurring $0.045/hr + IP charges.',
    provider: 'aws',
    service: 'Virtual Private Cloud (VPC)',
    resourceCount: 1,
    affectedResources: ['nat-0fae8293701bc9'],
    region: 'us-west-2',
    monthlySavings: 1120,
    annualSavings: 13440,
    xpReward: 260,
    impact: 'HIGH',
    effort: 'Quick Win',
    carbonSavingsKg: 60,
    status: 'open',
    remediationType: 'cli',
    rationale: 'Rerouting remaining internal diagnostic traffic through central transit gateway eliminates the stand-alone gateway fee.',
    remediationScript: `# AWS CLI: Disassociate EIP and delete NAT Gateway
NAT_ID="nat-0fae8293701bc9"
echo "Deleting NAT Gateway $NAT_ID..."
aws ec2 delete-nat-gateway --nat-gateway-id $NAT_ID

# Release associated Elastic IP
EIP_ALLOC="eipalloc-0382901a"
aws ec2 release-address --allocation-id $EIP_ALLOC`
  },
  {
    id: 'opp-aws-ec2-graviton-05',
    title: 'Migrate 42 On-Demand EC2 Instances to AWS Graviton3 & Spot',
    description: 'Async processing Celery workers on c5.2xlarge can transition to c7g.2xlarge ARM instances, yielding 25% better price-performance with 40% Spot fallback savings.',
    provider: 'aws',
    service: 'Elastic Compute Cloud (EC2)',
    resourceCount: 42,
    affectedResources: ['asg-worker-celery-prod-v1', 'asg-batch-ingest-v2'],
    region: 'us-east-1',
    monthlySavings: 4900,
    annualSavings: 58800,
    xpReward: 750,
    impact: 'CRITICAL',
    effort: 'Architectural',
    carbonSavingsKg: 520,
    status: 'open',
    remediationType: 'terraform',
    rationale: 'ARM architecture switch verified in staging tests with Docker multi-arch builds. Yields massive sustained compute savings.',
    remediationScript: `# Terraform Launch Template Snippet
resource "aws_launch_template" "worker_graviton" {
  name_prefix   = "asg-worker-graviton-"
  image_id      = "ami-0c7217cdde317cfec" # Amazon Linux 2023 ARM64
  instance_type = "c7g.2xlarge"

  instance_market_options {
    market_type = "spot"
    spot_options {
      max_price          = "0.15"
      spot_instance_type = "one-time"
    }
  }
}`
  },
  {
    id: 'opp-gcp-bq-06',
    title: 'Enforce Partition Filters on BigQuery Log Analytics Lake',
    description: 'Daily unpartitioned audit scan queries in dataset "raw_telemetry_logs" scan 14.2 TB per query across historical dates needlessly.',
    provider: 'gcp',
    service: 'Google BigQuery',
    resourceCount: 14,
    affectedResources: ['raw_telemetry_logs.daily_app_events', 'raw_telemetry_logs.http_access_logs'],
    region: 'us-central1',
    monthlySavings: 3100,
    annualSavings: 37200,
    xpReward: 480,
    impact: 'HIGH',
    effort: 'Medium',
    carbonSavingsKg: 210,
    status: 'open',
    remediationType: 'cli',
    rationale: 'Requiring partition filters ensures queries only scan specified date shards, eliminating redundant terabyte reads.',
    remediationScript: `# bq command-line: Enforce partition filter constraint
bq update \\
  --require_partition_filter=true \\
  prj-analytics-lake-v2:raw_telemetry_logs.daily_app_events

bq update \\
  --require_partition_filter=true \\
  prj-analytics-lake-v2:raw_telemetry_logs.http_access_logs`
  },
  {
    id: 'opp-azure-blob-07',
    title: 'Implement Azure Blob Storage Hot-to-Cool Lifecycle Rule',
    description: '140 TB of customer media backups stored in Hot Tier have not been accessed in over 90 days, accumulating premium storage rates.',
    provider: 'azure',
    service: 'Azure Blob Storage',
    resourceCount: 3,
    affectedResources: ['stgbackupsprod01', 'stgmediaarchives02'],
    region: 'westeurope',
    monthlySavings: 1860,
    annualSavings: 22320,
    xpReward: 310,
    impact: 'MEDIUM',
    effort: 'Quick Win',
    carbonSavingsKg: 110,
    status: 'open',
    remediationType: 'cli',
    rationale: 'Automated lifecycle transitions move blobs to Cool after 30 days and Archive after 180 days, cutting storage costs by 65%.',
    remediationScript: `# Azure CLI: Apply Lifecycle Management Policy JSON
az storage account management-policy create \\
  --account-name stgbackupsprod01 \\
  --resource-group rg-core-prod \\
  --policy @azure-lifecycle-policy.json`
  },
  {
    id: 'opp-aws-s3-multipart-08',
    title: 'Abort Stale Incomplete S3 Multipart Uploads > 7 Days',
    description: 'Failed and abandoned multipart uploads in data ingestion buckets "prod-telemetry-dumps" and "ml-model-checkpoints" occupy 18.4 TB of hidden storage.',
    provider: 'aws',
    service: 'Amazon S3',
    resourceCount: 2,
    affectedResources: ['s3://prod-telemetry-dumps', 's3://ml-model-checkpoints'],
    region: 'us-east-1',
    monthlySavings: 680,
    annualSavings: 8160,
    xpReward: 190,
    impact: 'LOW',
    effort: 'Quick Win',
    carbonSavingsKg: 45,
    status: 'open',
    remediationType: 'cli',
    rationale: 'Adding a 7-day AbortIncompleteMultipartUpload rule permanently prevents stranded binary parts from billing indefinitely.',
    remediationScript: `# AWS CLI: Put S3 Bucket Lifecycle Configuration
aws s3api put-bucket-lifecycle-configuration \\
  --bucket prod-telemetry-dumps \\
  --lifecycle-configuration '{
    "Rules": [{
      "ID": "AbortStaleMultiparts",
      "Status": "Enabled",
      "Filter": {},
      "AbortIncompleteMultipartUpload": { "DaysAfterInitiation": 7 }
    }]
  }'`
  }
];

export const INITIAL_ANOMALIES: AnomalyAlert[] = [
  {
    id: 'anom-1',
    provider: 'aws',
    service: 'NAT Gateway (us-east-1)',
    title: 'Unusual Data Transfer Spike (+340% over 12h)',
    detectedAt: '3 hours ago',
    spendIncreasePercent: 340,
    estimatedWasteMonthly: 1650,
    severity: 'high',
    actionableOpportunityId: 'opp-aws-nat-04'
  },
  {
    id: 'anom-2',
    provider: 'gcp',
    service: 'BigQuery (us-central1)',
    title: 'Unpartitioned full-scan query loop detected in ETL job',
    detectedAt: '6 hours ago',
    spendIncreasePercent: 185,
    estimatedWasteMonthly: 2100,
    severity: 'high',
    actionableOpportunityId: 'opp-gcp-bq-06'
  },
  {
    id: 'anom-3',
    provider: 'azure',
    service: 'Virtual Machines (uksouth)',
    title: 'GPU NC6s_v3 instances left active over weekend',
    detectedAt: 'Yesterday',
    spendIncreasePercent: 120,
    estimatedWasteMonthly: 890,
    severity: 'medium'
  }
];

export const INITIAL_AUDIT_LOG: AuditLogEntry[] = [
  {
    id: 'log-1',
    timestamp: '2 hours ago',
    engineerName: 'Alex Mercer (You)',
    opportunityTitle: 'Terminated 8 unattached gp2 volumes in eu-west-1',
    provider: 'aws',
    savingsAmount: 640,
    xpEarned: 180,
    verificationHash: 'sha256-4f81c9a0...381'
  },
  {
    id: 'log-2',
    timestamp: '5 hours ago',
    engineerName: 'Sarah Chen',
    opportunityTitle: 'Configured EKS node auto-scaler scale-to-zero in pre-prod',
    provider: 'aws',
    savingsAmount: 1450,
    xpEarned: 350,
    verificationHash: 'sha256-91e82bb3...019'
  },
  {
    id: 'log-3',
    timestamp: '1 day ago',
    engineerName: 'Marcus Vance',
    opportunityTitle: 'Cleaned orphaned BigQuery temp shuffle tables',
    provider: 'gcp',
    savingsAmount: 890,
    xpEarned: 220,
    verificationHash: 'sha256-bc71029e...771'
  },
  {
    id: 'log-4',
    timestamp: '2 days ago',
    engineerName: 'Elena Rostova',
    opportunityTitle: 'Tiered 45TB legacy container images to Azure Cold Tier',
    provider: 'azure',
    savingsAmount: 1120,
    xpEarned: 260,
    verificationHash: 'sha256-1182cf9a...442'
  }
];

export const HISTORICAL_SPEND: SpendPoint[] = [
  { date: 'Oct 01', aws: 1480, azure: 790, gcp: 510, total: 2780, budget: 3200 },
  { date: 'Oct 04', aws: 1520, azure: 810, gcp: 530, total: 2860, budget: 3200 },
  { date: 'Oct 07', aws: 1610, azure: 830, gcp: 590, total: 3030, budget: 3200 },
  { date: 'Oct 10', aws: 1590, azure: 840, gcp: 580, total: 3010, budget: 3200 },
  { date: 'Oct 13', aws: 1720, azure: 890, gcp: 640, total: 3250, budget: 3200 }, // Anomaly spike
  { date: 'Oct 16', aws: 1680, azure: 860, gcp: 610, total: 3150, budget: 3200 },
  { date: 'Oct 19', aws: 1560, azure: 820, gcp: 560, total: 2940, budget: 3200 }, // Savings started
  { date: 'Oct 22', aws: 1490, azure: 780, gcp: 520, total: 2790, budget: 3200 },
  { date: 'Oct 25', aws: 1420, azure: 750, gcp: 490, total: 2660, budget: 3200 }
];

export const SERVICE_BREAKDOWN = [
  { name: 'Compute (EC2 / VMs / Compute Eng)', amount: 37400, percentage: 39, color: '#38BDF8' },
  { name: 'Managed DBs (RDS / SQL / Cloud SQL)', amount: 19800, percentage: 21, color: '#34D399' },
  { name: 'Storage (S3 / Blob / GCS)', amount: 14200, percentage: 15, color: '#FBBF24' },
  { name: 'Kubernetes (EKS / AKS / GKE)', amount: 11500, percentage: 12, color: '#A78BFA' },
  { name: 'Networking & Gateways', amount: 7600, percentage: 8, color: '#F472B6' },
  { name: 'AI / ML Workloads', amount: 4800, percentage: 5, color: '#FB923C' }
];
