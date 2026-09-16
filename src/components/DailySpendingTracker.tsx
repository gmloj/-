import React, { useState } from 'react';
import { Plus, Coffee, Utensils, Fuel, ShoppingBag, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { UserState, Expense } from '../types';
import { formatSAR, getTodayTotalSpent } from '../utils/financialCalculations';

interface DailySpendingTrackerProps {
  userState: UserState;
  onAddExpense: (expense: Omit<Expense, 'id' | 'timestamp'>) => void;
  onRemoveExpense: (id: string) => void;
  onSimulatePromptScenario: () => void;
}

export const DailySpendingTracker: React.FC<DailySpendingTrackerProps> = ({
  userState,
  onAddExpense,
  onRemoveExpense,
  onSimulatePromptScenario,
}) => {
  const [customTitle, setCustomTitle] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const totalSpent = getTodayTotalSpent(userState);
  const target = userState.todaySpendingTarget;
  const diff = totalSpent - target;
  const isOver = diff > 0;
  const progressPercent = Math.min(100, Math.round((totalSpent / target) * 100));

  const handleQuickAdd = (title: string, amount: number, category: Expense['category']) => {
    onAddExpense({ title, amount, category });
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(customAmount);
    if (!customTitle.trim() || isNaN(amountNum) || amountNum <= 0) return;

    onAddExpense({
      title: customTitle.trim(),
      amount: amountNum,
      category: 'other',
    });
    setCustomTitle('');
    setCustomAmount('');
    setShowAddForm(false);
  };

  return (
    <div id="spending-tracker-card" className="bg-[#0B1224] rounded-2xl border border-slate-800/90 p-5 sm:p-6 shadow-md relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 relative z-10">
        <div>
          <h3 className="text-lg font-black text-slate-100">
            مصروفات اليوم ومسار الميزانية
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            تسجيل سريع لمصاريفك اليومية لإبقاء مسارك آمناً وتفادي أي ضغوطات قبل الراتب.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onSimulatePromptScenario}
            className="px-2.5 py-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold transition-colors"
            title="جرب سيناريو الليل (صرفت 83 ريال أعلى من الميزانية بـ 31)"
          >
            ⚡ تجربة سيناريو 83 ر.س
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-black transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>تسجيل مصروف</span>
          </button>
        </div>
      </div>

      {/* Progress Bar & Status */}
      <div className="bg-[#0E172A] border border-slate-800/90 rounded-xl p-4 mb-4 relative z-10">
        <div className="flex items-center justify-between text-xs font-bold mb-2">
          <span className="text-slate-300">
            صرفت اليوم: <strong className="text-slate-100 font-black">{formatSAR(totalSpent)}</strong>
          </span>
          <span className="text-slate-300">
            الحد اليومي الآمن: <strong className="text-teal-400 font-black">{formatSAR(target)}</strong>
          </span>
        </div>

        {/* Meter */}
        <div className="w-full bg-[#070A12] h-2.5 rounded-full overflow-hidden mb-2 border border-slate-800/80">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isOver ? 'bg-amber-400' : 'bg-teal-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-semibold">
          {isOver ? (
            <span className="text-amber-300 flex items-center gap-1 font-bold">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>أعلى من ميزانيتك بـ {diff} ريال — بكرة نخفّض الحد ونرجع للمسار</span>
            </span>
          ) : (
            <span className="text-teal-400 flex items-center gap-1 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>باقي لك اليوم {target - totalSpent} ريال ضمن الحدود الآمنة</span>
            </span>
          )}
          <span className="text-slate-400 font-normal">
            باقي {userState.daysToSalary} يوم للراتب
          </span>
        </div>
      </div>

      {/* Quick 1-tap Buttons */}
      <div className="mb-4 relative z-10">
        <span className="text-xs font-bold text-slate-400 mb-2 block">
          تسجيل سريع بلمسة واحدة:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => handleQuickAdd('قهوة الطريق', 18, 'coffee')}
            className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-800/90 bg-[#0E172A] hover:bg-slate-800 text-xs font-bold text-slate-200 transition-colors"
          >
            <Coffee className="w-3.5 h-3.5 text-amber-400" />
            <span>قهوة (18 ر.س)</span>
          </button>
          <button
            onClick={() => handleQuickAdd('غداء عمل', 32, 'food')}
            className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-800/90 bg-[#0E172A] hover:bg-slate-800 text-xs font-bold text-slate-200 transition-colors"
          >
            <Utensils className="w-3.5 h-3.5 text-teal-400" />
            <span>غداء (32 ر.س)</span>
          </button>
          <button
            onClick={() => handleQuickAdd('بنزين سيارة', 50, 'transport')}
            className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-800/90 bg-[#0E172A] hover:bg-slate-800 text-xs font-bold text-slate-200 transition-colors"
          >
            <Fuel className="w-3.5 h-3.5 text-indigo-400" />
            <span>بنزين (50 ر.س)</span>
          </button>
          <button
            onClick={() => handleQuickAdd('بقالة خفيفة', 25, 'shopping')}
            className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-800/90 bg-[#0E172A] hover:bg-slate-800 text-xs font-bold text-slate-200 transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-purple-400" />
            <span>بقالة (25 ر.س)</span>
          </button>
        </div>
      </div>

      {/* Custom Add Form */}
      {showAddForm && (
        <form onSubmit={handleCustomSubmit} className="bg-[#0E172A] p-3.5 rounded-xl border border-slate-800 mb-4 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
            <input
              type="text"
              placeholder="اسم المصروف (مثلاً: حلاق، صيدلية)"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="sm:col-span-2 bg-[#070A12] border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-100 outline-hidden focus:border-teal-500"
            />
            <input
              type="number"
              placeholder="المبلغ (ر.س)"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="bg-[#070A12] border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-100 outline-hidden focus:border-teal-500"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-200"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-black shadow-xs"
            >
              حفظ
            </button>
          </div>
        </form>
      )}

      {/* Expenses List */}
      <div className="space-y-1.5 relative z-10">
        <span className="text-xs font-bold text-slate-400 block mb-1">
          سجل مصروفات اليوم:
        </span>
        {userState.todayExpenses.length === 0 ? (
          <p className="text-xs text-slate-400 py-3 text-center">
            لم تسجل أي مصروفات اليوم بعد. أمورك ممتازة!
          </p>
        ) : (
          userState.todayExpenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between p-2.5 rounded-xl border border-slate-800/80 hover:border-slate-700 bg-[#0E172A]/70 text-xs transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-200">{expense.title}</span>
                <span className="text-[11px] text-slate-400">{expense.timestamp}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-black text-slate-100">
                  {formatSAR(expense.amount)}
                </span>
                <button
                  onClick={() => onRemoveExpense(expense.id)}
                  className="text-slate-400 hover:text-rose-400 transition-colors p-1"
                  title="حذف"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
