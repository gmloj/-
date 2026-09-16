import React from 'react';
import {
  Bell,
  Sun,
  Wallet,
  Calendar,
  FileText,
  Headphones,
  ChevronLeft,
  Sparkles,
  Plus,
  Receipt,
  ShoppingCart,
  ChevronRight,
} from 'lucide-react';
import { motion, type Variants } from 'motion/react';
import { UserState } from '../../types';
import { formatSAR, getTodayTotalSpent } from '../../utils/financialCalculations';

interface HomeScreenProps {
  userState: UserState;
  onOpenScan: () => void;
  onOpenDecision: (item?: string) => void;
  onOpenAddExpense: () => void;
  onOpenExpensesList: () => void;
  onOpenAccount: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  userState,
  onOpenScan,
  onOpenDecision,
  onOpenAddExpense,
  onOpenExpensesList,
  onOpenAccount,
}) => {
  const upcoming = [...userState.commitments].sort((a,b)=>a.dueInDays-b.dueInDays)[0];
  const totalSpent = getTodayTotalSpent(userState);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 14, scale: 0.96 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div className="min-h-[640px] sm:min-h-[720px] w-full bg-[#070A12] text-slate-100 flex flex-col justify-between p-4 sm:p-5 rounded-3xl sm:rounded-[36px] border border-slate-800/80 shadow-2xl relative overflow-hidden select-none">
      {/* Background Soft Glows */}
      <motion.div
        animate={{
          opacity: [0.08, 0.18, 0.08],
          scale: [0.95, 1.05, 0.95],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-12 left-6 w-52 h-52 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          opacity: [0.08, 0.16, 0.08],
          scale: [1, 1.08, 1],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-20 right-6 w-52 h-52 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"
      />

      {/* Top Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex items-start justify-between gap-3 pt-1"
      >
        {/* Left: Notification Bell */}
        <motion.button
          id="btn-notifications"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="w-9 h-9 rounded-full bg-[#0D1527] border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-colors relative"
          title="التنبيهات"
        >
          <Bell className="w-4 h-4" />
          <motion.span
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-2 right-2 w-2 h-2 rounded-full bg-teal-400 ring-2 ring-[#070A12]"
          />
        </motion.button>

        {/* Right: Greeting & Brand */}
        <div className="text-right">
          <div className="flex items-center justify-end gap-2">
            <span className="text-xl sm:text-2xl font-black text-white font-sans tracking-tight">
              دبّرني
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 mt-1">
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-100">
                صباح الخير {userState.name || 'إيسكو'}
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">
                قراراتك اليوم تصنع حياة أفضل غداً
              </p>
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-sm shrink-0"
            >
              <Sun className="w-4 h-4" />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* 4 Hero Cards Grid (2x2) with Staggered Entrance */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-2.5 my-3 relative z-10"
      >
        {/* Card 1: ميزانية اليوم الآمنة (Top-Right in Arabic RTL layout) */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -2, transition: { duration: 0.15 } }}
          className="bg-[#0B1426] border border-cyan-500/20 rounded-2xl p-3.5 flex flex-col justify-between shadow-lg relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-400">
              ميزانية الآمنة
            </span>
            <div className="w-7 h-7 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-white font-sans tracking-tight">
              {userState.todaySpendingTarget} <span className="text-xs font-bold text-slate-400">ريال</span>
            </div>
          </div>
        </motion.div>

        {/* Card 2: باقي على الراتب (Top-Left in Arabic RTL layout) */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -2, transition: { duration: 0.15 } }}
          className="bg-[#09171C] border border-emerald-500/20 rounded-2xl p-3.5 flex flex-col justify-between shadow-lg relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-400">
              باقي
            </span>
            <div className="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-400 font-sans tracking-tight">
              {userState.daysToSalary} <span className="text-xs font-bold text-slate-400">يوم</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">على الراتب</span>
          </div>
        </motion.div>

        {/* Card 3: السماعة؟ لا تتحمس، مو وقتها (Bottom-Right in Arabic RTL layout) */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -2, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          id="card-headphone-dilemma"
          onClick={() => onOpenDecision('السماعة بـ 400 ريال')}
          className="bg-[#0E1529] border border-indigo-500/25 rounded-2xl p-3 flex flex-col justify-between shadow-lg cursor-pointer hover:border-indigo-400/50 transition-all group relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              AI
            </span>
            <div className="w-7 h-7 rounded-xl bg-indigo-500/15 text-indigo-300 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Headphones className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-xs font-black text-white block">السماعة؟</span>
            <span className="text-[11px] font-bold text-rose-400 block mt-0.5">
              لا تتحمس، مو وقتها
            </span>
            <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-800/80">
              <span className="text-[9px] text-slate-400">في التزامات أهم حالياً</span>
              <div className="w-4 h-4 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center group-hover:-translate-x-1 transition-transform">
                <ChevronLeft className="w-3 h-3" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Card 4: فاتورة 220 ريال بعد 4 أيام (Bottom-Left in Arabic RTL layout) */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -2, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          id="card-bill-alert"
          onClick={onOpenScan}
          className="bg-[#17121C] border border-amber-500/20 rounded-2xl p-3 flex flex-col justify-between shadow-lg cursor-pointer hover:border-amber-400/40 transition-all group"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-slate-400">
              فاتورة
            </span>
            <div className="w-7 h-7 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-xl font-black text-amber-300 font-sans tracking-tight">
              {upcoming?.amount ?? 0} <span className="text-xs font-bold text-slate-400">ريال</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">{upcoming ? `بعد ${upcoming.dueInDays} أيام` : 'لا توجد التزامات'}</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Middle: ملخص إنفاقك هذا الشهر (Monthly Spending Progress) */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[#0B1224] border border-slate-800/90 rounded-2xl p-3.5 my-1 relative z-10"
      >
        <div className="flex items-center justify-between mb-2 text-xs">
          <button
            onClick={onOpenExpensesList}
            className="text-[11px] text-slate-400 hover:text-cyan-400 transition-colors"
          >
            &lt;عرض الكل&gt;
          </button>
          <span className="font-bold text-slate-200 text-xs">
            ملخص إنفاقك هذا الشهر
          </span>
        </div>

        {/* Animated Progress bar */}
        <div className="w-full bg-[#070A12] h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-800 relative">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '41%' }}
            transition={{ duration: 1.2, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="h-full rounded-full bg-gradient-to-l from-cyan-400 to-teal-500 shadow-[0_0_12px_rgba(34,211,238,0.4)]"
          />
        </div>

        <div className="flex items-center justify-between mt-2 text-xs">
          <div className="text-right">
            <span className="text-xs font-black text-slate-200 font-sans">1,240</span>
            <span className="text-[10px] text-slate-400 block">من 3,000 ريال</span>
          </div>
          <div className="text-left">
            <span className="text-xs font-black text-cyan-400 font-sans">41%</span>
            <span className="text-[10px] text-slate-400 block">تم الإنفاق</span>
          </div>
        </div>
      </motion.div>

      {/* Bottom: إجراءات سريعة (4 Quick Actions Grid) */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="my-2 relative z-10"
      >
        <div className="text-right mb-2">
          <span className="text-xs font-bold text-slate-300">
            إجراءات سريعة
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {/* Action 1: مساعد AI */}
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.94 }}
            id="btn-quick-ai"
            onClick={() => onOpenDecision()}
            className="bg-[#0D1527] hover:bg-[#131F38] border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-2.5 flex flex-col items-center justify-center gap-1.5 transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-300 flex items-center justify-center group-hover:rotate-12 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-300 group-hover:text-white">
              مساعد AI
            </span>
          </motion.button>

          {/* Action 2: إضافة مصروف */}
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.94 }}
            id="btn-quick-add-expense"
            onClick={onOpenAddExpense}
            className="bg-[#0D1527] hover:bg-[#131F38] border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-2.5 flex flex-col items-center justify-center gap-1.5 transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center group-hover:rotate-90 transition-transform">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-300 group-hover:text-white">
              إضافة مصروف
            </span>
          </motion.button>

          {/* Action 3: تحليل فاتورة */}
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.94 }}
            id="btn-quick-scan-bill"
            onClick={onOpenScan}
            className="bg-[#0D1527] hover:bg-[#131F38] border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-2.5 flex flex-col items-center justify-center gap-1.5 transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Receipt className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-300 group-hover:text-white">
              تحليل فاتورة
            </span>
          </motion.button>

          {/* Action 4: قرار الشراء */}
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.94 }}
            id="btn-quick-purchase-decision"
            onClick={() => onOpenDecision('سماعة لاسلكية بـ 400 ريال')}
            className="bg-[#0D1527] hover:bg-[#131F38] border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-2.5 flex flex-col items-center justify-center gap-1.5 transition-all group"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-300 group-hover:text-white">
              قرار الشراء
            </span>
          </motion.button>
        </div>
      </motion.div>

      {/* Bottom Navigation Bar with Interactive Hover */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="pt-2 border-t border-slate-800/80 flex items-center justify-around relative z-10"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onOpenAccount}
          className="flex flex-col items-center text-slate-400 hover:text-slate-200 transition-colors"
        >
          <span className="text-xs font-bold">...</span>
          <span className="text-[10px] mt-0.5">المزيد</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onOpenExpensesList}
          className="flex flex-col items-center text-slate-400 hover:text-slate-200 transition-colors"
        >
          <span className="text-xs font-bold font-sans">📊</span>
          <span className="text-[10px] mt-0.5">المصاريف</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex flex-col items-center text-cyan-400 font-bold"
        >
          <span className="text-xs">🏠</span>
          <span className="text-[10px] mt-0.5">الرئيسية</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onOpenAccount}
          className="flex flex-col items-center text-slate-400 hover:text-slate-200 transition-colors"
        >
          <span className="text-xs">👤</span>
          <span className="text-[10px] mt-0.5">حسابي</span>
        </motion.button>
      </motion.div>
    </div>
  );
};

