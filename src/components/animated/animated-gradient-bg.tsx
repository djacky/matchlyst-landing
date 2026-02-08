"use client";

import { motion } from "framer-motion";

export function AnimatedGradientBg() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Primary gradient orb */}
      <motion.div
        className="absolute -top-[40%] -right-[20%] h-[80%] w-[60%] rounded-full opacity-20 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, oklch(0.65 0.24 280) 0%, oklch(0.55 0.20 300) 50%, transparent 70%)",
        }}
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -20, 15, 0],
          scale: [1, 1.05, 0.95, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {/* Secondary gradient orb */}
      <motion.div
        className="absolute -bottom-[20%] -left-[15%] h-[60%] w-[50%] rounded-full opacity-15 blur-[100px]"
        style={{
          background:
            "radial-gradient(circle, oklch(0.6 0.18 260) 0%, oklch(0.5 0.15 240) 50%, transparent 70%)",
        }}
        animate={{
          x: [0, -25, 20, 0],
          y: [0, 20, -15, 0],
          scale: [1, 0.95, 1.05, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {/* Tertiary accent orb */}
      <motion.div
        className="absolute top-[30%] left-[40%] h-[30%] w-[30%] rounded-full opacity-10 blur-[80px]"
        style={{
          background:
            "radial-gradient(circle, oklch(0.7 0.2 290) 0%, transparent 70%)",
        }}
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -30, 25, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {/* Noise overlay */}
      <div className="noise-overlay absolute inset-0" />
    </div>
  );
}
