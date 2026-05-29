"use client";

import React from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";

interface StageData {
  name: string;
  value: number;
  color: string;
  calls: number;
  prompt: number;
  completion: number;
}

interface ModelData {
  name: string;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  calls: number;
}

interface Props {
  stageTotals: Record<string, { calls: number; prompt_tokens: number; completion_tokens: number; total_tokens: number }>;
  modelTotals: Record<string, { calls: number; prompt_tokens: number; completion_tokens: number; total_tokens: number }>;
}

export function SwarmTelemetryCharts({ stageTotals, modelTotals }: Props) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const stageData = React.useMemo<StageData[]>(() => {
    const colorMap: Record<string, string> = {
      generator_boundary: "#3b82f6", // blue
      generator_refine: "#8b5cf6",   // purple
      judge_adjudication: "#f59e0b", // amber
      verifier_audit: "#10b981",     // emerald
    };

    const labelMap: Record<string, string> = {
      generator_boundary: "Boundary Generation",
      generator_refine: "Adversarial Refinement",
      judge_adjudication: "Judge Adjudication",
      verifier_audit: "Verifier Logic Audit",
    };

    return Object.entries(stageTotals).map(([stage, metrics]) => ({
      name: labelMap[stage] || stage,
      value: metrics.total_tokens,
      color: colorMap[stage] || "#6b7280",
      calls: metrics.calls,
      prompt: metrics.prompt_tokens,
      completion: metrics.completion_tokens,
    }));
  }, [stageTotals]);

  const modelData = React.useMemo<ModelData[]>(() => {
    return Object.entries(modelTotals).map(([model, metrics]) => {
      const cleanName = model.includes("gemma4") ? "Gemma-4 (31B Debater/Gen)" : "GPT-OSS (120B Judge/Ver)";
      return {
        name: cleanName,
        prompt_tokens: metrics.prompt_tokens,
        completion_tokens: metrics.completion_tokens,
        total_tokens: metrics.total_tokens,
        calls: metrics.calls,
      };
    });
  }, [modelTotals]);

  if (!mounted) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-[350px] w-full bg-white/5 animate-pulse rounded-xl" />
        <div className="h-[350px] w-full bg-white/5 animate-pulse rounded-xl" />
      </div>
    );
  }

  const totalTokens = stageData.reduce((acc, d) => acc + d.value, 0);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Chart 1: Stage Token Donut */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        <div className="mb-4">
          <h4 className="text-sm font-medium text-white/90">Stage Token Footprint</h4>
          <p className="text-xs text-white/40">Relative token share consumed by pipeline stage.</p>
        </div>
        <div className="h-[280px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stageData}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {stageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.7} stroke="rgba(0,0,0,0.5)" strokeWidth={1} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload as StageData;
                    const pct = ((d.value / totalTokens) * 100).toFixed(1);
                    return (
                      <div className="rounded-lg border border-white/10 bg-black/95 p-3 shadow-2xl backdrop-blur-xl text-xs space-y-1">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                          {d.name}
                        </div>
                        <div className="text-white/70 font-mono space-y-0.5 mt-1 border-t border-white/10 pt-1.5">
                          <p>Share: <span className="text-white">{pct}%</span></p>
                          <p>Calls: <span className="text-white">{d.calls}</span></p>
                          <p>Tokens: <span className="text-white">{d.value.toLocaleString()}</span></p>
                          <p className="text-[10px] text-white/40">Prompt: {d.prompt.toLocaleString()} | Comp: {d.completion.toLocaleString()}</p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                wrapperStyle={{ fontSize: "10px", color: "rgba(255,255,255,0.5)", marginTop: "10px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Model Workload Stacked Horizontal Bar */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
        <div className="mb-4">
          <h4 className="text-sm font-medium text-white/90">Model Workload Partition</h4>
          <p className="text-xs text-white/40">Prompt vs. Completion token volume by capability tier.</p>
        </div>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={modelData}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 9 }}
                tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
              />
              <YAxis
                dataKey="name"
                type="category"
                axisLine={false}
                tickLine={false}
                width={130}
                tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 10 }}
              />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.02)" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload as ModelData;
                    return (
                      <div className="rounded-lg border border-white/10 bg-black/95 p-3 shadow-2xl backdrop-blur-xl text-xs space-y-1.5">
                        <p className="font-bold text-white">{d.name}</p>
                        <div className="text-white/70 font-mono space-y-0.5 border-t border-white/10 pt-1.5">
                          <p>Total: <span className="text-white">{d.total_tokens.toLocaleString()}</span></p>
                          <p>Prompt: <span className="text-white">{d.prompt_tokens.toLocaleString()}</span></p>
                          <p>Comp: <span className="text-white">{d.completion_tokens.toLocaleString()}</span></p>
                          <p>Calls: <span className="text-white">{d.calls}</span></p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ fontSize: "10px", color: "rgba(255,255,255,0.5)", paddingBottom: "15px" }}
              />
              <Bar dataKey="prompt_tokens" name="Prompt Tokens" stackId="a" fill="#4f46e5" fillOpacity={0.6} radius={[0, 0, 0, 0]} />
              <Bar dataKey="completion_tokens" name="Completion Tokens" stackId="a" fill="#ec4899" fillOpacity={0.6} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
