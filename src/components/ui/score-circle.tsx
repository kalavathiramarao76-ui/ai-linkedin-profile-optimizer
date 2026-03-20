'use client';

import { useEffect, useState } from 'react';
import { scoreColor } from '@/lib/utils';

interface ScoreCircleProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export function ScoreCircle({ score, size = 160, strokeWidth = 8, label }: ScoreCircleProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(240 3.7% 15.9%)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={score >= 80 ? '#34d399' : score >= 60 ? '#818cf8' : score >= 40 ? '#fbbf24' : '#f87171'}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${scoreColor(score)}`}>{animatedScore}</span>
          <span className="text-xs text-zinc-500">/ 100</span>
        </div>
      </div>
      {label && <span className="text-sm font-medium text-zinc-400">{label}</span>}
    </div>
  );
}
