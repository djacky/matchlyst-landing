import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendWelcomeEmail } from "@/lib/email";
import { nanoid } from "@/lib/nanoid";

export async function POST(request: NextRequest) {
  try {
    const { email, role, ref } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    const validRoles = ["client", "freelancer", "both"];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Please select a valid role" },
        { status: 400 }
      );
    }

    // Generate a unique referral code for this user
    const referralCode = nanoid();

    // Get current waitlist count for position
    const { count } = await supabaseAdmin
      .from("waitlist")
      .select("*", { count: "exact", head: true });

    const position = (count ?? 0) + 1;

    // If referred by someone, look up the referrer
    let referredBy: string | null = null;
    if (ref && typeof ref === "string") {
      const { data: referrer } = await supabaseAdmin
        .from("waitlist")
        .select("id")
        .eq("referral_code", ref)
        .single();

      if (referrer) {
        referredBy = referrer.id;
      }
    }

    // Insert the new waitlist entry
    const { data: newEntry, error } = await supabaseAdmin
      .from("waitlist")
      .insert([
        {
          email: email.toLowerCase(),
          role,
          referral_code: referralCode,
          referred_by: referredBy,
          referral_count: 0,
        },
      ])
      .select("id, referral_code")
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "This email is already on the waitlist" },
          { status: 409 }
        );
      }
      throw error;
    }

    // Increment the referrer's referral_count
    if (referredBy) {
      await supabaseAdmin.rpc("increment_referral_count", { row_id: referredBy });
    }

    // Send welcome email (fire-and-forget, don't block response)
    sendWelcomeEmail({
      email: email.toLowerCase(),
      referralCode,
      position,
    }).catch((err) => console.error("[waitlist] Email send failed:", err));

    return NextResponse.json(
      {
        message: "Successfully joined the waitlist!",
        referral_code: newEntry?.referral_code,
        position,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[waitlist] Error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/waitlist — returns the total waitlist count (for social proof).
 */
export async function GET() {
  try {
    const { count, error } = await supabaseAdmin
      .from("waitlist")
      .select("*", { count: "exact", head: true });

    if (error) throw error;

    return NextResponse.json({ count: count ?? 0 });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}


