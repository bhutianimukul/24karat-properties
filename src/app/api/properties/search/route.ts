import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

const PROPERTY_SELECT = "*, city:cities(*), area:areas(*), images:property_images(*)";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const q = request.nextUrl.searchParams.get("q")?.trim();

    if (!q || q.length < 2) {
      return NextResponse.json({ data: [], message: "Query must be at least 2 characters" });
    }

    const pattern = `%${q}%`;

    const { data, error } = await supabase
      .from("properties")
      .select(PROPERTY_SELECT)
      .eq("status", "active")
      .or(`title.ilike.${pattern},address.ilike.${pattern},description.ilike.${pattern}`)
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data, query: q });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
