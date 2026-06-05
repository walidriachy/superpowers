'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { cart, setCartOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const qty = cart?.totalQuantity ?? 0;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 100,
        height: 64,
        display: 'flex',
        alignItems: 'center',
        padding: '0 clamp(16px,4vw,48px)',
        background: scrolled
          ? 'rgba(10,10,10,.92)'
          : 'linear-gradient(to bottom, rgba(0,0,0,.7), transparent)',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,.06)' : 'none',
        transition: 'background .4s, backdrop-filter .4s, border-color .4s',
      }}
    >
      {/* Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 'auto' }}>
        <span
          style={{
            display: 'inline-block',
            width: 32, height: 32,
            background: 'var(--red)',
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          }}
        />
        <span style={{ fontSize: 17, fontWeight: 900, letterSpacing: '-.02em' }}>
          BODY<span style={{ color: 'var(--red)' }}>KITS</span>
        </span>
      </Link>

      {/* Desktop nav */}
      <nav style={{ display: 'flex', gap: 4, marginRight: 24 }} className="desktop-nav">
        {[
          { label: 'Shop', href: '/products' },
          { label: 'Collections', href: '/collections' },
        ].map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 600,
              color: 'rgba(255,255,255,.75)',
              letterSpacing: '.02em',
              transition: 'color .2s, background .2s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = '#fff';
              (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,.06)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,.75)';
              (e.currentTarget as HTMLElement).style.background = 'transparent';
            }}
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* Cart button */}
      <button
        onClick={() => setCartOpen(true)}
        aria-label={`Open cart, ${qty} items`}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 40, height: 40,
          borderRadius: 8,
          border: '1px solid rgba(255,255,255,.1)',
          background: 'rgba(255,255,255,.04)',
          transition: 'all .2s',
          fontSize: 18,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(204,0,0,.5)';
          (e.currentTarget as HTMLElement).style.background = 'rgba(204,0,0,.1)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,.1)';
          (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,.04)';
        }}
      >
        🛒
        {qty > 0 && (
          <span
            style={{
              position: 'absolute',
              top: -6, right: -6,
              minWidth: 18, height: 18,
              background: 'var(--red)',
              borderRadius: 9,
              fontSize: 10,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 4px',
              border: '2px solid var(--bg)',
            }}
          >
            {qty > 99 ? '99+' : qty}
          </span>
        )}
      </button>

      {/* WhatsApp */}
      <a
        href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '97100000000'}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact on WhatsApp"
        style={{
          marginLeft: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 40, height: 40,
          borderRadius: 8,
          border: '1px solid rgba(37,211,102,.25)',
          background: 'rgba(37,211,102,.06)',
          fontSize: 18,
          transition: 'all .2s',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(37,211,102,.6)';
          (e.currentTarget as HTMLElement).style.background = 'rgba(37,211,102,.12)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(37,211,102,.25)';
          (e.currentTarget as HTMLElement).style.background = 'rgba(37,211,102,.06)';
        }}
      >
        💬
      </a>

      <style>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
        }
      `}</style>
    </header>
  );
}
