import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Sparkles, X } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { projects, type Project } from '../data/portfolioData';
import { cn } from '../lib/utils';

export default function Projects() {
  const [active, setActive] = useState<Project | null>(null);
  const [filter, setFilter] = useState<string>('All');

  const tags = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return ['All', ...Array.from(set)];
  }, []);

  const filtered = filter === 'All' ? projects : projects.filter((p) => p.tags.includes(filter));

  return (
    <section id="projects" className="relative py-24 sm:py-28 border-t border-border">
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="03 — Projects"
            title={
              <>
                Selected work I&apos;m{' '}
                <span className="text-muted-foreground">proud of</span>.
              </>
            }
          />
          <div className="flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={cn(
                  'h-8 px-3 rounded-md text-xs font-medium transition-colors border',
                  filter === t
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-transparent text-muted-foreground border-border hover:text-foreground hover:bg-muted',
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <motion.button
                layout
                key={p.slug}
                onClick={() => setActive(p)}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: (i % 6) * 0.05 }}
                className="group text-left card card-hover p-6 min-h-[260px] flex flex-col hover:shadow-soft"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    {p.year}
                  </span>
                </div>

                <h3 className="mt-3 font-display text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {p.name}
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                  {p.tagline}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.stack.slice(0, 4).map((s) => (
                    <span key={s} className="chip">{s}</span>
                  ))}
                </div>

                <div className="mt-auto pt-5 flex items-center justify-between text-sm border-t border-border/60">
                  <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                    View case study
                  </span>
                  <span className="h-8 w-8 grid place-items-center rounded-md border border-border text-muted-foreground group-hover:text-foreground group-hover:border-foreground/30 transition-colors">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center p-4"
            onClick={() => setActive(null)}
          >
            <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              className="relative card max-w-2xl w-full max-h-[85vh] overflow-y-auto p-7 sm:p-8 shadow-elevated"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    {active.year}
                  </span>
                  <h3 className="mt-1.5 font-display text-2xl sm:text-3xl font-semibold text-foreground">
                    {active.name}
                  </h3>
                  <p className="mt-2 text-muted-foreground">{active.tagline}</p>
                </div>
                <button
                  onClick={() => setActive(null)}
                  className="btn-ghost h-8 w-8 p-0"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <p className="mt-6 text-foreground/80 leading-relaxed">{active.description}</p>

              <div className="mt-6">
                <div className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
                  Highlights
                </div>
                <ul className="mt-3 space-y-2 text-sm text-foreground/80">
                  {active.highlights.map((h) => (
                    <li key={h} className="flex gap-2.5">
                      <span className="mt-2 h-1 w-1 rounded-full bg-muted-foreground flex-shrink-0" />
                      <span className="leading-relaxed">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <div className="text-sm font-medium text-foreground">Stack</div>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {active.stack.map((s) => (
                    <span key={s} className="chip">{s}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
