import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ödeme hatası | yzliste',
  robots: { index: false, follow: false },
}

export default function OdemeHataLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
