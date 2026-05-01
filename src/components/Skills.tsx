import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';
import { skillGroups, softSkills } from '../data/portfolioData';

export default function Skills() {
  return (
    <section id="skills" className="relative py-24 sm:py-28 border-t border-border">
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <SectionHeading
          eyebrow="05 — Skills"
          title={
            <>
              The{' '}
              <span className="text-muted-foreground">toolkit</span>{' '}
              I reach for.
            </>
          }
          description="A pragmatic full-stack toolbox I've shipped real products with — not just a buzzword cloud."
        />

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skillGroups.map((group, gi) => (
            <motion.div
              key={group.name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: gi * 0.05 }}
              className="card p-6"
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 grid place-items-center rounded-md border border-border bg-muted">
                  <group.icon className="h-4 w-4 text-foreground/80" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground">
                  {group.name}
                </h3>
              </div>

              <div className="mt-5 flex flex-wrap gap-1.5">
                {group.skills.map((skill) => (
                  <span key={skill} className="chip">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Soft skills */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-6 card p-6"
        >
          <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Beyond the code
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {softSkills.map((s) => (
              <div
                key={s.label}
                className="inline-flex items-center gap-2 h-8 px-3 rounded-md border border-border bg-background text-sm text-foreground/80"
              >
                <s.icon className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
