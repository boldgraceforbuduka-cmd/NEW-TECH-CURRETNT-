// components/ui/ThemeSwitcher.tsx
'use client';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Palette } from 'lucide-react';
import { Button } from './Button';

const themes = [
  {
    id: 'obsidian',
    name: 'Obsidian',
    description: 'Dark, powerful',
    icon: '🌑',
    colors: {
      bg: 'bg-[#080A0F]',
      primary: 'bg-[#3B82F6]',
      accent: 'bg-[#D4AF37]',
      text: 'text-[#F8FAFC]',
    },
  },
  {
    id: 'pearl',
    name: 'Pearl',
    description: 'Clean, light',
    icon: '☁️',
    colors: {
      bg: 'bg-[#F8FAFC]',
      primary: 'bg-[#2563EB]',
      accent: 'bg-[#C99A2E]',
      text: 'text-[#0F172A]',
    },
  },
  {
    id: 'rose',
    name: 'Rose',
    description: 'Creative, expressive',
    icon: '🌸',
    colors: {
      bg: 'bg-[#FFF7FA]',
      primary: 'bg-[#E85D9E]',
      accent: 'bg-[#E85D9E]',
      text: 'text-[#171219]',
    },
  },
  {
    id: 'elite',
    name: 'Élite',
    description: 'Luxury, sophisticated',
    icon: '🥂',
    colors: {
      bg: 'bg-[#171614]',
      primary: 'bg-[#C8A96B]',
      accent: 'bg-[#C8A96B]',
      text: 'text-[#F5F1E8]',
    },
  },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const current = themes.find((t) => t.id === theme) || themes[0];

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full hover:bg-muted/30 transition-colors relative group"
        aria-label="Open theme picker"
      >
        <Palette className="h-4 w-4" />
        <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary/60" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-64 sm:w-72 p-3 rounded-2xl bg-card border border-border/70 shadow-xl z-50"
          >
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-3">
              Appearance
            </p>
            <div className="grid grid-cols-2 gap-2">
              {themes.map((t) => {
                const isActive = t.id === theme;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id);
                      setIsOpen(false);
                    }}
                    className={`
                      relative p-3 rounded-xl text-left transition-all duration-200
                      ${isActive ? 'ring-2 ring-primary/60 bg-muted/30' : 'hover:bg-muted/20'}
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{t.icon}</span>
                      <div>
                        <p className="text-sm font-medium">{t.name}</p>
                        <p className="text-[10px] text-muted-foreground">{t.description}</p>
                      </div>
                      {isActive && (
                        <Check className="h-3.5 w-3.5 text-primary ml-auto" />
                      )}
                    </div>
                    {/* Mini colour preview */}
                    <div className="flex gap-0.5 mt-2">
                      <span className={`h-1 w-4 rounded-full ${t.colors.primary}`} />
                      <span className={`h-1 w-4 rounded-full ${t.colors.accent}`} />
                      <span className={`h-1 w-4 rounded-full ${t.colors.bg}`} />
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-muted-foreground text-center mt-3 border-t border-border/50 pt-2">
              Liquid Glass · 4 premium experiences
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}