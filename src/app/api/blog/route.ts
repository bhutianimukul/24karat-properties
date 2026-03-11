import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = request.nextUrl;

    const category = searchParams.get("category");
    const city = searchParams.get("city");
    const slug = searchParams.get("slug");
    const limit = Math.min(Number(searchParams.get("limit") || 20), 50);

    // Single post by slug
    if (slug) {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();

      if (error || !data) return NextResponse.json({ error: "Post not found" }, { status: 404 });
      return NextResponse.json(data);
    }

    // List posts
    let query = supabase
      .from("blog_posts")
      .select("id, title, slug, cover_image, category, city_id, published_at, seo_meta")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(limit);

    if (category) query = query.eq("category", category);
    if (city) query = query.eq("city_id", city);

    const { data, error } = await query;

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
