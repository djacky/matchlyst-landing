"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";

function AnimatedValue({
  value,
  delay,
}: {
  value: string;
  delay: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [displayed, setDisplayed] = useState("");

  const numericMatch = value.match(/^(\d+)/);
  const suffix = numericMatch ? value.replace(/^\d+/, "") : "";
  const targetNum = numericMatch ? parseInt(numericMatch[1], 10) : 0;
  const isNumeric = !!numericMatch;

  useEffect(() => {
    if (!isInView) return;

    if (!isNumeric) {
      const timer = setTimeout(() => setDisplayed(value), delay * 1000);
      return () => clearTimeout(timer);
    }

    let start = 0;
    const duration = 1200;
    const startTime = performance.now() + delay * 1000;

    function tick(now: number) {
      if (now < startTime) {
        requestAnimationFrame(tick);
        return;
      }

      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.round(eased * targetNum);
      setDisplayed(`${start}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }, [isInView, isNumeric, targetNum, suffix, value, delay]);

  return (
    <span ref={ref} className="tabular-nums">
      {displayed || (isNumeric ? `0${suffix}` : "")}
    </span>
  );
}

export function StatsBanner() {
  const t = useTranslations("statsBanner");

  const stats = [
    { value: t("stat1Value"), label: t("stat1Label"), delay: 0 },
    { value: t("stat2Value"), label: t("stat2Label"), delay: 0.15 },
    { value: t("stat3Value"), label: t("stat3Label"), delay: 0.3 },
  ];

  return (
    <section className="relative overflow-hidden border-y border-border/40 bg-muted/30 py-16 sm:py-20">
      {/* Subtle gradient glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-0 h-32 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-32 w-64 rounded-full bg-violet-500/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <span className="bg-gradient-to-r from-primary to-violet-600 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl">
                <AnimatedValue value={stat.value} delay={stat.delay} />
              </span>
              <span className="mt-2 text-sm font-medium text-muted-foreground">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
