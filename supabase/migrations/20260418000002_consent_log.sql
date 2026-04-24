-- KÜME 5 DoD: Checkout sözleşme onaylarını DB'ye kaydet
-- KVKK/hukuki denetim için timestamp + IP ile consent kaydı

CREATE TABLE IF NOT EXISTS consent_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  odeme_id UUID,                          -- payments.id ile ilişki (referans, FK değil — ödeme henüz oluşmamış olabilir)
  kosullar_onay BOOLEAN NOT NULL DEFAULT FALSE,
  mesafeli_onay BOOLEAN NOT NULL DEFAULT FALSE,
  kvkk_onay BOOLEAN NOT NULL DEFAULT FALSE,
  ip_adresi TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS: insert herkes (anonim de dahil), read sadece admin
ALTER TABLE consent_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "consent_log_insert" ON consent_log
  FOR INSERT WITH CHECK (true);

CREATE POLICY "consent_log_read_admin" ON consent_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

COMMENT ON TABLE consent_log IS 'KVKK onay logları — checkout sırasında 3 checkbox durumu, IP ve timestamp ile kaydedilir.';
