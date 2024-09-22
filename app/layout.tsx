import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Toaster } from "@/components/ui/toaster";
import Script from 'next/script'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "gm gn",
  description: "share your thoughts onchain",
  metadataBase: new URL("https://www.gmgn.app"),
  openGraph: {
    title: "gmgn",
    description: "share your thoughts onchain",
    url: "https://www.gmgn.app",
    siteName: "gmgn",
    images: [
      {
        url: "/gmgn-tbn.png",
        width: 1200,
        height: 630,
        alt: "og-image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "gmgn",
    description: "share your thoughts onchain",
    creator: "@zxstim",
    images: ["/gmgn-tbn.png"],
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Script defer data-domain="gmgn.app" src="https://analytics.pyhash.com/js/script.js"></Script>
      <body className={inter.className}>
        <main className="flex flex-col gap-8 p-2 md:p-12 lg:p-16 w-screen items-center justify-center">
          {children}
          <Toaster />
        </main>
      </body>
    </html>
  );
}
