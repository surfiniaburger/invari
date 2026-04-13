import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://in-varia.com"),
  title: "In-varia | Metacognitive Control for Frontier Models",
  description:
    "Investor-grade evaluation of metacognitive control in frontier models, with Bayesian resilience and meta-d' evidence.",
  icons: {
    icon: "/images/in-varia-mark.svg",
    shortcut: "/images/in-varia-mark.svg",
    apple: "/images/in-varia-mark.svg",
  },
  openGraph: {
    title: "In-vari | Metacognitive Control for Frontier Models",
    description:
      "Investor-grade evaluation of metacognitive control in frontier models, with Bayesian resilience and meta-d' evidence.",
    images: ["/images/in-varia-mark.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "In-vari | Metacognitive Control for Frontier Models",
    description:
      "Investor-grade evaluation of metacognitive control in frontier models, with Bayesian resilience and meta-d' evidence.",
    images: ["/images/in-varia-mark.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <TooltipProvider>{children}</TooltipProvider>
        <Analytics />
      </body>
    </html>
  );
}
