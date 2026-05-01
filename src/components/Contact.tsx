import { motion } from 'framer-motion';
import { ArrowUpRight, Check, Copy, Mail, MapPin } from 'lucide-react';
import { useState } from 'react';
import SectionHeading from './SectionHeading';
import { profile, socials } from '../data/portfolioData';

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* noop */
    }
  };

  return (
    <section id="contact" className="relative py-24 sm:py-28 border-t border-border">
      <div className="max-w-4xl mx-auto px-5 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55 }}
          className="card p-8 sm:p-12 text-center"
        >
          <SectionHeading
            eyebrow="07 — Contact"
            align="center"
            title={
              <>
                Let&apos;s build something{' '}
                <span className="text-muted-foreground">exceptional</span>.
              </>
            }
            description="Have a role, a project, or just want to say hi? My inbox is open — I reply fast."
          />

          <div className="mt-9 flex flex-wrap items-center justify-center gap-2.5">
            <a href={`mailto:${profile.email}`} className="btn-primary group">
              <Mail className="h-4 w-4" />
              {profile.email}
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <button onClick={copyEmail} className="btn-secondary">
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy email
                </>
              )}
            </button>
          </div>

          <div className="mt-5 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {profile.location}
          </div>

          <div className="mt-7 flex items-center justify-center gap-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="h-11 w-11 grid place-items-center rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <s.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
