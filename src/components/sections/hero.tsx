"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronDown,
  TrendingUp,
  Shield,
  Sparkles,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Gift,
  Copy,
  Check,
} from "lucide-react";
import { AnimatedGradientBg } from "@/components/animated/animated-gradient-bg";
import { useTranslations } from "next-intl";

function PredictionMockup() {
  const candidates = [
    {
      initials: "JM",
      name: "Jordan M.",
      competence: 94,
      genuineness: 91,
      focus: 97,
      prediction: 92,
      color: "from-violet-500 to-purple-600",
    },
    {
      initials: "SK",
      name: "Sara K.",
      competence: 88,
      genuineness: 85,
      focus: 90,
      prediction: 84,
      color: "from-blue-500 to-cyan-600",
    },
    {
      initials: "AL",
      name: "Alex L.",
      competence: 82,
      genuineness: 72,
      focus: 68,
      prediction: 61,
      color: "from-emerald-500 to-teal-600",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.0, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="mx-auto mt-14 max-w-md"
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/80 p-5 shadow-2xl shadow-primary/10 backdrop-blur-md"
      >
        <div className="absolute -inset-1 -z-10 rounded-2xl bg-gradient-to-r from-primary/20 via-violet-500/20 to-purple-500/20 blur-xl" />

        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold text-foreground">
              Delivery Prediction
            </span>
          </div>
          <span className="rounded-full bg-green-500/10 px-2.5 py-0.5 text-[10px] font-medium text-green-600">
            Live
          </span>
        </div>

        <div className="space-y-3">
          {candidates.map((c, i) => (
            <motion.div
              key={c.initials}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.3 + i * 0.15 }}
              className="rounded-xl bg-muted/50 px-3 py-2.5"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[10px] font-bold text-white ${c.color}`}
                >
                  {c.initials}
                </div>
                <span className="flex-1 text-xs font-medium text-foreground">
                  {c.name}
                </span>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="h-3 w-3 text-primary" />
                  <span className="text-sm font-bold text-primary">
                    {c.prediction}%
                  </span>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {[
                  { label: "Skill", value: c.competence, color: "bg-violet-500" },
                  { label: "Genuine", value: c.genuineness, color: "bg-blue-500" },
                  { label: "Focus", value: c.focus, color: "bg-emerald-500" },
                ].map((metric) => (
                  <div key={metric.label}>
                    <div className="mb-0.5 flex justify-between text-[11px] text-muted-foreground">
                      <span>{metric.label}</span>
                      <span className="font-medium">{metric.value}</span>
                    </div>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                      <motion.div
                        className={`h-full rounded-full ${metric.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.value}%` }}
                        transition={{
                          duration: 1,
                          delay: 1.5 + i * 0.15,
                          ease: "easeOut",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
          <Shield className="h-3 w-3" />
          <span>Anti-cheat verified</span>
          <span className="mx-1">·</span>
          <Sparkles className="h-3 w-3" />
          <span>AI-scored</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

function InlineEmailCapture() {
  const t = useTranslations("hero");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<
    "idle" | "submitting" | "success" | "error" | "duplicate"
  >("idle");
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [position, setPosition] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setState("submitting");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), role: "client" }),
      });
      const data = await res.json();

      if (res.status === 409) {
        setState("duplicate");
        return;
      }
      if (!res.ok) throw new Error();
      setReferralCode(data.referral_code || null);
      setPosition(data.position || null);
      setState("success");
    } catch {
      setState("error");
    }
  }

  const referralLink =
    referralCode && typeof window !== "undefined"
      ? `${window.location.origin}?ref=${referralCode}`
      : null;

  const statusLink =
    referralCode && typeof window !== "undefined"
      ? `${window.location.origin}/waitlist/${referralCode}`
      : null;

  const handleCopy = async () => {
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement("input");
      input.value = referralLink;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (state === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-2xl border border-green-500/20 bg-card p-5 text-left shadow-xl shadow-green-500/5"
      >
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle2 className="h-4 w-4" />
          <span className="text-sm font-medium">{t("emailSuccess")}</span>
        </div>

        {position && (
          <p className="mt-2 text-xs text-muted-foreground">
            You are <span className="font-semibold text-primary">#{position}</span>{" "}
            on the waitlist.
          </p>
        )}

        {referralLink && (
          <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Gift className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">
                Move up the waitlist
              </span>
            </div>
            <p className="mb-3 text-xs text-muted-foreground">
              Share your referral link to jump ahead.
            </p>

            <div className="flex items-center gap-2">
              <div className="flex-1 truncate rounded-lg border border-border/50 bg-background px-3 py-2 text-xs text-muted-foreground">
                {referralLink}
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border/50 bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-green-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </>
                )}
              </button>
            </div>

            {statusLink && (
              <p className="mt-3 text-center text-[11px] text-muted-foreground">
                Track your status:{" "}
                <a href={statusLink} className="text-primary underline">
                  View your waitlist page
                </a>
              </p>
            )}
          </div>
        )}
      </motion.div>
    );
  }

  if (state === "duplicate") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-3 text-sm font-medium text-blue-600"
      >
        <CheckCircle2 className="h-4 w-4" />
        {t("emailDuplicate")}
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex h-13 items-center gap-2 rounded-full border border-border/80 bg-background/60 px-2 shadow-lg shadow-black/5 backdrop-blur-md transition-colors focus-within:border-primary/50">
        <input
          type="email"
          placeholder={t("emailPlaceholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-full flex-1 bg-transparent pl-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          disabled={state === "submitting"}
          required
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={state === "submitting"}
          className="flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25 transition-all hover:shadow-lg hover:shadow-primary/30 disabled:opacity-70"
        >
          {state === "submitting" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              {t("ctaWaitlist")}
              <ArrowRight className="h-3.5 w-3.5" />
            </>
          )}
        </motion.button>
      </div>
      {state === "error" && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 text-center text-xs text-red-500"
        >
          {t("emailError")}
        </motion.p>
      )}
      <p className="mt-3 text-center text-xs text-muted-foreground/70">
        {t("emailDisclaimer")}
      </p>
    </form>
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
          transition={{
            duration: 0.7,
            delay: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
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

        {/* Inline email capture */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-10 flex flex-col items-center"
        >
          <InlineEmailCapture />
        </motion.div>

        {/* Floating prediction mockup */}
        <PredictionMockup />

        {/* Stats hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
            {t("statPrediction")}
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
