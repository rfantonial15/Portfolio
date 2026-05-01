import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, MessageCircle, Send, Sparkles, User, X } from 'lucide-react';
import {
  fallback,
  greeting,
  knowledge,
  suggestedPrompts,
  type KnowledgeEntry,
} from '../data/knowledgeBase';
import { cn } from '../lib/utils';

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
  followUps?: string[];
}

const stopWords = new Set([
  'the', 'a', 'an', 'and', 'or', 'is', 'are', 'do', 'to', 'of', 'me', 'my', 'i', 'you', 'your',
  'for', 'on', 'in', 'at', 'with', 'tell', 'show', 'about', 'can', 'please', 'have', 'has',
]);

function scoreEntry(entry: KnowledgeEntry, query: string): number {
  const q = query.toLowerCase();
  const tokens = q.split(/[^a-z0-9+#]+/).filter((t) => t && !stopWords.has(t));
  let score = 0;
  for (const kw of entry.keywords) {
    const k = kw.toLowerCase();
    if (q.includes(k)) score += 3;
    for (const t of tokens) {
      if (t === k) score += 3;
      else if (k.includes(t) || t.includes(k)) score += 1;
    }
  }
  return score;
}

function findBestAnswer(query: string): KnowledgeEntry | null {
  let best: KnowledgeEntry | null = null;
  let bestScore = 0;
  for (const entry of knowledge) {
    const s = scoreEntry(entry, query);
    if (s > bestScore) {
      bestScore = s;
      best = entry;
    }
  }
  return bestScore >= 2 ? best : null;
}

const makeId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

function RichText({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => (
        <p key={i} className="leading-relaxed">
          {line.split(/(\*\*[^*]+\*\*)/g).map((part, idx) =>
            /^\*\*[^*]+\*\*$/.test(part) ? (
              <strong key={idx} className="font-semibold text-foreground">
                {part.slice(2, -2)}
              </strong>
            ) : (
              <span key={idx}>{part}</span>
            ),
          )}
        </p>
      ))}
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: makeId(),
      role: 'bot',
      text: greeting,
      followUps: suggestedPrompts.slice(0, 3).map((p) => p.prompt),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (!open) return;
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isTyping, open]);

  // Lock body scroll while open + autofocus input
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      const t = window.setTimeout(() => inputRef.current?.focus(), 250);
      return () => {
        document.body.style.overflow = '';
        window.clearTimeout(t);
      };
    }
    document.body.style.overflow = '';
    return undefined;
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text) return;

    setMessages((m) => [...m, { id: makeId(), role: 'user', text }]);
    setInput('');
    setIsTyping(true);

    const delay = 400 + Math.min(900, text.length * 18);
    window.setTimeout(() => {
      const match = findBestAnswer(text);
      const answer: Message = match
        ? { id: makeId(), role: 'bot', text: match.answer, followUps: match.followUps }
        : {
            id: makeId(),
            role: 'bot',
            text: fallback,
            followUps: ['Show me your projects', 'What awards have you won?', 'How do I contact you?'],
          };
      setMessages((m) => [...m, answer]);
      setIsTyping(false);
    }, delay);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  return (
    <>
      {/* Floating Action Button — bottom-right */}
      <AnimatePresence>
        {!open && (
          <motion.div
            key="chat-fab"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex items-center gap-3"
          >
            {/* Label pill (desktop only) */}
            <motion.span
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="hidden sm:inline-flex items-center h-9 px-3.5 rounded-full border border-border bg-card/95 backdrop-blur text-xs font-medium text-foreground shadow-soft"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-2" />
              Ask Randulf AI
            </motion.span>

            {/* Round button */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open Ask Randulf AI chat"
              className="group relative h-14 w-14 rounded-full bg-foreground text-background grid place-items-center shadow-elevated hover:scale-105 active:scale-95 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {/* subtle glow */}
              <span
                aria-hidden
                className="absolute inset-0 rounded-full bg-foreground/30 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300"
              />
              <Sparkles className="relative h-5 w-5" />
              {/* tiny "AI" badge */}
              <span
                aria-hidden
                className="absolute -top-1 -right-1 h-4 min-w-[1rem] px-1 rounded-full bg-emerald-500 text-[9px] font-bold text-white grid place-items-center border-2 border-background"
              >
                AI
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-end justify-center sm:justify-end p-0 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label="Ask Randulf AI chat"
          >
            {/* Backdrop */}
            <button
              type="button"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-background/70 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              className="relative w-full sm:max-w-md h-[88vh] sm:h-[640px] sm:max-h-[85vh] flex flex-col rounded-t-2xl sm:rounded-2xl border border-border bg-card shadow-elevated overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 h-14 border-b border-border shrink-0 bg-card">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative shrink-0">
                    <div className="h-8 w-8 rounded-lg bg-foreground text-background grid place-items-center">
                      <MessageCircle className="h-4 w-4" />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-card" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold leading-tight truncate">Ask Randulf AI</div>
                    <div className="text-[11px] text-muted-foreground leading-tight">
                      Online · replies instantly
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close chat"
                  className="h-8 w-8 grid place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
                <AnimatePresence initial={false}>
                  {messages.map((m) => (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className={cn('flex gap-2', m.role === 'user' ? 'flex-row-reverse' : 'flex-row')}
                    >
                      <div
                        className={cn(
                          'h-7 w-7 shrink-0 rounded-md grid place-items-center',
                          m.role === 'bot'
                            ? 'bg-foreground text-background'
                            : 'bg-muted text-foreground border border-border',
                        )}
                      >
                        {m.role === 'bot' ? (
                          <Bot className="h-3.5 w-3.5" />
                        ) : (
                          <User className="h-3.5 w-3.5" />
                        )}
                      </div>
                      <div
                        className={cn(
                          'max-w-[85%] space-y-2',
                          m.role === 'user' && 'items-end flex flex-col',
                        )}
                      >
                        <div
                          className={cn(
                            'inline-block text-[13.5px] px-3 py-2 rounded-lg',
                            m.role === 'bot'
                              ? 'bg-muted text-foreground rounded-tl-sm'
                              : 'bg-foreground text-background rounded-tr-sm',
                          )}
                        >
                          <RichText text={m.text} />
                        </div>
                        {m.followUps && m.followUps.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {m.followUps.map((f) => (
                              <button
                                key={f}
                                type="button"
                                onClick={() => send(f)}
                                className="text-[11.5px] px-2.5 py-1 rounded-md border border-border bg-background text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                              >
                                {f}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-2"
                  >
                    <div className="h-7 w-7 rounded-md bg-foreground text-background grid place-items-center shrink-0">
                      <Bot className="h-3.5 w-3.5" />
                    </div>
                    <div className="px-3 py-2 rounded-lg rounded-tl-sm bg-muted">
                      <TypingDots />
                    </div>
                  </motion.div>
                )}

                {/* Initial prompt chips */}
                {messages.length <= 1 && !isTyping && (
                  <div className="pt-2">
                    <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground mb-2">
                      Try asking
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {suggestedPrompts.map((p) => (
                        <button
                          key={p.prompt}
                          type="button"
                          onClick={() => send(p.prompt)}
                          className="text-xs px-2.5 py-1.5 rounded-md border border-border bg-background hover:bg-muted transition-colors"
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Composer */}
              <form
                onSubmit={onSubmit}
                className="shrink-0 border-t border-border p-3 bg-card"
              >
                <div className="flex items-center gap-2 h-10 rounded-lg border border-border bg-background pl-3 pr-1 focus-within:border-foreground/30 transition-colors">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask anything about Randulf..."
                    className="flex-1 bg-transparent text-sm h-full placeholder:text-muted-foreground focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    aria-label="Send message"
                    className="h-8 w-8 grid place-items-center rounded-md bg-foreground text-background disabled:opacity-30 hover:opacity-90 transition-opacity"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="pt-1.5 text-center text-[10px] text-muted-foreground">
                  AI assistant · Answers from Randulf&apos;s curated knowledge base
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
