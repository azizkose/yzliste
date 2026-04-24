-- NF-03: api_cost kolonu — her üretimin gerçek API maliyeti (USD)
-- input_token + output_token kolonları DB'de var ama populate edilmiyordu
-- Bu migration api_cost ekliyor; route'lar artık bu 3 kolonu dolduracak

ALTER TABLE uretimler
  ADD COLUMN IF NOT EXISTS api_cost DECIMAL(10,6) DEFAULT 0;

COMMENT ON COLUMN uretimler.api_cost IS 'Üretimin gerçek API maliyeti (USD) — Anthropic token başına, FAL sabit fiyat';
