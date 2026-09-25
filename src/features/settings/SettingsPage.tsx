import { useNavigate } from 'react-router'
import { useAuth } from '../../hooks/useAuth'

/** P05 설정 (F002, F003) */
export default function SettingsPage() {
  const navigate = useNavigate()
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <>
      <h1>설정</h1>
      <button type="button" onClick={handleSignOut}>
        로그아웃
      </button>
    </>
  )
}
