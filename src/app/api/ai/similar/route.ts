import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

const PROPERTY_SELECT = "*, city:cities(*), area:areas(*), images:property_images(*)";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = request.nextUrl;

    const propertyId = searchParams.get("property_id");
    if (!propertyId) {
      return NextResponse.json({ error: "property_id is required" }, { status: 400 });
    }

    // Fetch the source property
    const { data: source } = await supabase
      .from("properties")
      .select("city_id, property_type, price, area_sqft, bedrooms")
      .eq("id", propertyId)
      .single();

    if (!source) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    // Find similar: same city, same type, price within 40%, exclude self
    const minPrice = Math.round(source.price * 0.6);
    const maxPrice = Math.round(source.price * 1.4);

    const { data, error } = await supabase
      .from("properties")
      .select(PROPERTY_SELECT)
      .eq("status", "active")
      .eq("city_id", source.city_id)
      .eq("property_type", source.property_type)
      .neq("id", propertyId)
      .gte("price", minPrice)
      .lte("price", maxPrice)
      .order("is_featured", { ascending: false })
      .limit(6);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // If fewer than 3 results, broaden to same city only
    if ((data || []).length < 3) {
      const { data: broader } = await supabase
        .from("properties")
        .select(PROPERTY_SELECT)
        .eq("status", "active")
        .eq("city_id", source.city_id)
        .neq("id", propertyId)
        .order("created_at", { ascending: false })
        .limit(6);

      return NextResponse.json(broader || []);
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
