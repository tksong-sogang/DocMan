import { useNavigate } from 'react-router'
import { setSignedIn } from '../../app/tempAuth'

/** P01 로그인 (F001, F004) */
export default function LoginPage() {
  const navigate = useNavigate()

  // Phase 1 임시: 버튼을 누르면 로그인된 것으로 처리
  const handleSignIn = () => {
    setSignedIn(true)
    navigate('/', { replace: true })
  }

  return (
    <main className="login-page">
      <h1>DocMan</h1>
      <button type="button" onClick={handleSignIn}>
        Google로 로그인
      </button>
    </main>
  )
}
