import React from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
  activeScreenTitle?: string;
  isBare?: boolean;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  activeScreenTitle,
  isBare = false,
}) => {
  if (isBare) {
    return <div className="w-full max-w-md mx-auto">{children}</div>;
  }

  return (
    <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[370px] bg-[#0A0D18] p-2.5 sm:p-3 rounded-[48px] sm:rounded-[52px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.08),inset_0_0_0_2px_rgba(255,255,255,0.05)] border-2 border-slate-800">
      {/* Phone Screen Inner Container */}
      <div className="relative w-full overflow-hidden rounded-[38px] sm:rounded-[42px] bg-[#070A12] border border-slate-800/80">
        {/* Top Status Bar with Dynamic Island */}
        <div className="relative z-30 flex items-center justify-between px-6 pt-3 pb-1 text-slate-200 text-xs font-semibold select-none">
          {/* Left: Time */}
          <span className="font-sans text-[11px] font-bold tracking-tight">
            9:41
          </span>

          {/* Center: Dynamic Island Cutout */}
          <div className="w-24 h-5 bg-black rounded-full shadow-inner flex items-center justify-end px-2 gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#111] border border-slate-800" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#0e1628]" />
          </div>

          {/* Right: Signals & Battery */}
          <div className="flex items-center gap-1 text-slate-300">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <BatteryMedium className="w-4 h-4" />
          </div>
        </div>

        {/* Screen Content */}
        <div className="w-full overflow-y-auto no-scrollbar">
          {children}
        </div>

        {/* Home Indicator Bar */}
        <div className="py-1 flex justify-center bg-[#070A12]">
          <div className="w-28 h-1 bg-slate-600/70 rounded-full" />
        </div>
      </div>
    </div>
  );
};
