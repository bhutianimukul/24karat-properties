import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const BASE_URL = "https://24karat-properties.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all active property slugs
  const supabase = await createClient();
  const { data: properties } = await supabase
    .from("properties")
    .select("slug, updated_at")
    .eq("status", "active");

  const propertyUrls: MetadataRoute.Sitemap = (properties || []).map((p) => ({
    url: `${BASE_URL}/property/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/noida`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/dholera`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/testimonials`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
    { url: `${BASE_URL}/compare`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/list-property`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/tools/emi-calculator`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/tools/investment-calculator`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/tools/stamp-duty-calculator`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/tools/rental-yield-calculator`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/tools/affordability-calculator`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  return [...staticPages, ...propertyUrls];
}
