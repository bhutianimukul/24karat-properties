export type PropertyType = "flat" | "villa" | "plot" | "shop" | "office" | "warehouse";
export type TransactionType = "sell" | "rent";
export type PropertyStatus = "draft" | "active" | "hidden" | "sold" | "rented";

export interface Property {
  id: string;
  city_id: string;
  area_id: string;
  title: string;
  slug: string;
  description: string | null;
  property_type: PropertyType;
  transaction_type: TransactionType;
  status: PropertyStatus;
  price: number;
  price_per_sqft: number | null;
  area_sqft: number;
  bedrooms: number | null;
  bathrooms: number | null;
  floor_number: number | null;
  total_floors: number | null;
  facing: string | null;
  year_built: number | null;
  rera_id: string | null;
  is_featured: boolean;
  latitude: number;
  longitude: number;
  address: string;
  amenities: string[];
  ai_analysis: AIAnalysis | null;
  nearby_places: NearbyPlaces | null;
  view_count: number;
  inquiry_count: number;
  possession_date: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  city?: City;
  area?: Area;
  images?: PropertyImage[];
}

export interface PropertyImage {
  id: string;
  property_id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface City {
  id: string;
  name: string;
  slug: string;
  state: string;
  description: string | null;
  latitude: number;
  longitude: number;
  meta: Record<string, unknown> | null;
  created_at: string;
}

export interface Area {
  id: string;
  city_id: string;
  name: string;
  slug: string;
  latitude: number;
  longitude: number;
  description: string | null;
  meta: Record<string, unknown> | null;
  created_at: string;
}

export interface AIAnalysis {
  pros: string[];
  cons: string[];
  investment_score: number;
  investment_reasoning: string;
  area_outlook: string;
  best_for: string;
  analyzed_at: string;
}

export interface NearbyPlaces {
  schools: NearbyPlace[];
  hospitals: NearbyPlace[];
  transit: NearbyPlace[];
  shopping: NearbyPlace[];
  parks: NearbyPlace[];
  fetched_at: string;
}

export interface NearbyPlace {
  name: string;
  type: string;
  distance_km: number;
  latitude: number;
  longitude: number;
}

export interface Inquiry {
  id: string;
  property_id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  source: "whatsapp" | "form" | "call";
  created_at: string;
}

export interface CustomerVouch {
  id: string;
  customer_name: string;
  customer_image: string | null;
  customer_location: string | null;
  property_name: string;
  property_type: PropertyType;
  property_city: string;
  property_area: string | null;
  purchase_date: string;
  transaction_type: TransactionType;
  review: string;
  experience_rating: number; // 1-5
  would_recommend: boolean;
  highlights: string[]; // e.g. ["Smooth process", "Great negotiation", "Transparent"]
  video_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  cover_image: string | null;
  city_id: string | null;
  category: "market-insights" | "buying-guide" | "area-guide" | "investment-tips";
  seo_meta: { title: string; description: string; keywords: string[] } | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PriceTrend {
  id: string;
  city_id: string;
  area_id: string | null;
  property_type: PropertyType;
  avg_price_per_sqft: number;
  month: number;
  year: number;
  created_at: string;
}
