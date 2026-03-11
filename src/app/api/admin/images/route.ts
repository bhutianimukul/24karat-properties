import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const property_id = formData.get("property_id") as string | null;
    const alt_text = (formData.get("alt_text") as string) || null;
    const sort_order = Number(formData.get("sort_order") || 0);
    const is_primary = formData.get("is_primary") === "true";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Upload to Supabase Storage
    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const filePath = `properties/${fileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from("property-images")
      .upload(filePath, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("property-images")
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;

    // If property_id is provided, insert into property_images table
    if (property_id) {
      const { data, error: dbError } = await supabase
        .from("property_images")
        .insert({
          property_id,
          url: publicUrl,
          alt_text,
          sort_order,
          is_primary,
        })
        .select()
        .single();

      if (dbError) {
        return NextResponse.json({ error: dbError.message }, { status: 500 });
      }

      return NextResponse.json(data, { status: 201 });
    }

    // Return just the URL if no property_id (for pre-upload before property creation)
    return NextResponse.json({ url: publicUrl, filePath }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const { id, filePath } = await request.json();

    // Delete from storage if filePath provided
    if (filePath) {
      await supabase.storage.from("property-images").remove([filePath]);
    }

    // Delete DB row if id provided
    if (id) {
      const { error } = await supabase
        .from("property_images")
        .delete()
        .eq("id", id);
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
