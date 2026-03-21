'use client';

import { useEffect, useRef } from 'react';
import { Navbar } from '@/components/landing/navbar';
import { Footer } from '@/components/landing/footer';
import { OnboardingModal } from '@/components/OnboardingModal';
import Link from 'next/link';

function useFadeUp() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible');
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

function FadeUp({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useFadeUp();
  return (
    <div ref={ref} className={`fade-up ${className}`}>
      {children}
    </div>
  );
}

/* ---------- Animated Score Ring ---------- */
function ScoreRing() {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const score = 82;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="140" height="140" viewBox="0 0 120 120" className="score-ring-svg">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#1c1c1e"
          strokeWidth="8"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#7c3aed"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="score-ring-animated"
          style={{ '--score-offset': `${offset}` } as React.CSSProperties}
          transform="rotate(-90 60 60)"
        />
      </svg>
      <span className="absolute text-4xl font-light text-white tracking-tight">{score}</span>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#09090b] noise-bg">
      <OnboardingModal />
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        {/* Single subtle purple gradient wash */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-purple-600/[0.07] rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center pt-16">
          <FadeUp>
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-8 font-mono">
              ProfileForge AI
            </p>
          </FadeUp>

          <FadeUp>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[0.95] mb-8">
              Your profile,
              <br />
              perfected.
            </h1>
          </FadeUp>

          <FadeUp>
            <p className="text-lg sm:text-xl text-gray-400 max-w-xl mx-auto mb-12 leading-relaxed">
              AI-powered analysis and optimization for every section of your LinkedIn profile. Score, refine, stand out.
            </p>
          </FadeUp>

          <FadeUp>
            <Link
              href="/app/analyze"
              className="inline-flex items-center px-8 py-3.5 bg-white text-black text-sm font-medium rounded-full hover:bg-gray-200 transition-colors duration-300"
            >
              Start Optimizing
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* ===== SECTION 1: SCORE ===== */}
      <section className="py-32 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <FadeUp>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-6 font-mono">
                  Profile Score
                </p>
                <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-[1.1] mb-6">
                  Know exactly where
                  <br />
                  you stand.
                </h2>
                <p className="text-gray-400 text-base leading-relaxed">
                  Our AI evaluates your headline, summary, experience, skills, and keywords across five dimensions.
                  A single score tells you what recruiters see -- and what to fix.
                </p>
              </div>
            </FadeUp>

            <FadeUp className="flex justify-center md:justify-end">
              <div className="relative">
                <ScoreRing />
                <div className="mt-6 space-y-2">
                  {[
                    { label: 'Headline', score: 90 },
                    { label: 'Summary', score: 75 },
                    { label: 'Experience', score: 85 },
                    { label: 'Skills', score: 70 },
                    { label: 'Keywords', score: 88 },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-20 font-mono">{item.label}</span>
                      <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-600/60 rounded-full score-bar-animated"
                          style={{ '--bar-width': `${item.score}%` } as React.CSSProperties}
                        />
                      </div>
                      <span className="text-xs text-gray-500 font-mono w-8 text-right">{item.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ===== SECTION 2: HEADLINES ===== */}
      <section className="py-32 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <FadeUp className="order-2 md:order-1">
              <div className="space-y-3">
                {[
                  'Senior Product Designer | Building delightful B2B experiences',
                  'Design Lead at Scale | Systems Thinking + User Advocacy',
                  'Product Design Director | 10 years shipping products users love',
                ].map((headline, i) => (
                  <div
                    key={i}
                    className="px-5 py-4 rounded-xl border border-white/[0.06] bg-white/[0.02] text-sm text-gray-300 leading-relaxed"
                  >
                    {headline}
                  </div>
                ))}
              </div>
            </FadeUp>

            <FadeUp className="order-1 md:order-2">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-6 font-mono">
                  Headline Generator
                </p>
                <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-[1.1] mb-6">
                  Headlines that
                  <br />
                  get noticed.
                </h2>
                <p className="text-gray-400 text-base leading-relaxed">
                  Generate ten keyword-rich, role-specific headlines tailored to your industry and career level.
                  Copy the best one in a click.
                </p>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ===== SECTION 3: SUMMARY TONES ===== */}
      <section className="py-32 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <FadeUp>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-6 font-mono">
                  Summary Writer
                </p>
                <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight leading-[1.1] mb-6">
                  Find your
                  <br />
                  voice.
                </h2>
                <p className="text-gray-400 text-base leading-relaxed">
                  Three distinct tones -- professional, creative, and executive -- so your summary sounds
                  like you, not like a template.
                </p>
              </div>
            </FadeUp>

            <FadeUp className="flex flex-col gap-4">
              {[
                { tone: 'Professional', text: 'Results-driven product leader with 8+ years building enterprise SaaS platforms...' },
                { tone: 'Creative', text: 'I turn complex workflows into experiences people actually enjoy using...' },
                { tone: 'Executive', text: 'Seasoned design executive driving $50M+ product portfolios through user-centered strategy...' },
              ].map((item) => (
                <div
                  key={item.tone}
                  className="px-5 py-4 rounded-xl border border-white/[0.06] bg-white/[0.02]"
                >
                  <span className="text-[10px] uppercase tracking-[0.2em] text-purple-400 font-mono block mb-2">
                    {item.tone}
                  </span>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ===== STATS RIBBON ===== */}
      <FadeUp>
        <section className="py-16 border-t border-b border-white/[0.06]">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 text-sm font-mono text-gray-500 tracking-wide">
              <span>5 Sections Scored</span>
              <span className="text-white/10">|</span>
              <span>10 Headlines</span>
              <span className="text-white/10">|</span>
              <span>3 Summary Tones</span>
              <span className="text-white/10">|</span>
              <span>AI Keyword Optimization</span>
            </div>
          </div>
        </section>
      </FadeUp>

      {/* ===== BOTTOM CTA ===== */}
      <section className="py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <FadeUp>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.05] mb-10">
              Stand out
              <br />
              on LinkedIn.
            </h2>
          </FadeUp>

          <FadeUp>
            <Link
              href="/app/analyze"
              className="inline-flex items-center px-8 py-3.5 bg-white text-black text-sm font-medium rounded-full hover:bg-gray-200 transition-colors duration-300"
            >
              Start Optimizing — Free
            </Link>
          </FadeUp>
        </div>
      </section>

      <Footer />
    </div>
  );
}
