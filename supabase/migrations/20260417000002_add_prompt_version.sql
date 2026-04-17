-- PQ-15: prompt_version kolonu — hangi prompt versiyonuyla üretildiğini kayıt altına alır
ALTER TABLE uretimler
  ADD COLUMN IF NOT EXISTS prompt_version TEXT DEFAULT 'metin-v1.0';

COMMENT ON COLUMN uretimler.prompt_version IS 'Üretimde kullanılan prompt versiyonu (lib/prompts/ dosya adı + sürüm)';
