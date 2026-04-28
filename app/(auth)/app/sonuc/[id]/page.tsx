import { Metadata } from 'next'
import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { CheckCircle2, ChevronLeft, Sparkles, History } from 'lucide-react'
import CopyButton from '@/components/ui/CopyButton'
import DownloadButton from '@/components/sonuc/DownloadButton'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  return {
    title: { absolute: `Üretim #${id.slice(0, 8)} | yzliste` },
    description: 'yzliste ile üretilen içerik. İçerik kopyalanabilir, indirilebilir, yeniden üretilebilir.',
  }
}

type GenerationRow = {
  output: string | null
  sonuc: string | null
  platform: string | null
  content_type: string | null
  giris_tipi: string | null
  created_at: string
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

  const row = uretim as unknown as GenerationRow
  const content = row.output ?? row.sonuc ?? null
  const platform = row.platform ?? '—'
  const contentType = row.content_type ?? row.giris_tipi ?? null

  let formattedDate = 'Tarih bilinmiyor'
  try {
    formattedDate = new Date(row.created_at).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {}

  return (
    <main aria-labelledby="sonuc-h1" className="min-h-screen bg-rd-neutral-50 px-4 py-10">
      <div className="max-w-3xl mx-auto">

        {/* Back link */}
        <Link
          href="/uret"
          className="inline-flex items-center gap-1 text-sm text-rd-neutral-500 hover:text-rd-neutral-700 transition-colors mb-8"
        >
          <ChevronLeft size={16} aria-hidden="true" />
          Üretime dön
        </Link>

        {/* Page header */}
        <div className="mb-6">
          <div className="flex items-center gap-1.5 mb-3">
            <CheckCircle2 size={14} className="text-rd-success-700" aria-hidden="true" />
            <span className="text-xs uppercase tracking-wider text-rd-success-700 font-medium">
              Üretim hazır
            </span>
          </div>
          <h1
            id="sonuc-h1"
            className="text-3xl md:text-4xl font-bold text-rd-neutral-900"
            style={{ fontFamily: 'var(--font-rd-display)', letterSpacing: '-0.01em' }}
          >
            İçerik üretildi
          </h1>
          <p className="mt-2 text-sm md:text-base text-rd-neutral-600 flex flex-wrap items-center">
            <span>{platform}</span>
            {contentType && (
              <>
                <span className="text-rd-neutral-300 mx-1.5">·</span>
                <span>{contentType}</span>
              </>
            )}
            <span className="text-rd-neutral-300 mx-1.5">·</span>
            <span>{formattedDate}</span>
          </p>
        </div>

        {/* Content output */}
        <div className="bg-rd-neutral-100 border border-rd-neutral-200 rounded-xl p-4 md:p-6">
          <h2 className="sr-only">Üretilen içerik</h2>
          <p className="text-xs uppercase tracking-wider text-rd-neutral-500 mb-3 font-medium" aria-hidden="true">
            Üretilen içerik
          </p>
          {content ? (
            <pre className="whitespace-pre-wrap text-sm md:text-base text-rd-neutral-800 font-sans leading-relaxed">
              {content}
            </pre>
          ) : (
            <div className="py-8 text-center">
              <p className="text-rd-neutral-500 text-sm">İçerik bulunamadı.</p>
              <Link
                href="/uret"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-rd-primary-700 hover:underline"
              >
                Yeni üretim yap
              </Link>
            </div>
          )}
        </div>

        {/* Action bar */}
        {content && (
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <CopyButton text={content} aria-label="İçeriği kopyala" />
            <DownloadButton text={content} id={id} />
          </div>
        )}

        {/* Next steps */}
        <div className="border-t border-rd-neutral-200 pt-8 mt-12">
          <p className="text-rd-neutral-700 text-sm font-medium mb-4">Sıradaki adım</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Primary: Yeni üretim */}
            <Link
              href="/uret"
              className="block bg-rd-primary-50 border border-rd-primary-200 rounded-xl p-5 hover:-translate-y-0.5 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary-500 focus-visible:ring-offset-2"
            >
              <Sparkles size={20} className="text-rd-primary-700 mb-3" aria-hidden="true" />
              <h3
                className="font-medium text-rd-neutral-900"
                style={{ fontFamily: 'var(--font-rd-display)' }}
              >
                Yeni üretim yap
              </h3>
              <p className="mt-1 text-rd-neutral-600 text-sm">
                Aynı veya farklı pazaryeri için tekrar üret
              </p>
              <span className="mt-3 inline-flex items-center justify-center rounded-lg bg-rd-primary-700 px-4 py-2 text-sm font-medium text-white">
                Üretim sayfasına git
              </span>
            </Link>

            {/* Ghost: Geçmiş */}
            <Link
              href="/hesap/uretimler"
              className="block bg-rd-neutral-50 border border-rd-neutral-200 rounded-xl p-5 hover:-translate-y-0.5 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rd-primary-500 focus-visible:ring-offset-2"
            >
              <History size={20} className="text-rd-neutral-600 mb-3" aria-hidden="true" />
              <h3
                className="font-medium text-rd-neutral-900"
                style={{ fontFamily: 'var(--font-rd-display)' }}
              >
                Tüm üretimlerin
              </h3>
              <p className="mt-1 text-rd-neutral-600 text-sm">
                Geçmiş üretimleri filtrele, tekrar üret veya indir
              </p>
              <span className="mt-3 inline-flex items-center justify-center rounded-lg border border-rd-neutral-300 px-4 py-2 text-sm font-medium text-rd-neutral-700">
                Geçmişe git
              </span>
            </Link>

          </div>
        </div>

      </div>
    </main>
  )
}
