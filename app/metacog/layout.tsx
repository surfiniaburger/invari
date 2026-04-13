import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MCSB v2: Metacognitive Coding Safety Benchmark & AGI Calibration",
  description: "Empirical diagnostic suite for isolating self-monitoring (Metacognition) from raw accuracy in LLMs across code-security and logic domains. Featuring the 1,030-trial MCSB dataset.",
  authors: [{ name: "Adedoyinsola Ogungbesan" }],
  alternates: {
    canonical: "https://in-varia.com/metacog",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  keywords: [
    "Metacognition",
    "LLM Safety",
    "Coding Safety Benchmark",
    "MCSB v2",
    "AGI Calibration",
    "M-Ratio",
    "LLM Monitoring",
    "Adversarial Code Security"
  ],
  openGraph: {
    title: "MCSB: Metacognitive Coding Safety Benchmark",
    description: "Measuring the 'Metacognitive Domain Chasm' in frontier AI models.",
    type: "website",
    url: "https://in-varia.com/metacog",
    images: ["/images/mcsb-og.png"]
  },
  twitter: {
    card: "summary_large_image",
    title: "MCSB: AI Metacognition Benchmark",
    description: "Does your model know when it's vulnerable? Measuring the gaps in AI self-awareness.",
    images: ["/images/mcsb-og.png"]
  }
};

export default function MetacogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}
