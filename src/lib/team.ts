export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  isOnline: boolean;
  avatarColor: string;
  joinedAt: number;
}

const TEAM_KEY = 'profileai-team-members';

const AVATAR_COLORS = [
  'bg-indigo-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-cyan-500',
  'bg-violet-500',
  'bg-pink-500',
  'bg-teal-500',
];

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export { getInitials };

export function getTeamMembers(): TeamMember[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(TEAM_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

export function saveTeamMembers(members: TeamMember[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TEAM_KEY, JSON.stringify(members));
}

export function addTeamMember(name: string, email: string, role: TeamMember['role']): TeamMember {
  const members = getTeamMembers();
  const member: TeamMember = {
    id: generateId(),
    name,
    email,
    role,
    isOnline: Math.random() > 0.4,
    avatarColor: AVATAR_COLORS[members.length % AVATAR_COLORS.length],
    joinedAt: Date.now(),
  };
  members.push(member);
  saveTeamMembers(members);
  return member;
}

export function removeTeamMember(id: string): void {
  const members = getTeamMembers().filter((m) => m.id !== id);
  saveTeamMembers(members);
}

export function updateMemberRole(id: string, role: TeamMember['role']): void {
  const members = getTeamMembers();
  const member = members.find((m) => m.id === id);
  if (member) {
    member.role = role;
    saveTeamMembers(members);
  }
}

export function seedTeamMembers(): void {
  if (typeof window === 'undefined') return;
  const existing = localStorage.getItem(TEAM_KEY);
  if (existing) return;

  const now = Date.now();
  const seed: TeamMember[] = [
    {
      id: generateId(),
      name: 'You',
      email: 'you@company.com',
      role: 'Admin',
      isOnline: true,
      avatarColor: 'bg-indigo-500',
      joinedAt: now - 30 * 86400000,
    },
    {
      id: generateId(),
      name: 'Sarah Chen',
      email: 'sarah@company.com',
      role: 'Admin',
      isOnline: true,
      avatarColor: 'bg-emerald-500',
      joinedAt: now - 14 * 86400000,
    },
    {
      id: generateId(),
      name: 'John Carter',
      email: 'john@company.com',
      role: 'Editor',
      isOnline: false,
      avatarColor: 'bg-amber-500',
      joinedAt: now - 7 * 86400000,
    },
    {
      id: generateId(),
      name: 'Mike Ross',
      email: 'mike@company.com',
      role: 'Viewer',
      isOnline: true,
      avatarColor: 'bg-rose-500',
      joinedAt: now - 3 * 86400000,
    },
  ];

  saveTeamMembers(seed);
}
