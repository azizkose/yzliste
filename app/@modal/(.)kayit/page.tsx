'use client'

import { useRouter } from 'next/navigation'
import Modal from '@/components/modal/Modal'
import AuthForm from '@/components/auth/AuthForm'

export default function KayitModal() {
  const router = useRouter()

  return (
    <Modal title="Hesabını oluştur">
      <p className="text-sm text-rd-neutral-500 mb-5">
        3 ücretsiz kredi · Kredi kartı gerekmez
      </p>
      <AuthForm
        defaultMode="kayit"
        redirectTo="/uret"
        onSuccess={() => {
          router.back()
          setTimeout(() => router.replace('/uret'), 100)
        }}
      />
    </Modal>
  )
}
