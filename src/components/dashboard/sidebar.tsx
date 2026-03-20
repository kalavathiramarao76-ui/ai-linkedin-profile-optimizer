'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
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
  Users,
  ClipboardList,
  Shield,
  Gauge,
} from 'lucide-react';
import { CommandPaletteTrigger } from '@/components/CommandPalette';
import { NotificationCenter } from '@/components/NotificationCenter';

const navItems = [
  { href: '/app', label: 'Dashboard', icon: Home },
  { href: '/app/analyze', label: 'Analyze Profile', icon: Search },
  { href: '/app/headlines', label: 'Headlines', icon: Heading },
  { href: '/app/summary', label: 'Summary Writer', icon: FileText },
];

const proItems = [
  { href: '/app/team', label: 'Team', icon: Users, showBadge: true },
  { href: '/app/audit', label: 'Audit Log', icon: ClipboardList, showBadge: false },
];

const enterpriseSettingsItems = [
  { href: '/app/settings/sso', label: 'SSO / Security', icon: Shield },
  { href: '/app/settings/usage', label: 'Usage & Billing', icon: Gauge },
];

const bottomItems = [
  { href: '/pricing', label: 'Upgrade Plan', icon: CreditCard },
];

export function Sidebar() {
  const pathname = usePathname();
  const [teamCount, setTeamCount] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('profileai-team-members');
      if (raw) {
        const members = JSON.parse(raw);
        setTeamCount(Array.isArray(members) ? members.length : 0);
      }
    } catch {}

    const handleStorage = () => {
      try {
        const raw = localStorage.getItem('profileai-team-members');
        if (raw) {
          const members = JSON.parse(raw);
          setTeamCount(Array.isArray(members) ? members.length : 0);
        }
      } catch {}
    };

    window.addEventListener('storage', handleStorage);
    const interval = setInterval(handleStorage, 2000);
    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-zinc-800 bg-zinc-950 h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Linkedin className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-lg text-white">ProfileAI</span>
          </Link>
          <NotificationCenter />
        </div>
        <div className="mt-4">
          <CommandPaletteTrigger />
        </div>
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

        {/* Enterprise section divider */}
        <div className="pt-4 pb-2">
          <div className="flex items-center gap-2 px-3">
            <span className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider">Enterprise</span>
            <span className="px-1.5 py-0.5 text-[8px] font-bold rounded bg-gradient-to-r from-indigo-500 to-purple-500 text-white uppercase">
              Pro
            </span>
          </div>
        </div>

        {proItems.map((item) => {
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
              {item.showBadge && teamCount > 0 && (
                <span className="ml-auto px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-indigo-500/20 text-indigo-400">
                  {teamCount}
                </span>
              )}
            </Link>
          );
        })}

        {/* Settings section divider */}
        <div className="pt-4 pb-2">
          <div className="flex items-center gap-2 px-3">
            <span className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider">Settings</span>
            <span className="px-1.5 py-0.5 text-[8px] font-bold rounded bg-gradient-to-r from-amber-500 to-orange-500 text-white uppercase">
              Enterprise
            </span>
          </div>
        </div>

        {enterpriseSettingsItems.map((item) => {
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
