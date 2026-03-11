import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "24 Karat Properties | AI-Powered Real Estate",
    template: "%s | 24 Karat Properties",
  },
  description:
    "Find premium properties in Noida and Dholera with AI-powered analysis. Get instant pros, cons, and investment scores for every listing.",
  keywords: [
    "real estate",
    "property",
    "Noida",
    "Dholera",
    "buy property",
    "rent property",
    "AI property analysis",
    "24 Karat Properties",
  ],
  metadataBase: new URL("https://24karat-properties.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "24 Karat Properties",
    title: "24 Karat Properties | AI-Powered Real Estate",
    description: "Find premium properties in Noida and Dholera with AI-powered analysis, investment scores, and expert guidance.",
    url: "https://24karat-properties.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "24 Karat Properties | AI-Powered Real Estate",
    description: "Find premium properties in Noida and Dholera with AI-powered analysis.",
  },
  alternates: {
    canonical: "https://24karat-properties.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
