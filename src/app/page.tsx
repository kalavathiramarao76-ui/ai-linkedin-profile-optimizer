'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Navbar } from '@/components/landing/navbar';
import { Footer } from '@/components/landing/footer';
import { OnboardingModal } from '@/components/OnboardingModal';
import Link from 'next/link';

/* ---------- Scroll-triggered fade-up ---------- */
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

/* ---------- Letter Reveal Animation ---------- */
function LetterReveal({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <span ref={ref} className={className} aria-label={text}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="letter-reveal-char"
          style={{
            animationDelay: visible ? `${i * 30}ms` : '0ms',
            animationPlayState: visible ? 'running' : 'paused',
          }}
          aria-hidden="true"
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
}

/* ---------- Scroll Counter Animation ---------- */
function ScrollCounter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const duration = 800;
    const startTime = performance.now();
    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));
      if (progress < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }, [started, end]);

  return (
    <span ref={ref} className="counter-animate">
      {count}{suffix}
    </span>
  );
}

/* ---------- 3D Tilt Card ---------- */
function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
  }, []);

  return (
    <div
      ref={cardRef}
      className={`tilt-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}

/* ---------- Parallax Section ---------- */
function ParallaxSection({ children, speed = 0.15, className = '' }: { children: React.ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    function onScroll() {
      const rect = el!.getBoundingClientRect();
      const scrolled = window.innerHeight - rect.top;
      const offset = scrolled * speed;
      el!.style.transform = `translateY(${offset}px)`;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [speed]);

  return (
    <div ref={ref} className={`parallax-layer ${className}`} style={{ willChange: 'transform' }}>
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
    <div className="min-h-screen bg-[#09090b] noise-bg scroll-snap-container">
      <OnboardingModal />
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden scroll-snap-section">
        {/* Single subtle purple gradient wash */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-purple-600/[0.07] rounded-full blur-[120px] pointer-events-none" />

        <ParallaxSection speed={-0.08}>
          <div className="max-w-4xl mx-auto text-center pt-16">
            <FadeUp>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-8 font-mono">
                ProfileForge AI
              </p>
            </FadeUp>

            <FadeUp>
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[0.95] mb-8">
                <LetterReveal text="Your profile," />
                <br />
                <LetterReveal text="perfected." />
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
        </ParallaxSection>
      </section>

      {/* ===== SECTION 1: SCORE ===== */}
      <section className="py-32 px-4 scroll-snap-section">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <ParallaxSection speed={0.05}>
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
            </ParallaxSection>

            <FadeUp className="flex justify-center md:justify-end">
              <TiltCard>
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
              </TiltCard>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ===== SECTION 2: HEADLINES ===== */}
      <section className="py-32 px-4 scroll-snap-section">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <FadeUp className="order-2 md:order-1">
              <div className="space-y-3">
                {[
                  'Senior Product Designer | Building delightful B2B experiences',
                  'Design Lead at Scale | Systems Thinking + User Advocacy',
                  'Product Design Director | 10 years shipping products users love',
                ].map((headline, i) => (
                  <TiltCard key={i}>
                    <div
                      className="px-5 py-4 rounded-xl border border-white/[0.06] bg-white/[0.02] text-sm text-gray-300 leading-relaxed"
                    >
                      {headline}
                    </div>
                  </TiltCard>
                ))}
              </div>
            </FadeUp>

            <ParallaxSection speed={0.04} className="order-1 md:order-2">
              <FadeUp>
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
            </ParallaxSection>
          </div>
        </div>
      </section>

      {/* ===== SECTION 3: SUMMARY TONES ===== */}
      <section className="py-32 px-4 scroll-snap-section">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <ParallaxSection speed={0.05}>
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
            </ParallaxSection>

            <FadeUp className="flex flex-col gap-4">
              {[
                { tone: 'Professional', text: 'Results-driven product leader with 8+ years building enterprise SaaS platforms...' },
                { tone: 'Creative', text: 'I turn complex workflows into experiences people actually enjoy using...' },
                { tone: 'Executive', text: 'Seasoned design executive driving $50M+ product portfolios through user-centered strategy...' },
              ].map((item) => (
                <TiltCard key={item.tone}>
                  <div
                    className="px-5 py-4 rounded-xl border border-white/[0.06] bg-white/[0.02]"
                  >
                    <span className="text-[10px] uppercase tracking-[0.2em] text-purple-400 font-mono block mb-2">
                      {item.tone}
                    </span>
                    <p className="text-sm text-gray-400 leading-relaxed">{item.text}</p>
                  </div>
                </TiltCard>
              ))}
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ===== STATS RIBBON ===== */}
      <FadeUp>
        <section className="py-16 border-t border-b border-white/[0.06] scroll-snap-section">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 text-center">
              <div>
                <div className="text-3xl font-bold text-white font-mono">
                  <ScrollCounter end={5} />
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">Sections Scored</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white font-mono">
                  <ScrollCounter end={10} />
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">Headlines</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white font-mono">
                  <ScrollCounter end={3} />
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">Summary Tones</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white font-mono">
                  <ScrollCounter end={100} suffix="%" />
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">AI Optimized</div>
              </div>
            </div>
          </div>
        </section>
      </FadeUp>

      {/* ===== BOTTOM CTA ===== */}
      <section className="py-32 px-4 scroll-snap-section">
        <div className="max-w-4xl mx-auto text-center">
          <FadeUp>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.05] mb-10">
              <LetterReveal text="Stand out" />
              <br />
              <LetterReveal text="on LinkedIn." />
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
