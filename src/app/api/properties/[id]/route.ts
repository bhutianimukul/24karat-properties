import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

const PROPERTY_SELECT = "*, city:cities(*), area:areas(*), images:property_images(*)";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Support both UUID (id) and slug lookup
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-/.test(id);

    const { data, error } = await supabase
      .from("properties")
      .select(PROPERTY_SELECT)
      .eq(isUUID ? "id" : "slug", id)
      .eq("status", "active")
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    // Increment view count (fire-and-forget)
    supabase
      .from("properties")
      .update({ view_count: (data.view_count || 0) + 1 })
      .eq("id", data.id)
      .then();

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
