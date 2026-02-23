"use client";

import { motion } from "framer-motion";
import { ClipboardList, Video, TrendingUp } from "lucide-react";
import { FadeIn, StaggerContainer, itemVariants } from "@/components/animated/motion-wrapper";
import { useTranslations } from "next-intl";

export function HowItWorks() {
  const t = useTranslations("howItWorks");

  const steps = [
    {
      icon: ClipboardList,
      titleKey: "step1Title" as const,
      descriptionKey: "step1Description" as const,
      gradient: "from-blue-500/10 to-cyan-500/10",
      iconColor: "text-blue-600",
      number: "01",
    },
    {
      icon: Video,
      titleKey: "step2Title" as const,
      descriptionKey: "step2Description" as const,
      gradient: "from-violet-500/10 to-purple-500/10",
      iconColor: "text-violet-600",
      number: "02",
    },
    {
      icon: TrendingUp,
      titleKey: "step3Title" as const,
      descriptionKey: "step3Description" as const,
      gradient: "from-green-500/10 to-emerald-500/10",
      iconColor: "text-green-600",
      number: "03",
    },
  ];

  return (
    <section className="relative py-32">
      {/* Dot grid background */}
      <div className="dot-grid absolute inset-0 -z-10" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-transparent to-background" />

      <div className="mx-auto max-w-6xl px-6">
        <FadeIn className="text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            {t("label")}
          </p>
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            {t("title")}{" "}
            <span className="text-primary">{t("titleHighlight")}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            {t("subtitle")}
          </p>
        </FadeIn>

        <StaggerContainer className="mt-20 grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <motion.div
              key={step.number}
              variants={itemVariants}
              className="group relative"
            >
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative h-full overflow-hidden rounded-2xl border border-border/50 bg-card p-8 transition-colors hover:border-primary/20"
              >
                {/* Background gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 transition-opacity group-hover:opacity-100`}
                />

                {/* Step number */}
                <div className="relative">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/40">
                    {t("stepLabel")} {step.number}
                  </span>
                </div>

                {/* Icon */}
                <div className="relative mt-6">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className={`inline-flex rounded-xl bg-gradient-to-br ${step.gradient} p-3`}
                  >
                    <step.icon className={`h-6 w-6 ${step.iconColor}`} />
                  </motion.div>
                </div>

                {/* Content */}
                <h3 className="relative mt-6 text-xl font-semibold tracking-tight">
                  {t(step.titleKey)}
                </h3>
                <p className="relative mt-3 text-sm leading-relaxed text-muted-foreground">
                  {t(step.descriptionKey)}
                </p>

                {/* Connector line (hidden on last) */}
                {step.number !== "03" && (
                  <div className="absolute -right-4 top-1/2 hidden h-px w-8 bg-border md:block" />
                )}
              </motion.div>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
