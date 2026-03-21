'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText, Heading, Search, TrendingUp } from 'lucide-react';

const tools = [
  {
    number: '01',
    title: 'Analyze Profile',
    description: 'Get a comprehensive AI score and actionable recommendations for your entire LinkedIn profile.',
    icon: Search,
    href: '/app/analyze',
    color: 'text-purple-400',
  },
  {
    number: '02',
    title: 'Generate Headlines',
    description: 'Create 10 compelling, keyword-optimized headlines tailored to your target role and industry.',
    icon: Heading,
    href: '/app/headlines',
    color: 'text-amber-400',
  },
  {
    number: '03',
    title: 'Write Summary',
    description: 'Get professional summaries in different tones, each crafted to showcase your unique experience.',
    icon: FileText,
    href: '/app/summary',
    color: 'text-emerald-400',
  },
];

export default function DashboardPage() {
  return (
    <div>
      {/* Noise texture */}
      <div className="noise-overlay" />

      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-3">
          <h1 className="text-4xl font-bold text-white tracking-tight">Profile Studio</h1>
          <span className="inline-flex items-center rounded-full bg-purple-500/15 border border-purple-500/25 px-3.5 py-1 text-[11px] font-semibold tracking-widest text-purple-400 uppercase">
            Workspace
          </span>
        </div>
        <p className="text-base text-zinc-500 font-light max-w-xl">
          Optimize your LinkedIn profile with AI-powered tools. Analyze, generate, and refine.
        </p>
      </div>

      {/* Quick Action — Analyze CTA */}
      <div className="rounded-2xl border border-purple-500/15 bg-purple-500/[0.04] p-8 mb-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-5">
            <div className="h-14 w-14 rounded-2xl bg-purple-500/10 border border-purple-500/15 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white tracking-tight">Ready to optimize?</h2>
              <p className="text-sm text-zinc-500 font-light mt-1">Paste your LinkedIn profile to get a full AI analysis.</p>
            </div>
          </div>
          <Link href="/app/analyze">
            <Button className="gap-2 rounded-2xl px-6 py-3 h-auto text-base">
              Analyze Now <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Tools — Editorial Rows */}
      <div className="mb-12">
        <p className="text-[11px] font-semibold tracking-widest text-zinc-600 uppercase mb-6">Tools</p>
        <div className="space-y-0">
          {tools.map((tool, index) => (
            <Link key={tool.href} href={tool.href} className="block group">
              <div className={`flex items-baseline gap-6 px-6 py-7 transition-all duration-200 border-t border-white/[0.04] hover:bg-white/[0.015] ${
                index === tools.length - 1 ? 'border-b border-white/[0.04]' : ''
              }`}>
                <span className="font-mono text-sm tabular-nums text-zinc-700 group-hover:text-purple-400 transition-colors">
                  {tool.number}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <tool.icon className={`h-5 w-5 ${tool.color} opacity-60 group-hover:opacity-100 transition-opacity`} />
                    <span className="text-2xl font-semibold tracking-tight text-zinc-400 group-hover:text-white transition-colors">
                      {tool.title}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-600 font-light leading-relaxed group-hover:text-zinc-400 transition-colors ml-8">
                    {tool.description}
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-zinc-800 group-hover:text-purple-400 transition-all duration-200 group-hover:translate-x-1 flex-shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Tips — Clean Layout */}
      <div>
        <p className="text-[11px] font-semibold tracking-widest text-zinc-600 uppercase mb-6">Quick Tips</p>
        <div className="space-y-0">
          {[
            'Use a professional headshot -- profiles with photos get 21x more views.',
            'Include at least 5 relevant skills to appear in recruiter searches.',
            'Write your headline as a value proposition, not just a job title.',
            'Add metrics and quantifiable achievements to your experience section.',
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-5 py-4 border-t border-white/[0.04] last:border-b last:border-white/[0.04]">
              <span className="font-mono text-sm tabular-nums text-zinc-700 mt-0.5">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="text-sm text-zinc-500 font-light leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
