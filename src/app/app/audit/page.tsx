'use client';

import { useEffect, useState } from 'react';
import { AuditEvent, getAuditLog, seedAuditLog, formatTimeAgo } from '@/lib/audit';
import { seedTeamMembers } from '@/lib/team';

const ACTION_ICONS: Record<string, { icon: string; color: string; bg: string }> = {
  analyze: {
    icon: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/15',
  },
  generate: {
    icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z',
    color: 'text-amber-400',
    bg: 'bg-amber-500/15',
  },
  export: {
    icon: 'M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/15',
  },
  team: {
    icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z',
    color: 'text-purple-400',
    bg: 'bg-purple-500/15',
  },
};

const ACTION_LABELS: Record<string, string> = {
  all: 'All Actions',
  analyze: 'Analyze',
  generate: 'Generate',
  export: 'Export',
  team: 'Team',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function AuditPage() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [actionFilter, setActionFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    seedAuditLog();
    seedTeamMembers();
    loadEvents();
    setLoaded(true);
  }, []);

  const loadEvents = () => {
    setEvents(
      getAuditLog({
        actionType: actionFilter !== 'all' ? actionFilter : undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      })
    );
  };

  useEffect(() => {
    loadEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionFilter, dateFrom, dateTo]);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white">Audit Log</h1>
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white uppercase tracking-wider">
            Pro
          </span>
        </div>
        <p className="text-zinc-400 mt-1">Track all team actions and activity history.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6 p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 font-medium">Filter:</span>
          <div className="flex gap-1">
            {Object.entries(ACTION_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActionFilter(key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  actionFilter === key
                    ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                    : 'text-zinc-500 hover:text-zinc-300 border border-transparent hover:border-zinc-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="From"
          />
          <span className="text-zinc-600 text-xs">to</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="To"
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical connecting line */}
        {events.length > 0 && (
          <div className="absolute left-[21px] top-6 bottom-6 w-px bg-gradient-to-b from-indigo-500/40 via-zinc-700/40 to-transparent" />
        )}

        <div className="space-y-1">
          {loaded &&
            events.map((event, i) => {
              const actionMeta = ACTION_ICONS[event.action] || ACTION_ICONS.analyze;
              return (
                <div
                  key={event.id}
                  className="audit-entry relative flex items-start gap-4 p-4 rounded-xl hover:bg-zinc-900/50 transition-all group"
                  style={{
                    opacity: 0,
                    animation: `auditFadeIn 0.4s ease forwards`,
                    animationDelay: `${i * 60}ms`,
                  }}
                >
                  {/* Icon dot */}
                  <div
                    className={`relative z-10 flex-shrink-0 h-[42px] w-[42px] rounded-full ${actionMeta.bg} flex items-center justify-center border-2 border-zinc-900`}
                  >
                    <svg
                      className={`w-4 h-4 ${actionMeta.color}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d={actionMeta.icon} />
                    </svg>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-1">
                    <p className="text-sm text-zinc-200">{event.description}</p>
                    {event.details && (
                      <p className="text-xs text-zinc-500 mt-0.5">{event.details}</p>
                    )}
                  </div>

                  {/* User avatar + time */}
                  <div className="flex items-center gap-3 flex-shrink-0 pt-1">
                    <div className="hidden sm:flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-zinc-700 flex items-center justify-center text-[10px] font-medium text-zinc-300">
                        {getInitials(event.user)}
                      </div>
                      <span className="text-xs text-zinc-500">{event.user}</span>
                    </div>
                    <span className="text-xs text-zinc-600 whitespace-nowrap">
                      {formatTimeAgo(event.timestamp)}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>

        {events.length === 0 && loaded && (
          <div className="text-center py-16 rounded-xl border border-zinc-800 bg-zinc-900/30">
            <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-zinc-400 text-sm">No activity found for the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
