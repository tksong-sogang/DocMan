import { useState } from 'react'
import { useNavigate } from 'react-router'
import Button from '../../components/Button'
import ErrorMessage from '../../components/ErrorMessage'
import Spinner from '../../components/Spinner'
import { useAuth } from '../../hooks/useAuth'
import { driveService } from '../../services'

/** P01 로그인 (F001, F004) */
export default function LoginPage() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [status, setStatus] = useState<'idle' | 'signing-in' | 'initializing'>('idle')
  const [error, setError] = useState<string | null>(null)

  const handleSignIn = async () => {
    setError(null)
    try {
      setStatus('signing-in')
      await signIn()
      setStatus('initializing')
      await driveService.initialize()
      navigate('/', { replace: true })
    } catch (e) {
      setStatus('idle')
      setError(e instanceof Error ? e.message : '로그인하지 못했습니다')
    }
  }

  return (
    <main className="login-page">
      <h1>DocMan</h1>
      <p className="muted">문서와 사진을 분석해서 Google Drive에 정리합니다</p>
      {status === 'idle' ? (
        <Button variant="primary" onClick={handleSignIn}>
          Google로 로그인
        </Button>
      ) : (
        <Spinner label={status === 'signing-in' ? '로그인 중…' : 'DocMan 폴더를 준비하는 중…'} />
      )}
      {error && <ErrorMessage message={error} />}
    </main>
  )
}
