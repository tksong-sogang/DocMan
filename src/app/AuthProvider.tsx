import { useMemo, useState, type ReactNode } from 'react'
import { AuthContext, type AuthState } from '../hooks/useAuth'
import { authService } from '../services'

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(() => authService.getUser())

  const value = useMemo<AuthState>(
    () => ({
      user,
      async signIn() {
        setUser(await authService.signIn())
      },
      async signOut() {
        await authService.signOut()
        setUser(null)
      },
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
