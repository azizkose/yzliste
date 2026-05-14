-- GORSEL-V2-A: görsel üretim kayıt tablosu + V2 analytics sütunları
-- gorsel_uretim tablosu daha önce yoktu — sıfırdan oluşturuluyor

CREATE TABLE IF NOT EXISTS gorsel_uretim (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  request_id                  TEXT NOT NULL,
  stil                        TEXT,
  label                       TEXT,
  -- V2 alanları
  kategori                    TEXT CHECK (kategori IN ('giyim', 'ayakkabi_canta', 'kozmetik', 'taki_aksesuar', 'genel')),
  model_kullanilan            TEXT,
  prompt_version              TEXT DEFAULT 'gorsel-v1.0',
  pipeline_version            TEXT DEFAULT 'v1' CHECK (pipeline_version IN ('v1', 'v2')),
  vision_classified_kategori  TEXT,
  user_kategori_overridden    BOOLEAN DEFAULT false,
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gorsel_uretim_user_id   ON gorsel_uretim(user_id);
CREATE INDEX IF NOT EXISTS idx_gorsel_uretim_kategori  ON gorsel_uretim(kategori);
CREATE INDEX IF NOT EXISTS idx_gorsel_uretim_pipeline  ON gorsel_uretim(pipeline_version);
CREATE INDEX IF NOT EXISTS idx_gorsel_uretim_created   ON gorsel_uretim(created_at DESC);

ALTER TABLE gorsel_uretim ENABLE ROW LEVEL SECURITY;

-- Kullanıcı kendi kayıtlarını görebilir
CREATE POLICY "kullanici_gorsel_uretim_select"
  ON gorsel_uretim FOR SELECT
  USING (auth.uid() = user_id);
