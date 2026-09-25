import { useNavigate } from 'react-router'
import { setSignedIn } from '../../app/tempAuth'

/** P05 설정 (F002, F003) */
export default function SettingsPage() {
  const navigate = useNavigate()

  // Phase 1 임시 로그아웃
  const handleSignOut = () => {
    setSignedIn(false)
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
