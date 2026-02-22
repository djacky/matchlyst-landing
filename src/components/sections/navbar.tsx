"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

export function Navbar() {
  const t = useTranslations("navbar");

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight">Matchlyst</span>
        </a>
        <div className="hidden items-center gap-8 sm:flex">
          <a
            href="#how-it-works"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("howItWorks")}
          </a>
          {/* @TODO: Add why us back in */}
          {/* <a
            href="#why-different"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("whyUs")}
          </a> */}
          <a
            href="#waitlist"
            className="inline-flex h-9 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
          >
            {t("joinWaitlist")}
          </a>
        </div>
      </div>
    </motion.nav>
  );
}
