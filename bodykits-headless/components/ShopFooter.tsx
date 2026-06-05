import Link from 'next/link';

export default function ShopFooter() {
  const waNum = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '97100000000';
  const year = new Date().getFullYear();

  return (
    <footer>
      <div className="container">
        <div className="foot-grid">
          <div>
            <p className="foot-logo">BODY<em>KITS</em>.AE</p>
            <p className="foot-tag">
              UAE&apos;s premier destination for exotic and performance vehicle aerodynamics.
              Premium body kits, splitters, diffusers &amp; widebody conversions.
            </p>
          </div>

          <div className="foot-col">
            <h5>Shop</h5>
            <ul>
              <li><Link href="/products">All Products</Link></li>
              <li><Link href="/collections">Collections</Link></li>
              <li><Link href="/collections/new-arrivals">New Arrivals</Link></li>
              <li><Link href="/collections/sale">Sale</Link></li>
            </ul>
          </div>

          <div className="foot-col">
            <h5>Brands</h5>
            <ul>
              <li><Link href="/collections/bmw">BMW</Link></li>
              <li><Link href="/collections/mercedes">Mercedes</Link></li>
              <li><Link href="/collections/lamborghini">Lamborghini</Link></li>
              <li><Link href="/collections/ferrari">Ferrari</Link></li>
            </ul>
          </div>

          <div className="foot-col">
            <h5>Contact</h5>
            <ul>
              <li>
                <a href={`https://wa.me/${waNum}`} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </li>
              <li><a href="mailto:info@bodykits.ae">Email Us</a></li>
              <li><span style={{ color: 'var(--gray-600)', fontSize: '.8rem' }}>Dubai, UAE</span></li>
            </ul>
          </div>
        </div>

        <div className="foot-bottom">
          <p className="foot-copy">
            © {year} Bodykits.ae — All rights reserved
          </p>
          <div className="foot-socials">
            <a
              href={`https://wa.me/${waNum}`}
              target="_blank"
              rel="noopener noreferrer"
              className="soc"
              aria-label="WhatsApp"
            >
              WA
            </a>
            <a
              href="https://www.instagram.com/bodykits.ae"
              target="_blank"
              rel="noopener noreferrer"
              className="soc"
              aria-label="Instagram"
            >
              IG
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
