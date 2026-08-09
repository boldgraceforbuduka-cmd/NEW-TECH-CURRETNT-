// app/admin/layout.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/hooks/useSupabase';
import { useEffect } from 'react';
import { Sidebar } from '@/components/admin/Slidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useSupabase();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (user.user_metadata?.role !== 'admin') {
        router.push('/profile');
      }
    }
  }, [user, loading, router]);

  if (loading || !user || user.user_metadata?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}