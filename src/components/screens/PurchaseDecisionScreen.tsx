import React, { useState } from 'react';
import {
  ChevronRight,
  Heart,
  XCircle,
  User,
  FileText,
  Clock,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  ArrowLeft,
  Share2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserState } from '../../types';
import { calculateSafeDailyBudget } from '../../utils/financialCalculations';
import headphonesImg from '../../assets/images/headphones_product_1789485445048.jpg';

interface PurchaseDecisionScreenProps {
  userState: UserState;
  onBack: () => void;
  initialItemName?: string;
  onProceedAnyway?: (title:string, amount:number) => void;
}

export const PurchaseDecisionScreen: React.FC<PurchaseDecisionScreenProps> = ({
  userState,
  onBack,
  initialItemName = 'سماعة لاسلكية',
  onProceedAnyway,
}) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [showAlternativeModal, setShowAlternativeModal] = useState(false);
  const [customItemQuery, setCustomItemQuery] = useState(initialItemName);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [proceedConfirmed, setProceedConfirmed] = useState(false);

  const [price,setPrice] = useState('400');
  const amount = Number(price);
  const validPrice = Number.isFinite(amount) && amount > 0;
  const safeBudget = calculateSafeDailyBudget(userState);
  const affordable = validPrice && amount <= Math.max(0,userState.todaySpendingTarget-userState.todayExpenses.reduce((sum,e)=>sum+e.amount,0)) && amount <= userState.currentBalance;
  const reserved = userState.commitments.filter(c=>c.isEssential && c.dueInDays<=userState.daysToSalary).reduce((sum,c)=>sum+c.amount,0);
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
        <h1 className="text-base font-black text-white">قرار الشراء</h1>
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

      {/* Title & Subtitle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-center py-2 relative z-10"
      >
        <h2 className="text-base font-black text-white">هل أشتريه؟</h2>
        <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
          تقييم حسابي محلي مبني على رصيدك والتزاماتك
        </p>
      </motion.div>

      {/* Product Showcase Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[#0B1224] border border-slate-800/90 rounded-2xl p-3.5 relative z-10 shadow-lg my-1"
      >
        {/* Favorite icon on top right */}
        <div className="flex justify-between items-center mb-1">
          <div className="w-6" />
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
            onClick={() => setIsFavorited(!isFavorited)}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
              isFavorited
                ? 'bg-rose-500/20 text-rose-400'
                : 'text-slate-400 hover:text-white bg-[#070A12]'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-rose-400 text-rose-400' : ''}`} />
          </motion.button>
        </div>

        {/* Product Image with smooth floating animation */}
        <div className="w-36 h-36 mx-auto relative flex items-center justify-center -my-2">
          <motion.img
            animate={{
              y: [0, -6, 0],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            src={headphonesImg}
            alt="سماعة لاسلكية"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
          />
        </div>

        {/* Product Info footer */}
        <div className="flex items-end justify-between pt-1 border-t border-slate-800/60 mt-1">
          <div className="text-right">
            <h3 className="text-xs font-black text-white">
              <input aria-label="اسم المنتج" value={customItemQuery} onChange={e=>setCustomItemQuery(e.target.value)} disabled={proceedConfirmed} className="bg-transparent w-40"/>
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">
              صوت عالي .. لحياة أعمق
            </p>
          </div>
          <div className="text-left">
            <span className="text-sm font-black text-white font-sans">
              <input aria-label="سعر المنتج" type="number" min="0.01" step="0.01" value={price} disabled={proceedConfirmed} onChange={e=>setPrice(e.target.value)} className="bg-transparent w-20"/> ريال
            </span>
          </div>
        </div>
      </motion.div>

      {/* Verdict Card (Red Glow Warning) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{
          opacity: 1,
          y: 0,
          borderColor: [
            'rgba(244, 63, 94, 0.25)',
            'rgba(244, 63, 94, 0.55)',
            'rgba(244, 63, 94, 0.25)',
          ],
        }}
        transition={{
          duration: 0.6,
          delay: 0.3,
          borderColor: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="bg-[#191018] border border-rose-500/30 rounded-2xl p-3.5 relative z-10 shadow-lg my-1"
      >
        {/* Verdict Badge */}
        <div className="flex items-center justify-between pb-2.5 border-b border-rose-950/60">
          <div className="text-right">
            <h3 className="text-sm font-black text-rose-300">
              {affordable ? 'ضمن حد اليوم المتبقي' : 'الأفضل التأجيل'}
            </h3>
            <p className="text-[10px] text-rose-300/80 mt-0.5">
              {affordable ? 'تأكد من حاجتك للمنتج قبل الشراء' : 'قد يضغط الشراء على احتياجاتك الأساسية'}
            </p>
          </div>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-7 h-7 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shadow-[0_0_10px_rgba(244,63,94,0.3)]"
          >
            <XCircle className="w-4 h-4" />
          </motion.div>
        </div>

        {/* Reasons Section */}
        <div className="pt-2">
          <span className="text-[11px] font-bold text-slate-400 block mb-2 text-right">
            أسباب التوصية:
          </span>

          <div className="space-y-2 text-xs">
            {/* Reason 1 */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="flex items-center justify-between p-2 rounded-xl bg-[#0B0912]/80 border border-rose-950/40"
            >
              <div className="text-right">
                <span className="font-bold text-slate-200 block text-[11px]">
                  سيؤثر على سيولتك قبل الراتب
                </span>
                <span className="text-[10px] text-slate-400">
                  باقي {userState.daysToSalary} يوم على الراتب
                </span>
              </div>
              <div className="w-7 h-7 rounded-lg bg-rose-500/15 text-rose-400 flex items-center justify-center shrink-0">
                <User className="w-3.5 h-3.5" />
              </div>
            </motion.div>

            {/* Reason 2 */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="flex items-center justify-between p-2 rounded-xl bg-[#0B0912]/80 border border-rose-950/40"
            >
              <div className="text-right">
                <span className="font-bold text-slate-200 block text-[11px]">
                  التزامات أساسية قبل الراتب: {reserved} ريال
                </span>
                <span className="text-[10px] text-slate-400">
                  محجوزة من ميزانيتك
                </span>
              </div>
              <div className="w-7 h-7 rounded-lg bg-rose-500/15 text-rose-400 flex items-center justify-center shrink-0">
                <FileText className="w-3.5 h-3.5" />
              </div>
            </motion.div>

            {/* Reason 3 */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="flex items-center justify-between p-2 rounded-xl bg-[#0B0912]/80 border border-rose-950/40"
            >
              <div className="text-right">
                <span className="font-bold text-slate-200 block text-[11px]">
                  {affordable ? 'ضمن ميزانية اليوم' : 'يتجاوز حد اليوم أو الرصيد المتاح'}
                </span>
                <span className="text-[10px] text-slate-400">
                  ميزانية اليوم {userState.todaySpendingTarget} ريال فقط
                </span>
              </div>
              <div className="w-7 h-7 rounded-lg bg-rose-500/15 text-rose-400 flex items-center justify-center shrink-0">
                <Clock className="w-3.5 h-3.5" />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Bottom Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.65 }}
        className="space-y-2 pt-1 relative z-10"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          id="btn-explore-alternatives"
          onClick={() => setShowAlternativeModal(true)}
          className="w-full py-3 px-4 rounded-full bg-gradient-to-r from-slate-100 via-white to-slate-200 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-cyan-950/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-cyan-600" />
          <span>استكشف بدائل مناسبة</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          id="btn-proceed-anyway"
          disabled={proceedConfirmed || !validPrice || !customItemQuery.trim()}
          onClick={() => {
            setProceedConfirmed(true);
            if (onProceedAnyway) onProceedAnyway(customItemQuery.trim(), amount);
          }}
          className="w-full text-center text-xs font-bold text-cyan-400 hover:text-cyan-300 py-1 transition-colors underline underline-offset-4 cursor-pointer"
        >
          {proceedConfirmed ? 'تم التسجيل وسنعيد موازنة الأيام القادمة!' : 'سجّل أنني اشتريته'}
        </motion.button>
      </motion.div>

      {/* Smart Alternative Modal with AnimatePresence */}
      <AnimatePresence>
        {showAlternativeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 bg-[#070A12]/95 backdrop-blur-md p-4 flex flex-col justify-between"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-400" />
                  <span>بدائل ذكية مقترحة من «دبّرني»</span>
                </h4>
                <button
                  onClick={() => setShowAlternativeModal(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 mt-4 text-sm leading-7 text-slate-200">
                <p>أجّل الشراء {userState.daysToSalary} يوم حتى موعد الراتب الذي أدخلته.</p>
                <p>المتاح يومياً للأيام المتبقية: {safeBudget} ريال بعد حجز الالتزامات.</p>
                <p>قارن بمنتج أقل سعراً، أو استخدم الموجود عندك إلى أن تتوفر ميزانية مستقلة.</p>
                <p className="text-xs text-slate-400">هذه اقتراحات عامة محسوبة محلياً. لا توجد تنبيهات مجدولة أو عروض متاجر مرتبطة في نسخة العرض.</p>
              </div>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAlternativeModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold transition-colors"
            >
              فهمت الفكرة، شكراً دبّرني
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

