import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * Tier thresholds — order matters: highest tier first.
 * Position is determined FIRST by tier (higher tier = closer to front),
 * then by signup date within the same tier.
 */
const TIER_THRESHOLDS = [
  { key: "founding_member", min: 25, next: null },
  { key: "premium", min: 10, next: "founding_member" },
  { key: "priority", min: 3, next: "premium" },
  { key: "standard", min: 0, next: "priority" },
] as const;

function getTierForCount(referrals: number) {
  return (
    TIER_THRESHOLDS.find((t) => referrals >= t.min) ?? TIER_THRESHOLDS[3]
  );
}

function getNextTierThreshold(currentTierKey: string): number | null {
  const entry = TIER_THRESHOLDS.find((t) => t.key === currentTierKey);
  if (!entry || !entry.next) return null;
  const nextEntry = TIER_THRESHOLDS.find((t) => t.key === entry.next);
  return nextEntry?.min ?? null;
}

/**
 * GET /api/waitlist/status?code=<referral_code>
 *
 * Returns the user's waitlist position, referral count, tier info,
 * and a "jump_to" projection showing the position they'd reach at the next tier.
 */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  try {
    // ── Get the user's row ──
    const { data: user, error } = await supabaseAdmin
      .from("waitlist")
      .select("id, email, referral_code, referral_count, created_at")
      .eq("referral_code", code)
      .single();

    if (error) {
      console.error("[waitlist/status] Supabase query error:", error);
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (!user) {
      console.error("[waitlist/status] No user found for code:", code);
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const referrals = user.referral_count ?? 0;
    const tierInfo = getTierForCount(referrals);

    // ── Total waitlist size ──
    const { count: totalCount } = await supabaseAdmin
      .from("waitlist")
      .select("*", { count: "exact", head: true });
    const total = totalCount ?? 0;

    // ── Tier-based position calculation ──
    // Position = (everyone in higher tiers) + (people in same tier who joined before you)

    // Count users in STRICTLY higher tiers (more referrals than this tier's minimum)
    // These are all people whose referral_count >= the next tier up's minimum.
    // We count all tiers above the user's current tier.
    let usersInHigherTiers = 0;
    for (const t of TIER_THRESHOLDS) {
      if (t.min > tierInfo.min) {
        // Count users in this specific tier band
        const upperTierIdx = TIER_THRESHOLDS.indexOf(t);
        const upperBound =
          upperTierIdx > 0 ? TIER_THRESHOLDS[upperTierIdx - 1].min : null;

        let query = supabaseAdmin
          .from("waitlist")
          .select("*", { count: "exact", head: true })
          .gte("referral_count", t.min);

        if (upperBound !== null) {
          query = query.lt("referral_count", upperBound);
        }

        const { count } = await query;
        usersInHigherTiers += count ?? 0;
      }
    }

    // Count users in the SAME tier who joined before this user
    const currentTierIdx = TIER_THRESHOLDS.indexOf(tierInfo);
    const upperBoundForCurrentTier =
      currentTierIdx > 0 ? TIER_THRESHOLDS[currentTierIdx - 1].min : null;

    let sameTierQuery = supabaseAdmin
      .from("waitlist")
      .select("*", { count: "exact", head: true })
      .gte("referral_count", tierInfo.min)
      .lt("created_at", user.created_at);

    if (upperBoundForCurrentTier !== null) {
      sameTierQuery = sameTierQuery.lt(
        "referral_count",
        upperBoundForCurrentTier
      );
    }

    const { count: sameTierAhead } = await sameTierQuery;

    const position = usersInHigherTiers + (sameTierAhead ?? 0) + 1;

    // ── Compute the "jump to" position for the next tier ──
    // If the user reaches the next tier, how many people would be ahead of them?
    // Answer: everyone currently in that tier or higher, since the user would be
    // the newest member of the next tier (they'd be last within it chronologically).
    let jumpToPosition: number | null = null;
    const nextTierMin = getNextTierThreshold(tierInfo.key);

    if (nextTierMin !== null) {
      // Count everyone who currently has >= nextTierMin referrals
      const { count: usersAtOrAboveNextTier } = await supabaseAdmin
        .from("waitlist")
        .select("*", { count: "exact", head: true })
        .gte("referral_count", nextTierMin);

      // The user would land right after all existing members of that tier+
      jumpToPosition = (usersAtOrAboveNextTier ?? 0) + 1;
    }

    // ── Tier metadata ──
    const referralsToNext =
      nextTierMin !== null ? nextTierMin - referrals : 0;

    // ── Mask the email for display ──
    const [localPart, domain] = user.email.split("@");
    const maskedEmail =
      localPart.length <= 2
        ? localPart + "***@" + domain
        : localPart.slice(0, 2) + "***@" + domain;

    return NextResponse.json({
      position,
      total,
      referral_count: referrals,
      referral_code: user.referral_code,
      tier: tierInfo.key,
      next_tier: tierInfo.next,
      referrals_to_next: referralsToNext,
      jump_to_position: jumpToPosition,
      masked_email: maskedEmail,
    });
  } catch (err) {
    console.error("[waitlist/status] Error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
