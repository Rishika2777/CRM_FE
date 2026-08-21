import { useState } from 'react'
import PageHeader from '../../components/PageHeader'
import { useAuth } from '../../lib/AuthContext'

export default function SettingsPage() {
  const { session } = useAuth()
  const [profile, setProfile] = useState({
    name: session.fullName || '',
    email: session.email || '',
    role: 'Account owner',
    timezone: 'Asia/Kolkata',
  })
  const [workspace, setWorkspace] = useState({
    name: 'Nexora workspace',
    currency: 'USD',
  })
  const [notes, setNotes] = useState({
    email: true,
    weekly: true,
    desktop: false,
  })
  const [saved, setSaved] = useState('')

  function save(event) {
    event.preventDefault()
    setSaved('Settings saved on this device.')
  }

  return (
    <div className="page">
      <PageHeader
        eyebrow="Workspace"
        title="Settings"
        subtitle="Profile, workspace defaults, and notification preferences."
      />

      {saved ? <div className="banner banner--ok">{saved}</div> : null}

      <form className="settings-grid" onSubmit={save}>
        <section className="panel">
          <h2>Profile</h2>
          <label className="field">
            <span>Full name</span>
            <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
          </label>
          <label className="field">
            <span>Email</span>
            <input value={profile.email} readOnly />
          </label>
          <label className="field">
            <span>Role</span>
            <input value={profile.role} onChange={(e) => setProfile({ ...profile, role: e.target.value })} />
          </label>
          <label className="field">
            <span>Timezone</span>
            <select value={profile.timezone} onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}>
              <option value="Asia/Kolkata">Asia/Kolkata</option>
              <option value="America/New_York">America/New_York</option>
              <option value="Europe/London">Europe/London</option>
            </select>
          </label>
        </section>

        <section className="panel">
          <h2>Workspace</h2>
          <label className="field">
            <span>Workspace name</span>
            <input value={workspace.name} onChange={(e) => setWorkspace({ ...workspace, name: e.target.value })} />
          </label>
          <label className="field">
            <span>Default currency</span>
            <select value={workspace.currency} onChange={(e) => setWorkspace({ ...workspace, currency: e.target.value })}>
              <option>USD</option>
              <option>INR</option>
              <option>EUR</option>
            </select>
          </label>
          <h2 className="settings-sub">Notifications</h2>
          <label className="check">
            <input type="checkbox" checked={notes.email} onChange={(e) => setNotes({ ...notes, email: e.target.checked })} />
            Email me about overdue tasks
          </label>
          <label className="check">
            <input type="checkbox" checked={notes.weekly} onChange={(e) => setNotes({ ...notes, weekly: e.target.checked })} />
            Weekly pipeline digest
          </label>
          <label className="check">
            <input type="checkbox" checked={notes.desktop} onChange={(e) => setNotes({ ...notes, desktop: e.target.checked })} />
            Desktop alerts for new leads
          </label>
        </section>

        <div className="settings-foot">
          <button className="primary-btn" type="submit">Save changes</button>
        </div>
      </form>
    </div>
  )
}
