import { generateWithGemini } from "@/lib/gemini";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  if (!process.env.GROQ_API_KEY && !process.env.GEMINI_API_KEY) {
    return NextResponse.json({ description: "AI unavailable — set GEMINI_API_KEY to enable." }, { status: 200 });
  }

  const body = await request.json();
  const { title, property_type, city, area, address, price, area_sqft, bedrooms, bathrooms, facing, amenities, existing_description } = body;

  const prompt = `You are a real estate copywriter for an Indian property website called "24 Karat Properties" based in Noida and Dholera.

Write a compelling 2-3 sentence property description for:
- Title: ${title || "N/A"}
- Type: ${property_type || "N/A"}
- City: ${city || "N/A"}
- Area: ${area || "N/A"}
- Address: ${address || "N/A"}
- Price: ₹${price || "N/A"}
- Size: ${area_sqft || "N/A"} sqft
- Bedrooms: ${bedrooms || "N/A"}, Bathrooms: ${bathrooms || "N/A"}
- Facing: ${facing || "N/A"}
- Amenities: ${amenities?.length ? amenities.join(", ") : "N/A"}
${existing_description ? `\nExisting description to improve: "${existing_description}"` : ""}

Guidelines:
- Keep it professional but warm, slightly Hinglish-friendly
- Highlight location advantages, connectivity, investment potential
- Mention key features that matter to Indian buyers
- Keep under 60 words
- Do NOT include price in the description
- Return ONLY the description text, no quotes or labels`;

  try {
    const text = await generateWithGemini(prompt);
    return NextResponse.json({ description: text });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.includes("429") || msg.includes("quota")) {
      return NextResponse.json({ description: "AI quota reached — try again in a few minutes." }, { status: 200 });
    }
    return NextResponse.json({ description: "AI unavailable — try again later." }, { status: 200 });
  }
}
