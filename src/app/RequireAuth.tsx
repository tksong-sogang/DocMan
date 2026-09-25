import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../hooks/useAuth'

/** 로그인하지 않았으면 P01로 보낸다 (F001) */
export default function RequireAuth() {
  const { user } = useAuth()
  return user ? <Outlet /> : <Navigate to="/login" replace />
}
