import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Wallet,
  Calendar,
  CreditCard,
  Heart,
  Save,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { UserState, Commitment, WishlistItem } from '../types';
import { initialUserState } from '../data/defaultData';
import { calculateSafeDailyBudget } from '../utils/financialCalculations';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userState: UserState;
  onSave: (updated: UserState) => void;
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  isOpen,
  onClose,
  userState,
  onSave,
}) => {
  const [formData, setFormData] = useState<UserState>({ ...userState });

  // Temporary item add states
  const [newBillTitle, setNewBillTitle] = useState('');
  const [newBillAmount, setNewBillAmount] = useState('');
  const [newBillDays, setNewBillDays] = useState('');

  const [newWishTitle, setNewWishTitle] = useState('');
  const [newWishPrice, setNewWishPrice] = useState('');

  if (!isOpen) return null;

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

    const updated = {
      ...formData,
      commitments: [...formData.commitments, newCommitment],
    };
    updated.todaySpendingTarget = calculateSafeDailyBudget(updated);
    setFormData(updated);
    setNewBillTitle('');
    setNewBillAmount('');
    setNewBillDays('');
  };

  const handleRemoveBill = (id: string) => {
    const updated = {
      ...formData,
      commitments: formData.commitments.filter((c) => c.id !== id),
    };
    updated.todaySpendingTarget = calculateSafeDailyBudget(updated);
    setFormData(updated);
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

    setFormData({
      ...formData,
      wishlist: [...formData.wishlist, newWish],
    });
    setNewWishTitle('');
    setNewWishPrice('');
  };

  const handleRemoveWish = (id: string) => {
    setFormData({
      ...formData,
      wishlist: formData.wishlist.filter((w) => w.id !== id),
    });
  };

  const handleSave = () => {
    const updated = {
      ...formData,
      todaySpendingTarget: calculateSafeDailyBudget(formData),
    };
    onSave(updated);
    onClose();
  };

  const handleResetToDefault = () => {
    setFormData({ ...initialUserState });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#070A12]/80 backdrop-blur-sm">
      <div
        id="profile-settings-modal"
        className="bg-[#0B1224] rounded-3xl border border-slate-800 shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-[#0E172A]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center font-bold text-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-100">
                بيانات وضعي المالي ونمط حياتي
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                هنا يعرف «دبّرني» أرقامك الحقيقية ليتخذ قراراتك بدقة.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 text-xs sm:text-sm">
          {/* Main Numbers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                الاسم أو اللقب:
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#070A12] border border-slate-800 rounded-xl px-3 py-2 font-bold text-slate-100 focus:border-teal-500 outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                الراتب الشهري (ر.س):
              </label>
              <input
                type="number"
                value={formData.salary}
                onChange={(e) =>
                  setFormData({ ...formData, salary: parseFloat(e.target.value) || 0 })
                }
                className="w-full bg-[#070A12] border border-slate-800 rounded-xl px-3 py-2 font-bold text-slate-100 focus:border-teal-500 outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                الرصيد المتبقي معك الآن (ر.س):
              </label>
              <input
                type="number"
                value={formData.currentBalance}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    currentBalance: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full bg-[#070A12] border border-slate-800 rounded-xl px-3 py-2 font-black text-teal-400 focus:border-teal-500 outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                الأيام المتبقية على الراتب:
              </label>
              <input
                type="number"
                value={formData.daysToSalary}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    daysToSalary: parseInt(e.target.value, 10) || 1,
                  })
                }
                className="w-full bg-[#070A12] border border-slate-800 rounded-xl px-3 py-2 font-bold text-slate-100 focus:border-teal-500 outline-hidden"
              />
            </div>
          </div>

          {/* Lifestyle Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              وصف وضعك ونمط حياتك بكلمات بسيطة:
            </label>
            <textarea
              rows={2}
              value={formData.lifestyleNotes}
              onChange={(e) =>
                setFormData({ ...formData, lifestyleNotes: e.target.value })
              }
              placeholder="مثلاً: عندي دوام بكرة، سيارتي تحتاج زيت، أبي أشتري سماعة بـ400، وعندي فاتورة بعد أسبوع..."
              className="w-full bg-[#070A12] border border-slate-800 rounded-xl p-3 text-xs font-medium text-slate-200 placeholder:text-slate-500 focus:border-teal-500 outline-hidden resize-none"
            />
          </div>

          {/* Upcoming Commitments & Bills */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-slate-200 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-teal-400" />
                <span>الالتزامات والفواتير الإلزامية:</span>
              </span>
            </div>

            <div className="space-y-1.5 mb-3">
              {formData.commitments.map((com) => (
                <div
                  key={com.id}
                  className="flex items-center justify-between bg-[#0E172A] border border-slate-800 p-2.5 rounded-xl text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-200">{com.title}</span>
                    <span className="text-slate-400 mr-2">
                      (بعد {com.dueInDays} أيام)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-100">
                      {com.amount} ر.س
                    </span>
                    <button
                      onClick={() => handleRemoveBill(com.id)}
                      className="text-slate-400 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add new commitment */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="اسم الالتزام (مثلاً: فاتورة 220)"
                value={newBillTitle}
                onChange={(e) => setNewBillTitle(e.target.value)}
                className="flex-1 bg-[#070A12] border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-medium text-slate-200 placeholder:text-slate-500 focus:border-teal-500 outline-hidden"
              />
              <input
                type="number"
                placeholder="المبلغ"
                value={newBillAmount}
                onChange={(e) => setNewBillAmount(e.target.value)}
                className="w-20 bg-[#070A12] border border-slate-800 rounded-xl px-2 py-1.5 text-xs font-medium text-slate-200 placeholder:text-slate-500 focus:border-teal-500 outline-hidden"
              />
              <input
                type="number"
                placeholder="بعد كم يوم"
                value={newBillDays}
                onChange={(e) => setNewBillDays(e.target.value)}
                className="w-20 bg-[#070A12] border border-slate-800 rounded-xl px-2 py-1.5 text-xs font-medium text-slate-200 placeholder:text-slate-500 focus:border-teal-500 outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddBill}
                className="px-3 py-1.5 rounded-xl bg-[#0E172A] hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-bold"
              >
                إضافة
              </button>
            </div>
          </div>

          {/* Wishlist Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-slate-200 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                <span>قائمة الرغبات المؤجلة (Wishlist):</span>
              </span>
            </div>

            <div className="space-y-1.5 mb-3">
              {formData.wishlist.map((wish) => (
                <div
                  key={wish.id}
                  className="flex items-center justify-between bg-[#0E172A] border border-slate-800 p-2.5 rounded-xl text-xs"
                >
                  <span className="font-bold text-slate-200">{wish.title}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-rose-400">
                      {wish.price} ر.س
                    </span>
                    <button
                      onClick={() => handleRemoveWish(wish.id)}
                      className="text-slate-400 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add new wish */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="اسم الغرض (مثلاً: سماعة بـ 400)"
                value={newWishTitle}
                onChange={(e) => setNewWishTitle(e.target.value)}
                className="flex-1 bg-[#070A12] border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-medium text-slate-200 placeholder:text-slate-500 focus:border-teal-500 outline-hidden"
              />
              <input
                type="number"
                placeholder="السعر (ر.س)"
                value={newWishPrice}
                onChange={(e) => setNewWishPrice(e.target.value)}
                className="w-24 bg-[#070A12] border border-slate-800 rounded-xl px-2 py-1.5 text-xs font-medium text-slate-200 placeholder:text-slate-500 focus:border-teal-500 outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddWish}
                className="px-3 py-1.5 rounded-xl bg-[#0E172A] hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-bold"
              >
                إضافة
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0E172A] flex items-center justify-between">
          <button
            onClick={handleResetToDefault}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>استعادة وضع «إيسكو» الأصلي</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-800 bg-[#070A12] text-slate-300 text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              إلغاء
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-black shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>تحديث وضعي الآن</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
