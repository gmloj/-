import React from 'react';
import {
  Wallet,
  Calendar,
  Sparkles,
  HelpCircle,
  Camera,
  PlusCircle,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  ArrowLeft,
  Coffee,
  Receipt,
  ShieldCheck,
  ChevronLeft,
} from 'lucide-react';
import { UserState, Expense } from '../types';
import { formatSAR, getTodayTotalSpent } from '../utils/financialCalculations';
import { DabbirniLogo } from './DabbirniLogo';

interface DashboardSummaryProps {
  userState: UserState;
  timeMode: 'morning' | 'night';
  onNavigate: (tab: 'decision' | 'vision' | 'tracker' | 'profile') => void;
  onQuickAsk: (question: string) => void;
  onQuickAddExpense: (title: string, amount: number, category: Expense['category']) => void;
}

export const DashboardSummary: React.FC<DashboardSummaryProps> = ({
  userState,
  timeMode,
  onNavigate,
  onQuickAsk,
  onQuickAddExpense,
}) => {
  const totalSpentToday = getTodayTotalSpent(userState);
  const safeTarget = userState.todaySpendingTarget;
  const remainingBudget = safeTarget - totalSpentToday;
  const isOverBudget = remainingBudget < 0;

  // Percentage spent
  const spentPercentage = Math.min(100, Math.round((totalSpentToday / Math.max(1, safeTarget)) * 100));

  // Next upcoming commitment
  const nextCommitment = userState.commitments.length > 0
    ? [...userState.commitments].sort((a, b) => a.dueInDays - b.dueInDays)[0]
    : null;

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* 1. Welcoming Status Card */}
      <div className="bg-[#0B1224] border border-slate-800/90 rounded-3xl p-5 sm:p-7 relative overflow-hidden shadow-xl">
        <div className="absolute -top-16 -left-16 w-56 h-56 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <DabbirniLogo size="xs" variant="icon" />
              <span className="text-xs font-bold text-teal-300 px-2 py-0.5 rounded-md bg-teal-500/10 border border-teal-500/20">
                {timeMode === 'morning' ? 'إحاطة الصباح الهادئة' : 'ملخص المساء الذكي'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
              أهلاً {userState.name}،{' '}
              <span className="text-slate-400 font-medium text-lg sm:text-xl">
                {isOverBudget ? 'محتاجين نوزن الصرف لبكرة' : 'وضعك المالي ماشي بانتظام'}
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-xl leading-relaxed">
              باقي على نزول الراتب <strong className="text-slate-200">{userState.daysToSalary} يوم</strong>.
              {isOverBudget
                ? ` زدت بمقدار ${Math.abs(remainingBudget)} ر.س، لا تقلق بنعدل حد بكرة ونبقى في السليم.`
                : ` متبقي من حدك الآمن لليوم ${formatSAR(remainingBudget)} دون المساس بالتزاماتك.`}
            </p>
          </div>

          {/* Quick CTA to Ask Decision */}
          <button
            id="summary-btn-ask-decision"
            onClick={() => onNavigate('decision')}
            className="group flex items-center justify-between sm:justify-start gap-3 px-5 py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-teal-950/40 transition-all shrink-0 hover:scale-[1.02]"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>استشر دبّرني في قرار</span>
            </div>
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          </button>
        </div>
      </div>

      {/* 2. Key Numbers Grid (3 Executive Metric Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Card 1: Safe Daily Limit */}
        <div className="bg-[#0B1224] border border-slate-800/90 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>حد الصرف الآمن اليوم</span>
            <span className="w-2 h-2 rounded-full bg-teal-400" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-100 font-sans">
              {formatSAR(safeTarget)}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              محسوب بعد استقطاع الفواتير حتى يوم 27
            </p>
          </div>
        </div>

        {/* Card 2: Spent Today vs Remaining */}
        <div className="bg-[#0B1224] border border-slate-800/90 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>مصروفك المسجل اليوم</span>
            <span
              className={`w-2 h-2 rounded-full ${
                isOverBudget ? 'bg-amber-400' : 'bg-emerald-400'
              }`}
            />
          </div>
          <div>
            <div
              className={`text-2xl sm:text-3xl font-black font-sans ${
                isOverBudget ? 'text-amber-300' : 'text-emerald-400'
              }`}
            >
              {formatSAR(totalSpentToday)}
            </div>
            <div className="w-full bg-[#070A12] h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isOverBudget ? 'bg-amber-400' : 'bg-teal-400'
                }`}
                style={{ width: `${spentPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 3: Next Bill Alert */}
        <div className="bg-[#0B1224] border border-slate-800/90 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>الالتزام القادم</span>
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          {nextCommitment ? (
            <div>
              <div className="text-base sm:text-lg font-black text-slate-200 truncate">
                {nextCommitment.title}
              </div>
              <div className="flex items-center justify-between mt-1 text-xs">
                <span className="font-bold text-amber-300 font-sans">
                  {formatSAR(nextCommitment.amount)}
                </span>
                <span className="text-[11px] text-slate-400 bg-[#070A12] px-2 py-0.5 rounded-md border border-slate-800">
                  بعد {nextCommitment.dueInDays} أيام
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400">لا توجد فواتير قريبة مستحقة</p>
          )}
        </div>
      </div>

      {/* 3. Three Dedicated Functional Hubs (Shortcut Launchers) */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-sm font-black text-slate-200">
            أقسام التطبيق المباشرة
          </h2>
          <span className="text-xs text-slate-400">اختر القسم لإنجاز مهمتك بهدوء</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Hub 1: Decision Engine */}
          <div
            onClick={() => onNavigate('decision')}
            className="group bg-[#0B1224] hover:bg-[#0E172A] border border-slate-800/90 hover:border-teal-500/50 rounded-2xl p-5 cursor-pointer transition-all duration-200 flex flex-col justify-between shadow-sm"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-300 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-100 group-hover:text-teal-300 transition-colors">
                قرار دبّرني الفوري
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                محتار تشتري أو تطلب أو تدفع؟ اسأل المستشار ويحسبها مقارنة برصيدك وفواتيرك بلحظتها.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-teal-400">
              <span>فتح محرك القرار</span>
              <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </div>
          </div>

          {/* Hub 2: Camera & Bill Scanner */}
          <div
            onClick={() => onNavigate('vision')}
            className="group bg-[#0B1224] hover:bg-[#0E172A] border border-slate-800/90 hover:border-teal-500/50 rounded-2xl p-5 cursor-pointer transition-all duration-200 flex flex-col justify-between shadow-sm"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Camera className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-100 group-hover:text-teal-300 transition-colors">
                استوديو الكاميرا والفواتير
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                صوّر فاتورة مطعم، منتج في السوق، أو عرض تقسيط، ويحللها الذكاء الاصطناعي ويقولك تسوى ولا لا.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-teal-400">
              <span>تصوير أو رفع فاتورة</span>
              <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </div>
          </div>

          {/* Hub 3: Spending Tracker */}
          <div
            onClick={() => onNavigate('tracker')}
            className="group bg-[#0B1224] hover:bg-[#0E172A] border border-slate-800/90 hover:border-teal-500/50 rounded-2xl p-5 cursor-pointer transition-all duration-200 flex flex-col justify-between shadow-sm"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Receipt className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-100 group-hover:text-teal-300 transition-colors">
                سجل المصروفات والميزانية
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                سجّل مصاريفك بلمسة زر، وشاهد كيف يعيد التطبيق موازنة الأيام الجاية بدون أي تعقيد أو جداول.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-teal-400">
              <span>سجل وتعديل المصاريف</span>
              <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Quick 1-Click Expense Logger (Ease of consumer use) */}
      <div className="bg-[#0B1224] border border-slate-800/90 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-xs font-bold text-slate-200">
              تسجيل سريع لمصاريف اليوم المعتادة:
            </h3>
            <p className="text-[11px] text-slate-400">
              ضغطة واحدة تضيف المصروف وتحسب الأثر المالي فوراً
            </p>
          </div>
          <button
            onClick={() => onNavigate('tracker')}
            className="text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>عرض كل المصاريف ({userState.todayExpenses.length})</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => onQuickAddExpense('قهوة الصباح', 16, 'coffee')}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-[#0E172A] hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-teal-300 transition-colors"
          >
            <span className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              ☕
            </span>
            <div className="text-right">
              <span className="block">قهوة</span>
              <span className="text-[10px] text-slate-400 font-sans font-normal">16 ر.س</span>
            </div>
          </button>

          <button
            onClick={() => onQuickAddExpense('وجبة غداء خفيفة', 32, 'food')}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-[#0E172A] hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-teal-300 transition-colors"
          >
            <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              🥪
            </span>
            <div className="text-right">
              <span className="block">غداء</span>
              <span className="text-[10px] text-slate-400 font-sans font-normal">32 ر.س</span>
            </div>
          </button>

          <button
            onClick={() => onQuickAddExpense('بنزين سيارة', 55, 'bills')}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-[#0E172A] hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-teal-300 transition-colors"
          >
            <span className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
              ⛽
            </span>
            <div className="text-right">
              <span className="block">بنزين</span>
              <span className="text-[10px] text-slate-400 font-sans font-normal">55 ر.س</span>
            </div>
          </button>

          <button
            onClick={() => onQuickAddExpense('أغراض تموينات سريعة', 25, 'other')}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-[#0E172A] hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-teal-300 transition-colors"
          >
            <span className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0">
              🛒
            </span>
            <div className="text-right">
              <span className="block">بقالة</span>
              <span className="text-[10px] text-slate-400 font-sans font-normal">25 ر.س</span>
            </div>
          </button>
        </div>
      </div>

      {/* 5. Common Quick Dilemmas */}
      <div className="bg-[#0B1224] border border-slate-800/90 rounded-2xl p-4 sm:p-5">
        <h3 className="text-xs font-bold text-slate-200 mb-2.5">
          حيرة شائعة تواجهك اليوم؟ اضغط ليسألك دبّرني فوراً:
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            'أطلب عشاء من التطبيق ولا أطبخ؟',
            'أشتري السماعة بـ 400 ريال الحين؟',
            'أقدر أسافر نهاية الأسبوع؟',
            'أقسط مشترياتي ولا أدفع كاش؟',
          ].map((q, idx) => (
            <button
              key={idx}
              onClick={() => onQuickAsk(q)}
              className="px-3 py-1.5 rounded-xl bg-[#0E172A] hover:bg-slate-800 border border-slate-800 hover:border-teal-500/40 text-xs font-medium text-slate-300 hover:text-teal-300 transition-colors"
            >
              «{q}»
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
