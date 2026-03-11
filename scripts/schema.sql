-- 24 Karat Properties — Supabase Schema
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- ══════════════════════════════════════════
-- 1. TABLES
-- ══════════════════════════════════════════

CREATE TABLE cities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  state TEXT NOT NULL,
  description TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  meta JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE areas (
  id TEXT PRIMARY KEY,
  city_id TEXT NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  description TEXT,
  meta JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE properties (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  city_id TEXT NOT NULL REFERENCES cities(id),
  area_id TEXT NOT NULL REFERENCES areas(id),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  property_type TEXT NOT NULL CHECK (property_type IN ('flat','villa','plot','shop','office','warehouse')),
  transaction_type TEXT NOT NULL DEFAULT 'sell' CHECK (transaction_type IN ('sell','rent')),
  status TEXT NOT NULL DEFAULT 'hidden' CHECK (status IN ('draft','active','hidden','sold','rented')),
  price BIGINT NOT NULL,
  price_per_sqft INTEGER,
  area_sqft INTEGER NOT NULL,
  bedrooms INTEGER,
  bathrooms INTEGER,
  floor_number INTEGER,
  total_floors INTEGER,
  facing TEXT,
  year_built INTEGER,
  rera_id TEXT,
  is_featured BOOLEAN DEFAULT false,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  address TEXT NOT NULL,
  amenities TEXT[] DEFAULT '{}',
  ai_analysis JSONB,
  nearby_places JSONB,
  view_count INTEGER DEFAULT 0,
  inquiry_count INTEGER DEFAULT 0,
  possession_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_properties_city ON properties(city_id);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_slug ON properties(slug);
CREATE INDEX idx_properties_featured ON properties(is_featured) WHERE is_featured = true;

CREATE TABLE property_images (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  property_id TEXT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_images_property ON property_images(property_id);

CREATE TABLE customer_vouches (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  customer_name TEXT NOT NULL,
  customer_image TEXT,
  customer_location TEXT,
  property_name TEXT NOT NULL,
  property_type TEXT NOT NULL,
  property_city TEXT NOT NULL,
  property_area TEXT,
  purchase_date DATE NOT NULL,
  transaction_type TEXT NOT NULL,
  review TEXT NOT NULL,
  experience_rating INTEGER NOT NULL CHECK (experience_rating BETWEEN 1 AND 5),
  would_recommend BOOLEAN DEFAULT true,
  highlights TEXT[] DEFAULT '{}',
  video_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_vouches_active ON customer_vouches(is_active, sort_order);

CREATE TABLE city_videos (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  city_id TEXT NOT NULL REFERENCES cities(id),
  city_name TEXT NOT NULL,
  video_url TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE inquiries (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  property_id TEXT NOT NULL REFERENCES properties(id),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  message TEXT,
  source TEXT NOT NULL DEFAULT 'form' CHECK (source IN ('whatsapp','form','call')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ══════════════════════════════════════════
-- 2. AUTO-UPDATE updated_at TRIGGER
-- ══════════════════════════════════════════

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ══════════════════════════════════════════
-- 3. ROW LEVEL SECURITY
-- ══════════════════════════════════════════

ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_vouches ENABLE ROW LEVEL SECURITY;
ALTER TABLE city_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Cities & Areas: anyone can read
CREATE POLICY "cities_read" ON cities FOR SELECT USING (true);
CREATE POLICY "areas_read" ON areas FOR SELECT USING (true);

-- Properties: anon sees only active
CREATE POLICY "properties_read_active" ON properties FOR SELECT USING (status = 'active');

-- Images: viewable if parent property is active
CREATE POLICY "images_read" ON property_images FOR SELECT
  USING (EXISTS (SELECT 1 FROM properties WHERE properties.id = property_images.property_id AND properties.status = 'active'));

-- Vouches: only active
CREATE POLICY "vouches_read_active" ON customer_vouches FOR SELECT USING (is_active = true);

-- Videos: only active
CREATE POLICY "videos_read_active" ON city_videos FOR SELECT USING (is_active = true);

-- Inquiries: anyone can insert (contact form)
CREATE POLICY "inquiries_insert" ON inquiries FOR INSERT WITH CHECK (true);

-- ══════════════════════════════════════════
-- 4. STORAGE BUCKET (run separately if needed)
-- ══════════════════════════════════════════
-- Go to Supabase Dashboard > Storage > New Bucket
-- Name: property-images
-- Public: Yes
-- File size limit: 5MB
-- Allowed MIME: image/jpeg, image/png, image/webp
