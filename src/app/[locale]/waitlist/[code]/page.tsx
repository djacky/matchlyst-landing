"use client";

import { useEffect, useState, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  Check,
  Gift,
  Trophy,
  ArrowLeft,
  ArrowUp,
  Loader2,
  Crown,
  Star,
  Zap,
  Share2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { usePathname } from "next/navigation";

interface StatusData {
  position: number;
  total: number;
  referral_count: number;
  referral_code: string;
  tier: string;
  next_tier: string | null;
  referrals_to_next: number;
  jump_to_position: number | null;
  masked_email: string;
}

const TIER_KEYS = ["standard", "priority", "premium", "founding_member"] as const;

const TIER_STYLES = {
  standard: {
    icon: Star,
    color: "text-zinc-400",
    bg: "bg-zinc-500/10",
    border: "border-zinc-500/20",
    min: 0,
  },
  priority: {
    icon: Zap,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    min: 3,
  },
  premium: {
    icon: Crown,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    min: 10,
  },
  founding_member: {
    icon: Trophy,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    min: 25,
  },
} as const;

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function WaitlistStatusPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);
  const t = useTranslations("waitlistStatus");
  const [data, setData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const pathname = usePathname();

  const locale = pathname.split("/")[1] || "en";
  const localePrefix = locale === "en" ? "" : `/${locale}`;

  useEffect(() => {
    fetch(`/api/waitlist/status?code=${code}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [code]);

  const referralLink =
    typeof window !== "undefined" && data
      ? `${window.location.origin}${localePrefix}?ref=${data.referral_code}`
      : "";

  const shareText = t("shareText");

  const handleCopy = async () => {
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

  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(referralLink)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const shareOnWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${referralLink}`)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 py-16 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm text-center"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Users className="h-7 w-7 text-muted-foreground" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-primary via-purple-500 to-violet-600 bg-clip-text text-transparent">
              Matchlyst
            </span>
          </h1>
          <p className="mt-3 text-lg font-semibold text-foreground">
            {t("notFoundTitle")}
          </p>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {t("notFoundDescription")}
          </p>
          <div className="mt-6 flex flex-col items-center gap-3">
            <Link href="/#waitlist">
              <Button className="gap-2 rounded-xl bg-primary px-6 text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90">
                {t("notFoundJoinCta")}
              </Button>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {t("backToHome")}
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentTierKey = (data.tier as (typeof TIER_KEYS)[number]) || "standard";
  const currentTier = TIER_STYLES[currentTierKey];
  const TierIcon = currentTier.icon;
  const progressPercent = Math.min(100, (data.referral_count / 25) * 100);
  const percentile =
    data.total > 1
      ? Math.round(((data.total - data.position) / (data.total - 1)) * 100)
      : 100;

  const showJumpMessage =
    data.next_tier &&
    data.referrals_to_next > 0 &&
    data.jump_to_position !== null &&
    data.jump_to_position < data.position;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-16 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Back link */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {t("backToHome")}
        </Link>

        {/* Main card */}
        <div className="rounded-2xl border border-border/50 bg-card p-8 shadow-xl shadow-black/5">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary via-purple-500 to-violet-600 bg-clip-text text-transparent">
                Matchlyst
              </span>{" "}
              {t("headerWaitlist")}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {data.masked_email}
            </p>
          </div>

          {/* Position display */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="my-8 text-center"
          >
            <p className="text-sm font-medium text-muted-foreground">
              {t("yourPosition")}
            </p>
            <p className="mt-1 text-6xl font-extrabold tabular-nums tracking-tight">
              <span className="bg-gradient-to-r from-primary to-violet-600 bg-clip-text text-transparent">
                #{data.position}
              </span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("outOf", { total: data.total.toLocaleString() })}
            </p>
          </motion.div>

          {/* Percentile badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6 flex justify-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
              <span className="text-xs font-semibold text-primary">
                {t("aheadOf", { percent: percentile })}
              </span>
            </div>
          </motion.div>

          {/* Jump message */}
          <AnimatePresence>
            {showJumpMessage && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3.5 text-center"
              >
                <div className="flex items-center justify-center gap-2">
                  <ArrowUp className="h-4 w-4 text-emerald-400" />
                  <p className="text-sm font-semibold text-emerald-400">
                    {t("jumpMessage", {
                      count: data.referrals_to_next,
                      position: data.jump_to_position!,
                    })}
                  </p>
                </div>
                <p className="mt-1 text-xs text-emerald-400/60">
                  {t("jumpLeap", {
                    spots: (
                      data.position - data.jump_to_position!
                    ).toLocaleString(),
                  })}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Current tier */}
          <div
            className={`mb-6 flex items-center justify-between rounded-xl border px-4 py-3 ${currentTier.bg} ${currentTier.border}`}
          >
            <div className="flex items-center gap-2.5">
              <TierIcon className={`h-5 w-5 ${currentTier.color}`} />
              <div>
                <p className={`text-sm font-semibold ${currentTier.color}`}>
                  {t(`tier_${currentTierKey}_label`)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("referralCount", { count: data.referral_count })}
                </p>
              </div>
            </div>
            {data.next_tier && (
              <p className="text-xs text-muted-foreground">
                {t("moreToNext", { count: data.referrals_to_next })}
              </p>
            )}
          </div>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="mb-1.5 flex justify-between text-[10px] text-muted-foreground">
              {TIER_KEYS.map((key) => (
                <span
                  key={key}
                  className={
                    key === data.tier
                      ? `font-semibold ${TIER_STYLES[key].color}`
                      : ""
                  }
                >
                  {TIER_STYLES[key].min}
                </span>
              ))}
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-primary to-violet-600"
              />
            </div>
            <div className="relative mt-1 flex justify-between text-[10px] text-muted-foreground">
              {TIER_KEYS.map((key) => {
                const TIcon = TIER_STYLES[key].icon;
                const isActive = data.referral_count >= TIER_STYLES[key].min;
                return (
                  <TIcon
                    key={key}
                    className={`h-3.5 w-3.5 ${isActive ? TIER_STYLES[key].color : "text-muted-foreground/30"}`}
                  />
                );
              })}
            </div>
          </div>

          {/* Referral link + share */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
            <div className="mb-3 flex items-center gap-2">
              <Gift className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">
                {t("shareTitle")}
              </span>
            </div>
            <p className="mb-4 text-xs text-muted-foreground">
              {t("shareDescription")}
            </p>

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
                    {t("copied")}
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    {t("copy")}
                  </>
                )}
              </Button>
            </div>

            {/* Social share buttons */}
            <div className="mt-4 flex items-center gap-2">
              <p className="mr-1 text-[11px] font-medium text-muted-foreground">
                {t("shareVia")}
              </p>
              <button
                onClick={shareOnTwitter}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/50 bg-background text-muted-foreground transition-colors hover:border-[#1DA1F2]/40 hover:text-[#1DA1F2]"
                aria-label="Share on X"
              >
                <TwitterIcon className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={shareOnLinkedIn}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/50 bg-background text-muted-foreground transition-colors hover:border-[#0A66C2]/40 hover:text-[#0A66C2]"
                aria-label="Share on LinkedIn"
              >
                <LinkedInIcon className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={shareOnWhatsApp}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/50 bg-background text-muted-foreground transition-colors hover:border-[#25D366]/40 hover:text-[#25D366]"
                aria-label="Share on WhatsApp"
              >
                <WhatsAppIcon className="h-3.5 w-3.5" />
              </button>
              {typeof navigator !== "undefined" && "share" in navigator && (
                <button
                  onClick={() =>
                    navigator.share?.({
                      title: "Matchlyst",
                      text: shareText,
                      url: referralLink,
                    })
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/50 bg-background text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  aria-label="Share"
                >
                  <Share2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tier breakdown with reward descriptions */}
        <div className="mt-6 rounded-2xl border border-border/50 bg-card p-6 shadow-xl shadow-black/5">
          <h3 className="mb-4 text-sm font-semibold">
            {t("tierBreakdownTitle")}
          </h3>
          <div className="space-y-3">
            {TIER_KEYS.slice(1).map((key) => {
              const style = TIER_STYLES[key];
              const TIcon = style.icon;
              const achieved = data.referral_count >= style.min;
              return (
                <div
                  key={key}
                  className={`rounded-lg border px-4 py-3 transition-all ${
                    achieved
                      ? `${style.bg} ${style.border}`
                      : "border-border/30 opacity-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <TIcon
                      className={`h-4 w-4 shrink-0 ${achieved ? style.color : "text-muted-foreground"}`}
                    />
                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium ${achieved ? style.color : "text-muted-foreground"}`}
                      >
                        {t(`tier_${key}_label`)}
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {t(`tier_${key}_reward`)}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {t("referralsNeeded", { count: style.min })}
                    </span>
                    {achieved && (
                      <Check className="h-4 w-4 shrink-0 text-green-500" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
