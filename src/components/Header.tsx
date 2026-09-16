import React from 'react';
import { Sparkles, Sun, Moon, SlidersHorizontal, Calendar, Wallet, Palette } from 'lucide-react';
import { UserState } from '../types';
import { formatSAR } from '../utils/financialCalculations';
import { DabbirniLogo } from './DabbirniLogo';

interface HeaderProps {
  userState: UserState;
  timeMode: 'morning' | 'night';
  setTimeMode: (mode: 'morning' | 'night') => void;
  onOpenSettings: () => void;
  onOpenBrandGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userState,
  timeMode,
  setTimeMode,
  onOpenSettings,
  onOpenBrandGuide,
}) => {
  return (
    <header className="w-full bg-[#0A0F1D]/90 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-30 transition-colors">
      <div className="max-w-5xl mx-auto px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <DabbirniLogo
              size="md"
              variant="horizontal"
              showTagline={true}
              onClick={onOpenBrandGuide}
              className="cursor-pointer select-none"
            />
          </div>

          {/* Snapshot & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Brand Guide Button */}
            <button
              id="btn-open-brand-guide"
              onClick={onOpenBrandGuide}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-teal-500/30 bg-teal-500/10 hover:bg-teal-500/20 text-xs font-bold text-teal-300 transition-colors"
              title="استعراض الهوية والشعار المعتمد"
            >
              <Palette className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden lg:inline">دليل الهوية</span>
            </button>

            {/* Quick Balance indicator */}
            <div className="hidden md:flex items-center gap-3 bg-[#0E172A] border border-slate-800 px-3.5 py-1.5 rounded-xl text-xs font-semibold">
              <div className="flex items-center gap-1.5 text-teal-400">
                <Wallet className="w-3.5 h-3.5" />
                <span>{formatSAR(userState.currentBalance)}</span>
              </div>
              <span className="w-px h-3 bg-slate-700" />
              <div className="flex items-center gap-1.5 text-slate-300">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>باقي {userState.daysToSalary} يوم</span>
              </div>
            </div>

            {/* Morning / Night Switcher */}
            <div className="flex items-center bg-[#070A12] p-1 rounded-xl border border-slate-800">
              <button
                id="btn-switch-morning"
                onClick={() => setTimeMode('morning')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  timeMode === 'morning'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="إحاطة الصباح"
              >
                <Sun className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">الصباح</span>
              </button>

              <button
                id="btn-switch-night"
                onClick={() => setTimeMode('night')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  timeMode === 'night'
                    ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="مراجعة الليل"
              >
                <Moon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">الليل</span>
              </button>
            </div>

            {/* Profile / Financial State Setup */}
            <button
              id="btn-open-profile-settings"
              onClick={onOpenSettings}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 bg-[#0E172A] hover:bg-slate-800 text-xs font-bold text-slate-200 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden sm:inline">وضعي المالي</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

