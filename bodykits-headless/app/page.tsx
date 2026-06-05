import { redirect } from 'next/navigation';

// The actual homepage is served from public/landing.html via the
// beforeFiles rewrite in next.config.js. This file only exists so
// Next.js has a valid root route to prerender during build.
export default function Page() {
  redirect('/products');
}
