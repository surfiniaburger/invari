/**
 * Metacognitive Benchmark Data Service
 * 
 * Follows Code as Communication / Single Responsibility (Dave Farley habit):
 * - Isolates data structure from UI.
 * - Provides type-safe access to raw benchmark results.
 */

export interface BinData {
  acc: number;
  count: number;
}

export interface CalibrationBins {
  [bin: string]: BinData;
}

export interface BenchmarkMetrics {
  accuracy?: number;
  m_ratio?: number;
  ece?: number;
  brier?: number;
  bins?: CalibrationBins;
}

export interface MultiTurnMetrics {
  overall: {
    acc: number;
    m_ratio: number;
    ece?: number;
    brier?: number;
    sensitivity?: number;
    bins?: CalibrationBins;
  };
  positive?: any;
  negative?: any;
  neutral?: any;
}

export interface ModelData {
  name: string;
  static: BenchmarkMetrics;
  multiturn_v2: MultiTurnMetrics;
}

export interface BenchmarkResults {
  [modelId: string]: ModelData;
}

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

/**
 * Maps raw model IDs to formal provider display names and brand colors.
 */
export const PROVIDER_CONFIG: Record<
  string,
  { label: string; color: string; provider: "anthropic" | "google" | "openai" | "other" }
> = {
  "Claude Opus 4.6": { label: "Claude Opus 4.6", color: "#6366f1", provider: "anthropic" },
  "Claude Sonnet 4.6": { label: "Claude Sonnet 4.6", color: "#818cf8", provider: "anthropic" },
  "Gemini 3.1 Pro": { label: "Gemini 3.1 Pro", color: "#10b981", provider: "google" },
  "Gemini 3 Flash Preview": { label: "Gemini 3 Flash Preview", color: "#34d399", provider: "google" },
  "Gemini 3.1 Flash-Lite": { label: "Gemini 3.1 Flash-Lite", color: "#6ee7b7", provider: "google" },
  "Gemini 2.5 Flash": { label: "Gemini 2.5 Flash", color: "#22c55e", provider: "google" },
  "GPT-5.4": { label: "GPT-5.4", color: "#f43f5e", provider: "openai" },
  "GPT-OSS-20B": { label: "GPT-OSS-20B", color: "#fb7185", provider: "openai" },
  "DeepSeek V3.2": { label: "DeepSeek V3.2", color: "#06b6d4", provider: "other" },
  "DeepSeek V3.1": { label: "DeepSeek V3.1", color: "#22d3ee", provider: "other" },
  "GLM-5": { label: "GLM-5", color: "#f59e0b", provider: "other" },
  "anthropic/claude-opus-4-6@default": { label: "Claude Opus 4.6", color: "#6366f1", provider: "anthropic" },
  "anthropic/claude-sonnet-4-6@default": { label: "Claude Sonnet 4.6", color: "#818cf8", provider: "anthropic" },
  "google/gemini-2.5-flash": { label: "Gemini 2.5 Flash", color: "#22c55e", provider: "google" },
  "google/gemini-3.1-flash-lite-preview": { label: "Gemini 3.1 Flash-Lite", color: "#6ee7b7", provider: "google" },
  "google/gemini-3-flash-preview": { label: "Gemini 3 Flash Preview", color: "#34d399", provider: "google" },
  "google/gemini-3.1-pro-preview": { label: "Gemini 3.1 Pro", color: "#10b981", provider: "google" },
  "openai/gpt-oss-20b": { label: "GPT-OSS-20B", color: "#fb7185", provider: "openai" },
  "openai/gpt-5.4-2026-03-05": { label: "GPT-5.4", color: "#f43f5e", provider: "openai" },
  "openai/gpt-5.4-mini-2026-03-17": { label: "GPT-5.4 Mini", color: "#fb7185", provider: "openai" },
  "deepseek-ai/deepseek-v3.1": { label: "DeepSeek V3.1", color: "#22d3ee", provider: "other" },
  "deepseek-ai/deepseek-v3.2": { label: "DeepSeek V3.2", color: "#06b6d4", provider: "other" },
  "zai/glm-5": { label: "GLM-5", color: "#f59e0b", provider: "other" },
  // Backwards-compat and Raw IDs from Batch Extraction
  "anthropic/claude-opus-4-6@default": { label: "Claude Opus 4.6", color: "#6366f1", provider: "anthropic" },
  "anthropic/claude-sonnet-4-6@default": { label: "Claude Sonnet 4.6", color: "#818cf8", provider: "anthropic" },
  "google/gemini-3.1-pro-preview": { label: "Gemini 3.1 Pro", color: "#10b981", provider: "google" },
  "google/gemini-3.1-flash-lite-preview": { label: "Gemini 3.1 Flash-Lite", color: "#6ee7b7", provider: "google" },
  "google/gemini-3-flash-preview": { label: "Gemini 3 Flash Preview", color: "#34d399", provider: "google" },
  "google/gemini-2.5-flash": { label: "Gemini 2.5 Flash", color: "#22c55e", provider: "google" },
  "openai/gpt-5.4-2026-03-05": { label: "GPT-5.4", color: "#f43f5e", provider: "openai" },
  "openai/gpt-5.4-mini-2026-03-17": { label: "GPT-5.4 Mini", color: "#fb7185", provider: "openai" },
  "openai/gpt-oss-20b": { label: "GPT-OSS-20B", color: "#fb7185", provider: "openai" },
  "deepseek-ai/deepseek-v3.1": { label: "DeepSeek V3.1", color: "#22d3ee", provider: "other" },
  "zai/glm-5": { label: "GLM-5", color: "#f59e0b", provider: "other" },
  // Legacy aliases
  claude_opus: { label: "Claude Opus 4.6", color: "#6366f1", provider: "anthropic" },
  claude_sonnet: { label: "Claude Sonnet 4.6", color: "#818cf8", provider: "anthropic" },
  gpt5: { label: "GPT-5.4", color: "#f43f5e", provider: "openai" },
  "deepseek-v3.2": { label: "DeepSeek V3.2", color: "#06b6d4", provider: "other" },
};

export function getProviderInfo(modelId: string) {
  return PROVIDER_CONFIG[modelId] || { label: modelId, color: "#9ca3af", provider: "other" };
}

/**
 * Normalizes results into a flat Plotly-ready series.
 */
export function formatResultsForPlotly(data: BenchmarkResults, type: 'static' | 'dynamic') {
  const x: number[] = [];
  const y: number[] = [];
  const text: string[] = [];
  const colors: string[] = [];

  Object.entries(data).forEach(([id, model]) => {
    let acc: number | undefined;
    let m_ratio: number | undefined;

    if (type === 'static') {
      acc = model.static?.accuracy;
      m_ratio = model.static?.m_ratio;
    } else {
      const overall = model.multiturn_v2?.overall;
      acc = overall?.acc;
      m_ratio = overall?.m_ratio;
    }

    if (acc !== undefined && m_ratio !== undefined) {
      const info = getProviderInfo(id);
      x.push(acc);
      y.push(m_ratio);
      text.push(info.label);
      colors.push(info.color);
    }
  });

  return { x, y, text, marker: { color: colors, size: 12 } };
}

export function formatResultsForRecharts(data: BenchmarkResults, type: "static" | "dynamic") {
  const points: Array<{
    label: string;
    accuracy: number;
    m_ratio: number;
    color: string;
    labelOffsetX: number;
    labelOffsetY: number;
  }> = [];

  Object.entries(data).forEach(([id, model]) => {
    let acc: number | undefined;
    let m_ratio: number | undefined;

    if (type === "static") {
      acc = model.static?.accuracy;
      m_ratio = model.static?.m_ratio;
    } else {
      const overall = model.multiturn_v2?.overall;
      acc = overall?.acc;
      m_ratio = overall?.m_ratio;
    }

    if (acc !== undefined && m_ratio !== undefined) {
      const info = getProviderInfo(id);
      points.push({
        label: info.label,
        accuracy: acc,
        m_ratio,
        color: info.color,
        labelOffsetX: 0,
        labelOffsetY: 0,
      });
    }
  });

  const proximityX = 0.015;
  const proximityY = 0.06;
  const offsets = [-16, -4, 8, 20, 32];
  const sorted = [...points].sort((a, b) => a.accuracy - b.accuracy);

  sorted.forEach((point, index) => {
    const neighbors = sorted.filter(
      (other, otherIndex) =>
        otherIndex !== index &&
        Math.abs(other.accuracy - point.accuracy) < proximityX &&
        Math.abs(other.m_ratio - point.m_ratio) < proximityY
    );

    if (neighbors.length > 0) {
      const offsetIndex = (neighbors.length + index) % offsets.length;
      point.labelOffsetY = offsets[offsetIndex];
      point.labelOffsetX = offsetIndex % 2 === 0 ? -6 : 6;
    }
  });

  return points;
}

export function formatCalibrationCurveData(data: BenchmarkResults, type: 'static' | 'dynamic' = 'static') {
  const series: Array<{
    label: string;
    points: Array<{ confidence: number; accuracy: number; count: number }>;
    color: string;
    isProxy: boolean;
  }> = [];

  Object.entries(data).forEach(([id, model]) => {
    const info = getProviderInfo(id);
    
    // Type-safe extraction
    let bins: CalibrationBins | undefined;
    let accuracy: number | undefined;
    let ece: number | undefined;

    if (type === 'static') {
      bins = model.static.bins;
      accuracy = model.static.accuracy;
      ece = model.static.ece;
    } else {
      bins = model.multiturn_v2.overall.bins;
      accuracy = model.multiturn_v2.overall.acc;
      ece = model.multiturn_v2.overall.ece;
    }
    
    if (bins) {
      const points = Object.entries(bins)
        .map(([bin, binData]) => ({
          confidence: (parseInt(bin) - 0.5) / 6,
          accuracy: binData.acc,
          count: binData.count
        }))
        .filter(p => p.count > 0)
        .sort((a, b) => a.confidence - b.confidence);

      if (points.length > 0) {
        series.push({
          label: info.label,
          points,
          color: info.color,
          isProxy: false
        });
      }
    } else if (accuracy !== undefined) {
      series.push({
        label: info.label,
        points: [{
          confidence: clamp(accuracy + (ece || 0)),
          accuracy: accuracy,
          count: 150
        }],
        color: info.color,
        isProxy: true
      });
    }
  });

  return series;
}

export function formatMRatioShiftData(data: BenchmarkResults) {
  const rows: Array<{
    label: string;
    static_m_ratio: number;
    dynamic_m_ratio: number;
    shift: number;
    color: string;
  }> = [];

  Object.entries(data).forEach(([id, model]) => {
    const staticRatio = model.static?.m_ratio;
    const dynamicRatio = model.multiturn_v2?.overall?.m_ratio;

    if (staticRatio !== undefined && dynamicRatio !== undefined) {
      const info = getProviderInfo(id);
      rows.push({
        label: info.label,
        static_m_ratio: staticRatio,
        dynamic_m_ratio: dynamicRatio,
        shift: dynamicRatio - staticRatio,
        color: info.color,
      });
    }
  });

  return rows.sort((a, b) => b.shift - a.shift);
}
