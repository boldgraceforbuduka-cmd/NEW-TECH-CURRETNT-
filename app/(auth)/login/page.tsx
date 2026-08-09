'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setErrorMsg(error.message);
    } else {
      router.push('/my-feed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <form onSubmit={handleLogin} className="w-full max-w-md space-y-4 p-8 rounded-2xl bg-card border border-border shadow-xl">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">TC</div>
          <h1 className="text-2xl font-heading font-bold">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to your Tech Current account</p>
        </div>

        {errorMsg && (
          <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-lg border border-destructive/20 text-center">
            {errorMsg}
          </div>
        )}

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Email</label>
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Password</label>
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>

        <p className="text-sm text-muted-foreground text-center pt-2">
          Don&apos;t have an account? <Link href="/register" className="text-primary font-medium hover:underline">Sign up</Link>
        </p>
      </form>
    </div>
  );
}
