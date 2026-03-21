'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  FileText,
  Heading,
  Home,
  Linkedin,
  Search,
  CreditCard,
  Users,
  ClipboardList,
  Shield,
  Gauge,
  Star,
} from 'lucide-react';
import { getFavoritesCount } from '@/lib/favorites';
import { CommandPaletteTrigger } from '@/components/CommandPalette';
import { NotificationCenter } from '@/components/NotificationCenter';
import { ThemeToggle } from '@/components/ThemeToggle';

const navItems = [
  { href: '/app', label: 'Dashboard', icon: Home },
  { href: '/app/analyze', label: 'Analyze Profile', icon: Search },
  { href: '/app/headlines', label: 'Headlines', icon: Heading },
  { href: '/app/summary', label: 'Summary Writer', icon: FileText },
  { href: '/app/favorites', label: 'Favorites', icon: Star },
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
  const [favCount, setFavCount] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('profileai-team-members');
      if (raw) {
        const members = JSON.parse(raw);
        setTeamCount(Array.isArray(members) ? members.length : 0);
      }
    } catch {}
    setFavCount(getFavoritesCount());

    const handleStorage = () => {
      try {
        const raw = localStorage.getItem('profileai-team-members');
        if (raw) {
          const members = JSON.parse(raw);
          setTeamCount(Array.isArray(members) ? members.length : 0);
        }
      } catch {}
    };

    const handleFavChange = () => setFavCount(getFavoritesCount());

    window.addEventListener('storage', handleStorage);
    window.addEventListener('favorites-changed', handleFavChange);
    const interval = setInterval(handleStorage, 2000);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('favorites-changed', handleFavChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[#0a0a0c]/95 backdrop-blur-2xl border-r border-white/[0.04] h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 py-5">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-purple-600 flex items-center justify-center">
              <Linkedin className="h-4 w-4 text-white" />
            </div>
            <div>
              <span className="text-[15px] font-semibold text-white tracking-tight">ProfileForge</span>
              <p className="text-[10px] text-purple-400 font-medium tracking-wider uppercase">AI Studio</p>
            </div>
          </Link>
          <NotificationCenter />
        </div>
        <div className="mt-4">
          <CommandPaletteTrigger />
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 border-t border-white/[0.04]" />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const isFav = item.href === '/app/favorites';
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200',
                isActive
                  ? isFav ? 'bg-amber-500/10 text-amber-400' : 'bg-purple-500/10 text-purple-400'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03]'
              )}
            >
              <item.icon className={cn(
                'h-[18px] w-[18px] flex-shrink-0 transition-colors',
                isActive ? (isFav ? 'text-amber-400' : 'text-purple-400') : 'text-zinc-600 group-hover:text-zinc-400',
                isFav && isActive && 'fill-amber-400'
              )} />
              <span className="flex-1">{item.label}</span>
              {isFav && favCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/15 text-amber-400">
                  {favCount}
                </span>
              )}
            </Link>
          );
        })}

        {/* Enterprise section */}
        <div className="pt-6 pb-2">
          <div className="flex items-center gap-2 px-3.5">
            <span className="text-[10px] font-semibold text-zinc-700 uppercase tracking-wider">Enterprise</span>
            <span className="px-1.5 py-0.5 text-[8px] font-bold rounded bg-gradient-to-r from-purple-500 to-violet-500 text-white uppercase">
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
                'group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200',
                isActive
                  ? 'bg-purple-500/10 text-purple-400'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03]'
              )}
            >
              <item.icon className={cn('h-[18px] w-[18px] flex-shrink-0', isActive ? 'text-purple-400' : 'text-zinc-600')} />
              <span className="flex-1">{item.label}</span>
              {item.showBadge && teamCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-purple-500/15 text-purple-400">
                  {teamCount}
                </span>
              )}
            </Link>
          );
        })}

        {/* Settings section */}
        <div className="pt-6 pb-2">
          <div className="flex items-center gap-2 px-3.5">
            <span className="text-[10px] font-semibold text-zinc-700 uppercase tracking-wider">Settings</span>
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
                'group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200',
                isActive
                  ? 'bg-purple-500/10 text-purple-400'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03]'
              )}
            >
              <item.icon className={cn('h-[18px] w-[18px] flex-shrink-0', isActive ? 'text-purple-400' : 'text-zinc-600')} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-5 space-y-1">
        <div className="mx-2 border-t border-white/[0.04] mb-3" />
        <ThemeToggle />
        {bottomItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium text-zinc-600 hover:text-zinc-400 hover:bg-white/[0.03] transition-all duration-200"
          >
            <item.icon className="h-[18px] w-[18px]" />
            {item.label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
