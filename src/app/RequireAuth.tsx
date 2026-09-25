import { Navigate, Outlet } from 'react-router'
import { isSignedIn } from './tempAuth'

/** 로그인하지 않았으면 P01로 보낸다 (F001) */
export default function RequireAuth() {
  return isSignedIn() ? <Outlet /> : <Navigate to="/login" replace />
}
