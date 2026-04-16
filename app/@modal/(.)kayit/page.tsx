import Modal from '@/components/modal/Modal'
import AuthForm from '@/components/auth/AuthForm'

export default function KayitModal() {
  return (
    <Modal title="Ücretsiz Hesap Oluştur">
      <div className="mb-4">
        <p className="text-sm text-gray-500">3 ücretsiz kredi · Kredi kartı gerekmez</p>
      </div>
      <AuthForm defaultMode="kayit" redirectTo="/" />
    </Modal>
  )
}
