import React, { useState, useEffect } from 'react';
import { TranslationDictionary } from '../i18n/translations';
import { Flame, Trophy, Clock } from 'lucide-react';

interface CountdownTimerProps {
  t: TranslationDictionary;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ t }) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      // Target: End of current month at 23:59:59
      const endOfMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );

      const diff = endOfMonth.getTime() - now.getTime();

      if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTwoDigits = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="w-full bg-[#0F0F12] border-b border-white/10 py-2 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
        
        {/* Prize Pool Callout */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-500">
            <Trophy className="w-4 h-4 text-pink-500" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold leading-none mb-0.5">
              {t.prizePool}
            </p>
            <p className="text-pink-500 font-mono font-bold leading-none text-xs sm:text-sm">
              {t.prizeDetails}
            </p>
          </div>
        </div>

        {/* Live Countdown Display */}
        <div className="flex items-center gap-3">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold hidden sm:block">
            {t.countdownTitle}
          </p>
          
          <div className="flex gap-1.5 font-mono text-white text-xs font-bold">
            <span className="bg-white/5 px-2 py-1 rounded border border-white/10">
              {formatTwoDigits(timeLeft.days)}{t.days.slice(0, 1).toUpperCase()}
            </span>
            <span className="bg-white/5 px-2 py-1 rounded border border-white/10">
              {formatTwoDigits(timeLeft.hours)}{t.hours.slice(0, 1).toUpperCase()}
            </span>
            <span className="bg-white/5 px-2 py-1 rounded border border-white/10">
              {formatTwoDigits(timeLeft.minutes)}{t.minutes.slice(0, 1).toUpperCase()}
            </span>
            <span className="bg-white/5 px-2 py-1 rounded border border-white/10 text-pink-400">
              {formatTwoDigits(timeLeft.seconds)}{t.seconds.slice(0, 1).toUpperCase()}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
