"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Mail, Shield } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

function Section({
  title,
  children,
  delay = 0,
}: {
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <h2 className="mb-3 text-lg font-semibold tracking-tight text-foreground sm:text-xl">
        {title}
      </h2>
      <div className="space-y-3 text-[15px] leading-relaxed text-muted-foreground">
        {children}
      </div>
    </motion.div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 pl-1">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function PrivacyContent() {
  const t = useTranslations("privacy");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-3xl items-center px-6">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            {t("backToHome")}
          </Link>
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        {/* Title block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-12"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
            <Shield className="h-4 w-4" />
            {t("title")}
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {t("lastUpdated")}
          </p>
        </motion.div>

        {/* Intro */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12 text-[15px] leading-relaxed text-muted-foreground"
        >
          {t("intro")}
        </motion.p>

        {/* Sections */}
        <div className="space-y-10">
          <Section title={t("collectTitle")} delay={0.15}>
            <p>{t("collectIntro")}</p>
            <BulletList
              items={[t("collectItem1"), t("collectItem2"), t("collectItem3")]}
            />
            <p className="mt-2 text-sm font-medium text-foreground/70">
              {t("collectNote")}
            </p>
          </Section>

          <div className="h-px bg-border/50" />

          <Section title={t("useTitle")} delay={0.2}>
            <p>{t("useIntro")}</p>
            <BulletList
              items={[t("useItem1"), t("useItem2"), t("useItem3")]}
            />
            <p className="mt-2 text-sm font-medium text-foreground/70">
              {t("useNote")}
            </p>
          </Section>

          <div className="h-px bg-border/50" />

          <Section title={t("storageTitle")} delay={0.25}>
            <p>{t("storageText")}</p>
          </Section>

          <div className="h-px bg-border/50" />

          <Section title={t("analyticsTitle")} delay={0.3}>
            <p>{t("analyticsText")}</p>
          </Section>

          <div className="h-px bg-border/50" />

          <Section title={t("cookiesTitle")} delay={0.35}>
            <p>{t("cookiesText")}</p>
          </Section>

          <div className="h-px bg-border/50" />

          <Section title={t("thirdPartyTitle")} delay={0.4}>
            <p>{t("thirdPartyText")}</p>
          </Section>

          <div className="h-px bg-border/50" />

          <Section title={t("choicesTitle")} delay={0.45}>
            <p>{t("choicesText")}</p>
          </Section>

          <div className="h-px bg-border/50" />

          {/* Contact section with email link */}
          <Section title={t("contactTitle")} delay={0.5}>
            <p>{t("contactText")}</p>
            <div className="mt-4 inline-flex items-center gap-3 rounded-xl border border-border/60 bg-card px-5 py-3.5 shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  {t("contactEmailLabel")}
                </p>
                <a
                  href={`mailto:${t("contactEmail")}`}
                  className="text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                >
                  {t("contactEmail")}
                </a>
              </div>
            </div>
          </Section>
        </div>

        {/* Bottom back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 border-t border-border/50 pt-8"
        >
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            {t("backToHome")}
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
