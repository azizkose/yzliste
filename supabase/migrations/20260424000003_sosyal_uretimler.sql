-- AI-09: sosyal medya üretimlerini kayıt altına al
CREATE TABLE IF NOT EXISTS sosyal_uretimler (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  urun_adi    TEXT NOT NULL,
  platform    TEXT NOT NULL,
  caption     TEXT,
  hashtag     TEXT,
  prompt_version TEXT NOT NULL DEFAULT 'sosyal-v1.1',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sosyal_uretimler_user_id_idx ON sosyal_uretimler(user_id);

ALTER TABLE sosyal_uretimler ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kullanıcı kendi verilerini görür"
  ON sosyal_uretimler FOR SELECT
  USING (auth.uid() = user_id);
