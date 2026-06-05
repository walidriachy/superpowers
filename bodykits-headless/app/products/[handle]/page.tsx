'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { getProductByHandle, formatMoney } from '@/lib/shopify';
import type { ShopifyProduct, ShopifyVariant } from '@/lib/shopify';

export default function ProductPage({ params }: { params: { handle: string } }) {
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
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
        const defaults: Record<string, string> = {};
        p.options.forEach((opt) => { defaults[opt.name] = opt.values[0]; });
        setSelectedOptions(defaults);
        setSelectedVariant(p.variants.nodes[0] ?? null);
      }
      setDataLoading(false);
    });
  }, [params.handle]);

  useEffect(() => {
    if (!product) return;
    const match = product.variants.nodes.find((v) =>
      v.selectedOptions.every((opt) => selectedOptions[opt.name] === opt.value)
    );
    setSelectedVariant(match ?? null);
  }, [selectedOptions, product]);

  const handleAddToCart = async () => {
    if (!selectedVariant?.availableForSale) return;
    setAdding(true);
    await addItem(selectedVariant.id);
    setAdding(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const waNum = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '97100000000';

  if (dataLoading) {
    return (
      <>
        <div style={{ height: '70px' }} aria-hidden="true" />
        <div className="container" style={{ padding: 'clamp(2rem,5vw,5rem) var(--sx)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
            <div className="skeleton" style={{ aspectRatio: '1', borderRadius: 2 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div className="skeleton" style={{ height: 14, width: '35%' }} />
              <div className="skeleton" style={{ height: 52, width: '85%' }} />
              <div className="skeleton" style={{ height: 36, width: '28%' }} />
              <div className="skeleton" style={{ height: 120 }} />
              <div className="skeleton" style={{ height: 56 }} />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <div className="page-hero">
          <div className="page-hero__inner container">
            <p className="page-hero__tag">Error</p>
            <h1 className="page-hero__title">Product Not Found</h1>
          </div>
        </div>
        <div className="container" style={{ padding: 'clamp(3rem,6vw,6rem) var(--sx)', textAlign: 'center' }}>
          <Link href="/products" className="btn-ghost" style={{ display: 'inline-flex' }}>
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
      <div style={{ height: '70px' }} aria-hidden="true" />

      <div className="container" style={{ padding: 'clamp(2.5rem,5vw,5rem) var(--sx) clamp(4rem,8vw,8rem)' }}>
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/products">Products</Link>
          <span>/</span>
          <span>{product.title}</span>
        </nav>

        {/* Main grid */}
        <div className="pdp-grid">
          {/* ── Image column ── */}
          <div>
            <div className="pdp-main-img">
              {currentImage ? (
                <Image
                  src={currentImage.url}
                  alt={currentImage.altText ?? product.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 55vw"
                  priority
                />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--gray-600)' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <rect x="1" y="3" width="15" height="13" rx="1"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                    <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                  </svg>
                </div>
              )}
              <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 60%, rgba(4,4,4,.35))', pointerEvents: 'none' }} />
            </div>

            {images.length > 1 && (
              <div className="pdp-thumbs">
                {images.map((img, i) => (
                  <button
                    key={i}
                    className={`pdp-thumb${i === activeImage ? ' active' : ''}`}
                    onClick={() => setActiveImage(i)}
                    aria-label={`View image ${i + 1}`}
                  >
                    <Image
                      src={img.url}
                      alt={img.altText ?? `${product.title} ${i + 1}`}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Details column ── */}
          <div className="pdp-details">
            {product.vendor && (
              <p className="pdp-vendor">{product.vendor}</p>
            )}

            <h1 className="pdp-title">{product.title}</h1>

            {/* Price */}
            <div className="pdp-price-row">
              <span className="pdp-price">{formatMoney(price)}</span>
              {isSale && compareAt && (
                <>
                  <span className="pdp-compare">{formatMoney(compareAt)}</span>
                  <span className="pdp-sale-badge">Sale</span>
                </>
              )}
            </div>

            {/* Variant selectors */}
            {product.options
              .filter((opt) => !(opt.values.length === 1 && opt.name === 'Title'))
              .map((opt) => (
                <div key={opt.name} className="pdp-option">
                  <p className="pdp-option__label">
                    {opt.name}:{' '}
                    <span className="pdp-option__value">{selectedOptions[opt.name]}</span>
                  </p>
                  <div className="variant-opts">
                    {opt.values.map((val) => (
                      <button
                        key={val}
                        className={`variant-btn${selectedOptions[opt.name] === val ? ' active' : ''}`}
                        onClick={() => setSelectedOptions((prev) => ({ ...prev, [opt.name]: val }))}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

            {/* Stock status */}
            {selectedVariant && !selectedVariant.availableForSale && (
              <p className="pdp-out-of-stock">This variant is currently out of stock</p>
            )}

            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              disabled={adding || !selectedVariant?.availableForSale}
              className={`btn-red pdp-atc${added ? ' added' : ''}${(!selectedVariant?.availableForSale) ? ' disabled' : ''}`}
              style={{ width: '100%', justifyContent: 'center', fontSize: '.88rem' }}
            >
              <span>
                {adding ? 'Adding…' : added ? '✓ Added to Cart' : !selectedVariant?.availableForSale ? 'Out of Stock' : 'Add to Cart'}
              </span>
            </button>

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/${waNum}?text=${encodeURIComponent(`Hi, I'm interested in: ${product.title}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost pdp-wa"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Ask on WhatsApp
            </a>

            {/* Description */}
            {product.descriptionHtml && (
              <div className="pdp-desc">
                <p className="pdp-desc__label">Description</p>
                <div
                  className="pdp-desc__body"
                  dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                />
              </div>
            )}

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="pdp-tags">
                {product.tags.map((tag) => (
                  <span key={tag} className="pdp-tag">{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
