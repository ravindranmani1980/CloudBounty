import React from 'react';
import confetti from 'canvas-confetti';
import { Award, CheckCircle2, Sparkles, X, Ghost, Zap, Cpu, Leaf, Crown, Moon, Network } from 'lucide-react';
import { Badge } from '../types/finops';

interface BadgeUnlockedModalProps {
  badge: Badge | null;
  onClose: () => void;
}

export const BadgeUnlockedModal: React.FC<BadgeUnlockedModalProps> = ({
  badge,
  onClose
}) => {
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
      default:
        return <Sparkles className={className} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-slate-900 border border-amber-500/40 rounded-2xl p-6 shadow-2xl text-center space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Glowing Badge Emblem */}
        <div className="relative w-20 h-20 mx-auto mt-2">
          <div className="absolute inset-0 bg-amber-400/20 rounded-2xl blur-lg animate-pulse" />
          <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/30 border-2 border-amber-400/80 flex items-center justify-center text-amber-300 shadow-xl">
            {renderBadgeIcon(badge.iconName)}
          </div>
        </div>

        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
            Achievement Unlocked
          </span>
          <h3 className="text-xl font-extrabold text-white tracking-tight mt-1">
            {badge.name}
          </h3>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            {badge.description}
          </p>
        </div>

        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400">
          <div className="text-[11px] font-semibold text-slate-300">Criteria Met</div>
          <div className="mt-0.5">{badge.requirement}</div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:brightness-110 transition-all rounded-xl shadow-lg shadow-amber-500/25 cursor-pointer"
        >
          Equip Badge & Celebrate
        </button>
      </div>
    </div>
  );
};
