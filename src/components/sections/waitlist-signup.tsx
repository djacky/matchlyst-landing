"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FadeIn } from "@/components/animated/motion-wrapper";
import { useTranslations } from "next-intl";

type Role = "client" | "freelancer" | "both";

interface FormErrors {
  email?: string;
  role?: string;
}

export function WaitlistSignup() {
  const t = useTranslations("waitlist");

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
    if (!role) {
      newErrors.role = t("errorRoleRequired");
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
        body: JSON.stringify({ email, role }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || t("errorGeneric"));
      }

      setIsSuccess(true);
    } catch (err) {
      setErrors({
        email:
          err instanceof Error ? err.message : t("errorGeneric"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const roles: { value: Role; label: string }[] = [
    { value: "client", label: t("roleClient") },
    { value: "freelancer", label: t("roleFreelancer") },
    { value: "both", label: t("roleBoth") },
  ];

  return (
    <section id="waitlist" className="relative py-32">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent" />

      <div className="relative mx-auto max-w-6xl px-6">
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

        <FadeIn delay={0.2}>
          <div className="mx-auto mt-12 max-w-md">
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="rounded-2xl border border-green-500/20 bg-card p-8 text-center shadow-xl shadow-green-500/5"
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
                  <p className="mt-2 text-muted-foreground">
                    {t("successMessage")}
                  </p>
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
                        if (errors.email) setErrors({ ...errors, email: undefined });
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

                  {/* Role selector */}
                  <div className="mt-5">
                    <label className="mb-2 block text-sm font-medium">
                      {t("roleLabel")}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {roles.map((r) => (
                        <motion.button
                          key={r.value}
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setRole(r.value);
                            if (errors.role)
                              setErrors({ ...errors, role: undefined });
                          }}
                          className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                            role === r.value
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border/50 bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground"
                          }`}
                        >
                          {r.label}
                        </motion.button>
                      ))}
                    </div>
                    <AnimatePresence>
                      {errors.role && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="mt-1.5 text-xs text-red-500"
                        >
                          {errors.role}
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
