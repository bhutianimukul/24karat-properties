import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const includeAreas = request.nextUrl.searchParams.get("areas") === "true";

    const select = includeAreas ? "*, areas(*)" : "*";

    const { data, error } = await supabase
      .from("cities")
      .select(select)
      .order("name");

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
