"use client";

import React, { useMemo } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid } from "recharts";
import { BenchmarkResults, formatResultsForRecharts } from "@/lib/metacog";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

interface Props {
  data: BenchmarkResults;
  type: 'static' | 'dynamic';
}

export const MetacogPlotlyChart = ({ data, type }: Props) => {
  const chartData = useMemo(() => formatResultsForRecharts(data, type), [data, type]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <ChartContainer
        config={{ models: { label: "Models", color: "var(--chart-1)" } }}
        className="h-[520px] w-full"
      >
        <ScatterChart margin={{ left: 20, right: 24, top: 24, bottom: 24 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" />
          <XAxis
            type="number"
            dataKey="accuracy"
            domain={[0.5, 1.05]}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fill: "var(--muted-foreground)" }}
            label={{ value: "Accuracy", position: "insideBottom", offset: -10, fill: "var(--foreground)" }}
          />
          <YAxis
            type="number"
            dataKey="m_ratio"
            domain={[0, 1.5]}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fill: "var(--muted-foreground)" }}
            label={{ value: "M-Ratio", angle: -90, position: "insideLeft", offset: 10, fill: "var(--foreground)" }}
          />
          <ChartTooltip
            cursor={{ stroke: "var(--muted-foreground)", strokeDasharray: "4 4" }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) {
                return null;
              }

              const datum = payload[0]?.payload;

              return (
                <div className="grid min-w-40 gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
                  <div className="text-sm font-medium text-white">{datum.label}</div>
                  <div className="text-xs text-muted-foreground">
                    Accuracy: {datum.accuracy.toFixed(3)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    M-Ratio: {datum.m_ratio.toFixed(3)}
                  </div>
                </div>
              );
            }}
          />
          <Scatter
            name="Models"
            data={chartData}
            shape={(props: any) => (
              <circle
                cx={props.cx}
                cy={props.cy}
                r={8}
                fill={props.payload.color}
                stroke="white"
                strokeWidth={1}
              />
            )}
          />
        </ScatterChart>
      </ChartContainer>
    </div>
  );
};
