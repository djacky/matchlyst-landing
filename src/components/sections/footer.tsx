"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { FadeIn } from "@/components/animated/motion-wrapper";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <FadeIn>
      <footer className="border-t border-border/50 py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            {/* Logo */}
            <motion.a
              href="#"
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              <span className="text-sm font-bold tracking-tight">
                Matchlyst
              </span>
            </motion.a>

            {/* Links */}
            <nav className="flex items-center gap-6">
              <a
                href="#"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {t("about")}
              </a>
              <a
                href="https://www.linkedin.com/company/matchlyst"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {t("contact")}
              </a>
              <Link
                href="/privacy"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {t("privacy")}
              </Link>
            </nav>

            {/* Copyright */}
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} {t("copyright")}
            </p>
          </div>
        </div>
      </footer>
    </FadeIn>
  );
}
