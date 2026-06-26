import type { Metadata } from 'next';
import { Archivo, Space_Grotesk } from 'next/font/google';
import './globals.css';

const archivo = Archivo({
  variable: '--font-archivo',
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Harsh Makwana | Full-Stack Developer & Creative Technologist',
  description: 'Personal tech portfolio of Harsh Makwana, a Full-Stack Developer specializing in high-performance application architectures, interactive interfaces, and intelligent systems.',
  keywords: [
    'Harsh Makwana',
    'Full-Stack Developer',
    'Creative Technologist',
    'Portfolio',
    'Next.js',
    'Three.js',
    'GSAP ScrollTrigger',
    'React Three Fiber',
  ],
  authors: [{ name: 'Harsh Makwana' }],
  metadataBase: new URL('https://harshmakwana.dev'), // Update with actual URL if known
};

import SmoothScroll from '@/components/SmoothScroll';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground selection:bg-accent selection:text-white font-sans relative">
        <SmoothScroll>
          {/* Foreground Content Layer */}
          <div className="relative z-10 w-full min-h-screen flex flex-col pointer-events-auto">
            {children}
          </div>
        </SmoothScroll>
      </body>
    </html>
  );
}
