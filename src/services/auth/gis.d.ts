// Google Identity Services 토큰 모델 중 DocMan이 쓰는 부분만 선언
// https://developers.google.com/identity/oauth2/web/guides/use-token-model

interface GisTokenResponse {
  access_token: string
  expires_in: number
  error?: string
  error_description?: string
}

interface GisTokenClient {
  requestAccessToken(overrides?: { prompt?: string }): void
}

interface Window {
  google?: {
    accounts: {
      oauth2: {
        initTokenClient(config: {
          client_id: string
          scope: string
          callback(response: GisTokenResponse): void
          error_callback?(error: { type: string; message?: string }): void
        }): GisTokenClient
        revoke(accessToken: string, done?: () => void): void
      }
    }
  }
}
