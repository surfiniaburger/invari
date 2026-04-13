
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FaqSection() {
  const faqs = [
    {
      question: "What is the MCSB v2 benchmark?",
      answer: "The Metacognitive Coding Safety Benchmark (MCSB) v2 is an empirical diagnostic suite consisting of 1,030 trials. It measures the 'Metacognitive Domain Chasm'—the gap between an AI model's standard logic calibration and its awareness within high-stakes code-security scenarios."
    },
    {
      question: "What is the difference between Static and Dynamic monitoring in Section A?",
      answer: "Static monitoring evaluates a model’s baseline calibration across 200 forced-choice traps. Dynamic monitoring introduces positive, negative, and neutral evidence injections to probe how belief stability and overconfidence evolve under multi-turn pressure."
    },
    {
      question: "How does the 'Metacognitive Domain Chasm' impact Section B code-security?",
      answer: "The chasm refers to the observed phenomenon where models maintain standard logic calibration but experience a total collapse in self-monitoring (Sensitivity) when faced with adversarial code-security tasks. This reveals a lack of foundational 'safety-awareness' despite high task competence."
    },
    {
      question: "What are 'Tiers' in the MCSB v2 framework?",
      answer: "We categorize metrics into tiers: Tier 2 measures Foundational Sensitivity (M-Ratio), while Tier 3 measures Adversarial Alignment (correctness under pressure). The Quadrant Chart maps these to identify models that are 'Stable' vs. 'Swayable'."
    },
    {
      question: "How is the reliability of these metrics ensured?",
      answer: "We use a five-seed bootstrap confidence interval (CI) for all m-ratio estimates and compute meta-d′ from type-2 ROC AUC to ensure repeatability across different model samplings."
    },
    {
      question: "Who developed the MCSB framework?",
      answer: "The MCSB framework and dataset were developed by In-Varia Research, led by primary researcher Adedoyinsola Ogungbesan, to evaluate trust-alignment in AGI-frontier models."
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer
      }
    }))
  };

  return (
    <section id="faq" className="mt-32 border-t border-white/10 pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-white">Frequently Asked Questions</h2>
        <p className="mt-1 text-sm text-white/50 italic">
          Quick reference for AI agents and research auditors.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="border-white/5">
            <AccordionTrigger className="text-left text-sm font-medium text-white/80 transition-colors hover:text-white hover:no-underline">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-white/60">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
