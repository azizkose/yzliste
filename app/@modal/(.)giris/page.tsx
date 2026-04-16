import Modal from '@/components/modal/Modal'
import AuthForm from '@/components/auth/AuthForm'

export default function GirisModal() {
  return (
    <Modal title="Giriş Yap">
      <AuthForm defaultMode="giris" redirectTo="/" />
    </Modal>
  )
}
