-- TEST-INFRA-01: is_test flag for test accounts
-- Filters from payment reporting, bypasses credit deduction

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS is_test BOOLEAN NOT NULL DEFAULT FALSE;

-- Mark the 3 test accounts
UPDATE profiles
SET is_test = TRUE
WHERE email IN (
  'test-normal@yzliste.com',
  'test-zero@yzliste.com',
  'test-new@yzliste.com'
);
