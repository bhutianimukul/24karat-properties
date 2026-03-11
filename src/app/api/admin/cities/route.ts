import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse, type NextRequest } from "next/server";

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("cities")
      .select("id, name, meta")
      .order("name");

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const { city_id, hot_locations } = await request.json();

    // Fetch existing meta, merge hot_locations into it
    const { data: city } = await supabase
      .from("cities")
      .select("meta")
      .eq("id", city_id)
      .single();

    const meta = { ...(city?.meta as Record<string, unknown> || {}), hot_locations };

    const { data, error } = await supabase
      .from("cities")
      .update({ meta })
      .eq("id", city_id)
      .select("id, name, meta")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
