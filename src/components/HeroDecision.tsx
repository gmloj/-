import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  HelpCircle,
  Sparkles,
  ArrowRight,
  Utensils,
  Plane,
  Headphones,
  Wrench,
  Tv,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertOctagon,
  Lightbulb,
  Send,
  Loader2,
} from 'lucide-react';
import { UserState, DecisionResult } from '../types';
import { DabbirniLogo } from './DabbirniLogo';

interface HeroDecisionProps {
  userState: UserState;
  onDecisionMade?: (result: DecisionResult) => void;
  initialQuestion?: string;
}

const QUICK_DILEMMAS = [
  {
    icon: Utensils,
    text: 'أطلب من المطعم ولا أطبخ؟',
    color: 'hover:border-amber-400 hover:bg-amber-50/50',
  },
  {
    icon: Headphones,
    text: 'أشتري السماعة بـ 400؟',
    color: 'hover:border-rose-400 hover:bg-rose-50/50',
  },
  {
    icon: Plane,
    text: 'أقدر أسافر نهاية الشهر؟',
    color: 'hover:border-blue-400 hover:bg-blue-50/50',
  },
  {
    icon: Wrench,
    text: 'سيارتي تحتاج زيت، أغيره الحين؟',
    color: 'hover:border-orange-400 hover:bg-orange-50/50',
  },
  {
    icon: Tv,
    text: 'اشتراكي هذا يستاهل أجدده؟',
    color: 'hover:border-purple-400 hover:bg-purple-50/50',
  },
  {
    icon: CreditCard,
    text: 'أقسط مشترياتي (تمارا/تابي) ولا كاش؟',
    color: 'hover:border-emerald-400 hover:bg-emerald-50/50',
  },
];

export const HeroDecision: React.FC<HeroDecisionProps> = ({
  userState,
  onDecisionMade,
}) => {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DecisionResult | null>(null);

  const handleAsk = async (queryToAsk?: string) => {
    const q = queryToAsk || question;
    if (!q.trim() || isLoading) return;

    if (queryToAsk) {
      setQuestion(queryToAsk);
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/dabbirni/decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          state: userState,
        }),
      });

      const data = await response.json();
      setResult(data);
      if (onDecisionMade) {
        onDecisionMade(data);
      }
    } catch (err) {
      console.error(err);
      // Fallback
      setResult({
        decision: 'wait',
        decisionLabel: 'اصبر ومو وقته',
        verdictTitle: 'لا تتحمس، مو وقتها أبداً 😂',
        summary: `رصيدك الحالي ${userState.currentBalance} ريال وباقي ${userState.daysToSalary} يوم على الراتب. هذا القرار بيأثر مباشرة على أساسياتك.`,
        financialImpact: 'الحفاظ على رصيد الطوارئ',
        smartAlternative: 'أجل هالأمر لأول أسبوع بعد نزول الراتب وخل ميزانية اليوم للضروريات بس.',
        nextStep: 'التزم بميزانية اليوم الآمنة وتجنب الصرف المفاجئ.',
        tone: 'humorous',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getDecisionBadge = (decision: DecisionResult['decision']) => {
    switch (decision) {
      case 'go':
        return {
          bg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
          icon: CheckCircle,
          label: 'توكل على الله',
        };
      case 'wait':
        return {
          bg: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
          icon: XCircle,
          label: 'اصبر ومو وقته',
        };
      case 'warning':
        return {
          bg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
          icon: AlertOctagon,
          label: 'انتبه خطر مالي',
        };
      case 'alternative':
      default:
        return {
          bg: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
          icon: Lightbulb,
          label: 'بديل ذكي أفضل',
        };
    }
  };

  return (
    <div className="bg-[#0B1224] rounded-2xl border border-slate-800/90 p-5 sm:p-6 shadow-md relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Title & Question Header */}
      <div className="text-center max-w-xl mx-auto mb-5 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#0E172A] text-teal-300 border border-slate-700/60 mb-2.5">
          <HelpCircle className="w-3.5 h-3.5 text-teal-400" />
          <span>محرك القرارات الصائبة</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
          «وش أفضل قرار أسويه الآن؟»
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
          اكتب أي حيرة أو رغبة تواجهك، وبنحسبها فوراً مقارنة برصيدك ({userState.currentBalance} ر.س) والأيام المتبقية ({userState.daysToSalary} يوم).
        </p>
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAsk();
        }}
        className="max-w-xl mx-auto mb-4 relative z-10"
      >
        <div className="relative flex items-center">
          <input
            id="input-decision-query"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="مثلاً: أطلب عشاء بـ 55 ريال؟ أو أشتري السماعة؟ أو أغير الزيت؟"
            className="w-full bg-[#070A12] hover:bg-[#070A12]/80 focus:bg-[#070A12] border border-slate-800 focus:border-teal-500 rounded-xl py-3.5 pr-4 pl-12 text-sm sm:text-base font-semibold text-slate-100 placeholder:text-slate-500 transition-all outline-hidden shadow-inner"
          />
          <button
            id="btn-submit-decision"
            type="submit"
            disabled={!question.trim() || isLoading}
            className="absolute left-2 p-2.5 rounded-lg bg-teal-500 hover:bg-teal-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-black transition-colors flex items-center justify-center shadow-xs"
            title="احسب القرار"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4 rotate-180" />
            )}
          </button>
        </div>
      </form>

      {/* Quick Dilemmas Chips */}
      <div className="max-w-xl mx-auto mb-5 relative z-10">
        <div className="text-[11px] font-bold text-slate-400 mb-2 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>أو اختر حيرة يومية شائعة:</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {QUICK_DILEMMAS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleAsk(item.text)}
                disabled={isLoading}
                className="text-right p-2.5 rounded-xl border border-slate-800/90 bg-[#0E172A] hover:bg-slate-800 hover:border-slate-700 text-xs font-bold text-slate-300 transition-all flex items-center gap-2 group"
              >
                <div className="w-6 h-6 rounded-lg bg-[#070A12] border border-slate-800 flex items-center justify-center shrink-0 text-slate-400 group-hover:text-teal-400 transition-colors">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="truncate">{item.text}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Result Card */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            id="decision-result-card"
            className="max-w-xl mx-auto rounded-2xl border border-teal-500/30 bg-gradient-to-b from-[#0F1C33] via-[#0E172A] to-[#0A0F1D] p-5 sm:p-6 shadow-xl relative overflow-hidden"
          >
            {/* Top Badge */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <DabbirniLogo size="xs" variant="icon" />
                {(() => {
                  const badge = getDecisionBadge(result.decision);
                  const BadgeIcon = badge.icon;
                  return (
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${badge.bg}`}
                    >
                      <BadgeIcon className="w-3.5 h-3.5" />
                      <span>{result.decisionLabel || badge.label}</span>
                    </span>
                  );
                })()}
              </div>

              <span className="text-[11px] text-teal-400/80 font-bold">
                قرار «دبّرني» المباشر
              </span>
            </div>

            {/* Verdict Punchline */}
            <h3 className="text-lg sm:text-xl font-black text-slate-100 mb-2 leading-snug">
              {result.verdictTitle}
            </h3>

            {/* Explanation */}
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed mb-4">
              {result.summary}
            </p>

            {/* Financial Impact & Next Step Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3 border-t border-slate-800">
              <div className="bg-[#070A12] p-3 rounded-xl border border-slate-800/90">
                <span className="text-[11px] text-slate-400 font-bold block mb-0.5">
                  الأثر المالي المباشر:
                </span>
                <span className="text-xs sm:text-sm font-black text-slate-200">
                  {result.financialImpact}
                </span>
              </div>

              <div className="bg-[#070A12] p-3 rounded-xl border border-slate-800/90">
                <span className="text-[11px] text-slate-400 font-bold block mb-0.5">
                  وش تسوي الحين بالضبط؟
                </span>
                <span className="text-xs sm:text-sm font-black text-teal-400">
                  {result.nextStep}
                </span>
              </div>
            </div>

            {/* Smart Alternative if available */}
            {result.smartAlternative && (
              <div className="mt-3 bg-[#070A12]/90 border border-amber-500/30 rounded-xl p-3 flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-black text-amber-300 block">بديل ذكي مقترح:</span>
                  <p className="text-xs text-slate-300 font-medium mt-0.5">
                    {result.smartAlternative}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
