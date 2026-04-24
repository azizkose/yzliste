-- LS-01: Ücretsiz revize hakkının takibi
ALTER TABLE uretimler ADD COLUMN IF NOT EXISTS ucretsiz_revize_kullanildi boolean DEFAULT false;
