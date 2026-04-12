"use client";

import React, { useMemo } from "react";
import { 
  Bar, BarChart, CartesianGrid, Cell, ReferenceLine, XAxis, YAxis, 
  ResponsiveContainer, Tooltip, Legend, ComposedChart, Scatter, LabelList 
} from "recharts";
import { BenchmarkResults, formatMRatioShiftData } from "@/lib/metacog";

interface Props {
  data: BenchmarkResults;
}

export function MRatioShiftChart({ data }: Props) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const chartData = useMemo(() => formatMRatioShiftData(data), [data]);

  if (!mounted) {
    return <div className="h-[400px] w-full bg-white/5 animate-pulse rounded-xl" />;
  }

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%" minHeight={400} minWidth={0}>
        <ComposedChart data={chartData} margin={{ left: 20, right: 24, top: 40, bottom: 60 }}>
          <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="var(--border)" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            interval={0}
            angle={-35}
            textAnchor="end"
            height={80}
            tickMargin={12}
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
          />
          <YAxis
            type="number"
            domain={[0, 1.5]}
            tickLine={false}
            axisLine={false}
            tickMargin={12}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            tickFormatter={(value) => Number(value).toFixed(2)}
            tickCount={6}
            allowDecimals
            label={{
              value: "Metacognitive M-Ratio",
              angle: -90,
              position: "insideLeft",
              offset: 10,
              fill: "var(--foreground)",
              fontSize: 13,
            }}
          />
          <ReferenceLine y={1} stroke="var(--muted-foreground)" strokeDasharray="5 5" />
          
          <Tooltip
            cursor={{ fill: "var(--accent)", opacity: 0.2 }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const d = payload[0].payload;
                const isPositive = d.shift >= 0;
                return (
                  <div className="rounded-lg border border-white/10 bg-black/80 p-3 shadow-xl backdrop-blur-md">
                    <p className="mb-1 text-sm font-semibold text-white">{d.label}</p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between gap-4">
                        <span className="text-white/50">Static:</span>
                        <span className="text-white">{d.static_m_ratio.toFixed(3)}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-white/50">Dynamic (Turn 2):</span>
                        <span className="text-white">{d.dynamic_m_ratio.toFixed(3)}</span>
                      </div>
                      <div className="mt-2 flex justify-between gap-4 border-t border-white/10 pt-2">
                        <span className="font-medium text-white/50 uppercase tracking-tighter">Shift:</span>
                        <span className={isPositive ? "font-bold text-emerald-400" : "font-bold text-rose-400"}>
                          {isPositive ? "+" : ""}{d.shift.toFixed(3)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />

          <Legend verticalAlign="top" height={36} />

          {/* Shift Bar (representing the movement) */}
          <Bar 
            name="M-Ratio Shift" 
            dataKey="shift" 
            radius={[4, 4, 0, 0]}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.shift >= 0 ? "rgba(16, 185, 129, 0.4)" : "rgba(244, 63, 94, 0.4)"} 
                stroke={entry.shift >= 0 ? "#10b981" : "#f43f5e"}
                strokeWidth={1}
              />
            ))}
            <LabelList 
              dataKey="shift" 
              position="top" 
              formatter={(val: any) => (typeof val === 'number' ? (val >= 0 ? `↑` : `↓`) : '')}
              style={{ fill: '#fff', fontSize: 14, fontWeight: 'bold' }}
            />
          </Bar>

          {/* Individual State Markers */}
          <Scatter 
            name="Static Base" 
            dataKey="static_m_ratio" 
            fill="rgba(255,255,255,0.4)" 
            shape="diamond"
          />
          <Scatter 
            name="Dynamic (Turn 2)" 
            dataKey="dynamic_m_ratio" 
            fill="#fff" 
            shape="circle"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
