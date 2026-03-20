'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Bell, Check, CheckCheck, X, Sparkles, UserPlus, AlertTriangle, FileBarChart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  title: string;
  description: string;
  icon: 'analysis' | 'team' | 'quota' | 'report';
  timeAgo: string;
  read: boolean;
  timestamp: number;
}

const STORAGE_KEY = 'profileai-notifications';
const MAX_NOTIFICATIONS = 20;

const iconMap: Record<string, React.ElementType> = {
  analysis: Sparkles,
  team: UserPlus,
  quota: AlertTriangle,
  report: FileBarChart,
};

const iconColorMap: Record<string, string> = {
  analysis: 'text-emerald-400 bg-emerald-400/10',
  team: 'text-blue-400 bg-blue-400/10',
  quota: 'text-amber-400 bg-amber-400/10',
  report: 'text-indigo-400 bg-indigo-400/10',
};

function seedNotifications(): Notification[] {
  const now = Date.now();
  return [
    {
      id: '1',
      title: 'Profile analysis complete',
      description: 'Your profile scored 87/100 — great improvement!',
      icon: 'analysis',
      timeAgo: '5 min ago',
      read: false,
      timestamp: now - 5 * 60 * 1000,
    },
    {
      id: '2',
      title: 'Sarah joined the team',
      description: 'sarah@company.com accepted the invitation',
      icon: 'team',
      timeAgo: '1h ago',
      read: false,
      timestamp: now - 60 * 60 * 1000,
    },
    {
      id: '3',
      title: 'Usage quota 80% reached',
      description: 'You have used 80 of 100 monthly analyses',
      icon: 'quota',
      timeAgo: '3h ago',
      read: false,
      timestamp: now - 3 * 60 * 60 * 1000,
    },
    {
      id: '4',
      title: 'Weekly report ready',
      description: 'Team performance report for this week is available',
      icon: 'report',
      timeAgo: 'yesterday',
      read: false,
      timestamp: now - 24 * 60 * 60 * 1000,
    },
    {
      id: '5',
      title: 'Headline optimization tip',
      description: 'Add numbers to your headline for 40% more views',
      icon: 'analysis',
      timeAgo: '2 days ago',
      read: true,
      timestamp: now - 2 * 24 * 60 * 60 * 1000,
    },
    {
      id: '6',
      title: 'Mike updated his profile',
      description: 'mike@company.com ran a new analysis',
      icon: 'team',
      timeAgo: '3 days ago',
      read: true,
      timestamp: now - 3 * 24 * 60 * 60 * 1000,
    },
    {
      id: '7',
      title: 'Monthly summary exported',
      description: 'PDF report for February has been generated',
      icon: 'report',
      timeAgo: '5 days ago',
      read: true,
      timestamp: now - 5 * 24 * 60 * 60 * 1000,
    },
    {
      id: '8',
      title: 'New SSO provider connected',
      description: 'Google Workspace SSO has been configured',
      icon: 'analysis',
      timeAgo: '1 week ago',
      read: true,
      timestamp: now - 7 * 24 * 60 * 60 * 1000,
    },
  ];
}

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);

  // Load from localStorage or seed
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setNotifications(parsed);
          return;
        }
      }
    } catch {}
    const seed = seedNotifications();
    setNotifications(seed);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(seed)); } catch {}
  }, []);

  const persist = useCallback((items: Notification[]) => {
    const trimmed = items.slice(0, MAX_NOTIFICATIONS);
    setNotifications(trimmed);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed)); } catch {}
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = useCallback(
    (id: string) => {
      persist(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
    },
    [notifications, persist]
  );

  const markAllRead = useCallback(() => {
    persist(notifications.map((n) => ({ ...n, read: true })));
  }, [notifications, persist]);

  const dismiss = useCallback(
    (id: string) => {
      persist(notifications.filter((n) => n.id !== id));
    },
    [notifications, persist]
  );

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
        aria-label="Notifications"
      >
        <Bell
          className={cn(
            'h-4.5 w-4.5',
            unreadCount > 0 && 'motion-safe:animate-[bell-shake_0.5s_ease-in-out]'
          )}
        />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-[9px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="absolute top-full right-0 mt-2 w-80 rounded-xl border border-zinc-700/50 bg-zinc-900/95 backdrop-blur-xl shadow-2xl shadow-black/30 z-50 motion-safe:animate-in motion-safe:slide-in-from-top-2 motion-safe:fade-in motion-safe:duration-200 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
            <h3 className="text-sm font-semibold text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <CheckCheck className="h-3 w-3" />
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 && (
              <div className="py-10 text-center text-sm text-zinc-500">
                No notifications
              </div>
            )}
            {notifications.map((notif) => {
              const Icon = iconMap[notif.icon] || Sparkles;
              const colorClass = iconColorMap[notif.icon] || 'text-zinc-400 bg-zinc-400/10';
              return (
                <div
                  key={notif.id}
                  className={cn(
                    'group flex items-start gap-3 px-4 py-3 border-b border-zinc-800/50 transition-colors hover:bg-zinc-800/30 cursor-pointer',
                    !notif.read && 'bg-indigo-500/[0.03]'
                  )}
                  onClick={() => markRead(notif.id)}
                >
                  {/* Icon */}
                  <div className={cn('mt-0.5 p-1.5 rounded-lg shrink-0', colorClass)}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={cn('text-xs font-medium truncate', notif.read ? 'text-zinc-400' : 'text-white')}>
                        {notif.title}
                      </p>
                      {!notif.read && (
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-0.5 truncate">
                      {notif.description}
                    </p>
                    <p className="text-[10px] text-zinc-600 mt-1">{notif.timeAgo}</p>
                  </div>

                  {/* Dismiss */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dismiss(notif.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-zinc-700/50 text-zinc-500 hover:text-zinc-300 transition-all shrink-0"
                    aria-label="Dismiss"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
