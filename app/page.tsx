import HeroBeams from "@/components/hero-beams";
import { PixelGridBackground } from "@/components/ui/pixel-grid-background";
import { MetacogPlotlyChart } from "@/components/metacog/metacog-plotly-chart";
import resultsAggregated from "@/public/data/results_aggregated.json";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="relative min-h-screen w-screen overflow-x-hidden font-sans">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <span className="text-sm font-semibold tracking-[0.3em] text-white/70">
            IN-VARIA
          </span>
          <nav className="hidden items-center gap-6 text-xs uppercase tracking-[0.2em] text-white/50 md:flex">
            <a href="#benchmark" className="transition hover:text-white">Benchmark</a>
            <a href="#taxonomy" className="transition hover:text-white">Taxonomy</a>
            <a href="#evidence" className="transition hover:text-white">Evidence</a>
            <a href="#trajectory" className="transition hover:text-white">Trajectory</a>
          </nav>
          <Button asChild className="rounded-full px-6">
            <a href="mailto:ade@in-varia.com?subject=Request%20Demo">Request Demo</a>
          </Button>
        </div>
      </header>

      <section className="relative min-h-[720px] overflow-hidden px-6">
        <div className="absolute inset-0">
          <PixelGridBackground
            gridCols={50}
            gridRows={34}
            maxElevation={20}
            gridColor="#0b0f1f"
            backgroundColor="#05070f"
            borderOpacity={0.08}
            className="h-full w-full"
          />
        </div>
        <HeroBeams />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-12 py-24 md:flex-row md:items-center md:py-32">
          <div className="flex-1 space-y-8">
            <Badge variant="outline" className="border-white/20 bg-white/5 text-white/70">
              Metacognitive Benchmark Suite · v3
            </Badge>
            <h1 className="text-4xl font-semibold leading-tight text-white sm:text-6xl">
              Metacognitive Control for Frontier Models.
            </h1>
            <p className="max-w-xl text-base text-white/60 sm:text-lg">
              We measure what accuracy hides: confidence calibration, error monitoring,
              and belief updating under pressure. A new evaluation axis for AGI readiness.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="rounded-full px-8">
                <a href="mailto:ade@in-varia.com?subject=Request%20Demo">Request Demo</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-8">
                <a href="/metacog">View Report</a>
              </Button>
            </div>
          </div>
          <div className="flex-1">
            <Card className="border-white/10 bg-white/5 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white">Signal that accuracy misses</CardTitle>
                <CardDescription className="text-white/60">
                  Three independent metrics, one coherent story.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-white/70">
                <div className="flex items-center justify-between">
                  <span>Static calibration (meta-d′)</span>
                  <span className="text-white">0.05 → 1.31</span>
                </div>
                <Separator className="bg-white/10" />
                <div className="flex items-center justify-between">
                  <span>Dynamic resilience (Bayesian)</span>
                  <span className="text-white">0.74 → 0.91</span>
                </div>
                <Separator className="bg-white/10" />
                <div className="flex items-center justify-between">
                  <span>Calibration gap (ECE)</span>
                  <span className="text-white">0.02 → 0.20</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="benchmark" className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-white">Benchmark Differentiator</h2>
            <p className="text-white/60">
              We separate competence from self-monitoring. A model can be right yet
              remain blind to its own uncertainty. Our benchmark quantifies that gap.
            </p>
            <div className="grid gap-4">
              {[
                {
                  title: "Static Monitoring",
                  desc: "Type-2 ROC and meta-d′ to reveal calibration efficiency.",
                },
                {
                  title: "Dynamic Evidence Pressure",
                  desc: "Belief updating under strong, weak, and neutral evidence.",
                },
                {
                  title: "Bootstrap Reliability",
                  desc: "5-seed CI to validate stability across runs.",
                },
              ].map((item) => (
                <Card key={item.title} className="border-white/10 bg-white/5">
                  <CardHeader>
                    <CardTitle className="text-white">{item.title}</CardTitle>
                    <CardDescription className="text-white/60">{item.desc}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="text-white">Accuracy vs. Metacognition</CardTitle>
              <CardDescription className="text-white/60">
                The capability chasm is visible when m-ratio is plotted against accuracy.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MetacogPlotlyChart data={resultsAggregated as any} type="static" />
              <p className="mt-4 text-xs text-white/40">Static (Turn 1)</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="taxonomy" className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-6">
          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="text-white">Model Taxonomy</CardTitle>
              <CardDescription className="text-white/60">
                Accuracy alone compresses frontier models into a single cluster.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-white/70">
              <p>
                We observe four archetypes: calibrated leaders, overconfident generalists,
                resilient-but-gullible systems, and flat monitors.
              </p>
              <Button asChild variant="outline" className="w-full">
                <a href="/metacog#diagnostics">View full diagnostics</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="evidence" className="mx-auto max-w-6xl px-6 pb-20">
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="text-white">Evidence You Can Trust</CardTitle>
            <CardDescription className="text-white/60">
              Multi-seed stability and multi-turn robustness summarize the signal.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-3">
            {[
              { label: "Bootstrap CI", value: "±0.10 – 0.33", note: "5-seed stability" },
              { label: "Dynamic Resilience", value: "0.74 – 0.91", note: "multi-turn v2" },
              { label: "Calibration Gap", value: "0.02 – 0.20", note: "ECE spread" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-black/20 p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">{item.label}</p>
                <p className="mt-3 text-2xl font-semibold text-white">{item.value}</p>
                <p className="mt-2 text-xs text-white/50">{item.note}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section id="trajectory" className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-white">Team & Trajectory</h2>
            <p className="text-white/60">
              We are building the measurement layer for frontier systems: repeatable,
              defensible, and governance-ready benchmarks that can scale across faculties.
            </p>
            <div className="grid gap-4">
              {[
                "Phase 1: Metacognitive control benchmarks (live)",
                "Phase 2: Cross-faculty expansions (attention, executive, social)",
                "Phase 3: Swarm reliability + agentic monitoring",
              ].map((step) => (
                <div key={step} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
                  <span className="h-2 w-2 rounded-full bg-white/70" />
                  {step}
                </div>
              ))}
            </div>
          </div>
          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="text-white">Investor Brief</CardTitle>
              <CardDescription className="text-white/60">
                A single benchmark that reveals what accuracy alone cannot.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-white/70">
              <p>
                We quantify metacognitive efficiency with meta-d′, align it to Bayesian
                resilience, and expose the capability chasm in frontier models.
              </p>
              <Button asChild className="w-full rounded-full">
                <a href="mailto:ade@in-varia.com?subject=Request%20Demo">Request Demo</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="border-t border-white/10 py-10 text-center text-xs uppercase tracking-[0.3em] text-white/40">
        In-varia · Metacognitive Control Benchmark
      </footer>
    </div>
  );
}
