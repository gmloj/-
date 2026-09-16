import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Sparkles,
  Compass,
  Palette,
  Type,
  MessageSquareQuote,
  ShieldCheck,
  Layers,
  ArrowRight,
  Download,
  Flame,
  Coins,
  CheckCircle2,
} from 'lucide-react';
import { DabbirniLogo } from './DabbirniLogo';
import logoImg from '../assets/images/dabbirni_logo_1789484710883.jpg';

interface BrandIdentityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BrandIdentityModal: React.FC<BrandIdentityModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'logo' | 'colors' | 'voice' | 'typography'>('logo');

  if (!isOpen) return null;

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const colors = [
    {
      name: 'كحلي الأعماق (Deep Void)',
      role: 'الخلفية الأساسية والهدوء البصري',
      hex: '#070A12',
      bgClass: 'bg-[#070A12]',
      borderClass: 'border-slate-800',
      textClass: 'text-slate-100',
      description: 'يخفف إجهاد العين ويمنح التطبيق عمقاً تقنياً واثقاً كمنصة أمان مالي متقدمة.',
    },
    {
      name: 'كحلي الخزينة (Vault Navy)',
      role: 'خلفية البطاقات والحاويات الرئيسية',
      hex: '#0B1224',
      bgClass: 'bg-[#0B1224]',
      borderClass: 'border-slate-700/80',
      textClass: 'text-slate-100',
      description: 'طبقة الاستقرار وحفظ البيانات المالية، تبرز فوق خلفية الدجى بتمايز محسوب.',
    },
    {
      name: 'تيل الذكاء النيون (Luminescent Teal)',
      role: 'اللون التوجيهي والقرارات والأزرار الرئيسية',
      hex: '#14B8A6',
      bgClass: 'bg-teal-500',
      borderClass: 'border-teal-400',
      textClass: 'text-slate-950',
      description: 'رمز الحكمة، التفكير المتزن، والتوجيه الذكي المباشر دون أي ضوضاء بصرية.',
    },
    {
      name: 'الزمردي الآمن (Safe Emerald)',
      role: 'مؤشرات الأمان والوفر المالي',
      hex: '#10B981',
      bgClass: 'bg-emerald-500',
      borderClass: 'border-emerald-400',
      textClass: 'text-slate-950',
      description: 'إشارات الطمأنينة عندما يكون الصرف ضمن الحد اليومي المصرح به.',
    },
    {
      name: 'عنبر الاحتراز (Protective Amber)',
      role: 'تنبيهات تجاوز الحد وإعادة التوازن',
      hex: '#F59E0B',
      bgClass: 'bg-amber-500',
      borderClass: 'border-amber-400',
      textClass: 'text-slate-950',
      description: 'تنبيه هادئ ومسؤول، يحذّر بلطف لا بالترهيب، ويوفر حلاً فورياً لليوم التالي.',
    },
    {
      name: 'تيتانيوم المحتوى (Muted Slate)',
      role: 'النصوص والشروحات الثانوية والحدود',
      hex: '#94A3B8',
      bgClass: 'bg-slate-400',
      borderClass: 'border-slate-500',
      textClass: 'text-slate-950',
      description: 'قراءة مريحة بأعلى معايير التباين المعتمدة (WCAG AA).',
    },
  ];

  const voicePrinciples = [
    {
      title: 'صاحب واقعي وليس محاسباً صارماً',
      positive: '«صرفت اليوم 83 ريال؟ لا تشيل هم، بكرة نخلي ميزانيتك 21 ريال ونرجع للمسار الصح بدون ما ينكسر ظهرك.»',
      negative: '❌ «تنبيه خطير: لقد تجاوزت الميزانية المحددة بنسبة 40% وسوف تفلس قبل يوم 27!»',
    },
    {
      title: 'إجابة فورية بدون تنظير أو تعقيد',
      positive: '«سؤالك: هل أشتري السماعة؟ جوابي: لا تشتريها اليوم، عندك فاتورة كهرباء بعد 3 أيام بـ220 ريال. انتظر 4 أيام وأعطيك الضوء الأخضر.»',
      negative: '❌ «يجب عليك تحليل معدل الادخار التراكمي ومقارنة معدل التدفق النقدي بالأصول الثابتة.»',
    },
    {
      title: 'لهجة سعودية بيضاء محترمة ومطمئنة',
      positive: '«أمورك زينة، باقي لك 12 يوم على الراتب ومصروفك اليومي الآمن 52 ريال. خلك في السليم.»',
      negative: '❌ «عزيزي العميل المحترم، نفيدك بأن مؤشراتك المصرفية تشير إلى نمو متحفظ.»',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#070A12]/85 backdrop-blur-md overflow-y-auto">
      <div
        id="brand-identity-guide-modal"
        className="bg-[#0B1224] rounded-3xl border border-slate-800 shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden my-auto"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-[#0E172A] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-3 relative z-10">
            <DabbirniLogo size="sm" variant="icon" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-100">
                  دليل الهوية الكاملة لـ «دبّرني»
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30">
                  Official Brand System v1.0
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                فلسفة الشعار، لوحة الألوان المعتمدة، التايبوغرافي، ونبرة الصوت
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#070A12] hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors relative z-10"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-2 bg-[#070A12] border-b border-slate-800/80 px-4 sm:px-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('logo')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'logo'
                ? 'bg-teal-500 text-slate-950 font-black shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>الشعار والرمز الرسمي</span>
          </button>
          <button
            onClick={() => setActiveTab('colors')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'colors'
                ? 'bg-teal-500 text-slate-950 font-black shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>لوحة الألوان ورموز HEX</span>
          </button>
          <button
            onClick={() => setActiveTab('voice')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'voice'
                ? 'bg-teal-500 text-slate-950 font-black shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>شخصية ونبرة الصوت</span>
          </button>
          <button
            onClick={() => setActiveTab('typography')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'typography'
                ? 'bg-teal-500 text-slate-950 font-black shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>التايبوغرافي والشعارات</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* TAB 1: LOGO */}
          {activeTab === 'logo' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Logo Presentation Showcase Card */}
              <div className="bg-[#070A12] rounded-2xl border border-slate-800 p-6 sm:p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-radial from-teal-500/10 via-transparent to-transparent opacity-60" />

                <div className="relative z-10 flex flex-col items-center">
                  <div className="relative mb-5 group">
                    <div className="absolute -inset-3 bg-teal-500/20 rounded-full blur-xl animate-pulse" />
                    <img
                      src={logoImg}
                      alt="شعار دبّرني الأساسي"
                      className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-2 border-teal-400/60 shadow-2xl relative z-10 transition-transform duration-300 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-teal-400 border-3 border-[#070A12] rounded-full" />
                  </div>

                  <h1 className="text-3xl sm:text-4xl font-black text-slate-100 tracking-tight">
                    دبّرني
                  </h1>
                  <p className="text-sm font-bold text-teal-400 mt-1">
                    قراراتك المالية.. محسوبة وهادية
                  </p>
                  <p className="text-xs text-slate-400 mt-2 max-w-md leading-relaxed">
                    الشعار الرسمي المعتمد: رمز هندسي يدمج بين إبرة البوصلة الدالة على الاتجاه المالي السليم، ومحور العملة، وشعلة الذكاء الرقمي الفوري.
                  </p>
                </div>
              </div>

              {/* Logo Anatomy & Concepts */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-[#0E172A] border border-slate-800/90 rounded-2xl p-4">
                  <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center mb-2.5">
                    <Compass className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-200 mb-1">
                    إبرة البوصلة التوجيهية
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    ترمز لاتخاذ القرار الصائب لحظة الشراء، وتوجيه المستخدم نحو بر الأمان المالي حتى نزول الراتب.
                  </p>
                </div>

                <div className="bg-[#0E172A] border border-slate-800/90 rounded-2xl p-4">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-2.5">
                    <Coins className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-200 mb-1">
                    الدائرة النقدية (الريال)
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    تعبر عن حفظ رأس المال، وضبط السيولة اليومية، وتفادي هدر الميزانية في مصاريف عشوائية غير محسوبة.
                  </p>
                </div>

                <div className="bg-[#0E172A] border border-slate-800/90 rounded-2xl p-4">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mb-2.5">
                    <Flame className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-200 mb-1">
                    تدرج النيون المستقبلي
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    يعكس قوة محرك الذكاء الاصطناعي الفوري الذي يقرأ الفواتير ويحسب معادلات الإنفاق في أجزاء من الثانية.
                  </p>
                </div>
              </div>

              {/* Logo Usage Variants */}
              <div className="bg-[#0E172A] rounded-2xl border border-slate-800/90 p-5">
                <h4 className="text-xs font-black text-slate-300 mb-3 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-teal-400" />
                  <span>تطبيقات الشعار في الواجهات:</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-[#070A12] border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 block mb-2">
                        النمط الأفقي (للهيدر والتقارير)
                      </span>
                      <DabbirniLogo size="md" variant="horizontal" />
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#070A12] border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 block mb-2">
                        نمط الأيقونة والتطبيق المصغر (App Icon)
                      </span>
                      <div className="flex items-center gap-3">
                        <DabbirniLogo size="md" variant="icon" />
                        <DabbirniLogo size="lg" variant="icon" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COLORS */}
          {activeTab === 'colors' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-slate-100">
                    لوحة الألوان الرسمية (Official Palette)
                  </h4>
                  <p className="text-xs text-slate-400">
                    اضغط على أي كود لنسخه إلى الحافظة مباشرة (HEX)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {colors.map((c) => (
                  <div
                    key={c.hex}
                    onClick={() => handleCopyHex(c.hex)}
                    className="group bg-[#0E172A] hover:bg-slate-800/80 border border-slate-800 rounded-2xl p-4 cursor-pointer transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`w-7 h-7 rounded-xl ${c.bgClass} border ${c.borderClass} shadow-xs inline-block`}
                          />
                          <div>
                            <span className="text-xs font-black text-slate-200 block leading-tight">
                              {c.name}
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              {c.role}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded-lg bg-[#070A12] border border-slate-700/80 text-teal-300 group-hover:border-teal-400 transition-colors"
                        >
                          {copiedHex === c.hex ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400 font-bold">تم النسخ!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-slate-400" />
                              <span>{c.hex}</span>
                            </>
                          )}
                        </button>
                      </div>

                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {c.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: VOICE & PERSONALITY */}
          {activeTab === 'voice' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-[#070A12] border border-slate-800 rounded-2xl p-4 sm:p-5">
                <span className="text-xs font-black text-teal-400 uppercase tracking-wide block mb-1">
                  شخصية العلامة (Brand Persona)
                </span>
                <h3 className="text-base font-black text-slate-100 mb-2">
                  «دبّرني» هو الصاحب الحكيم.. مو المحاسب الصارم
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  تطبيقات الميزانية التقليدية تفشل لأنها تصيب المستخدم بالذنب والتوتر عند كل عملية شراء. في «دبّرني»، نحترم رغبات المستخدم وندرك أن الحياة فيها مناسبات وقهوة وعزايم. دورنا ليس المنع، بل تعديل المسار الرياضي بهدوء وإعطاء الجواب الشافي في وقته.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400">
                  مقارنة نبرة الحديث (كيف يتكلم دبّرني وكيف لا يتكلم):
                </h4>
                {voicePrinciples.map((vp, idx) => (
                  <div
                    key={idx}
                    className="bg-[#0E172A] border border-slate-800/90 rounded-2xl p-4 space-y-2.5"
                  >
                    <h5 className="text-xs font-black text-slate-200 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-teal-500/10 text-teal-400 text-[11px] flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <span>{vp.title}</span>
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-200 font-medium leading-relaxed">
                        <span className="text-[10px] font-black text-teal-400 block mb-1">
                          طريقة دبّرني الصحيحة:
                        </span>
                        {vp.positive}
                      </div>
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 font-medium leading-relaxed">
                        <span className="text-[10px] font-black text-rose-400 block mb-1">
                          المرفوض تماماً:
                        </span>
                        {vp.negative}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: TYPOGRAPHY & SLOGANS */}
          {activeTab === 'typography' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Typography */}
              <div className="bg-[#0E172A] border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-sm font-black text-slate-100">
                      نظام الخطوط المعتمد (Typography System)
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      مزج متناسق بين خط Tajawal للعناوين و Readex Pro للأرقام المالية
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-[#070A12] border border-slate-800">
                    <span className="text-[10px] font-bold text-teal-400 block mb-1">
                      خط العناوين الرئيسية (Tajawal Black 900)
                    </span>
                    <p className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
                      دبّرني: قراراتك المالية.. محسوبة وهادية
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#070A12] border border-slate-800">
                    <span className="text-[10px] font-bold text-teal-400 block mb-1">
                      خط النصوص والقراءة (Tajawal Medium 500)
                    </span>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      يتميز بارتفاع سطر مريح ووضوح بصري فائق على جميع الشاشات الليلية والنهارية.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#070A12] border border-slate-800">
                    <span className="text-[10px] font-bold text-teal-400 block mb-1">
                      خط الأرقام والعملات (Readex Pro / Monospace Numbers)
                    </span>
                    <p className="text-xl sm:text-2xl font-black font-sans text-teal-300">
                      1,250 ر.س • 52 ر.س/اليوم • 12 يوم متبقي
                    </p>
                  </div>
                </div>
              </div>

              {/* Slogans */}
              <div className="bg-[#0E172A] border border-slate-800 rounded-2xl p-5">
                <h4 className="text-sm font-black text-slate-100 mb-3 flex items-center gap-1.5">
                  <MessageSquareQuote className="w-4 h-4 text-teal-400" />
                  <span>الشعارات اللفظية المعتمدة (Brand Slogans):</span>
                </h4>

                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-[#070A12] border border-slate-800 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-black text-slate-200 block">
                        السلوجان الرئيسي:
                      </span>
                      <p className="text-sm font-bold text-teal-300 mt-0.5">
                        «قراراتك المالية.. محسوبة وهادية»
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#070A12] border border-slate-800 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-black text-slate-200 block">
                        السؤال الجوهري:
                      </span>
                      <p className="text-sm font-bold text-teal-300 mt-0.5">
                        «وش أفضل قرار أسويه الآن؟»
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#070A12] border border-slate-800 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-black text-slate-200 block">
                        الوعد للمستخدم:
                      </span>
                      <p className="text-sm font-bold text-teal-300 mt-0.5">
                        «بدل ما تفكر وتتوتر.. دبّرني يحسبها عنك»
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0E172A] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>نظام هوية متكامل ومتوافق مع أعلى معايير الـ Fintech الحديثة</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-black transition-colors"
          >
            فهمت واعتمدت
          </button>
        </div>
      </div>
    </div>
  );
};
