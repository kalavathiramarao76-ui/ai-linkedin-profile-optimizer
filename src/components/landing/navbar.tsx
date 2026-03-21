'use client';

import Link from 'next/link';
import { useState } from 'react';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/[0.04]">
      <nav className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-sm font-medium text-white tracking-tight">
          ProfileForge
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/pricing" className="text-xs text-gray-500 hover:text-gray-300 transition-colors uppercase tracking-[0.15em]">
            Pricing
          </Link>
          <Link
            href="/app/analyze"
            className="text-xs text-white px-4 py-1.5 rounded-full border border-white/[0.12] hover:bg-white/[0.05] transition-colors uppercase tracking-[0.15em]"
          >
            Launch App
          </Link>
        </div>

        <button
          className="md:hidden text-gray-400 hover:text-white transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
            {mobileOpen ? (
              <>
                <line x1="4" y1="4" x2="14" y2="14" />
                <line x1="14" y1="4" x2="4" y2="14" />
              </>
            ) : (
              <>
                <line x1="3" y1="5" x2="15" y2="5" />
                <line x1="3" y1="9" x2="15" y2="9" />
                <line x1="3" y1="13" x2="15" y2="13" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden border-t border-white/[0.04] bg-[#09090b]/95 backdrop-blur-xl">
          <div className="px-4 py-6 space-y-4">
            <Link href="/pricing" className="block text-sm text-gray-400 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link
              href="/app/analyze"
              className="block text-sm text-white"
            >
              Launch App
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
