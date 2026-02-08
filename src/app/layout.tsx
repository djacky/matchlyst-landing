import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Matchlyst — AI-Powered Freelance Hiring",
  description:
    "An AI-powered platform that generates job-specific interviews and ranks freelancers based on real capability — not spam.",
  keywords: [
    "freelance",
    "hiring",
    "AI",
    "recruitment",
    "screening",
    "talent",
  ],
  openGraph: {
    title: "Matchlyst — AI-Powered Freelance Hiring",
    description:
      "An AI-powered platform that generates job-specific interviews and ranks freelancers based on real capability.",
    type: "website",
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
