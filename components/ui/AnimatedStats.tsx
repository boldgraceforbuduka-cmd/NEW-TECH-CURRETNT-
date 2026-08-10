// components/ui/AnimatedStats.tsx
'use client';
import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface AnimatedStatsProps {
  value: number;
  label: string;
  duration?: number; // seconds
  suffix?: string;
  prefix?: string;
}

export function AnimatedStats({
  value,
  label,
  duration = 2,
  suffix = '+',
  prefix = '',
}: AnimatedStatsProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const increment = value / (duration * 60);
      const timer = setInterval(() => {
        start += increment;
        if (start >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, value, duration]);

  // Format number with commas
  const formatted = count.toLocaleString();

  return (
    <div ref={ref} className="text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-2xl sm:text-3xl font-bold text-gradient"
      >
        {prefix}{formatted}{suffix}
      </motion.div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}