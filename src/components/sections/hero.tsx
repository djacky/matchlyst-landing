"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Star, BadgeCheck } from "lucide-react";
import { AnimatedGradientBg } from "@/components/animated/animated-gradient-bg";
import { useTranslations } from "next-intl";

function FloatingMockup() {
  const candidates = [
    { initials: "JM", name: "Jordan M.", score: 94, color: "from-violet-500 to-purple-600" },
    { initials: "SK", name: "Sara K.", score: 88, color: "from-blue-500 to-cyan-600" },
    { initials: "AL", name: "Alex L.", score: 82, color: "from-emerald-500 to-teal-600" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.0, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="mx-auto mt-12 max-w-sm"
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/80 p-5 shadow-2xl shadow-primary/10 backdrop-blur-md"
      >
        {/* Glow behind card */}
        <div className="absolute -inset-1 -z-10 rounded-2xl bg-gradient-to-r from-primary/20 via-violet-500/20 to-purple-500/20 blur-xl" />

        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BadgeCheck className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold text-foreground">Top Matches</span>
          </div>
          <span className="rounded-full bg-green-500/10 px-2.5 py-0.5 text-[10px] font-medium text-green-600">
            Live
          </span>
        </div>

        {/* Candidate rows */}
        <div className="space-y-2.5">
          {candidates.map((c, i) => (
            <motion.div
              key={c.initials}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.3 + i * 0.15 }}
              className="flex items-center gap-3 rounded-xl bg-muted/50 px-3 py-2"
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[10px] font-bold text-white ${c.color}`}
              >
                {c.initials}
              </div>
              <span className="flex-1 text-xs font-medium text-foreground">{c.name}</span>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-amber-500" />
                <span className="text-xs font-bold text-foreground">{c.score}</span>
              </div>
              {/* Score bar */}
              <div className="hidden h-1 w-12 overflow-hidden rounded-full bg-muted sm:block">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-violet-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${c.score}%` }}
                  transition={{ duration: 1, delay: 1.5 + i * 0.15, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
      <AnimatedGradientBg />

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-24 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          {t("badge")}
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mx-auto flex max-w-4xl flex-col text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl md:text-7xl"
        >
          <span>{t("headlineTop")}</span>
          <span className="bg-gradient-to-r from-primary via-purple-500 to-violet-600 bg-clip-text text-transparent">
            {t("headlineBottom")}
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
        >
          {t("subheadline")}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <motion.a
            href="#waitlist"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="group relative inline-flex h-12 items-center gap-2 overflow-hidden rounded-full bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 transition-opacity group-hover:opacity-100" />
            {t("ctaWaitlist")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </motion.a>
          <a
            href="#how-it-works"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-background/50 px-6 text-sm font-medium text-muted-foreground backdrop-blur-sm transition-all hover:border-primary/30 hover:text-foreground"
          >
            <ChevronDown className="h-4 w-4" />
            {t("ctaHowItWorks")}
          </a>
        </motion.div>

        {/* Floating product mockup */}
        <FloatingMockup />

        {/* Stats hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
            {t("statScreening")}
          </div>
          <div className="hidden h-4 w-px bg-border sm:block" />
          <div className="hidden items-center gap-2 sm:flex">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            {t("statInterviews")}
          </div>
          <div className="hidden h-4 w-px bg-border sm:block" />
          <div className="hidden items-center gap-2 sm:flex">
            <div className="h-1.5 w-1.5 rounded-full bg-violet-500" />
            {t("statResults")}
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-5 w-5 text-muted-foreground/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
