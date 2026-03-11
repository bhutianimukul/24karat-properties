import { NextResponse, type NextRequest } from "next/server";

// Client-side wishlist stored in localStorage — this API provides
// a batch lookup endpoint to fetch full property data for saved IDs.

import { createClient } from "@/lib/supabase/server";

const PROPERTY_SELECT = "*, city:cities(*), area:areas(*), images:property_images(*)";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { ids } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ data: [] });
    }

    // Limit to 20 IDs max
    const limitedIds = ids.slice(0, 20);

    const { data, error } = await supabase
      .from("properties")
      .select(PROPERTY_SELECT)
      .eq("status", "active")
      .in("id", limitedIds);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
