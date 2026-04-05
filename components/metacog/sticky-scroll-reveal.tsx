"use client";

import React, { useRef } from "react";
import { useScroll, useTransform, motion, AnimatePresence } from "framer-motion";
import { BenchmarkResults, getProviderInfo } from "@/lib/metacog";
import { ProviderLogoMap, GLMLogo, DeepSeekLogo } from "./provider-logos";

/**
 * StickyScrollReveal (The "Wow" Factor)
 * 
 * Follows Code as Communication / Modular Design (Dave Farley):
 * - Separation of scroll triggers and visual representation.
 * - Animates the "Metacognitive Capability Chasm" as models shift on scroll.
 */

interface Props {
  data: BenchmarkResults;
}

export const StickyScrollReveal = ({ data }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Stage labeling and background transitions
  const background = useTransform(
    scrollYProgress,
    [0, 0.4, 0.6, 1],
    ["#030303", "#030303", "#09090b", "#09090b"]
  );

  const activeStage = useTransform(
    scrollYProgress,
    [0, 0.4, 0.6, 1],
    ["Turn 1: Observed Accuracy", "Turn 1: Observed Accuracy", "Turn 2: Metacognitive Deep-Dive", "Turn 2: Metacognitive Deep-Dive"]
  );

  // "Through the Looking Glass" branding opacity
  const brandingOpacity = useTransform(scrollYProgress, [0.4, 0.6, 0.9, 1], [0, 0.05, 0.05, 0]);

  return (
    <motion.section 
      ref={containerRef}
      className="relative h-[250vh] w-full"
      style={{ background }}
    >
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden px-4">
        {/* Branding Mirror Overlay */}
        <motion.div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
            style={{ opacity: brandingOpacity }}
        >
            <h1 className="text-[12vw] font-black text-white italic tracking-tighter whitespace-nowrap opacity-50">
                THROUGH THE LOOKING GLASS
            </h1>
        </motion.div>

        {/* Title / Stage Indicator */}
        <motion.div 
            className="absolute top-20 z-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
        >
          <motion.h2 className="text-sm uppercase tracking-[0.4em] text-white/40 font-mono">
            {activeStage}
          </motion.h2>
          <h3 className="text-3xl font-semibold text-white mt-4 tracking-tight sm:text-5xl">
            The Capability Chasm
          </h3>
        </motion.div>

        {/* Dynamic Model Grid */}
        <div className="relative mt-20 h-[60vh] w-full max-w-5xl border border-white/5 bg-white/[0.01] rounded-[3rem] p-8 md:p-16 overflow-hidden shadow-2xl backdrop-blur-3xl">
            {/* Theoretical Efficiency Line (1.0) */}
            <div className="absolute top-[40%] left-0 w-full border-t border-emerald-500/20 border-dashed z-0">
                <div className="absolute -top-6 right-8 flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] text-emerald-400/60 font-mono tracking-widest uppercase">Target (1.0)</span>
                </div>
            </div>

            <div className="relative h-full w-full grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 z-10">
                {Object.entries(data).slice(0, 8).map(([id, model], index) => {
                    const info = getProviderInfo(id);
                    const Logo =
                      info.label.includes("GLM")
                        ? GLMLogo
                        : info.label.includes("DeepSeek")
                          ? DeepSeekLogo
                          : ProviderLogoMap[info.provider];
                    
                    const s_m = model.static?.m_ratio || 0.5;
                    const d_m = model.multiturn_v2?.overall?.m_ratio || 0.2;
                    
                    // The "Deep Dive": Position shift
                    const yPos = useTransform(
                        scrollYProgress,
                        [0.2, 0.8],
                        [`${(0.8 - s_m / 1.5) * 100}%`, `${(0.8 - d_m / 1.5) * 100}%`]
                    );

                    const scale = useTransform(scrollYProgress, [0.4, 0.6], [1, 1.1]);
                    const blur = useTransform(scrollYProgress, [0.4, 0.6], ["blur(0px)", "blur(1px)"]);

                    return (
                        <motion.div 
                          key={id} 
                          className="flex flex-col items-center justify-center p-6 rounded-2xl border border-white/10 bg-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-md"
                          style={{ y: yPos, scale, filter: blur }}
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                        >
                            <Logo size={28} className="mb-4" style={{ color: info.color }} />
                            <span className="text-[11px] font-bold text-white tracking-widest uppercase truncate w-full text-center">
                                {info.label.split(' ')[0]}
                            </span>
                            <motion.span 
                                className="text-[16px] font-mono mt-1 text-white/40"
                                style={{ opacity: useTransform(scrollYProgress, [0.2, 0.8], [0.4, 1]) }}
                            >
                                {useTransform(scrollYProgress, [0.2, 0.8], [s_m.toFixed(2), d_m.toFixed(2)])}
                            </motion.span>
                        </motion.div>
                    );
                })}
            </div>
        </div>

        {/* Footer Guidance */}
        <motion.div 
          className="absolute bottom-12 flex flex-col items-center gap-4"
          style={{ opacity: useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [1, 0, 0, 1]) }}
        >
            <span className="text-[10px] uppercase tracking-[0.5em] text-white/30 font-bold">Scroll to pierce the surface</span>
            <div className="h-12 w-px bg-gradient-to-b from-white/20 to-transparent" />
        </motion.div>
      </div>
    </motion.section>
  );
};
