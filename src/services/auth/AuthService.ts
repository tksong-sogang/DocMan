import type { AuthUser } from '../../types'

/** Google 로그인 (F001, F002). 권한 범위: drive.file */
export interface AuthService {
  signIn(): Promise<AuthUser>
  signOut(): Promise<void>
  /** 만료되었거나 로그인 전이면 null */
  getAccessToken(): string | null
  getUser(): AuthUser | null
}
