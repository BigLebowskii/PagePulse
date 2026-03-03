import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PagePulse — Check Your Website's Heartbeat in 60 Seconds",
  description:
    "Free SEO audit tool for small businesses. Get a health check with actionable fixes — broken links, page speed, meta tags, mobile friendliness, and more.",
  openGraph: {
    title: "PagePulse — Check Your Website's Heartbeat in 60 Seconds",
    description:
      "Free SEO audit tool for small businesses. Get a health check with actionable fixes.",
    type: "website",
    url: "https://pagepulse.vercel.app",
    siteName: "PagePulse",
  },
  twitter: {
    card: "summary_large_image",
    title: "PagePulse — Check Your Website's Heartbeat",
    description:
      "Free SEO audit tool for small businesses. 6 health checks in 60 seconds.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
