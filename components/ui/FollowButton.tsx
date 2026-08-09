'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
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
    // Fetch current preferences
    fetch('/api/preferences')
      .then(res => res.json())
      .then(prefs => {
        setIsFollowing(prefs.followed_topics?.includes(topic) || false);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user, topic]);

  const toggle = async () => {
    if (!user) {
      toast.error('Please log in to follow topics.');
      return;
    }
    setLoading(true);
    try {
      // Fetch current preferences
      const res = await fetch('/api/preferences');
      const prefs = await res.json();
      const followed = prefs.followed_topics || [];
      const newFollowed = isFollowing
        ? followed.filter((t: string) => t !== topic)
        : [...followed, topic];

      const update = await fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followed_topics: newFollowed, followed_sources: [] }),
      });
      if (update.ok) {
        setIsFollowing(!isFollowing);
        toast.success(isFollowing ? `Unfollowed ${topic}` : `Following ${topic}`);
      } else {
        toast.error('Failed to update preferences.');
      }
    } catch {
      toast.error('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={isFollowing ? 'outline' : 'default'}
      size="sm"
      onClick={toggle}
      disabled={loading}
      className="rounded-full text-xs h-7 px-3"
    >
      {loading ? '...' : isFollowing ? 'Following' : 'Follow'}
    </Button>
  );
}