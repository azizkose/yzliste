-- HOTFIX-01: profiles.ek_notlar kolonu eksik — /api/uret query'si bu kolonu seçiyor
-- ama kolona ilişkin migration yoktu, sorgu hata verip profili null döndürüyordu.
alter table profiles
  add column if not exists ek_notlar text;
