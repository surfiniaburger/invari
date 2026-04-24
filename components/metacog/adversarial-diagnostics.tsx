import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
  LabelList,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getProviderInfo } from "@/lib/metacog";

// --- EMPIRICAL DATA FROM LOGS ---
const tierData = [
  {
    name: "GPT-5.4",
    t1_acc: 1.0,
    t2_acc: 0.784,
    t3_acc: 0.515,
    t1_ece: 0.007,
    t2_ece: 0.204,
    t3_ece: 0.313,
    alignment: 44.2,
    over: 46,
    under: 30,
    shift: -0.474,
  },
  {
    name: "Claude Opus 4.6",
    t1_acc: 0.857,
    t2_acc: 0.743,
    t3_acc: 0.5,
    t1_ece: 0.087,
    t2_ece: 0.086,
    t3_ece: 0.409,
    alignment: 12.2,
    over: 6,
    under: 129,
    shift: -0.092,
  },
  {
    name: "Claude Opus 4.7",
    t1_acc: 0.929,
    t2_acc: 0.632,
    t3_acc: 0.52,
    t1_ece: 0.027,
    t2_ece: 0.12,
    t3_ece: 0.363,
    alignment: 26.4,
    over: 11,
    under: 74,
    shift: -0.072,
  },
  {
    name: "Gemini 3.1 Pro",
    t1_acc: 0.929,
    t2_acc: 0.891,
    t3_acc: 0.51,
    t1_ece: 0.053,
    t2_ece: 0.057,
    t3_ece: 0.446,
    alignment: 36.4,
    over: 1,
    under: 38,
    shift: 0.162,
  },
  {
    name: "DeepSeek V3.2",
    t1_acc: 0.929,
    t2_acc: 0.528,
    t3_acc: 0.531,
    t1_ece: 0.08,
    t2_ece: 0.358,
    t3_ece: 0.368,
    alignment: 41.8,
    over: 35,
    under: 39,
    shift: -0.002,
  },
];

// Pivot for Accuracy Grouped Bar
const accuracyData = [
  { tier: "Tier 1 (Pilot)", ...Object.fromEntries(tierData.map(m => [m.name, m.t1_acc])) },
  { tier: "Tier 2 (Core)", ...Object.fromEntries(tierData.map(m => [m.name, m.t2_acc])) },
  { tier: "Tier 3 (Adversarial)", ...Object.fromEntries(tierData.map(m => [m.name, m.t3_acc])) },
];

// Calibration Breakdown (Line chart)
const calibrationData = [
  { name: "Tier 1", ece: 0.05, brier: 0.03 },
  { name: "Tier 2", ece: 0.17, brier: 0.15 },
  { name: "Tier 3", ece: 0.38, brier: 0.42 },
];

export function AdversarialDiagnostics() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-[600px] w-full bg-white/5 animate-pulse rounded-xl" />;

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* PANEL A: Performance Degradation */}
        <Card className="border-white/10 bg-black/40 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-white">Panel A: Performance Degradation</CardTitle>
            <CardDescription className="text-xs text-white/70 italic">
              "Adversarial CVE prompts induce approaching chance-level performance across models"
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={accuracyData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" vertical={false} />
                <XAxis dataKey="tier" stroke="#ffffff80" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 1]} stroke="#ffffff80" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#000", border: "1px solid #ffffff20", fontSize: "12px" }}
                  itemStyle={{ fontSize: "11px" }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "11px", marginTop: "10px", color: "#ffffff90" }} />
                {tierData.map((model) => (
                  <Bar
                    key={model.name}
                    dataKey={model.name}
                    name={getProviderInfo(model.name).label}
                    fill={getProviderInfo(model.name).color}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* PANEL B: Calibration Breakdown */}
        <Card className="border-white/10 bg-black/40 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-white">Panel B: Calibration Error (ECE / Brier)</CardTitle>
            <CardDescription className="text-xs text-white/70 italic">
              "Confidence becomes unreliable under adversarial perturbations"
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={calibrationData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff80" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => getProviderInfo(v).label} />
                <YAxis stroke="#ffffff80" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#000", border: "1px solid #ffffff20", fontSize: "12px" }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "11px", marginTop: "10px", color: "#ffffff90" }} />
                <Line type="monotone" dataKey="ece" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981" }} name="Avg ECE" />
                <Line type="monotone" dataKey="brier" stroke="#f59e0b" strokeWidth={2} dot={{ fill: "#f59e0b" }} name="Avg Brier" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* PANEL C: Alignment Failure */}
        <Card className="border-white/10 bg-black/40 backdrop-blur-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-white">Panel C: Alignment / Resilience Failure</CardTitle>
            <CardDescription className="text-xs text-white/70 italic">
              "Alignment is quantified via response consistency under perturbation, decomposed into underreaction (invariance to critical changes) and overreaction (sensitivity to irrelevant perturbations)."
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tierData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff80" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => getProviderInfo(v).label} />
                <YAxis stroke="#ffffff80" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#000", border: "1px solid #ffffff20", fontSize: "12px" }} />
                <Bar dataKey="alignment" name="Alignment Rate (%)" fill="#3b82f630" radius={[4, 4, 0, 0]}>
                  {tierData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.alignment < 20 ? "#f43f5e80" : "#3b82f660"} />
                  ))}
                  <LabelList dataKey="alignment" position="top" style={{ fill: "#ffffff90", fontSize: "11px" }} formatter={(v: any) => `${v}%`} />
                </Bar>
                <Bar dataKey="over" name="Overreactions" fill="#f43f5e" radius={[2, 2, 0, 0]} barSize={10} />
                <Bar dataKey="under" name="Underreactions" fill="#60a5fa" radius={[2, 2, 0, 0]} barSize={10} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* OPTIONAL FIGURE 2: Confidence Shift Under Adversarial Perturbation */}
      <Card className="border-emerald-500/30 bg-emerald-500/10">
        <CardHeader>
          <CardTitle className="text-emerald-400 text-sm font-medium uppercase tracking-wider">
            Figure 2: Confidence Shift Under Adversarial Perturbation (Δ)
          </CardTitle>
          <CardDescription className="text-emerald-500/70 text-xs text-balance">
            "Large variance in Δ reveals instability in belief updating, exposing a gap between prediction and self-assessment."
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[250px] pb-12">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={tierData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#10b98120" horizontal={false} />
              <XAxis type="number" domain={[-0.6, 0.6]} stroke="#10b98180" fontSize={11} />
              <YAxis dataKey="name" type="category" stroke="#ffffff90" fontSize={11} width={100} tickFormatter={(v) => getProviderInfo(v).label} />
              <Tooltip
                cursor={{ fill: "#10b98110" }}
                contentStyle={{ backgroundColor: "#000", border: "1px solid #10b98140", fontSize: "12px" }}
              />
              <Bar dataKey="shift" name="Mean Conf Shift (Δ)" fill="#10b981" radius={[0, 4, 4, 0]}>
                {tierData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.shift < 0 ? "#f43f5e" : "#10b981"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="mt-4 text-center text-[10px] text-white/50 italic">
            Note: Cognitive distribution highlights the "Metacognitive Chasm" between baseline confidence and adversarial response.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
