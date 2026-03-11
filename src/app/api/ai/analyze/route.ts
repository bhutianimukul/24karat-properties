import { generateWithGemini, parseJSON } from "@/lib/gemini";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  if (!process.env.GROQ_API_KEY && !process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "AI unavailable — set GEMINI_API_KEY" }, { status: 503 });
  }

  const body = await request.json();
  const { title, property_type, city, area, address, price, area_sqft, bedrooms, bathrooms, facing, amenities, year_built } = body;

  const prompt = `You are a senior Indian real estate analyst for "24 Karat Properties". Analyze this property and return a JSON object.

Property:
- Title: ${title}
- Type: ${property_type}
- City: ${city}
- Area/Locality: ${area || "N/A"}
- Address: ${address}
- Price: ₹${price?.toLocaleString("en-IN")}
- Size: ${area_sqft} sqft
- Price/sqft: ₹${price && area_sqft ? Math.round(price / area_sqft).toLocaleString("en-IN") : "N/A"}
- Bedrooms: ${bedrooms ?? "N/A"}, Bathrooms: ${bathrooms ?? "N/A"}
- Facing: ${facing || "N/A"}
- Year Built: ${year_built || "N/A"}
- Amenities: ${amenities?.length ? amenities.join(", ") : "None listed"}

Return ONLY valid JSON (no markdown, no code fences) with this exact structure:
{
  "pros": ["3-5 specific pros about this property, location, connectivity, value"],
  "cons": ["2-3 honest cons or risks — be real, not generic"],
  "investment_score": <number 1-10>,
  "investment_reasoning": "<1-2 sentences explaining the score>",
  "area_outlook": "<2-3 sentences about the area's future growth, infrastructure, metro, airport etc>",
  "best_for": "<who is this property ideal for — e.g. first-time buyers, investors, families, etc>"
}

Guidelines:
- Be specific to the actual area/city — mention real landmarks, upcoming infra like Jewar Airport, metro lines, DMIC, etc.
- For Dholera: mention Smart City status, DMIC, international airport, SIR potential
- For Noida/Greater Noida: mention expressways, metro, IT hubs, Jewar Airport impact
- Investment score: 8+ = great deal, 6-7 = decent, below 6 = risky
- Be honest about cons — buyers respect transparency`;

  try {
    const text = await generateWithGemini(prompt);
    const analysis = parseJSON(text) as Record<string, unknown>;

    if (!analysis.pros || !analysis.cons || !analysis.investment_score) {
      throw new Error("Invalid analysis shape");
    }

    return NextResponse.json({
      ...analysis,
      analyzed_at: new Date().toISOString(),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.includes("429") || msg.includes("quota")) {
      return NextResponse.json({ error: "AI quota reached — try again in a few minutes" }, { status: 429 });
    }
    console.error("AI analyze error:", e);
    return NextResponse.json({ error: "AI analysis failed — try again" }, { status: 500 });
  }
}
