// components/sections/NewsletterSignup.tsx
'use client';
import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';
import { Mail } from 'lucide-react';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        toast.success('Subscribed successfully!');
        setEmail('');
      } else {
        toast.error('Failed to subscribe.');
      }
    } catch {
      toast.error('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 40 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="container mx-auto px-4 py-16"
    >
      <div className="relative rounded-2xl overflow-hidden bg-card border border-border/60 p-8 md:p-12 shadow-card">
        <div className="absolute inset-0 gradient-tech pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary mb-4">
            <Mail className="h-4 w-4" />
            <span>Stay in the loop</span>
          </div>
          <h3 className="text-3xl font-heading font-bold">Get the weekly newsletter</h3>
          <p className="text-muted-foreground mt-2">
            Subscribe to get the top tech stories, AI breakthroughs, and startup insights every Friday.
          </p>
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 bg-background/50 border-border/60"
            />
            <Button type="submit" disabled={loading}>
              {loading ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-3">No spam, unsubscribe anytime.</p>
        </div>
      </div>
    </motion.section>
  );
}