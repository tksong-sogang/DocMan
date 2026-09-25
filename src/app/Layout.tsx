import { NavLink, Outlet } from 'react-router'

const MENU = [
  { to: '/', label: '대시보드' },
  { to: '/upload', label: '업로드' },
  { to: '/graph', label: '그래프' },
  { to: '/settings', label: '설정' },
]

/** 로그인 후 공통 레이아웃: 상단 메뉴 (PRD 3. 메뉴 구조) */
export default function Layout() {
  return (
    <>
      <header className="app-header">
        <span className="app-title">DocMan</span>
        <nav className="app-nav">
          {MENU.map((m) => (
            <NavLink key={m.to} to={m.to} end={m.to === '/'}>
              {m.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </>
  )
}
