import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const { name, phone, email, message, property_id, source } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("inquiries")
      .insert({
        name,
        phone,
        email: email || null,
        message: message || null,
        property_id: property_id || null,
        source: source || "form",
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Increment inquiry count on the property if linked
    if (property_id) {
      const { data: prop } = await supabase
        .from("properties")
        .select("inquiry_count")
        .eq("id", property_id)
        .single();

      if (prop) {
        await supabase
          .from("properties")
          .update({ inquiry_count: (prop.inquiry_count || 0) + 1 })
          .eq("id", property_id);
      }
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
