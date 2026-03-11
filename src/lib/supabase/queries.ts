import { createClient } from "./client";
import type { Property, CustomerVouch } from "@/types/property";
import type { CityVideo } from "@/lib/sample-videos";

// Shared select string for properties with joins
const PROPERTY_SELECT = "*, city:cities(*), area:areas(*), images:property_images(*)";

function supabase() {
  return createClient();
}

// ── Properties ──────────────────────────────

export async function getProperties(citySlug?: string) {
  let query = supabase()
    .from("properties")
    .select(PROPERTY_SELECT)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (citySlug) {
    query = query.eq("city_id", citySlug);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as Property[];
}

export async function getFeaturedProperties() {
  const { data, error } = await supabase()
    .from("properties")
    .select(PROPERTY_SELECT)
    .eq("is_featured", true)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as Property[];
}

export async function getPropertyBySlug(slug: string) {
  const { data, error } = await supabase()
    .from("properties")
    .select(PROPERTY_SELECT)
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data as Property;
}

export async function getAllProperties() {
  const { data, error } = await supabase()
    .from("properties")
    .select(PROPERTY_SELECT)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as Property[];
}

// ── Vouches / Testimonials ──────────────────

export async function getActiveVouches() {
  const { data, error } = await supabase()
    .from("customer_vouches")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data || []) as CustomerVouch[];
}

// ── Hot Locations ───────────────────────────

export async function getHotLocations(cityId: string): Promise<{ name: string; tag: string }[]> {
  const { data, error } = await supabase()
    .from("cities")
    .select("meta")
    .eq("id", cityId)
    .single();

  if (error || !data?.meta) return [];
  return (data.meta as { hot_locations?: { name: string; tag: string }[] }).hot_locations || [];
}

// ── City Videos ─────────────────────────────

export async function getActiveVideoForCity(cityId: string) {
  const { data, error } = await supabase()
    .from("city_videos")
    .select("*")
    .eq("city_id", cityId)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .limit(1)
    .single();

  if (error) return null;
  return data as CityVideo;
}
