// components/sections/Hero.tsx
'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';
import { AnimatedStats } from '@/components/ui/AnimatedStats'; // ✅ import

export function Hero() {
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email.');
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
        setIsNewsletterOpen(false);
      } else {
        toast.error('Failed to subscribe.');
      }
    } catch {
      toast.error('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Floating particles
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100 - 50,
    y: Math.random() * 100 - 50,
    size: Math.random() * 4 + 2,
    duration: 6 + Math.random() * 4,
  }));

  return (
    <>
      <section className="relative min-h-[80vh] sm:min-h-[90vh] flex items-center overflow-hidden px-4">
        {/* Gradient orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/10 blur-3xl animate-pulse" />
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-gold/10 blur-3xl animate-pulse animation-delay-2000" />
          <div className="absolute bottom-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-blue-400/10 blur-3xl animate-pulse animation-delay-4000" />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full bg-primary/20"
              style={{
                width: p.size,
                height: p.size,
                left: `calc(50% + ${p.x}%)`,
                top: `calc(50% + ${p.y}%)`,
              }}
              animate={{
                x: [0, Math.random() * 60 - 30, 0],
                y: [0, Math.random() * 60 - 30, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        <div className="container mx-auto relative z-10 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-extrabold tracking-tight leading-tight">
              Stay Ahead.<br />
              <span className="text-gradient">Stay Current.</span>
            </h1>

            <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2">
              Tech Current delivers the latest technology news, AI breakthroughs, programming tutorials,
              and startup stories in a beautiful, fast, and modern experience.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <Link href="/news">
                <Button size="lg" className="rounded-full px-8 group">
                  Explore Stories
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8"
                onClick={() => setIsNewsletterOpen(true)}
              >
                Subscribe
              </Button>
            </div>

            {/* ✅ Animated Stats */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              <AnimatedStats value={10000} label="Articles" />
              <AnimatedStats value={25000} label="Subscribers" />
              <AnimatedStats value={500} label="Startups" suffix="" />
              <AnimatedStats value={24} label="Daily Updates" suffix="/7" prefix="" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Modal */}
      {isNewsletterOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setIsNewsletterOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-card border border-border rounded-2xl p-6 sm:p-8 max-w-md w-full mx-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsNewsletterOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-2xl font-heading font-bold mb-2">Subscribe</h2>
            <p className="text-muted-foreground mb-6">Get the latest tech news every Friday.</p>
            <form onSubmit={handleSubscribe} className="space-y-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-4 text-center">No spam, unsubscribe anytime.</p>
          </motion.div>
        </div>
      )}
    </>
  );
}