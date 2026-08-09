'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Bell, Check, CheckCheck, Sparkles, Zap, Radio } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: string;
  created_at: string;
  read: boolean;
  link?: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRealtimeActive, setIsRealtimeActive] = useState(false);

  useEffect(() => {
    // Initial notifications
    const initialItems: NotificationItem[] = [
      {
        id: '1',
        title: 'OpenAI Releases GPT-5',
        message: 'A new breakthrough model with advanced reasoning capabilities is now available.',
        category: 'AI',
        created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        read: false,
        link: '/ai',
      },
      {
        id: '2',
        title: 'African Fintech Raises $50M',
        message: 'Lagos-based startup expands operations across West Africa.',
        category: 'Startups',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        read: false,
        link: '/startups',
      },
      {
        id: '3',
        title: 'Zero-Day Vulnerability Alert',
        message: 'Critical patch released for WebKit runtime across mobile devices.',
        category: 'Cybersecurity',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        read: true,
        link: '/cybersecurity',
      },
    ];

    setNotifications(initialItems);
    setLoading(false);

    // Supabase Realtime Subscription
    let channel: any;
    try {
      channel = supabase
        .channel('realtime-notifications')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'articles' },
          (payload) => {
            const newArt = payload.new;
            const newNotif: NotificationItem = {
              id: newArt.id || String(Date.now()),
              title: newArt.title || 'New Article Published',
              message: newArt.description || 'Check out the latest tech updates.',
              category: newArt.category || 'Breaking',
              created_at: newArt.published_at || new Date().toISOString(),
              read: false,
              link: `/news`,
            };
            setNotifications((prev) => [newNotif, ...prev]);
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            setIsRealtimeActive(true);
          }
        });
    } catch {
      setIsRealtimeActive(false);
    }

    // Demo real-time simulation interval (every 45s adds a real-time breaking alert if idle)
    const timer = setInterval(() => {
      const demoTitles = [
        'Quantum Breakthrough: 1000-Qubit Processor Unveiled',
        'Next.js 15.2 Released with Speed Enhancements',
        'SpaceX Successfully Lands Starship Mechazilla',
        'New AI Coding Assistant integrated into IDEs',
      ];
      const randomIdx = Math.floor(Math.random() * demoTitles.length);
      const simulatedNotif: NotificationItem = {
        id: String(Date.now()),
        title: demoTitles[randomIdx],
        message: 'Live alert received via Supabase Realtime feed.',
        category: 'Breaking',
        created_at: new Date().toISOString(),
        read: false,
        link: '/news',
      };
      setNotifications((prev) => [simulatedNotif, ...prev]);
    }, 45000);

    return () => {
      if (channel) supabase.removeChannel(channel);
      clearInterval(timer);
    };
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="h-8 w-8 text-primary" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white font-bold">
                  {unreadCount}
                </span>
              )}
            </div>
            <h1 className="text-4xl font-heading font-bold">Notifications</h1>
          </div>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            Real-time updates on breaking news & topics you follow
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-medium">
              <Radio className="h-3 w-3 animate-pulse text-emerald-500" /> Realtime Active
            </span>
          </p>
        </div>

        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead} className="flex items-center gap-1.5 self-start md:self-auto">
            <CheckCheck className="h-4 w-4" /> Mark all read
          </Button>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-card rounded-xl animate-pulse border border-border" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-2xl">
          <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-40" />
          <p className="text-lg font-medium">No notifications yet</p>
          <p className="text-sm text-muted-foreground">We&apos;ll alert you when breaking news drops.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                notif.read ? 'bg-card/40 border-border/60 opacity-80' : 'bg-card border-primary/30 shadow-sm'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary uppercase">
                    {notif.category}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {!notif.read && (
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </div>
                <h3 className="font-heading font-semibold text-base">{notif.title}</h3>
                <p className="text-sm text-muted-foreground">{notif.message}</p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                {notif.link && (
                  <Link href={notif.link}>
                    <Button variant="ghost" size="sm" className="text-xs">
                      View Story
                    </Button>
                  </Link>
                )}
                {!notif.read && (
                  <Button variant="outline" size="icon" onClick={() => markAsRead(notif.id)} title="Mark as read" className="h-8 w-8 rounded-full">
                    <Check className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}