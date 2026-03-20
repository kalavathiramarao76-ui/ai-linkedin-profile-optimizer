'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  BarChart3,
  Search,
  Sparkles,
  Users,
  Globe,
  HardDrive,
  ArrowUpRight,
  Calendar,
  Crown,
} from 'lucide-react';

interface QuotaItem {
  label: string;
  used: number;
  limit: number;
  icon: typeof Search;
  color: string;
}

const quotas: QuotaItem[] = [
  { label: 'Profile Analyses', used: 47, limit: 100, icon: Search, color: 'indigo' },
  { label: 'AI Generations', used: 123, limit: 500, icon: Sparkles, color: 'purple' },
  { label: 'Team Members', used: 4, limit: 10, icon: Users, color: 'blue' },
  { label: 'API Calls', used: 892, limit: 5000, icon: Globe, color: 'cyan' },
  { label: 'Storage', used: 12, limit: 100, icon: HardDrive, color: 'amber' },
];

function generateMockDailyUsage(): number[] {
  const data: number[] = [];
  for (let i = 0; i < 30; i++) {
    data.push(Math.floor(Math.random() * 20) + 5);
  }
  return data;
}

function getBarColor(pct: number): string {
  if (pct >= 90) return 'bg-red-500';
  if (pct >= 70) return 'bg-amber-500';
  return 'bg-emerald-500';
}

function getBarTrackGlow(pct: number): string {
  if (pct >= 90) return 'shadow-red-500/20';
  if (pct >= 70) return 'shadow-amber-500/20';
  return 'shadow-emerald-500/20';
}

function getTextColor(pct: number): string {
  if (pct >= 90) return 'text-red-400';
  if (pct >= 70) return 'text-amber-400';
  return 'text-emerald-400';
}

function UsageSparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 400;
  const height = 80;
  const padding = 4;

  const points = data.map((val, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((val - min) / range) * (height - padding * 2);
    return { x, y };
  });

  const pathD = points
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(' ');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-20" preserveAspectRatio="none">
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#818cf8" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#sparkGrad)" />
      <path d={pathD} fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Last point dot */}
      <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="3" fill="#818cf8" />
    </svg>
  );
}

function AnimatedBar({ percentage }: { percentage: number }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(percentage), 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className={`h-2.5 rounded-full bg-zinc-800 overflow-hidden shadow-inner ${getBarTrackGlow(percentage)}`}>
      <div
        className={`h-full rounded-full transition-all duration-1000 ease-out ${getBarColor(percentage)}`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

export default function UsagePage() {
  const [dailyUsage] = useState(() => generateMockDailyUsage());

  const daysRemaining = 11;
  const billingStart = 'Mar 1, 2026';
  const billingEnd = 'Mar 31, 2026';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-600/20 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-purple-400" />
            </div>
            Usage &amp; Billing
          </h1>
          <p className="text-zinc-400 text-sm">Monitor your usage across the current billing period.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Plan badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25">
            <Crown className="h-3 w-3" />
            Pro Plan
          </span>
        </div>
      </div>

      {/* Billing period */}
      <Card className="border-indigo-500/20 bg-gradient-to-r from-indigo-600/5 to-purple-600/5">
        <CardContent className="p-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-indigo-400" />
            <div>
              <p className="text-sm font-medium text-white">
                Current billing period: {billingStart} &mdash; {billingEnd}
              </p>
              <p className="text-xs text-zinc-500">{daysRemaining} days remaining</p>
            </div>
          </div>
          <Link href="/pricing">
            <Button size="sm" className="gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500">
              <ArrowUpRight className="h-3.5 w-3.5" />
              Upgrade Plan
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Quotas grid */}
      <div className="grid gap-4">
        {quotas.map((q) => {
          const pct = Math.round((q.used / q.limit) * 100);
          const unit = q.label === 'Storage' ? 'MB' : '';
          return (
            <Card key={q.label}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`h-8 w-8 rounded-lg bg-${q.color}-500/10 flex items-center justify-center`}>
                      <q.icon className={`h-4 w-4 text-${q.color}-400`} />
                    </div>
                    <span className="text-sm font-medium text-white">{q.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${getTextColor(pct)}`}>{pct}%</span>
                    <span className="text-xs text-zinc-500">
                      {q.used}{unit} / {q.limit}{unit}
                    </span>
                  </div>
                </div>
                <AnimatedBar percentage={pct} />
                {pct >= 80 && (
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-xs text-amber-400">
                      {pct >= 90 ? 'Critical: Approaching limit' : 'Nearing quota limit'}
                    </p>
                    <Link href="/pricing">
                      <Button variant="ghost" size="sm" className="text-xs text-indigo-400 hover:text-indigo-300 h-6 px-2">
                        Upgrade
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Usage history */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Usage History</CardTitle>
          <CardDescription>Daily activity over the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <UsageSparkline data={dailyUsage} />
          <div className="flex items-center justify-between mt-2 text-xs text-zinc-600">
            <span>30 days ago</span>
            <span>Today</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
