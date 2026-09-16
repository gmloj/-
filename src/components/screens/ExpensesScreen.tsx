import React from 'react';
import { ChevronRight, Plus, Trash2, Calendar, TrendingDown, Coffee, Utensils, Receipt } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserState, Expense } from '../../types';
import { formatSAR, getTodayTotalSpent } from '../../utils/financialCalculations';

interface ExpensesScreenProps {
  userState: UserState;
  onBack: () => void;
  onOpenAddExpense: () => void;
  onRemoveExpense: (id: string) => void;
}

export const ExpensesScreen: React.FC<ExpensesScreenProps> = ({
  userState,
  onBack,
  onOpenAddExpense,
  onRemoveExpense,
}) => {
  const totalSpent = getTodayTotalSpent(userState);
  const safeTarget = userState.todaySpendingTarget;
  const remaining = safeTarget - totalSpent;
  const isOver = remaining < 0;

  return (
    <div className="min-h-[640px] sm:min-h-[720px] w-full bg-[#070A12] text-slate-100 flex flex-col justify-between p-4 sm:p-5 rounded-3xl sm:rounded-[36px] border border-slate-800/80 shadow-2xl relative overflow-hidden select-none">
      {/* Top Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 flex items-center justify-between pb-2 border-b border-slate-800/60"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onOpenAddExpense}
          className="w-8 h-8 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center hover:bg-cyan-500/25 transition-colors"
          title="إضافة مصروف"
        >
          <Plus className="w-4 h-4" />
        </motion.button>
        <h1 className="text-base font-black text-white">سجل المصاريف</h1>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="w-8 h-8 rounded-full bg-[#0D1527] border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          title="رجوع"
        >
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </motion.div>

      {/* Overview Stat Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[#0B1224] border border-slate-800 rounded-2xl p-4 my-2 shadow-lg"
      >
        <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
          <span>ميزانية اليوم الآمنة</span>
          <span>{formatSAR(safeTarget)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-slate-300">مجموع مصروف اليوم:</span>
          <span
            className={`text-xl font-black font-sans ${
              isOver ? 'text-amber-400' : 'text-emerald-400'
            }`}
          >
            {formatSAR(totalSpent)}
          </span>
        </div>
        <div className="mt-2 pt-2 border-t border-slate-800 flex justify-between text-[11px]">
          <span className="text-slate-400">المتبقي:</span>
          <span className={`font-bold ${isOver ? 'text-amber-400' : 'text-cyan-400'}`}>
            {isOver ? `تجاوز بـ ${formatSAR(Math.abs(remaining))}` : `آمن بـ ${formatSAR(remaining)}`}
          </span>
        </div>
      </motion.div>

      {/* Expenses List with AnimatePresence */}
      <div className="flex-1 overflow-y-auto space-y-2 py-2 max-h-80">
        {userState.todayExpenses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-10 text-slate-500 text-xs"
          >
            لا توجد مصاريف مسجلة لليوم بعد.
          </motion.div>
        ) : (
          <AnimatePresence>
            {userState.todayExpenses.map((exp, idx) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 20 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#0D1527] border border-slate-800 text-xs shadow-sm hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.85 }}
                    onClick={() => onRemoveExpense(exp.id)}
                    className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                    title="حذف"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </motion.button>
                  <div className="text-right">
                    <span className="font-bold text-slate-200 block">{exp.title}</span>
                    <span className="text-[10px] text-slate-400">{exp.timestamp}</span>
                  </div>
                </div>

                <div className="text-left">
                  <span className="font-black text-white font-sans text-sm block">
                    {formatSAR(exp.amount)}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Bottom Button */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="pt-2"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenAddExpense}
          className="w-full py-3 px-4 rounded-full bg-gradient-to-r from-cyan-400 to-teal-500 text-slate-950 font-black text-xs shadow-lg shadow-cyan-950/40 flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>+ تسجيل مصروف جديد</span>
        </motion.button>
      </motion.div>
    </div>
  );
};

