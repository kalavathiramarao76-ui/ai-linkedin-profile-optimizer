import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, TrendingUp, Zap } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-indigo-600/15 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm mb-8">
          <Sparkles className="h-3.5 w-3.5" />
          AI-Powered Profile Optimization
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-white mb-6">
          Make Your LinkedIn
          <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Stand Out
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Get an AI-powered score, personalized recommendations, and optimized content for every section of your
          LinkedIn profile. Land more interviews, attract recruiters.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/app/analyze">
            <Button size="lg" className="gap-2 text-base">
              Optimize My Profile
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="#features">
            <Button variant="outline" size="lg" className="text-base">
              See How It Works
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-white">
              <TrendingUp className="h-5 w-5 text-indigo-400" />
              10x
            </div>
            <p className="text-xs text-zinc-500 mt-1">More Profile Views</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold text-white">
              <Zap className="h-5 w-5 text-amber-400" />
              5K+
            </div>
            <p className="text-xs text-zinc-500 mt-1">Profiles Optimized</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">98%</div>
            <p className="text-xs text-zinc-500 mt-1">Satisfaction Rate</p>
          </div>
        </div>
      </div>
    </section>
  );
}
