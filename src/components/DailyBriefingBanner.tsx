import React, { useState } from 'react';
import { Sun, Moon, ArrowRight, CheckCircle2, AlertTriangle, Sparkles, RefreshCw, Zap } from 'lucide-react';
import { UserState } from '../types';
import { formatSAR, getTodayTotalSpent } from '../utils/financialCalculations';

interface DailyBriefingBannerProps {
  userState: UserState;
  timeMode: 'morning' | 'night';
  onQuickDilemma: (prompt: string) => void;
}

export const DailyBriefingBanner: React.FC<DailyBriefingBannerProps> = ({
  userState,
  timeMode,
  onQuickDilemma,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [customBriefingText, setCustomBriefingText] = useState<string | null>(null);

  const totalSpent = getTodayTotalSpent(userState);
  const safeBudget = userState.todaySpendingTarget;
  const difference = totalSpent - safeBudget;
  const isOver = difference > 0;

  // Recalculated tomorrow limit if over
  const adjustedTomorrow = Math.max(
    20,
    safeBudget - Math.ceil(Math.max(0, difference) / Math.max(1, userState.daysToSalary - 1))
  );

  const handleRefreshAIBriefing = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/dabbirni/daily-briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: timeMode, state: userState }),
      });
      const data = await res.json();
      if (data?.verdictSummary) {
        setCustomBriefingText(data.verdictSummary);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div
      id="daily-briefing-card"
      className="rounded-2xl p-5 border border-slate-800/90 bg-[#0B1224] relative overflow-hidden transition-all shadow-md"
    >
      {/* Subtle Navy Glow Background Accent */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar of the briefing */}
      <div className="flex items-center justify-between gap-3 mb-4 relative z-10">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
              timeMode === 'morning'
                ? 'bg-amber-400/10 text-amber-300 border border-amber-400/30'
                : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30'
            }`}
          >
            {timeMode === 'morning' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-wide text-slate-300">
              {timeMode === 'morning' ? 'إحاطة الصباح الذكية' : 'مراجعة ختام اليوم'}
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span className="text-xs text-teal-400 font-semibold">{userState.name}</span>
          </div>
        </div>

        <button
          onClick={handleRefreshAIBriefing}
          disabled={isRefreshing}
          className="px-2.5 py-1 rounded-lg border border-slate-800 bg-[#0E172A] hover:bg-slate-800 text-slate-300 text-xs font-medium transition-colors flex items-center gap-1.5"
          title="تحديث الإحاطة بذكاء اصطناعي"
        >
          <RefreshCw className={`w-3 h-3 text-teal-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">تحديث الرؤية</span>
        </button>
      </div>

      {/* Main Content */}
      {timeMode === 'morning' ? (
        <div className="space-y-3.5 relative z-10">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-100 mb-1 leading-snug">
              صباح الخير {userState.name}، باقي {userState.daysToSalary} يوم على راتبك.
            </h2>
            {customBriefingText ? (
              <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1.5 bg-[#0E172A] p-3 rounded-xl border border-slate-800 leading-relaxed">
                {customBriefingText}
              </p>
            ) : null}
          </div>

          {/* 3 Calm Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Metric 1: Safe Daily Budget */}
            <div className="bg-[#0E172A] border border-slate-800/90 p-3.5 rounded-xl">
              <span className="text-[11px] text-slate-400 font-semibold block">
                ميزانية اليوم الآمنة:
              </span>
              <div className="text-xl font-black text-teal-400 mt-0.5">
                {formatSAR(safeBudget)}
              </div>
              <span className="text-[11px] text-slate-400">تضمن استقرارك حتى نزول الراتب</span>
            </div>

            {/* Metric 2: Upcoming Bill */}
            <div className="bg-[#0E172A] border border-slate-800/90 p-3.5 rounded-xl">
              <span className="text-[11px] text-slate-400 font-semibold block">
                التزام قادم:
              </span>
              <div className="text-sm font-black text-amber-300 mt-1 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>فاتورة 220 بعد 4 أيام</span>
              </div>
              <span className="text-[11px] text-slate-400">محسوبة ومستثناة من رصيدك</span>
            </div>

            {/* Metric 3: Wishlist item verdict */}
            <div className="bg-[#0E172A] border border-slate-800/90 p-3.5 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-[11px] text-slate-400 font-semibold block">
                  شراء السماعة بـ 400؟
                </span>
                <span className="text-xs font-black text-rose-400 mt-1 block">
                  لا تتحمس، مو وقتها 😂
                </span>
              </div>
              <button
                onClick={() => onQuickDilemma('أشتري السماعة بـ 400؟')}
                className="text-[11px] font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1 mt-1 transition-colors"
              >
                <span>احسب تفاصيلها</span>
                <ArrowRight className="w-3 h-3 rotate-180" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Night Mode */
        <div className="space-y-3.5 relative z-10">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-100 mb-1 leading-snug">
              {isOver ? (
                <span>
                  صرفت اليوم {totalSpent} ريال. أعلى من ميزانيتك بـ {difference} ريال.
                </span>
              ) : (
                <span>
                  صرفت اليوم {totalSpent} ريال. وفّرت {Math.abs(difference)} ريال من الحد الآمن! 👏
                </span>
              )}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              {customBriefingText || (
                isOver
                  ? `بكرة نخلي الحد ${adjustedTomorrow} ريال ونرجع للمسار بدون أي ضغط قبل الراتب 👌`
                  : `يوم منضبط وممتاز! ماشي على الخطة وباقي ${userState.daysToSalary} يوم بس للراتب.`
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="bg-[#0E172A] border border-slate-800/90 p-3.5 rounded-xl">
              <span className="text-[11px] text-slate-400 font-semibold block">إجمالي صرف اليوم:</span>
              <div className={`text-xl font-black mt-0.5 ${isOver ? 'text-amber-400' : 'text-teal-400'}`}>
                {formatSAR(totalSpent)}
              </div>
              <span className="text-[11px] text-slate-400">الحد المستهدف {formatSAR(safeBudget)}</span>
            </div>

            <div className="bg-[#0E172A] border border-slate-800/90 p-3.5 rounded-xl">
              <span className="text-[11px] text-slate-400 font-semibold block">حد ميزانية الغد:</span>
              <div className="text-xl font-black text-teal-300 mt-0.5">
                {formatSAR(adjustedTomorrow)}
              </div>
              <span className="text-[11px] text-slate-400">معدل تلقائياً لإعادة التوازن</span>
            </div>

            <div className="bg-[#0E172A] border border-slate-800/90 p-3.5 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-[11px] text-slate-400 font-semibold block">المسار المالي:</span>
                <span className="text-xs font-black text-teal-400 flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>تحت السيطرة</span>
                </span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1">
                الرصيد المتاح: {formatSAR(userState.currentBalance - totalSpent)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

