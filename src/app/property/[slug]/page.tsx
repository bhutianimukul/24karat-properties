import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PropertyDetailClient } from "@/components/property/PropertyDetailClient";
import type { Property } from "@/types/property";

const BASE_URL = "https://24karat-properties.vercel.app";
const PROPERTY_SELECT = "*, city:cities(*), area:areas(*), images:property_images(*)";

const typeLabels: Record<string, string> = { flat: "Flat", villa: "Villa", plot: "Plot", shop: "Shop", office: "Office", warehouse: "Warehouse" };

function formatPrice(price: number) {
  if (price >= 10000000) return `${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `${(price / 100000).toFixed(1)} L`;
  return `${(price / 1000).toFixed(0)}K`;
}

async function getProperty(slug: string): Promise<Property | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select(PROPERTY_SELECT)
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data as Property;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = await getProperty(slug);

  if (!property) {
    return { title: "Property Not Found" };
  }

  const title = `${property.title} — ₹${formatPrice(property.price)}`;
  const description = property.description
    ? property.description.slice(0, 160)
    : `${typeLabels[property.property_type] || "Property"} in ${property.city?.name || property.city_id} — ${property.area_sqft.toLocaleString("en-IN")} sqft at ₹${formatPrice(property.price)}. ${property.bedrooms ? `${property.bedrooms} BHK, ` : ""}${property.address}.`;

  const primaryImage = property.images?.find((img) => img.is_primary) || property.images?.[0];
  const ogImage = primaryImage?.url || `${BASE_URL}/og-default.png`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/property/${property.slug}`,
      siteName: "24 Karat Properties",
      images: [{ url: ogImage, width: 1200, height: 630, alt: property.title }],
      type: "website",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: `${BASE_URL}/property/${property.slug}`,
    },
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = await getProperty(slug);

  if (!property) {
    notFound();
  }

  const primaryImage = property.images?.find((img) => img.is_primary) || property.images?.[0];

  // JSON-LD structured data for RealEstateListing
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description || `${typeLabels[property.property_type]} in ${property.address}`,
    url: `${BASE_URL}/property/${property.slug}`,
    datePosted: property.created_at,
    ...(primaryImage && { image: primaryImage.url }),
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: "INR",
      availability: property.status === "active" ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: property.address,
      addressLocality: property.city?.name || property.city_id,
      addressRegion: property.city?.state || "India",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: property.latitude,
      longitude: property.longitude,
    },
    ...(property.area_sqft && {
      floorSize: {
        "@type": "QuantitativeValue",
        value: property.area_sqft,
        unitCode: "FTK",
      },
    }),
    ...(property.bedrooms != null && { numberOfRooms: property.bedrooms }),
  };

  // BreadcrumbList JSON-LD
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: property.city?.name || property.city_id, item: `${BASE_URL}/${property.city_id}` },
      { "@type": "ListItem", position: 3, name: property.title },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <PropertyDetailClient property={property} />
    </>
  );
}
