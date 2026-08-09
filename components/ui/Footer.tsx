'use client';
import Link from 'next/link';
import { Twitter, Linkedin, Github, Youtube, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/50 backdrop-blur-sm mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-sm">TC</div>
              <span className="font-heading font-bold text-lg">Tech Current</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Stay ahead. Stay current. Delivering the future of technology, today.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground"><Twitter className="h-4 w-4" /></Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground"><Linkedin className="h-4 w-4" /></Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground"><Github className="h-4 w-4" /></Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground"><Youtube className="h-4 w-4" /></Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground"><Mail className="h-4 w-4" /></Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4">Categories</h4>
            <ul className="space-y-2">
              {['News', 'AI', 'Programming', 'Cybersecurity', 'Startups'].map((c) => (
                <li key={c}>
                  <Link href={`/${c.toLowerCase()}`} className="text-sm text-muted-foreground hover:text-foreground">
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4">Company</h4>
            <ul className="space-y-2">
              {['About', 'Contact', 'Careers', 'Advertise'].map((c) => (
                <li key={c}>
                  <Link href={`/${c.toLowerCase()}`} className="text-sm text-muted-foreground hover:text-foreground">
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4">Resources</h4>
            <ul className="space-y-2">
              {['Newsletter', 'Tutorials', 'Reviews', 'Privacy Policy', 'Terms'].map((c) => (
                <li key={c}>
                  <Link href={`/${c.toLowerCase().replace(/ /g, '-')}`} className="text-sm text-muted-foreground hover:text-foreground">
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© 2026 Tech Current. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/sitemap.xml">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}