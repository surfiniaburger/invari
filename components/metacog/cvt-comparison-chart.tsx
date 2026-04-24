"use client";

import React from "react";
import { 
  Bar, BarChart, CartesianGrid, XAxis, YAxis, 
  ResponsiveContainer, Tooltip, Cell, LabelList
} from "recharts";
import { ModelEconomics } from "@/lib/economics";
import { getProviderInfo } from "@/lib/metacog";
import { ProviderLogoMap, DeepSeekLogo } from "./provider-logos";

interface Props {
  data: ModelEconomics[];
}

export function CVTComparisonChart({ data }: Props) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const chartData = [...data].sort((a, b) => b.cvt - a.cvt);

  if (!mounted) {
    return <div className="h-[300px] w-full bg-white/5 animate-pulse rounded-xl" />;
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <BarChart 
          data={chartData} 
          margin={{ top: 20, right: 30, left: 0, bottom: 40 }}
          layout="vertical"
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
          <XAxis 
            type="number" 
            hide 
            domain={[0, 'auto']} 
          />
          <YAxis 
            dataKey="name" 
            type="category" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }}
            width={120}
          />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.05)" }}
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
                    <p className="text-[10px] text-white/50 mb-2 underline decoration-emerald-500/50 underline-offset-4">
                      Cost of Verified Truth
                    </p>
                    <div className="space-y-1">
                      <div className="flex justify-between gap-8">
                        <span className="text-[10px] text-white/40">CVT:</span>
                        <span className="text-xs font-mono text-emerald-400">${d.cvt.toFixed(3)}</span>
                      </div>
                      <div className="flex justify-between gap-8">
                        <span className="text-[10px] text-white/40">Total Run:</span>
                        <span className="text-xs font-mono text-white/70">${d.totalCost.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar 
            dataKey="cvt" 
            radius={[0, 4, 4, 0]}
            barSize={12}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.name.includes("DeepSeek") || entry.name.includes("Flash") ? "#10b981" : "#3b82f6"} 
                fillOpacity={0.8}
              />
            ))}
            <LabelList 
              dataKey="cvt" 
              position="right" 
              formatter={(val: any) => typeof val === 'number' ? `$${val.toFixed(2)}` : val}
              style={{ fill: "rgba(255,255,255,0.7)", fontSize: 10, fontWeight: 500, fontFamily: 'monospace' }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
