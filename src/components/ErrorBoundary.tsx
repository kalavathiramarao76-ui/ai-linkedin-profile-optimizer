'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex items-center justify-center min-h-[400px] p-6">
          <div className="relative max-w-md w-full">
            {/* Glassmorphism crash card */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-orange-500/5 to-transparent rounded-2xl blur-xl" />
            <div className="relative backdrop-blur-xl bg-zinc-900/80 border border-zinc-700/50 rounded-2xl p-8 shadow-2xl">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="h-16 w-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="h-8 w-8 text-red-400" />
                </div>
              </div>

              {/* Content */}
              <h2 className="text-xl font-bold text-white text-center mb-2">
                Something went wrong
              </h2>
              <p className="text-sm text-zinc-400 text-center mb-6">
                An unexpected error occurred. Your data is safe — try refreshing or click below.
              </p>

              {/* Error detail */}
              {this.state.error && (
                <div className="mb-6 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                  <p className="text-xs text-zinc-500 font-mono truncate">
                    {this.state.error.message}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <Button onClick={this.handleRetry} className="w-full gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => window.location.reload()}
                  className="w-full text-zinc-400"
                >
                  Reload Page
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
