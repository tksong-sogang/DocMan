/** 잠깐 뒤 다시 시도하면 될 수 있는 HTTP 상태 (https://ai.google.dev/gemini-api/docs/troubleshooting) */
export const isRetryableStatus = (status: number) => status === 408 || status === 429 || status >= 500

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

/**
 * 일시적인 오류(429, 5xx, 네트워크 오류)면 1초, 2초, 4초…(지터 포함) 간격으로 다시 시도한다.
 * 마지막 시도의 Response(또는 네트워크 오류)를 그대로 돌려준다.
 */
export async function fetchWithRetry(
  send: () => Promise<Response>,
  { retries = 3, baseDelayMs = 1000, wait = sleep }: { retries?: number; baseDelayMs?: number; wait?: (ms: number) => Promise<void> } = {},
): Promise<Response> {
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await send()
      if (!isRetryableStatus(res.status) || attempt >= retries) return res
    } catch (e) {
      // fetch 자체가 실패한 경우 (네트워크 끊김 등)
      if (attempt >= retries) throw e
    }
    await wait(baseDelayMs * 2 ** attempt * (0.8 + Math.random() * 0.4))
  }
}
