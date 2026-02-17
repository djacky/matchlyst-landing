"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

function MarqueeItem({ text }: { text: string }) {
  return (
    <div className="mx-4 flex shrink-0 items-center gap-3 rounded-full border border-border/50 bg-card/80 px-5 py-2.5 backdrop-blur-sm">
      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
      <span className="whitespace-nowrap text-sm font-medium text-foreground">
        {text}
      </span>
    </div>
  );
}

export function SocialProof() {
  const t = useTranslations("socialProof");

  const items = [
    t("item1"),
    t("item2"),
    t("item3"),
    t("item4"),
    t("item5"),
    t("item6"),
  ];

  return (
    <section className="relative overflow-hidden py-16">
      <div className="mx-auto max-w-6xl px-6">
        {/* Divider label */}
        <div className="mb-10 flex items-center gap-4">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {t("dividerLabel")}
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>
      </div>

      {/* Marquee container */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

        {/* Scrolling track */}
        <div className="flex animate-marquee">
          {/* First set */}
          {items.map((item, i) => (
            <MarqueeItem key={`a-${i}`} text={item} />
          ))}
          {/* Duplicate set for seamless loop */}
          {items.map((item, i) => (
            <MarqueeItem key={`b-${i}`} text={item} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
