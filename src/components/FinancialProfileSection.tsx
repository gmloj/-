import React, { useState } from 'react';
import {
  Wallet,
  Calendar,
  CreditCard,
  Heart,
  Save,
  RotateCcw,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';
import { UserState, Commitment, WishlistItem } from '../types';
import { initialUserState } from '../data/defaultData';
import { calculateSafeDailyBudget, formatSAR } from '../utils/financialCalculations';

interface FinancialProfileSectionProps {
  userState: UserState;
  onSave: (updated: UserState) => void;
}

export const FinancialProfileSection: React.FC<FinancialProfileSectionProps> = ({
  userState,
  onSave,
}) => {
  const [formData, setFormData] = useState<UserState>({ ...userState });
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Temporary additions
  const [newBillTitle, setNewBillTitle] = useState('');
  const [newBillAmount, setNewBillAmount] = useState('');
  const [newBillDays, setNewBillDays] = useState('');

  const [newWishTitle, setNewWishTitle] = useState('');
  const [newWishPrice, setNewWishPrice] = useState('');

  const calculatedSafe = calculateSafeDailyBudget(formData);

  const handleAddBill = () => {
    const amount = parseFloat(newBillAmount);
    const days = parseInt(newBillDays, 10);
    if (!newBillTitle.trim() || isNaN(amount) || amount <= 0) return;

    const newCommitment: Commitment = {
      id: 'com-' + Date.now(),
      title: newBillTitle.trim(),
      amount: amount,
      dueInDays: isNaN(days) ? 7 : days,
      category: 'bill',
      isEssential: true,
    };

    setFormData((prev) => ({
      ...prev,
      commitments: [...prev.commitments, newCommitment],
    }));
    setNewBillTitle('');
    setNewBillAmount('');
    setNewBillDays('');
  };

  const handleRemoveBill = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      commitments: prev.commitments.filter((c) => c.id !== id),
    }));
  };

  const handleAddWish = () => {
    const price = parseFloat(newWishPrice);
    if (!newWishTitle.trim() || isNaN(price) || price <= 0) return;

    const newWish: WishlistItem = {
      id: 'wish-' + Date.now(),
      title: newWishTitle.trim(),
      price: price,
      priority: 'medium',
    };

    setFormData((prev) => ({
      ...prev,
      wishlist: [...prev.wishlist, newWish],
    }));
    setNewWishTitle('');
    setNewWishPrice('');
  };

  const handleRemoveWish = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      wishlist: prev.wishlist.filter((w) => w.id !== id),
    }));
  };

  const handleSaveAll = () => {
    const updated = {
      ...formData,
      todaySpendingTarget: calculatedSafe,
    };
    onSave(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetToDefault = () => {
    setFormData({ ...initialUserState });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-[#0B1224] border border-slate-800/90 rounded-3xl p-5 sm:p-7 relative overflow-hidden shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#0E172A] text-teal-300 border border-slate-700 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>ملفك المالي المحمي</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100">
              بياناتك والتزاماتك الشهرية
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              هذه الأرقام هي المحرك الحقيقي لذكاء «دبّرني». يعرف متى راتبك، كم رصيدك، وما يستقطع من فواتير ليعطيك قراراً آمناً لا يورطك.
            </p>
          </div>

          <div className="bg-[#0E172A] border border-slate-800 p-4 rounded-2xl text-center sm:text-right shrink-0">
            <span className="text-[11px] text-slate-400 block font-semibold">
              حدك اليومي الناتج:
            </span>
            <div className="text-2xl font-black text-teal-400 font-sans mt-0.5">
              {formatSAR(calculatedSafe)}
            </div>
            <span className="text-[10px] text-slate-400">لكل يوم حتى نزول الراتب</span>
          </div>
        </div>
      </div>

      {/* Main Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Basic Finances */}
        <div className="bg-[#0B1224] border border-slate-800/90 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-black text-slate-100 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-teal-400" />
            <span>الأرقام الأساسية</span>
          </h3>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              اسمك المستعار في التطبيق
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#070A12] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-teal-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                الراتب الشهري (ر.س)
              </label>
              <input
                type="number"
                value={formData.salary}
                onChange={(e) =>
                  setFormData({ ...formData, salary: parseFloat(e.target.value) || 0 })
                }
                className="w-full bg-[#070A12] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-teal-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                الرصيد الفعلي الآن (ر.س)
              </label>
              <input
                type="number"
                value={formData.currentBalance}
                onChange={(e) =>
                  setFormData({ ...formData, currentBalance: parseFloat(e.target.value) || 0 })
                }
                className="w-full bg-[#070A12] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-teal-400 font-sans"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              الأيام المتبقية للراتب
            </label>
            <input
              type="number"
              value={formData.daysToSalary}
              onChange={(e) =>
                setFormData({ ...formData, daysToSalary: parseInt(e.target.value, 10) || 1 })
              }
              className="w-full bg-[#070A12] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-teal-400"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              ملاحظات نمط حياتك (يفهمها الذكاء الاصطناعي)
            </label>
            <textarea
              rows={2}
              value={formData.lifestyleNotes}
              onChange={(e) =>
                setFormData({ ...formData, lifestyleNotes: e.target.value })
              }
              placeholder="مثال: عندي دوام كل يوم، سيارتي قديمة تحتاج صيانة، أحب القهوة بالصباح..."
              className="w-full bg-[#070A12] border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-teal-400 resize-none"
            />
          </div>
        </div>

        {/* Commitments & Bills */}
        <div className="bg-[#0B1224] border border-slate-800/90 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-100 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>الفواتير والالتزامات القادمة</span>
            </h3>
            <span className="text-[11px] text-slate-400">
              ({formData.commitments.length}) التزامات
            </span>
          </div>

          {/* Existing Commitments list */}
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {formData.commitments.map((com) => (
              <div
                key={com.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#070A12] border border-slate-800 text-xs"
              >
                <div>
                  <span className="font-bold text-slate-200 block">{com.title}</span>
                  <span className="text-[10px] text-slate-400">
                    مستحقة بعد {com.dueInDays} يوم
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-amber-300 font-sans">
                    {formatSAR(com.amount)}
                  </span>
                  <button
                    onClick={() => handleRemoveBill(com.id)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                    title="حذف"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add new commitment */}
          <div className="pt-2 border-t border-slate-800/80">
            <span className="text-[11px] font-bold text-slate-400 block mb-2">
              + إضافة التزام جديد:
            </span>
            <div className="grid grid-cols-12 gap-1.5">
              <input
                type="text"
                placeholder="اسم الالتزام (مثلاً قسط)"
                value={newBillTitle}
                onChange={(e) => setNewBillTitle(e.target.value)}
                className="col-span-6 bg-[#070A12] border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-400"
              />
              <input
                type="number"
                placeholder="المبلغ"
                value={newBillAmount}
                onChange={(e) => setNewBillAmount(e.target.value)}
                className="col-span-3 bg-[#070A12] border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-400"
              />
              <input
                type="number"
                placeholder="الأيام"
                value={newBillDays}
                onChange={(e) => setNewBillDays(e.target.value)}
                className="col-span-2 bg-[#070A12] border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-400"
              />
              <button
                onClick={handleAddBill}
                className="col-span-1 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl flex items-center justify-center font-bold"
                title="إضافة"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Wishlist section */}
      <div className="bg-[#0B1224] border border-slate-800/90 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-100 flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-400" />
            <span>قائمة الرغبات والمشتريات المؤجلة (Wishlist)</span>
          </h3>
          <span className="text-[11px] text-slate-400">
            يسألك عنها دبّرني ويخبرك متى الوقت الأنسب لشرائها
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {formData.wishlist.map((wish) => (
            <div
              key={wish.id}
              className="p-3 rounded-xl bg-[#070A12] border border-slate-800 flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-bold text-slate-200 block">{wish.title}</span>
                <span className="text-[11px] text-teal-300 font-sans font-bold">
                  {formatSAR(wish.price)}
                </span>
              </div>
              <button
                onClick={() => handleRemoveWish(wish.id)}
                className="text-slate-500 hover:text-rose-400 p-1"
                title="حذف"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Add new wish */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
          <input
            type="text"
            placeholder="اسم المنتج اللي ودك تشتريه (مثلاً سماعة)"
            value={newWishTitle}
            onChange={(e) => setNewWishTitle(e.target.value)}
            className="flex-1 bg-[#070A12] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-400"
          />
          <input
            type="number"
            placeholder="السعر (ر.س)"
            value={newWishPrice}
            onChange={(e) => setNewWishPrice(e.target.value)}
            className="w-28 bg-[#070A12] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-400"
          />
          <button
            onClick={handleAddWish}
            className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl font-bold text-xs shrink-0"
          >
            + إضافة للرغبات
          </button>
        </div>
      </div>

      {/* Save / Reset Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0B1224] border border-slate-800 p-4 rounded-2xl">
        <button
          onClick={handleResetToDefault}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>استعادة البيانات الافتراضية التجريبية</span>
        </button>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>تم حفظ التعديلات بنجاح!</span>
            </span>
          )}
          <button
            onClick={handleSaveAll}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-teal-950/40 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>حفظ واعتماد الخطة المالية</span>
          </button>
        </div>
      </div>
    </div>
  );
};
