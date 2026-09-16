import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Camera,
  Upload,
  Receipt,
  ShoppingBag,
  Tag,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  X,
  Eye,
} from 'lucide-react';
import { UserState, ImageAnalysisResult } from '../types';
import { formatSAR } from '../utils/financialCalculations';

interface VisionStudioProps {
  userState: UserState;
}

type VisionMode = 'bill' | 'product' | 'offer';

export const VisionStudio: React.FC<VisionStudioProps> = ({ userState }) => {
  const [activeTab, setActiveTab] = useState<VisionMode>('bill');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('image/jpeg');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ImageAnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // Generate canvas-drawn realistic mockup images as instant presets
  const generateSampleImageBase64 = (type: VisionMode): string => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    if (type === 'bill') {
      // Bill mockup
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, 600, 400);
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 24px Tajawal, sans-serif';
      ctx.fillText('فاتورة استهلاك الكهرباء والخدمات', 150, 60);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.strokeRect(40, 90, 520, 260);

      ctx.font = '18px Tajawal, sans-serif';
      ctx.fillStyle = '#334155';
      ctx.fillText('المبلغ المستحق: 220.00 ر.س', 70, 140);
      ctx.fillText('تاريخ الاستحقاق: بعد 4 أيام (2026-09-19)', 70, 180);
      ctx.fillText('حالة السداد: غير مسددة', 70, 220);
      ctx.fillText('رقم الحساب: 1008472910', 70, 260);
      ctx.fillStyle = '#dc2626';
      ctx.fillText('يرجى السداد قبل موعد الفصل المجدول', 70, 310);
    } else if (type === 'product') {
      // Product price tag mockup
      ctx.fillStyle = '#fafaf9';
      ctx.fillRect(0, 0, 600, 400);
      ctx.fillStyle = '#1c1917';
      ctx.font = 'bold 26px Tajawal, sans-serif';
      ctx.fillText('سماعات رأس لاسلكية عازلة للضوضاء Pro', 80, 70);

      ctx.fillStyle = '#e7e5e4';
      ctx.fillRect(50, 100, 500, 180);
      ctx.fillStyle = '#059669';
      ctx.font = 'bold 44px Tajawal, sans-serif';
      ctx.fillText('399.00 ر.س', 200, 200);

      ctx.fillStyle = '#57534e';
      ctx.font = '16px Tajawal, sans-serif';
      ctx.fillText('شامل ضريبة القيمة المضافة 15%', 210, 240);
      ctx.fillText('ضمان سنتين - متوفر في المتجر', 220, 330);
    } else {
      // Offer screenshot mockup
      ctx.fillStyle = '#fff1f2';
      ctx.fillRect(0, 0, 600, 400);
      ctx.fillStyle = '#be123c';
      ctx.font = 'bold 32px Tajawal, sans-serif';
      ctx.fillText('عرض التوفير الخارق! خصم 50%', 120, 80);

      ctx.fillStyle = '#4c0519';
      ctx.font = 'bold 20px Tajawal, sans-serif';
      ctx.fillText('اشتري 2 وجبة برجر دبل والثالثة مجاناً', 130, 150);
      ctx.fillText('فقط بـ 84 ر.س بدلاً من 140 ر.س', 160, 200);

      ctx.fillStyle = '#9f1239';
      ctx.font = '14px Tajawal, sans-serif';
      ctx.fillText('* يسري العرض اليوم حتى منتصف الليل فقط!', 180, 260);
      ctx.fillText('رسوم التوصيل والخدمة: 19 ر.س إضافية', 190, 300);
    }

    return canvas.toDataURL('image/jpeg', 0.85);
  };

  const handleSelectSamplePreset = (type: VisionMode) => {
    setActiveTab(type);
    const sampleDataUrl = generateSampleImageBase64(type);
    setSelectedImage(sampleDataUrl);
    setImageMimeType('image/jpeg');
    setResult(null);
    setErrorMsg(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageMimeType(file.type || 'image/jpeg');
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setResult(null);
      setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  // Web Camera start
  const handleStartCamera = async () => {
    try {
      setIsCameraOpen(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error('Camera access failed:', err);
      setIsCameraOpen(false);
      setErrorMsg('تعذر فتح الكاميرا، يرجى استخدام رفع الصور أو النماذج الجاهزة.');
    }
  };

  const handleCaptureCamera = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setSelectedImage(dataUrl);
      setImageMimeType('image/jpeg');
      handleCloseCamera();
      setResult(null);
    }
  };

  const handleCloseCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
    setIsCameraOpen(false);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setErrorMsg(null);
    setResult(null);

    try {
      const response = await fetch('/api/dabbirni/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage,
          mimeType: imageMimeType,
          type: activeTab,
          state: userState,
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setErrorMsg('حدث خطأ أثناء الاتصال بالذكاء الاصطناعي لتحليل الصورة.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div id="vision-studio-section" className="bg-[#0B1224] rounded-2xl border border-slate-800/90 p-5 sm:p-6 shadow-md relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 relative z-10">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-teal-300 bg-[#0E172A] px-2.5 py-0.5 rounded-md w-fit mb-1.5 border border-slate-700/60">
            <Sparkles className="w-3 h-3 text-teal-400" />
            <span>عين دبّرني الذكية</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-100">
            قارئ الكاميرا وتحليل الفواتير والمنتجات
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-1">
            صوّر فاتورة ليفهمها، صوّر منتج ليخبرك هل تشتريه الآن، أو ارفع سكرين شوت لعرض ترويجي.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center bg-[#070A12] p-1 rounded-xl border border-slate-800">
          <button
            id="tab-vision-bill"
            onClick={() => setActiveTab('bill')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'bill'
                ? 'bg-[#0E172A] text-teal-300 border border-slate-700/80 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Receipt className="w-3.5 h-3.5 text-teal-400" />
            <span>فاتورة</span>
          </button>
          <button
            id="tab-vision-product"
            onClick={() => setActiveTab('product')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'product'
                ? 'bg-[#0E172A] text-teal-300 border border-slate-700/80 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-indigo-400" />
            <span>منتج</span>
          </button>
          <button
            id="tab-vision-offer"
            onClick={() => setActiveTab('offer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'offer'
                ? 'bg-[#0E172A] text-teal-300 border border-slate-700/80 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Tag className="w-3.5 h-3.5 text-amber-400" />
            <span>عرض أو تخفيض</span>
          </button>
        </div>
      </div>

      {/* Preset Quick Starters */}
      <div className="mb-4 bg-[#0E172A] border border-slate-800/90 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2.5 relative z-10">
        <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-teal-400" />
          <span>ما عندك صورة جاهزة الآن؟ جرب نموذج واقعي بضغطة واحدة:</span>
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleSelectSamplePreset('bill')}
            className="text-xs font-bold bg-[#070A12] hover:bg-slate-800 border border-slate-800 px-2.5 py-1.5 rounded-lg text-slate-200 hover:text-teal-300 transition-colors"
          >
            📄 فاتورة كهرباء 220 ر.س
          </button>
          <button
            onClick={() => handleSelectSamplePreset('product')}
            className="text-xs font-bold bg-[#070A12] hover:bg-slate-800 border border-slate-800 px-2.5 py-1.5 rounded-lg text-slate-200 hover:text-teal-300 transition-colors"
          >
            🎧 سماعة بـ 399 ر.س
          </button>
          <button
            onClick={() => handleSelectSamplePreset('offer')}
            className="text-xs font-bold bg-[#070A12] hover:bg-slate-800 border border-slate-800 px-2.5 py-1.5 rounded-lg text-slate-200 hover:text-amber-300 transition-colors"
          >
            🍔 عرض مطعم بـ 84 ر.س
          </button>
        </div>
      </div>

      {/* Upload & Camera Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start relative z-10">
        {/* Dropzone / Preview */}
        <div className="border border-dashed border-slate-700/80 hover:border-teal-500/60 rounded-2xl p-4 text-center transition-colors bg-[#070A12] flex flex-col items-center justify-center min-h-[260px] relative overflow-hidden">
          {selectedImage ? (
            <div className="w-full h-full flex flex-col items-center">
              <div className="relative max-h-56 max-w-full rounded-xl overflow-hidden border border-slate-800 mb-3 bg-[#0A0F1D]">
                <img
                  src={selectedImage}
                  alt="المعاينة"
                  className="max-h-56 object-contain"
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    setResult(null);
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/90 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                  title="حذف الصورة"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="btn-analyze-image"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-colors"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>جاري فحص الصورة ومطابقتها بميزانيتك...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>حلّل الصورة واعطني القرار</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-2 rounded-xl border border-slate-800 bg-[#0E172A] hover:bg-slate-800 text-xs font-bold text-slate-300"
                >
                  تغيير الصورة
                </button>
              </div>
            </div>
          ) : isCameraOpen ? (
            <div className="w-full flex flex-col items-center">
              <video
                ref={videoRef}
                className="w-full max-h-56 rounded-xl bg-black mb-3 object-cover border border-slate-800"
                autoPlay
                playsInline
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCaptureCamera}
                  className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs flex items-center gap-1.5"
                >
                  <Camera className="w-4 h-4" />
                  <span>التقاط الصورة الآن</span>
                </button>
                <button
                  onClick={handleCloseCamera}
                  className="px-3 py-2 rounded-xl border border-slate-800 bg-[#0E172A] hover:bg-slate-800 text-xs font-bold text-slate-300"
                >
                  إلغاء
                </button>
              </div>
            </div>
          ) : (
            <div className="py-6 flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-[#0E172A] text-teal-400 border border-slate-800 flex items-center justify-center mb-3">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-200 mb-1">
                اسحب الصورة هنا أو اختر طريقة الرفع
              </h3>
              <p className="text-xs text-slate-400 mb-4 max-w-xs leading-relaxed">
                يدعم فواتير الخدمات، بطاقات أسعار المحلات، أو سكرين شوت العروض.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  id="btn-upload-file"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 rounded-xl bg-[#0E172A] hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5 text-teal-400" />
                  <span>رفع صورة من جهازك</span>
                </button>
                <button
                  id="btn-open-camera"
                  onClick={handleStartCamera}
                  className="px-3.5 py-2 rounded-xl border border-slate-800 bg-[#070A12] hover:bg-slate-800 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Camera className="w-3.5 h-3.5 text-indigo-400" />
                  <span>فتح الكاميرا</span>
                </button>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {/* Analysis Verdict Output */}
        <div className="min-h-[260px] flex flex-col">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-start gap-2 mb-3">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {result ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#0E172A] rounded-2xl border border-slate-800 p-4 sm:p-5 flex-1 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30">
                    تم التعرف: {result.itemTitle}
                  </span>
                  {result.extractedAmount ? (
                    <span className="text-xs font-black text-slate-100 bg-[#070A12] px-2 py-0.5 rounded-lg border border-slate-800">
                      {formatSAR(result.extractedAmount)}
                    </span>
                  ) : null}
                </div>

                <h3 className="text-base sm:text-lg font-black text-slate-100 mb-1.5 leading-snug">
                  {result.verdictTitle}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed mb-3">
                  {result.verdictText}
                </p>

                <div className="bg-[#070A12] p-3 rounded-xl border border-slate-800 mb-2">
                  <span className="text-[11px] font-bold text-slate-400 block">
                    الأثر على ميزانيتك اليومية:
                  </span>
                  <span className="text-xs font-bold text-slate-200 mt-0.5 block">
                    {result.impactExplanation}
                  </span>
                </div>
              </div>

              {result.smartAdvice && (
                <div className="bg-teal-500/10 border border-teal-500/30 p-3 rounded-xl flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-teal-200 font-bold">
                    {result.smartAdvice}
                  </p>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="h-full border border-slate-800 bg-[#070A12]/60 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-xl bg-[#0E172A] text-slate-400 border border-slate-800 flex items-center justify-center mb-2 font-bold">
                ؟
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-200 mb-1">
                بانتظار الصورة لتحليل وضعك
              </h4>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                ارفع صورة الفاتورة أو المنتج، وسيقوم «دبّرني» بمطابقتها مع رصيدك المتبقي ({userState.currentBalance} ر.س) والأيام المتبقية حتى الراتب.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
