import { generateWithGemini, parseJSON } from "@/lib/gemini";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  if (!process.env.GROQ_API_KEY && !process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "AI unavailable" }, { status: 503 });
  }

  const { city, area, address, property_type } = await request.json();

  const prompt = `You are an Indian real estate location expert. Generate location highlights for a property.

Location: ${address || "N/A"}
Area: ${area || "N/A"}
City: ${city || "N/A"}
Property Type: ${property_type || "N/A"}

Return ONLY valid JSON (no markdown, no code fences):
{
  "highlights": [
    { "icon": "metro", "text": "<specific highlight, e.g. '5 min from Sector 142 Metro Station'>" },
    { "icon": "airport", "text": "<e.g. '30 min to Jewar International Airport'>" },
    { "icon": "road", "text": "<e.g. 'Direct access to Noida-Greater Noida Expressway'>" },
    { "icon": "school", "text": "<e.g. 'Near DPS, Amity University'>" },
    { "icon": "hospital", "text": "<e.g. '10 min from Fortis Hospital'>" },
    { "icon": "shopping", "text": "<e.g. 'DLF Mall of India 15 min away'>" }
  ],
  "tags": ["2-4 short tags like 'High ROI', 'Family-friendly', 'Metro Connected', 'Upcoming Hotspot'"],
  "price_insight": "<1 sentence about the area's price trend — e.g. 'Prices in Sector 150 have appreciated 15% in the last 2 years due to Jewar Airport proximity'>"
}

Guidelines:
- Include 4-6 highlights, only ones relevant to the actual location
- Icon must be one of: metro, airport, road, school, hospital, shopping, park, temple, it_hub, smart_city
- For Dholera: focus on Smart City, DMIC, international airport, SIR, solar park
- For Noida/Greater Noida: focus on expressways, metro lines, Jewar Airport, IT hubs, Yamuna Authority
- Be specific — use real landmark names, distances, and area names
- Tags should be 2-3 words max, catchy, useful for buyers`;

  try {
    const text = await generateWithGemini(prompt);
    const result = parseJSON(text) as Record<string, unknown>;

    if (!result.highlights || !result.tags) {
      throw new Error("Invalid highlights shape");
    }

    return NextResponse.json(result);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.includes("429") || msg.includes("quota")) {
      return NextResponse.json({ error: "AI quota reached — try again in a few minutes" }, { status: 429 });
    }
    console.error("AI highlights error:", e);
    return NextResponse.json({ error: "AI highlights failed — try again" }, { status: 500 });
  }
}
