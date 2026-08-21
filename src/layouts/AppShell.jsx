import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import { useAuth } from '../lib/AuthContext'
import { useCrm } from '../lib/CrmContext'
import { useState } from 'react'

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: HomeIcon },
  { to: '/contacts', label: 'Contacts', icon: PeopleIcon },
  { to: '/companies', label: 'Companies', icon: BuildingIcon },
  { to: '/pipeline', label: 'Pipeline', icon: FunnelIcon },
  { to: '/tasks', label: 'Tasks', icon: CheckIcon },
  { to: '/reports', label: 'Reports', icon: ChartIcon },
]

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  )
}

function PeopleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.7" />
      <path d="M4 19a5 5 0 0 1 10 0" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="17" cy="9" r="2.2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M16.2 19a4 4 0 0 1 4.8-3.4" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  )
}

function BuildingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 20V6.5A1.5 1.5 0 0 1 5.5 5h8A1.5 1.5 0 0 1 15 6.5V20M15 10h4.5A1.5 1.5 0 0 1 21 11.5V20" stroke="currentColor" strokeWidth="1.7" />
      <path d="M4 20h17M8 9h2M8 13h2M8 17h2" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  )
}

function FunnelIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 5h16l-6.5 8v5l-3 1.5v-6.5L4 5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="1.7" />
      <path d="m8 12 2.6 2.6L16 9.2" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  )
}

function ChartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 19V9M12 19V5M19 19v-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 4.5v1.6M12 17.9v1.6M4.5 12h1.6M17.9 12h1.6M6.4 6.4l1.1 1.1M16.5 16.5l1.1 1.1M17.6 6.4l-1.1 1.1M7.5 16.5l-1.1 1.1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

export default function AppShell() {
  const { session, signOut } = useAuth()
  const { search, setSearch } = useCrm()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const name = session.fullName || 'Account'
  const first = name.split(' ')[0]

  function handleSignOut() {
    signOut()
    navigate('/signin', { replace: true })
  }

  return (
    <div className={`shell ${open ? 'shell--nav' : ''}`}>
      <aside className="sidebar">
        <div className="sidebar-brand">
          <Logo light />
        </div>

        <p className="nav-label">Main</p>
        <nav className="side-nav" onClick={() => setOpen(false)}>
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'side-link active' : 'side-link')}>
              <item.icon />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-foot">
          <p className="nav-label">Workspace</p>
          <NavLink to="/settings" className={({ isActive }) => (isActive ? 'side-link active' : 'side-link')} onClick={() => setOpen(false)}>
            <GearIcon />
            Settings
          </NavLink>
          <div className="side-user">
            <div className="avatar" aria-hidden="true">{first.slice(0, 1).toUpperCase()}</div>
            <div className="side-user-copy">
              <strong>{name}</strong>
              <span>{session.email}</span>
            </div>
            <button type="button" className="text-signout" onClick={handleSignOut}>
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {open ? <button type="button" className="nav-scrim" aria-label="Close menu" onClick={() => setOpen(false)} /> : null}

      <div className="shell-main">
        <header className="topbar">
          <button type="button" className="menu-btn" onClick={() => setOpen(true)} aria-label="Open menu">
            Menu
          </button>
          <label className="top-search">
            <SearchIcon />
            <span className="sr-only">Search</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search contacts, companies, deals"
            />
          </label>
          <div className="top-meta">
            <span className="top-chip">Live workspace</span>
          </div>
        </header>
        <div className="workspace">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
