export type MembershipRole = 'member' | 'admin';

export interface Membership {
  id: string;
  group_id: string;      // Group the user belongs to
  user_id: string;        // User member
  role: MembershipRole;   // Member permissions
  joined_at: string;      // Join date
}

export interface CreateMembershipData {
  group_id: string;
  user_id: string;
  role: MembershipRole;
}

export interface UpdateMembershipData {
  role?: MembershipRole;
}
