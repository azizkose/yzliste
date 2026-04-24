-- F-12d: Her üretim için 3 ücretsiz yeniden üret hakkı
ALTER TABLE uretimler
  ADD COLUMN IF NOT EXISTS regenerate_count INTEGER DEFAULT 0 NOT NULL;

COMMENT ON COLUMN uretimler.regenerate_count IS 'Bu üretim için kullanılan ücretsiz yeniden üret hakkı (max 3)';
