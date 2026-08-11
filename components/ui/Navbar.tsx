// components/ui/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

import {
  Menu,
  X,
  Search,
  User,
  Bookmark,
  ChevronDown,
  Sparkles,
  Globe,
  Rocket,
  Smartphone,
  FlaskConical,
  GraduationCap,
  Layers,
} from 'lucide-react';

import { Button } from './Button';
import { useAuth } from '@/hooks/useAuth';
import { ThemeSwitcher } from './ThemeSwitcher';

/* =========================================================
   PRIMARY CATEGORY NAVIGATION
   ========================================================= */

const navItems = [
  {
    label: 'News',
    href: '/news',
    icon: Layers,
    dropdown: [
      { label: 'Breaking', href: '/news/breaking' },
      { label: 'Latest', href: '/news/latest' },
      { label: 'Trending', href: '/news/trending' },
    ],
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
    ],
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
    ],
  },
  {
    label: 'Gadgets',
    href: '/news?category=gadgets',
    icon: Smartphone,
    dropdown: [
      { label: 'Reviews', href: '/gadgets/reviews' },
      { label: 'Comparisons', href: '/gadgets/comparisons' },
      { label: 'Wearables', href: '/gadgets/wearables' },
    ],
  },
  {
    label: 'Science',
    href: '/news?category=science',
    icon: FlaskConical,
    dropdown: [
      { label: 'Space', href: '/science/space' },
      { label: 'Robotics', href: '/science/robotics' },
      { label: 'Quantum Computing', href: '/science/quantum' },
      { label: 'Biotechnology', href: '/science/biotech' },
    ],
  },
  {
    label: 'Africa',
    href: '/news?category=africa',
    icon: Globe,
    dropdown: [
      { label: 'Nigerian Tech', href: '/africa/nigeria' },
      { label: 'African Startups', href: '/africa/startups' },
      { label: 'Innovation', href: '/africa/innovation' },
      { label: 'Founders', href: '/africa/founders' },
      { label: 'Campus Innovation', href: '/africa/campus' },
    ],
  },
  {
    label: 'Explainers',
    href: '/explainers',
    icon: GraduationCap,
  },
];

/* =========================================================
   SECONDARY NAVIGATION
   ========================================================= */

const secondaryItems = [
  { label: 'Business & Tech', href: '/business' },
  { label: 'Cybersecurity', href: '/cybersecurity' },
  { label: 'Tools', href: '/tools' },
  { label: 'Tech Directory', href: '/directory' },
  { label: 'The Current', href: '/the-current' },
  { label: 'Intelligence', href: '/intelligence' },
  { label: 'Students', href: '/students' },
];

/* =========================================================
   USER NAVIGATION
   ========================================================= */

const userItems = [
  { label: 'Profile', href: '/profile' },
  { label: 'Bookmarks', href: '/bookmarks' },
  { label: 'My Feed', href: '/my-feed' },
  { label: 'Notifications', href: '/notifications' },
  { label: 'Newsletter', href: '/newsletter' },
  { label: 'Submit a Story', href: '/submit-story' },
];

/* =========================================================
   COMPANY NAVIGATION
   ========================================================= */

const companyItems = [
  { label: 'About', href: '/about' },
  { label: 'Our Team', href: '/team' },
  { label: 'Careers', href: '/careers' },
  { label: 'Advertise', href: '/advertise' },
  { label: 'Partner With Us', href: '/partner' },
  { label: 'Contact', href: '/contact' },
  { label: 'Press / Media Kit', href: '/press' },
];

/* =========================================================
   NAVBAR
   ========================================================= */

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const pathname = usePathname();
  const { user } = useAuth();

  /* -------------------------------------------------------
     SCROLL DETECTION
     ------------------------------------------------------- */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* -------------------------------------------------------
     CLOSE MOBILE MENU WHEN ROUTE CHANGES
     ------------------------------------------------------- */

  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  /* -------------------------------------------------------
     ACTIVE ROUTE HELPER
     ------------------------------------------------------- */

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  return (
    <header
      className={`
        fixed
        top-0
        left-0
        w-full
        z-50
        transition-all
        duration-300

        ${
          scrolled
            ? `
              bg-background/80
              backdrop-blur-xl
              border-b
              border-border/40
              shadow-sm
            `
            : `
              bg-transparent
              border-b
              border-transparent
            `
        }
      `}
    >
      {/* ===================================================
          MAIN NAVIGATION
          =================================================== */}

      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* LOGO */}
        <Link
          href="/"
          className="flex items-center gap-2 group flex-shrink-0"
          aria-label="Tech Current home"
        >
          <div
            className="
              w-8
              h-8
              rounded-lg
              bg-primary
              flex
              items-center
              justify-center
              text-primary-foreground
              font-bold
              text-sm
              transition-all
              duration-200
              group-hover:scale-105
              group-hover:shadow-glow-primary
            "
          >
            TC
          </div>
          <span className="font-heading font-bold text-lg hidden sm:block">
            Tech Current
          </span>
        </Link>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-1.5">
          {/* Search */}
          <Link href="/search" aria-label="Search Tech Current">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-primary/10 hover:text-primary"
            >
              <Search className="h-4 w-4" />
            </Button>
          </Link>

          {/* Theme Switcher */}
          <ThemeSwitcher />

          {/* Desktop Auth Actions */}
          <div className="hidden md:flex items-center gap-1.5">
            {user ? (
              <>
                <Link href="/bookmarks" aria-label="Bookmarks">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-primary/10 hover:text-primary"
                  >
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/profile" aria-label="Profile">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-primary/10 hover:text-primary"
                  >
                    <User className="h-4 w-4" />
                  </Button>
                </Link>
              </>
            ) : (
              <Link href="/login">
                <Button variant="default" size="sm" className="rounded-full px-5">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden rounded-full hover:bg-primary/10 hover:text-primary"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {/* ===================================================
          CATEGORY NAVIGATION
          =================================================== */}

      <nav
        aria-label="Technology categories"
        className="
          h-11
          border-t
          border-border/20
          border-b
          border-border/30
          bg-background/70
          backdrop-blur-xl
        "
      >
        <div
          className="
            container
            mx-auto
            px-4
            h-full
            flex
            items-center
            gap-1
            overflow-x-auto
            whitespace-nowrap
            no-scrollbar
          "
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <div
                key={item.href}
                className="relative flex-shrink-0 group"
                onMouseEnter={() => {
                  if (item.dropdown) setActiveDropdown(item.label);
                }}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={`
                    h-9
                    px-3
                    rounded-lg
                    flex
                    items-center
                    gap-1.5
                    text-sm
                    font-medium
                    transition-all
                    duration-200
                    ${
                      active
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'
                    }
                  `}
                >
                  {Icon && <Icon className="h-4 w-4 shrink-0" />}
                  <span>{item.label}</span>
                  {item.dropdown && (
                    <ChevronDown
                      className="
                        h-3.5
                        w-3.5
                        opacity-60
                        transition-transform
                        duration-200
                        group-hover:rotate-180
                      "
                    />
                  )}
                </Link>

                {item.dropdown && (
                  <AnimatePresence>
                    {activeDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="
                          absolute
                          top-full
                          left-0
                          mt-1
                          min-w-[210px]
                          rounded-xl
                          bg-card
                          border
                          border-border/60
                          shadow-premium
                          overflow-hidden
                          z-50
                        "
                      >
                        <div className="p-1.5">
                          {item.dropdown.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className="
                                block
                                px-3
                                py-2.5
                                rounded-lg
                                text-sm
                                text-muted-foreground
                                hover:text-foreground
                                hover:bg-muted
                                transition-colors
                              "
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            );
          })}

          {/* MORE – DESKTOP ONLY */}
          <div className="relative group flex-shrink-0 hidden lg:block">
            <button
              type="button"
              className="
                h-9
                px-3
                rounded-lg
                flex
                items-center
                gap-1.5
                text-sm
                font-medium
                text-muted-foreground
                hover:text-foreground
                hover:bg-muted/70
                transition-all
              "
            >
              <span>More</span>
              <ChevronDown
                className="
                  h-3.5
                  w-3.5
                  opacity-60
                  transition-transform
                  duration-200
                  group-hover:rotate-180
                "
              />
            </button>

            <div
              className="
                absolute
                top-full
                right-0
                mt-1
                min-w-[220px]
                rounded-xl
                bg-card
                border
                border-border/60
                shadow-premium
                overflow-hidden
                opacity-0
                invisible
                translate-y-1
                group-hover:opacity-100
                group-hover:visible
                group-hover:translate-y-0
                transition-all
                duration-200
                z-50
              "
            >
              <div className="p-1.5">
                {secondaryItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="
                      block
                      px-3
                      py-2.5
                      rounded-lg
                      text-sm
                      text-muted-foreground
                      hover:text-foreground
                      hover:bg-muted
                      transition-colors
                    "
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ===================================================
          MOBILE MENU
          =================================================== */}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="
              lg:hidden
              border-b
              border-border
              bg-background/95
              backdrop-blur-xl
              max-h-[80vh]
              overflow-y-auto
            "
          >
            <div className="container mx-auto px-4 py-4 space-y-1">
              {/* Primary Navigation */}
              <div className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <div key={item.href}>
                      <Link
                        href={item.href}
                        className={`
                          flex
                          items-center
                          gap-3
                          px-4
                          py-3
                          rounded-xl
                          text-sm
                          font-medium
                          transition-colors
                          ${
                            active
                              ? 'bg-primary/10 text-primary'
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                          }
                        `}
                        onClick={() => setIsOpen(false)}
                      >
                        {Icon && <Icon className="h-4 w-4" />}
                        <span>{item.label}</span>
                        {item.dropdown && (
                          <ChevronDown className="ml-auto h-4 w-4 opacity-60" />
                        )}
                      </Link>

                      {item.dropdown && (
                        <div className="ml-6 pl-4 border-l border-border space-y-1 mb-2">
                          {item.dropdown.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className="
                                block
                                px-4
                                py-2
                                rounded-lg
                                text-sm
                                text-muted-foreground
                                hover:text-foreground
                                hover:bg-muted
                                transition-colors
                              "
                              onClick={() => setIsOpen(false)}
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* More */}
              <div className="border-t border-border pt-3 mt-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-4 py-2">
                  More
                </p>
                {secondaryItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="
                      block
                      px-4
                      py-2.5
                      rounded-xl
                      text-sm
                      text-muted-foreground
                      hover:text-foreground
                      hover:bg-muted
                      transition-colors
                    "
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* User */}
              <div className="border-t border-border pt-3 mt-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-4 py-2">
                  Account
                </p>
                {user ? (
                  userItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="
                        block
                        px-4
                        py-2.5
                        rounded-xl
                        text-sm
                        text-muted-foreground
                        hover:text-foreground
                        hover:bg-muted
                        transition-colors
                      "
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))
                ) : (
                  <Link
                    href="/login"
                    className="
                      block
                      px-4
                      py-2.5
                      rounded-xl
                      text-sm
                      text-primary
                      hover:bg-primary/10
                      transition-colors
                    "
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                )}
              </div>

              {/* Company */}
              <div className="border-t border-border pt-3 mt-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-4 py-2">
                  Company
                </p>
                {companyItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="
                      block
                      px-4
                      py-2.5
                      rounded-xl
                      text-sm
                      text-muted-foreground
                      hover:text-foreground
                      hover:bg-muted
                      transition-colors
                    "
                    onClick={() => setIsOpen(false)}
                  >
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