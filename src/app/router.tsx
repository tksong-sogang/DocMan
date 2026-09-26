import { createHashRouter, Navigate } from 'react-router'
import LoginPage from '../features/auth/LoginPage'
import DashboardPage from '../features/dashboard/DashboardPage'
import LazyGraphPage from '../features/graph/LazyGraphPage'
import SettingsPage from '../features/settings/SettingsPage'
import UploadPage from '../features/upload/UploadPage'
import Layout from './Layout'
import RequireAuth from './RequireAuth'

// GitHub Pages는 SPA 경로 새로고침을 지원하지 않으므로 해시 라우터를 쓴다
export const router = createHashRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <Layout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'upload', element: <UploadPage /> },
          { path: 'graph', element: <LazyGraphPage /> },
          { path: 'settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
