import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

const PROPERTY_SELECT = "*, city:cities(*), area:areas(*), images:property_images(*)";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = request.nextUrl;

    const city = searchParams.get("city");
    const type = searchParams.get("type");
    const transaction = searchParams.get("transaction");
    const minPrice = searchParams.get("min_price");
    const maxPrice = searchParams.get("max_price");
    const featured = searchParams.get("featured");
    const sort = searchParams.get("sort") || "newest";
    const limit = Math.min(Number(searchParams.get("limit") || 50), 100);
    const offset = Number(searchParams.get("offset") || 0);

    let query = supabase
      .from("properties")
      .select(PROPERTY_SELECT, { count: "exact" })
      .eq("status", "active");

    if (city) query = query.eq("city_id", city);
    if (type) query = query.eq("property_type", type);
    if (transaction) query = query.eq("transaction_type", transaction === "buy" ? "sell" : transaction);
    if (minPrice) query = query.gte("price", Number(minPrice));
    if (maxPrice) query = query.lte("price", Number(maxPrice));
    if (featured === "true") query = query.eq("is_featured", true);

    if (sort === "price-low") query = query.order("price", { ascending: true });
    else if (sort === "price-high") query = query.order("price", { ascending: false });
    else query = query.order("created_at", { ascending: false });

    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data, total: count, limit, offset });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
