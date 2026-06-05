import Link from 'next/link';
import Image from 'next/image';
import { getProducts, getCollections, formatMoney } from '@/lib/shopify';
import ProductCard from '@/components/ProductCard';

export const revalidate = 60;

export default async function HomePage() {
  const [{ nodes: products }, collections] = await Promise.all([
    getProducts(8),
    getCollections(),
  ]);

  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          padding: 'clamp(80px,12vw,160px) clamp(16px,4vw,48px) 80px',
          textAlign: 'center',
        }}
      >
        {/* Radial glow behind heading */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(204,0,0,.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        {/* Grid overlay */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            maskImage: 'radial-gradient(ellipse 80% 80% at 50% 40%, black 0%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />

        <span
          className="badge badge--red fade-up"
          style={{ marginBottom: 24 }}
        >
          <span>●</span>
          <span>UAE&apos;s #1 Aerodynamic Styling Destination</span>
        </span>

        <h1
          className="fade-up fade-up--delay-1"
          style={{
            fontSize: 'clamp(40px, 8vw, 88px)',
            fontWeight: 900,
            letterSpacing: '-.04em',
            lineHeight: 1,
            maxWidth: '13ch',
          }}
        >
          BUILT TO{' '}
          <span style={{ color: 'var(--red)', display: 'inline-block' }}>
            DOMINATE.
          </span>
        </h1>

        <p
          className="fade-up fade-up--delay-2"
          style={{
            marginTop: 24,
            fontSize: 'clamp(15px,2vw,18px)',
            color: 'rgba(242,242,242,.65)',
            maxWidth: 560,
            lineHeight: 1.7,
          }}
        >
          Precision-engineered aerodynamic body kits for exotic and performance
          vehicles. Shipped across the UAE in 24–48 hours.
        </p>

        <div
          className="fade-up fade-up--delay-3"
          style={{ display: 'flex', gap: 12, marginTop: 36, flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <Link href="/products" className="btn btn-primary">
            Shop All Parts →
          </Link>
          <Link href="/collections" className="btn btn-ghost">
            Browse Collections
          </Link>
        </div>

        {/* Scroll indicator */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            color: 'rgba(255,255,255,.2)',
            fontSize: 11,
            letterSpacing: '.1em',
            textTransform: 'uppercase',
          }}
        >
          <span>Scroll</span>
          <span
            style={{
              display: 'block',
              width: 1,
              height: 40,
              background: 'linear-gradient(to bottom, rgba(204,0,0,.6), transparent)',
            }}
          />
        </div>
      </section>

      {/* ─── Collections ──────────────────────────────────────────── */}
      {collections.length > 0 && (
        <section style={{ padding: 'clamp(48px,8vw,96px) 0' }}>
          <div className="container">
            <div style={{ marginBottom: 40 }}>
              <span
                className="badge badge--red"
                style={{ marginBottom: 12, display: 'inline-flex' }}
              >
                Collections
              </span>
              <h2
                style={{
                  fontSize: 'clamp(22px,3.5vw,36px)',
                  fontWeight: 900,
                  letterSpacing: '-.03em',
                }}
              >
                Shop by Category
              </h2>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: 16,
              }}
            >
              {collections.slice(0, 6).map((col) => (
                <Link
                  key={col.id}
                  href={`/collections/${col.handle}`}
                  style={{
                    position: 'relative',
                    aspectRatio: '3/2',
                    borderRadius: 10,
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,.06)',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: 16,
                    background: '#111',
                    transition: 'border-color .25s, transform .3s cubic-bezier(.19,1,.22,1)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(204,0,0,.35)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,.06)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  }}
                >
                  {col.image && (
                    <Image
                      src={col.image.url}
                      alt={col.image.altText ?? col.title}
                      fill
                      style={{ objectFit: 'cover', opacity: .55 }}
                      sizes="(max-width: 640px) 100vw, 280px"
                    />
                  )}
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 800,
                        letterSpacing: '.04em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {col.title}
                    </p>
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'linear-gradient(to top, rgba(0,0,0,.8) 0%, transparent 60%)',
                      zIndex: 0,
                    }}
                    aria-hidden
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Featured Products ─────────────────────────────────────── */}
      <section style={{ padding: 'clamp(48px,8vw,96px) 0' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: 40,
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            <div>
              <span
                className="badge badge--red"
                style={{ marginBottom: 12, display: 'inline-flex' }}
              >
                Best Sellers
              </span>
              <h2
                style={{
                  fontSize: 'clamp(22px,3.5vw,36px)',
                  fontWeight: 900,
                  letterSpacing: '-.03em',
                }}
              >
                Featured Products
              </h2>
            </div>
            <Link
              href="/products"
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--red)',
                letterSpacing: '.04em',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              View All <span>→</span>
            </Link>
          </div>

          {products.length === 0 ? (
            <div
              style={{
                padding: '80px 0',
                textAlign: 'center',
                color: 'rgba(255,255,255,.3)',
                fontSize: 14,
              }}
            >
              Products loading... Make sure Storefront API permissions are enabled in your Shopify admin.
            </div>
          ) : (
            <div className="products-grid">
              {products.map((product, i) => (
                <ProductCard key={product.id} product={product} priority={i < 4} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── UAE Delivery Banner ──────────────────────────────────── */}
      <section
        style={{
          padding: 'clamp(48px,6vw,80px) 0',
          borderTop: '1px solid rgba(255,255,255,.05)',
          borderBottom: '1px solid rgba(255,255,255,.05)',
          background: 'rgba(204,0,0,.03)',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 32,
              textAlign: 'center',
            }}
          >
            {[
              { icon: '🚚', title: '24–48hr Delivery', desc: 'All UAE emirates' },
              { icon: '🛡️', title: 'Quality Guaranteed', desc: '100% authentic products' },
              { icon: '🔧', title: 'Expert Fitment', desc: 'Professional installation tips' },
              { icon: '💬', title: 'WhatsApp Support', desc: 'Live chat, 7 days a week' },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 28 }}>{icon}</span>
                <p style={{ fontWeight: 700, fontSize: 14, letterSpacing: '.02em' }}>{title}</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,.45)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────── */}
      <section style={{ padding: 'clamp(64px,10vw,120px) 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: 640 }}>
          <h2
            style={{
              fontSize: 'clamp(24px,4vw,42px)',
              fontWeight: 900,
              letterSpacing: '-.03em',
              lineHeight: 1.1,
            }}
          >
            NOT SURE WHAT FITS{' '}
            <span style={{ color: 'var(--red)' }}>YOUR CAR?</span>
          </h2>
          <p style={{ marginTop: 16, color: 'rgba(255,255,255,.55)', fontSize: 15, lineHeight: 1.7 }}>
            Message us on WhatsApp with your car model and year. We&apos;ll recommend the
            perfect kit and give you a custom quote within minutes.
          </p>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '97100000000'}?text=Hi%2C%20I%27m%20looking%20for%20a%20body%20kit%20for%20my%20car.`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
            style={{
              marginTop: 28,
              background: '#25d366',
              color: '#fff',
              border: 'none',
              fontSize: 15,
              padding: '14px 32px',
              borderRadius: 8,
              boxShadow: '0 0 32px rgba(37,211,102,.25)',
              display: 'inline-flex',
            }}
          >
            💬 Chat on WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
