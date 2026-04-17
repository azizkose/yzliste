-- CB-02: chatbot mesaj feedback (thumbs up/down)
CREATE TABLE IF NOT EXISTS feedback (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id  text NOT NULL,
  rating      text NOT NULL CHECK (rating IN ('up', 'down')),
  comment     text,
  page_url    text,
  user_id     uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at  timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "feedback_insert_anyone" ON feedback
  FOR INSERT WITH CHECK (true);

CREATE POLICY "feedback_select_admin" ON feedback
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- CB-03: kullanici sikayet/oneri/bug formu
CREATE TABLE IF NOT EXISTS user_feedback (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  type       text NOT NULL CHECK (type IN ('bug', 'suggestion', 'complaint', 'other')),
  message    text NOT NULL,
  email      text,
  page_url   text,
  user_id    uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  status     text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'resolved'))
);

ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_feedback_insert_anyone" ON user_feedback
  FOR INSERT WITH CHECK (true);

CREATE POLICY "user_feedback_select_admin" ON user_feedback
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "user_feedback_update_admin" ON user_feedback
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );
