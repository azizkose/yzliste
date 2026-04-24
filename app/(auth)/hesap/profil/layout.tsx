import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Profil | yzliste',
  description: 'Kişisel bilgiler, fatura ayarları ve marka profili',
  robots: { index: false, follow: false },
}

export default function ProfilLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
