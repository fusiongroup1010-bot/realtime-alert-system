'use client';
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import clsx from 'clsx';

interface SlaTimerProps {
  deadline: string;
}

export default function SlaTimer({ deadline }: SlaTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const target = new Date(deadline).getTime();
    
    const update = () => {
      const now = new Date().getTime();
      const diff = Math.floor((target - now) / 1000);
      setTimeLeft(diff > 0 ? diff : 0);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  const isOverdue = timeLeft <= 0;
  const absSeconds = Math.abs(timeLeft);
  const minutes = Math.floor(absSeconds / 60);
  const seconds = absSeconds % 60;
  const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className={clsx(
      "flex items-center font-mono text-xs px-2 py-1 rounded w-fit border transition-all duration-300",
      isOverdue 
        ? "text-red-400 bg-red-400/10 border-red-400/20 shadow-[0_0_10px_rgba(239,68,68,0.3)] animate-pulse" 
        : "text-orange-400 bg-orange-400/10 border-orange-400/20"
    )}>
      <Clock className={clsx("w-3 h-3 mr-1.5", !isOverdue && "animate-pulse")} />
      {display}
    </div>
  );
}
