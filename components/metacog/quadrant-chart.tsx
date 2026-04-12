"use client";

import * as React from "react";
import {
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
} from "recharts";

import { ChartContainer, ChartTooltip, type ChartConfig } from "@/components/ui/chart";
import { MCSBResults, getProviderInfo } from "@/lib/metacog";

interface QuadrantChartProps {
  data: MCSBResults;
}

const chartConfig = {
  sensitivity: {
    label: "Sensitivity",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const logoFilters: Record<string, string> = {
  "/images/chatgpt-4.svg": "invert(1) brightness(2) contrast(1.2)",
  "/images/zlm.svg": "invert(1) brightness(2.2) contrast(1.3)",
};

function ModelPoint(props: any) {
  const { cx, cy, payload } = props;
  if (cx === undefined || cy === undefined) return null;
  const size = 26;
  const info = getProviderInfo(payload.name);
  const filter = logoFilters[payload.logo] ?? "";

  return (
    <g>
      <circle cx={cx} cy={cy} r={14} fill="rgba(15, 23, 42, 0.6)" stroke={info.color} strokeWidth={2} />
      {payload.logo ? (
        <image
          href={payload.logo}
          x={cx - size / 2}
          y={cy - size / 2}
          width={size}
          height={size}
          preserveAspectRatio="xMidYMid meet"
          style={filter ? { filter } : undefined}
        />
      ) : null}
    </g>
  );
}

function QuadrantTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="rounded-lg border border-white/10 bg-black/90 px-3 py-2 text-xs text-white shadow-xl">
      <div className="font-semibold text-white/90">{data.name}</div>
      <div className="mt-1 flex items-center justify-between gap-4">
        <span className="text-white/40 uppercase tracking-wider">Resilience</span>
        <span className="text-white">{(data.resilience ?? 0).toFixed(3)}</span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <span className="text-white/40 uppercase tracking-wider">Sensitivity (M-Ratio)</span>
        <span className="text-white">
          {(data.rawSensitivity ?? 0).toFixed(3)}
          {data.rawSensitivity > 1.0 ? " (Clamped)" : ""}
        </span>
      </div>
    </div>
  );
}

export function QuadrantChart({ data }: QuadrantChartProps) {
  const [isMobile, setIsMobile] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const quadrantData = React.useMemo(() => {
    return Object.entries(data).map(([_, m]) => ({
      name: m.name,
      resilience: m.tier3_alignment,
      // Clamp for visualization, keep raw for tooltip
      sensitivity: Math.min(1.0, m.tier2_m_ratio),
      rawSensitivity: m.tier2_m_ratio,
      logo: m.logo,
    }));
  }, [data]);

  // Responsive values
  const margin = isMobile 
    ? { top: 20, right: 10, bottom: 40, left: 50 }
    : { top: 48, right: 32, bottom: 64, left: 100 };
  
  const xAxisOffset = isMobile ? -10 : -32;
  const yAxisOffset = isMobile ? -40 : -80;
  const yAxisDy = isMobile ? 20 : 40;
  const labelFontSize = isMobile ? 8 : 11;
  const quadrantLabelClass = isMobile ? "text-[8px] left-8 right-8 top-6 bottom-12" : "text-[11px] left-14 right-14 top-14 bottom-24";

  if (!mounted) {
    return <div className="h-[320px] w-full md:h-[420px] bg-white/5 animate-pulse rounded-xl" />;
  }

  return (
    <div className="relative h-[320px] w-full md:h-[420px]">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={margin}>
            <CartesianGrid strokeDasharray="4 6" stroke="rgba(148, 163, 184, 0.35)" />
            <XAxis
              type="number"
              dataKey="resilience"
              domain={[0, 1]}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value.toFixed(1)}
              tickMargin={8}
              stroke="rgba(226, 232, 240, 0.7)"
              label={{
                value: isMobile ? "Resilience" : "Adversarial Code-Security Alignment (Tier 3)",
                position: "insideBottom",
                offset: xAxisOffset,
                fill: "rgba(226, 232, 240, 0.8)",
                fontSize: labelFontSize,
                fontWeight: 500,
                letterSpacing: "0.05em",
              }}
            />
            <YAxis
              type="number"
              dataKey="sensitivity"
              domain={[0, 1]}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value.toFixed(1)}
              tickMargin={8}
              stroke="rgba(226, 232, 240, 0.7)"
              label={{
                value: isMobile ? "M-Ratio" : "Foundational Sensitivity (Tier 2 M-Ratio)",
                angle: -90,
                position: "insideLeft",
                offset: yAxisOffset,
                dy: yAxisDy,
                fill: "rgba(226, 232, 240, 0.8)",
                fontSize: labelFontSize,
                fontWeight: 500,
                letterSpacing: "0.05em",
              }}
            />
            <ReferenceLine x={0.5} stroke="rgba(148, 163, 184, 0.6)" strokeDasharray="6 6" />
            <ReferenceLine y={0.5} stroke="rgba(148, 163, 184, 0.6)" strokeDasharray="6 6" />
            <ChartTooltip content={<QuadrantTooltip />} />
            <Scatter data={quadrantData} dataKey="sensitivity" shape={ModelPoint} />
          </ScatterChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Quadrant Legend Labels */}
      <div className={`pointer-events-none absolute text-white/45 font-medium uppercase tracking-[0.2em] transition-all duration-300
        ${isMobile ? 'left-4 top-2 text-[8px]' : 'left-14 top-14 text-[11px]'}
      `}>
        {isMobile ? 'Blind' : 'Stable but Blind'}
      </div>
      <div className={`pointer-events-none absolute text-white/45 font-medium uppercase tracking-[0.2em] transition-all duration-300
        ${isMobile ? 'right-4 top-2 text-[8px]' : 'right-14 top-14 text-[11px]'}
      `}>
        {isMobile ? 'Safety' : 'High Integrity Safety'}
      </div>
      <div className={`pointer-events-none absolute text-white/45 font-medium uppercase tracking-[0.2em] transition-all duration-300
        ${isMobile ? 'left-4 bottom-14 text-[8px]' : 'left-14 bottom-24 text-[11px]'}
      `}>
        {isMobile ? 'Brittle' : 'Brittleness Zone'}
      </div>
      <div className={`pointer-events-none absolute text-white/45 font-medium uppercase tracking-[0.2em] transition-all duration-300
        ${isMobile ? 'right-4 bottom-14 text-[8px]' : 'right-14 bottom-24 text-[11px]'}
      `}>
        {isMobile ? 'Swayable' : 'Calibrated but Swayable'}
      </div>
    </div>
  );
}
