import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getCollections } from '@/lib/shopify';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Collections',
  description: 'Browse our curated collections of premium automotive body kits and aerodynamic parts by car brand and style.',
};

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <>
      <div className="page-hero">
        <div className="page-hero__inner container">
          <p className="page-hero__tag">Browse</p>
          <h1 className="page-hero__title">
            Our <span className="r">Collections</span>
          </h1>
          <p className="page-hero__sub">
            Curated by car brand and style — find the perfect aerodynamic kit for your vehicle
          </p>
        </div>
      </div>

      <section className="container" style={{ padding: '0 var(--sx) clamp(5rem,10vw,10rem)' }}>
        {collections.length === 0 ? (
          <div style={{ padding: '5rem 0', textAlign: 'center', color: 'var(--gray-600)', fontFamily: 'var(--ff-a)', letterSpacing: '.2em', textTransform: 'uppercase', fontSize: '.8rem' }}>
            No collections found
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {collections.map((col) => (
              <Link key={col.id} href={`/collections/${col.handle}`} className="col-card">
                {col.image && (
                  <Image
                    src={col.image.url}
                    alt={col.image.altText ?? col.title}
                    fill
                    className="col-card__bg"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                  />
                )}
                <div className="col-card__overlay" aria-hidden="true" />
                <div className="col-card__content">
                  <p className="col-card__name">{col.title}</p>
                  {col.description && (
                    <p style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.5)', marginBottom: '.55rem', lineHeight: 1.5, fontWeight: 300 }}>
                      {col.description.length > 70 ? col.description.slice(0, 70) + '…' : col.description}
                    </p>
                  )}
                  <span className="col-card__cta">
                    Shop Now <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
