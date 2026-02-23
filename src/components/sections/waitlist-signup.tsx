"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Loader2,
  ArrowRight,
  Users,
  Copy,
  Check,
  Gift,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FadeIn } from "@/components/animated/motion-wrapper";
import { useTranslations } from "next-intl";

interface FormErrors {
  email?: string;
}

export function WaitlistSignup() {
  const t = useTranslations("waitlist");

  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [position, setPosition] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  // Social proof counter
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null);

  // Pick up ?ref= from URL
  const [refCode, setRefCode] = useState<string | null>(null);

  useEffect(() => {
    // Read ref from URL on mount
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) setRefCode(ref);

    // Fetch waitlist count
    fetch("/api/waitlist")
      .then((res) => res.json())
      .then((data) => {
        if (data.count) setWaitlistCount(data.count);
      })
      .catch(() => {});
  }, []);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!email) {
      newErrors.email = t("errorEmailRequired");
    } else if (!validateEmail(email)) {
      newErrors.email = t("errorEmailInvalid");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role: "client", ref: refCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || t("errorGeneric"));
      }

      setReferralCode(data.referral_code || null);
      setPosition(data.position || null);
      setIsSuccess(true);

      // Update the counter
      if (waitlistCount !== null) {
        setWaitlistCount(waitlistCount + 1);
      }
    } catch (err) {
      setErrors({
        email:
          err instanceof Error ? err.message : t("errorGeneric"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const referralLink = referralCode
    ? `${window.location.origin}?ref=${referralCode}`
    : null;

  const statusLink = referralCode
    ? `${window.location.origin}/waitlist/${referralCode}`
    : null;

  const handleCopy = async () => {
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for HTTP
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

  return (
    <section id="waitlist" className="relative py-32">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent" />

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-primary/[0.06] blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-20 bottom-1/4 h-72 w-72 rounded-full bg-violet-500/[0.06] blur-3xl"
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <FadeIn className="text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            {t("label")}
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            {t("title")}{" "}
            <span className="text-primary">{t("titleHighlight")}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            {t("subtitle")}
          </p>
        </FadeIn>

        {/* Social proof counter */}
        {waitlistCount !== null && waitlistCount > 0 && (
          <FadeIn delay={0.1}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground"
            >
              <Users className="h-4 w-4 text-primary" />
              <span>
                <strong className="text-foreground">
                  {waitlistCount.toLocaleString()}
                </strong>{" "}
                {waitlistCount === 1 ? "person has" : "people have"} joined the
                waitlist
              </span>
            </motion.div>
          </FadeIn>
        )}

        <FadeIn delay={0.2}>
          <div className="mx-auto mt-12 max-w-md">
            {/* Glow ring */}
            <div className="glow-ring pointer-events-none absolute inset-0 -z-10 mx-auto max-w-md rounded-3xl bg-gradient-to-r from-primary/20 via-violet-500/20 to-purple-500/20 blur-xl" />

            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="rounded-2xl border border-green-500/20 bg-card p-8 shadow-xl shadow-green-500/5"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 15,
                      delay: 0.1,
                    }}
                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10"
                  >
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </motion.div>

                  <h3 className="text-xl font-bold">{t("successTitle")}</h3>

                  {position && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      You&apos;re{" "}
                      <span className="font-bold text-primary">
                        #{position}
                      </span>{" "}
                      on the list
                    </p>
                  )}

                  <p className="mt-2 text-muted-foreground">
                    {t("successMessage")}
                  </p>

                  {/* Referral share section */}
                  {referralLink && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-5"
                    >
                      <div className="mb-3 flex items-center gap-2">
                        <Gift className="h-4 w-4 text-primary" />
                        <span className="text-sm font-semibold text-primary">
                          Move up the waitlist
                        </span>
                      </div>
                      <p className="mb-4 text-xs text-muted-foreground">
                        Share your link — reach a referral tier and jump ahead
                        of everyone below it.
                      </p>

                      {/* Copy link box */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1 truncate rounded-lg border border-border/50 bg-background px-3 py-2 text-xs text-muted-foreground">
                          {referralLink}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="shrink-0 gap-1.5"
                          onClick={handleCopy}
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
                        </Button>
                      </div>

                      {/* Tiers */}
                      <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500" />
                          <strong className="text-foreground">
                            3 referrals
                          </strong>{" "}
                          — Priority access
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-violet-500" />
                          <strong className="text-foreground">
                            10 referrals
                          </strong>{" "}
                          — 3 months free premium
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500" />
                          <strong className="text-foreground">
                            25 referrals
                          </strong>{" "}
                          — Founding Member status
                        </div>
                      </div>

                      {/* Status page link */}
                      {statusLink && (
                        <p className="mt-4 text-center text-[11px] text-muted-foreground">
                          Track your referrals:{" "}
                          <a
                            href={statusLink}
                            className="text-primary underline"
                          >
                            View your status page
                          </a>
                        </p>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  onSubmit={handleSubmit}
                  className="rounded-2xl border border-border/50 bg-card p-8 shadow-xl shadow-black/5"
                >
                  {/* Referred badge */}
                  {refCode && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-5 flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-xs text-primary"
                    >
                      <Gift className="h-3.5 w-3.5" />
                      You were referred by a friend!
                    </motion.div>
                  )}

                  {/* Email input */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium"
                    >
                      {t("emailLabel")}
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("emailPlaceholder")}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email)
                          setErrors({ ...errors, email: undefined });
                      }}
                      className={`h-11 rounded-xl border-border/50 bg-background transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                        errors.email
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                          : ""
                      }`}
                    />
                    <AnimatePresence>
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="mt-1.5 text-xs text-red-500"
                        >
                          {errors.email}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Submit button */}
                  <motion.div className="mt-6" whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-11 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          {t("submitButton")}
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </motion.div>

                  <p className="mt-4 text-center text-xs text-muted-foreground">
                    {t("disclaimer")}
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
