"use client";

import React from "react";
import { 
  Bar, BarChart, CartesianGrid, XAxis, YAxis, 
  ResponsiveContainer, Tooltip, Legend
} from "recharts";
import { ModelEconomics } from "@/lib/economics";
import { getProviderInfo } from "@/lib/metacog";
import { ProviderLogoMap, DeepSeekLogo } from "./provider-logos";

interface Props {
  data: ModelEconomics[];
}

export function MonologueTaxChart({ data }: Props) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const chartData = data.map(d => ({
    name: d.name,
    id: d.id,
    "Base Usage": d.monologueTax.base,
    "Reasoning (CoT)": d.monologueTax.reasoning,
    "Correction (M-Ratio Dividend)": d.monologueTax.correction,
  })).sort((a, b) => (b["Base Usage"] + b["Reasoning (CoT)"] + b["Correction (M-Ratio Dividend)"]) - (a["Base Usage"] + a["Reasoning (CoT)"] + a["Correction (M-Ratio Dividend)"]));

  if (!mounted) {
    return <div className="h-[400px] w-full bg-white/5 animate-pulse rounded-xl" />;
  }

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <BarChart 
          data={chartData} 
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            angle={-35}
            textAnchor="end"
            interval={0}
            height={80}
            tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
            tickFormatter={(val) => `$${val.toFixed(2)}`}
          />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.05)" }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const d = payload[0].payload;
                const info = getProviderInfo(d.id);
                const Logo = ProviderLogoMap[info.provider] || DeepSeekLogo;

                return (
                  <div className="rounded-lg border border-white/10 bg-black/90 p-3 shadow-2xl backdrop-blur-xl">
                    <div className="flex items-center gap-2 mb-2 border-b border-white/10 pb-2">
                      <Logo size={14} className="text-white/80" />
                      <p className="text-xs font-bold text-white">{d.name}</p>
                    </div>
                    <div className="space-y-1.5 mt-2">
                       {payload.map((entry, index) => (
                         <div key={index} className="flex items-center justify-between gap-8">
                           <span className="text-[10px]" style={{ color: entry.color }}>{entry.name}:</span>
                           <span className="text-xs font-mono text-white/90">${Number(entry.value).toFixed(3)}</span>
                         </div>
                       ))}
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
            wrapperStyle={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', paddingBottom: '20px' }}
          />
          <Bar dataKey="Base Usage" stackId="a" fill="#3b82f6" fillOpacity={0.6} radius={[0, 0, 0, 0]} />
          <Bar dataKey="Reasoning (CoT)" stackId="a" fill="#8b5cf6" fillOpacity={0.6}  />
          <Bar dataKey="Correction (M-Ratio Dividend)" stackId="a" fill="#10b981" fillOpacity={0.6} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
