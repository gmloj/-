import React, { useState } from 'react';
import { ChevronRight, User, Wallet, Calendar, ShieldCheck, Palette, Save, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserState } from '../../types';
import { formatSAR, calculateSafeDailyBudget } from '../../utils/financialCalculations';

interface AccountScreenProps {
  userState: UserState;
  onBack: () => void;
  onUpdateState: (state: UserState) => void;
  onOpenBrandGuide: () => void;
}

export const AccountScreen: React.FC<AccountScreenProps> = ({
  userState,
  onBack,
  onUpdateState,
  onOpenBrandGuide,
}) => {
  const [name, setName] = useState(userState.name);
  const [balance, setBalance] = useState(userState.currentBalance.toString());
  const [days, setDays] = useState(userState.daysToSalary.toString());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const updated: UserState = {
      ...userState,
      name: name.trim() || 'إيسكو',
      currentBalance: Number.isFinite(Number(balance)) ? Number(balance) : userState.currentBalance,
      daysToSalary: Number.isFinite(Number(days)) ? Math.max(0, Math.floor(Number(days))) : userState.daysToSalary,
    };
    updated.todaySpendingTarget = calculateSafeDailyBudget(updated);
    onUpdateState(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-[640px] sm:min-h-[720px] w-full bg-[#070A12] text-slate-100 flex flex-col justify-between p-4 sm:p-5 rounded-3xl sm:rounded-[36px] border border-slate-800/80 shadow-2xl relative overflow-hidden select-none">
      {/* Top Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 flex items-center justify-between pb-2 border-b border-slate-800/60"
      >
        <div className="w-8" />
        <h1 className="text-base font-black text-white">حسابي وإعداداتي</h1>
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

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col items-center py-4 relative z-10"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 shadow-xl shadow-cyan-500/10"
        >
          <div className="w-full h-full rounded-full bg-[#070A12] flex items-center justify-center text-cyan-400 font-black text-xl">
            {name.charAt(0) || 'إ'}
          </div>
        </motion.div>
        <h2 className="text-base font-black text-white mt-2">{name}</h2>
        <span className="text-[11px] text-teal-400 font-medium bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20 mt-1">
          خطة مالية نشطة
        </span>
      </motion.div>

      {/* Editable Fields */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-3 relative z-10 text-xs"
      >
        <div>
          <label className="text-[11px] font-bold text-slate-400 block mb-1">
            الاسم
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#0B1224] border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400 transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1">
              الرصيد الفعلي (ريال)
            </label>
            <input
              type="number"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              className="w-full bg-[#0B1224] border border-slate-800 rounded-xl px-3 py-2 text-white font-sans focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1">
              الأيام للراتب
            </label>
            <input
              type="number"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              className="w-full bg-[#0B1224] border border-slate-800 rounded-xl px-3 py-2 text-white font-sans focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>
        </div>

        {/* Brand Guide Shortcut */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={onOpenBrandGuide}
          className="w-full p-3 rounded-2xl bg-[#0B1224] hover:bg-[#0E172A] border border-slate-800 flex items-center justify-between text-slate-300 hover:text-white transition-all mt-2 cursor-pointer shadow-sm"
        >
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-cyan-400" />
            <span className="font-bold">استعراض هوية وشعار «دبّرني»</span>
          </div>
          <ChevronRight className="w-4 h-4 rotate-180 text-slate-500" />
        </motion.button>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="pt-4 relative z-10"
      >
        <AnimatePresence>
          {saved && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-400 mb-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>تم حفظ التعديلات بنجاح</span>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          className="w-full py-3 px-4 rounded-full bg-gradient-to-r from-cyan-400 to-teal-500 text-slate-950 font-black text-xs shadow-lg shadow-cyan-950/40 flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <Save className="w-4 h-4" />
          <span>حفظ التعديلات</span>
        </motion.button>
      </motion.div>
    </div>
  );
};

