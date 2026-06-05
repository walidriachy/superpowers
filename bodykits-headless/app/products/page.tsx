import { Metadata } from 'next';
import { getProducts } from '@/lib/shopify';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'All Products',
  description: 'Browse our full range of premium automotive body kits, splitters, diffusers and aerodynamic styling parts.',
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { after?: string };
}) {
  const { nodes: products, pageInfo } = await getProducts(24, searchParams.after);

  return (
    <>
      <div style={{ height: 64 }} aria-hidden />

      <div className="container" style={{ padding: 'clamp(32px,5vw,64px) clamp(16px,4vw,48px)' }}>
        <div className="page-hero" style={{ textAlign: 'left', padding: '0 0 40px' }}>
          <span className="badge badge--red" style={{ marginBottom: 12, display: 'inline-flex' }}>
            Shop
          </span>
          <h1
            style={{
              fontSize: 'clamp(24px,4vw,44px)',
              fontWeight: 900,
              letterSpacing: '-.03em',
            }}
          >
            All Products
          </h1>
          <p style={{ marginTop: 8, color: 'rgba(255,255,255,.5)', fontSize: 14 }}>
            {products.length === 0 ? 'Loading...' : `${products.length}+ products available`}
          </p>
        </div>

        {products.length === 0 ? (
          <div
            style={{
              padding: '80px 0',
              textAlign: 'center',
              color: 'rgba(255,255,255,.3)',
              fontSize: 14,
              lineHeight: 2,
            }}
          >
            <p>No products found.</p>
            <p style={{ fontSize: 12, marginTop: 8 }}>
              Check that <code>unauthenticated_read_product_listings</code> is enabled
              in Shopify Admin → Apps → Headless → Storefront API permissions.
            </p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} priority={i < 8} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pageInfo.hasNextPage && (
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link
              href={`/products?after=${pageInfo.endCursor}`}
              className="btn btn-ghost"
            >
              Load More Products →
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
