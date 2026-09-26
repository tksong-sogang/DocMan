import type { AuthUser } from '../../types'
import type { AuthService } from '../auth/AuthService'
import { delay } from './delay'

const KEY = 'docman.mockUser'
const MOCK_USER: AuthUser = { email: 'user@example.com', name: '테스트 사용자' }

function readUser(): AuthUser | null {
  try {
    const raw = sessionStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

/** 더미 로그인. 새로고침해도 유지되도록 sessionStorage에 기억한다 */
export class MockAuthService implements AuthService {
  private user: AuthUser | null = readUser()

  async signIn() {
    await delay(300)
    this.user = MOCK_USER
    try {
      sessionStorage.setItem(KEY, JSON.stringify(MOCK_USER))
    } catch {
      // 저장소를 쓸 수 없으면 메모리에만 유지
    }
    return MOCK_USER
  }

  async signOut() {
    this.user = null
    try {
      sessionStorage.removeItem(KEY)
    } catch {
      // 무시
    }
  }

  getAccessToken() {
    return this.user ? 'mock-token' : null
  }

  getUser() {
    return this.user
  }

  onExpired() {
    // 더미 토큰은 만료되지 않는다
  }

  markExpired() {
    // 더미 토큰은 만료되지 않는다
  }
}
