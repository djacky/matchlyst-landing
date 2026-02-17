"use client";

import { useEffect, useState, use } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

const TIERS = [
  {
    key: "standard",
    label: "Standard",
    icon: Star,
    color: "text-zinc-400",
    bg: "bg-zinc-500/10",
    border: "border-zinc-500/20",
    min: 0,
  },
  {
    key: "priority",
    label: "Priority Access",
    icon: Zap,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    min: 3,
  },
  {
    key: "premium",
    label: "3 Months Free Premium",
    icon: Crown,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    min: 10,
  },
  {
    key: "founding_member",
    label: "Founding Member",
    icon: Trophy,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    min: 25,
  },
];

export default function WaitlistStatusPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);
  const [data, setData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

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
      ? `${window.location.origin}?ref=${data.referral_code}`
      : "";

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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-lg font-semibold text-foreground">
          Waitlist entry not found
        </p>
        <p className="text-sm text-muted-foreground">
          This link may be invalid or expired.
        </p>
        <Link href="/">
          <Button variant="outline" className="mt-2 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Matchlyst
          </Button>
        </Link>
      </div>
    );
  }

  const currentTier = TIERS.find((t) => t.key === data.tier) || TIERS[0];
  const TierIcon = currentTier.icon;

  const progressPercent = Math.min(100, (data.referral_count / 25) * 100);

  // Jump message logic
  const showJumpMessage =
    data.next_tier &&
    data.referrals_to_next > 0 &&
    data.jump_to_position !== null &&
    data.jump_to_position < data.position;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
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
          Back to Matchlyst
        </Link>

        {/* Main card */}
        <div className="rounded-2xl border border-border/50 bg-card p-8 shadow-xl shadow-black/5">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary via-purple-500 to-violet-600 bg-clip-text text-transparent">
                Matchlyst
              </span>{" "}
              Waitlist
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
              Your position
            </p>
            <p className="mt-1 text-6xl font-extrabold tabular-nums tracking-tight">
              <span className="bg-gradient-to-r from-primary to-violet-600 bg-clip-text text-transparent">
                #{data.position}
              </span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              out of {data.total.toLocaleString()} on the waitlist
            </p>
          </motion.div>

          {/* Jump message */}
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
                  Get just {data.referrals_to_next} more referral
                  {data.referrals_to_next !== 1 ? "s" : ""} to jump to #
                  {data.jump_to_position}!
                </p>
              </div>
              <p className="mt-1 text-xs text-emerald-400/60">
                That&apos;s a leap of{" "}
                {(data.position - data.jump_to_position!).toLocaleString()}{" "}
                spots
              </p>
            </motion.div>
          )}

          {/* Current tier */}
          <div
            className={`mb-6 flex items-center justify-between rounded-xl border px-4 py-3 ${currentTier.bg} ${currentTier.border}`}
          >
            <div className="flex items-center gap-2.5">
              <TierIcon className={`h-5 w-5 ${currentTier.color}`} />
              <div>
                <p className={`text-sm font-semibold ${currentTier.color}`}>
                  {currentTier.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  {data.referral_count} referral
                  {data.referral_count !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            {data.next_tier && (
              <p className="text-xs text-muted-foreground">
                {data.referrals_to_next} more to next tier
              </p>
            )}
          </div>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between text-[10px] text-muted-foreground mb-1.5">
              {TIERS.map((tier) => (
                <span
                  key={tier.key}
                  className={
                    tier.key === data.tier
                      ? `font-semibold ${tier.color}`
                      : ""
                  }
                >
                  {tier.min}
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
            {/* Tier markers */}
            <div className="relative mt-1 flex justify-between text-[10px] text-muted-foreground">
              {TIERS.map((tier) => {
                const TIcon = tier.icon;
                const isActive = data.referral_count >= tier.min;
                return (
                  <TIcon
                    key={tier.key}
                    className={`h-3.5 w-3.5 ${isActive ? tier.color : "text-muted-foreground/30"}`}
                  />
                );
              })}
            </div>
          </div>

          {/* Referral link */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
            <div className="mb-3 flex items-center gap-2">
              <Gift className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">
                Share to move up
              </span>
            </div>
            <p className="mb-4 text-xs text-muted-foreground">
              Reach the next referral tier and jump ahead of everyone below it —
              the more you share, the bigger the leap.
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
          </div>
        </div>

        {/* Tier breakdown */}
        <div className="mt-6 rounded-2xl border border-border/50 bg-card p-6 shadow-xl shadow-black/5">
          <h3 className="mb-4 text-sm font-semibold">Referral tiers</h3>
          <div className="space-y-3">
            {TIERS.slice(1).map((tier) => {
              const TIcon = tier.icon;
              const achieved = data.referral_count >= tier.min;
              return (
                <div
                  key={tier.key}
                  className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-all ${
                    achieved
                      ? `${tier.bg} ${tier.border}`
                      : "border-border/30 opacity-50"
                  }`}
                >
                  <TIcon
                    className={`h-4 w-4 ${achieved ? tier.color : "text-muted-foreground"}`}
                  />
                  <div className="flex-1">
                    <p
                      className={`text-sm font-medium ${achieved ? tier.color : "text-muted-foreground"}`}
                    >
                      {tier.label}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {tier.min} referrals
                  </span>
                  {achieved && (
                    <Check className="h-4 w-4 text-green-500" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
