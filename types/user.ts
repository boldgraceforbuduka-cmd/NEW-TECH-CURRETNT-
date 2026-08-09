// types/user.ts
export interface User {
  id: string;
  email: string;
  user_metadata?: {
    role?: string;
  };
}

export interface UserPreferences {
  user_id: string;
  followed_topics: string[];
  followed_sources: string[];
  updated_at: string;
}