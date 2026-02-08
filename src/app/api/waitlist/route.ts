import { NextRequest, NextResponse } from "next/server";

// In-memory store for development. Replace with a database in production.
const waitlist: { email: string; role: string; joinedAt: string }[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, role } = body;

    // Validate email
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ["client", "freelancer", "both"];
    if (!role || !validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Please select a valid role" },
        { status: 400 }
      );
    }

    // Check for duplicate
    const exists = waitlist.find(
      (entry) => entry.email.toLowerCase() === email.toLowerCase()
    );
    if (exists) {
      return NextResponse.json(
        { error: "This email is already on the waitlist" },
        { status: 409 }
      );
    }

    // Store entry
    waitlist.push({
      email: email.toLowerCase(),
      role,
      joinedAt: new Date().toISOString(),
    });

    console.log(`[Waitlist] New signup: ${email} (${role})`);
    console.log(`[Waitlist] Total entries: ${waitlist.length}`);

    return NextResponse.json(
      { message: "Successfully joined the waitlist!" },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
