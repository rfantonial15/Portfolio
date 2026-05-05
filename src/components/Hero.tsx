import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download, MapPin, Mail } from 'lucide-react';
import { profile, socials, stats } from '../data/portfolioData';
import { cn } from '../lib/utils';

// Loader chain for the avatar.
//   1. /profile.png   → transparent cutout, wrapped in a theme-adaptive backdrop
//   2. /profile.jpg   → original photo, shown as-is in a neutral ring
//   3. initials       → fallback if neither image exists
type AvatarSource = 'png' | 'jpg' | 'none';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero() {
  // Try png (transparent) first; if it 404s, fall back to jpg; then to initials.
  const [avatarSrc, setAvatarSrc] = useState<AvatarSource>('png');
  const initials = profile.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('');

  const handleAvatarError = () => {
    setAvatarSrc((s) => (s === 'png' ? 'jpg' : 'none'));
  };

  const isTransparent = avatarSrc === 'png';
  const imgUrl = avatarSrc === 'png' ? '/profile.png' : '/profile.jpg';

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-[100svh] flex items-center pt-28 pb-20"
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-5xl mx-auto px-5 sm:px-6 w-full"
      >
        {/*
          Avatar — 2x2 portrait frame.
          • /public/profile.png (transparent cutout) → layered theme-adaptive backdrop
            (warm golden hour in light mode, moonlit night in dark mode).
          • /public/profile.jpg → fallback, shown as-is.
        */}
        <motion.div variants={item} className="mb-7">
          <div
            className={cn(
              // True 2x2 portrait frame — sized like a 2"x2" ID photo.
              'relative aspect-square h-40 w-40 sm:h-48 sm:w-48 md:h-52 md:w-52',
              'rounded-2xl overflow-hidden isolate',
              'ring-1 ring-border shadow-elevated transition-colors duration-500',
              !isTransparent && 'bg-muted',
            )}
          >
            {/* Layered theme-adaptive backdrop (only behind the cutout PNG) */}
            {isTransparent && (
              <>
                {/* 1. Base sky gradient */}
                <span
                  aria-hidden
                  className="absolute inset-0 -z-10 bg-gradient-to-b from-amber-50 via-orange-100 to-rose-100 dark:from-indigo-950 dark:via-[#0e1233] dark:to-[#070a1f]"
                />
                {/* 2. Sun (light) / Moon (dark) glow at top-right */}
                <span
                  aria-hidden
                  className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_18%,rgba(255,213,128,0.85),transparent_55%)] dark:bg-[radial-gradient(circle_at_78%_18%,rgba(186,210,255,0.22),transparent_55%)]"
                />
                {/* 3. Soft side-light from top-left to add dimension */}
                <span
                  aria-hidden
                  className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_25%,rgba(255,255,255,0.45),transparent_50%)] dark:bg-[radial-gradient(circle_at_15%_25%,rgba(120,140,255,0.08),transparent_55%)]"
                />
                {/* 4. Bottom vignette to ground the subject */}
                <span
                  aria-hidden
                  className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_115%,rgba(0,0,0,0.28),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_50%_115%,rgba(0,0,0,0.65),transparent_60%)]"
                />
              </>
            )}

            {avatarSrc === 'none' ? (
              <span className="absolute inset-0 grid place-items-center font-display text-4xl sm:text-5xl font-semibold text-muted-foreground">
                {initials}
              </span>
            ) : (
              <img
                src={imgUrl}
                alt={profile.name}
                width={512}
                height={512}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                draggable={false}
                style={{ transformOrigin: 'top center' }}
                className={cn(
                  'absolute inset-0 h-full w-full object-cover object-top select-none',
                  // Zoom + top-anchor so the head/shoulders fill the frame.
                  isTransparent ? 'scale-[1.05]' : 'scale-100',
                  // Subtle contrast/saturation lift + grounding shadow on the subject.
                  isTransparent &&
                    '[filter:contrast(1.04)_saturate(1.06)] drop-shadow-[0_10px_16px_rgba(0,0,0,0.35)] dark:drop-shadow-[0_12px_22px_rgba(0,0,0,0.6)]',
                )}
                onError={handleAvatarError}
              />
            )}

            {/* Crisp inset edge */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-foreground/10"
            />
          </div>
        </motion.div>

        {/* Availability pill */}
        <motion.div variants={item}>
          <div className="inline-flex items-center gap-2 h-7 px-3 rounded-full border border-border bg-card text-xs font-medium text-muted-foreground">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            {profile.availability}
          </div>
        </motion.div>

        {/* Name */}
        <motion.h1
          variants={item}
          className="mt-6 font-display text-5xl sm:text-6xl md:text-[5rem] font-semibold tracking-tight leading-[1.02] text-foreground"
        >
          Randulf
          <br />
          <span className="text-gradient">Fantonial.</span>
        </motion.h1>

        {/* Role */}
        <motion.div
          variants={item}
          className="mt-5 text-lg text-foreground/80"
        >
          <span className="font-medium">{profile.title}</span>
        </motion.div>

        {/* Tagline */}
        <motion.p
          variants={item}
          className="mt-6 max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed"
        >
          {profile.tagline}
        </motion.p>

        {/* Meta */}
        <motion.div
          variants={item}
          className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground"
        >
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {profile.location}
          </span>
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <Mail className="h-3.5 w-3.5" />
            {profile.email}
          </a>
        </motion.div>

        {/* CTAs */}
        <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-2.5">
          <a href={profile.resumeUrl} download className="btn-primary">
            <Download className="h-4 w-4" />
            Download Resume
          </a>
          <button onClick={() => scrollTo('projects')} className="btn-secondary group">
            View Projects
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
          <div className="flex items-center gap-1.5 ml-1">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="h-10 w-10 grid place-items-center rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <s.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={item}
          className="mt-16 grid grid-cols-2 sm:grid-cols-4 border-t border-border"
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={cn(
                'py-5 sm:px-6',
                // 2-col mobile: divide odd cells (i=1,3) with a left border.
                i % 2 === 1 && 'border-l border-border',
                // 4-col desktop: divide every cell except the first.
                i > 0 && 'sm:border-l sm:border-border',
              )}
            >
              <div className="font-display text-2xl sm:text-3xl font-semibold text-foreground">
                {s.value}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
