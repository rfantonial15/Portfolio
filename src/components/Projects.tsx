import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ChevronLeft, ChevronRight, ExternalLink, ImageIcon, Send, Sparkles, TerminalSquare, X } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { projects, type Project } from '../data/portfolioData';
import { cn } from '../lib/utils';

function TerminalLogPreview() {
  const lines: { kind: 'info' | 'sig' | 'trade' | 'risk' | 'ok'; text: string }[] = [
    { kind: 'info', text: '[09:40:00]  tick  BTC=$68,420  ETH=$3,482  SOL=$184.2' },
    { kind: 'sig',  text: '[09:40:02]  llm   signal=LONG  conf=0.78  market=BTC-5m' },
    { kind: 'trade', text: '[09:40:03]  buy   BTC-Yes  size=25  entry=$0.62' },
    { kind: 'risk', text: '[09:40:04]  risk  daily_pnl=+$184  drawdown=ok' },
    { kind: 'ok',   text: '[09:45:01]  exit  fill=$0.71  +14.5%  · queued next tick' },
  ];
  const colorFor = (k: typeof lines[number]['kind']) => ({
    info: 'text-slate-400',
    sig: 'text-violet-300',
    trade: 'text-emerald-300',
    risk: 'text-amber-300',
    ok: 'text-cyan-300',
  })[k];

  return (
    <div className="absolute inset-0 bg-[#0b1020] overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      {/* terminal chrome */}
      <div className="absolute top-0 inset-x-0 flex items-center gap-2 px-3 py-2 bg-black/40 border-b border-white/5">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </span>
        <div className="flex items-center gap-1.5 ml-1 text-white/60 text-[10px] font-mono">
          <TerminalSquare className="h-3 w-3" />
          polymarket-bot · run.py
        </div>
      </div>
      {/* log */}
      <div className="absolute inset-0 pt-9 pb-3 px-3 flex flex-col justify-end gap-1">
        {lines.map((l) => (
          <div
            key={l.text}
            className={`text-[10px] sm:text-[11px] font-mono leading-snug ${colorFor(l.kind)}`}
          >
            {l.text}
          </div>
        ))}
        <div className="text-[10px] sm:text-[11px] font-mono leading-snug text-white/70 flex items-center">
          <span className="text-emerald-400 mr-1">$</span>
          <span className="ml-0.5 inline-block h-3 w-1.5 bg-white/70 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function TelegramChatPreview() {
  const messages = [
    { time: '09:41', text: '🟢 LONG ETH-PERP  ·  size 1.2  ·  entry $3,482' },
    { time: '09:58', text: '✅ TP1 filled  ·  +0.42 ETH  ·  PnL +$214' },
    { time: '10:12', text: '🛑 SL armed  ·  trail $3,510  ·  risk -0.3%' },
  ];
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-[#1d2733] via-[#16202b] to-[#0e1620] overflow-hidden">
      {/* faint grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      {/* header */}
      <div className="absolute top-0 inset-x-0 flex items-center gap-2 px-3 py-2 bg-black/30 border-b border-white/5">
        <span className="grid place-items-center h-6 w-6 rounded-full bg-[#3390ec] text-white">
          <Send className="h-3 w-3" />
        </span>
        <div className="min-w-0">
          <div className="text-[11px] font-semibold text-white truncate">HyperliquidBot</div>
          <div className="text-[9px] text-white/50">bot · auto-trading</div>
        </div>
      </div>
      {/* messages */}
      <div className="absolute inset-0 pt-10 pb-3 px-3 flex flex-col justify-end gap-1.5">
        {messages.map((m) => (
          <div key={m.text} className="flex items-end gap-2 max-w-[85%]">
            <div className="rounded-lg rounded-bl-sm bg-white/[0.08] backdrop-blur px-2.5 py-1.5 border border-white/5">
              <div className="text-[10px] sm:text-[11px] text-white/95 font-mono leading-snug">
                {m.text}
              </div>
              <div className="text-[8px] text-white/40 mt-0.5">{m.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Projects() {
  const [active, setActive] = useState<Project | null>(null);
  const [filter, setFilter] = useState<string>('All');
  const [shotIdx, setShotIdx] = useState(0);

  useEffect(() => {
    setShotIdx(0);
  }, [active]);

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
                className="group text-left card card-hover p-0 min-h-[260px] flex flex-col overflow-hidden hover:shadow-soft"
              >
                {p.screenshots && p.screenshots.length > 0 ? (
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted/40 border-b border-border/60">
                    <img
                      src={p.screenshots[0].src}
                      alt={`${p.name} preview`}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    {p.screenshots.length > 1 && (
                      <span className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 rounded-md bg-background/85 backdrop-blur px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground border border-border/60">
                        <ImageIcon className="h-3 w-3" />
                        {p.screenshots.length}
                      </span>
                    )}
                  </div>
                ) : p.preview === 'telegram-chat' ? (
                  <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border/60">
                    <TelegramChatPreview />
                  </div>
                ) : p.preview === 'terminal-log' ? (
                  <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border/60">
                    <TerminalLogPreview />
                  </div>
                ) : null}

                <div className="flex flex-col flex-1 p-6">
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
              className="relative card max-w-3xl w-full max-h-[88vh] overflow-y-auto p-7 sm:p-8 shadow-elevated"
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

              {(!active.screenshots || active.screenshots.length === 0) && active.preview === 'telegram-chat' && (
                <div className="mt-6 relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-border">
                  <TelegramChatPreview />
                </div>
              )}

              {(!active.screenshots || active.screenshots.length === 0) && active.preview === 'terminal-log' && (
                <div className="mt-6 relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-border">
                  <TerminalLogPreview />
                </div>
              )}

              {active.screenshots && active.screenshots.length > 0 && (
                <div className="mt-6">
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-border bg-muted/40">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={active.screenshots[shotIdx].src}
                        src={active.screenshots[shotIdx].src}
                        alt={active.screenshots[shotIdx].caption}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 h-full w-full object-contain"
                      />
                    </AnimatePresence>

                    {active.screenshots.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            setShotIdx((i) =>
                              (i - 1 + active.screenshots!.length) % active.screenshots!.length,
                            )
                          }
                          aria-label="Previous screenshot"
                          className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 grid place-items-center rounded-full bg-background/85 backdrop-blur border border-border text-foreground hover:bg-background transition-colors"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setShotIdx((i) => (i + 1) % active.screenshots!.length)
                          }
                          aria-label="Next screenshot"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 grid place-items-center rounded-full bg-background/85 backdrop-blur border border-border text-foreground hover:bg-background transition-colors"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                        <span className="absolute bottom-2 right-2 inline-flex items-center rounded-md bg-background/85 backdrop-blur px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground border border-border/60">
                          {shotIdx + 1} / {active.screenshots.length}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="text-xs text-muted-foreground">
                      {active.screenshots[shotIdx].caption}
                    </p>
                  </div>

                  {active.screenshots.length > 1 && (
                    <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                      {active.screenshots.map((s, i) => (
                        <button
                          key={s.src}
                          type="button"
                          onClick={() => setShotIdx(i)}
                          aria-label={`Show screenshot ${i + 1}`}
                          className={cn(
                            'relative shrink-0 h-14 w-24 rounded-md overflow-hidden border transition-all',
                            i === shotIdx
                              ? 'border-foreground ring-2 ring-foreground/20'
                              : 'border-border opacity-70 hover:opacity-100',
                          )}
                        >
                          <img
                            src={s.src}
                            alt=""
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

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

              {active.links && active.links.length > 0 && (
                <div className="mt-7 pt-6 border-t border-border/60 flex flex-wrap gap-2">
                  {active.links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 h-9 px-3.5 rounded-md text-sm font-medium border border-border bg-muted/40 hover:bg-muted hover:border-foreground/20 transition-colors"
                    >
                      {l.label}
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                    </a>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
