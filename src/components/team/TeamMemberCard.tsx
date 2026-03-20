'use client';

import { useState } from 'react';
import { TeamMember, getInitials, updateMemberRole, removeTeamMember } from '@/lib/team';
import { trackEvent } from '@/lib/audit';

interface TeamMemberCardProps {
  member: TeamMember;
  onUpdate: () => void;
  index: number;
}

export function TeamMemberCard({ member, onUpdate, index }: TeamMemberCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);

  const handleRoleChange = (role: TeamMember['role']) => {
    const oldRole = member.role;
    updateMemberRole(member.id, role);
    trackEvent('team', 'You', `Changed ${member.name}'s role from ${oldRole} to ${role}`);
    setRoleOpen(false);
    onUpdate();
  };

  const handleRemove = () => {
    removeTeamMember(member.id);
    trackEvent('team', 'You', `Removed ${member.name} from the team`);
    setShowConfirm(false);
    onUpdate();
  };

  const isYou = member.name === 'You';

  return (
    <div
      className="group relative flex items-center gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900 transition-all duration-300"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div
          className={`h-11 w-11 rounded-full ${member.avatarColor} flex items-center justify-center text-white font-semibold text-sm`}
        >
          {getInitials(member.name)}
        </div>
        {/* Online/offline dot */}
        <span
          className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-zinc-900 ${
            member.isOnline ? 'bg-emerald-400 presence-pulse' : 'bg-zinc-600'
          }`}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white truncate">{member.name}</span>
          {isYou && (
            <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-indigo-500/20 text-indigo-400">
              You
            </span>
          )}
        </div>
        <p className="text-xs text-zinc-500 truncate">{member.email}</p>
      </div>

      {/* Role dropdown */}
      <div className="relative">
        <button
          onClick={() => !isYou && setRoleOpen(!roleOpen)}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
            member.role === 'Admin'
              ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400'
              : member.role === 'Editor'
              ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
              : 'border-zinc-700 bg-zinc-800 text-zinc-400'
          } ${!isYou ? 'hover:brightness-125 cursor-pointer' : 'cursor-default'}`}
        >
          {member.role}
          {!isYou && (
            <svg className="inline-block ml-1 w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </button>

        {roleOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setRoleOpen(false)} />
            <div className="absolute right-0 top-full mt-1 z-20 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl py-1 min-w-[120px]">
              {(['Admin', 'Editor', 'Viewer'] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleChange(role)}
                  className={`w-full text-left px-3 py-1.5 text-xs transition-colors hover:bg-zinc-700 ${
                    member.role === role ? 'text-indigo-400 font-medium' : 'text-zinc-300'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Remove button */}
      {!isYou && (
        <div className="relative">
          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
              title="Remove member"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <button
                onClick={handleRemove}
                className="px-2 py-1 text-[10px] font-medium rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
              >
                Remove
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-2 py-1 text-[10px] font-medium rounded bg-zinc-800 text-zinc-400 hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
