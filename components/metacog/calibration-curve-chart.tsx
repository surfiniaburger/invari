"use client";

import React, { useMemo } from "react";
import { CartesianGrid, Line, LineChart, ReferenceLine, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { getProviderInfo } from "@/lib/metacog";
import calibrationBins from "@/public/data/calibration_bins.json";

interface Props {
  mode?: "static" | "dynamic";
}

type CalibrationBins = Record<
  string,
  {
    static: { bins: Record<string, { acc: number; count: number }> };
    dynamic: { bins: Record<string, { acc: number; count: number }> };
  }
>;

export function CalibrationCurveChart({ mode = "static" }: Props) {
  const { chartData, models } = useMemo(() => {
    const bins = Array.from({ length: 6 }, (_, index) => ({
      bin: index + 1,
      confidence: (index + 1) / 6,
    }));

    const entries = Object.entries(calibrationBins as CalibrationBins).map(([id]) => {
      const info = getProviderInfo(id);
      return { id, label: info.label, color: info.color };
    });

    const data = bins.map((bin) => {
      const row: Record<string, number | null> & { bin: number; confidence: number } = {
        bin: bin.bin,
        confidence: bin.confidence,
      };

      entries.forEach(({ id }) => {
        const binData = (calibrationBins as CalibrationBins)[id]?.[mode]?.bins?.[String(bin.bin)];
        row[id] = binData && binData.count > 0 ? Number(binData.acc.toFixed(3)) : null;
      });

      return row;
    });

    return { chartData: data, models: entries };
  }, [mode]);

  return (
    <ChartContainer
      config={models.reduce<Record<string, { label: string; color: string }>>((acc, model) => {
        acc[model.id] = { label: model.label, color: model.color };
        return acc;
      }, {})}
      className="h-[320px] w-full"
    >
      <LineChart data={chartData} margin={{ left: 20, right: 24, top: 16, bottom: 16 }}>
        <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="var(--border)" />
        <XAxis
          type="number"
          dataKey="confidence"
          domain={[0, 1]}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={{ fill: "var(--muted-foreground)" }}
          label={{
            value: "Confidence (bin / 6)",
            position: "insideBottom",
            offset: -10,
            fill: "var(--foreground)",
          }}
        />
        <YAxis
          type="number"
          domain={[0, 1]}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={{ fill: "var(--muted-foreground)" }}
          label={{
            value: "Observed Accuracy",
            angle: -90,
            position: "insideLeft",
            offset: 10,
            fill: "var(--foreground)",
          }}
        />
        <ReferenceLine
          segment={[
            { x: 0, y: 0 },
            { x: 1, y: 1 },
          ]}
          stroke="var(--muted-foreground)"
          strokeDasharray="6 6"
        />
        <ChartTooltip
          cursor={{ stroke: "var(--muted-foreground)", strokeDasharray: "4 4" }}
          content={({ active, payload }) => {
            if (!active || !payload?.length) {
              return null;
            }

            const filtered = payload.filter((entry) => entry.value != null);
            const confidence = (payload[0]?.payload?.confidence ?? 0).toFixed(2);

            return (
              <div className="grid min-w-44 gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
                <div className="text-xs text-muted-foreground">Confidence: {confidence}</div>
                {filtered.map((entry) => (
                  <div key={entry.name} className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">{entry.name}</span>
                    <span className="text-xs text-white">
                      {Number(entry.value).toFixed(3)}
                    </span>
                  </div>
                ))}
              </div>
            );
          }}
        />
        {models.map((model) => (
          <Line
            key={model.id}
            dataKey={model.id}
            stroke={model.color}
            strokeWidth={2}
            strokeOpacity={0.6}
            dot={{ r: 3, fill: model.color, strokeWidth: 0 }}
            activeDot={{ r: 5, strokeWidth: 0 }}
            connectNulls
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
}
