'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Menu, X, Search, Sun, Moon, User, Bookmark,
  ChevronDown, Sparkles, Globe, Cpu, Rocket,
  Smartphone, FlaskConical, GraduationCap, Shield,
  Briefcase, Layers, Zap, Lightbulb, TrendingUp, Database
} from 'lucide-react';
import { Button } from './Button';

const navItems = [
  {
    label: 'News',
    href: '/news',
    icon: Layers,
    dropdown: [
      { label: 'Breaking', href: '/news/breaking' },
      { label: 'Latest', href: '/news/latest' },
      { label: 'Trending', href: '/news/trending' },
    ]
  },
  {
    label: 'AI',
    href: '/ai',
    icon: Sparkles,
    dropdown: [
      { label: 'AI News', href: '/ai' },
      { label: 'AI Tools', href: '/ai/tools' },
      { label: 'Model Releases', href: '/ai/models' },
      { label: 'Research', href: '/ai/research' },
      { label: 'AI Explained', href: '/ai/explained' },
    ]
  },
  {
    label: 'Startups',
    href: '/startups',
    icon: Rocket,
    dropdown: [
      { label: 'Startup News', href: '/startups' },
      { label: 'Funding', href: '/startups/funding' },
      { label: 'Founder Stories', href: '/startups/founders' },
      { label: 'African Startups', href: '/startups/africa' },
      { label: 'Startup Database', href: '/directory' },
    ]
  },
  {
    label: 'Gadgets',
    href: '/gadgets',
    icon: Smartphone,
    dropdown: [
      { label: 'Reviews', href: '/gadgets/reviews' },
      { label: 'Comparisons', href: '/gadgets/comparisons' },
      { label: 'Wearables', href: '/gadgets/wearables' },
    ]
  },
  {
    label: 'Science',
    href: '/science',
    icon: FlaskConical,
    dropdown: [
      { label: 'Space', href: '/science/space' },
      { label: 'Robotics', href: '/science/robotics' },
      { label: 'Quantum Computing', href: '/science/quantum' },
      { label: 'Biotechnology', href: '/science/biotech' },
    ]
  },
  {
    label: 'Africa',
    href: '/africa',
    icon: Globe,
    dropdown: [
      { label: 'Nigerian Tech', href: '/africa/nigeria' },
      { label: 'African Startups', href: '/africa/startups' },
      { label: 'Innovation', href: '/africa/innovation' },
      { label: 'Founders', href: '/africa/founders' },
      { label: 'Campus Innovation', href: '/africa/campus' },
    ]
  },
  {
    label: 'Explainers',
    href: '/explainers',
    icon: GraduationCap,
  },
];

const secondaryItems = [
  { label: 'Business & Tech', href: '/business' },
  { label: 'Cybersecurity', href: '/cybersecurity' },
  { label: 'Tools', href: '/tools' },
  { label: 'Tech Directory', href: '/directory' },
  { label: 'The Current', href: '/the-current' },
  { label: 'Intelligence', href: '/intelligence' },
  { label: 'Students', href: '/students' },
];

const userItems = [
  { label: 'Profile', href: '/profile' },
  { label: 'Bookmarks', href: '/bookmarks' },
  { label: 'My Feed', href: '/my-feed' },
  { label: 'Notifications', href: '/notifications' },
  { label: 'Newsletter', href: '/newsletter' },
  { label: 'Submit a Story', href: '/submit-story' },
];

const companyItems = [
  { label: 'About', href: '/about' },
  { label: 'Our Team', href: '/team' },
  { label: 'Careers', href: '/careers' },
  { label: 'Advertise', href: '/advertise' },
  { label: 'Partner With Us', href: '/partner' },
  { label: 'Contact', href: '/contact' },
  { label: 'Press / Media Kit', href: '/press' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-background/80 backdrop-blur-xl border-b border-border' : 'bg-transparent'}`}>
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-sm transition-transform group-hover:scale-110">TC</div>
          <span className="font-heading font-bold text-lg hidden sm:block">Tech Current</span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <div
              key={item.href}
              className="relative group"
              onMouseEnter={() => setActiveDropdown(item.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${pathname === item.href || pathname?.startsWith(item.href + '/') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
              >
                {item.icon && <item.icon className="h-3.5 w-3.5" />}
                {item.label}
                {item.dropdown && <ChevronDown className="h-3 w-3" />}
              </Link>
              {item.dropdown && (
                <AnimatePresence>
                  {activeDropdown === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-1 min-w-[200px] bg-card border border-border rounded-xl shadow-xl overflow-hidden"
                    >
                      {item.dropdown.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden lg:block relative">
            <div className="relative group">
              <button className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all flex items-center gap-1">
                More <ChevronDown className="h-3 w-3" />
              </button>
              <div className="absolute right-0 top-full mt-1 min-w-[220px] bg-card border border-border rounded-xl shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="p-2">
                  {secondaryItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Link href="/search">
            <Button variant="ghost" size="icon" className="rounded-full"><Search className="h-4 w-4" /></Button>
          </Link>

          {mounted && (
            <Button variant="ghost" size="icon" className="rounded-full hidden sm:flex" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          )}

          <div className="hidden md:flex items-center gap-2">
            <Link href="/bookmarks"><Button variant="ghost" size="icon" className="rounded-full"><Bookmark className="h-4 w-4" /></Button></Link>
            <Link href="/profile"><Button variant="ghost" size="icon" className="rounded-full"><User className="h-4 w-4" /></Button></Link>
          </div>

          <Button variant="ghost" size="icon" className="lg:hidden rounded-full" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-b border-border bg-background/95 backdrop-blur-xl max-h-[80vh] overflow-y-auto"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <div key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    {item.label}
                  </Link>
                  {item.dropdown && (
                    <div className="ml-6 space-y-1 border-l border-border pl-3">
                      {item.dropdown.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className="block px-4 py-1.5 text-sm text-muted-foreground hover:text-foreground"
                          onClick={() => setIsOpen(false)}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="border-t border-border pt-2 mt-2">
                <p className="text-xs font-semibold text-muted-foreground px-4 py-1">More</p>
                {secondaryItems.map((item) => (
                  <Link key={item.href} href={item.href} className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg" onClick={() => setIsOpen(false)}>
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="border-t border-border pt-2 mt-2">
                <p className="text-xs font-semibold text-muted-foreground px-4 py-1">User</p>
                {userItems.map((item) => (
                  <Link key={item.href} href={item.href} className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg" onClick={() => setIsOpen(false)}>
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="border-t border-border pt-2 mt-2">
                <p className="text-xs font-semibold text-muted-foreground px-4 py-1">Company</p>
                {companyItems.map((item) => (
                  <Link key={item.href} href={item.href} className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg" onClick={() => setIsOpen(false)}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}