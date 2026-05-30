"use client";

import Link from "next/link";
import React, { useState, useMemo } from "react";
import { SwarmTelemetryCharts } from "@/components/metacog/swarm-telemetry";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import telemetryData from "@/public/data/pipeline_telemetry.json";
import attemptsData from "@/public/data/pipeline_attempts_sample.json";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface DebateTurn {
  role: string;
  text: string;
}

interface Attempt {
  id: string;
  topic: string;
  predicate: string;
  decision: string;
  status: string;
  judge_verdict: string;
  verifier_passes_audit: boolean;
  tokens_used: number;
  debate_transcript: DebateTurn[];
  verifier_trace: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function fmt(n: number, digits = 0): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(digits)}k`;
  return n.toLocaleString();
}

function pct(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}

/* ------------------------------------------------------------------ */
/*  KPI Card                                                           */
/* ------------------------------------------------------------------ */

function KpiCard({
  label,
  value,
  sub,
  accent = "white",
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}) {
  const colorMap: Record<string, string> = {
    emerald: "text-emerald-400",
    amber: "text-amber-400",
    rose: "text-rose-400",
    blue: "text-blue-400",
    white: "text-white",
  };
  return (
    <div className="group relative rounded-xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/[0.06]">
      <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">{label}</p>
      <p className={`text-2xl font-semibold tabular-nums ${colorMap[accent] ?? "text-white"}`}>
        {value}
      </p>
      {sub && <p className="mt-1 text-[10px] text-white/30 font-mono">{sub}</p>}
      {/* Subtle glow on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity group-hover:opacity-100 bg-gradient-to-br from-white/[0.02] to-transparent" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Attempt Inspector                                                  */
/* ------------------------------------------------------------------ */

function AttemptInspector({ attempts }: { attempts: Attempt[] }) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const selected = attempts[selectedIdx];

  const roleStyle: Record<string, { label: string; color: string; bg: string; border: string }> = {
    pro_debater: {
      label: "PRO",
      color: "text-blue-400",
      bg: "bg-blue-500/5",
      border: "border-blue-500/20",
    },
    con_debater: {
      label: "CON",
      color: "text-rose-400",
      bg: "bg-rose-500/5",
      border: "border-rose-500/20",
    },
  };

  if (!selected) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-8 text-center text-white/40 text-sm">
        No attempts available to inspect.
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      {/* Sidebar: attempt list */}
      <div className="flex flex-col gap-2">
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-1 px-1">
          Debate Transcripts
        </p>
        {attempts.map((a, i) => (
          <button
            key={a.id}
            onClick={() => setSelectedIdx(i)}
            className={`w-full text-left rounded-lg border px-3.5 py-3 transition-all text-xs ${
              i === selectedIdx
                ? "border-white/20 bg-white/10 shadow-lg shadow-white/[0.02]"
                : "border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-white/90">{a.topic}</span>
              <Badge
                variant="outline"
                className={`text-[9px] px-1.5 py-0 ${
                  a.decision === "accepted"
                    ? "border-emerald-500/30 text-emerald-400"
                    : "border-rose-500/30 text-rose-400"
                }`}
              >
                {a.decision}
              </Badge>
            </div>
            <p className="text-[10px] text-white/30 font-mono">{a.id}</p>
          </button>
        ))}
      </div>

      {/* Main panel: debate + verifier */}
      <div className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm overflow-hidden">
        {/* Header */}
        <div className="border-b border-white/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-white/90">{selected.topic}</h4>
              <p className="text-xs text-white/40 max-w-lg">{selected.predicate}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`text-xs ${
                  selected.judge_verdict === "True"
                    ? "border-emerald-500/30 text-emerald-400"
                    : "border-rose-500/30 text-rose-400"
                }`}
              >
                Judge: {selected.judge_verdict}
              </Badge>
              <Badge
                variant="outline"
                className={`text-xs ${
                  selected.verifier_passes_audit
                    ? "border-emerald-500/30 text-emerald-400"
                    : "border-amber-500/30 text-amber-400"
                }`}
              >
                Verifier: {selected.verifier_passes_audit ? "Pass" : "Fail"}
              </Badge>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-3 text-[10px] text-white/30 font-mono">
            <span>Status: {selected.status}</span>
            <span>·</span>
            <span>Tokens: {selected.tokens_used.toLocaleString()}</span>
          </div>
        </div>

        {/* Debate Transcript */}
        <div className="px-6 py-5 space-y-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-3">
            Adversarial Debate Rounds
          </p>
          {selected.debate_transcript.map((turn, i) => {
            const style = roleStyle[turn.role] ?? {
              label: turn.role,
              color: "text-white/60",
              bg: "bg-white/5",
              border: "border-white/10",
            };
            return (
              <div
                key={i}
                className={`rounded-lg border ${style.border} ${style.bg} p-4 transition-all hover:border-opacity-50`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`text-[9px] font-bold uppercase tracking-[0.15em] ${style.color}`}
                  >
                    {style.label}
                  </span>
                  <span className="text-[9px] text-white/20">Round {i + 1}</span>
                </div>
                <p className="text-xs text-white/70 leading-relaxed">{turn.text}</p>
              </div>
            );
          })}
        </div>

        <Separator className="bg-white/10" />

        {/* Verifier Trace */}
        <div className="px-6 py-5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-3">
            Verifier Logic Trace
          </p>
          <div className="rounded-lg border border-emerald-500/15 bg-emerald-500/[0.03] p-4">
            <code className="text-xs text-emerald-400/80 font-mono leading-relaxed block whitespace-pre-wrap">
              {selected.verifier_trace}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function AuditPortal() {
  const tel = telemetryData as Record<string, unknown>;
  const attempts = attemptsData as unknown as Attempt[];

  const stageTotals = tel.usage_by_stage_totals as Record<
    string,
    { calls: number; prompt_tokens: number; completion_tokens: number; total_tokens: number }
  >;
  const modelTotals = tel.usage_by_model_totals as Record<
    string,
    { calls: number; prompt_tokens: number; completion_tokens: number; total_tokens: number }
  >;

  /* B-Gate quality metrics */
  const bGateMetrics = useMemo(() => {
    const t = tel as Record<string, number | boolean | Record<string, unknown>>;
    return [
      {
        label: "B0 – Structural Completeness",
        value: pct(t.b0_structural_completeness_pass_rate as number),
        ok: (t.b0_structural_completeness_pass_rate as number) >= 0.95,
      },
      {
        label: "B1 – Inconclusive Rate (Accepted)",
        value: pct(t.b1_inconclusive_in_accepted_rate as number),
        ok: (t.b1_inconclusive_in_accepted_rate as number) <= 0.2,
      },
      {
        label: "B1 – Unsupported Rate (Accepted)",
        value: pct(t.b1_unsupported_in_accepted_rate as number),
        ok: (t.b1_unsupported_in_accepted_rate as number) <= 0.05,
      },
      {
        label: "B2 – Anchor Match Rate",
        value: pct(t.b2_anchor_match_rate as number),
        ok: (t.b2_anchor_match_rate as number) >= 0.8,
      },
      {
        label: "B2 – Mechanism Grounding Fail",
        value: pct(t.b2_mechanism_grounding_fail_rate as number),
        ok: (t.b2_mechanism_grounding_fail_rate as number) <= 0.1,
      },
      {
        label: "B2 – Strict Fail Rate",
        value: pct(t.b2_strict_fail_rate as number),
        ok: (t.b2_strict_fail_rate as number) <= 0.15,
      },
      {
        label: "Verifier Parse OK",
        value: pct(t.verifier_parse_ok_rate as number),
        ok: (t.verifier_parse_ok_rate as number) >= 0.9,
      },
      {
        label: "Verifier Pass Rate",
        value: pct(t.verifier_pass_rate as number),
        ok: true,
      },
    ];
  }, [tel]);

  return (
    <div className="min-h-screen text-white font-sans selection:bg-white/10">
      {/* ---- Navbar ---- */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="text-sm font-semibold tracking-[0.3em] text-white/70 hover:text-white transition-colors">
            IN-VARIA
          </Link>
          <div className="hidden items-center gap-6 text-xs uppercase tracking-[0.2em] text-white/50 md:flex">
            <Link href="/metacog" className="transition hover:text-white">
              Benchmark
            </Link>
            <Link href="#telemetry" className="transition hover:text-white">
              Telemetry
            </Link>
            <Link href="#b-gates" className="transition hover:text-white">
              B-Gates
            </Link>
            <Link href="#debates" className="transition hover:text-white">
              Debates
            </Link>
          </div>
          <Button asChild className="rounded-full px-6">
            <a href="mailto:ade@in-varia.com?subject=Pipeline%20Audit%20Enquiry">
              Contact
            </a>
          </Button>
        </div>
      </nav>

      {/* ---- Main ---- */}
      <main className="mx-auto max-w-6xl px-6 py-20 pb-32">
        {/* ---- Hero ---- */}
        <header className="mb-16 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-white/20 bg-white/5 text-white/70">
              Pipeline Audit · Run 7
            </Badge>
            {(tel.pass as boolean) ? (
              <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/5 text-emerald-400">
                ✓ All gates passed
              </Badge>
            ) : (
              <Badge variant="outline" className="border-rose-500/30 bg-rose-500/5 text-rose-400">
                ✗ Gate failure
              </Badge>
            )}
          </div>
          <h1 className="text-4xl font-semibold text-white sm:text-5xl">
            Swarm Adjudication Audit
          </h1>
          <p className="max-w-3xl text-base text-white/60 sm:text-lg">
            End-to-end transparency into the multi-agent debate pipeline. Inspect token
            economics, B-gate quality metrics, and individual adversarial debate transcripts
            for every accepted or rejected predicate.
          </p>
        </header>

        {/* ---- KPI Row ---- */}
        <section className="mb-20">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <KpiCard
              label="Total Attempts"
              value={String(tel.attempts_total as number)}
              sub={`${tel.accepted_rows as number} accepted · ${tel.total_rows as number} rows`}
              accent="white"
            />
            <KpiCard
              label="Token Budget"
              value={fmt(tel.usage_total_tokens_total as number)}
              sub={`${fmt(tel.usage_prompt_tokens_total as number)} prompt · ${fmt(tel.usage_completion_tokens_total as number)} comp`}
              accent="blue"
            />
            <KpiCard
              label="Tokens / Accepted Row"
              value={fmt(tel.efficiency_tokens_per_accepted_row as number)}
              sub={`${fmt(tel.efficiency_tokens_per_attempt as number)} per attempt`}
              accent="amber"
            />
            <KpiCard
              label="LLM Calls"
              value={String(tel.usage_calls_total as number)}
              sub={`${Object.keys(modelTotals).length} models`}
              accent="emerald"
            />
          </div>
        </section>

        {/* ---- Telemetry Charts ---- */}
        <section id="telemetry" className="mb-20">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white">Token Telemetry</h2>
            <p className="mt-1 text-sm text-white/40">
              Stage-level token distribution and model workload allocation across the full pipeline.
            </p>
          </div>
          <SwarmTelemetryCharts stageTotals={stageTotals} modelTotals={modelTotals} />
        </section>

        {/* ---- B-Gate Quality Metrics ---- */}
        <section id="b-gates" className="mb-20">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white">B-Gate Quality Summary</h2>
            <p className="mt-1 text-sm text-white/40">
              Automated quality gates enforcing structural, semantic, and grounding standards.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {bGateMetrics.map((m) => (
              <div
                key={m.label}
                className="rounded-lg border border-white/10 bg-white/[0.03] p-4 flex items-center justify-between transition-all hover:border-white/15"
              >
                <div className="space-y-0.5">
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">{m.label}</p>
                  <p className="text-lg font-semibold tabular-nums text-white/90">{m.value}</p>
                </div>
                <div
                  className={`h-2.5 w-2.5 rounded-full ${
                    m.ok ? "bg-emerald-400 shadow-emerald-400/30 shadow-sm" : "bg-rose-400 shadow-rose-400/30 shadow-sm"
                  }`}
                />
              </div>
            ))}
          </div>

          {/* B2 Strict Failure Breakdown */}
          <Card className="mt-6 border-white/10 bg-white/[0.03]">
            <CardHeader>
              <CardTitle className="text-sm text-white/90">B2 Strict Failure Breakdown</CardTitle>
              <CardDescription className="text-white/40 text-xs">
                Categorised reasons for strict-pass failures across {(tel.b2_strict_total as number)} attempts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {Object.entries(
                  (tel.b2_strict_failures as Record<string, number> | undefined) ?? {}
                ).map(([key, count]) => (
                  <div
                    key={key}
                    className="rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 min-w-[180px]"
                  >
                    <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">
                      {key.replace(/_/g, " ")}
                    </p>
                    <p
                      className={`text-xl font-semibold tabular-nums ${
                        count > 0 ? "text-amber-400" : "text-emerald-400"
                      }`}
                    >
                      {count}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ---- Debate Inspector ---- */}
        <section id="debates" className="mb-20">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white">Attempt Inspector</h2>
            <p className="mt-1 text-sm text-white/40">
              Browse representative adversarial debate transcripts and verifier logic traces.
            </p>
          </div>
          <AttemptInspector attempts={attempts} />
        </section>

        {/* ---- Pipeline Configuration ---- */}
        <section className="mb-10">
          <Card className="border-white/10 bg-white/[0.03]">
            <CardHeader>
              <CardTitle className="text-sm text-white/90">Pipeline Configuration</CardTitle>
              <CardDescription className="text-white/40 text-xs">
                Model routing, sampling profile, and gate thresholds for this run.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2">
              {/* Sampling Config */}
              <div className="space-y-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
                  Sampling Profile
                </p>
                <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3 font-mono text-xs text-white/60 space-y-1">
                  <p>
                    Profile:{" "}
                    <span className="text-white/90">
                      {((tel.generation_config_values as Record<string, unknown[]>)
                        ?.sampling_profile as string[])?.[0] ?? "default"}
                    </span>
                  </p>
                  <p>Temperature: <span className="text-white/90">1.0</span></p>
                  <p>Top-K: <span className="text-white/90">64</span></p>
                  <p>Top-P: <span className="text-white/90">0.95</span></p>
                </div>
              </div>
              {/* Gate Thresholds */}
              <div className="space-y-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
                  Gate Thresholds
                </p>
                <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3 font-mono text-xs text-white/60 space-y-1">
                  {Object.entries((tel.thresholds as Record<string, number | null> | undefined) ?? {}).map(
                    ([key, val]) => (
                      <p key={key}>
                        {key.replace(/_/g, " ")}:{" "}
                        <span className="text-white/90">
                          {val === null ? "∞ (uncapped)" : val}
                        </span>
                      </p>
                    )
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ---- Back link ---- */}
        <div className="flex justify-center pt-8">
          <Button asChild variant="outline" className="rounded-full px-8">
            <Link href="/metacog">← Back to MCSB Benchmark</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
