'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { getProductByHandle, formatMoney } from '@/lib/shopify';
import type { ShopifyProduct, ShopifyVariant } from '@/lib/shopify';

// Client component so we can handle variant selection + add-to-cart
export default function ProductPage({ params }: { params: { handle: string } }) {
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedVariant, setSelectedVariant] = useState<ShopifyVariant | null>(null);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    getProductByHandle(params.handle).then((p) => {
      setProduct(p);
      if (p) {
        // Pre-select first option of each type
        const defaults: Record<string, string> = {};
        p.options.forEach((opt) => {
          defaults[opt.name] = opt.values[0];
        });
        setSelectedOptions(defaults);
        setSelectedVariant(p.variants.nodes[0] ?? null);
      }
      setLoading(false);
    });
  }, [params.handle]);

  // Update selected variant when options change
  useEffect(() => {
    if (!product) return;
    const match = product.variants.nodes.find((v) =>
      v.selectedOptions.every((opt) => selectedOptions[opt.name] === opt.value)
    );
    setSelectedVariant(match ?? null);
  }, [selectedOptions, product]);

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    setAdding(true);
    await addItem(selectedVariant.id);
    setAdding(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <>
        <div style={{ height: 64 }} aria-hidden />
        <div className="container" style={{ padding: '40px clamp(16px,4vw,48px)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
            <div className="skeleton" style={{ aspectRatio: '1', borderRadius: 10 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="skeleton" style={{ height: 24, width: '40%' }} />
              <div className="skeleton" style={{ height: 36, width: '80%' }} />
              <div className="skeleton" style={{ height: 20, width: '30%' }} />
              <div className="skeleton" style={{ height: 100 }} />
              <div className="skeleton" style={{ height: 48, borderRadius: 8 }} />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <div style={{ height: 64 }} aria-hidden />
        <div className="container" style={{ padding: '80px clamp(16px,4vw,48px)', textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 14 }}>Product not found.</p>
          <Link href="/products" className="btn btn-ghost" style={{ marginTop: 20 }}>
            ← Back to Products
          </Link>
        </div>
      </>
    );
  }

  const images = product.images.nodes;
  const currentImage = images[activeImage] ?? product.featuredImage;
  const price = selectedVariant?.price ?? product.priceRange.minVariantPrice;
  const compareAt = selectedVariant?.compareAtPrice;
  const isSale = compareAt && parseFloat(compareAt.amount) > parseFloat(price.amount);

  return (
    <>
      <div style={{ height: 64 }} aria-hidden />

      <div className="container" style={{ padding: 'clamp(32px,5vw,60px) clamp(16px,4vw,48px)' }}>
        {/* Breadcrumb */}
        <nav style={{ display: 'flex', gap: 8, fontSize: 12, color: 'rgba(255,255,255,.4)', marginBottom: 32, alignItems: 'center' }}>
          <Link href="/" style={{ transition: 'color .2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,.4)')}
          >Home</Link>
          <span>/</span>
          <Link href="/products" style={{ transition: 'color .2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,.4)')}
          >Products</Link>
          <span>/</span>
          <span style={{ color: 'rgba(255,255,255,.7)' }}>{product.title}</span>
        </nav>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
            gap: 'clamp(24px,5vw,64px)',
          }}
        >
          {/* Images */}
          <div>
            <div
              style={{
                position: 'relative',
                aspectRatio: '1',
                borderRadius: 12,
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,.07)',
                background: '#0f0f0f',
                marginBottom: 12,
              }}
            >
              {currentImage ? (
                <Image
                  src={currentImage.url}
                  alt={currentImage.altText ?? product.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 48, opacity: .2 }}>🚗</div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    style={{
                      width: 64, height: 64,
                      borderRadius: 6,
                      overflow: 'hidden',
                      border: `2px solid ${i === activeImage ? 'var(--red)' : 'rgba(255,255,255,.08)'}`,
                      position: 'relative',
                      flex: 'none',
                      background: '#111',
                      transition: 'border-color .2s',
                    }}
                    aria-label={`View image ${i + 1}`}
                  >
                    <Image
                      src={img.url}
                      alt={img.altText ?? `${product.title} ${i + 1}`}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {product.vendor && (
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--red)' }}>
                {product.vendor}
              </p>
            )}

            <h1
              style={{
                fontSize: 'clamp(20px,3vw,32px)',
                fontWeight: 900,
                letterSpacing: '-.03em',
                lineHeight: 1.15,
              }}
            >
              {product.title}
            </h1>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-.02em' }}>
                {formatMoney(price)}
              </span>
              {isSale && compareAt && (
                <>
                  <span style={{ fontSize: 16, color: 'rgba(255,255,255,.35)', textDecoration: 'line-through' }}>
                    {formatMoney(compareAt)}
                  </span>
                  <span className="badge badge--sale">SALE</span>
                </>
              )}
            </div>

            {/* Variant selectors */}
            {product.options
              .filter((opt) => opt.values.length > 1 || opt.name !== 'Title')
              .map((opt) => (
                <div key={opt.name}>
                  <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 10, color: 'rgba(255,255,255,.6)' }}>
                    {opt.name}:{' '}
                    <span style={{ color: '#fff', fontWeight: 600, textTransform: 'none', letterSpacing: 0 }}>
                      {selectedOptions[opt.name]}
                    </span>
                  </p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {opt.values.map((val) => {
                      const isSelected = selectedOptions[opt.name] === val;
                      return (
                        <button
                          key={val}
                          onClick={() => setSelectedOptions((prev) => ({ ...prev, [opt.name]: val }))}
                          style={{
                            padding: '7px 14px',
                            borderRadius: 6,
                            fontSize: 13,
                            fontWeight: 600,
                            border: `1px solid ${isSelected ? 'rgba(204,0,0,.8)' : 'rgba(255,255,255,.12)'}`,
                            background: isSelected ? 'rgba(204,0,0,.12)' : 'rgba(255,255,255,.03)',
                            color: isSelected ? '#fff' : 'rgba(255,255,255,.6)',
                            transition: 'all .15s',
                            cursor: 'pointer',
                          }}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

            {/* Availability */}
            {selectedVariant && !selectedVariant.availableForSale && (
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,.4)', fontWeight: 600 }}>
                This variant is currently out of stock
              </p>
            )}

            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              disabled={adding || !selectedVariant?.availableForSale}
              className="btn btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '16px',
                fontSize: 15,
                opacity: (!selectedVariant?.availableForSale) ? .4 : 1,
                cursor: (!selectedVariant?.availableForSale) ? 'not-allowed' : 'pointer',
                background: added ? '#22c55e' : 'var(--red)',
                borderColor: added ? '#22c55e' : 'var(--red)',
                transition: 'background .3s, border-color .3s',
              }}
            >
              {adding ? 'Adding...' : added ? '✓ Added to Cart' : selectedVariant?.availableForSale === false ? 'Out of Stock' : 'Add to Cart'}
            </button>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '97100000000'}?text=Hi%2C%20I%27m%20interested%20in%20the%20${encodeURIComponent(product.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
              style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 14 }}
            >
              💬 Ask on WhatsApp
            </a>

            {/* Description */}
            {product.descriptionHtml && (
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', marginBottom: 12 }}>
                  Description
                </p>
                <div
                  style={{ fontSize: 14, color: 'rgba(255,255,255,.6)', lineHeight: 1.7 }}
                  dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                />
              </div>
            )}

            {/* Tags */}
            {product.tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      padding: '3px 10px',
                      borderRadius: 4,
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: '.04em',
                      background: 'rgba(255,255,255,.04)',
                      border: '1px solid rgba(255,255,255,.08)',
                      color: 'rgba(255,255,255,.4)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: minmax(0,1fr) minmax(0,1fr)"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
