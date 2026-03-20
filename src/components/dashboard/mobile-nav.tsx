'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { FileText, Heading, Home, Search } from 'lucide-react';

const navItems = [
  { href: '/app', label: 'Home', icon: Home },
  { href: '/app/analyze', label: 'Analyze', icon: Search },
  { href: '/app/headlines', label: 'Headlines', icon: Heading },
  { href: '/app/summary', label: 'Summary', icon: FileText },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-xl">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-xs transition-colors',
                isActive ? 'text-indigo-400' : 'text-zinc-500'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
