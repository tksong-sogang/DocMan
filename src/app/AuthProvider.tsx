import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { AuthContext, type AuthState } from '../hooks/useAuth'
import { authService } from '../services'

export default function AuthProvider({ children }: { children: ReactNode }) {
  // 새로고침했는데 토큰이 이미 만료됐으면 로그인 전 상태로 시작한다
  const [user, setUser] = useState(() => (authService.getAccessToken() ? authService.getUser() : null))
  const [expired, setExpired] = useState(false)

  // API 호출 중 토큰이 만료되면 로그아웃 상태로 바꾼다 → RequireAuth가 P01로 보낸다
  useEffect(() => {
    authService.onExpired(() => {
      setUser(null)
      setExpired(true)
    })
  }, [])

  const value = useMemo<AuthState>(
    () => ({
      user,
      expired,
      async signIn() {
        setUser(await authService.signIn())
        setExpired(false)
      },
      async signOut() {
        await authService.signOut()
        setUser(null)
      },
    }),
    [user, expired],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
