'use client';

import { useState } from 'react';
import { TeamMember, addTeamMember } from '@/lib/team';
import { trackEvent } from '@/lib/audit';

interface InviteModalProps {
  open: boolean;
  onClose: () => void;
  onInvited: () => void;
}

export function InviteModal({ open, onClose, onInvited }: InviteModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<TeamMember['role']>('Viewer');

  if (!open) return null;

  const handleInvite = () => {
    if (!name.trim() || !email.trim()) return;

    addTeamMember(name.trim(), email.trim(), role);
    trackEvent('team', 'You', `Invited ${name.trim()} as ${role}`, email.trim());
    setName('');
    setEmail('');
    setRole('Viewer');
    onInvited();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-white">Invite Team Member</h2>
              <p className="text-sm text-zinc-500 mt-0.5">Add a colleague to collaborate</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Jane Cooper"
                className="w-full px-3 py-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@company.com"
                className="w-full px-3 py-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Role</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Admin', 'Editor', 'Viewer'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                      role === r
                        ? 'border-indigo-500 bg-indigo-500/15 text-indigo-400'
                        : 'border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-600'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-zinc-600 mt-2">
                {role === 'Admin'
                  ? 'Full access: manage team, analyze, generate, export'
                  : role === 'Editor'
                  ? 'Can analyze profiles, generate content, and export'
                  : 'View-only access to analyses and reports'}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-zinc-700 text-zinc-400 text-sm font-medium hover:bg-zinc-800 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleInvite}
              disabled={!name.trim() || !email.trim()}
              className="flex-1 px-4 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Send Invite
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
