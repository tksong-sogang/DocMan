import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages 배포 경로 (https://tksong-sogang.github.io/DocMan/)
  base: '/DocMan/',
  plugins: [
    react(),
    // PWA: 폰·PC에서 앱으로 설치 (F016). 앱 파일만 캐시하고 Google API 응답은 캐시하지 않는다
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'DocMan',
        short_name: 'DocMan',
        description: '문서와 사진을 분석해서 Google Drive에 정리합니다',
        lang: 'ko',
        theme_color: '#2563eb',
        background_color: '#f7f7f8',
        display: 'standalone',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
  build: {
    // vis-network 청크(약 650kB)는 그래프 페이지를 열 때만 불러오므로 경고 기준을 올린다
    chunkSizeWarningLimit: 700,
  },
  server: {
    // Google OAuth 승인된 JavaScript 원본에 등록된 포트
    port: 5173,
    strictPort: true,
  },
})
