import { motion } from 'framer-motion';
import { Briefcase, MapPin } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { experiences } from '../data/portfolioData';

export default function Experience() {
  return (
    <section id="experience" className="relative py-24 sm:py-28 border-t border-border">
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <SectionHeading
          eyebrow="02 — Experience"
          title={
            <>
              Where I&apos;ve been putting{' '}
              <span className="text-muted-foreground">code to work</span>.
            </>
          }
        />

        <div className="mt-14 relative">
          {/* vertical rail */}
          <span aria-hidden className="absolute left-3 top-2 bottom-2 w-px bg-border" />

          <div className="space-y-6">
            {experiences.map((exp, idx) => (
              <motion.div
                key={exp.role}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="relative pl-10"
              >
                {/* dot */}
                <span
                  aria-hidden
                  className="absolute left-[9px] top-6 h-1.5 w-1.5 rounded-full bg-foreground ring-4 ring-background"
                />

                <div className="card card-hover p-6 md:p-7">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5 font-medium uppercase tracking-[0.12em]">
                      <Briefcase className="h-3 w-3" />
                      {exp.period}
                    </span>
                    <span className="text-border">·</span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {exp.location}
                    </span>
                  </div>

                  <h3 className="mt-2.5 text-lg font-semibold text-foreground">{exp.role}</h3>
                  <div className="mt-0.5 text-sm text-muted-foreground">{exp.org}</div>

                  <ul className="mt-4 space-y-2 text-sm text-foreground/80">
                    {exp.bullets.map((b) => (
                      <li key={b} className="flex gap-2.5 leading-relaxed">
                        <span className="mt-2 h-1 w-1 rounded-full bg-muted-foreground flex-shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {exp.stack.map((s) => (
                      <span key={s} className="chip">{s}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
