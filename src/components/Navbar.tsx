import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Menu, X } from 'lucide-react';
import { navLinks, profile } from '../data/portfolioData';
import ThemeToggle from './ThemeToggle';
import type { Theme } from '../hooks/useTheme';
import { cn } from '../lib/utils';

interface NavbarProps {
  active: string;
  theme: Theme;
  onToggleTheme: () => void;
}

export default function Navbar({ active, theme, onToggleTheme }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-40">
        <div className="px-4 sm:px-6 pt-3">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={cn(
              'mx-auto max-w-6xl h-14 flex items-center justify-between px-3 sm:px-4 rounded-xl transition-all duration-300',
              scrolled ? 'nav-glass shadow-subtle' : 'bg-transparent border border-transparent',
            )}
          >
            {/* Logo */}
            <button
              onClick={() => handleNav('home')}
              className="group flex items-center gap-2 pr-2"
            >
              <span className="grid place-items-center h-9 w-9 rounded-lg bg-foreground/[0.04] dark:bg-white ring-1 ring-border dark:ring-white/40 transition-colors">
                <img
                  src="/logo.png"
                  alt="RF Logo"
                  className="h-7 w-7 object-contain"
                />
              </span>
              <span className="hidden sm:block text-sm font-medium">
                {profile.firstName} Fantonial
              </span>
            </button>

            {/* Desktop links */}
            <nav className="hidden md:flex items-center gap-0.5">
              {navLinks.map((link) => {
                const isActive = active === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNav(link.id)}
                    className={cn(
                      'relative h-9 px-3 rounded-md text-sm font-medium transition-colors',
                      isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    <span className="relative z-10">{link.label}</span>
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-md bg-muted"
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1.5">
              <ThemeToggle theme={theme} onToggle={onToggleTheme} />

              <a
                href={profile.resumeUrl}
                download
                className="hidden sm:inline-flex btn-primary h-9 px-3 text-sm"
              >
                <Download className="h-3.5 w-3.5" />
                Resume
              </a>

              <button
                onClick={() => setMobileOpen((o) => !o)}
                className="md:hidden h-9 w-9 grid place-items-center rounded-md hover:bg-muted transition-colors"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="fixed top-20 inset-x-4 z-40 md:hidden"
          >
            <div className="nav-glass rounded-xl p-2 flex flex-col shadow-soft">
              {navLinks.map((link) => {
                const isActive = active === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNav(link.id)}
                    className={cn(
                      'text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                      isActive ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted/60',
                    )}
                  >
                    {link.label}
                  </button>
                );
              })}
              <div className="h-px w-full bg-border my-2" />
              <a
                href={profile.resumeUrl}
                download
                className="btn-primary h-10 text-sm mx-1 mb-1"
              >
                <Download className="h-4 w-4" />
                Download Resume
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
