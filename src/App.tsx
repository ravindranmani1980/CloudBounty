/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TopBar } from './components/TopBar';
import { OverviewView } from './components/OverviewView';
import { OpportunitiesView } from './components/OpportunitiesView';
import { LeaderboardView } from './components/LeaderboardView';
import { MilestonesView } from './components/MilestonesView';
import { SavingsSimulator } from './components/SavingsSimulator';
import { ClaimModal } from './components/ClaimModal';
import { NewBountyModal } from './components/NewBountyModal';
import { BadgeUnlockedModal } from './components/BadgeUnlockedModal';
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

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'opportunities' | 'leaderboard' | 'milestones' | 'simulator'>('overview');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<CloudProvider>('all');

  // FinOps & Gaming Data States
  const [accounts, setAccounts] = useState<CloudAccount[]>(INITIAL_ACCOUNTS);
  const [opportunities, setOpportunities] = useState<OptimizationOpportunity[]>(INITIAL_OPPORTUNITIES);
  const [engineers, setEngineers] = useState<Engineer[]>(INITIAL_ENGINEERS);
  const [teams, setTeams] = useState<TeamStanding[]>(INITIAL_TEAMS);
  const [milestones, setMilestones] = useState<MilestoneTier[]>(INITIAL_MILESTONES);
  const [badges, setBadges] = useState<Badge[]>(INITIAL_BADGES);
  const [anomalies, setAnomalies] = useState<AnomalyAlert[]>(INITIAL_ANOMALIES);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOG);

  // Modals
  const [activeOpportunityForClaim, setActiveOpportunityForClaim] = useState<OptimizationOpportunity | null>(null);
  const [isNewBountyModalOpen, setIsNewBountyModalOpen] = useState(false);
  const [unlockedBadgeForModal, setUnlockedBadgeForModal] = useState<Badge | null>(null);

  // Current User (Alex Mercer)
  const currentUser = engineers.find((e) => e.isCurrentUser) || engineers[0];

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

  // Claim and execute an opportunity
  const handleConfirmClaim = (claimedOpp: OptimizationOpportunity) => {
    // 1. Mark opportunity as claimed
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

    // 2. Reduce the cloud account monthly spend & daily burn
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

    // 3. Update Current Engineer XP, Level, and Savings
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

    // 4. Update Team Standings
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

    // 5. Append to Audit Log
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

    // 6. Dismiss associated anomaly if any
    setAnomalies((prev) =>
      prev.filter((anom) => anom.actionableOpportunityId !== claimedOpp.id)
    );

    // 7. Check Milestone unlocks
    milestones.forEach((m) => {
      if (!m.unlocked && updatedSavings >= m.targetSavings) {
        m.unlocked = true;
        m.unlockedDate = 'Today';
        soundManager.playMilestoneUnlocked();
      }
    });

    // 8. Check Badge unlocks (e.g. Six-Figure Legend or Network Ninja)
    if (claimedOpp.service.includes('VPC') || claimedOpp.service.includes('NAT')) {
      const netBadge = badges.find((b) => b.id === 'badge-nat-hunter');
      if (netBadge && !netBadge.unlocked) {
        netBadge.unlocked = true;
        netBadge.unlockedAt = 'Just now';
        setUnlockedBadgeForModal(netBadge);
      }
    }
  };

  // Add a newly proposed bounty
  const handleCreateBounty = (newBounty: OptimizationOpportunity) => {
    setOpportunities((prev) => [newBounty, ...prev]);
  };

  // Deploy quest from simulator
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

  // Navigation helpers from overview
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Strict 3-zone TopBar */}
      <TopBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenNewBounty={() => setIsNewBountyModalOpen(true)}
        currentUserXp={currentUser.totalXp}
        currentUserLevel={currentUser.level}
      />

      {/* Main Workspace Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
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

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 px-6 py-6 text-center text-xs text-slate-500">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">CloudBounty FinOps</span>
            <span aria-hidden="true">·</span>
            <span>AWS, Azure, and Google Cloud Cost Optimization</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Verified FinOps Foundation Architecture</span>
            <span aria-hidden="true">·</span>
            <span>Continuous Real-Time Telemetry</span>
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

      <BadgeUnlockedModal
        badge={unlockedBadgeForModal}
        onClose={() => setUnlockedBadgeForModal(null)}
      />
    </div>
  );
}
