/** 더미 서비스에서 네트워크 지연을 흉내 낸다 */
export const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))
