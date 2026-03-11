import { PixelGridBackground } from "@/components/ui/pixel-grid-background";
import PixelatedCanvasDemo from "@/components/pixelated-canvas-demo";

export default function Home() {
  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden font-sans">
      {/* Interactive pixel grid background */}
      <div className="absolute inset-0">
        <PixelGridBackground
          gridCols={60}
          gridRows={40}
          maxElevation={30}
          gridColor="#080808"
          backgroundColor="#030303"
          borderOpacity={0.04}
          className="w-full h-full"
        />
      </div>

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

      {/* Hero content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 md:flex-row md:gap-12 md:px-12">
        <div className="max-w-xl text-center md:text-left">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/70 backdrop-blur-sm">
            In-vari Autonomous AI Research &rarr;
          </div>

          {/* Title */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Intelligence at every{" "}
            <span className="text-zinc-400">iteration</span>.
          </h1>

          {/* Description */}
          <p className="mx-auto mb-10 max-w-2xl text-base text-white/60 sm:text-lg md:mx-0">
            Building secure multi-agent swarm that autonomously optimizes LLM architectures.
            Powered by ADK orchestration, it hacks, trains, and refines —
            pushing past human-paced research, one experiment at a time.
          </p>

          {/* Button */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row md:justify-start">
            <a
              href="mailto:ade@in-vari.com"
              className="group relative inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-8 text-base font-medium text-black transition-all hover:bg-white/90 hover:scale-105"
            >
              Contact Us
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
        </div>

        {/* Pixelated Canvas Feature */}
        <div className="mt-12 hidden md:block md:mt-0 lg:scale-110">
          <PixelatedCanvasDemo />
        </div>
      </div>
    </div>
  );
}