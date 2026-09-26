import type { AuthService } from './auth/AuthService'
import { GoogleAuthService } from './auth/GoogleAuthService'
import type { DriveService } from './drive/DriveService'
import { GoogleDriveService } from './drive/GoogleDriveService'
import type { AnalysisService } from './gemini/AnalysisService'
import { GeminiAnalysisService } from './gemini/GeminiAnalysisService'
import { MockAnalysisService } from './mock/MockAnalysisService'
import { MockAuthService } from './mock/MockAuthService'
import { MockDriveService } from './mock/MockDriveService'

// 앱 전체가 쓰는 서비스 인스턴스. VITE_USE_MOCK=true 이면 더미 서비스로 실행한다 (UI 개발용)
const useMock = import.meta.env.VITE_USE_MOCK === 'true'

export const authService: AuthService = useMock ? new MockAuthService() : new GoogleAuthService()
export const driveService: DriveService = useMock ? new MockDriveService() : new GoogleDriveService(authService)
export const analysisService: AnalysisService = useMock ? new MockAnalysisService() : new GeminiAnalysisService()
