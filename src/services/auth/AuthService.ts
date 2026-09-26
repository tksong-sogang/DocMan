import type { AuthUser } from '../../types'

/** Google 로그인 (F001, F002). 권한 범위: drive.file */
export interface AuthService {
  signIn(): Promise<AuthUser>
  signOut(): Promise<void>
  /** 만료되었거나 로그인 전이면 null */
  getAccessToken(): string | null
  getUser(): AuthUser | null
  /** 토큰이 만료되어 다시 로그인해야 할 때 불린다 */
  onExpired(handler: () => void): void
  /** API 호출이 만료된 토큰 때문에 실패했을 때 서비스가 부른다 */
  markExpired(): void
}
