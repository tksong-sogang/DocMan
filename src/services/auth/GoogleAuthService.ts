import type { AuthUser } from '../../types'
import type { AuthService } from './AuthService'

const SCOPE = 'https://www.googleapis.com/auth/drive.file'
const KEY = 'docman.session'
/** 다시 로그인할 때 계정 선택 화면을 건너뛰도록 마지막 계정 이메일을 기억한다 */
const HINT_KEY = 'docman.lastEmail'
/** 만료 1분 전부터 만료로 본다 */
const EXPIRY_MARGIN_MS = 60_000

interface Session {
  accessToken: string
  expiresAt: number
  user: AuthUser
}

// 창을 닫았다 열어도 토큰이 유효한 동안(약 1시간)은 다시 로그인하지 않도록 localStorage에 둔다
function readSession(): Session | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Session) : null
  } catch {
    return null
  }
}

function writeSession(session: Session | null) {
  try {
    if (session) {
      localStorage.setItem(KEY, JSON.stringify(session))
      localStorage.setItem(HINT_KEY, session.user.email)
    } else {
      localStorage.removeItem(KEY)
    }
  } catch {
    // 저장소를 쓸 수 없으면 메모리에만 유지 (새로고침하면 다시 로그인)
  }
}

function readHint(): string | undefined {
  try {
    return localStorage.getItem(HINT_KEY) ?? undefined
  } catch {
    return undefined
  }
}

/** 토큰으로 로그인한 계정 정보를 가져온다. drive.file 범위만으로 조회할 수 있다 */
async function fetchUser(accessToken: string): Promise<AuthUser> {
  const res = await fetch('https://www.googleapis.com/drive/v3/about?fields=user(displayName,emailAddress)', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) throw new Error(`계정 정보를 가져오지 못했습니다 (${res.status})`)
  const { user } = (await res.json()) as { user: { displayName: string; emailAddress: string } }
  return { name: user.displayName, email: user.emailAddress }
}

/**
 * Google Identity Services 토큰 방식 로그인.
 * 토큰은 약 1시간 유효하고, 창을 닫았다 열어도 유지되도록 localStorage에 둔다.
 * 만료 뒤 다시 로그인할 때는 마지막 계정을 login_hint로 넘겨 계정 선택을 건너뛴다.
 */
export class GoogleAuthService implements AuthService {
  private session: Session | null = readSession()
  private expiredHandler: (() => void) | null = null

  signIn(): Promise<AuthUser> {
    const oauth2 = window.google?.accounts.oauth2
    if (!oauth2) return Promise.reject(new Error('Google 로그인 모듈을 불러오지 못했습니다. 잠시 후 다시 시도하세요'))
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (!clientId) return Promise.reject(new Error('OAuth 클라이언트 ID가 설정되지 않았습니다 (.env.local)'))

    return new Promise((resolve, reject) => {
      const client = oauth2.initTokenClient({
        client_id: clientId,
        scope: SCOPE,
        login_hint: readHint(),
        callback: async (response) => {
          if (response.error) {
            reject(new Error(`로그인하지 못했습니다 (${response.error_description ?? response.error})`))
            return
          }
          try {
            const user = await fetchUser(response.access_token)
            this.session = {
              accessToken: response.access_token,
              expiresAt: Date.now() + response.expires_in * 1000,
              user,
            }
            writeSession(this.session)
            resolve(user)
          } catch (e) {
            reject(e)
          }
        },
        // 팝업을 닫거나 차단된 경우
        error_callback: (error) =>
          reject(
            new Error(
              error.type === 'popup_closed' ? '로그인 창이 닫혔습니다' : '로그인 창을 열지 못했습니다. 팝업 차단을 확인하세요',
            ),
          ),
      })
      // 버튼 클릭 이벤트 안에서 바로 불러야 팝업이 차단되지 않는다
      client.requestAccessToken()
    })
  }

  async signOut() {
    const token = this.session?.accessToken
    this.session = null
    writeSession(null)
    // 직접 로그아웃하면 다른 계정으로 들어갈 수 있도록 계정 기억도 지운다
    try {
      localStorage.removeItem(HINT_KEY)
    } catch {
      // 무시
    }
    if (token) window.google?.accounts.oauth2.revoke(token)
  }

  getAccessToken() {
    if (!this.session) return null
    if (Date.now() > this.session.expiresAt - EXPIRY_MARGIN_MS) return null
    return this.session.accessToken
  }

  getUser() {
    return this.session?.user ?? null
  }

  onExpired(handler: () => void) {
    this.expiredHandler = handler
  }

  markExpired() {
    this.session = null
    writeSession(null)
    this.expiredHandler?.()
  }
}
