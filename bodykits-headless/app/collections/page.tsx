import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getCollections } from '@/lib/shopify';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Collections',
  description: 'Browse our curated collections of premium automotive body kits and aerodynamic parts.',
};

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <>
      <div style={{ height: 64 }} aria-hidden />

      <div className="container" style={{ padding: 'clamp(32px,5vw,64px) clamp(16px,4vw,48px)' }}>
        <div style={{ marginBottom: 40 }}>
          <span className="badge badge--red" style={{ marginBottom: 12, display: 'inline-flex' }}>
            Collections
          </span>
          <h1
            style={{
              fontSize: 'clamp(24px,4vw,44px)',
              fontWeight: 900,
              letterSpacing: '-.03em',
            }}
          >
            Browse by Collection
          </h1>
        </div>

        {collections.length === 0 ? (
          <div style={{ padding: '80px 0', textAlign: 'center', color: 'rgba(255,255,255,.3)', fontSize: 14 }}>
            No collections found.
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 20,
            }}
          >
            {collections.map((col) => (
              <Link
                key={col.id}
                href={`/collections/${col.handle}`}
                style={{
                  position: 'relative',
                  aspectRatio: '4/3',
                  borderRadius: 12,
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,.06)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: 20,
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
                    style={{ objectFit: 'cover', opacity: .5 }}
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                )}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,.85) 0%, rgba(0,0,0,.2) 60%, transparent 100%)',
                    zIndex: 0,
                  }}
                  aria-hidden
                />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <p style={{ fontSize: 16, fontWeight: 800, letterSpacing: '.02em' }}>{col.title}</p>
                  {col.description && (
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,.55)', marginTop: 4, lineHeight: 1.5 }}>
                      {col.description.slice(0, 80)}{col.description.length > 80 ? '...' : ''}
                    </p>
                  )}
                  <p style={{ fontSize: 12, color: 'var(--red)', marginTop: 8, fontWeight: 600 }}>
                    Shop Now →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
