export interface AuditEvent {
  id: string;
  action: 'analyze' | 'generate' | 'export' | 'team';
  description: string;
  user: string;
  userEmail?: string;
  details?: string;
  timestamp: number;
}

export interface AuditFilters {
  actionType?: string;
  dateFrom?: string;
  dateTo?: string;
}

const AUDIT_KEY = 'profileai-audit-log';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function trackEvent(
  action: AuditEvent['action'],
  user: string,
  description: string,
  details?: string,
  userEmail?: string
): void {
  if (typeof window === 'undefined') return;

  const event: AuditEvent = {
    id: generateId(),
    action,
    description,
    user,
    userEmail,
    details,
    timestamp: Date.now(),
  };

  const existing = getAuditLog();
  existing.unshift(event);
  // Keep last 200 events
  const trimmed = existing.slice(0, 200);
  localStorage.setItem(AUDIT_KEY, JSON.stringify(trimmed));
}

export function getAuditLog(filters?: AuditFilters): AuditEvent[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem(AUDIT_KEY);
    let events: AuditEvent[] = raw ? JSON.parse(raw) : [];

    if (filters?.actionType && filters.actionType !== 'all') {
      events = events.filter((e) => e.action === filters.actionType);
    }

    if (filters?.dateFrom) {
      const from = new Date(filters.dateFrom).getTime();
      events = events.filter((e) => e.timestamp >= from);
    }

    if (filters?.dateTo) {
      const to = new Date(filters.dateTo).getTime() + 86400000; // end of day
      events = events.filter((e) => e.timestamp <= to);
    }

    return events;
  } catch {
    return [];
  }
}

export function seedAuditLog(): void {
  if (typeof window === 'undefined') return;
  const existing = localStorage.getItem(AUDIT_KEY);
  if (existing) return;

  const now = Date.now();
  const seed: AuditEvent[] = [
    {
      id: generateId(),
      action: 'analyze',
      description: 'John analyzed a profile',
      user: 'John Carter',
      userEmail: 'john@company.com',
      timestamp: now - 2 * 60 * 1000,
    },
    {
      id: generateId(),
      action: 'generate',
      description: 'Sarah generated headlines',
      user: 'Sarah Chen',
      userEmail: 'sarah@company.com',
      timestamp: now - 15 * 60 * 1000,
    },
    {
      id: generateId(),
      action: 'export',
      description: 'You exported results as PDF',
      user: 'You',
      timestamp: now - 60 * 60 * 1000,
    },
    {
      id: generateId(),
      action: 'team',
      description: 'Mike was added to the team',
      user: 'You',
      details: 'Added mike@company.com as Editor',
      timestamp: now - 3 * 60 * 60 * 1000,
    },
    {
      id: generateId(),
      action: 'analyze',
      description: 'Sarah analyzed a profile',
      user: 'Sarah Chen',
      userEmail: 'sarah@company.com',
      timestamp: now - 5 * 60 * 60 * 1000,
    },
    {
      id: generateId(),
      action: 'generate',
      description: 'John generated a summary',
      user: 'John Carter',
      userEmail: 'john@company.com',
      timestamp: now - 8 * 60 * 60 * 1000,
    },
    {
      id: generateId(),
      action: 'export',
      description: 'Sarah exported results as Markdown',
      user: 'Sarah Chen',
      userEmail: 'sarah@company.com',
      timestamp: now - 24 * 60 * 60 * 1000,
    },
    {
      id: generateId(),
      action: 'team',
      description: 'Sarah was promoted to Admin',
      user: 'You',
      details: 'Changed role from Editor to Admin',
      timestamp: now - 48 * 60 * 60 * 1000,
    },
  ];

  localStorage.setItem(AUDIT_KEY, JSON.stringify(seed));
}

export function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}
