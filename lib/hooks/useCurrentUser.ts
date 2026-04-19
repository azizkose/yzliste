import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

type CurrentUser = {
  id: string
  email: string | null
  kredi: number
  toplam_kullanilan: number
  is_admin: boolean
  anonim: boolean
  ton: string | null
  marka_adi: string | null
}

async function fetchCurrentUser(): Promise<CurrentUser | null> {
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError) {
    // Geçersiz/süresi dolmuş session cookie — temizle
    await supabase.auth.signOut()
    return null
  }
  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('kredi, toplam_kullanilan, is_admin, ton, marka_adi')
    .eq('id', user.id)
    .single()

  if (error) throw error

  return {
    id: user.id,
    email: user.email ?? null,
    kredi: data?.kredi ?? 0,
    toplam_kullanilan: data?.toplam_kullanilan ?? 0,
    is_admin: data?.is_admin ?? false,
    anonim: user.is_anonymous ?? false,
    ton: data?.ton ?? null,
    marka_adi: data?.marka_adi ?? null,
  }
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: fetchCurrentUser,
    staleTime: 60 * 1000, // 60 saniye
  })
}
