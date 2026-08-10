// components/ui/ReadingProgress.tsx
'use client';
import { motion, useScroll, useSpring } from 'framer-motion';

export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-16 left-0 right-0 h-1 bg-gradient-to-r from-primary via-gold to-primary origin-left z-50"
    />
  );
}