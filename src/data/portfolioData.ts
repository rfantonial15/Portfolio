import type { ComponentType } from 'react';
import {
  Atom,
  BrainCircuit,
  Code,
  Code2,
  Database,
  Github,
  Globe,
  GraduationCap,
  Layers,
  Linkedin,
  Mail,
  MapPin,
  Rocket,
  Server,
  Smartphone,
  Sparkles,
  Terminal,
  Trophy,
  Wrench,
  Zap,
} from 'lucide-react';
import AidaWebDashboard from '../assets/AIDA-Web-Dashboard.png';
import AidaMobDashboard from '../assets/AIDA-Mob-Dashboard.png';
import AidaMobAlert from '../assets/AIDA-Mob-Alert.png';
import AidaMobReport from '../assets/AIDA-Mob-Report.png';
import AidaMobSOS from '../assets/AIDA-Mob-SOS.png';
import LawodIntro from '../assets/Lawod-Intro.png';
import LawodLogin from '../assets/Lawod-Login.png';
import LawodMarket from '../assets/Lawod-Market.png';
import LuponDashboard from '../assets/Lupon-Dashboard.png';
import LuponCaseRecord from '../assets/Lupon-CaseRecord.png';
import LuponFreqRecord from '../assets/Lupon-FreqRecord.png';
import LuponInputCase from '../assets/Lupon-InputCase.png';
import LuponAnalytics1 from '../assets/Lupon-Analytics1.png';
import LuponAnalytics2 from '../assets/Lupon-Analytics2.png';
import CoffeenoyHome from '../assets/Coffeenoy.png';
import CoffeenoyLogin from '../assets/CoffeenoyLogin.png';
import CoffeenoyMaps from '../assets/CoffeenoyMaps.png';
import CoffeenoyStep1 from '../assets/CoffeenoyStep1.png';

export interface NavLink {
  id: string;
  label: string;
}

export interface ProjectScreenshot {
  src: string;
  caption: string;
  /** 'mobile' = portrait phone mock, 'web' = landscape browser mock */
  kind: 'mobile' | 'web';
}

export interface Project {
  slug: string;
  name: string;
  year: string;
  tagline: string;
  description: string;
  highlights: string[];
  stack: string[];
  tags: string[];
  featured?: boolean;
  award?: string;
  links?: { label: string; href: string }[];
  screenshots?: ProjectScreenshot[];
  /** Stylized placeholder for projects with no traditional UI to screenshot. */
  preview?: 'telegram-chat' | 'terminal-log';
}

export interface SkillGroup {
  name: string;
  icon: ComponentType<{ className?: string }>;
  skills: string[];
}

export interface Experience {
  role: string;
  org: string;
  period: string;
  location: string;
  bullets: string[];
  stack: string[];
}

export interface SocialLink {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
}

export const profile = {
  name: 'Randulf Fantonial',
  firstName: 'Randulf',
  title: 'Full Stack Developer · Co-Founder, AIDA',
  location: 'Cagayan de Oro, Philippines',
  email: 'fantonial.randulf9@gmail.com',
  availability: 'Open to new opportunities',
  tagline: 'I build production web and mobile products end-to-end — from data model to the last UI detail — with React, React Native, Django, and PostgreSQL.',
  about: `I'm a Full Stack Developer based in Cagayan de Oro, building production web and mobile products end-to-end with React, React Native, Django, and PostgreSQL. My work spans civic tech, real-time AI platforms, and the kind of polished product UIs that have to hold up under daily use.

I care about the whole craft — a normalized data model, the right abstraction at the right time, and the small UX details that make a product feel considered rather than assembled. I work best with high autonomy, tight feedback loops, and teams that treat polish as a default rather than a stretch goal.

Right now I'm co-founding Automated Incident Detection and Assistance (AIDA) — taking my award-winning capstone to market — while leading a Barangay Lupon case-management platform and shipping freelance product work in parallel.`,
  resumeUrl: '/rfantonialResume.pdf',
  // Drop your photo at /public/profile.jpg (or .png/.webp) and it will show in the Hero.
  avatarUrl: '/profile.jpg',
};

export const navLinks: NavLink[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'achievements', label: 'Awards' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
];

export const stats: { label: string; value: string; icon: ComponentType<{ className?: string }> }[] = [
  { label: 'Years Coding', value: '4+', icon: Code },
  { label: 'Products Shipped', value: '15+', icon: Rocket },
  { label: 'Awards & Wins', value: '8', icon: Trophy },
  { label: 'USTP', value: '2025', icon: GraduationCap },
];

export const experiences: Experience[] = [
  {
    role: 'Co-Founder & Full Stack Developer',
    org: 'Automated Incident Detection and Assistance (AIDA)',
    period: '2024 – Present',
    location: 'Cagayan de Oro, Philippines',
    bullets: [
      'Co-founded a real-time AI incident-response platform spun out of an award-winning college capstone; now taking the product to market.',
      'Lead the web frontend and core backend APIs, partnering with the AI and mobile teams to ship a unified detection pipeline across web and React Native.',
      'Secured ₱100,000 in non-dilutive grant funding and placed in 7+ regional and international competitions, including 1st Place at SEA-CICSIC 2025 (Southeast Asia division).',
    ],
    stack: ['React', 'TypeScript', 'Django REST', 'PostgreSQL', 'React Native'],
  },
  {
    role: 'Lead Full Stack Developer',
    org: 'Barangay Camaman-an — Lupon Digital Transformation',
    period: '2026',
    location: 'Cagayan de Oro, Philippines',
    bullets: [
      'Designed and shipped a deployed case-management platform end-to-end — data model, API, admin UI, and analytics dashboard — for local dispute resolution.',
      'Modeled a normalized PostgreSQL schema for cases, hearings, and documents with full audit trails to meet government compliance requirements.',
      'Built role-based access control, document workflows, and an analytics layer that surfaces caseload, deadlines, and resolution rates.',
    ],
    stack: ['React', 'TypeScript', 'Django REST', 'PostgreSQL', 'Tailwind CSS'],
  },
  {
    role: 'Freelance Web & Mobile Developer',
    org: 'Independent',
    period: '2023 – Present',
    location: 'Remote',
    bullets: [
      'Shipped multiple production web and mobile apps for clients across the Philippines, owning everything from data model to deployment.',
      'Build and operate personal Python trading bots — an automated Hyperliquid execution bot with Telegram-driven monitoring, and a Polymarket 5-minute strategy bot with LLM-assisted signals and a backtester (2025 – Present).',
    ],
    stack: ['React Native', 'Flutter', 'Next.js', 'Django', 'Firebase', 'Supabase', 'Python'],
  },
];

export const projects: Project[] = [
  {
    slug: 'incident-detection',
    name: 'Automated Incident Detection and Assistance',
    year: '2024 – Present',
    tagline: 'AI-powered incident detection across mobile and web.',
    description:
      'A platform that automates incident detection and reporting — helping disaster responders react faster with real-time data and cloud-backed evidence.',
    highlights: [
      'Real-time data processing on both mobile and web clients.',
      'Cloud storage for reports, evidence, and media.',
      'Originated as my college capstone — awarded Best Capstone Project.',
      'Now being taken to market as a startup.',
    ],
    stack: ['React Native', 'React.js', 'Django', 'PostgreSQL'],
    tags: ['Full Stack', 'AI', 'Mobile'],
    screenshots: [
      { src: AidaWebDashboard, caption: 'Admin Dashboard — incident overview', kind: 'web' },
      { src: AidaMobDashboard, caption: 'Mobile Home — weather & quick actions', kind: 'mobile' },
      { src: AidaMobAlert, caption: 'Real-time incident alerts', kind: 'mobile' },
      { src: AidaMobReport, caption: 'Citizen incident reporting flow', kind: 'mobile' },
      { src: AidaMobSOS, caption: 'One-tap SOS request', kind: 'mobile' },
    ],
  },
  {
    slug: 'barangay-lupon',
    name: 'Barangay Lupon Admin & Database',
    year: '2026',
    tagline: 'Case management OS for local dispute resolution.',
    description:
      'A complete case management system and admin dashboard for Barangay Lupon. Handles dispute resolution tracking, document management, a centralized case database, and the administrative features officials need to run day-to-day operations.',
    highlights: [
      'Dispute resolution tracking from intake through mediation.',
      'Document management with secure storage and retrieval.',
      'Centralized case database with fast search and filters.',
      'Admin dashboard with roles, audit trails, and reporting.',
    ],
    stack: ['React', 'TypeScript', 'Django REST', 'PostgreSQL'],
    tags: ['Full Stack', 'Gov Tech'],
    screenshots: [
      { src: LuponDashboard, caption: 'Dashboard — case totals, status mix, and deadlines', kind: 'web' },
      { src: LuponCaseRecord, caption: 'Case records with search and filters', kind: 'web' },
      { src: LuponInputCase, caption: 'Structured case intake form', kind: 'web' },
      { src: LuponFreqRecord, caption: 'Frequent records lookup', kind: 'web' },
      { src: LuponAnalytics1, caption: 'Analytics — case nature & status breakdown', kind: 'web' },
      { src: LuponAnalytics2, caption: 'Analytics — trends and deadlines', kind: 'web' },
    ],
  },
  {
    slug: 'polymarket-5min-bot',
    name: 'Polymarket 5-Min Bot — BTC · ETH · SOL',
    year: '2025 – Present',
    tagline: 'Strategy + LLM-driven bot for Polymarket 5-minute crypto markets.',
    description:
      'A Python trading bot that participates in Polymarket\'s 5-minute BTC, ETH, and SOL prediction markets. It streams live price data over websockets, runs a configurable strategy with an LLM-assisted decision step, sizes positions through a risk module, and ships with a backtester for offline strategy validation.',
    highlights: [
      'Real-time websocket feed for BTC, ETH, and SOL with 5-minute resolution.',
      'Strategy engine with a local-LLM decision step and tunable risk rules.',
      'Backtester for replaying historical markets before going live.',
      'Structured logging and metrics for every signal, trade, and PnL event.',
    ],
    stack: ['Python', 'Polymarket API', 'WebSockets', 'Local LLM', 'Backtesting'],
    tags: ['Automation', 'Backend'],
    preview: 'terminal-log',
    links: [
      {
        label: 'View on GitHub',
        href: 'https://github.com/rfantonial15/Polymarket-BTC-ETH-SOL-5min-bot',
      },
    ],
  },
  {
    slug: 'telegram-crypto-bots',
    name: 'Hyperliquid Auto-Trading Bot',
    year: '2025 – Present',
    tagline: 'Personal automated trading bot on Hyperliquid with Telegram alerts.',
    description:
      'A personal-use trading bot that executes orders automatically on Hyperliquid based on my own strategy rules, with Telegram as the live feed for fills, PnL and risk events — every signal, fill and circuit-breaker is wired through the same Telegram chat so I can monitor and override from anywhere.',
    highlights: [
      'Automated order execution on Hyperliquid via its API.',
      'Strategy rules with position sizing and stop-loss / take-profit logic.',
      'Live Telegram feed for fills, PnL updates and risk alerts.',
      'Always-on micro-service with reconnect, retry and kill-switch controls.',
    ],
    stack: ['Python', 'Hyperliquid API', 'Telegram Bot API', 'Webhooks'],
    tags: ['Automation', 'Backend'],
    preview: 'telegram-chat',
  },
  {
    slug: 'coffeenoy',
    name: 'Coffeenoy',
    year: '2023',
    tagline: 'A platform built for coffee enthusiasts.',
    description:
      'A platform for coffee enthusiasts with community features, product discovery, and brewing tools. Connects hobbyists, local roasters, and baristas in one friendly mobile experience.',
    highlights: [
      'Community sharing feed with reviews and ratings.',
      'Product discovery across local roasters and gear.',
      'Step-by-step brewing guides and tools.',
      'User engagement: profiles, follows and mentions.',
    ],
    stack: ['React Native', 'Firebase', 'Node.js', 'Expo'],
    tags: ['Mobile', 'Community'],
    screenshots: [
      { src: CoffeenoyHome, caption: 'Recipe feed — featured brews and quick actions', kind: 'mobile' },
      { src: CoffeenoyStep1, caption: 'Recipe detail with step-by-step brewing guide', kind: 'mobile' },
      { src: CoffeenoyMaps, caption: 'Discover nearby coffee shops', kind: 'mobile' },
      { src: CoffeenoyLogin, caption: 'Login screen with custom imagery', kind: 'mobile' },
    ],
  },
  {
    slug: 'lawod',
    name: 'Lawod: A Digital Fishing Companion',
    year: '2023 – 2024',
    tagline: 'Mobile marketplace for fishermen with an ocean-themed UI.',
    description:
      'An early-stage startup — a mobile marketplace tailored to Filipino fishermen with a custom ocean-themed UI designed in Figma. Paused to pivot learnings into Automated Incident Detection.',
    highlights: [
      'Mobile marketplace purpose-built for fishermen.',
      'Custom ocean-themed UI designed end-to-end in Figma.',
      'Real-time data sync for listings and messages.',
      'Lessons later pivoted into the Incident Detection platform.',
    ],
    stack: ['Flutter', 'Firebase', 'Figma'],
    tags: ['Mobile', 'Marketplace'],
    screenshots: [
      { src: LawodIntro, caption: 'Onboarding intro screen', kind: 'mobile' },
      { src: LawodLogin, caption: 'Login flow with custom illustrations', kind: 'mobile' },
      { src: LawodMarket, caption: 'Marketplace with weather-aware fishing advisory', kind: 'mobile' },
    ],
  },
];

export const skillGroups: SkillGroup[] = [
  {
    name: 'Frontend',
    icon: Atom,
    skills: ['React.js', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    name: 'Mobile',
    icon: Smartphone,
    skills: ['React Native', 'Flutter', 'Expo'],
  },
  {
    name: 'Backend',
    icon: Server,
    skills: ['Django / DRF', 'Node.js', 'Express', 'Python', 'REST & GraphQL'],
  },
  {
    name: 'Database',
    icon: Database,
    skills: ['PostgreSQL', 'MySQL', 'MongoDB', 'Firebase', 'Supabase'],
  },
  {
    name: 'Tooling',
    icon: Wrench,
    skills: ['Git', 'Docker', 'CI/CD', 'Figma', 'Webhooks', 'Telegram Bot API'],
  },
  {
    name: 'AI & Productivity',
    icon: BrainCircuit,
    skills: [
      'Claude (Anthropic)',
      'AI-Assisted Development',
      'Rapid Prototyping',
    ],
  },
];

export const softSkills = [
  { label: 'Fast Learner', icon: Zap },
  { label: 'Problem Solver', icon: Code2 },
  { label: 'Detail-Oriented', icon: Globe },
  { label: 'Ownership Mindset', icon: Terminal },
  { label: 'Independent & Self-Driven', icon: Sparkles },
  { label: 'Strong Async Communicator', icon: Layers },
];

export const education = {
  degree: 'Bachelor of Science in Information Technology (BSIT)',
  school: 'University of Science and Technology of Southern Philippines',
  shortSchool: 'USTP',
  period: '2021 — 2025',
  honor: 'Cum Laude',
  highlights: [
    'Graduated Cum Laude — top academic honor for sustained performance.',
    'Capstone: Automated Incident Detection and Assistance — awarded Best Capstone Project; now a co-founded startup.',
    'Capstone work later took 1st Place at SEA-CICSIC 2025 (Southeast Asia division) and National Champion at the PCCI Business Idea Development Award 2024.',
  ],
  coursework: [
    'Data Structures & Algorithms',
    'Software Engineering',
    'Database Systems',
    'Mobile App Development',
    'Web Systems & Tech',
    'Information Assurance',
  ],
};

export interface Achievement {
  title: string;
  rank: string;
  date: string;
  project?: string;
}

export const achievements: Achievement[] = [
  {
    title: 'PacketHacks x HacktheClimate',
    rank: 'Finalist',
    date: 'August 2025',
    project: 'Automated Incident Detection and Assistance',
  },
  {
    title: "SEA-CICSIC — Southeast Asia Division, China International College Students' Innovation Competition",
    rank: '1st Place',
    date: 'July 2025',
    project: 'Automated Incident Detection and Assistance',
  },
  {
    title: 'Disruptor X — Yearly Pitch Competition',
    rank: '2nd Runner-Up',
    date: 'June 2025',
    project: 'Automated Incident Detection and Assistance',
  },
  {
    title: 'Lambigit 2025 — Northern Mindanao Research Innovation Summit',
    rank: 'Overall Best Poster',
    date: 'April 2025',
    project: 'Automated Incident Detection and Assistance',
  },
  {
    title: 'Philippine Startup Challenge 9 — Region X',
    rank: '1st Runner-Up',
    date: 'October 2024',
    project: 'Automated Incident Detection and Assistance',
  },
  {
    title: 'PCCI Business Idea Development Award 2024 (National)',
    rank: 'National Champion',
    date: 'October 2024',
    project: 'Automated Incident Detection and Assistance',
  },
  {
    title: "Sparks' Up Student Incubation Program",
    rank: '₱100,000 Grant Fund Awarded',
    date: 'September 2024',
    project: 'Automated Incident Detection and Assistance',
  },
  {
    title: 'Tech101 Demo Day Pitching Competition',
    rank: 'Champion',
    date: 'January 2024',
    project: 'Automated Incident Detection and Assistance',
  },
];

export const socials: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/rfantonial15', icon: Github },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/randulf-fantonial-304922331', icon: Linkedin },
  { label: 'Email', href: 'mailto:fantonial.randulf9@gmail.com', icon: Mail },
];

export const contactMeta = {
  email: profile.email,
  location: profile.location,
  locationIcon: MapPin,
};
