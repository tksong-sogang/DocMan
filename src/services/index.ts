import type { AuthService } from './auth/AuthService'
import type { DriveService } from './drive/DriveService'
import type { AnalysisService } from './gemini/AnalysisService'
import { MockAnalysisService } from './mock/MockAnalysisService'
import { MockAuthService } from './mock/MockAuthService'
import { MockDriveService } from './mock/MockDriveService'

// 앱 전체가 쓰는 서비스 인스턴스. Phase 4에서 실제 구현으로 바꿔 끼운다
export const authService: AuthService = new MockAuthService()
export const driveService: DriveService = new MockDriveService()
export const analysisService: AnalysisService = new MockAnalysisService()
