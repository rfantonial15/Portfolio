import AnimatedBackground from './components/AnimatedBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Achievements from './components/Achievements';
import Skills from './components/Skills';
import Education from './components/Education';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import { useTheme } from './hooks/useTheme';
import { useActiveSection } from './hooks/useActiveSection';
import { navLinks } from './data/portfolioData';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const active = useActiveSection(navLinks.map((n) => n.id));

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />

      <Navbar active={active} theme={theme} onToggleTheme={toggleTheme} />

      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Achievements />
        <Skills />
        <Education />
        <Contact />
        <Footer />
      </main>

      <Chatbot />
    </div>
  );
}
