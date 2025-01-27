import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Script from "next/script";
import Footer from "@/components/footer";
import { Providers } from "@/app/providers";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GM GN wallet",
  description: "vox populi - voice of the people",
  metadataBase: new URL("https://www.gmgn.app"),
  openGraph: {
    title: "GM GN",
    description: "vox populi - voice of the people",
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
    title: "GM GN",
    description: "vox populi - voice of the people",
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
      <Script 
        defer 
        src="https://assets.onedollarstats.com/stonks.js" 
        id="stonks"
      ></Script>
      <body className={inter.className}>
        <Providers>
          <main className="flex flex-col gap-8 px-2 pt-2 pb-24 md:p-12 lg:p-16 w-screen items-center justify-center">
            {children}
            <Footer />
          </main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
