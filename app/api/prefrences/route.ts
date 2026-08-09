// app/api/preferences/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("user_preferences")
    .select("followed_topics, followed_sources")
    .eq("user_id", user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = not found
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    followed_topics: data?.followed_topics || [],
    followed_sources: data?.followed_sources || [],
  });
}

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const followed_topics = Array.isArray(body?.followed_topics)
    ? body.followed_topics
    : [];
  const followed_sources = Array.isArray(body?.followed_sources)
    ? body.followed_sources
    : [];

  const { error } = await supabase.from("user_preferences").upsert(
    {
      user_id: user.id,
      followed_topics,
      followed_sources,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
