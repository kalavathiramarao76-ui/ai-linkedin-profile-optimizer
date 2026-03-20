'use client';

import { useState, useEffect, useCallback } from 'react';
import { WifiOff, RefreshCw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ApiErrorFallbackProps {
  error: string;
  onRetry: () => void;
  retryDelay?: number; // seconds
}

export function ApiErrorFallback({ error, onRetry, retryDelay = 10 }: ApiErrorFallbackProps) {
  const [countdown, setCountdown] = useState(retryDelay);
  const [autoRetrying, setAutoRetrying] = useState(true);

  const handleRetry = useCallback(() => {
    setCountdown(retryDelay);
    setAutoRetrying(true);
    onRetry();
  }, [onRetry, retryDelay]);

  useEffect(() => {
    if (!autoRetrying) return;

    if (countdown <= 0) {
      handleRetry();
      return;
    }

    const timer = setInterval(() => {
      setCountdown((c) => c - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, autoRetrying, handleRetry]);

  return (
    <div className="flex items-center justify-center p-6">
      <div className="relative max-w-md w-full">
        {/* Glassmorphism card */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent rounded-2xl blur-xl" />
        <div className="relative backdrop-blur-xl bg-zinc-900/80 border border-zinc-700/50 rounded-2xl p-8 shadow-2xl">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <WifiOff className="h-8 w-8 text-amber-400" />
            </div>
          </div>

          {/* Content */}
          <h2 className="text-xl font-bold text-white text-center mb-2">
            Connection Issue
          </h2>
          <p className="text-sm text-zinc-400 text-center mb-4">
            {error || 'Failed to connect to the server. Please check your connection.'}
          </p>

          {/* Countdown */}
          {autoRetrying && countdown > 0 && (
            <div className="flex items-center justify-center gap-2 mb-6 py-3 px-4 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
              <Clock className="h-4 w-4 text-amber-400 animate-pulse" />
              <span className="text-sm text-zinc-300">
                Retrying in <span className="font-bold text-amber-400">{countdown}s</span>
              </span>
            </div>
          )}

          {/* Progress bar */}
          {autoRetrying && countdown > 0 && (
            <div className="mb-6 h-1 rounded-full bg-zinc-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-1000 ease-linear"
                style={{ width: `${((retryDelay - countdown) / retryDelay) * 100}%` }}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Button onClick={handleRetry} className="w-full gap-2">
              <RefreshCw className="h-4 w-4" />
              Retry Now
            </Button>
            {autoRetrying && (
              <Button
                variant="ghost"
                onClick={() => setAutoRetrying(false)}
                className="w-full text-zinc-400"
              >
                Cancel Auto-Retry
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
