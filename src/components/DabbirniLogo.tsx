import React from 'react';
import logoImg from '../assets/images/dabbirni_logo_1789484710883.jpg';

interface DabbirniLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'icon' | 'horizontal' | 'vertical' | 'badge';
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
}

export const DabbirniLogo: React.FC<DabbirniLogoProps> = ({
  size = 'md',
  variant = 'horizontal',
  showTagline = true,
  className = '',
  onClick,
}) => {
  const sizeMap = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
    '2xl': 'w-28 h-28',
  };

  const roundedMap = {
    xs: 'rounded-lg',
    sm: 'rounded-xl',
    md: 'rounded-2xl',
    lg: 'rounded-2xl',
    xl: 'rounded-3xl',
    '2xl': 'rounded-3xl',
  };

  const textMap = {
    xs: 'text-sm',
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
    '2xl': 'text-4xl',
  };

  const iconElement = (
    <div
      className={`relative group shrink-0 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {/* Ambient glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-indigo-600 rounded-full blur-xs opacity-40 group-hover:opacity-75 transition duration-500 group-hover:duration-200" />

      {/* Main emblem frame */}
      <div
        className={`relative ${sizeMap[size]} ${roundedMap[size]} overflow-hidden border border-teal-500/40 bg-[#0B1224] p-[2px] shadow-lg shadow-teal-950/60 transition-transform duration-300 group-hover:scale-105`}
      >
        <img
          src={logoImg}
          alt="شعار دبّرني"
          className="w-full h-full object-cover rounded-[inherit]"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Active online indicator */}
      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-teal-400 border-2 border-[#070A12] rounded-full ring-1 ring-teal-500/50" />
    </div>
  );

  if (variant === 'icon') {
    return <div className={`inline-flex items-center ${className}`}>{iconElement}</div>;
  }

  if (variant === 'vertical') {
    return (
      <div
        className={`flex flex-col items-center text-center gap-3 ${className} ${
          onClick ? 'cursor-pointer' : ''
        }`}
        onClick={onClick}
      >
        {iconElement}
        <div>
          <h2 className={`${textMap[size]} font-black text-slate-100 tracking-tight`}>
            دبّرني
          </h2>
          {showTagline && (
            <p className="text-xs text-teal-400 font-semibold mt-0.5">
              قراراتك المالية.. محسوبة وهادية
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-3 ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {iconElement}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-2">
          <span className={`${textMap[size]} font-black text-slate-100 tracking-tight leading-none`}>
            دبّرني
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-500/10 text-teal-300 border border-teal-500/30">
            الرفيق الذكي
          </span>
        </div>
        {showTagline && (
          <p className="text-[11px] text-slate-400 font-medium mt-1 leading-none">
            قراراتك المالية.. محسوبة وهادية
          </p>
        )}
      </div>
    </div>
  );
};
