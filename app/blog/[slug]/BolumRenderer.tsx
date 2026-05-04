import Link from "next/link"
import type { BlogBolum } from "../icerikler"

export function MetinLink({ text }: { text: string }) {
  type Token =
    | { type: "link"; label: string; href: string }
    | { type: "text"; value: string }
  const tokens: Token[] = []
  const regex = /\[([^\]]+)\]\(([^)]+)\)|(yzliste)/gi
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex)
      tokens.push({ type: "text", value: text.slice(lastIndex, match.index) })
    if (match[1])
      tokens.push({ type: "link", label: match[1], href: match[2] })
    else tokens.push({ type: "link", label: "yzliste", href: "/uret" })
    lastIndex = regex.lastIndex
  }
  if (lastIndex < text.length)
    tokens.push({ type: "text", value: text.slice(lastIndex) })

  return (
    <>
      {tokens.map((t, i) =>
        t.type === "link" ? (
          t.href.startsWith("http") ? (
            <a
              key={i}
              href={t.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-rd-primary-600 hover:text-rd-primary-700 underline underline-offset-2"
            >
              {t.label}
            </a>
          ) : (
            <Link
              key={i}
              href={t.href}
              className="text-rd-primary-600 hover:text-rd-primary-700 underline underline-offset-2"
            >
              {t.label}
            </Link>
          )
        ) : (
          t.value
        )
      )}
    </>
  )
}

export function Bolum({ bolum }: { bolum: BlogBolum }) {
  switch (bolum.tip) {
    case "giris":
      return (
        <p className="text-base text-rd-neutral-600 leading-relaxed font-medium border-l-4 border-rd-primary-300 pl-4 italic">
          <MetinLink text={bolum.metin ?? ""} />
        </p>
      )
    case "baslik":
      return (
        <div className="mt-8 pt-4 border-t border-rd-neutral-100">
          <h2
            className="text-xl font-medium text-rd-neutral-900 mb-3"
            style={{ fontFamily: "var(--font-rd-display)" }}
          >
            {bolum.baslik}
          </h2>
          {bolum.metin && (
            <p className="text-sm text-rd-neutral-600 leading-relaxed">
              <MetinLink text={bolum.metin} />
            </p>
          )}
        </div>
      )
    case "paragraf":
      return (
        <p className="text-sm text-rd-neutral-600 leading-relaxed">
          <MetinLink text={bolum.metin ?? ""} />
        </p>
      )
    case "liste":
      return (
        <ul className="space-y-2 my-2">
          {(bolum.maddeler ?? []).map((madde, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-rd-neutral-600">
              <span className="w-5 h-5 rounded-full bg-rd-primary-50 text-rd-primary-700 flex items-center justify-center text-[10px] font-medium flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <MetinLink text={madde} />
            </li>
          ))}
        </ul>
      )
    case "bilgi-kutusu":
      return (
        <div className="bg-rd-primary-50 border border-rd-primary-200 rounded-xl p-5 my-4">
          <p className="text-sm text-rd-primary-700 leading-relaxed">
            <MetinLink text={bolum.metin ?? ""} />
          </p>
        </div>
      )
    case "sonuc":
      return (
        <div className="bg-rd-neutral-100 border border-rd-neutral-200 rounded-xl p-5 my-4">
          <p className="text-xs font-medium text-rd-neutral-500 uppercase tracking-wide mb-2">
            Sonuç
          </p>
          <p className="text-sm text-rd-neutral-600 leading-relaxed">
            <MetinLink text={bolum.metin ?? ""} />
          </p>
        </div>
      )
    case "video-grid": {
      const maddeler = bolum.maddeler ?? []
      const gridClass =
        maddeler.length === 1
          ? "grid grid-cols-1 gap-3 my-6 max-w-sm"
          : "grid grid-cols-2 gap-3 my-6"
      return (
        <div className={gridClass}>
          {maddeler.map((madde, i) => {
            const [src, etiket] = madde.split("|")
            const trimmedSrc = src?.trim()
            const isVideo = trimmedSrc?.match(/\.(mp4|webm|mov)$/i)
            return (
              <div
                key={i}
                className="rounded-xl overflow-hidden border border-rd-neutral-200 bg-rd-neutral-100"
              >
                {isVideo ? (
                  <video
                    src={trimmedSrc}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full aspect-video object-cover"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={trimmedSrc}
                    alt={etiket?.trim() ?? ""}
                    className="w-full aspect-video object-cover"
                  />
                )}
                {etiket && (
                  <p className="text-xs text-center text-rd-neutral-500 py-1.5">
                    {etiket.trim()}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )
    }
    default:
      return null
  }
}
