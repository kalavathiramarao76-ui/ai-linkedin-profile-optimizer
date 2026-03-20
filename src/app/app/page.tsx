'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText, Heading, KeyRound, Search, TrendingUp } from 'lucide-react';

const tools = [
  {
    title: 'Analyze Profile',
    description: 'Get a comprehensive AI score and recommendations for your LinkedIn profile.',
    icon: Search,
    href: '/app/analyze',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
  },
  {
    title: 'Generate Headlines',
    description: 'Create 10 compelling, keyword-optimized headlines for your target role.',
    icon: Heading,
    href: '/app/headlines',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
  },
  {
    title: 'Write Summary',
    description: 'Get professional summaries in different tones tailored to your experience.',
    icon: FileText,
    href: '/app/summary',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
];

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Welcome to ProfileAI</h1>
        <p className="text-zinc-400">Optimize your LinkedIn profile with AI-powered tools.</p>
      </div>

      {/* Quick action */}
      <Card className="mb-8 border-indigo-500/30 bg-gradient-to-r from-indigo-600/10 to-purple-600/10">
        <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-indigo-600/20 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Ready to optimize?</h2>
              <p className="text-sm text-zinc-400">Paste your LinkedIn profile to get started.</p>
            </div>
          </div>
          <Link href="/app/analyze">
            <Button className="gap-2">
              Analyze Now <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Tools grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <Link key={tool.href} href={tool.href}>
            <Card className="h-full hover:border-zinc-700 transition-all duration-300 cursor-pointer group hover:scale-[1.03] hover:shadow-lg hover:shadow-indigo-500/5">
              <CardHeader>
                <div className={`h-10 w-10 rounded-lg ${tool.bg} flex items-center justify-center mb-2`}>
                  <tool.icon className={`h-5 w-5 ${tool.color}`} />
                </div>
                <CardTitle className="group-hover:text-indigo-400 transition-colors">{tool.title}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      {/* Tips */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Tips</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            'Use a professional headshot — profiles with photos get 21x more views.',
            'Include at least 5 relevant skills to appear in recruiter searches.',
            'Write your headline as a value proposition, not just a job title.',
            'Add metrics and quantifiable achievements to your experience section.',
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
              <span className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-xs font-bold">
                {i + 1}
              </span>
              <p className="text-sm text-zinc-400">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
