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
  const providerIcons: Record<string, string> = {
    openai: "/images/chatgpt-4.svg",
    anthropic: "/images/anthropic-1.svg",
    google: "/images/gemini-icon-logo.svg",
    glm: "/images/images.jpeg",
  };

  const getIconForModel = (payload: { provider?: string; label?: string }) => {
    if (payload.provider && providerIcons[payload.provider]) {
      return providerIcons[payload.provider];
    }
    if (payload.label?.toLowerCase().includes("glm")) {
      return providerIcons.glm;
    }
    if (payload.label?.toLowerCase().includes("deepseek")) {
      return "/images/deepseek-2.svg";
    }
    return null;
  };

  const getIconFilter = (payload: { provider?: string }) => {
    if (payload.provider === "openai") {
      return "invert(1) brightness(1.35) contrast(1.1)";
    }
    return "none";
  };

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
              (() => {
                const iconSrc = getIconForModel(props.payload);
                if (!iconSrc) {
                  return (
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      r={8}
                      fill={props.payload.color}
                      stroke="white"
                      strokeWidth={1}
                    />
                  );
                }

                return (
                  <g>
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      r={11}
                      fill="hsl(var(--background))"
                      stroke="white"
                      strokeWidth={1}
                    />
                    <image
                      href={iconSrc}
                      x={props.cx - 9}
                      y={props.cy - 9}
                      width={18}
                      height={18}
                      preserveAspectRatio="xMidYMid meet"
                      style={{ filter: getIconFilter(props.payload) }}
                    />
                  </g>
                );
              })()
            )}
          />
        </ScatterChart>
      </ChartContainer>
    </div>
  );
};
