import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Header } from './components/Header';
import { PhoneFrame } from './components/PhoneFrame';
import { WelcomeScreen } from './components/screens/WelcomeScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { InvoiceScanScreen } from './components/screens/InvoiceScanScreen';
import { PurchaseDecisionScreen } from './components/screens/PurchaseDecisionScreen';
import { ExpensesScreen } from './components/screens/ExpensesScreen';
import { AccountScreen } from './components/screens/AccountScreen';
import { FourScreensShowcase } from './components/screens/FourScreensShowcase';
import { AddExpenseModal } from './components/AddExpenseModal';
import { BrandIdentityModal } from './components/BrandIdentityModal';
import { initialUserState } from './data/defaultData';
import { UserState, Expense } from './types';
import { calculateSafeDailyBudget, addExpense, removeExpense, rollover } from './utils/financialCalculations';
import {
  Smartphone,
  Grid,
  Sparkles,
  Maximize2,
  Minimize2,
  Palette,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export type AppScreen =
  | 'welcome'
  | 'home'
  | 'scan'
  | 'decision'
  | 'expenses'
  | 'account'
  | 'gallery';

// Hierarchy order to determine slide direction (forward vs backward)
const screenOrder: Record<AppScreen, number> = {
  welcome: 0,
  home: 1,
  scan: 2,
  decision: 2,
  expenses: 2,
  account: 2,
  gallery: 1,
};

// Smooth Slide and Fade transition variants for mobile phone screens
const screenSlideFadeVariants: Variants = {
  enter: (direction: number) => ({
    x: direction >= 0 ? 44 : -44,
    opacity: 0,
    scale: 0.98,
    filter: 'blur(3px)',
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      x: { type: 'spring', stiffness: 320, damping: 30 },
      opacity: { duration: 0.28, ease: 'easeOut' },
      scale: { duration: 0.28, ease: 'easeOut' },
      filter: { duration: 0.22 },
    },
  },
  exit: (direction: number) => ({
    x: direction >= 0 ? -44 : 44,
    opacity: 0,
    scale: 0.98,
    filter: 'blur(3px)',
    transition: {
      x: { type: 'spring', stiffness: 320, damping: 30 },
      opacity: { duration: 0.2, ease: 'easeIn' },
      scale: { duration: 0.2, ease: 'easeIn' },
      filter: { duration: 0.18 },
    },
  }),
};

export default function App() {
  const mobileMode = Boolean(window.ReactNativeWebView) || new URLSearchParams(location.search).has('mobile') || window.innerWidth < 640;
  const [storageError, setStorageError] = useState('');
  const [userState, setUserState] = useState<UserState>(() => {
    try {
      const saved = window.__DABBIRNI_STATE__ || localStorage.getItem('dabbirni_user_state');
      if (saved) {
        const value = JSON.parse(saved);
        if (value && Number.isFinite(value.currentBalance) && Array.isArray(value.commitments) && Array.isArray(value.todayExpenses)) return rollover({...initialUserState,...value});
      }
    } catch { /* Start demo if storage is unavailable or corrupt. */ }
    return rollover(initialUserState);
  });

  // Current Active Screen (starts at welcome to showcase the opening animation)
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('welcome');

  // Navigation direction (+1 forward, -1 backward) for slide animation
  const [direction, setDirection] = useState<number>(1);

  // Presentation mode: 'phone' (in iPhone mockup), 'fluid' (full width), 'gallery' (4 screens side-by-side)
  const [presentationMode, setPresentationMode] = useState<'phone' | 'fluid' | 'gallery'>(mobileMode ? 'fluid' : 'phone');

  // Time mode
  const [timeMode, setTimeMode] = useState<'morning' | 'night'>('morning');

  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isBrandGuideOpen, setIsBrandGuideOpen] = useState(false);
  const [activeDilemmaItem, setActiveDilemmaItem] = useState('سماعة لاسلكية');

  // Unified navigation helper with directional awareness
  const navigateTo = (newScreen: AppScreen, forcedDir?: number) => {
    if (forcedDir !== undefined) {
      setDirection(forcedDir);
    } else {
      const currentIdx = screenOrder[currentScreen] ?? 0;
      const targetIdx = screenOrder[newScreen] ?? 0;
      setDirection(targetIdx >= currentIdx ? 1 : -1);
    }
    setCurrentScreen(newScreen);
  };

  // Persist state
  useEffect(() => {
    const data = JSON.stringify(userState);
    try {
      if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(JSON.stringify({type:'save-state',data}));
      else localStorage.setItem('dabbirni_user_state', data);
    } catch { setStorageError('تعذر حفظ البيانات على الجهاز.'); }
  }, [userState]);

  useEffect(() => {
    const timer = setInterval(()=>setUserState(prev=>rollover(prev)), 60000);
    const handleBack = () => navigateTo('home', -1);
    window.addEventListener('native-back', handleBack);
    return ()=>{clearInterval(timer);window.removeEventListener('native-back',handleBack);};
  }, []);

  // Add expense
  const handleAddExpense = (newExpenseData: Omit<Expense, 'id' | 'timestamp'>) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const newExpense: Expense = {
      ...newExpenseData,
      id: 'exp-' + Date.now(),
      timestamp: timeStr,
    };

    setUserState(prev => addExpense(rollover(prev), newExpense));
  };

  const handleRemoveExpense = (id: string) => setUserState(prev=>removeExpense(prev,id));

  const handleUpdateProfile = (updatedState: UserState) => {
    const safeTarget = calculateSafeDailyBudget(updatedState);
    setUserState({
      ...updatedState,
      todaySpendingTarget: safeTarget,
    });
  };

  return (
    <div className={`${mobileMode ? 'mobile-app' : ''} min-h-screen bg-[#050811] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 pb-12`}>
      <div role="status" className="text-center text-[11px] py-1 text-cyan-200 bg-[#101b30]">نسخة عرض · بيانات تجريبية قابلة للتعديل</div>
      {storageError && <p role="alert">{storageError}</p>}
      {/* Top Controls & Mode Switcher Bar */}
      <div className={`${mobileMode ? 'hidden' : ''} w-full bg-[#080D1C]/90 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-40 px-3 sm:px-6 py-2.5`}>
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Brand & App Name */}
          <div className="flex items-center gap-2.5">
            <span className="text-lg font-black text-white tracking-tight">
              دبّرني
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              التصميم المعتمد
            </span>
          </div>

          {/* Quick Screen Switcher (Direct tabs to the 4 screens in the mockup) */}
          <div className="flex items-center bg-[#050811] p-1 rounded-xl border border-slate-800 overflow-x-auto max-w-full text-xs font-bold">
            <button
              id="screen-tab-welcome"
              onClick={() => {
                navigateTo('welcome');
                if (presentationMode === 'gallery') setPresentationMode('phone');
              }}
              className={`px-3 py-1 rounded-lg transition-all whitespace-nowrap ${
                currentScreen === 'welcome' && presentationMode !== 'gallery'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              1. البداية
            </button>

            <button
              id="screen-tab-home"
              onClick={() => {
                navigateTo('home');
                if (presentationMode === 'gallery') setPresentationMode('phone');
              }}
              className={`px-3 py-1 rounded-lg transition-all whitespace-nowrap ${
                currentScreen === 'home' && presentationMode !== 'gallery'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              2. الرئيسية
            </button>

            <button
              id="screen-tab-scan"
              onClick={() => {
                navigateTo('scan');
                if (presentationMode === 'gallery') setPresentationMode('phone');
              }}
              className={`px-3 py-1 rounded-lg transition-all whitespace-nowrap ${
                currentScreen === 'scan' && presentationMode !== 'gallery'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              3. تحليل فاتورة
            </button>

            <button
              id="screen-tab-decision"
              onClick={() => {
                navigateTo('decision');
                if (presentationMode === 'gallery') setPresentationMode('phone');
              }}
              className={`px-3 py-1 rounded-lg transition-all whitespace-nowrap ${
                currentScreen === 'decision' && presentationMode !== 'gallery'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              4. قرار الشراء
            </button>

            <button
              id="screen-tab-gallery"
              onClick={() => setPresentationMode('gallery')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                presentationMode === 'gallery'
                  ? 'bg-indigo-600 text-white shadow-sm font-black'
                  : 'text-indigo-400 hover:text-indigo-200'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>عرض الـ 4 شاشات معاً</span>
            </button>
          </div>

          {/* View Mode (Phone Frame vs Fluid) & Brand Guide */}
          <div className="flex items-center gap-2">
            {presentationMode !== 'gallery' && (
              <button
                onClick={() =>
                  setPresentationMode(presentationMode === 'phone' ? 'fluid' : 'phone')
                }
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-800 bg-[#0B1224] hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors"
                title={presentationMode === 'phone' ? 'عرض ملء الشاشة' : 'عرض في إطار الهاتف'}
              >
                {presentationMode === 'phone' ? (
                  <>
                    <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>ملء الشاشة</span>
                  </>
                ) : (
                  <>
                    <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                    <span>إطار الجوال</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={() => setIsBrandGuideOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-teal-500/30 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 text-xs font-bold transition-colors"
            >
              <Palette className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden sm:inline">دليل الهوية</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main App Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col items-center justify-center">
        {/* VIEW MODE 1: THE 4 SCREENS PANORAMA (Exactly like the user's uploaded image) */}
        {presentationMode === 'gallery' ? (
          <FourScreensShowcase
            userState={userState}
            onSelectScreen={(scr) => {
              navigateTo(scr);
              setPresentationMode('phone');
            }}
            onOpenAddExpense={() => setIsAddExpenseOpen(true)}
            onOpenExpensesList={() => {
              navigateTo('expenses', 1);
              setPresentationMode('phone');
            }}
            onOpenAccount={() => {
              navigateTo('account', 1);
              setPresentationMode('phone');
            }}
          />
        ) : (
          /* VIEW MODE 2: INTERACTIVE SINGLE SCREEN (Inside Phone Frame with Framer Motion Slide and Fade) */
          <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-200">
            <PhoneFrame isBare={presentationMode === 'fluid'}>
              <div className="relative w-full overflow-hidden">
                <AnimatePresence mode="wait" custom={direction} initial={false}>
                  <motion.div
                    key={currentScreen}
                    custom={direction}
                    variants={screenSlideFadeVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="w-full"
                  >
                    {/* Screen 1: Welcome */}
                    {currentScreen === 'welcome' && (
                      <WelcomeScreen onStart={() => navigateTo('home', 1)} />
                    )}

                    {/* Screen 2: Home */}
                    {currentScreen === 'home' && (
                      <HomeScreen
                        userState={userState}
                        onOpenScan={() => navigateTo('scan', 1)}
                        onOpenDecision={(item) => {
                          if (item) setActiveDilemmaItem(item);
                          navigateTo('decision', 1);
                        }}
                        onOpenAddExpense={() => setIsAddExpenseOpen(true)}
                        onOpenExpensesList={() => navigateTo('expenses', 1)}
                        onOpenAccount={() => navigateTo('account', 1)}
                      />
                    )}

                    {/* Screen 3: Invoice Scan */}
                    {currentScreen === 'scan' && (
                      <InvoiceScanScreen
                        userState={userState}
                        onBack={() => navigateTo('home', -1)}
                        onExpenseAdded={handleAddExpense}
                      />
                    )}

                    {/* Screen 4: Purchase Decision */}
                    {currentScreen === 'decision' && (
                      <PurchaseDecisionScreen
                        userState={userState}
                        onBack={() => navigateTo('home', -1)}
                        initialItemName={activeDilemmaItem}
                        onProceedAnyway={(title, amount) => {
                          handleAddExpense({
                            title,
                            amount,
                            category: 'shopping',
                          });
                        }}
                      />
                    )}

                    {/* Auxiliary Screen: Expenses List */}
                    {currentScreen === 'expenses' && (
                      <ExpensesScreen
                        userState={userState}
                        onBack={() => navigateTo('home', -1)}
                        onOpenAddExpense={() => setIsAddExpenseOpen(true)}
                        onRemoveExpense={handleRemoveExpense}
                      />
                    )}

                    {/* Auxiliary Screen: Account & Profile */}
                    {currentScreen === 'account' && (
                      <AccountScreen
                        userState={userState}
                        onBack={() => navigateTo('home', -1)}
                        onUpdateState={handleUpdateProfile}
                        onOpenBrandGuide={() => setIsBrandGuideOpen(true)}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </PhoneFrame>
          </div>
        )}
      </main>

      {/* Add Expense Modal */}
      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        onAdd={handleAddExpense}
      />

      {/* Brand Identity Guide Modal */}
      <BrandIdentityModal
        isOpen={isBrandGuideOpen}
        onClose={() => setIsBrandGuideOpen(false)}
      />
    </div>
  );
}


