import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'La Farine — Artisan Bakery',
  description: 'Handcrafted breads, pastries, and cakes made with love every morning.',
  openGraph: {
    title: 'La Farine — Artisan Bakery',
    description: 'Handcrafted breads, pastries, and cakes made with love every morning.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="grain-overlay">{children}</body>
    </html>
  );
}
