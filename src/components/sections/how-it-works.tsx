"use client";

import { motion } from "framer-motion";
import { ClipboardList, Brain, Trophy } from "lucide-react";
import { FadeIn, StaggerContainer, itemVariants } from "@/components/animated/motion-wrapper";

const steps = [
  {
    icon: ClipboardList,
    title: "Post your job",
    description:
      "Describe the role you need filled. Our system captures the nuances that matter.",
    gradient: "from-blue-500/10 to-cyan-500/10",
    iconColor: "text-blue-600",
    number: "01",
  },
  {
    icon: Brain,
    title: "AI generates screening questions",
    description:
      "Our AI crafts job-specific interview questions tailored to your exact requirements.",
    gradient: "from-violet-500/10 to-purple-500/10",
    iconColor: "text-violet-600",
    number: "02",
  },
  {
    icon: Trophy,
    title: "Get ranked freelancers",
    description:
      "Receive a ranked list of candidates scored on real capability. No noise, no spam.",
    gradient: "from-amber-500/10 to-orange-500/10",
    iconColor: "text-amber-600",
    number: "03",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-32">
      <div className="mx-auto max-w-6xl px-6">
        <FadeIn className="text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            How it works
          </p>
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Three steps to{" "}
            <span className="text-primary">better hiring</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            A streamlined process that replaces weeks of screening with
            intelligent, automated evaluation.
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
                    Step {step.number}
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
                  {step.title}
                </h3>
                <p className="relative mt-3 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
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
