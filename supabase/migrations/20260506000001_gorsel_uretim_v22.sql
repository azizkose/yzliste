-- GORSEL-V2.2: schema güncellemeleri + gorseller storage bucket

-- 1. pipeline_version kısıtını genişlet (v2.1, v2.1.1, v2.2 vb. için)
DO $$
BEGIN
  ALTER TABLE gorsel_uretim DROP CONSTRAINT gorsel_uretim_pipeline_version_check;
EXCEPTION WHEN undefined_object THEN NULL;
END $$;

ALTER TABLE gorsel_uretim
  ADD CONSTRAINT gorsel_uretim_pipeline_version_check
  CHECK (pipeline_version ~ '^v[0-9]+(\.[0-9.]+)*$');

-- 2. output_url sütunu: composite pipeline çıktı URL'si
ALTER TABLE gorsel_uretim
  ADD COLUMN IF NOT EXISTS output_url TEXT;

-- 3. api_cost sütunu: görsel başına maliyet takibi
ALTER TABLE gorsel_uretim
  ADD COLUMN IF NOT EXISTS api_cost DECIMAL(10, 5);

-- 4. gorseller storage bucket (composite output'ları için)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gorseller',
  'gorseller',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- 5. Storage policy: service key ile upload (sadece server-side)
CREATE POLICY "service_upload_gorseller"
  ON storage.objects FOR INSERT
  TO service_role
  WITH CHECK (bucket_id = 'gorseller');

-- 6. Storage policy: herkes okuyabilir (public bucket)
CREATE POLICY "public_read_gorseller"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'gorseller');
