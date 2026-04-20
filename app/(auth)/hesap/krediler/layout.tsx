import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Krediler',
  robots: { index: false, follow: false },
}

export default function KredilerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
