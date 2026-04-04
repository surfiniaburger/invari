"use client";

import React, { useState } from "react";
import { MetacogPlotlyChart } from "@/components/metacog/metacog-plotly-chart";
import { CalibrationCurveChart } from "@/components/metacog/calibration-curve-chart";
import { MRatioShiftChart } from "@/components/metacog/mratio-shift-chart";
import { StickyScrollReveal } from "@/components/metacog/sticky-scroll-reveal";
import { BenchmarkResults, getProviderInfo } from "@/lib/metacog";
import resultsAggregated from "@/public/data/results_aggregated.json";
import calibrationBins from "@/public/data/calibration_bins.json";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

/**
 * Metacognitive Benchmark Dashboard
 * 
 * Follows Code as Communication / Modular Design (Dave Farley):
 * - Clear separation of data visualization and research context.
 * - Interactive tabs to explore the "Metacognitive Capability Gap".
 */

export default function MetacogDashboard() {
  const [mode, setMode] = useState<"static" | "dynamic">("static");
  const results = React.useMemo(() => {
    const data = { ...resultsAggregated } as unknown as BenchmarkResults;
    
    // Merge binned data
    Object.entries(calibrationBins).forEach(([id, bins]) => {
      // Find the corresponding model by ID or Label
      const modelEntry = Object.entries(data).find(([key, val]) => 
        key === id || (val as any).name === id || getProviderInfo(id).label === key
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
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <a href="/" className="text-sm font-semibold tracking-[0.3em] text-white/70">
            IN-VARIA
          </a>
          <div className="hidden items-center gap-6 text-xs uppercase tracking-[0.2em] text-white/50 md:flex">
            <a href="#overview" className="transition hover:text-white">Overview</a>
            <a href="#results" className="transition hover:text-white">Results</a>
            <a href="#diagnostics" className="transition hover:text-white">Diagnostics</a>
            <a href="#method" className="transition hover:text-white">Method</a>
          </div>
          <Button asChild className="rounded-full px-6">
            <a href="mailto:ade@in-varia.com?subject=Request%20Demo">Request Demo</a>
          </Button>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-6 py-20 pb-32">
        <header id="overview" className="mb-16 flex flex-col gap-6">
          <Badge variant="outline" className="border-white/20 bg-white/5 text-white/70">
            Metacognitive Control · Report v3
          </Badge>
          <h1 className="text-4xl font-semibold text-white sm:text-6xl">
            Metacognitive Efficiency Profile
          </h1>
          <p className="max-w-3xl text-base text-white/60 sm:text-lg">
            A structured evaluation of frontier models under static calibration and dynamic evidence pressure,
            revealing the capability chasm between accuracy and self-monitoring.
          </p>
        </header>

        <section className="mb-24 overflow-hidden rounded-[4rem] border border-white/5">
          <StickyScrollReveal data={results} />
        </section>

        <section id="results" className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-white">Results</h2>
              <p className="text-sm text-white/50">Unified view across the report.</p>
            </div>
            <Tabs value={mode} onValueChange={(value) => setMode(value as "static" | "dynamic")}>
              <TabsList className="border border-white/10 bg-white/5">
                <TabsTrigger value="static">
                  Static (Turn 1)
                </TabsTrigger>
                <TabsTrigger value="dynamic">
                  Dynamic (Turn 2)
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="text-white">Accuracy vs. Metacognition</CardTitle>
              <CardDescription className="text-white/60">
                The capability chasm is visible when m-ratio is plotted against accuracy.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {mode === "static" ? (
                <MetacogPlotlyChart data={results as any} type="static" />
              ) : (
                <MetacogPlotlyChart data={results as any} type="dynamic" />
              )}
            </CardContent>
          </Card>
        </section>

        <section className="mt-12">
          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="text-white">Executive Summary</CardTitle>
              <CardDescription className="text-white/60">
                Highlights from static calibration and dynamic resilience.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 text-sm text-white/70">
              <div className="flex items-center justify-between">
                <span>Best m-ratio (static)</span>
                <span className="text-white">1.31</span>
              </div>
              <Separator className="bg-white/10" />
              <div className="flex items-center justify-between">
                <span>Dynamic resilience range</span>
                <span className="text-white">0.74 – 0.91</span>
              </div>
              <Separator className="bg-white/10" />
              <div className="flex items-center justify-between">
                <span>Calibration gap (ECE)</span>
                <span className="text-white">0.02 – 0.20</span>
              </div>
              <Button asChild className="mt-6 w-full rounded-full">
                <a href="mailto:ade@in-varia.com?subject=Request%20Demo">Request Demo</a>
              </Button>
            </CardContent>
          </Card>
        </section>

        <section id="diagnostics" className="mt-16">
          <div className="mb-12 text-center">
            <Badge variant="outline" className="mb-4 border-emerald-500/30 bg-emerald-500/5 text-emerald-400">
              Diagnostic Suite
            </Badge>
            <h2 className="text-3xl font-semibold text-white">Through the Looking Glass</h2>
            <p className="mt-2 text-white/50 italic">Revealing the internal monitoring reality behind the accuracy mask.</p>
          </div>
          
          <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="text-white">Calibration Curve</CardTitle>
              <CardDescription className="text-white/60">
                Reliability diagram from confidence bins (Turn 1 vs Turn 2).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-xs text-white/50">
                <span>Mode</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  {mode === "static" ? "Static (Turn 1)" : "Dynamic (Turn 2)"}
                </span>
              </div>
              <div className="mt-6">
                <CalibrationCurveChart mode={mode} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="text-white">M-Ratio Shift</CardTitle>
              <CardDescription className="text-white/60">
                Evidence-driven change in monitoring.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MRatioShiftChart data={results as any} />
            </CardContent>
            </Card>
          </div>
        </section>

        <section id="method" className="mt-16">
          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="text-white">Method Notes</CardTitle>
              <CardDescription className="text-white/60">
                Meta-d′ from type-2 ROC AUC. Bayesian resilience from evidence-weighted updates.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 text-sm text-white/70 md:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/40">Static</p>
                <p className="mt-2">
                  200 forced-choice traps with 1–6 confidence bins, isolating calibration from raw accuracy.
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/40">Dynamic</p>
                <p className="mt-2">
                  Positive, negative, and neutral evidence injections to probe belief stability.
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/40">Reliability</p>
                <p className="mt-2">
                  Five-seed bootstrap CI for repeatability of m-ratio estimates.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
