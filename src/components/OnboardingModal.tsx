'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export function OnboardingModal() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(true);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const completed = localStorage.getItem('onboarding_complete');
    if (!completed) {
      setShow(true);
    }
  }, []);

  const goToStep = useCallback((newStep: number) => {
    if (isAnimating) return;
    setSlideDirection(newStep > step ? 'left' : 'right');
    setIsAnimating(true);
    setTimeout(() => {
      setStep(newStep);
      setIsAnimating(false);
    }, 300);
  }, [step, isAnimating]);

  const handleComplete = () => {
    setShowConfetti(true);
    if (dontShowAgain) {
      localStorage.setItem('onboarding_complete', 'true');
    }
    setTimeout(() => {
      setShow(false);
      router.push('/app/analyze');
    }, 1800);
  };

  const handleSkip = () => {
    if (dontShowAgain) {
      localStorage.setItem('onboarding_complete', 'true');
    }
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleSkip} />

      {/* Confetti layer */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${1.5 + Math.random() * 1.5}s`,
                backgroundColor: ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'][i % 6],
                width: `${6 + Math.random() * 6}px`,
                height: `${6 + Math.random() * 6}px`,
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
              }}
            />
          ))}
        </div>
      )}

      {/* Modal card */}
      <div className="relative w-full max-w-lg bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Content area */}
        <div className="relative min-h-[420px] overflow-hidden">
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center p-8 transition-all duration-300 ease-in-out ${
              isAnimating
                ? slideDirection === 'left'
                  ? '-translate-x-full opacity-0'
                  : 'translate-x-full opacity-0'
                : 'translate-x-0 opacity-100'
            }`}
          >
            {step === 0 && <StepWelcome />}
            {step === 1 && <StepHowItWorks />}
            {step === 2 && (
              <StepReady
                dontShowAgain={dontShowAgain}
                setDontShowAgain={setDontShowAgain}
                onComplete={handleComplete}
              />
            )}
          </div>
        </div>

        {/* Footer: dots + navigation */}
        <div className="flex items-center justify-between p-6 border-t border-white/10">
          <button
            onClick={handleSkip}
            className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Skip
          </button>

          {/* Progress dots */}
          <div className="flex items-center gap-2">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                onClick={() => goToStep(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === step ? 'w-6 bg-indigo-500' : 'w-2 bg-zinc-600 hover:bg-zinc-500'
                }`}
              />
            ))}
          </div>

          {step < 2 ? (
            <button
              onClick={() => goToStep(step + 1)}
              className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Next
            </button>
          ) : (
            <div className="w-10" />
          )}
        </div>
      </div>
    </div>
  );
}

function StepWelcome() {
  return (
    <div className="text-center">
      {/* CSS art hero illustration */}
      <div className="relative mx-auto mb-8 w-32 h-32">
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 animate-pulse" />
        {/* Main circle */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
          {/* Profile silhouette */}
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-white/20 mb-1 mx-auto" />
            <div className="w-16 h-8 rounded-t-full bg-white/15 mx-auto" />
          </div>
        </div>
        {/* Floating sparkles */}
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
        <div className="absolute -bottom-1 -left-1 w-3 h-3 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-4 -left-3 w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '0.8s' }} />
      </div>

      <h2 className="text-2xl font-bold text-white mb-3">Welcome to ProfilePro</h2>
      <p className="text-zinc-400 text-sm leading-relaxed max-w-sm mx-auto">
        The AI-powered LinkedIn profile optimizer that helps you land more interviews,
        attract recruiters, and stand out from the crowd.
      </p>
    </div>
  );
}

function StepHowItWorks() {
  const steps = [
    {
      icon: (
        <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
        </svg>
      ),
      title: 'Paste Profile',
      desc: 'Copy your LinkedIn text',
    },
    {
      icon: (
        <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
        </svg>
      ),
      title: 'AI Analyzes',
      desc: 'Get scored on 5 dimensions',
    },
    {
      icon: (
        <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      ),
      title: 'Get Results',
      desc: 'Actionable recommendations',
    },
  ];

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-white mb-2">How It Works</h2>
      <p className="text-zinc-400 text-sm mb-10">Three simple steps to a better profile</p>

      <div className="flex items-center justify-center gap-4">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="flex flex-col items-center gap-3 w-24">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                {s.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{s.title}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{s.desc}</p>
              </div>
            </div>
            {i < 2 && (
              <svg className="w-5 h-5 text-zinc-600 flex-shrink-0 -mt-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function StepReady({
  dontShowAgain,
  setDontShowAgain,
  onComplete,
}: {
  dontShowAgain: boolean;
  setDontShowAgain: (v: boolean) => void;
  onComplete: () => void;
}) {
  return (
    <div className="text-center">
      {/* Rocket CSS art */}
      <div className="relative mx-auto mb-8 w-24 h-24">
        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-indigo-600/20 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center text-5xl">
          <svg className="w-16 h-16 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
          </svg>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mb-3">Ready to Start?</h2>
      <p className="text-zinc-400 text-sm mb-8 max-w-sm mx-auto">
        Your optimized LinkedIn profile is just minutes away. Let&apos;s analyze your profile and unlock its full potential.
      </p>

      <button
        onClick={onComplete}
        className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 active:scale-95"
      >
        Let&apos;s Go
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </button>

      <label className="flex items-center justify-center gap-2 mt-6 cursor-pointer group">
        <input
          type="checkbox"
          checked={dontShowAgain}
          onChange={(e) => setDontShowAgain(e.target.checked)}
          className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0"
        />
        <span className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">
          Don&apos;t show this again
        </span>
      </label>
    </div>
  );
}
