import { Metadata } from 'next';
import { getCollectionByHandle } from '@/lib/shopify';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import Image from 'next/image';

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const col = await getCollectionByHandle(params.handle, 1);
  if (!col) return { title: 'Collection Not Found' };
  return {
    title: col.title,
    description: col.description || `Shop ${col.title} at Bodykits.ae`,
  };
}

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: { handle: string };
  searchParams: { after?: string };
}) {
  const collection = await getCollectionByHandle(params.handle, 24, searchParams.after);

  if (!collection) {
    return (
      <>
        <div style={{ height: 64 }} aria-hidden />
        <div className="container" style={{ padding: '80px clamp(16px,4vw,48px)', textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,.4)' }}>Collection not found.</p>
          <Link href="/collections" className="btn btn-ghost" style={{ marginTop: 20 }}>
            ← All Collections
          </Link>
        </div>
      </>
    );
  }

  const { nodes: products, pageInfo } = collection.products;

  return (
    <>
      <div style={{ height: 64 }} aria-hidden />

      {/* Collection hero */}
      <div
        style={{
          position: 'relative',
          padding: 'clamp(48px,8vw,96px) clamp(16px,4vw,48px)',
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        {collection.image && (
          <Image
            src={collection.image.url}
            alt={collection.image.altText ?? collection.title}
            fill
            style={{ objectFit: 'cover', opacity: .18 }}
            sizes="100vw"
            priority
          />
        )}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, transparent, var(--bg))',
            zIndex: 0,
          }}
        />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <nav style={{ display: 'flex', gap: 8, fontSize: 12, color: 'rgba(255,255,255,.35)', marginBottom: 24, justifyContent: 'center', alignItems: 'center' }}>
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/collections">Collections</Link>
            <span>/</span>
            <span style={{ color: 'rgba(255,255,255,.65)' }}>{collection.title}</span>
          </nav>
          <h1
            style={{
              fontSize: 'clamp(24px,5vw,52px)',
              fontWeight: 900,
              letterSpacing: '-.04em',
              lineHeight: 1.05,
            }}
          >
            {collection.title}
          </h1>
          {collection.description && (
            <p
              style={{
                marginTop: 16,
                fontSize: 15,
                color: 'rgba(255,255,255,.5)',
                maxWidth: 480,
                margin: '16px auto 0',
                lineHeight: 1.6,
              }}
            >
              {collection.description}
            </p>
          )}
          <p style={{ marginTop: 12, fontSize: 12, color: 'rgba(255,255,255,.3)' }}>
            {products.length} product{products.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '0 clamp(16px,4vw,48px) clamp(48px,6vw,80px)' }}>
        {products.length === 0 ? (
          <div style={{ padding: '80px 0', textAlign: 'center', color: 'rgba(255,255,255,.3)', fontSize: 14 }}>
            No products in this collection yet.
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} priority={i < 8} />
            ))}
          </div>
        )}

        {pageInfo.hasNextPage && (
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link
              href={`/collections/${params.handle}?after=${pageInfo.endCursor}`}
              className="btn btn-ghost"
            >
              Load More →
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
