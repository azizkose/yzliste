-- F-09c: profiles tablosuna soft delete sütunu ekle
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- Silinen hesapları filtreleyen index
CREATE INDEX IF NOT EXISTS idx_profiles_deleted_at
  ON profiles (deleted_at)
  WHERE deleted_at IS NOT NULL;

-- F-09d: KVKK denetim için silme talebi log tablosu
CREATE TABLE IF NOT EXISTS deletion_log (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL,
  email        TEXT,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_address   TEXT,
  user_agent   TEXT,
  purged_at    TIMESTAMPTZ DEFAULT NULL  -- 30 gün sonra cron doldurur
);

-- RLS: sadece service role okuyabilir (denetim kaydı)
ALTER TABLE deletion_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only" ON deletion_log
  USING (false)
  WITH CHECK (false);
