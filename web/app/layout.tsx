import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { UnofficialBanner } from "@/components/UnofficialBanner";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ShizuPortal - Curated Shizuku Apps Web Catalog & Directory",
  description:
    "Discover Shizuku-compatible Android applications with elevated system privileges and zero root. Search, filter, and install apps directly through ShizuStore.",
  keywords: [
    "Shizuku",
    "ShizuStore",
    "awesome-shizuku",
    "Android apps",
    "rootless ADB",
    "system privileges",
    "open source Android",
  ],
  authors: [{ name: "ShizuPortal" }],
  openGraph: {
    title: "ShizuPortal - Curated Shizuku Apps Web Catalog",
    description:
      "Browse and discover 460+ Shizuku-compatible Android applications. Direct installation via ShizuStore.",
    type: "website",
    siteName: "ShizuPortal",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShizuPortal - Shizuku Apps Directory",
    description:
      "Browse and discover 460+ Shizuku-compatible Android applications without root.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="antialiased min-h-screen flex flex-col font-sans">
        <ThemeProvider>
          <Navbar />
          <UnofficialBanner />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
