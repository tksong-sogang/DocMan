// Phase 1 임시 로그인 플래그. Phase 2의 useAuth로 대체한다.
const KEY = 'docman.tempSignedIn'

export function isSignedIn(): boolean {
  try {
    return sessionStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

export function setSignedIn(value: boolean): void {
  try {
    if (value) sessionStorage.setItem(KEY, '1')
    else sessionStorage.removeItem(KEY)
  } catch {
    // 저장소를 쓸 수 없는 환경이면 무시
  }
}
