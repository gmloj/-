import React, { useState, useEffect, useRef } from 'react';
import { X, Mic, MicOff, Sparkles, Check, Volume2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Expense } from '../types';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (expense: Omit<Expense, 'id' | 'timestamp'>) => void;
}

// Helper to parse spoken Arabic expense phrases (e.g., "صرفت 50 ريال غداء")
export function parseVoiceExpense(text: string): {
  amount: number | null;
  title: string;
  category: Expense['category'];
} {
  const normalized = text
    .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString())
    .trim();

  // Spoken Arabic word numbers
  const numberWords: Record<string, number> = {
    واحد: 1,
    اثنين: 2,
    ثلاثة: 3,
    اربعة: 4,
    أربعة: 4,
    خمسة: 5,
    ستة: 6,
    سبعة: 7,
    ثمانية: 8,
    تسعة: 9,
    عشرة: 10,
    خمسطاش: 15,
    عشرين: 20,
    ثلاثين: 30,
    اربعين: 40,
    أربعين: 40,
    خمسين: 50,
    ستين: 60,
    سبعين: 70,
    ثمانين: 80,
    تسعين: 90,
    مية: 100,
    مئة: 100,
    مائة: 100,
  };

  let extractedAmount: number | null = null;
  const digitMatch = normalized.match(/(\d+(?:\.\d+)?)/);
  if (digitMatch) {
    extractedAmount = parseFloat(digitMatch[1]);
  } else {
    for (const [word, val] of Object.entries(numberWords)) {
      if (normalized.includes(word)) {
        extractedAmount = val;
        break;
      }
    }
  }

  // Detect category from spoken context
  let category: Expense['category'] = 'food';
  const lower = normalized.toLowerCase();

  if (/قهوة|كوفي|ستاربكس|شاي|كافيه|لاتيه|مشروب/.test(lower)) {
    category = 'coffee';
  } else if (/غداء|عشاء|فطور|مطعم|وجبة|شاورما|برجر|بيتزا|اكل|ساندوتش|رز|سناك/.test(lower)) {
    category = 'food';
  } else if (/بنزين|محطة|فاتورة|كهرباء|انترنت|نت|شحن|اشتراك/.test(lower)) {
    category = 'bills';
  } else if (/تسوق|ملابس|اغراض|مقاضي|سوبرماركت|بقالة|شوز|سوق|عطر/.test(lower)) {
    category = 'shopping';
  } else if (/مواصلات|اوبر|كريم|تاكسي|قطار|باص|مشوار/.test(lower)) {
    category = 'transport';
  } else {
    category = 'other';
  }

  // Clean title by removing action and currency stop words
  let title = normalized
    .replace(/(\d+(?:\.\d+)?)/g, '')
    .replace(/صرفت|دفعت|اشتريت|شريت|دفعت حق|حق|ريال|ريالات|ر\.س|ريالاً|بـ|ب/g, '')
    .trim();

  // Provide clean descriptive default if empty
  if (!title || title.length < 2) {
    if (category === 'coffee') title = 'قهوة';
    else if (category === 'bills') title = 'فاتورة / بنزين';
    else if (category === 'shopping') title = 'تسوق ومقاضي';
    else if (category === 'transport') title = 'مواصلات';
    else if (category === 'food') {
      if (/عشاء/.test(lower)) title = 'وجبة عشاء';
      else if (/فطور/.test(lower)) title = 'وجبة فطور';
      else title = 'وجبة غداء';
    } else {
      title = 'مصروف سريع';
    }
  }

  return {
    amount: extractedAmount,
    title,
    category,
  };
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Expense['category']>('food');

  // Voice Input States
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceFeedback, setVoiceFeedback] = useState<string | null>(null);
  const [autoSaveCountdown, setAutoSaveCountdown] = useState<number | null>(null);

  const recognitionRef = useRef<any>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize SpeechRecognition if available
  useEffect(() => {
    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognitionClass) {
      try {
        const recog = new SpeechRecognitionClass();
        recog.lang = 'ar-SA';
        recog.continuous = false;
        recog.interimResults = true;

        recog.onresult = (event: any) => {
          const current = event.resultIndex;
          const transcript = event.results[current][0].transcript;
          setVoiceTranscript(transcript);

          if (event.results[current].isFinal) {
            handleVoiceParsed(transcript);
          }
        };

        recog.onerror = (e: any) => {
          setIsListening(false);
          setVoiceFeedback('تعذر الوصول للمايك، يمكنك استخدام الأمثلة الصوتية السريعة بالأسفل');
        };

        recog.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recog;
      } catch (err) {
        // Fallback gracefully if recognition fails to initialize
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  if (!isOpen) return null;

  // Process the spoken phrase and trigger automatic update
  const handleVoiceParsed = (spokenPhrase: string) => {
    const parsed = parseVoiceExpense(spokenPhrase);

    if (parsed.amount && parsed.amount > 0) {
      setTitle(parsed.title);
      setAmount(parsed.amount.toString());
      setCategory(parsed.category);

      setVoiceFeedback(`✅ تم التعرف: ${parsed.title} (${parsed.amount} ر.س) - جارِ التحديث..`);
      setAutoSaveCountdown(1);

      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);

      autoSaveTimerRef.current = setTimeout(() => {
        onAdd({
          title: parsed.title,
          amount: parsed.amount!,
          category: parsed.category,
        });
        resetModalState();
        onClose();
      }, 1100);
    } else {
      setVoiceFeedback('لم نتمكن من تحديد المبلغ بدقة، يرجى كتابته أو تكرار المحاولة');
    }
  };

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      setVoiceFeedback(null);
      setVoiceTranscript('');
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (e) {
          // If already started or permission issue, simulate voice prompt
          setIsListening(false);
          setVoiceFeedback('الإدخال الصوتي غير متاح هنا. اكتب المصروف يدويًا.');
        }
      } else {
        // If SpeechRecognition not supported in environment, run simulated voice prompt
        setIsListening(false);
          setVoiceFeedback('الإدخال الصوتي غير متاح هنا. اكتب المصروف يدويًا.');
      }
    }
  };

  // Immediate execution of voice prompt test
  const handleSimulatedVoice = (phrase: string) => {
    setIsListening(true);
    setVoiceTranscript(phrase);
    setVoiceFeedback('جارِ تحليل الصوت الذكي..');

    setTimeout(() => {
      setIsListening(false);
      handleVoiceParsed(phrase);
    }, 650);
  };

  const resetModalState = () => {
    setTitle('');
    setAmount('');
    setVoiceTranscript('');
    setVoiceFeedback(null);
    setAutoSaveCountdown(null);
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!title.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return;

    onAdd({
      title: title.trim(),
      amount: parsedAmount,
      category,
    });

    resetModalState();
    onClose();
  };

  const handleQuickPreset = (presetTitle: string, presetAmount: number, presetCat: Expense['category']) => {
    onAdd({
      title: presetTitle,
      amount: presetAmount,
      category: presetCat,
    });
    resetModalState();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070A12]/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[#0B1224] border border-slate-800 rounded-3xl p-5 w-full max-w-sm shadow-2xl relative text-slate-100 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <button
            onClick={() => {
              resetModalState();
              onClose();
            }}
            className="w-7 h-7 rounded-full bg-[#070A12] flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-black text-white">إضافة مصروف جديد</h3>
          </div>
        </div>

        {/* Quick Voice Input Section (خاصية الإدخال الصوتي السريع) */}
        <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-b from-cyan-950/40 via-[#091224] to-[#070A12] border border-cyan-500/30 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[11px] font-black text-cyan-300">الإدخال الصوتي السريع</span>
            </div>
            <span className="text-[10px] text-slate-400">تحدث بنص مباشر</span>
          </div>

          {/* Voice Mic Button & Recording State */}
          <div className="flex items-center gap-3">
            <motion.button
              type="button"
              onClick={toggleListening}
              whileTap={{ scale: 0.92 }}
              className={`relative shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                isListening
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/40 ring-4 ring-red-500/20'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-950/60'
              }`}
            >
              {isListening ? (
                <>
                  <span className="absolute -inset-1 rounded-2xl bg-red-500/40 animate-ping" />
                  <MicOff className="w-5 h-5 relative z-10" />
                </>
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </motion.button>

            <div className="flex-1 text-right">
              {isListening ? (
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-red-400 animate-pulse">
                    جارِ الاستماع.. تحدث الآن 🎙️
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {voiceTranscript || 'مثال: "صرفت 50 ريال غداء"'}
                  </p>
                </div>
              ) : (
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-200">
                    اضغط وتحدث لتسجيل المصروف
                  </p>
                  <p className="text-[10px] text-slate-400">
                    «صرفت 50 ريال غداء» أو «قهوة 18»
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Voice Feedback Alert */}
          {voiceFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2.5 p-2 rounded-xl bg-cyan-950/60 border border-cyan-800/40 text-[11px] text-cyan-200 flex items-center gap-2"
            >
              <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="flex-1 font-medium">{voiceFeedback}</span>
              {autoSaveCountdown && (
                <button
                  type="button"
                  onClick={() => {
                    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
                    setAutoSaveCountdown(null);
                    setVoiceFeedback('تم إلغاء التحديث التلقائي، يمكنك تعديل القيم يدوياً');
                  }}
                  className="text-[10px] underline text-slate-400 hover:text-white"
                >
                  إلغاء
                </button>
              )}
            </motion.div>
          )}

          {/* One-Tap Voice Phrases (لمسة لتجربة الصوت الفوري) */}
          <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between gap-1 overflow-x-auto pb-0.5 scrollbar-none text-[10px]">
            <span className="text-slate-500 shrink-0">جرّب صوتياً:</span>
            <button
              type="button"
              onClick={() => handleSimulatedVoice('صرفت 50 ريال غداء')}
              className="px-2 py-0.5 rounded-lg bg-slate-900/80 hover:bg-cyan-950/60 text-cyan-300 border border-cyan-900/40 whitespace-nowrap transition-colors"
            >
              🗣️ «صرفت 50 ريال غداء»
            </button>
            <button
              type="button"
              onClick={() => handleSimulatedVoice('قهوة 18 ريال')}
              className="px-2 py-0.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 whitespace-nowrap transition-colors"
            >
              ☕ «قهوة 18 ريال»
            </button>
            <button
              type="button"
              onClick={() => handleSimulatedVoice('بنزين 70 ريال')}
              className="px-2 py-0.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 whitespace-nowrap transition-colors"
            >
              ⛽ «بنزين 70 ريال»
            </button>
          </div>
        </div>

        {/* Manual Form */}
        <form onSubmit={handleSubmit} className="space-y-3 mt-3">
          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1">
              اسم المصروف
            </label>
            <input
              type="text"
              placeholder="مثلاً: قهوة الصباح، غداء، بنزين"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#070A12] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1">
              المبلغ (ريال)
            </label>
            <input
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-[#070A12] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-sans focus:outline-none focus:border-cyan-400 text-right"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1">
              التصنيف
            </label>
            <div className="grid grid-cols-3 gap-1.5 text-[11px]">
              {[
                { key: 'food', label: 'مطاعم' },
                { key: 'coffee', label: 'قهوة' },
                { key: 'bills', label: 'فواتير/بنزين' },
                { key: 'shopping', label: 'تسوق' },
                { key: 'transport', label: 'مواصلات' },
                { key: 'other', label: 'أخرى' },
              ].map((c) => (
                <button
                  type="button"
                  key={c.key}
                  onClick={() => setCategory(c.key as Expense['category'])}
                  className={`py-1.5 px-2 rounded-lg border text-center font-semibold transition-all ${
                    category === c.key
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      : 'bg-[#070A12] text-slate-400 border-slate-800'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-500 hover:from-cyan-300 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-950/40 transition-colors cursor-pointer"
          >
            تأكيد وإضافة للميزانية
          </button>
        </form>
      </motion.div>
    </div>
  );
};

