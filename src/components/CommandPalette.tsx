'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Heading,
  FileText,
  BarChart3,
  Users,
  ClipboardList,
  Shield,
  Gauge,
  Download,
  Sun,
  Moon,
  ArrowRight,
  Clock,
  Command,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaletteCommand {
  id: string;
  label: string;
  icon: React.ElementType;
  action: () => void;
  keywords: string[];
  category: 'navigation' | 'action';
}

const RECENT_KEY = 'profileai-cmdk-recent';
const MAX_RECENT = 5;

function fuzzyMatch(query: string, target: string): boolean {
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  if (t.includes(q)) return true;
  let qi = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) qi++;
  }
  return qi === q.length;
}

function fuzzyScore(query: string, target: string): number {
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  if (t === q) return 100;
  if (t.startsWith(q)) return 90;
  if (t.includes(q)) return 70;
  // subsequence score
  let qi = 0;
  let gaps = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) qi++;
    else if (qi > 0) gaps++;
  }
  return qi === q.length ? Math.max(10, 60 - gaps * 5) : 0;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Load recent commands
  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      if (raw) setRecentIds(JSON.parse(raw));
    } catch {}
  }, [open]);

  const saveRecent = useCallback((id: string) => {
    setRecentIds((prev) => {
      const next = [id, ...prev.filter((r) => r !== id)].slice(0, MAX_RECENT);
      try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const commands: PaletteCommand[] = useMemo(
    () => [
      {
        id: 'analyze',
        label: 'Analyze Profile',
        icon: Search,
        action: () => router.push('/app/analyze'),
        keywords: ['analyze', 'profile', 'scan', 'check', 'score'],
        category: 'navigation',
      },
      {
        id: 'headlines',
        label: 'Generate Headlines',
        icon: Heading,
        action: () => router.push('/app/headlines'),
        keywords: ['headline', 'generate', 'title', 'tagline'],
        category: 'navigation',
      },
      {
        id: 'summary',
        label: 'Write Summary',
        icon: FileText,
        action: () => router.push('/app/summary'),
        keywords: ['summary', 'write', 'about', 'bio'],
        category: 'navigation',
      },
      {
        id: 'results',
        label: 'View Results',
        icon: BarChart3,
        action: () => router.push('/app'),
        keywords: ['results', 'dashboard', 'home', 'view', 'score'],
        category: 'navigation',
      },
      {
        id: 'team',
        label: 'Team Members',
        icon: Users,
        action: () => router.push('/app/team'),
        keywords: ['team', 'members', 'invite', 'people'],
        category: 'navigation',
      },
      {
        id: 'audit',
        label: 'Audit Log',
        icon: ClipboardList,
        action: () => router.push('/app/audit'),
        keywords: ['audit', 'log', 'history', 'activity'],
        category: 'navigation',
      },
      {
        id: 'sso',
        label: 'SSO Settings',
        icon: Shield,
        action: () => router.push('/app/settings/sso'),
        keywords: ['sso', 'saml', 'security', 'single sign on', 'settings'],
        category: 'navigation',
      },
      {
        id: 'usage',
        label: 'Usage Quotas',
        icon: Gauge,
        action: () => router.push('/app/settings/usage'),
        keywords: ['usage', 'quota', 'billing', 'plan', 'limits'],
        category: 'navigation',
      },
      {
        id: 'export',
        label: 'Export PDF',
        icon: Download,
        action: () => {
          window.print();
        },
        keywords: ['export', 'pdf', 'download', 'print', 'report'],
        category: 'action',
      },
      {
        id: 'theme',
        label: 'Toggle Theme',
        icon: Sun,
        action: () => {
          document.documentElement.classList.toggle('dark');
        },
        keywords: ['theme', 'dark', 'light', 'mode', 'toggle', 'appearance'],
        category: 'action',
      },
    ],
    [router]
  );

  const filtered = useMemo(() => {
    if (!query.trim()) {
      // Show recent first, then the rest
      const recent = recentIds
        .map((id) => commands.find((c) => c.id === id))
        .filter(Boolean) as PaletteCommand[];
      const rest = commands.filter((c) => !recentIds.includes(c.id));
      return [...recent, ...rest];
    }
    return commands
      .filter(
        (cmd) =>
          fuzzyMatch(query, cmd.label) ||
          cmd.keywords.some((kw) => fuzzyMatch(query, kw))
      )
      .sort((a, b) => {
        const aScore = Math.max(
          fuzzyScore(query, a.label),
          ...a.keywords.map((kw) => fuzzyScore(query, kw))
        );
        const bScore = Math.max(
          fuzzyScore(query, b.label),
          ...b.keywords.map((kw) => fuzzyScore(query, kw))
        );
        return bScore - aScore;
      });
  }, [query, commands, recentIds]);

  // Global Cmd+K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && filtered[selectedIndex]) {
        e.preventDefault();
        const cmd = filtered[selectedIndex];
        saveRecent(cmd.id);
        cmd.action();
        setOpen(false);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
      }
    },
    [filtered, selectedIndex, saveRecent]
  );

  // Scroll selected into view
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const el = list.children[selectedIndex] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  // Reset index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] motion-safe:animate-in motion-safe:fade-in motion-safe:duration-150"
      onClick={() => setOpen(false)}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Palette card */}
      <div
        className="relative w-full max-w-lg mx-4 rounded-2xl border border-zinc-700/50 bg-zinc-900/90 backdrop-blur-xl shadow-2xl shadow-indigo-500/10 motion-safe:animate-in motion-safe:zoom-in-95 motion-safe:duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 border-b border-zinc-800">
          <Search className="h-4 w-4 text-zinc-500 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command..."
            className="flex-1 bg-transparent py-4 text-sm text-white placeholder:text-zinc-500 focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex h-5 items-center rounded border border-zinc-700 bg-zinc-800 px-1.5 text-[10px] text-zinc-400 font-mono">
            ESC
          </kbd>
        </div>

        {/* Command list */}
        <div ref={listRef} className="max-h-72 overflow-y-auto py-2 px-2">
          {filtered.length === 0 && (
            <div className="py-8 text-center text-sm text-zinc-500">
              No commands found
            </div>
          )}
          {filtered.map((cmd, i) => {
            const isRecent = !query.trim() && recentIds.includes(cmd.id);
            return (
              <button
                key={cmd.id}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                  i === selectedIndex
                    ? 'bg-indigo-600/20 text-indigo-300'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                )}
                onMouseEnter={() => setSelectedIndex(i)}
                onClick={() => {
                  saveRecent(cmd.id);
                  cmd.action();
                  setOpen(false);
                }}
              >
                <cmd.icon className="h-4 w-4 shrink-0" />
                <span className="flex-1 text-left">{cmd.label}</span>
                {isRecent && (
                  <span className="flex items-center gap-1 text-[10px] text-zinc-600">
                    <Clock className="h-3 w-3" />
                    Recent
                  </span>
                )}
                {i === selectedIndex && (
                  <ArrowRight className="h-3 w-3 text-indigo-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-zinc-800 text-[10px] text-zinc-600">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded border border-zinc-700 bg-zinc-800 font-mono">↑↓</kbd>
              navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded border border-zinc-700 bg-zinc-800 font-mono">↵</kbd>
              select
            </span>
          </div>
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 rounded border border-zinc-700 bg-zinc-800 font-mono">esc</kbd>
            close
          </span>
        </div>
      </div>
    </div>
  );
}

/** Button to trigger the command palette — use in sidebar / mobile nav */
export function CommandPaletteTrigger({ className }: { className?: string }) {
  const handleClick = useCallback(() => {
    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true })
    );
  }, []);

  return (
    <button
      onClick={handleClick}
      className={cn(
        'flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 border border-zinc-800 transition-all',
        className
      )}
    >
      <Search className="h-3.5 w-3.5" />
      <span className="flex-1 text-left text-xs">Search commands...</span>
      <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-zinc-700 bg-zinc-800/80 text-[10px] font-mono text-zinc-500">
        <Command className="h-2.5 w-2.5" />K
      </kbd>
    </button>
  );
}
