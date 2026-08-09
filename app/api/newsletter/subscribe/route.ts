import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body?.email;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    // Try to record subscription in Supabase if configured
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("subscribers")
        .upsert(
          { email, created_at: new Date().toISOString() },
          { onConflict: "email" },
        );

      if (error) {
        console.warn("Supabase subscribers insert notice:", error.message);
      }
    } catch (dbErr) {
      console.warn("Supabase client connection error:", dbErr);
    }

    return NextResponse.json({
      success: true,
      message: "Subscribed successfully!",
    });
  } catch (error: any) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again." },
      { status: 500 },
    );
  }
}
