/**
 * Knowledge base for the "Ask Randulf" chatbot.
 *
 * The chatbot matches user queries against `keywords` arrays
 * and returns a weighted best response. Each entry may also
 * include a list of `followUps` — suggested chips to render
 * after the answer.
 *
 * Tone guidelines:
 *   - Natural, friendly, accurate.
 *   - Don't surface awards/hackathons/pitches unless the user
 *     specifically asks (we have a dedicated `achievements` entry).
 *   - When unsure, use the friendly `fallback`.
 */

export interface KnowledgeEntry {
  id: string;
  keywords: string[];
  answer: string;
  followUps?: string[];
}

export interface SuggestedPrompt {
  label: string;
  prompt: string;
}

export const suggestedPrompts: SuggestedPrompt[] = [
  { label: '👋 Who is Randulf?', prompt: 'Who is Randulf?' },
  { label: '💼 Show me your projects', prompt: 'Tell me about your projects' },
  { label: '🤖 Tell me about AIDA', prompt: 'Tell me about Automated Incident Detection' },
  { label: '🛠 What can you build?', prompt: 'What technologies do you work with?' },
  { label: '🏆 Awards & wins', prompt: 'What awards have you won?' },
  { label: '📬 How can I hire you?', prompt: 'How do I contact you?' },
];

export const greeting = `Hey there! 👋 I'm Randulf's AI assistant.

Ask me anything about Randulf — his projects, skills, experience, awards, or how to get in touch. Try one of the chips below to get started!`;

export const fallback = `That's a great question! I don't have a crisp answer for that one yet, but I'd love to tell you about Randulf's **projects**, **skills**, **experience**, **education**, **awards**, or **how to get in touch**. What would you like to know?`;

export const knowledge: KnowledgeEntry[] = [
  {
    id: 'identity',
    keywords: ['who', 'you', 'your name', 'name', 'introduce', 'about', 'yourself', 'randulf'],
    answer:
      "I'm Randulf's AI assistant 🤖 — happy to answer anything about him.\n\n**Randulf Fantonial** is a Full Stack Developer and **Cum Laude BSIT** graduate from **USTP** (2025), now **co-founding AIDA** — a real-time AI incident-response platform that won **Best Capstone Project**, took **1st Place at SEA-CICSIC 2025** (Southeast Asia division), and earned a **₱100,000 incubation grant**. He builds production web and mobile products end-to-end with **React, React Native, Django, and PostgreSQL**.",
    followUps: ['What have you built?', 'What is your strongest stack?', 'Where are you based?'],
  },
  {
    id: 'location',
    keywords: ['where', 'based', 'location', 'country', 'philippines', 'live'],
    answer:
      "Randulf is based in **Cagayan de Oro, Philippines**, and is happy to work **remote** or hybrid for teams worldwide. He's used to async-first collaboration across time zones.",
    followUps: ['Are you available for hire?', 'How do I contact you?'],
  },
  {
    id: 'hire',
    keywords: ['hire', 'available', 'opportunity', 'job', 'work with', 'freelance', 'open', 'roles'],
    answer:
      "Yes — Randulf is currently **open to new opportunities**, both full-time and freelance. He's especially drawn to teams building polished product UIs, developer tools, or mission-driven tech.",
    followUps: ['How do I contact you?', 'Show me your resume', 'Show me your projects'],
  },
  {
    id: 'contact',
    keywords: ['contact', 'email', 'reach', 'message', 'linkedin', 'github', 'socials', 'social'],
    answer:
      "The fastest way is email at **fantonial.randulf9@gmail.com**. You can also find him on **GitHub** and **LinkedIn** (linkedin.com/in/randulf-fantonial-304922331) via the social icons in the contact section. Expect a reply within 24 hours on weekdays.",
    followUps: ['Download resume', 'Tell me about your projects'],
  },
  {
    id: 'resume',
    keywords: ['resume', 'cv', 'download'],
    answer:
      "You can grab Randulf's latest resume using the **Download Resume** button in the hero section — a one-pager with projects, stack, and recent work.",
    followUps: ['Show me your projects', 'How do I contact you?'],
  },
  {
    id: 'projects-overview',
    keywords: ['projects', 'work', 'portfolio', 'built', 'show me', 'examples', 'case'],
    answer:
      "Here are Randulf's main projects:\n\n• **Automated Incident Detection and Assistance (AIDA · 2024 – Present)** — co-founded, award-winning AI platform for real-time incident detection across web and mobile.\n• **Barangay Lupon Admin & Database (2026)** — deployed case-management system for Barangay Camaman-an: dispute resolution, documents, audit trails, analytics.\n• **Polymarket 5-Min Bot — BTC · ETH · SOL (2025 – Present)** — open-source Python bot for Polymarket 5-minute crypto markets with an LLM-assisted strategy and a backtester.\n• **Hyperliquid Auto-Trading Bot (2025 – Present)** — personal Python bot that auto-executes trades on Hyperliquid, with a Telegram feed for fills, PnL, and kill-switch controls.\n• **Coffeenoy (2023)** — mobile platform for coffee enthusiasts: community, recipe discovery, and brewing guides.\n• **Lawod: A Digital Fishing Companion (2023 – 2024)** — early-stage mobile marketplace for Filipino fishermen with a custom ocean-themed UI.\n\nAsk me about any of them for the deep-dive!",
    followUps: [
      'Tell me about AIDA',
      'Tell me about the Polymarket bot',
      'Tell me about Barangay Lupon',
    ],
  },
  {
    id: 'project-barangay',
    keywords: ['barangay', 'lupon', 'case', 'dispute', 'admin', 'dashboard', 'government', 'camaman'],
    answer:
      "**Barangay Lupon Admin & Database (2026)** is a complete case management system and admin dashboard built for **Barangay Camaman-an**'s Lupon. It handles **dispute resolution tracking**, **document management**, a **centralized case database**, and **role-based admin features** with audit trails. Built with **React, TypeScript, Django REST, PostgreSQL, and Tailwind CSS** — and it's now in active use by the barangay.",
    followUps: ['Tell me about Automated Incident Detection', 'What stack do you prefer?'],
  },
  {
    id: 'project-incident',
    keywords: [
      'incident', 'detection', 'automated', 'assistance', 'disaster', 'response',
      'capstone', 'startup',
    ],
    answer:
      "**Automated Incident Detection and Assistance (2024 – Present)** is Randulf's capstone project — now evolving into a startup. It's an **AI-powered platform** for incident detection and disaster response, delivered across **mobile and web** with real-time data processing and cloud storage. Randulf led the **web frontend and backend** (admin dashboard, real-time reporting, core APIs) while his teammates handled AI models and mobile. Built with **React Native, React.js, Django, and PostgreSQL**.",
    followUps: ['What awards has it won?', 'What other projects do you have?'],
  },
  {
    id: 'project-coffeenoy',
    keywords: ['coffeenoy', 'coffee', 'community', 'brewing', 'social'],
    answer:
      "**Coffeenoy (2023)** is a mobile platform for coffee enthusiasts with **community sharing**, **product discovery**, and **brewing tools** — connecting hobbyists, local roasters, and baristas. Built with **React Native, Firebase, Node.js, and Expo**.",
    followUps: ['Tell me about Barangay Lupon', 'What other mobile apps have you built?'],
  },
  {
    id: 'project-hyperliquid-bot',
    keywords: ['telegram', 'bot', 'bots', 'hyperliquid', 'trading', 'auto-trade', 'auto-trading'],
    answer:
      "**Hyperliquid Auto-Trading Bot (2025 – Present)** is a personal-use Python bot that **auto-executes orders on Hyperliquid** based on Randulf's own strategy rules — position sizing, stop-loss / take-profit, and kill-switch controls all built in. A live **Telegram feed** broadcasts every signal, fill, and PnL update so he can monitor and override from anywhere. Always-on micro-service with reconnect and retry logic. Built with **Python, the Hyperliquid API, and the Telegram Bot API**.",
    followUps: ['Tell me about the Polymarket bot', 'What other projects do you have?'],
  },
  {
    id: 'project-polymarket-bot',
    keywords: ['polymarket', 'prediction', 'market', 'markets', 'llm', 'backtest', 'backtester', '5-min', '5min', '5 minute', 'btc', 'eth', 'sol'],
    answer:
      "**Polymarket 5-Min Bot — BTC · ETH · SOL (2025 – Present)** is an **open-source Python bot** that participates in Polymarket's 5-minute prediction markets for the major crypto majors. It streams live price data over **websockets**, runs a tunable strategy with an **LLM-assisted decision step**, sizes positions through a risk module, and ships with a **backtester** for offline strategy validation. Code lives at **github.com/rfantonial15/Polymarket-BTC-ETH-SOL-5min-bot**.",
    followUps: ['Tell me about the Hyperliquid bot', 'What other projects do you have?'],
  },
  {
    id: 'project-lawod',
    keywords: ['lawod', 'fishing', 'fisherman', 'fishermen', 'marketplace', 'ocean'],
    answer:
      "**Lawod: A Digital Fishing Companion (2023 – 2024)** is an early-stage startup — a **mobile marketplace for Filipino fishermen** with a custom ocean-themed UI designed in Figma, built on **Flutter and Firebase**. It was paused so Randulf could pivot the learnings into Automated Incident Detection.",
    followUps: ['Tell me about Automated Incident Detection', 'Tell me about Coffeenoy'],
  },
  {
    id: 'skills',
    keywords: ['skill', 'skills', 'stack', 'technologies', 'tech', 'language', 'languages', 'framework', 'frameworks', 'tools', 'know'],
    answer:
      "Randulf's core stack:\n\n• **Frontend:** React.js, TypeScript, Next.js, Tailwind CSS, Framer Motion\n• **Mobile:** React Native, Flutter, Expo\n• **Backend:** Django / DRF, Node.js, Express, Python, REST & GraphQL\n• **Database:** PostgreSQL, MySQL, MongoDB, Firebase, Supabase\n• **Tools & Others:** Git, Docker, Figma, CI/CD, Webhooks, Telegram Bot API\n• **AI & Productivity:** Claude (Anthropic), AI-Assisted Development, Prompt Engineering, Rapid Prototyping",
    followUps: ['What is your favorite stack?', 'How do you use AI?', 'Show me your projects'],
  },
  {
    id: 'ai-workflow',
    keywords: ['ai', 'claude', 'anthropic', 'llm', 'llms', 'prompt', 'copilot', 'gpt', 'artificial'],
    answer:
      "Randulf is deep into **AI-assisted development** — he uses **Claude (Anthropic)** and other LLMs for code generation, code review, and **rapid prototyping**. His workflow leans on strong prompt engineering to ship features faster without sacrificing quality.",
    followUps: ['What is your favorite stack?', 'Tell me about Automated Incident Detection'],
  },
  {
    id: 'favorite-stack',
    keywords: ['favorite', 'prefer', 'best stack', 'love', 'enjoy'],
    answer:
      "His favorite combo right now is **React + TypeScript + Tailwind** on the frontend with **Django REST + PostgreSQL** on the backend. For mobile, he reaches for **React Native with Expo** for speed, and **Flutter** when the UX needs to feel extra native. He also ships faster with **AI-assisted development** via Claude.",
    followUps: ['Show me your projects', 'How do you use AI?'],
  },
  {
    id: 'education',
    keywords: ['education', 'school', 'university', 'ustp', 'degree', 'study', 'graduate', 'graduated', 'cum laude', 'bsit'],
    answer:
      "Randulf earned a **Bachelor of Science in Information Technology (BSIT)** from the **University of Science and Technology of Southern Philippines (USTP)** from 2021 to 2025, graduating **Cum Laude**. His capstone — **Automated Incident Detection and Assistance** — was awarded **Best Capstone Project** in the program and is now evolving into a startup.",
    followUps: ['Tell me about your capstone', 'What awards have you won?', 'What did you study?'],
  },
  {
    id: 'achievements',
    keywords: [
      'achievement', 'achievements', 'award', 'awards', 'recognition', 'recognitions',
      'win', 'wins', 'won', 'champion', 'championship', 'competition', 'competitions',
      'pitch', 'pitches', 'hackathon', 'hackathons', 'grant', 'prize', 'prizes', 'finalist',
    ],
    answer:
      "Randulf's recent wins — most of them earned with his capstone-turned-startup **Automated Incident Detection and Assistance**:\n\n• **SEA-CICSIC — 1st Place** (Southeast Asia Division, China International College Students' Innovation Competition · July 2025)\n• **Lambigit 2025 — Overall Best Poster** (Northern Mindanao Research Innovation Summit · April 2025)\n• **Disruptor X Yearly Pitch — 2nd Runner-Up** (June 2025)\n• **Philippine Startup Challenge 9, Region X — 1st Runner-Up** (October 2024)\n• **Business Idea Development Award 2024 — Champion** (October 2024)\n• **Sparks' Up Student Incubation Program — ₱100,000 Grant** (September 2024)\n• **Tech101 Demo Day — Champion** (January 2024)\n• **PacketHacks x HacktheClimate — Finalist** (August 2025)",
    followUps: ['Tell me about Automated Incident Detection', 'Tell me about your education'],
  },
  {
    id: 'coursework',
    keywords: ['course', 'courses', 'subjects', 'class', 'classes', 'studied', 'curriculum', 'coursework'],
    answer:
      "Highlights of his coursework include **Data Structures & Algorithms, Software Engineering, Database Systems, Mobile App Development, Web Systems & Tech, and Information Assurance**.",
  },
  {
    id: 'experience',
    keywords: ['experience', 'worked', 'internship', 'job history', 'career', 'work history', 'background'],
    answer:
      "Randulf has **4+ years of hands-on coding** across capstone, freelance, and startup work:\n\n• **Co-Founder & Full Stack Developer — AIDA** (2024 – Present): leads the web frontend and core backend APIs of an award-winning AI incident-response platform; secured a **₱100,000 grant** and placed in **7+ regional/international competitions**.\n• **Lead Full Stack Developer — Barangay Lupon Digital Transformation** (2026): shipped a deployed government case-management platform end-to-end with audit trails, RBAC, and an analytics layer.\n• **Freelance Web & Mobile Developer** (2023 – Present): production web and mobile apps for clients across the Philippines, plus personal Python trading bots (Hyperliquid auto-execution and a Polymarket 5-minute LLM-assisted strategy bot, 2025 – Present).",
    followUps: ['Show me your projects', 'What is your strongest skill?'],
  },
  {
    id: 'strengths',
    keywords: ['strength', 'strongest', 'good at', 'best at', 'superpower'],
    answer:
      "His sweet spot: **taking a rough idea and shipping a polished, production-ready product fast** — clean UIs, well-modeled backends, and the motion/detail that makes the product feel premium.",
    followUps: ['What is your favorite stack?', 'Show me your projects'],
  },
  {
    id: 'soft-skills',
    keywords: ['soft', 'personality', 'team', 'teamwork', 'collaboration', 'introvert', 'work style', 'workstyle', 'remote', 'communicate', 'communication'],
    answer:
      "Randulf is a **fast learner**, **problem solver**, and **detail-oriented** builder with an **ownership mindset** — independent and self-driven, and a strong async communicator.\n\nHe thrives in **deep, focused work** with **clear written communication and well-documented code** — the kind of work style that travels well across remote, hybrid, and time-zone-spanning teams.",
    followUps: ['What is your strongest skill?', 'Are you available for hire?'],
  },
  {
    id: 'fun',
    keywords: ['fun', 'hobby', 'hobbies', 'free time', 'outside', 'besides', 'interests'],
    answer:
      "Outside of code, Randulf is into **specialty coffee** (the inspiration behind Coffeenoy!) and likes hunting for design inspiration on Dribbble and Mobbin in his quieter moments.",
  },
  {
    id: 'greeting',
    keywords: ['hi', 'hello', 'hey', 'yo', 'greetings', 'sup', 'howdy'],
    answer:
      "Hey there 👋 I'm Randulf's AI assistant. Ask me anything — projects, stack, education, awards, or how to hire him — I'll do my best to help!",
    followUps: ['Who are you?', 'Show me your projects', 'How do I contact you?'],
  },
  {
    id: 'thanks',
    keywords: ['thanks', 'thank you', 'thx', 'appreciate'],
    answer: "Anytime! 🙌 If anything else pops up, just drop another message — I'm right here.",
  },
];
