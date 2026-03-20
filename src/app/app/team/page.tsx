'use client';

import { useEffect, useState } from 'react';
import { TeamMember, getTeamMembers, seedTeamMembers } from '@/lib/team';
import { seedAuditLog } from '@/lib/audit';
import { TeamMemberCard } from '@/components/team/TeamMemberCard';
import { InviteModal } from '@/components/team/InviteModal';

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const loadMembers = () => {
    setMembers(getTeamMembers());
  };

  useEffect(() => {
    seedTeamMembers();
    seedAuditLog();
    loadMembers();
    setLoaded(true);
  }, []);

  const onlineCount = members.filter((m) => m.isOnline).length;

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">Team</h1>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white uppercase tracking-wider">
              Pro
            </span>
          </div>
          <p className="text-zinc-400 mt-1">
            Manage your team members and collaboration access.
          </p>
        </div>
        <button
          onClick={() => setInviteOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Invite Member
        </button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-center">
          <div className="text-2xl font-bold text-white">{members.length}</div>
          <div className="text-xs text-zinc-500 mt-0.5">Total Members</div>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-center">
          <div className="text-2xl font-bold text-emerald-400">{onlineCount}</div>
          <div className="text-xs text-zinc-500 mt-0.5">Online Now</div>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-center">
          <div className="text-2xl font-bold text-indigo-400">
            {members.filter((m) => m.role === 'Admin').length}
          </div>
          <div className="text-xs text-zinc-500 mt-0.5">Admins</div>
        </div>
      </div>

      {/* Members list */}
      <div className="space-y-2">
        {loaded &&
          members.map((member, i) => (
            <TeamMemberCard key={member.id} member={member} onUpdate={loadMembers} index={i} />
          ))}
      </div>

      {members.length === 0 && loaded && (
        <div className="text-center py-16 rounded-xl border border-zinc-800 bg-zinc-900/30">
          <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
              />
            </svg>
          </div>
          <p className="text-zinc-400 text-sm">No team members yet. Invite your first colleague!</p>
        </div>
      )}

      <InviteModal open={inviteOpen} onClose={() => setInviteOpen(false)} onInvited={loadMembers} />
    </div>
  );
}
