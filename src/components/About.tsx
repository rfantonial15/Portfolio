import { motion } from 'framer-motion';
import { Code, Heart, Rocket, Coffee } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { profile } from '../data/portfolioData';

const pillars = [
  { icon: Code, title: 'Craft First', body: 'Clean architecture, strong types, attention to UX micro-details.' },
  { icon: Rocket, title: 'Ship Fast', body: 'Prototype → iterate → deploy. I thrive in product-led teams.' },
  { icon: Heart, title: 'Care Deeply', body: 'Accessibility and polish are defaults, not afterthoughts.' },
  { icon: Coffee, title: 'Stay Curious', body: 'Always one repo, one coffee, one side-project in progress.' },
];

export default function About() {
  return (
    <section id="about" className="relative py-24 sm:py-28 border-t border-border">
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <SectionHeading
          eyebrow="01 — About"
          title={
            <>
              A developer who cares about the{' '}
              <span className="text-muted-foreground">whole craft</span>.
            </>
          }
        />

        <div className="mt-14 grid md:grid-cols-5 gap-10 items-start">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55 }}
            className="md:col-span-3 space-y-5 text-base md:text-lg text-foreground/80 leading-relaxed"
          >
            {profile.about.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="md:col-span-2 grid grid-cols-2 gap-3"
          >
            {pillars.map((p) => (
              <div key={p.title} className="card card-hover p-5">
                <div className="h-8 w-8 rounded-md border border-border bg-muted grid place-items-center">
                  <p.icon className="h-4 w-4 text-foreground/80" />
                </div>
                <div className="mt-3 font-medium text-foreground">{p.title}</div>
                <div className="mt-1 text-sm text-muted-foreground leading-snug">{p.body}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
