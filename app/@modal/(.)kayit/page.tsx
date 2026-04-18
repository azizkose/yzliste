'use client'

import { useRouter } from 'next/navigation'
import Modal from '@/components/modal/Modal'
import AuthForm from '@/components/auth/AuthForm'

export default function KayitModal() {
  const router = useRouter()

  return (
    <Modal title="Ücretsiz Hesap Oluştur">
      <div className="mb-4">
        <p className="text-sm text-gray-500">3 ücretsiz kredi · Kredi kartı gerekmez</p>
      </div>
      <AuthForm
        defaultMode="kayit"
        redirectTo="/"
        onSuccess={() => {
          router.back()
          setTimeout(() => router.replace('/'), 100)
        }}
      />
    </Modal>
  )
}
