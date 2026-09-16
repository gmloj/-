import React from 'react';
import { PhoneFrame } from '../PhoneFrame';
import { WelcomeScreen } from './WelcomeScreen';
import { HomeScreen } from './HomeScreen';
import { InvoiceScanScreen } from './InvoiceScanScreen';
import { PurchaseDecisionScreen } from './PurchaseDecisionScreen';
import { UserState } from '../../types';
import { Smartphone, Sparkles, Eye, ArrowRight } from 'lucide-react';

interface FourScreensShowcaseProps {
  userState: UserState;
  onSelectScreen: (screen: 'welcome' | 'home' | 'scan' | 'decision') => void;
  onOpenAddExpense: () => void;
  onOpenExpensesList: () => void;
  onOpenAccount: () => void;
}

export const FourScreensShowcase: React.FC<FourScreensShowcaseProps> = ({
  userState,
  onSelectScreen,
  onOpenAddExpense,
  onOpenExpensesList,
  onOpenAccount,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner Notice */}
      <div className="bg-[#0B1224] border border-cyan-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <span className="font-black text-white block text-sm">
              العرض البانورامي للشاشات الأربع المعتمدة
            </span>
            <span className="text-slate-400 text-[11px]">
              جميع الشاشات تفاعلية وحية بنفس التصميم والخطوط والألوان المطلوبة تماماً. اضغط على أي شاشة للتحكم بها.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-cyan-400 font-bold text-[11px] bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
            تطابق 100% مع الهوية
          </span>
        </div>
      </div>

      {/* 4 Phones Grid (Side by side on larger screens, horizontal swipe on mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start justify-center pb-8">
        {/* Screen 1: Welcome Screen */}
        <div className="flex flex-col items-center gap-2 group">
          <div className="flex items-center justify-between w-full px-4 text-xs font-bold text-slate-400">
            <span>1. شاشة البداية</span>
            <button
              onClick={() => onSelectScreen('welcome')}
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[11px]"
            >
              <span>تركيز</span>
              <Eye className="w-3 h-3" />
            </button>
          </div>

          <PhoneFrame activeScreenTitle="شاشة الترحيب">
            <WelcomeScreen onStart={() => onSelectScreen('home')} />
          </PhoneFrame>
        </div>

        {/* Screen 2: Home Screen */}
        <div className="flex flex-col items-center gap-2 group">
          <div className="flex items-center justify-between w-full px-4 text-xs font-bold text-slate-400">
            <span>2. الرئيسية (الملخص)</span>
            <button
              onClick={() => onSelectScreen('home')}
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[11px]"
            >
              <span>تركيز</span>
              <Eye className="w-3 h-3" />
            </button>
          </div>

          <PhoneFrame activeScreenTitle="الرئيسية">
            <HomeScreen
              userState={userState}
              onOpenScan={() => onSelectScreen('scan')}
              onOpenDecision={(item) => onSelectScreen('decision')}
              onOpenAddExpense={onOpenAddExpense}
              onOpenExpensesList={onOpenExpensesList}
              onOpenAccount={onOpenAccount}
            />
          </PhoneFrame>
        </div>

        {/* Screen 3: Invoice Scan Screen */}
        <div className="flex flex-col items-center gap-2 group">
          <div className="flex items-center justify-between w-full px-4 text-xs font-bold text-slate-400">
            <span>3. تحليل فاتورة</span>
            <button
              onClick={() => onSelectScreen('scan')}
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[11px]"
            >
              <span>تركيز</span>
              <Eye className="w-3 h-3" />
            </button>
          </div>

          <PhoneFrame activeScreenTitle="تحليل فاتورة">
            <InvoiceScanScreen
              userState={userState}
              onBack={() => onSelectScreen('home')}
            />
          </PhoneFrame>
        </div>

        {/* Screen 4: Purchase Decision Screen */}
        <div className="flex flex-col items-center gap-2 group">
          <div className="flex items-center justify-between w-full px-4 text-xs font-bold text-slate-400">
            <span>4. قرار الشراء</span>
            <button
              onClick={() => onSelectScreen('decision')}
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[11px]"
            >
              <span>تركيز</span>
              <Eye className="w-3 h-3" />
            </button>
          </div>

          <PhoneFrame activeScreenTitle="قرار الشراء">
            <PurchaseDecisionScreen
              userState={userState}
              onBack={() => onSelectScreen('home')}
              initialItemName="سماعة لاسلكية"
            />
          </PhoneFrame>
        </div>
      </div>
    </div>
  );
};
