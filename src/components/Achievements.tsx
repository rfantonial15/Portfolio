import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';
import { achievements } from '../data/portfolioData';

export default function Achievements() {
  return (
    <section id="achievements" className="relative py-24 sm:py-28 border-t border-border">
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <SectionHeading
          eyebrow="04 — Awards"
          title={
            <>
              Where the work has been{' '}
              <span className="text-muted-foreground">recognized</span>.
            </>
          }
          description="Most of these recognitions came from work on AIDA, my capstone project."
        />

        <div className="mt-14 relative">
          {/* vertical rail */}
          <span aria-hidden className="absolute left-3 top-2 bottom-2 w-px bg-border" />

          <div className="space-y-4">
            {achievements.map((a, idx) => (
              <motion.div
                key={`${a.title}-${a.date}`}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: idx * 0.05 }}
                className="relative pl-10"
              >
                {/* dot */}
                <span
                  aria-hidden
                  className="absolute left-[9px] top-6 h-1.5 w-1.5 rounded-full bg-foreground ring-4 ring-background"
                />

                <div className="card card-hover p-5 md:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                        {a.date}
                      </div>
                      <h3 className="mt-2 text-base md:text-lg font-semibold text-foreground leading-snug">
                        {a.title}
                      </h3>
                      <div className="mt-1 text-sm text-muted-foreground">{a.rank}</div>
                    </div>
                  </div>

                  {a.project && (
                    <div className="mt-4 pt-4 border-t border-border/60 text-xs text-muted-foreground">
                      With <span className="text-foreground/90 font-medium">{a.project}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
