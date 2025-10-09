export interface Group {
  id: string;
  name: string;           // Group name
  owner_id: string;       // Group creator
  description?: string;   // Group description
  avatar_url?: string;    // Group image
  members_count?: number;  // Number of members
  created_at: string;     // Creation timestamp
}

export interface CreateGroupData {
  name: string;
  description?: string;
  avatar_url?: string;
  memberIds?: string[];
}

export interface UpdateGroupData {
  name?: string;
  description?: string;
  avatar_url?: string;
}