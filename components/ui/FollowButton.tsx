'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Button } from './Button';

interface FollowButtonProps {
  topic: string;
}

export function FollowButton({ topic }: FollowButtonProps) {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const checkFollow = async () => {
      try {
        const { data, error } = await supabase
          .from('follows')
          .select('topic')
          .eq('user_id', user.id)
          .eq('topic', topic);
        if (error) throw error;
        setIsFollowing((data ?? []).length > 0);
      } catch (error) {
        console.error('Failed to check follow:', error);
      } finally {
        setLoading(false);
      }
    };
    checkFollow();
  }, [user, topic]);

  const toggle = async () => {
    if (!user) {
      toast.error('Please log in to follow topics.');
      return;
    }
    setLoading(true);
    try {
      console.log('🔍 Toggling follow for topic:', topic);
      console.log('👤 User ID:', user.id);

      if (isFollowing) {
        // Unfollow
        const { data, error } = await supabase
          .from('follows')
          .delete()
          .eq('user_id', user.id)
          .eq('topic', topic);
        if (error) throw error;
        setIsFollowing(false);
        toast.success(`Unfollowed ${topic}`);
        console.log('✅ Unfollowed:', topic);
      } else {
        // Follow
        const { data, error } = await supabase
          .from('follows')
          .insert({ user_id: user.id, topic })
          .select();
        if (error) throw error;
        setIsFollowing(true);
        toast.success(`Following ${topic}`);
        console.log('✅ Followed:', topic, data);
      }
    } catch (error: any) {
      console.error('❌ Follow toggle error:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      toast.error('Failed to update follow');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={isFollowing ? 'outline' : 'default'}
      size="sm"
      onClick={toggle}
      disabled={loading || !user}
      className="rounded-full text-xs h-7 px-3"
    >
      {loading ? '...' : isFollowing ? 'Following' : 'Follow'}
    </Button>
  );
}