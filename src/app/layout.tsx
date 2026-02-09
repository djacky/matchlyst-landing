import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.matchlyst.com"),
  title: "Matchlyst — AI-Powered Freelancer Screening",
  description:
    "Matchlyst helps clients hire freelancers using AI-generated, job-specific interviews. No generic vetting. No spam applications.",
  keywords: [
    "AI freelancer platform",
    "freelancer screening",
    "hire developers",
    "freelancer vetting",
    "AI hiring",
    "Toptal alternative",
  ],
  alternates: {
    canonical: "https://www.matchlyst.com",
  },
  openGraph: {
    title: "Matchlyst — Hire Freelancers Screened for Your Exact Job",
    description:
      "An AI-powered freelance hiring platform that generates custom interviews for every job and ranks candidates by real skill.",
    url: "https://www.matchlyst.com",
    siteName: "Matchlyst",
    images: [
      {
        url: "https://www.matchlyst.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Matchlyst AI Hiring Platform",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Matchlyst — AI-Powered Freelance Hiring",
    description:
      "Stop wasting time screening freelancers. Matchlyst uses AI-generated interviews tailored to every job.",
    images: ["https://www.matchlyst.com/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
