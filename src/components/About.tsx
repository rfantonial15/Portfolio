import { motion } from 'framer-motion';
import {
  Briefcase,
  Compass,
  Gauge,
  GitBranch,
  Layers3,
  MapPin,
  Sparkles,
} from 'lucide-react';
import SectionHeading from './SectionHeading';
import { profile } from '../data/portfolioData';

const principles = [
  {
    icon: Layers3,
    title: 'End-to-end ownership',
    body: 'I take features from data model and API contract to the deployed UI — no hand-offs, no broken seams.',
  },
  {
    icon: GitBranch,
    title: 'Architecture that scales',
    body: 'Strong types, clear module boundaries, and the right abstraction at the right time — never one layer earlier.',
  },
  {
    icon: Sparkles,
    title: 'UX details that compound',
    body: 'Loading states, empty states, motion, and micro-interactions are part of the spec — not polish I bolt on at the end.',
  },
  {
    icon: Gauge,
    title: 'Bias toward shipping',
    body: 'Tight feedback loops, small reversible changes, and a real environment to validate against — quality emerges from iteration, not committee.',
  },
];

const ataglance = [
  {
    icon: Briefcase,
    label: 'Currently',
    value: 'Co-founder & Full Stack at AIDA',
  },
  {
    icon: MapPin,
    label: 'Based in',
    value: 'Cagayan de Oro, Philippines',
  },
  {
    icon: Compass,
    label: 'Focus',
    value: 'Product UIs · Real-time systems · Civic tech',
  },
];

export default function About() {
  return (
    <section id="about" className="relative py-24 sm:py-28 border-t border-border">
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <SectionHeading
          eyebrow="01 — About"
          title={
            <>
              Engineering polish into{' '}
              <span className="text-muted-foreground">every layer of the product</span>.
            </>
          }
        />

        <div className="mt-14 grid lg:grid-cols-5 gap-10 lg:gap-14 items-start">
          {/* Bio prose */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-3 space-y-5 text-base md:text-[1.0625rem] text-foreground/85 leading-[1.75]"
          >
            {profile.about.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </motion.div>

          {/* At a glance */}
          <motion.aside
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="lg:col-span-2 lg:sticky lg:top-24"
          >
            <div className="card p-6">
              <div className="eyebrow">At a glance</div>
              <dl className="mt-5 space-y-5">
                {ataglance.map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <span className="grid place-items-center h-9 w-9 rounded-lg border border-border bg-muted/60 text-foreground/70 shrink-0">
                      <item.icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                        {item.label}
                      </dt>
                      <dd className="mt-0.5 text-sm font-medium text-foreground leading-snug">
                        {item.value}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>

              <div className="mt-6 pt-5 border-t border-border/60">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-60" />
                    <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    Open to new opportunities
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  Full-time, contract, or co-founder roles where craft and ownership matter.
                </p>
              </div>
            </div>
          </motion.aside>
        </div>

        {/* Principles */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, delay: 0.15 }}
          className="mt-16 lg:mt-20"
        >
          <div className="eyebrow">How I work</div>
          <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {principles.map((p) => (
              <div key={p.title} className="card card-hover p-5 group">
                <div className="h-9 w-9 rounded-lg border border-border bg-muted/60 grid place-items-center group-hover:border-foreground/20 transition-colors">
                  <p.icon className="h-4 w-4 text-foreground/80" />
                </div>
                <div className="mt-4 text-sm font-semibold text-foreground">
                  {p.title}
                </div>
                <div className="mt-1.5 text-[13px] text-muted-foreground leading-relaxed">
                  {p.body}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
