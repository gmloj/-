import React, { useState } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import glowingHorizonImg from '../../assets/images/glowing_horizon_1789485462670.jpg';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const [animationKey, setAnimationKey] = useState(0);

  const handleReplay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAnimationKey((prev) => prev + 1);
  };

  return (
    <div
      key={animationKey}
      className="relative min-h-[640px] sm:min-h-[720px] h-full w-full bg-[#070A12] text-slate-100 flex flex-col justify-between p-6 overflow-hidden rounded-3xl sm:rounded-[36px] border border-slate-800/80 shadow-2xl select-none"
    >
      {/* Background Graphic Horizon with cinematic zoom & breathing */}
      <motion.div
        initial={{ opacity: 0, scale: 1.15 }}
        animate={{ opacity: 0.65, scale: 1.02 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <img
          src={glowingHorizonImg}
          alt="Glowing Horizon"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center mix-blend-screen scale-105"
        />
        {/* Dark Vignette Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#070A12] via-transparent to-[#070A12]" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#070A12]/40 to-[#070A12]" />
      </motion.div>

      {/* Floating Ethereal Aura Orbs */}
      <motion.div
        animate={{
          opacity: [0.25, 0.5, 0.25],
          scale: [0.95, 1.06, 0.95],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none z-0"
      />

      <motion.div
        animate={{
          opacity: [0.15, 0.35, 0.15],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
        className="absolute bottom-1/4 right-4 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none z-0"
      />

      {/* Top Header with smooth slide-down */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex items-center justify-between pt-2"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-100 font-sans">
            دبّرني
          </span>
          <button
            onClick={handleReplay}
            className="w-6 h-6 rounded-full bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-cyan-400 flex items-center justify-center transition-colors text-[10px]"
            title="إعادة تشغيل حركة البداية"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-left text-[11px] font-medium text-slate-400 leading-tight"
        >
          <p>قرار أفضل</p>
          <p>لحياة أهدأ</p>
        </motion.div>
      </motion.div>

      {/* Center Branding & Typography with Cinematic Reveal */}
      <div className="relative z-10 flex flex-col items-center text-center my-auto py-8">
        {/* Stylized Glowing Big Wordmark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, filter: 'blur(10px)', y: 15 }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-3 group"
        >
          {/* Shimmer / Sheen across logo */}
          <div className="relative overflow-hidden rounded-2xl p-2">
            <motion.h1
              animate={{
                textShadow: [
                  '0 0 20px rgba(56,189,248,0.3)',
                  '0 0 45px rgba(56,189,248,0.65)',
                  '0 0 20px rgba(56,189,248,0.3)',
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="text-5xl sm:text-6xl font-black tracking-tight text-white select-none"
            >
              دبّرني
            </motion.h1>

            {/* Sweep light effect */}
            <motion.div
              initial={{ x: '-120%', opacity: 0 }}
              animate={{ x: '180%', opacity: [0, 0.7, 0] }}
              transition={{
                duration: 1.8,
                delay: 1.1,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatDelay: 4.5,
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-300/25 to-transparent skew-x-12 pointer-events-none"
            />
          </div>

          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-10 bg-cyan-400/25 rounded-full blur-xl pointer-events-none"
          />
        </motion.div>

        {/* Subtitle with soft upward fade */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-sm sm:text-base text-slate-300 font-medium max-w-[260px] leading-relaxed drop-shadow-sm">
            ذكاء مالي يساعدك تتخذ
            <br />
            <span className="text-white font-black tracking-wide drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">
              أفضل قرار الآن
            </span>
          </p>
        </motion.div>
      </div>

      {/* Bottom CTA Action Button with glowing pulse */}
      <motion.div
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 space-y-4 pb-2"
      >
        <motion.div
          animate={{
            boxShadow: [
              '0 8px 20px -4px rgba(34,211,238,0.1)',
              '0 12px 30px 0px rgba(34,211,238,0.35)',
              '0 8px 20px -4px rgba(34,211,238,0.1)',
            ],
          }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="rounded-full"
        >
          <motion.button
            id="btn-start-journey"
            onClick={onStart}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group w-full py-3.5 px-4 rounded-full bg-gradient-to-r from-slate-100 via-white to-slate-200 hover:to-teal-100 text-slate-950 font-black text-sm sm:text-base flex items-center justify-between transition-all duration-300 cursor-pointer"
          >
            {/* Arrow inside black circular badge with gentle nudge animation */}
            <motion.div
              animate={{ x: [0, -3, 0] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-8 h-8 rounded-full bg-slate-950 text-white flex items-center justify-center shadow-md transition-transform group-hover:-translate-x-1"
            >
              <ArrowLeft className="w-4 h-4" />
            </motion.div>

            <span className="flex-1 text-center font-black pr-2">
              ابدأ رحلتك الآن
            </span>

            <div className="w-8 h-8 opacity-0" />
          </motion.button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.95 }}
          className="text-center text-[11px] text-slate-400 tracking-wide font-medium"
        >
          قرارات أذكى .. لمستقبل أهدأ
        </motion.p>
      </motion.div>
    </div>
  );
};


