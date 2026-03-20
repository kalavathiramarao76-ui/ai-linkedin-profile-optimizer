'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  FileText,
  Heading,
  Home,
  KeyRound,
  Linkedin,
  Search,
  Settings,
  CreditCard,
} from 'lucide-react';

const navItems = [
  { href: '/app', label: 'Dashboard', icon: Home },
  { href: '/app/analyze', label: 'Analyze Profile', icon: Search },
  { href: '/app/headlines', label: 'Headlines', icon: Heading },
  { href: '/app/summary', label: 'Summary Writer', icon: FileText },
];

const bottomItems = [
  { href: '/pricing', label: 'Upgrade Plan', icon: CreditCard },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-zinc-800 bg-zinc-950 h-screen sticky top-0">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Linkedin className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold text-lg text-white">ProfileAI</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'bg-indigo-600/15 text-indigo-400'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-6 space-y-1">
        {bottomItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-all"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
