import type { Metadata } from "next";
import { Comic_Neue } from "next/font/google";
import "./globals.css";
import '@rainbow-me/rainbowkit/styles.css';
import { Providers } from './providers';

const comicNeue = Comic_Neue({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'gmgn',
  description: 'share your thoughts onchain',
  metadataBase: new URL('https://www.gmgn.app'),
  openGraph: {
    title: 'gmgn',
    description: 'share your thoughts onchain',
    url: 'https://www.gmgn.app',
    siteName: 'BlockCMD',
    images: [
      {
        url: '/blockcmd-tbn.png',
        width: 1200,
        height: 630,
        alt: 'og-image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'gmgn',
    description: 'share your thoughts onchain',
    creator: '@zxstim',
    images: ['/blockcmd-tbn.png'],
  },
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={comicNeue.className}>
        <Providers>
          <main className="flex flex-col gap-8 items-center justify-center py-12 px-4 lg:p-16">
            <div className="flex flex-col gap-12 max-w-5xl">
              {children}
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}