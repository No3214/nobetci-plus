-- Supabase Schema Setup for Nöbetçi+ (PostgreSQL)

-- 1. Create Pharmacies Table
CREATE TABLE IF NOT EXISTS pharmacies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  district TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  source TEXT DEFAULT 'TİTCK',
  source_updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Reports Table
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pharmacy_id UUID REFERENCES pharmacies(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL, -- 'wrong_location', 'wrong_phone', 'closed', 'wrong_address', 'other'
  message TEXT,
  user_latitude DOUBLE PRECISION,
  user_longitude DOUBLE PRECISION,
  status TEXT DEFAULT 'open', -- 'open', 'resolved'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Performance Indices for Bounding-Box Geospatial Queries
-- These optimize latitude/longitude searches and city/district filters
CREATE INDEX IF NOT EXISTS idx_pharmacies_lat_lng ON pharmacies(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_pharmacies_city_district ON pharmacies(city, district);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);

-- 4. Sample Seed Data (İzmir / Foça Duty Pharmacies)
INSERT INTO pharmacies (name, city, district, address, phone, latitude, longitude, source)
VALUES 
('Kozbeyli Eczanesi', 'İzmir', 'Foça', 'Kozbeyli Köyü İç Yolu No: 12, Foça/İzmir', '02328224050', 38.6702, 26.7565, 'İzmir Eczacı Odası'),
('Foça Merkez Eczanesi', 'İzmir', 'Foça', 'Atatürk Mahallesi, Reha Midilli Caddesi No: 42, Foça/İzmir', '02328121020', 38.6675, 26.7512, 'İzmir Eczacı Odası'),
('Yeni Foça Şifa Eczanesi', 'İzmir', 'Foça', 'Fatih Mahallesi, Sadullah Sever Caddesi No: 88, Foça/İzmir', '02328146070', 38.6854, 26.7820, 'İzmir Eczacı Odası')
ON CONFLICT DO NOTHING;
