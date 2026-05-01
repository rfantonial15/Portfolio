import type { ComponentType } from 'react';
import {
  Atom,
  BrainCircuit,
  Code2,
  Database,
  Github,
  Globe,
  Layers,
  Linkedin,
  Mail,
  MapPin,
  Server,
  Smartphone,
  Sparkles,
  Terminal,
  Wrench,
  Zap,
} from 'lucide-react';

export interface NavLink {
  id: string;
  label: string;
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
  title: 'Full Stack Developer',
  location: 'Cagayan de Oro, Philippines',
  email: 'fantonial.randulf9@gmail.com',
  availability: 'Available for new opportunities',
  tagline: 'Building exceptional digital experiences with code, creativity, and precision.',
  about: `I care about the whole craft — clean architecture, sharp UX details, and shipping work that actually feels good to use.

Most of my time goes into product UIs and developer-facing tools where iteration speed and quality both matter. I'm an introvert who thrives in deep, focused work, lean async, and treat polish as a default — not a stretch goal.`,
  resumeUrl: '/resume.pdf',
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

export const stats = [
  { label: 'Years Coding', value: '4+' },
  { label: 'Projects Shipped', value: '15+' },
  { label: 'Stacks Mastered', value: '8+' },
];

export const experiences: Experience[] = [
  {
    role: 'Full Stack Developer',
    org: 'Automated Incident Detection and Assistance',
    period: '2024 – Present',
    location: 'Cagayan de Oro, Philippines',
    bullets: [
      'Owned the web frontend and core backend APIs on a multi-disciplinary capstone team.',
      'Coordinated with teammates handling the AI models and mobile clients.',
      'Now continuing the work as a co-founder taking the platform to market.',
    ],
    stack: ['React', 'TypeScript', 'Django REST Framework', 'PostgreSQL'],
  },
  {
    role: 'Full Stack Developer',
    org: 'Barangay Camaman-an — Lupon Digital Transformation',
    period: '2026',
    location: 'Cagayan de Oro, Philippines',
    bullets: [
      'Led the platform end-to-end from data model to deployed UI.',
      'Modeled a normalized PostgreSQL schema for cases, hearings, and documents.',
      'Hand-rolled role-based access control and audit trails for compliance.',
    ],
    stack: ['React', 'TypeScript', 'Django REST Framework', 'PostgreSQL', 'Tailwind CSS'],
  },
  {
    role: 'Freelance Web & Mobile Developer',
    org: 'Independent',
    period: '2023 – Present',
    location: 'Remote',
    bullets: [
      'Shipped multiple web and mobile apps for clients across the Philippines.',
      'Build and maintain custom Telegram automation bots for monitoring and alerts.',
    ],
    stack: ['React Native', 'Flutter', 'Next.js', 'Django', 'Firebase', 'Supabase', 'Python'],
  },
];

export const projects: Project[] = [
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
  },
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
  },
  {
    slug: 'telegram-crypto-bots',
    name: 'Telegram Crypto Bots',
    year: '2023 – Present',
    tagline: 'Real-time crypto monitoring via Telegram.',
    description:
      'A set of real-time notification and command-based Telegram bots for monitoring crypto markets. Continuously iterated since 2023 with new alerts, commands and webhook integrations.',
    highlights: [
      'Real-time price and event notifications.',
      'Command-based interactions for queries and alerts.',
      'Webhook integrations with external data sources.',
      'Small, reliable, always-on micro-services.',
    ],
    stack: ['Python', 'Telegram Bot API', 'Webhooks'],
    tags: ['Automation', 'Backend'],
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
    name: 'Tools & Others',
    icon: Wrench,
    skills: ['Git', 'Docker', 'Figma', 'CI/CD', 'Webhooks', 'Telegram Bot API'],
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
  { label: 'Team Player (when needed)', icon: Layers },
];

export const education = {
  degree: 'Bachelor of Science in Information Technology (BSIT)',
  school: 'University of Science and Technology of Southern Philippines',
  shortSchool: 'USTP',
  period: '2021 — 2025',
  honor: 'Cum Laude',
  highlights: [
    'Graduated Cum Laude — top academic honor for sustained performance.',
    'Capstone: Automated Incident Detection and Assistance — awarded Best Capstone Project.',
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
    title: 'Business Idea Development Award 2024',
    rank: 'Champion',
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
  { label: 'GitHub', href: 'https://github.com/', icon: Github },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/randulf-fantonial-304922331', icon: Linkedin },
  { label: 'Email', href: 'mailto:fantonial.randulf9@gmail.com', icon: Mail },
];

export const contactMeta = {
  email: profile.email,
  location: profile.location,
  locationIcon: MapPin,
};
