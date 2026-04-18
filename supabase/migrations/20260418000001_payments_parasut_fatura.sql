-- F-25d: Paraşüt fatura ID ve e-posta gönderim durumu payments tablosuna ekleniyor
ALTER TABLE payments
  ADD COLUMN IF NOT EXISTS parasut_fatura_id TEXT,
  ADD COLUMN IF NOT EXISTS fatura_email_gonderildi BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN payments.parasut_fatura_id IS 'Paraşüt sales_invoice ID — PDF indirme ve e-posta için kullanılır';
COMMENT ON COLUMN payments.fatura_email_gonderildi IS 'Fatura e-postası kullanıcıya gönderildi mi';
