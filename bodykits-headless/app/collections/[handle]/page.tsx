import { Metadata } from 'next';
import { getCollectionByHandle } from '@/lib/shopify';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import Image from 'next/image';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { handle: string } }): Promise<Metadata> {
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
        <div className="page-hero">
          <div className="page-hero__inner container">
            <p className="page-hero__tag">Error</p>
            <h1 className="page-hero__title">Not Found</h1>
          </div>
        </div>
        <div className="container" style={{ padding: 'clamp(3rem,6vw,6rem) var(--sx)', textAlign: 'center' }}>
          <p style={{ color: 'var(--gray-600)', fontFamily: 'var(--ff-a)', letterSpacing: '.16em', textTransform: 'uppercase', fontSize: '.78rem' }}>
            Collection not found
          </p>
          <Link href="/collections" className="btn-ghost" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
            ← All Collections
          </Link>
        </div>
      </>
    );
  }

  const { nodes: products, pageInfo } = collection.products;

  return (
    <>
      {/* Hero */}
      <div className="page-hero" style={{ textAlign: 'center' }}>
        {collection.image && (
          <Image
            src={collection.image.url}
            alt={collection.image.altText ?? collection.title}
            fill
            style={{ objectFit: 'cover', opacity: .12, zIndex: 0 }}
            sizes="100vw"
            priority
          />
        )}
        <div className="page-hero__inner container">
          <nav className="breadcrumb" style={{ justifyContent: 'center' }}>
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/collections">Collections</Link>
            <span>/</span>
            <span>{collection.title}</span>
          </nav>
          <p className="page-hero__tag">Collection</p>
          <h1 className="page-hero__title">{collection.title}</h1>
          {collection.description && (
            <p className="page-hero__sub" style={{ margin: '1rem auto 0', textAlign: 'center' }}>
              {collection.description}
            </p>
          )}
          <p style={{ marginTop: '.8rem', fontFamily: 'var(--ff-a)', fontSize: '.62rem', letterSpacing: '.28em', textTransform: 'uppercase', color: 'var(--gray-600)' }}>
            {products.length} Product{products.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <section className="container" style={{ padding: '0 var(--sx) clamp(5rem,10vw,10rem)' }}>
        {products.length === 0 ? (
          <div style={{ padding: '5rem 0', textAlign: 'center', color: 'var(--gray-600)', fontFamily: 'var(--ff-a)', letterSpacing: '.2em', textTransform: 'uppercase', fontSize: '.8rem' }}>
            No products in this collection yet
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} priority={i < 8} />
            ))}
          </div>
        )}

        {pageInfo.hasNextPage && (
          <div className="pagination">
            <Link href={`/collections/${params.handle}?after=${pageInfo.endCursor}`} className="btn-ghost">
              Load More →
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
