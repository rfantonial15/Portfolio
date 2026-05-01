# Randulf Fantonial — Portfolio

A premium, dark-mode-first personal portfolio for **Randulf Fantonial** (Full Stack Developer, — USTP, 2026), featuring an interactive **"Ask Randulf" AI chatbot** on a fixed right-hand panel.

Built with **React 18 + Vite + TypeScript**, styled with **Tailwind CSS**, animated with **Framer Motion**, and iconified with **Lucide**.

---

## Features

- Glassmorphism + gradient aesthetic (Stripe/Linear/Vercel grade)
- Animated background blobs, grid, noise & radial glow
- Sticky pill navbar with glowing active-section indicator
- Smooth scroll + active section detection
- Dark/Light theme toggle with persistence
- Hero with live availability pill, stats, socials, resume CTA
- Filterable project grid with click-to-open case-study modal
- Skills visualization with animated level bars + shimmer
- Timeline-style experience section
- Education card with honor badge & key coursework
- Contact CTA with copy-email micro-interaction
- Fixed right-hand **Chatbot** panel (desktop)
- Floating chat button → full-screen modal on mobile
- Rich knowledge base with smart keyword scoring, typing dots, suggested prompt chips, follow-up chips

---

## Tech stack

| Layer | Tools |
|-------|-------|
| Framework | React 18, Vite, TypeScript |
| Styling | Tailwind CSS, custom CSS layer |
| Animation | Framer Motion |
| Icons | Lucide React |
| Fonts | Inter, Space Grotesk, JetBrains Mono (Google Fonts) |

---

## Project structure

```
E:\PORTFOLIO
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── public/
│   ├── favicon.svg
│   └── resume.pdf              ← drop your actual resume here
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── index.css
    ├── vite-env.d.ts
    ├── components/
    │   ├── AnimatedBackground.tsx
    │   ├── Navbar.tsx
    │   ├── ThemeToggle.tsx
    │   ├── Hero.tsx
    │   ├── SectionHeading.tsx
    │   ├── About.tsx
    │   ├── Experience.tsx
    │   ├── Projects.tsx
    │   ├── Skills.tsx
    │   ├── Education.tsx
    │   ├── Contact.tsx
    │   ├── Footer.tsx
    │   └── Chatbot.tsx
    ├── data/
    │   ├── portfolioData.ts    ← name, projects, skills, experience, edu
    │   └── knowledgeBase.ts    ← chatbot Q&A
    ├── hooks/
    │   ├── useTheme.ts
    │   └── useActiveSection.ts
    └── lib/
        └── utils.ts
```

---

## Getting started

### Prerequisites

- **Node.js 18+** and **npm 9+** (or pnpm / yarn if preferred)

### 1. Install dependencies

From the project root (`E:\PORTFOLIO`):

```bash
npm install
```

### 2. Add your resume

Drop your resume PDF at `public/resume.pdf`. The "Download Resume" button in the Hero and Navbar points at `/resume.pdf`.

### 3. Run the dev server

```bash
npm run dev
```

Then open the URL Vite prints (defaults to `http://localhost:5173`).

### 4. Build for production

```bash
npm run build
npm run preview
```

The production bundle is emitted to `dist/`.

---

## Customization

All of your personal content lives in two files — **no component edits required**:

### 🪪 `src/data/portfolioData.ts`

- `profile` — name, title, tagline, about, resume URL
- `navLinks` — section ids/labels
- `stats` — the 4 stat tiles in the Hero
- `experiences` — timeline entries
- `projects` — full project list (with `featured: true` for the star badge)
- `skillGroups` — categories + leveled bars
- `softSkills` — "beyond the code" chips
- `education` — degree, honor, highlights, coursework
- `socials` — GitHub, LinkedIn, Email (swap in real URLs)

### 🤖 `src/data/knowledgeBase.ts`

- `greeting` / `fallback` — chatbot's opening line and default reply
- `suggestedPrompts` — the chips that appear on first open
- `knowledge` — array of `{ keywords, answer, followUps }` entries. The chatbot scores every entry against the user's query and picks the best match. Add, remove, or tweak entries freely.

### 🎨 Theme & colors

Tweak gradients, accents and blobs in:

- `tailwind.config.js` → `colors`, `animation`, `keyframes`
- `src/index.css` → `.btn-primary`, `.text-gradient`, `.glass`, `.card`
- `src/components/AnimatedBackground.tsx` → blob colors & motion

The site defaults to **dark mode**. The user toggle persists to `localStorage` under the key `randulf-theme`.

---

## Tips

- Update social `href`s in `portfolioData.ts` (`socials` array) — they currently point at the top-level `github.com`/`linkedin.com` landing pages.
- The chatbot works 100% client-side — no API keys required. To wire it to a real LLM, replace the `findBestAnswer` call in `Chatbot.tsx` with a fetch to your backend.
- On screens narrower than `lg` (1024px), the right-hand chat panel becomes a floating button → full-screen modal. Main content automatically stretches full-width.

---

## License

MIT — go build something awesome. 💫
