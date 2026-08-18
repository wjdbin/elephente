import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'

const tabs = [
  { to: '/', label: '오늘', end: true },
  { to: '/calendar', label: '달력', end: false },
  { to: '/tournaments', label: '대회', end: false },
] as const

function NavItems({ className }: { className?: string }) {
  return (
    <ul className={className}>
      {tabs.map((tab) => (
        <li key={tab.to}>
          <NavLink
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `flex h-full items-center justify-center px-3 text-sm font-semibold transition-colors ${
                isActive ? 'text-brand' : 'text-muted hover:text-navy'
              }`
            }
          >
            {tab.label}
          </NavLink>
        </li>
      ))}
    </ul>
  )
}

export function Layout() {
  const { pathname } = useLocation()
  const hideMobileNav = pathname.startsWith('/events/') || pathname.startsWith('/edit')

  return (
    <div className="flex min-h-svh flex-col bg-paper">
      <header className="sticky top-0 z-10 border-b border-line/80 bg-paper/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <img src="/logo.png" alt="" className="h-11 w-auto sm:h-14" />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold tracking-[0.16em] text-brand">FC ELEPHENTE</p>
              <h1 className="truncate text-base font-bold text-navy sm:text-lg">엘펜그라운드 MVP</h1>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <nav className="hidden md:block" aria-label="주요 메뉴">
              <NavItems className="flex gap-1" />
            </nav>
            <Link to="/edit" className="text-xs font-medium text-muted hover:text-brand">
              운영
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-4 sm:px-6 sm:pt-6 md:pb-10 lg:px-8 lg:pt-8">
        <Outlet />
      </main>

      {!hideMobileNav && (
        <nav
          className="fixed bottom-0 left-0 z-10 w-full border-t border-line bg-paper/95 backdrop-blur md:hidden"
          aria-label="모바일 메뉴"
        >
          <NavItems className="grid h-14 grid-cols-3" />
        </nav>
      )}
    </div>
  )
}
