// app/layout.tsx
'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from 'sonner';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-body antialiased">
        <Providers>
          <Navbar />
          <AnimatePresence mode="wait">
            <motion.main
              key={pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="min-h-screen pt-16"
            >
              {children}
            </motion.main>
          </AnimatePresence>
          <Footer />
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}