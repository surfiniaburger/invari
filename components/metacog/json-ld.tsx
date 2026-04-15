import React from "react";

export function JsonLd() {
  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": "MCSB: Metacognitive Coding Safety Benchmark",
    "description": "A 1,030-trial empirical dataset evaluating the metacognitive sensitivity and resilience of LLMs in adversarial code-security scenarios.",
    "url": "https://in-varia.com/metacog",
    "keywords": [
      "AI Safety",
      "Metacognition",
      "Code Security",
      "LLM Calibration",
      "M-Ratio",
      "Adversarial Robustness"
    ],
    "creator": {
      "@type": "Person",
      "name": "Adedoyinsola Ogungbesan",
      "sameAs": "https://github.com/surfiniaburger"
    },
    "publisher": {
      "@type": "Organization",
      "name": "In-Varia Research"
    },
    "license": "https://creativecommons.org/licenses/by-sa/4.0/",
    "isAccessibleForFree": true
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    "headline": "Isolating the Metacognitive Domain Chasm: A Coding Safety Stress Test",
    "description": "Research findings on how frontier models (GPT-5.4, Gemini 3.1 Pro, Claude Opus 4.6) maintain logic calibration but collapse in metacognitive sensitivity during adversarial code tasks.",
    "author": [
      {
        "@type": "Person",
        "name": "Adedoyinsola Ogungbesan"
      }
    ],
    "publisher": {
      "@type": "Organization",
      "name": "In-Varia Research"
    },
    "datePublished": "2026-04-13",
    "image": "https://in-varia.com/images/mcsb-og.png"
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://in-varia.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Metacog Dashboard",
        "item": "https://in-varia.com/metacog"
      }
    ]
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "In-Varia Research",
    "url": "https://in-varia.com",
    "logo": "https://in-varia.com/images/mcsb-og.png",
    "sameAs": [
      "https://github.com/surfiniaburger"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
    </>
  );
}
