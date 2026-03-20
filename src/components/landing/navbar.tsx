'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Linkedin, Menu, X } from 'lucide-react';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Linkedin className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold text-lg text-white">ProfileAI</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
            Features
          </Link>
          <Link href="/pricing" className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
            Pricing
          </Link>
          <Link href="#faq" className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
            FAQ
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/app">
            <Button variant="outline" size="sm">
              Dashboard
            </Button>
          </Link>
          <Link href="/app/analyze">
            <Button size="sm">Optimize Profile</Button>
          </Link>
        </div>

        <button
          className="md:hidden text-zinc-400 hover:text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-3">
            <Link href="#features" className="block text-sm text-zinc-400 hover:text-white py-2">
              Features
            </Link>
            <Link href="/pricing" className="block text-sm text-zinc-400 hover:text-white py-2">
              Pricing
            </Link>
            <Link href="/app" className="block">
              <Button variant="outline" size="sm" className="w-full">
                Dashboard
              </Button>
            </Link>
            <Link href="/app/analyze" className="block">
              <Button size="sm" className="w-full">
                Optimize Profile
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
