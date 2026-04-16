import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export const metadata: Metadata = {
  title: 'Profil — yzliste',
  robots: { index: false, follow: false },
}

// Mevcut /profil sayfasını yeniden export ediyoruz
// İleride içerik buraya taşınacak
export default async function HesapProfilPage() {
  redirect('/profil')
}
