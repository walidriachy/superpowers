import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { CartProvider } from '@/lib/cart-context';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Bodykits.ae — Premium Automotive Body Kits UAE',
    template: '%s | Bodykits.ae',
  },
  description:
    'Shop the finest aerodynamic body kits, splitters, diffusers, and widebody conversions for exotic and performance vehicles. UAE\'s #1 automotive styling destination.',
  keywords: ['body kits', 'UAE', 'Dubai', 'aerodynamics', 'performance parts', 'widebody'],
  openGraph: {
    type: 'website',
    locale: 'en_AE',
    url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bodykits.ae',
    siteName: 'Bodykits.ae',
  },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className={inter.variable}>
        <CartProvider>
          <Navbar />
          <CartDrawer />
          <main>{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
