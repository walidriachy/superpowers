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
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const waNum = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '97100000000';

  return (
    <>
      <header className={`site-nav${scrolled ? ' scrolled' : ''}`}>
        <Link href="/" className="nav-logo" aria-label="Bodykits.ae home">
          <span className="nav-logo__hex" aria-hidden="true" />
          <span className="nav-logo__text">
            BODY<em>KITS</em><span className="nav-logo__tld">.AE</span>
          </span>
        </Link>

        <nav className="nav-links" aria-label="Main navigation">
          <Link href="/products" className="nav-link">Shop</Link>
          <Link href="/collections" className="nav-link">Collections</Link>
          <a href={`https://wa.me/${waNum}`} className="nav-link" target="_blank" rel="noopener noreferrer">Contact</a>
        </nav>

        <div className="nav-actions">
          <button
            className="nav-cart"
            onClick={() => setCartOpen(true)}
            aria-label={`Open cart, ${qty} items`}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {qty > 0 && <span className="nav-cart__badge">{qty > 99 ? '99+' : qty}</span>}
          </button>

          <Link href="/products" className="nav-cta">
            <span>Shop Now</span>
          </Link>

          <button
            className={`nav-burger${mobileOpen ? ' open' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      <div className={`nav-mobile${mobileOpen ? ' open' : ''}`} aria-hidden={!mobileOpen}>
        <Link href="/products" className="nav-mobile__link" onClick={() => setMobileOpen(false)}>Shop</Link>
        <Link href="/collections" className="nav-mobile__link" onClick={() => setMobileOpen(false)}>Collections</Link>
        <a href={`https://wa.me/${waNum}`} className="nav-mobile__link" target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)}>Contact</a>
        <button
          className="btn-red nav-mobile__cart"
          onClick={() => { setCartOpen(true); setMobileOpen(false); }}
        >
          <span>View Cart{qty > 0 ? ` (${qty})` : ''}</span>
        </button>
      </div>
      <div
        className={`nav-mobile__overlay${mobileOpen ? ' open' : ''}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />
    </>
  );
}
