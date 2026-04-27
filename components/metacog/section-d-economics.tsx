"use client";

import React, { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CVTComparisonChart } from "./cvt-comparison-chart";
import { EfficiencyFrontierChart } from "./efficiency-frontier-chart";
import { MonologueTaxChart } from "./monologue-tax-chart";
import { calculateEconomics } from "@/lib/economics";
import resultsAggregated from "@/public/data/results_aggregated.json";
import mcsbResults from "@/public/data/mcsb_results.json";

import { getProviderInfo } from "@/lib/metacog";
import { ProviderLogoMap, DeepSeekLogo } from "./provider-logos";

export function SectionDEconomics() {
  const econData = useMemo(() => {
    return calculateEconomics(resultsAggregated, mcsbResults);
  }, []);

  return (
    <section id="economics" className="mb-32 mt-32">
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-white">Section D: Economic Efficiency & Token Economics</h2>
        <Badge variant="outline" className="mt-2 border-emerald-500/30 bg-emerald-500/5 text-emerald-400">
          Metric Framework v1.0
        </Badge>
        <p className="mt-4 text-sm text-white/80">
          Metacognition changes the optimal spending policy. High sensitivity enables agents to abort failed 
          reasoning paths early, drastically reducing the <strong>Cost of Verified Truth (CVT)</strong>. 
          This section quantifies the "Metacognitive Dividend."
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm font-medium">Cost of Verified Truth (CVT)</CardTitle>
              <CardDescription className="text-white/40 text-xs">
                Expected cost (¢) required to produce one correct adversarial coding trial.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CVTComparisonChart data={econData} />
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm font-medium">The Efficiency Frontier</CardTitle>
              <CardDescription className="text-white/40 text-xs">
                X: Log Cost ($/1k trials) | Y: Weighted Trust Score (MCSB v2)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EfficiencyFrontierChart data={econData} />
            </CardContent>
          </Card>
        </div>

        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm font-medium">The Monologue Tax & Metacognitive Dividend</CardTitle>
            <CardDescription className="text-white/40 text-xs">
              Breakdown of token expenditure: Base Prompting vs. Reasoning vs. Correction Overhead.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MonologueTaxChart data={econData} />
          </CardContent>
        </Card>

        <div className="rounded-xl border border-white/5 bg-white/5 p-6">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-6">Empirical Cost Summary (1,030 trials)</h4>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {econData.filter(d => [
              "deepseek-ai/deepseek-v3.1",
              "deepseek-ai/deepseek-v3.2", 
              "google/gemini-3-flash-preview", 
              "openai/gpt-5.4-2026-03-05", 
              "anthropic/claude-opus-4-7@default"
            ].includes(d.id)).sort((a,b) => a.totalCost - b.totalCost).map((d) => {
              const info = getProviderInfo(d.id);
              const Logo = ProviderLogoMap[info.provider] || DeepSeekLogo;
              return (
                <div key={d.id} className="space-y-3 border-l border-white/10 pl-5">
                  <div className="flex items-center gap-2">
                    <Logo size={12} className="text-white/30" />
                    <p className="text-[10px] text-white/40 uppercase font-mono tracking-wider">{d.name}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-2xl font-semibold text-white tracking-tight">${d.totalCost.toFixed(2)}</p>
                    <p className="text-[10px] text-emerald-400 font-mono tracking-tighter">{(d.cvt * 100).toFixed(3)} ¢ CVT</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-10 flex items-center gap-2 text-[9px] text-white/20 italic font-mono">
            <span className="uppercase tracking-tighter">Audit Registry: pricing_archive.json</span>
            <Separator orientation="vertical" className="h-2 bg-white/10" />
            <span>*Rates as of April 2026</span>
          </div>
        </div>
      </div>
    </section>
  );
}
