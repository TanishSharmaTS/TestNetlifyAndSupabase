-- ============================================================
--  La Farine Bakery — Supabase Schema
--  Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Bakery items table
CREATE TABLE IF NOT EXISTS public.bakery_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price       NUMERIC(10, 2) NOT NULL DEFAULT 0,
  category    TEXT NOT NULL DEFAULT 'Bread',
  image_url   TEXT,
  available   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Row Level Security
ALTER TABLE public.bakery_items ENABLE ROW LEVEL SECURITY;

-- Allow anyone (anon) to read available items (for the storefront)
CREATE POLICY "Public can read available items"
  ON public.bakery_items
  FOR SELECT
  USING (available = true);

-- Service role (used by our API) can do everything
-- (Service role bypasses RLS by default — no explicit policy needed)

-- 3. Storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('bakery-images', 'bakery-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read of images
CREATE POLICY "Public can view images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'bakery-images');

-- Allow service role to upload/delete (handled server-side via service key)
-- (Service role bypasses RLS — no extra policy needed)

-- 4. Seed some starter items (optional — delete if not needed)
INSERT INTO public.bakery_items (name, description, price, category, available) VALUES
  ('Country Sourdough',       'Slow-fermented 24-hour sourdough with a crackly crust and open crumb.',         180, 'Bread',    true),
  ('Almond Croissant',        'Buttery laminated dough filled with frangipane and topped with flaked almonds.', 120, 'Pastry',   true),
  ('Dark Chocolate Tart',     'Silky 70% Valrhona ganache in a crisp all-butter shortcrust shell.',             150, 'Pastry',   true),
  ('Whole Wheat Loaf',        'Nutty, dense loaf made with stone-ground whole wheat flour from Paro.',           140, 'Bread',    true),
  ('Hazelnut Opera Cake',     'Six alternating layers of joconde, coffee buttercream, and hazelnut ganache.',   220, 'Cake',     true),
  ('Butter Cookies (6 pcs)',  'Classic shortbread rounds dusted with icing sugar. Simple. Perfect.',             90, 'Cookie',   true),
  ('Seasonal Fruit Danish',   'Rotating seasonal fruit nestled in cream cheese on a laminated dough base.',     110, 'Seasonal', true),
  ('Cinnamon Knot',           'Cardamom-spiced enriched dough twisted with brown butter and cinnamon sugar.',    80, 'Pastry',   true);
