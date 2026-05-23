import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://psplus-poll.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "PS Plus — Are you IN or OUT? | Subscriber sentiment",
  description:
    "Sony just hiked PS Plus prices — India got a 30% jump on May 20. Vote and see where gamers worldwide stand. One vote per browser, no login.",
  openGraph: {
    title: "PS Plus — Are you IN or OUT?",
    description:
      "Sony just hiked PS Plus prices. India got a 30% jump on May 20. Where do you stand?",
    url: SITE_URL,
    siteName: "IN or OUT",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PS Plus — Are you IN or OUT?",
    description:
      "Sony hiked PS Plus. India got a 30% jump. Worldwide subscriber sentiment, live.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
