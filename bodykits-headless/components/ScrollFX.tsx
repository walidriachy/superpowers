'use client';

import { useEffect } from 'react';

export default function ScrollFX() {
  useEffect(() => {
    const bar = document.getElementById('spb');
    if (!bar) return;

    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const pct = scrollHeight <= clientHeight ? 0 : (scrollTop / (scrollHeight - clientHeight)) * 100;
      bar.style.width = `${pct}%`;
    };

    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return <div id="spb" aria-hidden="true" />;
}
