"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Sparkles,
  Play,
  Mic,
  CheckCircle2,
  BarChart3,
  Trophy,
  ChevronRight,
  RotateCcw,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  User,
  Star,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import { useTranslations } from "next-intl";

type Phase =
  | "idle"
  | "generating"
  | "questions-ready"
  | "interviewing"
  | "analyzing"
  | "results";

function PulsingDot({ color = "bg-primary" }: { color?: string }) {
  return (
    <span className="relative flex h-2 w-2">
      <span
        className={`absolute inline-flex h-full w-full animate-ping rounded-full ${color} opacity-75`}
      />
      <span
        className={`relative inline-flex h-2 w-2 rounded-full ${color}`}
      />
    </span>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-primary/60"
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function ProgressBar({
  progress,
  duration,
}: {
  progress: number;
  duration: number;
}) {
  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-primary to-violet-500"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration, ease: "easeOut" }}
      />
    </div>
  );
}

function ScoreRing({
  score,
  delay,
}: {
  score: number;
  delay: number;
}) {
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex h-24 w-24 items-center justify-center">
      <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 96 96">
        <circle
          cx="48"
          cy="48"
          r="40"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-muted/50"
        />
        <motion.circle
          cx="48"
          cy="48"
          r="40"
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
      </svg>
      <motion.span
        className="text-2xl font-bold text-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.3 }}
      >
        {score}
      </motion.span>
    </div>
  );
}

export function ProductSimulation() {
  const t = useTranslations("simulation");
  const [phase, setPhase] = useState<Phase>("idle");
  const [questionsShown, setQuestionsShown] = useState(0);
  const [currentInterview, setCurrentInterview] = useState(0);
  const [interviewSubPhase, setInterviewSubPhase] = useState<
    "asking" | "answering" | "answered"
  >("asking");
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const questions = [
    t("q1"),
    t("q2"),
    t("q3"),
  ];

  const interviewAnswers = [t("a1Short"), t("a2Short"), t("a3Short")];

  const skills = [
    { label: t("skillCompetence"), score: 94 },
    { label: t("skillGenuineness"), score: 91 },
    { label: t("skillFocus"), score: 97 },
  ];

  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const addTimeout = useCallback(
    (fn: () => void, ms: number) => {
      const id = setTimeout(fn, ms);
      timeoutsRef.current.push(id);
      return id;
    },
    []
  );

  useEffect(() => {
    return () => clearTimeouts();
  }, [clearTimeouts]);

  const startSimulation = useCallback(() => {
    clearTimeouts();
    setPhase("generating");
    setQuestionsShown(0);
    setCurrentInterview(0);
    setInterviewSubPhase("asking");

    // Stagger question reveals
    for (let i = 0; i < questions.length; i++) {
      addTimeout(() => setQuestionsShown(i + 1), 800 + i * 500);
    }

    // Transition to questions-ready
    addTimeout(
      () => setPhase("questions-ready"),
      800 + questions.length * 500 + 400
    );

    // Auto-advance to interviewing after a pause
    addTimeout(
      () => {
        setPhase("interviewing");
        runInterviewSequence(0);
      },
      800 + questions.length * 500 + 2000
    );
  }, [questions.length, addTimeout, clearTimeouts]);

  const runInterviewSequence = useCallback(
    (idx: number) => {
      if (idx >= 3) {
        addTimeout(() => setPhase("analyzing"), 500);
        addTimeout(() => setPhase("results"), 2500);
        return;
      }

      setCurrentInterview(idx);
      setInterviewSubPhase("asking");

      addTimeout(() => setInterviewSubPhase("answering"), 900);
      addTimeout(() => setInterviewSubPhase("answered"), 3100);
      addTimeout(() => runInterviewSequence(idx + 1), 4000);
    },
    [addTimeout]
  );

  const resetSimulation = useCallback(() => {
    clearTimeouts();
    setPhase("idle");
    setQuestionsShown(0);
    setCurrentInterview(0);
    setInterviewSubPhase("asking");
  }, [clearTimeouts]);

  return (
    <section id="how-it-works" ref={sectionRef} className="relative overflow-hidden py-24 sm:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute left-1/2 bottom-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/[0.03] blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-violet-500/[0.03] blur-3xl" />
      </div>

      <div className="mx-auto max-w-5xl px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center sm:mb-16"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            {t("label")}
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            {t("title")}{" "}
            <span className="bg-gradient-to-r from-primary to-violet-600 bg-clip-text text-transparent">
              {t("titleHighlight")}
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Simulation card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative mx-auto max-w-2xl"
        >
          {/* Outer glow */}
          <div className="glow-ring pointer-events-none absolute -inset-3 -z-10 rounded-3xl bg-gradient-to-r from-primary/15 via-violet-500/15 to-purple-500/15 blur-2xl" />

          <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl shadow-black/5">
            {/* Card chrome header */}
            <div className="flex items-center gap-2 border-b border-border/40 bg-muted/30 px-5 py-3">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-amber-400/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-400/60" />
              </div>
              <span className="ml-2 text-[11px] font-medium text-muted-foreground/60">
                matchlyst.com
              </span>
              <div className="ml-auto flex items-center gap-1.5">
                {phase !== "idle" && phase !== "results" && (
                  <PulsingDot color="bg-green-500" />
                )}
                <span className="text-[10px] font-medium text-muted-foreground/50">
                  {phase === "idle"
                    ? t("statusReady")
                    : phase === "results"
                      ? t("statusComplete")
                      : t("statusLive")}
                </span>
              </div>
            </div>

            {/* Card body */}
            <div className="min-h-[420px] p-6 sm:p-8">
              <AnimatePresence mode="wait">
                {/* ===== PHASE: IDLE ===== */}
                {phase === "idle" && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Job card */}
                    <div className="mb-8 rounded-xl border border-border/50 bg-muted/30 p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-primary" />
                            <h3 className="font-semibold text-foreground">
                              {t("jobTitle")}
                            </h3>
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {t("jobRemote")}
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="h-3 w-3" />
                              {t("jobRate")}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {t("jobType")}
                            </span>
                          </div>
                        </div>
                        <span className="rounded-full bg-green-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-green-600">
                          {t("jobNew")}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {["React", "TypeScript", "Node.js", "PostgreSQL", "AWS"].map(
                          (tag) => (
                            <span
                              key={tag}
                              className="rounded-md bg-primary/5 px-2 py-0.5 text-[11px] font-medium text-primary"
                            >
                              {tag}
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    <p className="mb-6 text-center text-sm text-muted-foreground">
                      {t("idlePrompt")}
                    </p>

                    {/* CTA Button */}
                    <motion.button
                      onClick={startSimulation}
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      className="group relative mx-auto flex w-full max-w-xs items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-shadow hover:shadow-xl hover:shadow-primary/30"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 transition-opacity group-hover:opacity-100" />
                      <Sparkles className="h-4 w-4" />
                      {t("generateBtn")}
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </motion.button>
                  </motion.div>
                )}

                {/* ===== PHASE: GENERATING / QUESTIONS READY ===== */}
                {(phase === "generating" || phase === "questions-ready") && (
                  <motion.div
                    key="generating"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-5 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold text-foreground">
                        {t("generatingTitle")}
                      </span>
                      {phase === "generating" && <TypingDots />}
                      {phase === "questions-ready" && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="ml-auto text-xs font-medium text-green-600"
                        >
                          <CheckCircle2 className="inline h-3.5 w-3.5" />{" "}
                          {t("generatingDone")}
                        </motion.span>
                      )}
                    </div>

                    <div className="space-y-2">
                      {questions.map((q, i) => (
                        <AnimatePresence key={i}>
                          {i < questionsShown && (
                            <motion.div
                              initial={{ opacity: 0, x: -15, height: 0 }}
                              animate={{ opacity: 1, x: 0, height: "auto" }}
                              transition={{
                                duration: 0.4,
                                ease: [0.25, 0.46, 0.45, 0.94],
                              }}
                              className="overflow-hidden"
                            >
                              <div className="flex items-start gap-3 rounded-lg border border-border/40 bg-muted/20 px-4 py-3">
                                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                                  {i + 1}
                                </span>
                                <span className="text-sm leading-relaxed text-foreground">
                                  {q}
                                </span>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      ))}
                    </div>

                    {phase === "questions-ready" && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-5 text-center text-xs text-muted-foreground"
                      >
                        {t("interviewStarting")}
                      </motion.p>
                    )}
                  </motion.div>
                )}

                {/* ===== PHASE: INTERVIEWING ===== */}
                {phase === "interviewing" && (
                  <motion.div
                    key="interviewing"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Candidate header */}
                    <div className="mb-6 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-sm font-bold text-white">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {t("candidateName")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t("candidateRole")}
                        </p>
                      </div>
                      <div className="ml-auto flex items-center gap-1.5">
                        <Mic className="h-3.5 w-3.5 text-red-500" />
                        <span className="text-[10px] font-medium text-red-500">
                          {t("interviewLive")}
                        </span>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="mb-6">
                      <div className="mb-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>
                          {t("questionLabel")} {currentInterview + 1}/3
                        </span>
                        <span>{Math.round(((currentInterview + (interviewSubPhase === "answered" ? 1 : 0.5)) / 3) * 100)}%</span>
                      </div>
                      <ProgressBar
                        progress={((currentInterview + (interviewSubPhase === "answered" ? 1 : 0.5)) / 3) * 100}
                        duration={0.5}
                      />
                    </div>

                    {/* Current question */}
                    <div className="space-y-4">
                      <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                          {t("questionLabel")} {currentInterview + 1}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-foreground">
                          {questions[currentInterview]}
                        </p>
                      </div>

                      {/* Answer area */}
                      <AnimatePresence mode="wait">
                        {interviewSubPhase === "asking" && (
                          <motion.div
                            key="asking"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2 rounded-lg border border-border/40 bg-muted/20 px-4 py-3"
                          >
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {t("waitingAnswer")}
                            </span>
                          </motion.div>
                        )}

                        {interviewSubPhase === "answering" && (
                          <motion.div
                            key="answering"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="rounded-lg border border-violet-500/20 bg-violet-500/5 px-4 py-3"
                          >
                            <div className="mb-2 flex items-center gap-2">
                              <motion.div
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                              >
                                <Mic className="h-3.5 w-3.5 text-red-500" />
                              </motion.div>
                              <span className="text-xs font-medium text-violet-600">
                                {t("recording")}
                              </span>
                              <TypingDots />
                            </div>
                            <motion.p
                              className="text-sm leading-relaxed text-muted-foreground"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 0.6 }}
                              transition={{ delay: 0.3 }}
                            >
                              {interviewAnswers[currentInterview]}
                            </motion.p>
                          </motion.div>
                        )}

                        {interviewSubPhase === "answered" && (
                          <motion.div
                            key="answered"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="rounded-lg border border-green-500/20 bg-green-500/5 px-4 py-3"
                          >
                            <div className="mb-2 flex items-center gap-2">
                              <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                              <span className="text-xs font-medium text-green-600">
                                {t("answerRecorded")}
                              </span>
                            </div>
                            <p className="text-sm leading-relaxed text-foreground">
                              {interviewAnswers[currentInterview]}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}

                {/* ===== PHASE: ANALYZING ===== */}
                {phase === "analyzing" && (
                  <motion.div
                    key="analyzing"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="flex min-h-[380px] flex-col items-center justify-center"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary/20 border-t-primary"
                    >
                      <BarChart3 className="h-6 w-6 text-primary" />
                    </motion.div>
                    <p className="text-lg font-semibold text-foreground">
                      {t("analyzingTitle")}
                    </p>
                    <p className="mt-1.5 text-sm text-muted-foreground">
                      {t("analyzingSubtitle")}
                    </p>
                    <motion.div
                      className="mt-6 w-48"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <ProgressBar progress={100} duration={1.5} />
                    </motion.div>
                  </motion.div>
                )}

                {/* ===== PHASE: RESULTS ===== */}
                {phase === "results" && (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* Results header */}
                    <div className="mb-6 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-amber-500" />
                        <h3 className="text-lg font-bold text-foreground">
                          {t("resultsTitle")}
                        </h3>
                      </div>
                      <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                        className="rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 px-3 py-1 text-xs font-bold text-amber-600"
                      >
                        <Star className="mr-1 inline h-3 w-3" />
                        {t("topMatch")}
                      </motion.span>
                    </div>

                    {/* Candidate + overall score */}
                    <div className="mb-6 flex items-center gap-5 rounded-xl border border-border/50 bg-muted/20 p-5">
                      <ScoreRing score={92} delay={0.2} />
                      <div className="flex-1">
                        <p className="text-base font-bold text-foreground">
                          {t("candidateName")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {t("candidateRole")}
                        </p>
                        <div className="mt-2 flex items-center gap-1.5">
                          <MessageSquare className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {t("resultsBasedOn")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Predicted delivery success */}
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mb-6 flex items-center justify-between rounded-xl border border-green-500/30 bg-green-500/5 px-5 py-3"
                    >
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-semibold text-foreground">
                          {t("predictedSuccess")}
                        </span>
                      </div>
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                        className="text-lg font-bold text-green-600"
                      >
                        {t("predictedSuccessScore")}
                      </motion.span>
                    </motion.div>

                    {/* Skill breakdown */}
                    <div className="space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {t("skillBreakdown")}
                      </p>
                      {skills.map((skill, i) => (
                        <motion.div
                          key={skill.label}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + i * 0.1 }}
                          className="flex items-center gap-3"
                        >
                          <span className="w-28 shrink-0 text-sm text-muted-foreground">
                            {skill.label}
                          </span>
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                            <motion.div
                              className="h-full rounded-full bg-gradient-to-r from-primary to-violet-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.score}%` }}
                              transition={{
                                duration: 0.8,
                                delay: 0.6 + i * 0.1,
                                ease: "easeOut",
                              }}
                            />
                          </div>
                          <motion.span
                            className="w-8 text-right text-sm font-bold text-foreground"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 + i * 0.1 }}
                          >
                            {skill.score}
                          </motion.span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Replay button */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 }}
                      className="mt-6 flex justify-center"
                    >
                      <button
                        onClick={resetSimulation}
                        className="group flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <RotateCcw className="h-3.5 w-3.5 transition-transform group-hover:-rotate-45" />
                        {t("replayBtn")}
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
