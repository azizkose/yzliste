-- MP-01: Mağaza profili genişletme
alter table profiles
  add column if not exists magaza_kategorileri text[],
  add column if not exists fiyat_bandi text,
  add column if not exists teslimat_vurgulari text[],
  add column if not exists benchmark_magaza text;
