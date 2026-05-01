import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: 'left' | 'center';
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={align === 'center' ? 'text-center max-w-2xl mx-auto' : 'max-w-3xl'}
    >
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="section-title mt-3 text-foreground">{title}</h2>
      {description && (
        <p className="mt-4 text-base text-muted-foreground leading-relaxed max-w-2xl">
          {description}
        </p>
      )}
    </motion.div>
  );
}
