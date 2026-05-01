import { motion } from 'framer-motion';
import { BookOpen, GraduationCap } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { education } from '../data/portfolioData';

export default function Education() {
  return (
    <section id="education" className="relative py-24 sm:py-28 border-t border-border">
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <SectionHeading
          eyebrow="06 — Education"
          title={
            <>
              A foundation of{' '}
              <span className="text-muted-foreground">theory & hands-on work</span>.
            </>
          }
        />

        <div className="mt-12 grid lg:grid-cols-5 gap-4">
          {/* Main card */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3 card p-7 md:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="h-11 w-11 rounded-lg bg-foreground text-background grid place-items-center">
                <GraduationCap className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-6">
              <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {education.period}
              </div>
              <h3 className="mt-2 font-display text-2xl font-semibold text-foreground leading-snug">
                {education.degree}
              </h3>
              <p className="mt-1 text-foreground/80">{education.school}</p>
              <p className="text-sm text-muted-foreground">({education.shortSchool})</p>
            </div>

            <ul className="mt-6 space-y-2.5 text-sm text-foreground/80">
              {education.highlights.map((h) => (
                <li key={h} className="flex gap-2.5 leading-relaxed">
                  <span className="mt-2 h-1 w-1 rounded-full bg-muted-foreground flex-shrink-0" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Coursework */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="lg:col-span-2 card p-6"
          >
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              <BookOpen className="h-3 w-3" />
              Key Coursework
            </div>

            <div className="mt-4 space-y-1.5">
              {education.coursework.map((c, i) => (
                <div
                  key={c}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md border border-border bg-background text-sm text-foreground/80"
                >
                  <span className="text-xs tabular-nums text-muted-foreground font-medium">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
