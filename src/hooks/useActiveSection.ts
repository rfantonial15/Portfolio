import { useEffect, useState } from 'react';

export function useActiveSection(sectionIds: string[], offset = 120): string {
  const [active, setActive] = useState<string>(sectionIds[0] ?? '');

  useEffect(() => {
    function handler() {
      // If the user has scrolled to the bottom, force the last section.
      // This handles the case where the final section (e.g. Contact) is
      // shorter than the viewport, so its offsetTop can never reach the
      // threshold via natural scrolling.
      const docHeight = document.documentElement.scrollHeight;
      const viewBottom = window.scrollY + window.innerHeight;
      if (viewBottom >= docHeight - 4) {
        setActive(sectionIds[sectionIds.length - 1] ?? '');
        return;
      }

      const scrollY = window.scrollY + offset;
      let current = sectionIds[0] ?? '';
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.offsetTop <= scrollY) current = id;
      }
      setActive(current);
    }
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('scroll', handler);
      window.removeEventListener('resize', handler);
    };
  }, [sectionIds, offset]);

  return active;
}
