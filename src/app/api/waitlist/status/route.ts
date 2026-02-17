import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * GET /api/waitlist/status?code=<referral_code>
 *
 * Returns the user's waitlist position, referral count, and tier info.
 * No authentication needed — the referral code acts as the "key".
 */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  try {
    // Get the user's row (use admin client to bypass RLS)
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

    // Calculate position: count everyone who joined before this user
    const { count: totalAhead } = await supabaseAdmin
      .from("waitlist")
      .select("*", { count: "exact", head: true })
      .lt("created_at", user.created_at);

    const { count: totalCount } = await supabaseAdmin
      .from("waitlist")
      .select("*", { count: "exact", head: true });

    // Raw position (chronological)
    const rawPosition = (totalAhead ?? 0) + 1;

    // Boosted position: each referral moves you up 1 spot, min position = 1
    const boostedPosition = Math.max(1, rawPosition - (user.referral_count ?? 0));

    // Determine tier
    const referrals = user.referral_count ?? 0;
    let tier: string;
    let nextTier: string | null;
    let referralsToNext: number;

    if (referrals >= 25) {
      tier = "founding_member";
      nextTier = null;
      referralsToNext = 0;
    } else if (referrals >= 10) {
      tier = "premium";
      nextTier = "founding_member";
      referralsToNext = 25 - referrals;
    } else if (referrals >= 3) {
      tier = "priority";
      nextTier = "premium";
      referralsToNext = 10 - referrals;
    } else {
      tier = "standard";
      nextTier = "priority";
      referralsToNext = 3 - referrals;
    }

    // Mask the email for display
    const [localPart, domain] = user.email.split("@");
    const maskedEmail =
      localPart.length <= 2
        ? localPart + "***@" + domain
        : localPart.slice(0, 2) + "***@" + domain;

    return NextResponse.json({
      position: boostedPosition,
      total: totalCount ?? 0,
      referral_count: referrals,
      referral_code: user.referral_code,
      tier,
      next_tier: nextTier,
      referrals_to_next: referralsToNext,
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
