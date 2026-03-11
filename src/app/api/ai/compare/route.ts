import { generateWithGemini, parseJSON } from "@/lib/gemini";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  if (!process.env.GROQ_API_KEY && !process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "AI unavailable — set GEMINI_API_KEY" }, { status: 503 });
  }

  const { properties } = await request.json();

  if (!properties || properties.length < 2) {
    return NextResponse.json({ error: "Need at least 2 properties to compare" }, { status: 400 });
  }

  const propertyList = properties.map((p: Record<string, unknown>, i: number) =>
    `Property ${i + 1}: "${p.title}"
  - Type: ${p.property_type}, City: ${p.city}
  - Area: ${p.area || "N/A"}, Address: ${p.address}
  - Price: ₹${(p.price as number)?.toLocaleString("en-IN")}, Size: ${p.area_sqft} sqft
  - Bedrooms: ${p.bedrooms ?? "N/A"}, Bathrooms: ${p.bathrooms ?? "N/A"}
  - Facing: ${p.facing || "N/A"}, Amenities: ${(p.amenities as string[])?.length || 0}`
  ).join("\n\n");

  const prompt = `You are a senior Indian real estate analyst for "24 Karat Properties". Compare these properties and help the buyer decide.

${propertyList}

Return ONLY valid JSON (no markdown, no code fences) with this exact structure:
{
  "comparisons": [
    {
      "title": "<property title>",
      "pros": ["2-3 specific pros"],
      "cons": ["1-2 specific cons"]
    }
  ],
  "winner": "<title of the recommended property>",
  "winner_reasoning": "<2-3 sentences explaining why this is the best pick — be specific about value, location, growth>",
  "tip": "<1 practical buying tip for the user>"
}

Guidelines:
- Be specific — mention actual areas, infra projects, connectivity advantages
- Consider price-to-value ratio, not just absolute price
- Be honest about trade-offs
- The "tip" should be actionable (e.g. "Negotiate X", "Check Y before buying")`;

  try {
    const text = await generateWithGemini(prompt);
    const comparison = parseJSON(text) as Record<string, unknown>;

    if (!comparison.comparisons || !comparison.winner) {
      throw new Error("Invalid comparison shape");
    }

    return NextResponse.json(comparison);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.includes("429") || msg.includes("quota")) {
      return NextResponse.json({ error: "AI quota reached — try again in a few minutes" }, { status: 429 });
    }
    console.error("AI compare error:", e);
    return NextResponse.json({ error: "AI comparison failed — try again" }, { status: 500 });
  }
}
