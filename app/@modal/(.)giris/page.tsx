'use client'

import { useRouter } from 'next/navigation'
import Modal from '@/components/modal/Modal'
import AuthForm from '@/components/auth/AuthForm'

export default function GirisModal() {
  const router = useRouter()

  return (
    <Modal title="Giriş Yap">
      <AuthForm
        defaultMode="giris"
        redirectTo="/"
        onSuccess={() => {
          router.back()
          setTimeout(() => router.replace('/'), 100)
        }}
      />
    </Modal>
  )
}
