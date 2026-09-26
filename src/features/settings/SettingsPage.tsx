import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import Button from '../../components/Button'
import { useAuth } from '../../hooks/useAuth'
import { useSettings } from '../../hooks/useSettings'

/** P05 설정 (F002, F003) */
export default function SettingsPage() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { geminiApiKey, saveGeminiApiKey, clearGeminiApiKey } = useSettings()
  const [draft, setDraft] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  const handleSave = (e: FormEvent) => {
    e.preventDefault()
    if (!draft.trim()) return
    saveGeminiApiKey(draft)
    setDraft('')
    setMessage('API 키를 저장했습니다')
  }

  const handleClear = () => {
    clearGeminiApiKey()
    setMessage('API 키를 삭제했습니다')
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <>
      <h1>설정</h1>

      <section className="card">
        <h2>Gemini API 키</h2>
        <p className="muted">
          {geminiApiKey ? '저장된 키가 있습니다.' : '저장된 키가 없습니다.'} 키는 이 브라우저에만 저장됩니다.
        </p>
        <form className="search-bar" onSubmit={handleSave}>
          <input
            type="password"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={geminiApiKey ? '새 키로 바꾸려면 입력' : 'API 키 입력'}
            aria-label="Gemini API 키"
            autoComplete="off"
          />
          <Button type="submit" variant="primary" disabled={!draft.trim()}>
            저장
          </Button>
          <Button onClick={handleClear} disabled={!geminiApiKey}>
            삭제
          </Button>
        </form>
        {message && <p className="notice">{message}</p>}
      </section>

      <section className="card">
        <h2>Google 계정</h2>
        <p>
          {user?.name} <span className="muted">({user?.email})</span>
        </p>
        <Button onClick={handleSignOut}>로그아웃</Button>
      </section>
    </>
  )
}
