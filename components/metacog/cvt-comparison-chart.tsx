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

  const chartData = React.useMemo(() => data.map(d => ({
    ...d,
    mCVT: d.cvt * 1000
  })).sort((a, b) => b.mCVT - a.mCVT), [data]);

  if (!mounted) {
    return <div className="h-[300px] w-full bg-white/5 animate-pulse rounded-xl" />;
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <BarChart 
          data={chartData} 
          margin={{ top: 20, right: 60, left: 0, bottom: 40 }}
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
                const d = payload[0].payload as ModelEconomics & { mCVT: number };
                const info = getProviderInfo(d.id);
                const Logo = ProviderLogoMap[info.provider] || DeepSeekLogo;
                
                return (
                  <div className="rounded-lg border border-white/10 bg-black/90 p-3 shadow-2xl backdrop-blur-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Logo size={14} className="text-white/80" />
                      <p className="text-xs font-bold text-white">{d.name}</p>
                    </div>
                    <p className="text-[10px] text-white/50 mb-2 underline decoration-emerald-500/50 underline-offset-4">
                      Cost of Verified Trust (CVT)
                    </p>
                    <div className="space-y-1">
                      <div className="flex justify-between gap-8 text-emerald-400">
                        <span className="text-[10px] text-white/40">Value (mCVT):</span>
                        <span className="text-xs font-mono">{d.mCVT.toFixed(2)} mCVT</span>
                      </div>
                      <div className="flex justify-between gap-8 pt-1">
                        <span className="text-[10px] text-white/40">Trust Score:</span>
                        <span className="text-xs font-mono text-white/70">{(d.accuracy * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar 
            dataKey="mCVT" 
            radius={[0, 4, 4, 0]}
            barSize={12}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={getProviderInfo(entry.id).color} 
                fillOpacity={0.8}
              />
            ))}
            <LabelList 
              dataKey="mCVT" 
              position="right" 
              formatter={(val: any) => typeof val === 'number' ? `${val.toFixed(2)} mCVT` : val}
              style={{ fill: "rgba(255,255,255,0.7)", fontSize: 10, fontWeight: 500, fontFamily: 'monospace' }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
