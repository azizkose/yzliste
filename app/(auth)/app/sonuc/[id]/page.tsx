import { Metadata } from 'next'
import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import CopyButton from '@/components/ui/CopyButton'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  return {
    title: `Üretim Sonucu #${id.slice(0, 8)} — yzliste`,
    description: 'yzliste ile üretilen içerik sonucu.',
  }
}

export default async function SonucPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createSupabaseServerClient()

  const { data: uretim, error } = await supabase
    .from('generations')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !uretim) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">← Geri</Link>
          <span className="text-gray-300">|</span>
          <span className="text-sm text-gray-500">Üretim #{id.slice(0, 8)}</span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs bg-orange-100 text-orange-700 font-semibold px-2 py-1 rounded-full uppercase">
                {uretim.platform}
              </span>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(uretim.created_at).toLocaleDateString('tr-TR', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed bg-gray-50 p-4 rounded-xl">
              {uretim.output ?? uretim.sonuc}
            </pre>
          </div>

          <div className="mt-6 flex gap-3">
            <CopyButton text={uretim.output ?? uretim.sonuc ?? ''} />
            <Link
              href="/"
              className="text-sm bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl transition-colors font-medium"
            >
              Yeni Üretim →
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
