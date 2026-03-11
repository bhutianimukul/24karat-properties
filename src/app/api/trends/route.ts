import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = request.nextUrl;

    const city = searchParams.get("city");
    const area = searchParams.get("area");
    const type = searchParams.get("type") || "flat";

    // Get average price per sqft by aggregating active properties
    let query = supabase
      .from("properties")
      .select("city_id, area_id, property_type, price_per_sqft, price, area_sqft, created_at")
      .eq("status", "active")
      .eq("property_type", type)
      .not("price_per_sqft", "is", null)
      .order("created_at", { ascending: false });

    if (city) query = query.eq("city_id", city);
    if (area) query = query.eq("area_id", area);

    const { data, error } = await query;

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Calculate summary stats
    const prices = (data || []).map((p) => p.price_per_sqft!);
    const summary = {
      city: city || "all",
      area: area || "all",
      property_type: type,
      total_listings: prices.length,
      avg_price_per_sqft: prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : null,
      min_price_per_sqft: prices.length ? Math.min(...prices) : null,
      max_price_per_sqft: prices.length ? Math.max(...prices) : null,
      median_price_per_sqft: prices.length
        ? prices.sort((a, b) => a - b)[Math.floor(prices.length / 2)]
        : null,
    };

    return NextResponse.json({ summary, listings: data });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
