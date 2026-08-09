'use client';
import { useSupabase } from '@/hooks/useSupabase'; // ✅ correct import alias

export default function ProfilePage() {
  const { user } = useSupabase();

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-3xl font-heading font-bold">Profile</h1>
      <p className="text-muted-foreground mt-4">
        {user ? `Welcome, ${user.email}` : 'Please log in to view your profile.'}
      </p>
    </div>
  );
}