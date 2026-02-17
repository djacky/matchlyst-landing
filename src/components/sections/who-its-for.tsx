"use client";

import { motion } from "framer-motion";
import { Building2, Code2 } from "lucide-react";
import { FadeIn, StaggerContainer, itemVariants } from "@/components/animated/motion-wrapper";
import { useTranslations } from "next-intl";

export function WhoItsFor() {
  const t = useTranslations("whoItsFor");

  const personas = [
    {
      icon: Building2,
      title: t("clientTitle"),
      description: t("clientDescription"),
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/5 to-cyan-500/5",
      borderHover: "hover:border-blue-500/30",
      features: [
        t("clientFeature1"),
        t("clientFeature2"),
        t("clientFeature3"),
      ],
    },
    {
      icon: Code2,
      title: t("freelancerTitle"),
      description: t("freelancerDescription"),
      gradient: "from-violet-500 to-purple-500",
      bgGradient: "from-violet-500/5 to-purple-500/5",
      borderHover: "hover:border-violet-500/30",
      features: [
        t("freelancerFeature1"),
        t("freelancerFeature2"),
        t("freelancerFeature3"),
      ],
    },
  ];

  return (
    <section className="relative py-32">
      {/* Radial gradient glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.04] blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <FadeIn className="text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            {t("label")}
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            {t("title")} <span className="text-primary">{t("titleHighlight")}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            {t("subtitle")}
          </p>
        </FadeIn>

        <StaggerContainer className="mt-16 grid gap-8 md:grid-cols-2">
          {personas.map((persona) => (
            <motion.div key={persona.title} variants={itemVariants}>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`group relative h-full overflow-hidden rounded-2xl border border-border/50 bg-card p-8 transition-all ${persona.borderHover} sm:p-10`}
              >
                {/* Background gradient on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${persona.bgGradient} opacity-0 transition-opacity group-hover:opacity-100`}
                />

                {/* Icon */}
                <div className="relative">
                  <div
                    className={`inline-flex rounded-xl bg-gradient-to-br ${persona.bgGradient} p-3`}
                  >
                    <persona.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="relative mt-6 text-2xl font-bold tracking-tight">
                  {persona.title}
                </h3>
                <p className="relative mt-3 leading-relaxed text-muted-foreground">
                  {persona.description}
                </p>

                {/* Features */}
                <ul className="relative mt-6 space-y-2.5">
                  {persona.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <div
                        className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${persona.gradient}`}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
