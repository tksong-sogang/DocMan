/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Google OAuth 클라이언트 ID (.env.local) */
  readonly VITE_GOOGLE_CLIENT_ID: string
  /** 'true'면 더미 서비스로 실행 (UI 개발용) */
  readonly VITE_USE_MOCK?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
