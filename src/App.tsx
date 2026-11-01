/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { TopBar, NavTab } from './components/TopBar';
import { OverviewView } from './components/OverviewView';
import { OpportunitiesView } from './components/OpportunitiesView';
import { LeaderboardView } from './components/LeaderboardView';
import { MilestonesView } from './components/MilestonesView';
import { SavingsSimulator } from './components/SavingsSimulator';
import { CloudRaidGame } from './components/CloudRaidGame';
import { ClaimModal } from './components/ClaimModal';
import { NewBountyModal } from './components/NewBountyModal';
import { BadgeUnlockedModal } from './components/BadgeUnlockedModal';
import { ConnectCloudModal } from './components/ConnectCloudModal';
import { LaunchGameModal } from './components/LaunchGameModal';
import {
  INITIAL_ACCOUNTS,
  INITIAL_BADGES,
  INITIAL_ENGINEERS,
  INITIAL_TEAMS,
  INITIAL_MILESTONES,
  INITIAL_OPPORTUNITIES,
  INITIAL_ANOMALIES,
  INITIAL_AUDIT_LOG
} from './data/initialData';
import {
  CloudAccount,
  OptimizationOpportunity,
  Badge,
  Engineer,
  TeamStanding,
  MilestoneTier,
  AnomalyAlert,
  AuditLogEntry,
  CloudProvider
} from './types/finops';
import { soundManager } from './utils/audio';

const STORAGE_KEY = 'maniq_sweep_state_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<CloudProvider>('all');
  const [currentUserId, setCurrentUserId] = useState<string>('eng-alex');

  // FinOps & Gaming Data States (with localStorage recovery)
  const [accounts, setAccounts] = useState<CloudAccount[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_accounts`);
      return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
    } catch {
      return INITIAL_ACCOUNTS;
    }
  });

  const [opportunities, setOpportunities] = useState<OptimizationOpportunity[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_opportunities`);
      return saved ? JSON.parse(saved) : INITIAL_OPPORTUNITIES;
    } catch {
      return INITIAL_OPPORTUNITIES;
    }
  });

  const [engineers, setEngineers] = useState<Engineer[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_engineers`);
      if (saved) {
        const parsed: Engineer[] = JSON.parse(saved);
        return parsed.map((e) => {
          if (e.name.includes('Mani Ravindran') || e.id === 'eng-mani') {
            return {
              ...e,
              id: 'eng-alex',
              name: 'Alex Mercer (You)',
              avatarInitials: 'AM',
              role: 'Principal Cloud Architect',
              isAuthor: false,
              website: undefined
            };
          }
          return e;
        });
      }
      return INITIAL_ENGINEERS;
    } catch {
      return INITIAL_ENGINEERS;
    }
  });

  const [teams, setTeams] = useState<TeamStanding[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_teams`);
      return saved ? JSON.parse(saved) : INITIAL_TEAMS;
    } catch {
      return INITIAL_TEAMS;
    }
  });

  const [milestones, setMilestones] = useState<MilestoneTier[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_milestones`);
      return saved ? JSON.parse(saved) : INITIAL_MILESTONES;
    } catch {
      return INITIAL_MILESTONES;
    }
  });

  const [badges, setBadges] = useState<Badge[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_badges`);
      return saved ? JSON.parse(saved) : INITIAL_BADGES;
    } catch {
      return INITIAL_BADGES;
    }
  });

  const [anomalies, setAnomalies] = useState<AnomalyAlert[]>(INITIAL_ANOMALIES);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOG);

  // Modals
  const [activeOpportunityForClaim, setActiveOpportunityForClaim] = useState<OptimizationOpportunity | null>(null);
  const [isNewBountyModalOpen, setIsNewBountyModalOpen] = useState(false);
  const [isConnectCloudModalOpen, setIsConnectCloudModalOpen] = useState(false);
  const [isLaunchGameModalOpen, setIsLaunchGameModalOpen] = useState(false);
  const [unlockedBadgeForModal, setUnlockedBadgeForModal] = useState<Badge | null>(null);

  // Sync to local storage for guest persistence
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_accounts`, JSON.stringify(accounts));
      localStorage.setItem(`${STORAGE_KEY}_opportunities`, JSON.stringify(opportunities));
      localStorage.setItem(`${STORAGE_KEY}_engineers`, JSON.stringify(engineers));
      localStorage.setItem(`${STORAGE_KEY}_teams`, JSON.stringify(teams));
      localStorage.setItem(`${STORAGE_KEY}_milestones`, JSON.stringify(milestones));
      localStorage.setItem(`${STORAGE_KEY}_badges`, JSON.stringify(badges));
    } catch {
      // ignore
    }
  }, [accounts, opportunities, engineers, teams, milestones, badges]);

  // Current User
  const currentUser = engineers.find((e) => e.id === currentUserId) || engineers[0];

  // Calculated Metrics
  const totalMonthlySpend = accounts.reduce((acc, curr) => acc + curr.monthlySpend, 0);
  const totalMonthlySavings = currentUser.monthlySavingsRealized;
  const openOpportunities = opportunities.filter((o) => o.status === 'open');
  const openOpportunitiesSavings = openOpportunities.reduce((acc, curr) => acc + curr.monthlySavings, 0);
  const openOpportunitiesCount = openOpportunities.length;

  const handleToggleSound = () => {
    const newState = soundManager.toggleSound();
    setSoundEnabled(newState);
  };

  const handleSwitchUser = (newId: string) => {
    setCurrentUserId(newId);
    setEngineers((prev) =>
      prev.map((e) => ({
        ...e,
        isCurrentUser: e.id === newId
      }))
    );
  };

  // Connect a new live cloud account
  const handleConnectAccount = (newAccount: CloudAccount) => {
    setAccounts((prev) => [newAccount, ...prev]);

    const newLog: AuditLogEntry = {
      id: `log-conn-${Date.now()}`,
      timestamp: 'Just now',
      engineerName: currentUser.name,
      opportunityTitle: `Linked live telemetry for ${newAccount.name} (${newAccount.provider.toUpperCase()})`,
      provider: newAccount.provider,
      savingsAmount: 0,
      xpEarned: 100,
      verificationHash: `sha256-api-${Math.random().toString(36).substring(2, 8)}`
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    setEngineers((prev) =>
      prev.map((eng) =>
        eng.id === currentUser.id
          ? { ...eng, totalXp: eng.totalXp + 100 }
          : eng
      )
    );

    const discoveredBounty: OptimizationOpportunity = {
      id: `opp-disc-${Date.now()}`,
      title: `Optimize Newly Ingested ${newAccount.name} Cluster & Storage`,
      description: `Discovered 6 unattached disks and overprovisioned dev instances in ${newAccount.provider.toUpperCase()} account ${newAccount.accountId}.`,
      provider: newAccount.provider,
      service: newAccount.provider === 'aws' ? 'Amazon EC2 / EBS' : newAccount.provider === 'azure' ? 'Azure VMs' : 'Google Compute Engine',
      resourceCount: 6,
      affectedResources: [`vol-live-${Math.random().toString(36).substring(2, 6)}`, `vm-idle-worker-01`],
      region: newAccount.region || 'us-east-1',
      monthlySavings: 1650,
      annualSavings: 19800,
      xpReward: 350,
      impact: 'HIGH',
      effort: 'Quick Win',
      carbonSavingsKg: 140,
      status: 'open',
      remediationType: 'cli',
      rationale: 'Live telemetry scan discovered idle instances with zero network throughput in past 14 days.',
      remediationScript: `# Automated remediation for ${newAccount.name}\necho "Scanning live resources in ${newAccount.provider}..."`
    };
    setOpportunities((prev) => [discoveredBounty, ...prev]);

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  // Sync account action
  const handleSyncAccount = (accountId: string) => {
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === accountId
          ? {
              ...acc,
              lastSyncTimestamp: 'Just now',
              syncStatus: 'live'
            }
          : acc
      )
    );
  };

  // Claim and execute an opportunity
  const handleConfirmClaim = (claimedOpp: OptimizationOpportunity) => {
    setOpportunities((prev) =>
      prev.map((o) =>
        o.id === claimedOpp.id
          ? {
              ...o,
              status: 'claimed',
              claimedBy: currentUser.name,
              claimedAt: 'Just now'
            }
          : o
      )
    );

    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.provider === claimedOpp.provider) {
          const newSpend = Math.max(1000, acc.monthlySpend - claimedOpp.monthlySavings);
          return {
            ...acc,
            monthlySpend: newSpend,
            dailyBurn: Math.round(newSpend / 30)
          };
        }
        return acc;
      })
    );

    const updatedSavings = currentUser.monthlySavingsRealized + claimedOpp.monthlySavings;
    const updatedXp = currentUser.totalXp + claimedOpp.xpReward;
    const newLevel = Math.floor(updatedXp / 1500) + 1;
    const updatedBountiesCount = currentUser.bountiesClaimed + 1;

    setEngineers((prev) =>
      prev.map((eng) =>
        eng.id === currentUser.id
          ? {
              ...eng,
              monthlySavingsRealized: updatedSavings,
              totalXp: updatedXp,
              level: newLevel,
              bountiesClaimed: updatedBountiesCount
            }
          : eng
      )
    );

    setTeams((prev) =>
      prev.map((team) =>
        team.teamName === currentUser.team
          ? {
              ...team,
              totalSaved: team.totalSaved + claimedOpp.monthlySavings,
              bountiesResolved: team.bountiesResolved + 1
            }
          : team
      )
    );

    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: 'Just now',
      engineerName: currentUser.name,
      opportunityTitle: claimedOpp.title,
      provider: claimedOpp.provider,
      savingsAmount: claimedOpp.monthlySavings,
      xpEarned: claimedOpp.xpReward,
      verificationHash: `sha256-${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 5)}`
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    setAnomalies((prev) =>
      prev.filter((anom) => anom.actionableOpportunityId !== claimedOpp.id)
    );

    milestones.forEach((m) => {
      if (!m.unlocked && updatedSavings >= m.targetSavings) {
        m.unlocked = true;
        m.unlockedDate = 'Today';
        soundManager.playMilestoneUnlocked();
      }
    });

    if (claimedOpp.service.includes('VPC') || claimedOpp.service.includes('NAT')) {
      const netBadge = badges.find((b) => b.id === 'badge-nat-hunter');
      if (netBadge && !netBadge.unlocked) {
        netBadge.unlocked = true;
        netBadge.unlockedAt = 'Just now';
        setUnlockedBadgeForModal(netBadge);
      }
    }
  };

  // Handle banking savings from the Cloud Raid minigame
  const handleBankGameEarnings = (savings: number, xp: number, achievementName?: string) => {
    if (savings <= 0 && xp <= 0) return;

    const updatedSavings = currentUser.monthlySavingsRealized + savings;
    const updatedXp = currentUser.totalXp + xp;
    const newLevel = Math.floor(updatedXp / 1500) + 1;
    const updatedBountiesCount = currentUser.bountiesClaimed + 1;

    setEngineers((prev) =>
      prev.map((eng) =>
        eng.id === currentUser.id
          ? {
              ...eng,
              monthlySavingsRealized: updatedSavings,
              totalXp: updatedXp,
              level: newLevel,
              bountiesClaimed: updatedBountiesCount
            }
          : eng
      )
    );

    setAccounts((prev) =>
      prev.map((acc) => {
        const reduction = Math.round(savings / prev.length);
        const newSpend = Math.max(1000, acc.monthlySpend - reduction);
        return {
          ...acc,
          monthlySpend: newSpend,
          dailyBurn: Math.round(newSpend / 30)
        };
      })
    );

    const newLog: AuditLogEntry = {
      id: `log-raid-${Date.now()}`,
      timestamp: 'Just now',
      engineerName: `${currentUser.name} [Cloud Raid]`,
      opportunityTitle: achievementName || 'Eradicated multi-cloud waste targets in Cloud Raid Arcade',
      provider: 'aws',
      savingsAmount: savings,
      xpEarned: xp,
      verificationHash: `sha256-raid-${Math.random().toString(36).substring(2, 8)}`
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    setTeams((prev) =>
      prev.map((team) =>
        team.teamName === currentUser.team
          ? {
              ...team,
              totalSaved: team.totalSaved + savings,
              bountiesResolved: team.bountiesResolved + 1
            }
          : team
      )
    );

    milestones.forEach((m) => {
      if (!m.unlocked && updatedSavings >= m.targetSavings) {
        m.unlocked = true;
        m.unlockedDate = 'Today';
        soundManager.playMilestoneUnlocked();
      }
    });

    const zombieBadge = badges.find((b) => b.id === 'badge-zombie-slayer');
    if (zombieBadge && !zombieBadge.unlocked) {
      zombieBadge.unlocked = true;
      zombieBadge.unlockedAt = 'Just now';
      setUnlockedBadgeForModal(zombieBadge);
    }

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    soundManager.playRewardClaimed();
    setActiveTab('leaderboard');
  };

  const handleCreateBounty = (newBounty: OptimizationOpportunity) => {
    setOpportunities((prev) => [newBounty, ...prev]);
  };

  const handleDeploySimulatedQuest = (quest: {
    title: string;
    description: string;
    provider: 'aws' | 'azure' | 'gcp';
    service: string;
    monthlySavings: number;
    xpReward: number;
  }) => {
    const opp: OptimizationOpportunity = {
      id: `opp-sim-${Date.now()}`,
      title: quest.title,
      description: quest.description,
      provider: quest.provider,
      service: quest.service,
      resourceCount: 12,
      affectedResources: ['asg-simulated-pool-v1', 'spot-fleet-policy-01', 's3-tiering-rule'],
      region: 'multi-region',
      monthlySavings: quest.monthlySavings,
      annualSavings: quest.monthlySavings * 12,
      xpReward: quest.xpReward,
      impact: 'CRITICAL',
      effort: 'Architectural',
      carbonSavingsKg: Math.round(quest.monthlySavings * 0.14),
      status: 'open',
      remediationType: 'terraform',
      rationale: 'Strategic policy overhaul generated from What-If simulation engine.',
      remediationScript: `# Multi-cloud strategic policy execution\nterraform apply -target=module.finops_governance`
    };
    setOpportunities((prev) => [opp, ...prev]);
  };

  const handleNavigateToOpportunities = (filterProvider?: CloudProvider) => {
    if (filterProvider) setSelectedProvider(filterProvider);
    setActiveTab('opportunities');
    soundManager.playClick();
  };

  const handleSelectOpportunityById = (id: string) => {
    const opp = opportunities.find((o) => o.id === id);
    if (opp) {
      setActiveOpportunityForClaim(opp);
      soundManager.playClick();
    } else {
      setActiveTab('opportunities');
    }
  };

  const handleConfirmLaunchGame = (playerName: string) => {
    setIsLaunchGameModalOpen(false);
    const cleaned = playerName.trim();
    const formattedName = cleaned.includes('(You)') ? cleaned : `${cleaned} (You)`;
    const letters = cleaned.replace(/[^a-zA-Z]/g, '');
    const initials = letters.slice(0, 2).toUpperCase() || 'PL';
    setEngineers((prev) =>
      prev.map((eng) =>
        eng.id === currentUser.id
          ? {
              ...eng,
              name: formattedName,
              avatarInitials: initials
            }
          : eng
      )
    );
    setActiveTab('game');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F5F1] text-[#16232F] font-sans">
      {/* TopBar with Postrix Header & Telemetry Sub-Bar */}
      <TopBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenNewBounty={() => setIsNewBountyModalOpen(true)}
        currentUser={currentUser}
        engineers={engineers}
        onSwitchUser={handleSwitchUser}
      />

      {/* Main Workspace Canvas (1440px max width matching Postrix) */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <OverviewView
            accounts={accounts}
            totalMonthlySpend={totalMonthlySpend}
            totalMonthlySavings={totalMonthlySavings}
            openOpportunitiesSavings={openOpportunitiesSavings}
            openOpportunitiesCount={openOpportunitiesCount}
            anomalies={anomalies}
            auditLogs={auditLogs}
            selectedProvider={selectedProvider}
            onSelectProvider={setSelectedProvider}
            onNavigateToOpportunities={handleNavigateToOpportunities}
            onSelectOpportunityById={handleSelectOpportunityById}
            onLaunchGame={() => setIsLaunchGameModalOpen(true)}
            onOpenConnectCloud={() => setIsConnectCloudModalOpen(true)}
            onSyncAccount={handleSyncAccount}
            currentUserXp={currentUser.totalXp}
            currentUserLevel={currentUser.level}
            opportunities={opportunities}
          />
        )}

        {activeTab === 'game' && (
          <CloudRaidGame
            onBankEarnings={handleBankGameEarnings}
            currentUserLevel={currentUser.level}
            playerName={currentUser.name.replace(' (You)', '')}
            onRequestPlayerName={() => setIsLaunchGameModalOpen(true)}
          />
        )}

        {activeTab === 'opportunities' && (
          <OpportunitiesView
            opportunities={opportunities}
            onSelectOpportunity={(opp) => setActiveOpportunityForClaim(opp)}
            initialProviderFilter={selectedProvider}
          />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardView
            engineers={engineers}
            teams={teams}
            badges={badges}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'milestones' && (
          <MilestonesView
            milestones={milestones}
            currentSavings={totalMonthlySavings}
            onClaimMilestoneReward={() => {}}
          />
        )}

        {activeTab === 'simulator' && (
          <SavingsSimulator
            onDeploySimulatedQuest={handleDeploySimulatedQuest}
          />
        )}
      </main>

      {/* Footer matching https://apps.ravindran.in/postrix/app/ */}
      <footer className="bg-[#081420] text-[#B9C4CC] border-t border-[#3E6E86]/35 px-6 py-6 mt-auto no-print">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="rm-mono-mark !w-6 !h-6 !text-[11px]" aria-hidden="true">
              RM
            </span>
            <span>
              <strong className="font-serif text-sm font-semibold text-[#F3F5F1]">
                Maniq <span className="text-[#3E6E86] font-normal">|</span>{' '}
                <span className="text-[#D79A45]">Sweep</span>
              </strong>{' '}
              — Multi-Cloud FinOps &amp; Resource Optimization Platform
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span>
              Author: <strong className="font-medium text-[#F3F5F1]">Mani Ravindran</strong>
            </span>
            <span className="text-[#3E6E86]" aria-hidden="true">
              ·
            </span>
            <a
              href="https://ravindran.in"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[#5FD3BF] hover:text-[#EBC385] underline underline-offset-4 transition-colors"
            >
              ravindran.in
            </a>
            <span className="text-[#3E6E86]" aria-hidden="true">
              ·
            </span>
            <a
              href="https://ravindran.in/support.html"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono font-medium text-[#EBC385] hover:text-[#D79A45] underline underline-offset-4 transition-colors"
            >
              Support to Author
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ClaimModal
        opportunity={activeOpportunityForClaim}
        onClose={() => setActiveOpportunityForClaim(null)}
        onConfirmClaim={handleConfirmClaim}
      />

      <NewBountyModal
        isOpen={isNewBountyModalOpen}
        onClose={() => setIsNewBountyModalOpen(false)}
        onCreateBounty={handleCreateBounty}
      />

      <ConnectCloudModal
        isOpen={isConnectCloudModalOpen}
        onClose={() => setIsConnectCloudModalOpen(false)}
        onConnectAccount={handleConnectAccount}
      />

      <BadgeUnlockedModal
        badge={unlockedBadgeForModal}
        onClose={() => setUnlockedBadgeForModal(null)}
      />

      <LaunchGameModal
        isOpen={isLaunchGameModalOpen}
        onClose={() => setIsLaunchGameModalOpen(false)}
        onConfirmLaunch={handleConfirmLaunchGame}
        defaultName={currentUser.name.replace(' (You)', '')}
      />
    </div>
  );
}
