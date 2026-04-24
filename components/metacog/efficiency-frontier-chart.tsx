"use client";

import React from "react";
import { 
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList
} from "recharts";
import { ModelEconomics } from "@/lib/economics";
import { getProviderInfo } from "@/lib/metacog";
import { ProviderLogoMap, DeepSeekLogo } from "./provider-logos";

interface Props {
  data: ModelEconomics[];
}

export function EfficiencyFrontierChart({ data }: Props) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  // Use log scale for cost
  const chartData = React.useMemo(() => data.map(d => ({
    ...d,
    logCost: Math.log10(d.totalCost * 1000 / 1030 + 0.01), // normalize to cost per 1k + epsilon
  })).sort((a, b) => a.logCost - b.logCost), [data]);

  if (!mounted) {
    return <div className="h-[300px] w-full bg-white/5 animate-pulse rounded-xl" />;
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <ScatterChart margin={{ top: 20, right: 40, bottom: 40, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            type="number" 
            dataKey="logCost" 
            name="Log Cost" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
            label={{ value: "Log Cost ($/1k)", position: "insideBottom", fill: "rgba(255,255,255,0.3)", fontSize: 10, offset: -5 }}
          />
          <YAxis 
            type="number" 
            dataKey="accuracy" 
            name="Trust Score" 
            domain={[0.4, 1.0]}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
            label={{ value: "Trust Score (MCSB v2)", angle: -90, position: "insideLeft", fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
          />
          <ZAxis type="number" range={[50, 400]} />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }} 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const d = payload[0].payload as ModelEconomics;
                const info = getProviderInfo(d.id);
                const Logo = ProviderLogoMap[info.provider] || DeepSeekLogo;

                return (
                  <div className="rounded-lg border border-white/10 bg-black/90 p-3 shadow-2xl backdrop-blur-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Logo size={14} className="text-white/80" />
                      <p className="text-xs font-bold text-white">{d.name}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between gap-8">
                        <span className="text-[10px] text-white/40">Trust Score:</span>
                        <span className="text-xs font-mono text-emerald-400">{(d.accuracy * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between gap-8 border-t border-white/5 pt-1 mt-1">
                        <span className="text-[10px] text-white/40 italic">Cost/1k trials:</span>
                        <span className="text-xs font-mono text-white/70">${d.costPer1k.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Scatter name="Models" data={chartData}>
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={getProviderInfo(entry.id).color} 
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
