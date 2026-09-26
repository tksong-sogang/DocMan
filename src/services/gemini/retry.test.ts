import { describe, expect, it } from 'vitest'
import { fetchWithRetry } from './retry'

const noWait = async () => {}
const respond = (status: number) => new Response('', { status })

describe('fetchWithRetry', () => {
  it('503·429 뒤에 성공하면 성공 응답을 돌려준다', async () => {
    const statuses = [503, 429, 200]
    let calls = 0
    const res = await fetchWithRetry(async () => respond(statuses[calls++]), { wait: noWait })
    expect(res.status).toBe(200)
    expect(calls).toBe(3)
  })

  it('400 같은 요청 오류는 다시 시도하지 않는다', async () => {
    let calls = 0
    const res = await fetchWithRetry(async () => (calls++, respond(400)), { wait: noWait })
    expect(res.status).toBe(400)
    expect(calls).toBe(1)
  })

  it('계속 실패하면 재시도 횟수만큼 시도하고 마지막 응답을 돌려준다', async () => {
    let calls = 0
    const res = await fetchWithRetry(async () => (calls++, respond(503)), { retries: 3, wait: noWait })
    expect(res.status).toBe(503)
    expect(calls).toBe(4)
  })

  it('네트워크 오류도 다시 시도하고, 끝까지 실패하면 오류를 던진다', async () => {
    let calls = 0
    await expect(
      fetchWithRetry(
        async () => {
          calls++
          throw new TypeError('Failed to fetch')
        },
        { retries: 2, wait: noWait },
      ),
    ).rejects.toThrow('Failed to fetch')
    expect(calls).toBe(3)
  })
})
