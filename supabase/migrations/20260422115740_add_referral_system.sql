-- REF-01: Referans Programı

-- 1. profiles tablosuna referral_code kolonu ekle
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;

-- 2. Mevcut kullanıcılar için referral_code otomatik oluştur
UPDATE profiles
  SET referral_code = lower(substr(md5(random()::text || id::text), 1, 8))
  WHERE referral_code IS NULL;

-- 3. Yeni kayıtlarda otomatik referral_code oluşturan fonksiyon ve trigger
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  code TEXT;
  attempts INT := 0;
BEGIN
  LOOP
    code := lower(substr(md5(random()::text || NEW.id::text || clock_timestamp()::text), 1, 8));
    IF NOT EXISTS (SELECT 1 FROM profiles WHERE referral_code = code) THEN
      NEW.referral_code := code;
      RETURN NEW;
    END IF;
    attempts := attempts + 1;
    IF attempts > 10 THEN RAISE EXCEPTION 'referral_code üretilemedi'; END IF;
  END LOOP;
END;
$$;

CREATE OR REPLACE TRIGGER trg_referral_code
  BEFORE INSERT ON profiles
  FOR EACH ROW
  WHEN (NEW.referral_code IS NULL)
  EXECUTE FUNCTION generate_referral_code();

-- 4. referrals tablosu
CREATE TABLE IF NOT EXISTS referrals (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  referred_id   UUID REFERENCES profiles(id) ON DELETE SET NULL,
  referral_code TEXT NOT NULL,
  referred_email TEXT,
  status        TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'registered', 'completed', 'expired')),
  reward_given  BOOLEAN NOT NULL DEFAULT FALSE,
  ip_address    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  registered_at TIMESTAMPTZ,
  completed_at  TIMESTAMPTZ,
  expires_at    TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '90 days')
);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals (referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred ON referrals (referred_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals (referral_code);

-- 5. RLS
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users see own referrals" ON referrals
  FOR SELECT USING (referrer_id = auth.uid() OR referred_id = auth.uid());

CREATE POLICY "service role full access" ON referrals
  FOR ALL USING (auth.role() = 'service_role');