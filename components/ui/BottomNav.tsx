'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Home,
  Search,
  Bookmark,
  User,
  Sparkles,
  Layers,
  Globe,
} from 'lucide-react';

const items = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Explore', href: '/news', icon: Search },
  { label: 'Saved', href: '/bookmarks', icon: Bookmark },
  { label: 'Profile', href: '/profile', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed inset-x-4 bottom-4 z-40 sm:hidden">
      <div className="glass rounded-[28px] border-white/10 shadow-[0_24px_60px_rgba(13,21,47,0.18)] backdrop-blur-3xl px-3 py-3">
        <div className="flex items-center justify-between gap-2">
          {items.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link key={item.href} href={item.href} className="flex-1">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className={`w-full rounded-2xl py-3 px-2 flex flex-col items-center justify-center transition-all duration-200 ${
                    active
                      ? 'bg-white/10 text-primary shadow-glow'
                      : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                  }`}
                  aria-label={item.label}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-[11px] mt-1 font-medium">{item.label}</span>
                </motion.button>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
