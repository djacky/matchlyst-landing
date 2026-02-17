import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "Matchlyst <notifications@matchlyst.com>";
const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://www.matchlyst.com";

/**
 * Send the waitlist welcome email with the user's unique referral link.
 */
export async function sendWelcomeEmail({
  email,
  referralCode,
  position,
}: {
  email: string;
  referralCode: string;
  position: number;
}) {
  const referralLink = `${BASE_URL}?ref=${referralCode}`;
  const statusLink = `${BASE_URL}/waitlist/${referralCode}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#09090b;color:#fafafa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:48px 24px;">

    <!-- Logo / Brand -->
    <div style="text-align:center;margin-bottom:40px;">
      <h1 style="margin:0;font-size:28px;font-weight:800;letter-spacing:-0.5px;">
        <span style="background:linear-gradient(135deg,#a78bfa,#8b5cf6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Matchlyst</span>
      </h1>
    </div>

    <!-- Main content -->
    <div style="background:#18181b;border:1px solid #27272a;border-radius:16px;padding:32px;text-align:center;">

      <div style="width:56px;height:56px;margin:0 auto 20px;border-radius:50%;background:rgba(167,139,250,0.1);display:flex;align-items:center;justify-content:center;">
        <span style="font-size:28px;">🎉</span>
      </div>

      <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#fafafa;">
        You're on the waitlist!
      </h2>

      <p style="margin:0 0 24px;font-size:14px;color:#a1a1aa;line-height:1.6;">
        You're <strong style="color:#a78bfa;">#${position}</strong> on the list.
        We'll notify you as soon as early access opens.
      </p>

      <!-- Referral box -->
      <div style="background:#09090b;border:1px solid #27272a;border-radius:12px;padding:24px;margin-bottom:24px;">
        <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#a78bfa;text-transform:uppercase;letter-spacing:1px;">
          Move up the list
        </p>
        <p style="margin:0 0 16px;font-size:14px;color:#a1a1aa;line-height:1.5;">
          Share your unique link. Each signup moves you closer to the front.
        </p>

        <div style="background:#27272a;border-radius:8px;padding:12px 16px;margin-bottom:16px;word-break:break-all;">
          <a href="${referralLink}" style="color:#a78bfa;text-decoration:none;font-size:14px;font-weight:500;">
            ${referralLink}
          </a>
        </div>

        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">
          <tr>
            <td style="font-size:12px;color:#71717a;text-align:center;">
              <strong style="color:#fafafa;">3 referrals</strong> → Priority access
            </td>
          </tr>
          <tr>
            <td style="font-size:12px;color:#71717a;text-align:center;padding-top:4px;">
              <strong style="color:#fafafa;">10 referrals</strong> → 3 months free premium
            </td>
          </tr>
          <tr>
            <td style="font-size:12px;color:#71717a;text-align:center;padding-top:4px;">
              <strong style="color:#fafafa;">25 referrals</strong> → Founding Member status
            </td>
          </tr>
        </table>
      </div>

      <!-- Status link -->
      <p style="margin:0;font-size:13px;color:#71717a;">
        Check your referral status anytime:
        <a href="${statusLink}" style="color:#a78bfa;text-decoration:underline;">${statusLink}</a>
      </p>
    </div>

    <!-- Footer -->
    <div style="text-align:center;margin-top:32px;">
      <p style="margin:0;font-size:12px;color:#52525b;">
        © ${new Date().getFullYear()} Matchlyst. All rights reserved.
      </p>
      <p style="margin:8px 0 0;font-size:11px;color:#3f3f46;">
        You received this because you signed up at matchlyst.com
      </p>
    </div>
  </div>
</body>
</html>`;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `You're #${position} on the Matchlyst waitlist 🚀`,
      html,
    });

    if (error) {
      console.error("[email] Failed to send welcome email:", error);
      return { success: false, error };
    }

    console.log("[email] Welcome email sent:", data?.id);
    return { success: true, id: data?.id };
  } catch (err) {
    console.error("[email] Exception sending welcome email:", err);
    return { success: false, error: err };
  }
}
