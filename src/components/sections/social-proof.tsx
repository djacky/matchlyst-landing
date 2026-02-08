"use client";

import { motion } from "framer-motion";
import { Zap, Shield, Globe } from "lucide-react";
import { FadeIn, StaggerContainer, itemVariants } from "@/components/animated/motion-wrapper";

const trust = [
  {
    icon: Zap,
    title: "Built by independent founders",
    description: "Crafted by people who understand the hiring pain first-hand.",
  },
  {
    icon: Shield,
    title: "Privacy-first approach",
    description: "Your data is yours. We only use it to match you better.",
  },
  {
    icon: Globe,
    title: "Early access opening soon",
    description: "Be among the first to shape the future of freelance hiring.",
  },
];

export function SocialProof() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-6xl px-6">
        {/* Divider */}
        <div className="mb-16 flex items-center gap-4">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Why trust us
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <StaggerContainer className="grid gap-8 md:grid-cols-3">
          {trust.map((item) => (
            <motion.div key={item.title} variants={itemVariants}>
              <FadeIn className="text-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5"
                >
                  <item.icon className="h-5 w-5 text-primary" />
                </motion.div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </FadeIn>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
