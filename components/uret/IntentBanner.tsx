// components/uret/IntentBanner.tsx

export default function IntentBanner() {
  return (
    <div
      className="bg-white border border-rd-neutral-200 rounded-2xl p-6 mb-6"
      aria-labelledby="intent-banner-heading"
    >
      <p className="text-xs font-medium text-rd-primary-700 uppercase tracking-wider">
        Adım 1 / 3 — Ne üretmek istiyorsun?
      </p>
      <h1
        id="intent-banner-heading"
        className="mt-2 text-2xl font-bold text-rd-neutral-900 md:text-3xl"
        style={{ fontFamily: 'var(--font-rd-display)', letterSpacing: '-0.01em', lineHeight: '1.3' }}
      >
        İçerik türünü seç
      </h1>
      <p className="mt-2 text-sm text-rd-neutral-600 leading-relaxed md:text-base">
        Her tür için ayrı bir form var. Aynı ürün için birkaçını üst üste de üretebilirsin.
      </p>
    </div>
  )
}
