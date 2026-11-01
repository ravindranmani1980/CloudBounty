import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle2,
  Sparkles,
  X,
  Ghost,
  Zap,
  Cpu,
  Leaf,
  Crown,
  Moon,
  Network,
  HeartPulse
} from 'lucide-react';
import { Badge } from '../types/finops';

interface BadgeUnlockedModalProps {
  badge: Badge | null;
  onClose: () => void;
  resolvedCount?: number;
  engineerName?: string;
}

export const BadgeUnlockedModal: React.FC<BadgeUnlockedModalProps> = ({
  badge,
  onClose,
  resolvedCount,
  engineerName
}) => {
  useEffect(() => {
    if (!badge) return;
    try {
      confetti({
        particleCount: 90,
        spread: 65,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore confetti error
    }
  }, [badge]);

  if (!badge) return null;

  const renderBadgeIcon = (iconName: string, className = 'w-10 h-10') => {
    switch (iconName) {
      case 'Ghost':
        return <Ghost className={className} />;
      case 'Zap':
        return <Zap className={className} />;
      case 'Cpu':
        return <Cpu className={className} />;
      case 'Leaf':
        return <Leaf className={className} />;
      case 'Award':
        return <Award className={className} />;
      case 'Crown':
        return <Crown className={className} />;
      case 'Moon':
        return <Moon className={className} />;
      case 'Network':
        return <Network className={className} />;
      case 'HeartPulse':
        return <HeartPulse className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  const isCloudHealthBadge = badge.id === 'badge-cloud-health' || badge.name === 'Cloud Health';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#081420]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-center">
        {/* Top Navy Header Banner */}
        <div className="px-6 pt-6 pb-5 bg-[#081420] text-[#F3F5F1] border-b border-white/10 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-[#9AB3C8] hover:text-white rounded-md hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Badge Emblem */}
          <div className="relative w-20 h-20 mx-auto mb-3">
            <div className="absolute inset-0 bg-[#5FD3BF]/25 rounded-2xl blur-lg animate-pulse" />
            <div className="relative w-full h-full rounded-2xl bg-[#0D1C2D] border-2 border-[#5FD3BF] flex items-center justify-center text-[#5FD3BF] shadow-xl">
              {renderBadgeIcon(badge.iconName)}
            </div>
          </div>

          <span className="xh-kicker">
            Maniq | Sweep · Achievement Unlocked
          </span>
          <h3
            className="text-2xl font-bold text-[#F3F5F1] tracking-tight mt-1"
            style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
          >
            {badge.name}
          </h3>
          {engineerName && (
            <div className="text-xs font-mono text-[#5FD3BF] mt-1">
              Awarded to {engineerName}
            </div>
          )}
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-4 text-[#16232F]">
          <p className="text-xs text-[#566676] leading-relaxed">
            {badge.description}
          </p>

          {isCloudHealthBadge && resolvedCount !== undefined && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
              <span className="font-semibold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Opportunities Resolved</span>
              </span>
              <span className="font-mono font-bold text-emerald-700">
                {resolvedCount} / 10+ Completed
              </span>
            </div>
          )}

          <div className="p-3.5 bg-[#F3F5F1] rounded-xl border border-slate-200 text-xs text-left space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#566676]">
              Verification Requirement Met
            </div>
            <div className="font-semibold text-[#16232F]">{badge.requirement}</div>
          </div>

          <button
            onClick={onClose}
            className="w-full xh-btn primary justify-center py-2.5 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Equip Badge &amp; Continue</span>
          </button>
        </div>
      </div>
    </div>
  );
};
