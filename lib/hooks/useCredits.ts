import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

async function fetchCredits(): Promise<number | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('kredi')
    .eq('id', user.id)
    .single()

  if (error) throw error
  return data?.kredi ?? 0
}

export function useCredits() {
  return useQuery({
    queryKey: ['credits'],
    queryFn: fetchCredits,
    staleTime: 10 * 1000, // 10 saniye
  })
}

export function useInvalidateCredits() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: ['credits'] })
}
