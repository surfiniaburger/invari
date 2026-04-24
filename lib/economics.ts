import pricingData from "../public/data/pricing_archive.json";

export interface TokenUsage {
  model: string;
  inputTokens: number;
  outputTokens: number;
}

export const benchmarkUsage: TokenUsage[] = [
  { model: "google/gemini-3.1-pro-preview", inputTokens: 154717, outputTokens: 42367 },
  { model: "google/gemini-3-flash-preview", inputTokens: 153228, outputTokens: 34064 },
  { model: "anthropic/claude-opus-4-7@default", inputTokens: 1251184, outputTokens: 129166 },
  { model: "anthropic/claude-opus-4-6@default", inputTokens: 877240, outputTokens: 73422 },
  { model: "openai/gpt-5.4-2026-03-05", inputTokens: 223974, outputTokens: 68133 },
  { model: "google/gemini-2.5-flash", inputTokens: 154743, outputTokens: 41065 },
  { model: "deepseek-ai/deepseek-v3.2", inputTokens: 207925, outputTokens: 40402 },
  { model: "deepseek-ai/deepseek-v3.1", inputTokens: 216022, outputTokens: 39671 },
  { model: "anthropic/claude-sonnet-4-6@default", inputTokens: 877240, outputTokens: 77325 },
  { model: "google/gemini-3.1-flash-lite-preview", inputTokens: 206262, outputTokens: 41945 },
  { model: "openai/gpt-5.4-mini-2026-03-17", inputTokens: 214132, outputTokens: 53635 },
];

export interface ModelEconomics {
  id: string;
  name: string;
  totalCost: number;
  costPer1k: number;
  inputCost: number;
  outputCost: number;
  cvt: number; // Cost of Verified Truth
  mRatio: number;
  accuracy: number;
  monologueTax: {
    base: number;
    reasoning: number;
    correction: number;
  };
}

export function calculateEconomics(
  results: Record<string, any>, 
  mcsbResults: Record<string, any>
): ModelEconomics[] {
  // Pre-process results into a high-performance lookup map to avoid O(N*M) searches
  const nameToResultMap = new Map<string, any>();
  Object.entries(results).forEach(([key, val]) => {
    nameToResultMap.set(key, val);
    if (val.name) nameToResultMap.set(val.name, val);
  });

  return benchmarkUsage.map((usage) => {
    const price = pricingData.archive.find((p) => p.model === usage.model);
    if (!price) return null;

    const mcsb = mcsbResults[usage.model];
    
    // Efficient O(1) lookups
    const baseResult = nameToResultMap.get(usage.model) || 
                       nameToResultMap.get(mcsb?.name || "");

    const inputCost = (usage.inputTokens / 1000000) * (price.input_1m || 0);
    const outputCost = (usage.outputTokens / 1000000) * (price.output_1m || 0);
    const totalCost = inputCost + outputCost;

    // Accuracy and M-Ratio extraction
    const accuracy = mcsb?.raw_score ?? baseResult?.static?.accuracy ?? baseResult?.multiturn_v2?.overall?.acc ?? 0;
    const mRatio = mcsb?.tier2_m_ratio ?? baseResult?.static?.m_ratio ?? baseResult?.multiturn_v2?.overall?.m_ratio ?? 0;

    // CVT: Cost of Verified Truth (Expected $ per correct trial)
    const costPerTrial = totalCost / 1030;
    const cvt = accuracy > 0 ? costPerTrial / accuracy : Infinity;

    // Monologue Tax Estimation (Normalized for token conservation)
    const baseTokens = 1030 * 150; 
    const efficiencyFactor = Math.min(1, Math.max(0.2, mRatio / 2));
    const reasoningTokens = usage.outputTokens * 0.8 * efficiencyFactor;
    const correctionTokens = usage.outputTokens - reasoningTokens;

    return {
      id: usage.model,
      name: price.display_name || mcsb?.name || usage.model,
      totalCost,
      costPer1k: totalCost * (1000 / 1030),
      inputCost,
      outputCost,
      cvt,
      mRatio,
      accuracy,
      monologueTax: {
        base: (baseTokens / 1000000) * (price.input_1m || 0),
        reasoning: (reasoningTokens / 1000000) * (price.output_1m || 0),
        correction: (correctionTokens / 1000000) * (price.output_1m || 0),
      },
    };
  }).filter((d): d is ModelEconomics => d !== null);
}
