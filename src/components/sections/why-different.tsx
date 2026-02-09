"use client";

import { type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import {
  Building2,
  Code2,
  ClipboardList,
  Brain,
  Trophy,
  Send,
  MessageSquareText,
  BadgeCheck,
  Sparkles,
  ArrowDown,
  Users,
  Star,
} from "lucide-react";
import { FadeIn } from "@/components/animated/motion-wrapper";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const columnVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18, delayChildren: 0.1 },
  },
};

const stepVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const connectorVariants: Variants = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

/* ------------------------------------------------------------------ */
/*  Shared step component                                              */
/* ------------------------------------------------------------------ */

interface ProcessStepProps {
  step: number;
  icon: ReactNode;
  title: string;
  accent: string;
  children: ReactNode;
  isLast?: boolean;
  stepLabel: string;
}

function ProcessStep({
  step,
  icon,
  title,
  accent,
  children,
  isLast = false,
  stepLabel,
}: ProcessStepProps) {
  const accentMap: Record<string, { bg: string; text: string; ring: string; dot: string }> = {
    blue:   { bg: "bg-blue-500/10",   text: "text-blue-600",   ring: "ring-blue-500/20",   dot: "bg-blue-500" },
    violet: { bg: "bg-violet-500/10",  text: "text-violet-600", ring: "ring-violet-500/20", dot: "bg-violet-500" },
    amber:  { bg: "bg-amber-500/10",   text: "text-amber-600",  ring: "ring-amber-500/20",  dot: "bg-amber-500" },
    emerald:{ bg: "bg-emerald-500/10", text: "text-emerald-600",ring: "ring-emerald-500/20",dot: "bg-emerald-500" },
    cyan:   { bg: "bg-cyan-500/10",    text: "text-cyan-600",   ring: "ring-cyan-500/20",   dot: "bg-cyan-500" },
    rose:   { bg: "bg-rose-500/10",    text: "text-rose-600",   ring: "ring-rose-500/20",   dot: "bg-rose-500" },
  };
  const a = accentMap[accent] ?? accentMap.violet;

  return (
    <motion.div variants={stepVariants} className="relative flex gap-4">
      {/* Timeline rail */}
      <div className="flex flex-col items-center">
        {/* Step dot */}
        <motion.div
          whileHover={{ scale: 1.15 }}
          className={cn(
            "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-4",
            a.bg,
            a.ring,
          )}
        >
          <span className={cn("h-4 w-4", a.text)}>{icon}</span>
        </motion.div>

        {/* Connector line */}
        {!isLast && (
          <motion.div
            variants={connectorVariants}
            style={{ originY: 0 }}
            className="mt-1 w-px flex-1 bg-gradient-to-b from-border to-transparent"
          />
        )}
      </div>

      {/* Card */}
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={cn(
          "group mb-6 flex-1 overflow-hidden rounded-xl border border-border/60 bg-card p-4 shadow-sm transition-colors hover:border-opacity-100",
          `hover:border-${accent}-500/30`,
        )}
      >
        <div className="mb-1 flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
            {stepLabel} {step}
          </span>
        </div>
        <h4 className="text-sm font-semibold tracking-tight">{title}</h4>
        <div className="mt-2.5">{children}</div>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mini mock-UI pieces (richer than plain text)                       */
/* ------------------------------------------------------------------ */

function MockJobPost() {
  const t = useTranslations("whyDifferent");
  return (
    <div className="space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <span className="font-medium">{t("mockJobTitle")}</span>
        <Users className="h-3 w-3 text-blue-500" />
      </div>
      <div className="flex gap-1.5">
        <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] text-blue-600">{t("mockRemote")}</span>
        <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] text-blue-600">{t("mockRate")}</span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full bg-blue-500"
          initial={{ width: 0 }}
          whileInView={{ width: "75%" }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function MockAIScreening() {
  const t = useTranslations("whyDifferent");
  return (
    <div className="space-y-2 text-xs">
      <div className="flex items-center gap-1.5">
        <Sparkles className="h-3 w-3 text-violet-500" />
        <span className="text-[10px] font-medium text-violet-600">
          {t("mockAIGenerating")}
        </span>
      </div>
      {["Performance optimization", "State management", "System design"].map((q, i) => (
        <motion.div
          key={q}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 + i * 0.15 }}
          className="flex items-center gap-2 rounded-lg bg-violet-500/5 px-2.5 py-1.5"
        >
          <div className="h-1 w-1 shrink-0 rounded-full bg-violet-400" />
          <span className="text-muted-foreground">{q}</span>
        </motion.div>
      ))}
    </div>
  );
}

function MockRankedResults() {
  const candidates = [
    { initials: "JM", name: "Jordan M.", score: 94, color: "from-violet-500 to-purple-600" },
    { initials: "SK", name: "Sara K.", score: 88, color: "from-blue-500 to-cyan-600" },
    { initials: "AL", name: "Alex L.", score: 82, color: "from-emerald-500 to-teal-600" },
  ];
  return (
    <div className="space-y-2 text-xs">
      {candidates.map((c, i) => (
        <motion.div
          key={c.initials}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.0 + i * 0.12 }}
          className="flex items-center gap-2.5 rounded-lg bg-muted/50 px-2.5 py-1.5"
        >
          <div
            className={cn(
              "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[9px] font-bold text-white",
              c.color,
            )}
          >
            {c.initials}
          </div>
          <span className="flex-1 font-medium">{c.name}</span>
          <div className="flex items-center gap-1">
            <Star className="h-2.5 w-2.5 text-amber-500" />
            <span className="font-semibold">{c.score}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function MockJobMatch() {
  const t = useTranslations("whyDifferent");
  return (
    <div className="space-y-2 text-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="flex items-center gap-2 rounded-lg bg-emerald-500/5 px-2.5 py-2"
      >
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20">
          <BadgeCheck className="h-3 w-3 text-emerald-600" />
        </div>
        <div className="flex-1">
          <span className="font-medium">{t("mockNewMatch")}</span>
          <p className="text-[10px] text-muted-foreground">{t("mockSkillMatch")}</p>
        </div>
      </motion.div>
      <div className="flex gap-1.5">
        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-600">React</span>
        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-600">TypeScript</span>
        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-600">Next.js</span>
      </div>
    </div>
  );
}

function MockInterview() {
  const t = useTranslations("whyDifferent");
  return (
    <div className="space-y-2 text-xs">
      <div className="rounded-lg bg-cyan-500/5 px-2.5 py-2">
        <p className="font-medium text-cyan-700">
          &ldquo;{t("mockQuestion")}&rdquo;
        </p>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1.0 }}
        className="flex items-center gap-2"
      >
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="h-1.5 w-1.5 rounded-full bg-cyan-500"
        />
        <span className="text-[10px] text-muted-foreground">{t("mockRecording")}</span>
      </motion.div>
    </div>
  );
}

function MockScore() {
  const t = useTranslations("whyDifferent");
  const skills = [
    { label: t("mockTechnical"), value: 96 },
    { label: t("mockProblem"), value: 92 },
  ];

  return (
    <div className="space-y-2.5 text-xs">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-[10px] font-bold text-white">
          JM
        </div>
        <div>
          <p className="font-semibold">{t("mockYourScore")}</p>
          <p className="text-[10px] text-muted-foreground">{t("mockBasedOn")}</p>
        </div>
      </div>
      {skills.map((skill, i) => (
        <div key={skill.label}>
          <div className="mb-1 flex justify-between text-[10px]">
            <span className="text-muted-foreground">{skill.label}</span>
            <span className="font-semibold">{skill.value}%</span>
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-500"
              initial={{ width: 0 }}
              whileInView={{ width: `${skill.value}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 1.2 + i * 0.15, ease: "easeOut" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Center AI hub element                                              */
/* ------------------------------------------------------------------ */

function AIHub() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 200 }}
      className="relative mx-auto my-10 flex items-center justify-center lg:my-0"
    >
      {/* Glow ring */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.15, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute h-20 w-20 rounded-full bg-primary/20 blur-xl"
      />
      <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-violet-500/10 shadow-lg shadow-primary/10">
        <Brain className="h-6 w-6 text-primary" />
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main section                                                       */
/* ------------------------------------------------------------------ */

export function WhyDifferent() {
  const t = useTranslations("whyDifferent");

  return (
    <section id="why-different" className="relative overflow-hidden py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Header */}
        <FadeIn className="mb-20 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            {t("label")}
          </p>
          <h2 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            {t("title")}{" "}
            <span className="text-primary">{t("titleHighlight")}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground leading-relaxed">
            {t("subtitle")}
          </p>
        </FadeIn>

        {/* Dual-column process */}
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_auto_1fr]">
          {/* ── Client column ── */}
          <div>
            <FadeIn className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-tight">{t("clientJourney")}</h3>
                <p className="text-xs text-muted-foreground">{t("clientSubtitle")}</p>
              </div>
            </FadeIn>

            <motion.div
              variants={columnVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
            >
              <ProcessStep step={1} icon={<ClipboardList className="h-4 w-4" />} title={t("clientStep1")} accent="blue" stepLabel={t("stepLabel")}>
                <MockJobPost />
              </ProcessStep>

              <ProcessStep step={2} icon={<Brain className="h-4 w-4" />} title={t("clientStep2")} accent="violet" stepLabel={t("stepLabel")}>
                <MockAIScreening />
              </ProcessStep>

              <ProcessStep step={3} icon={<Trophy className="h-4 w-4" />} title={t("clientStep3")} accent="amber" isLast stepLabel={t("stepLabel")}>
                <MockRankedResults />
              </ProcessStep>
            </motion.div>
          </div>

          {/* ── Center AI hub (desktop) ── */}
          <div className="hidden items-center self-center lg:flex">
            <div className="flex flex-col items-center gap-3">
              <motion.div
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                style={{ originY: 0 }}
                className="h-24 w-px bg-gradient-to-b from-transparent via-border to-border"
              />
              <AIHub />
              <p className="mt-1 max-w-[80px] text-center text-[10px] font-medium uppercase tracking-widest text-primary/60">
                {t("aiLabel")}
              </p>
              <motion.div
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                style={{ originY: 0 }}
                className="h-24 w-px bg-gradient-to-b from-border via-border to-transparent"
              />
            </div>
          </div>

          {/* ── Center AI hub (mobile) ── */}
          <div className="flex items-center justify-center lg:hidden">
            <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-border" />
              <AIHub />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-border" />
            </div>
          </div>

          {/* ── Freelancer column ── */}
          <div>
            <FadeIn className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                <Code2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-tight">{t("freelancerJourney")}</h3>
                <p className="text-xs text-muted-foreground">{t("freelancerSubtitle")}</p>
              </div>
            </FadeIn>

            <motion.div
              variants={columnVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
            >
              <ProcessStep step={1} icon={<Send className="h-4 w-4" />} title={t("freelancerStep1")} accent="emerald" stepLabel={t("stepLabel")}>
                <MockJobMatch />
              </ProcessStep>

              <ProcessStep step={2} icon={<MessageSquareText className="h-4 w-4" />} title={t("freelancerStep2")} accent="cyan" stepLabel={t("stepLabel")}>
                <MockInterview />
              </ProcessStep>

              <ProcessStep step={3} icon={<BadgeCheck className="h-4 w-4" />} title={t("freelancerStep3")} accent="rose" isLast stepLabel={t("stepLabel")}>
                <MockScore />
              </ProcessStep>
            </motion.div>
          </div>
        </div>

        {/* Bottom convergence arrow */}
        <FadeIn delay={0.3} className="mt-12 flex flex-col items-center gap-2">
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="h-5 w-5 text-primary/40" />
          </motion.div>
          <p className="text-xs font-medium text-muted-foreground">
            {t("resultText")} <span className="text-primary">{t("resultHighlight")}</span>
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
