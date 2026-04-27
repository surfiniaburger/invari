"use client";

import React, { useState } from "react";
import { MetacogPlotlyChart } from "@/components/metacog/metacog-plotly-chart";
import { CalibrationCurveChart } from "@/components/metacog/calibration-curve-chart";
import { MRatioShiftChart } from "@/components/metacog/mratio-shift-chart";
import { StickyScrollReveal } from "@/components/metacog/sticky-scroll-reveal";
import { QuadrantChart } from "@/components/metacog/quadrant-chart";
import { AdversarialDiagnostics } from "@/components/metacog/adversarial-diagnostics";
import { JsonLd } from "@/components/metacog/json-ld";
import { FaqSection } from "@/components/metacog/faq-section";
import { SectionDEconomics } from "@/components/metacog/section-d-economics";
import { getProviderInfo, BenchmarkResults, MCSBResults } from "@/lib/metacog";
import resultsAggregated from "@/public/data/results_aggregated.json";
import calibrationBins from "@/public/data/calibration_bins.json";
import mcsbResults from "@/public/data/mcsb_results.json";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function MetacogDashboard() {
  const [mode, setMode] = useState<"static" | "dynamic">("static");
  const mcsbData = mcsbResults as unknown as MCSBResults;
  const results = React.useMemo(() => {
    const data = { ...resultsAggregated } as unknown as BenchmarkResults;

    // Merge binned data
    Object.entries(calibrationBins).forEach(([id, bins]) => {
      const modelEntry = Object.entries(data).find(([key, val]) =>
        key === id || val.name === id || getProviderInfo(id).label === key
      );

      if (modelEntry) {
        const [_, model] = modelEntry;
        if (bins.static && model.static) {
          model.static.bins = bins.static.bins;
        }
        if (bins.dynamic && model.multiturn_v2?.overall) {
          model.multiturn_v2.overall.bins = bins.dynamic.bins;
        }
      }
    });

    return data;
  }, []);

  return (
    <div className="min-h-screen text-white font-sans selection:bg-white/10">
      <JsonLd />
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <a href="/" className="text-sm font-semibold tracking-[0.3em] text-white/70">
            IN-VARIA
          </a>
          <div className="hidden items-center gap-6 text-xs uppercase tracking-[0.2em] text-white/50 md:flex">
            <a href="#general" className="transition hover:text-white">General</a>
            <a href="#safety" className="transition hover:text-white">Safety</a>
            <a href="#diagnostics" className="transition hover:text-white">Diagnostics</a>
            <a href="#economics" className="transition hover:text-white">Economics</a>
            <a href="#method" className="transition hover:text-white">Method</a>
          </div>
          <Button asChild className="rounded-full px-6">
            <a href="mailto:ade@in-varia.com?subject=Request%20Demo">Request Demo</a>
          </Button>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-6 py-20 pb-32">
        <header className="mb-16 flex flex-col gap-6">
          <Badge variant="outline" className="border-white/20 bg-white/5 text-white/70">
            Metacognitive Control · Report v3.2
          </Badge>
          <h1 className="text-4xl font-semibold text-white sm:text-6xl">
            Metacognitive Coding Safety Benchmark (MCSB)
          </h1>
          <p className="max-w-3xl text-base text-white/60 sm:text-lg">
            The MCSB v2 is a 1,030-trial diagnostic suite that isolates an AI model's self-monitoring (metacognition) from its raw accuracy. We quantify cross-tier degradation (Δ accuracy) capturing the gap between baseline competence and adversarial robustness.
          </p>
        </header>

        {/* --- SECTION A: GENERAL --- */}
        <section id="general" className="mb-32">
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-white">Section A: General Metacognition</h2>
            <p className="mt-1 text-sm text-white/80 italic">
              Baseline capability on standard logic and multi-turn reasoning tasks.
            </p>
          </div>

          <div className="mb-24 overflow-hidden rounded-[4rem] border border-white/5">
            <StickyScrollReveal data={results} />
          </div>

          <div className="grid gap-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-medium text-white/80">Calibration Depth</h3>
                <p className="text-xs text-white/40">Static vs. Dynamic monitoring efficiency.</p>
              </div>
              <Tabs value={mode} onValueChange={(value) => setMode(value as "static" | "dynamic")}>
                <TabsList className="border border-white/10 bg-white/5">
                  <TabsTrigger value="static">Static</TabsTrigger>
                  <TabsTrigger value="dynamic">Dynamic</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-white/10 bg-transparent">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-white/90">Reliability Diagram</CardTitle>
                </CardHeader>
                <CardContent>
                  <CalibrationCurveChart mode={mode} />
                </CardContent>
              </Card>
              <Card className="border-white/10 bg-transparent">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-white/90">Sensitivity vs Accuracy</CardTitle>
                </CardHeader>
                <CardContent>
                  <MetacogPlotlyChart data={results} type={mode} />
                </CardContent>
              </Card>
            </div>

            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="text-white">M-Ratio Shift</CardTitle>
                <CardDescription className="text-white/60 text-xs">
                  Evidence-driven change in monitoring efficiency across models.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-[400px] w-full">
                  <MRatioShiftChart data={results} />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* --- SECTION B: SAFETY --- */}
        <section id="safety" className="mb-32">
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-white">Section B: Code-Security Trustworthiness</h2>
            <Badge variant="outline" className="mt-2 border-rose-500/30 bg-rose-500/5 text-rose-400">
              MCSB v2 Adversarial Result
            </Badge>
            <p className="mt-4 text-sm text-white/80">
              This section isolates directionally correct belief updates within a high-stakes domain (code security).
              Significant cross-tier degradation (Δ accuracy) is observed under adversarial evidence pressure.
            </p>
          </div>

          <div className="grid gap-6">
            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="text-white">Sensitivity vs. Adversarial Resilience</CardTitle>
                <CardDescription className="text-white/60 text-xs">
                  X-Axis: Tier 3 Alignment (%) · Y-Axis: Tier 2 Foundational Sensitivity (M-Ratio)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <QuadrantChart data={mcsbData} />
              </CardContent>
            </Card>

            <Card className="border-emerald-500/10 bg-emerald-500/5">
              <CardHeader>
                <CardTitle className="text-emerald-400/90 text-sm">Empirical Comparative Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead className="text-white/40 min-w-[120px]">Model</TableHead>
                        <TableHead className="text-white/40">T2 Sensitivity</TableHead>
                        <TableHead className="text-white/40 text-rose-400">T3 Alignment</TableHead>
                        <TableHead className="text-white/40 text-emerald-400">Trust Score (v2)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.values(mcsbData).sort((a, b) => b.raw_score - a.raw_score).map((m) => (
                        <TableRow key={m.name} className="border-white/5 hover:bg-white/5 transition-colors">
                          <TableCell className="font-medium text-white/90 py-4 whitespace-nowrap">{m.name}</TableCell>
                          <TableCell className="text-white/60 font-mono text-xs">{m.tier2_m_ratio.toFixed(3)}</TableCell>
                          <TableCell className="text-rose-400 font-mono text-xs">{m.tier3_alignment.toFixed(3)}</TableCell>
                          <TableCell className="text-emerald-400 font-mono text-xs">{m.raw_score.toFixed(3)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* --- SECTION C: DIAGNOSTICS --- */}
        <section id="diagnostics" className="mb-32">
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-white">Section C: Adversarial Stress Test (Meta-Evaluation Framework)</h2>
            <p className="mt-1 text-xs text-white/40 italic">
              Inspired by cognitive evaluation frameworks for measuring robust generalization under distribution shift.
            </p>
            <p className="mt-4 text-sm text-white/80">
              High-fidelity diagnostics revealing the internal representational stability of models.
              Patterns highlight the sharp transition from foundational logic to adversarial security scenarios.
            </p>
          </div>
          <AdversarialDiagnostics />
        </section>

        {/* --- SECTION D: ECONOMICS --- */}
        <SectionDEconomics />

        {/* --- METHOD GUIDE --- */}
        <section id="method" className="mt-16">
          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="text-white">How to Read the Benchmark</CardTitle>
              <CardDescription className="text-white/60">
                A compact guide to the plots, metrics, and methodology.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6 text-sm text-white/70">
              <div className="grid gap-3">
                <p>
                  This benchmark isolates <strong>metacognitive control</strong> from raw accuracy by
                  measuring whether a model can calibrate confidence, detect errors, and update beliefs
                  under evidence pressure. We compute signal‑detection metrics (meta‑d′, m‑ratio) alongside
                  multi‑turn resilience scores to separate competence from self‑monitoring.
                </p>
                <p>
                  The reliability diagram uses trial‑level confidence bins reconstructed from `kbench`
                  logs, ensuring that each plotted point corresponds to a real correctness rate for a
                  given confidence bin. This yields a true calibration curve against the perfect‑calibration
                  diagonal.
                </p>
              </div>
              <Separator className="bg-white/10" />
              <div className="grid gap-2">
                <p className="text-xs uppercase tracking-[0.2em] text-white/40">Reading the Plots</p>
                <ul className="grid gap-2 text-white/70">
                  <li><strong>Accuracy vs. M‑Ratio</strong>: High accuracy + high m‑ratio indicates AGI‑aligned monitoring.</li>
                  <li><strong>Calibration Curve</strong>: Deviations below the diagonal indicate overconfidence (miscalibration).</li>
                  <li><strong>M‑Ratio Shift</strong>: Large negative deltas signal susceptibility to evidence pressure.</li>
                  <li><strong>Quadrant Chart</strong>: Resilience vs. sensitivity separates stable leaders from brittle models.</li>
                  <li><strong>Degradation Gap (Panel A)</strong>: Quantifies cross-tier degradation (Δ accuracy) capturing the gap between baseline competence and adversarial robustness.</li>
                  <li><strong>Alignment Failure (Panel C)</strong>: Alignment is quantified via response consistency under perturbation, decomposed into underreaction (invariance to critical changes) and overreaction (sensitivity to irrelevant perturbations).</li>
                  <li><strong>Confidence Shift (Δ)</strong>: Positive Δ indicates increased confidence under adversarial perturbation, suggesting miscalibrated belief updates or unstable internal representations.</li>
                  <li><strong>CVT Comparison (Panel D)</strong>: Measures the expected cost required to extract one point of verified trust under adversarial conditions. Scaled in <strong>cents (¢)</strong> for intuitive economic evaluation.</li>
                  <li><strong>Efficiency Frontier (Panel D)</strong>: A Pareto analysis of <strong>Weighted Trust Score</strong> vs. Log‑Cost ($ per 1k trials) identifying optimal ROI leaders.</li>
                  <li><strong>Monologue Tax (Panel D)</strong>: Breaks down token costs into base, reasoning (CoT), and metacognitive correction components.</li>
                </ul>
              </div>
              <div className="flex flex-col gap-2 text-xs text-white/50">
                <span>References: Burnell et al. (2026); Fleming &amp; Lau (2014).</span>
              </div>
              <Button asChild variant="outline" className="w-full">
                <a href="https://kaggle.com/competitions/kaggle-measuring-agi/writeups/new-writeup-1775057478716">
                  Read full Kaggle write‑up
                </a>
              </Button>
            </CardContent>
          </Card>
        </section>

        <FaqSection />
      </main>
    </div>
  );
}
