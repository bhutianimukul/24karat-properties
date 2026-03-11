import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse, type NextRequest } from "next/server";

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("properties")
      .select("*, city:cities(*), area:areas(*), images:property_images(*)")
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const body = await request.json();

    // Generate slug from title
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Calculate price_per_sqft
    const price_per_sqft =
      body.price && body.area_sqft
        ? Math.round(body.price / body.area_sqft)
        : null;

    // Strip fields that don't belong in the properties table
    const { city, area, images, id, ...cleanBody } = body;

    // Ensure area_id exists in areas table, create if needed
    if (cleanBody.area_id) {
      const { data: existing } = await supabase.from("areas").select("id").eq("id", cleanBody.area_id).single();
      if (!existing) {
        // Auto-create area
        const areaName = cleanBody.area_id.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
        await supabase.from("areas").insert({
          id: cleanBody.area_id,
          city_id: cleanBody.city_id,
          name: areaName,
          slug: cleanBody.area_id,
          latitude: cleanBody.latitude || 0,
          longitude: cleanBody.longitude || 0,
        });
      }
    }

    // Remove any empty/invalid fields
    if (!cleanBody.area_id) delete cleanBody.area_id;
    if (!cleanBody.possession_date) delete cleanBody.possession_date;

    const { data, error } = await supabase
      .from("properties")
      .insert({ ...cleanBody, slug, price_per_sqft })
      .select("*, city:cities(*), area:areas(*), images:property_images(*)")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
