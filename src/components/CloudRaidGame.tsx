import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Gamepad2,
  Zap,
  Shield,
  RotateCcw,
  Sparkles,
  Trophy,
  Flame,
  Award,
  AlertTriangle,
  Play,
  Heart,
  Ghost,
  Cpu,
  Database,
  HardDrive,
  Network,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { CloudIcon } from './CloudIcon';
import { soundManager } from '../utils/audio';

type GameState = 'TITLE_MENU' | 'PLAYING' | 'PAUSED' | 'VICTORY' | 'GAME_OVER';

interface WasteTarget {
  id: string;
  name: string;
  provider: 'aws' | 'azure' | 'gcp';
  type: 'ebs' | 'k8s' | 'db' | 'nat' | 'gpu';
  gridIndex: number;
  health: number;
  maxHealth: number;
  drainPerSec: number;
  savingsReward: number;
  xpReward: number;
  remediationAction: 'terminate' | 'rightsize' | 'archive' | 'spot';
}

interface BossCore {
  id: string;
  name: string;
  provider: 'aws' | 'azure' | 'gcp';
  health: number;
  maxHealth: number;
  drainPerSec: number;
}

interface CloudRaidGameProps {
  onBankEarnings: (savings: number, xp: number, achievementName?: string) => void;
  currentUserLevel: number;
  playerName?: string;
  onRequestPlayerName?: () => void;
}

export const CloudRaidGame: React.FC<CloudRaidGameProps> = ({
  onBankEarnings,
  currentUserLevel,
  playerName = 'Alex Mercer',
  onRequestPlayerName
}) => {
  const [gameState, setGameState] = useState<GameState>('TITLE_MENU');
  const [wave, setWave] = useState(1);
  const [budgetHealth, setBudgetHealth] = useState(100); // 100% budget remaining
  const [sessionSavings, setSessionSavings] = useState(0);
  const [sessionXp, setSessionXp] = useState(0);
  const [combo, setCombo] = useState(1);
  const [highestCombo, setHighestCombo] = useState(1);
  const [activeTool, setActiveTool] = useState<'terminate' | 'rightsize' | 'archive' | 'spot'>('terminate');
  const [activeTargets, setActiveTargets] = useState<WasteTarget[]>([]);
  const [recentFloatingTexts, setRecentFloatingTexts] = useState<
    { id: string; text: string; x: number; y: number; color: string }[]
  >([]);

  // Boss state for Wave 3
  const [bossCores, setBossCores] = useState<BossCore[]>([
    { id: 'core-gpu', name: 'Slumbering GPU Cluster', provider: 'aws', health: 100, maxHealth: 100, drainPerSec: 25 },
    { id: 'core-db', name: 'Orphaned Multi-Region DB', provider: 'azure', health: 100, maxHealth: 100, drainPerSec: 20 },
    { id: 'core-bq', name: 'Unbounded BigQuery Lake', provider: 'gcp', health: 100, maxHealth: 100, drainPerSec: 20 },
    { id: 'core-nat', name: 'Zombie NAT Gateway Mesh', provider: 'aws', health: 100, maxHealth: 100, drainPerSec: 15 }
  ]);

  const comboTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to add floating text on zapping
  const triggerFloatingText = (text: string, x: number, y: number, color = '#10B981') => {
    const id = `float-${Date.now()}-${Math.random()}`;
    setRecentFloatingTexts((prev) => [...prev, { id, text, x, y, color }]);
    setTimeout(() => {
      setRecentFloatingTexts((prev) => prev.filter((item) => item.id !== id));
    }, 1000);
  };

  // Start new game
  const startGame = () => {
    setGameState('PLAYING');
    setWave(1);
    setBudgetHealth(100);
    setSessionSavings(0);
    setSessionXp(0);
    setCombo(1);
    setHighestCombo(1);
    setActiveTargets([]);
    soundManager.playRewardClaimed();
  };

  // Main game tick: spawn waste and drain budget
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const gameInterval = setInterval(() => {
      // Drain budget based on active targets
      if (wave < 3) {
        const totalDrain = activeTargets.reduce((sum, t) => sum + t.drainPerSec, 0);
        setBudgetHealth((prev) => {
          const nextHealth = Math.max(0, prev - (totalDrain * 0.05 + 0.3));
          if (nextHealth <= 0) {
            setGameState('GAME_OVER');
            soundManager.playBossHit();
          }
          return nextHealth;
        });

        // Chance to spawn new target if under max (4 targets for wave 1, 6 targets for wave 2)
        const maxSlots = wave === 1 ? 4 : 6;
        if (activeTargets.length < maxSlots && Math.random() < 0.65) {
          spawnRandomTarget();
        }
      } else {
        // Wave 3: Boss fight
        const activeBossDrain = bossCores
          .filter((c) => c.health > 0)
          .reduce((sum, c) => sum + c.drainPerSec, 0);

        setBudgetHealth((prev) => {
          const nextHealth = Math.max(0, prev - (activeBossDrain * 0.04 + 0.4));
          if (nextHealth <= 0) {
            setGameState('GAME_OVER');
            soundManager.playBossHit();
          }
          return nextHealth;
        });

        // Check if all boss cores defeated
        const allDefeated = bossCores.every((c) => c.health <= 0);
        if (allDefeated) {
          setGameState('VICTORY');
          soundManager.playMilestoneUnlocked();
          try {
            confetti({
              particleCount: 120,
              spread: 70,
              origin: { y: 0.6 }
            });
          } catch {
            // ignore
          }
        }
      }
    }, 500);

    return () => clearInterval(gameInterval);
  }, [gameState, wave, activeTargets, bossCores]);

  // Spawn random target across a 3x3 tactical grid (indices 0 to 8)
  const spawnRandomTarget = () => {
    const occupiedIndices = new Set(activeTargets.map((t) => t.gridIndex));
    const availableIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8].filter((i) => !occupiedIndices.has(i));
    if (availableIndices.length === 0) return;

    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];

    const targetTypes: WasteTarget[] = [
      {
        id: `t-${Date.now()}-${Math.random()}`,
        name: 'Zombie EBS Volume (gp2)',
        provider: 'aws',
        type: 'ebs',
        gridIndex: randomIndex,
        health: 1,
        maxHealth: 1,
        drainPerSec: 3,
        savingsReward: 220,
        xpReward: 45,
        remediationAction: 'terminate'
      },
      {
        id: `t-${Date.now()}-${Math.random()}`,
        name: 'Overprovisioned K8s Pod',
        provider: 'gcp',
        type: 'k8s',
        gridIndex: randomIndex,
        health: 2,
        maxHealth: 2,
        drainPerSec: 4,
        savingsReward: 380,
        xpReward: 70,
        remediationAction: 'rightsize'
      },
      {
        id: `t-${Date.now()}-${Math.random()}`,
        name: 'Idle Azure SQL Dev Tier',
        provider: 'azure',
        type: 'db',
        gridIndex: randomIndex,
        health: 1,
        maxHealth: 1,
        drainPerSec: 3,
        savingsReward: 310,
        xpReward: 60,
        remediationAction: 'terminate'
      },
      {
        id: `t-${Date.now()}-${Math.random()}`,
        name: 'Unused VPC NAT Gateway',
        provider: 'aws',
        type: 'nat',
        gridIndex: randomIndex,
        health: 2,
        maxHealth: 2,
        drainPerSec: 5,
        savingsReward: 450,
        xpReward: 85,
        remediationAction: 'terminate'
      },
      {
        id: `t-${Date.now()}-${Math.random()}`,
        name: 'Cold Media Blob on Hot Tier',
        provider: 'azure',
        type: 'ebs',
        gridIndex: randomIndex,
        health: 1,
        maxHealth: 1,
        drainPerSec: 3,
        savingsReward: 280,
        xpReward: 55,
        remediationAction: 'archive'
      },
      {
        id: `t-${Date.now()}-${Math.random()}`,
        name: 'Batch Worker on On-Demand',
        provider: 'aws',
        type: 'gpu',
        gridIndex: randomIndex,
        health: 2,
        maxHealth: 2,
        drainPerSec: 6,
        savingsReward: 520,
        xpReward: 95,
        remediationAction: 'spot'
      }
    ];

    const newTarget = targetTypes[Math.floor(Math.random() * targetTypes.length)];
    setActiveTargets((prev) => [...prev, newTarget]);
  };

  // Handle interacting with a grid target
  const handleHitTarget = (target: WasteTarget, e: React.MouseEvent) => {
    e.stopPropagation();

    // Check if right tool used or reward bonus
    const isMatchingTool = activeTool === target.remediationAction;
    const damage = isMatchingTool ? 2 : 1;

    // Combo system
    const newCombo = combo + 1;
    setCombo(newCombo);
    if (newCombo > highestCombo) setHighestCombo(newCombo);

    if (newCombo > 2) {
      soundManager.playCombo();
    } else {
      if (isMatchingTool) soundManager.playRightsize();
      else soundManager.playZap();
    }

    // Reset combo timer (3 seconds window)
    if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
    comboTimerRef.current = setTimeout(() => {
      setCombo(1);
    }, 2400);

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const remainingHealth = target.health - damage;

    if (remainingHealth <= 0) {
      // Destroyed target
      const earnedSavings = target.savingsReward * (isMatchingTool ? 1.5 : 1);
      const earnedXp = Math.round(target.xpReward * (1 + newCombo * 0.15));

      setSessionSavings((prev) => {
        const next = prev + earnedSavings;
        // Wave progression: 1000 for wave 1 -> wave 2, 2800 for wave 2 -> wave 3
        if (wave === 1 && next >= 1000) {
          setWave(2);
          soundManager.playRewardClaimed();
        } else if (wave === 2 && next >= 2800) {
          setWave(3);
          soundManager.playMilestoneUnlocked();
        }
        return next;
      });

      setSessionXp((prev) => prev + earnedXp);

      // Restore some budget health on successful clean
      setBudgetHealth((prev) => Math.min(100, prev + 5));

      triggerFloatingText(`+$${earnedSavings} · +${earnedXp} XP`, x, y, '#10B981');
      setActiveTargets((prev) => prev.filter((t) => t.id !== target.id));
    } else {
      // Damaged target
      triggerFloatingText(`HIT!`, x, y, '#F59E0B');
      setActiveTargets((prev) =>
        prev.map((t) => (t.id === target.id ? { ...t, health: remainingHealth } : t))
      );
    }
  };

  // Handle striking Boss core in Wave 3
  const handleHitBossCore = (core: BossCore, e: React.MouseEvent) => {
    e.stopPropagation();
    if (core.health <= 0) return;

    soundManager.playBossHit();
    const damage = 25;
    const remaining = Math.max(0, core.health - damage);

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    triggerFloatingText(`-${damage}% CORE!`, x, y, '#EF4444');

    setBossCores((prev) =>
      prev.map((c) => (c.id === core.id ? { ...c, health: remaining } : c))
    );

    if (remaining === 0) {
      const bossCoreSavings = 1200;
      const bossCoreXp = 250;
      setSessionSavings((prev) => prev + bossCoreSavings);
      setSessionXp((prev) => prev + bossCoreXp);
      setBudgetHealth((prev) => Math.min(100, prev + 15));
      soundManager.playRewardClaimed();
    }
  };

  // Bank session earnings to player profile
  const handleBankAndExit = () => {
    onBankEarnings(
      sessionSavings,
      sessionXp,
      wave === 3 ? 'Boss Slayer: Overprovisioned Cloud Titan Defeated' : undefined
    );
    setGameState('TITLE_MENU');
  };

  return (
    <div className="space-y-6">
      {/* Top Postrix Command Header for Cloud Raid */}
      <div className="xh-panel p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="xh-kicker">Maniq | Sweep · Interactive Remediation Drill</div>
            <h1
              className="text-2xl font-bold text-[#F3F5F1] tracking-tight"
              style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
            >
              Cloud Raid: Zombie Resource Hunter
            </h1>
            <p className="text-xs text-[#9AB3C8] max-w-2xl">
              Active operator: <span className="text-[#5FD3BF] font-semibold font-mono">{playerName}</span>. Eliminate unattached volumes, idle gateways, and overprovisioned nodes across AWS, Azure, and GCP to bank verified savings.
            </p>
          </div>
          {onRequestPlayerName && (
            <button
              onClick={onRequestPlayerName}
              className="xh-btn cursor-pointer self-start md:self-auto"
            >
              <Gamepad2 className="w-3.5 h-3.5 text-[#5FD3BF]" />
              <span>Change Operator Call-Sign</span>
            </button>
          )}
        </div>
      </div>

      {/* Game Window Container */}
      <div className="relative w-full bg-[#081420] border border-[#1E3A56] rounded-2xl overflow-hidden shadow-xl">
        {/* GAME TITLE MENU */}
        {gameState === 'TITLE_MENU' && (
          <div className="p-8 md:p-12 text-center space-y-6 max-w-2xl mx-auto">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#5FD3BF]/10 border-2 border-[#5FD3BF]/40 flex items-center justify-center text-[#5FD3BF] shadow-xl">
              <Gamepad2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="xh-kicker">
                Maniq | Sweep · Tactical Arcade Drill
              </span>
              <h2
                className="text-3xl font-bold text-[#F3F5F1] tracking-tight"
                style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
              >
                Cloud Raid: Zombie Resource Hunter
              </h2>
              <p className="text-sm text-[#9AB3C8] leading-relaxed">
                Runaway cloud waste is attacking your quarterly budget! Hunt down zombie EBS volumes, unattached NAT gateways, and idle DBs across AWS, Azure, and Google Cloud before your budget drains.
              </p>
            </div>

            {/* Rules & Rewards Preview Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Build Combos</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Chain rapid terminations to trigger 2x, 3x, and 5x XP multipliers.
                </p>
              </div>

              <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Defend Budget</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Prevent lingering waste from draining your $10,000 monthly allowance.
                </p>
              </div>

              <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <Trophy className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Earn Real Rank</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  All in-game savings & XP bank directly to your dashboard & leaderboard!
                </p>
              </div>
            </div>

            {/* Start Button */}
            <div className="pt-2">
              <button
                onClick={() => {
                  if (onRequestPlayerName) {
                    onRequestPlayerName();
                  } else {
                    startGame();
                  }
                }}
                className="w-full sm:w-auto px-8 py-3 text-sm font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:brightness-110 transition-all rounded-xl shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center justify-center gap-2 mx-auto"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Launch Cloud Raid (Start Game)</span>
              </button>
            </div>
          </div>
        )}

        {/* ACTIVE PLAYING VIEW */}
        {gameState === 'PLAYING' && (
          <div className="p-4 sm:p-6 space-y-4 select-none">
            {/* Top Game HUD */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-slate-900 border border-slate-800 rounded-xl">
              {/* Wave & Level & Pilot */}
              <div className="flex items-center gap-3">
                <div className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs font-bold text-emerald-400">
                  {wave === 3 ? 'BOSS RAID' : `WAVE ${wave} / 3`}
                </div>
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                  <span className="text-slate-500">Pilot:</span>
                  <span className="text-emerald-400 font-semibold">{playerName}</span>
                </div>
                {combo > 1 && (
                  <div className="flex items-center gap-1 text-xs font-bold font-mono text-amber-400 animate-bounce">
                    <Flame className="w-4 h-4" />
                    <span>{combo}x STREAK!</span>
                  </div>
                )}
              </div>

              {/* Budget Health Bar */}
              <div className="flex-1 max-w-xs space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Heart className="w-3 h-3 text-rose-500 fill-current" />
                    Budget Integrity
                  </span>
                  <span className="font-mono font-bold text-slate-200">
                    {Math.round(budgetHealth)}%
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full transition-all duration-300 ${
                      budgetHealth > 50
                        ? 'bg-emerald-400'
                        : budgetHealth > 25
                        ? 'bg-amber-400'
                        : 'bg-rose-500 animate-pulse'
                    }`}
                    style={{ width: `${budgetHealth}%` }}
                  />
                </div>
              </div>

              {/* Score & Savings Counter */}
              <div className="flex items-center gap-4 text-xs font-mono tabular-nums">
                <div>
                  <div className="text-[10px] text-slate-400 font-sans">Saved This Raid</div>
                  <div className="text-sm font-bold text-emerald-400">
                    +${sessionSavings.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-sans">XP Earned</div>
                  <div className="text-sm font-bold text-amber-400">
                    +{sessionXp} XP
                  </div>
                </div>
                <button
                  onClick={() => setGameState('PAUSED')}
                  className="px-2.5 py-1 text-xs text-slate-400 hover:text-white bg-slate-800 rounded-md"
                >
                  Pause
                </button>
              </div>
            </div>

            {/* Tactical Tools Selector (Hotkeys [1] [2] [3] [4]) */}
            <div className="flex items-center justify-between gap-2 p-2 bg-slate-900/60 border border-slate-800 rounded-xl text-xs">
              <span className="text-slate-400 text-[11px] hidden sm:inline">FinOps Weaponry:</span>
              <div className="grid grid-cols-4 gap-1.5 flex-1 max-w-xl">
                <button
                  onClick={() => {
                    setActiveTool('terminate');
                    soundManager.playClick();
                  }}
                  className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg border transition-all ${
                    activeTool === 'terminate'
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>[1] Terminate</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTool('rightsize');
                    soundManager.playClick();
                  }}
                  className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg border transition-all ${
                    activeTool === 'rightsize'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>[2] Rightsize</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTool('archive');
                    soundManager.playClick();
                  }}
                  className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg border transition-all ${
                    activeTool === 'archive'
                      ? 'bg-blue-500/20 border-blue-500 text-blue-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <HardDrive className="w-3.5 h-3.5" />
                  <span>[3] Archive</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTool('spot');
                    soundManager.playClick();
                  }}
                  className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg border transition-all ${
                    activeTool === 'spot'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>[4] Spot Fleet</span>
                </button>
              </div>
            </div>

            {/* MAIN PLAYING ARENA */}
            {wave < 3 ? (
              /* 3x3 Tactical Cloud Grid */
              <div className="grid grid-cols-3 gap-3 p-4 bg-slate-900/40 border border-slate-800 rounded-xl min-h-[360px]">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((gridIdx) => {
                  const target = activeTargets.find((t) => t.gridIndex === gridIdx);
                  return (
                    <div
                      key={gridIdx}
                      className="relative h-28 rounded-xl border border-slate-800/80 bg-slate-950/60 flex items-center justify-center overflow-hidden transition-all"
                    >
                      {target ? (
                        <button
                          onClick={(e) => handleHitTarget(target, e)}
                          className="w-full h-full p-2.5 flex flex-col justify-between text-left hover:scale-[1.02] active:scale-95 transition-transform cursor-pointer group bg-gradient-to-br from-slate-900 to-slate-950 border border-amber-500/40 rounded-xl shadow-lg"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1 font-semibold uppercase text-slate-300 text-[10px]">
                              <CloudIcon provider={target.provider} size={12} />
                              {target.provider}
                            </span>
                            <span className="text-[10px] text-rose-400 font-mono font-bold animate-pulse">
                              -${target.drainPerSec}/s
                            </span>
                          </div>

                          <div className="space-y-0.5">
                            <div className="text-xs font-bold text-white group-hover:text-emerald-300 truncate">
                              {target.name}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Requires: <span className="font-semibold text-amber-300">{target.remediationAction}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-[11px] font-mono tabular-nums pt-1 border-t border-slate-800">
                            <span className="text-emerald-400 font-bold">
                              +${target.savingsReward}
                            </span>
                            <span className="text-amber-400">
                              +{target.xpReward} XP
                            </span>
                          </div>
                        </button>
                      ) : (
                        <div className="text-slate-700 text-xs font-mono">
                          Cluster Node {gridIdx + 1}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              /* BOSS RAID ARENA: The Overprovisioned Cloud Titan */
              <div className="p-6 bg-slate-900/60 border-2 border-rose-500/40 rounded-xl space-y-6">
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 text-xs font-bold uppercase tracking-wider">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>RAID BOSS: THE OVERPROVISIONED CLOUD TITAN</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-white">
                    Strike the 4 Waste Cores to Subdue the Monolith!
                  </h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    The titan is actively bleeding $80/sec from your engineering budget! Click each core rapidly to destroy it!
                  </p>
                </div>

                {/* 4 Boss Cores */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {bossCores.map((core) => (
                    <button
                      key={core.id}
                      onClick={(e) => handleHitBossCore(core, e)}
                      disabled={core.health <= 0}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        core.health > 0
                          ? 'bg-slate-950 border-rose-500/50 hover:border-rose-400 hover:scale-[1.01] active:scale-95 cursor-pointer shadow-lg'
                          : 'bg-slate-950/40 border-slate-800 opacity-40 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 font-bold uppercase text-slate-300">
                          <CloudIcon provider={core.provider} size={14} />
                          {core.name}
                        </span>
                        <span className="font-mono text-rose-400 font-bold">
                          {core.health > 0 ? `${core.health}% HP` : 'DESTROYED'}
                        </span>
                      </div>

                      {/* Core Health Bar */}
                      <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden mt-3 border border-slate-800">
                        <div
                          className="h-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-200"
                          style={{ width: `${core.health}%` }}
                        />
                      </div>

                      <div className="text-[11px] text-slate-400 mt-2 flex justify-between">
                        <span>Click to strike core (-25%)</span>
                        <span className="font-mono text-emerald-400">+$1,200 / +250 XP</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Floating Popups */}
            <div className="fixed inset-0 pointer-events-none z-50">
              {recentFloatingTexts.map((f) => (
                <div
                  key={f.id}
                  className="absolute text-sm font-bold font-mono animate-out fade-out slide-out-to-top duration-700"
                  style={{
                    left: `${f.x}px`,
                    top: `${f.y}px`,
                    color: f.color,
                    textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                  }}
                >
                  {f.text}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PAUSED STATE */}
        {gameState === 'PAUSED' && (
          <div className="p-12 text-center space-y-4">
            <h3 className="text-xl font-bold text-white">Cloud Raid Paused</h3>
            <p className="text-xs text-slate-400">Take a breath. Your budget is on hold.</p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setGameState('PLAYING')}
                className="px-6 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 rounded-lg hover:bg-emerald-300 cursor-pointer"
              >
                Resume Raid
              </button>
              <button
                onClick={() => setGameState('TITLE_MENU')}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Quit to Menu
              </button>
            </div>
          </div>
        )}

        {/* VICTORY SCREEN */}
        {gameState === 'VICTORY' && (
          <div className="p-8 md:p-12 text-center space-y-6 max-w-xl mx-auto">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center text-amber-300 shadow-xl shadow-amber-500/20">
              <Trophy className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                Mission Accomplished, {playerName}!
              </span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Overprovisioned Titan Defeated!
              </h2>
              <p className="text-xs text-slate-300">
                You eradicated multi-cloud waste and defended the company budget against catastrophic drain.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 p-4 bg-slate-900 rounded-xl border border-slate-800 text-xs">
              <div>
                <div className="text-slate-400">Monthly Saved</div>
                <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">
                  +${sessionSavings.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-slate-400">Total XP Won</div>
                <div className="text-xl font-bold font-mono text-amber-400 mt-0.5">
                  +{sessionXp} XP
                </div>
              </div>
              <div>
                <div className="text-slate-400">Max Streak</div>
                <div className="text-xl font-bold font-mono text-cyan-400 mt-0.5">
                  {highestCombo}x
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleBankAndExit}
                className="flex-1 py-3 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors rounded-xl shadow-lg cursor-pointer"
              >
                Bank Savings to Profile & Leaderboard
              </button>
              <button
                onClick={startGame}
                className="px-6 py-3 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 cursor-pointer"
              >
                Play Again
              </button>
            </div>
          </div>
        )}

        {/* GAME OVER SCREEN */}
        {gameState === 'GAME_OVER' && (
          <div className="p-8 md:p-12 text-center space-y-6 max-w-xl mx-auto">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-rose-400">
                Budget Depleted
              </span>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Cloud Budget Exhausted!
              </h2>
              <p className="text-xs text-slate-400">
                Runaway cloud waste drained the allocation before all resources were remediated.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 bg-slate-900 rounded-xl border border-slate-800 text-xs">
              <div>
                <div className="text-slate-400">Salvaged Spend</div>
                <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
                  +${sessionSavings.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-slate-400">XP Earned</div>
                <div className="text-lg font-bold font-mono text-amber-400 mt-0.5">
                  +{sessionXp} XP
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={startGame}
                className="flex-1 py-3 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors rounded-xl shadow-lg cursor-pointer"
              >
                Try Again
              </button>
              {sessionSavings > 0 && (
                <button
                  onClick={handleBankAndExit}
                  className="px-6 py-3 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 cursor-pointer"
                >
                  Bank Salvaged Savings
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
