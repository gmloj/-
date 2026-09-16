import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  Camera,
  Receipt,
  SlidersHorizontal,
  Compass,
} from 'lucide-react';

export type TabType = 'summary' | 'decision' | 'vision' | 'tracker' | 'profile';

interface NavigationTabsProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  expensesCount?: number;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onSelectTab,
  expensesCount = 0,
}) => {
  const tabs = [
    {
      id: 'summary' as TabType,
      label: 'الملخص',
      fullLabel: 'الملخص العام',
      icon: LayoutDashboard,
      description: 'نظرة سريعة على يومك',
    },
    {
      id: 'decision' as TabType,
      label: 'القرار',
      fullLabel: 'قرار دبّرني',
      icon: Compass,
      badge: 'فوري',
      description: 'المستشار الذكي',
    },
    {
      id: 'vision' as TabType,
      label: 'الكاميرا',
      fullLabel: 'استوديو الفواتير',
      icon: Camera,
      description: 'فحص الفواتير والعروض',
    },
    {
      id: 'tracker' as TabType,
      label: 'المصروفات',
      fullLabel: 'سجل المصروفات',
      icon: Receipt,
      count: expensesCount > 0 ? expensesCount : undefined,
      description: 'تتبع الميزانية والتعويض',
    },
    {
      id: 'profile' as TabType,
      label: 'وضعي المالي',
      fullLabel: 'إعداداتي المالية',
      icon: SlidersHorizontal,
      description: 'الراتب والالتزامات',
    },
  ];

  return (
    <>
      {/* 1. Desktop & Tablet Top Navigation Bar */}
      <div className="w-full bg-[#0B1224] border border-slate-800/90 rounded-2xl p-1.5 shadow-md hidden sm:flex items-center justify-between gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-btn-desktop-${tab.id}`}
              onClick={() => onSelectTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-teal-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-teal-400'}`} />
              <span>{tab.fullLabel}</span>
              {tab.badge && !isActive && (
                <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-teal-500/10 text-teal-300 border border-teal-500/30">
                  {tab.badge}
                </span>
              )}
              {tab.count !== undefined && !isActive && (
                <span className="text-[10px] w-4 h-4 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-sans">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 2. Mobile Floating Bottom Navigation Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0F1D]/95 backdrop-blur-lg border-t border-slate-800 px-2 py-2 flex items-center justify-around shadow-2xl safe-area-pb">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-btn-mobile-${tab.id}`}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
                isActive ? 'text-teal-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive ? 'bg-teal-500/15 text-teal-300 scale-110' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 whitespace-nowrap leading-none">
                {tab.label}
              </span>
              {tab.badge && !isActive && (
                <span className="absolute top-1 left-1.5 w-1.5 h-1.5 bg-teal-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </>
  );
};
