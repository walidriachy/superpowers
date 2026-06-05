import { Metadata } from 'next';
import { getProducts } from '@/lib/shopify';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Shop All Products',
  description: 'Browse our full range of premium automotive body kits, splitters, diffusers and aerodynamic styling parts for exotic vehicles.',
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { after?: string };
}) {
  const { nodes: products, pageInfo } = await getProducts(24, searchParams.after);

  return (
    <>
      <div className="page-hero">
        <div className="page-hero__inner container">
          <p className="page-hero__tag">Catalog</p>
          <h1 className="page-hero__title">
            All <span className="r">Products</span>
          </h1>
          <p className="page-hero__sub">
            {products.length > 0
              ? `${products.length}+ premium aerodynamic parts available`
              : 'Premium aerodynamic parts for exotic & performance vehicles'}
          </p>
        </div>
      </div>

      <section className="container" style={{ padding: '0 var(--sx) clamp(5rem,10vw,10rem)' }}>
        {products.length === 0 ? (
          <div style={{ padding: '5rem 0', textAlign: 'center', color: 'var(--gray-600)' }}>
            <p style={{ fontFamily: 'var(--ff-a)', letterSpacing: '.2em', textTransform: 'uppercase', fontSize: '.8rem' }}>
              No products found
            </p>
            <p style={{ fontSize: '.75rem', marginTop: '.8rem', color: 'var(--gray-600)' }}>
              Check Shopify Admin → Apps → Headless → Storefront API permissions
            </p>
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
            <Link href={`/products?after=${pageInfo.endCursor}`} className="btn-ghost">
              Load More Products →
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
