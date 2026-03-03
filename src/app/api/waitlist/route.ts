// ============================================
// Waitlist API Route
// POST /api/waitlist → inserts email into waitlist table
// ============================================

import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { error } = await supabase.from("waitlist").insert({
      email: email.toLowerCase().trim(),
      source: "landing_page",
    });

    if (error) {
      // Handle duplicate email (unique constraint violation)
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "You're already on the waitlist!" },
          { status: 409 }
        );
      }
      throw error;
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Waitlist error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
