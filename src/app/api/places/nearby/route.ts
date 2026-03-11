import { NextResponse, type NextRequest } from "next/server";

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

interface NearbyPlace {
  name: string;
  type: string;
  distance_km: number;
  latitude: number;
  longitude: number;
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const lat = Number(searchParams.get("lat"));
    const lng = Number(searchParams.get("lng"));
    const radius = Math.min(Number(searchParams.get("radius") || 3000), 5000);

    if (!lat || !lng) {
      return NextResponse.json({ error: "lat and lng are required" }, { status: 400 });
    }

    const categories = [
      { key: "schools", query: `node["amenity"="school"](around:${radius},${lat},${lng});` },
      { key: "hospitals", query: `node["amenity"~"hospital|clinic"](around:${radius},${lat},${lng});` },
      { key: "transit", query: `node["station"~"subway|light_rail"](around:${radius},${lat},${lng});node["amenity"="bus_station"](around:${radius},${lat},${lng});` },
      { key: "shopping", query: `node["shop"~"mall|supermarket"](around:${radius},${lat},${lng});` },
      { key: "parks", query: `node["leisure"="park"](around:${radius},${lat},${lng});` },
    ];

    const query = `[out:json][timeout:10];(${categories.map((c) => c.query).join("")});out body 50;`;

    const res = await fetch(OVERPASS_URL, {
      method: "POST",
      body: `data=${encodeURIComponent(query)}`,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Overpass API error" }, { status: 502 });
    }

    const json = await res.json();
    const elements = json.elements || [];

    const result: Record<string, NearbyPlace[]> = {
      schools: [], hospitals: [], transit: [], shopping: [], parks: [],
    };

    for (const el of elements) {
      if (!el.tags?.name || !el.lat || !el.lon) continue;
      const dist = haversine(lat, lng, el.lat, el.lon);
      const place: NearbyPlace = { name: el.tags.name, type: el.tags.amenity || el.tags.shop || el.tags.leisure || el.tags.station || "other", distance_km: Math.round(dist * 10) / 10, latitude: el.lat, longitude: el.lon };

      if (el.tags.amenity === "school") result.schools.push(place);
      else if (el.tags.amenity === "hospital" || el.tags.amenity === "clinic") result.hospitals.push(place);
      else if (el.tags.station || el.tags.amenity === "bus_station") result.transit.push(place);
      else if (el.tags.shop) result.shopping.push(place);
      else if (el.tags.leisure === "park") result.parks.push(place);
    }

    // Sort each category by distance and limit to 5
    for (const key of Object.keys(result)) {
      result[key] = result[key].sort((a, b) => a.distance_km - b.distance_km).slice(0, 5);
    }

    return NextResponse.json({ ...result, fetched_at: new Date().toISOString() });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
