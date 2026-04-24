import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ayarlar | yzliste',
  robots: { index: false, follow: false },
}

export default function AyarlarLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
