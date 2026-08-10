// app/providers.tsx
'use client';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import Lenis from 'lenis';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [lenis] = useState(() => {
    if (typeof window === 'undefined') return null;
    const l = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });
    function raf(time: number) {
      l.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return l;
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="data-theme"  // ✅ uses data-theme on html
        defaultTheme="dark"
        enableSystem={true}
        themes={['light', 'dark', 'nord', 'dracula', 'sepia']}
        enableColorScheme={false} // disables automatic color-scheme meta tag
      >
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}