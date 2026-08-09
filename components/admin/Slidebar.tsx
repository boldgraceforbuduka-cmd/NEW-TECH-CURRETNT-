// components/admin/Sidebar.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, FolderTree, MessageSquare, Users, Mail, BarChart3, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const items = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Articles', href: '/admin/articles', icon: FileText },
  { label: 'Categories', href: '/admin/categories', icon: FolderTree },
  { label: 'Comments', href: '/admin/comments', icon: MessageSquare },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Newsletter', href: '/admin/newsletter', icon: Mail },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out');
    router.push('/login');
  };

  return (
    <aside className="w-64 border-r border-border bg-card h-screen sticky top-0 overflow-y-auto p-4 flex flex-col">
      <div className="mb-6 flex items-center gap-2">
        <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-sm">TC</span>
        <span className="font-heading font-bold">Tech Current</span>
      </div>
      <nav className="space-y-1 flex-1">
        {items.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors mt-4"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </aside>
  );
}