'use client';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Bookmark, Sparkles } from 'lucide-react';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="animate-pulse space-y-4 max-w-2xl mx-auto">
          <div className="h-12 bg-muted rounded-xl" />
          <div className="h-40 bg-muted rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-heading font-bold mb-4">Not Logged In</h1>
        <p className="text-muted-foreground mb-6">Please log in to view your profile.</p>
        <Link href="/login">
          <Button>Sign In</Button>
        </Link>
      </div>
    );
  }

  const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-20 max-w-2xl"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
          {fullName[0].toUpperCase()}
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold">{fullName}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
        <div>
          <label className="text-sm text-muted-foreground">Email</label>
          <p className="text-lg font-medium">{user.email}</p>
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Joined</label>
          <p className="text-lg font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            {new Date(user.created_at).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
        {user.user_metadata?.role === 'admin' && (
          <div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
              Admin
            </span>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        <Link
          href="/bookmarks"
          className="flex items-center justify-center gap-2 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
        >
          <Bookmark className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Bookmarks</span>
        </Link>
        <Link
          href="/my-feed"
          className="flex items-center justify-center gap-2 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
        >
          <Sparkles className="h-4 w-4 text-gold" />
          <span className="text-sm font-medium">My Feed</span>
        </Link>
      </div>

      <div className="mt-6">
        <Button variant="destructive" onClick={handleLogout} className="w-full sm:w-auto">
          Logout
        </Button>
      </div>
    </motion.div>
  );
}