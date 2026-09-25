import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages 배포 경로 (https://tksong-sogang.github.io/DocMan/)
  base: '/DocMan/',
  plugins: [react()],
  server: {
    // Google OAuth 승인된 JavaScript 원본에 등록된 포트
    port: 5173,
    strictPort: true,
  },
})
