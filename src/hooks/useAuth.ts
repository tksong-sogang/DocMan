import { createContext, useContext } from 'react'
import type { AuthUser } from '../types'

export interface AuthState {
  user: AuthUser | null
  signIn(): Promise<void>
  signOut(): Promise<void>
}

export const AuthContext = createContext<AuthState | null>(null)

/** 로그인 상태와 로그인·로그아웃 (F001, F002). AuthProvider 안에서만 쓴다 */
export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth는 AuthProvider 안에서 써야 합니다')
  return ctx
}
