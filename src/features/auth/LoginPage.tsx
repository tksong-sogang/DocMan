import { useNavigate } from 'react-router'
import { useAuth } from '../../hooks/useAuth'

/** P01 로그인 (F001, F004) */
export default function LoginPage() {
  const navigate = useNavigate()
  const { signIn } = useAuth()

  const handleSignIn = async () => {
    await signIn()
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
