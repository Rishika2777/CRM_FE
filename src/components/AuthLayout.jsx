import Logo from './Logo'

const highlights = [
  { label: 'Pipeline', value: '$248k', hint: 'Open this quarter' },
  { label: 'Win rate', value: '41%', hint: 'Last 30 days' },
  { label: 'Follow-ups', value: '12', hint: 'Due today' },
]

export default function AuthLayout({ children }) {
  return (
    <div className="auth-shell">
      <aside className="auth-brand">
        <div className="auth-brand-glow" aria-hidden="true" />
        <div className="auth-brand-grid" aria-hidden="true" />

        <Logo light />

        <div className="auth-brand-copy">
          <p className="eyebrow">Customer workspace</p>
          <h1>
            Every conversation,
            <br />
            one living pipeline.
          </h1>
          <p className="lead">
            Track leads, close deals, and keep your team aligned — without
            losing the human thread behind every account.
          </p>
        </div>

        <div className="pipeline-card">
          <div className="pipeline-card-head">
            <span>This week</span>
            <strong>Enterprise pipeline</strong>
          </div>
          <ul className="pipeline-stats">
            {highlights.map((item) => (
              <li key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <em>{item.hint}</em>
              </li>
            ))}
          </ul>
          <div className="deal-row">
            <div>
              <p>Northwind Health</p>
              <small>Proposal sent</small>
            </div>
            <b>$64,000</b>
          </div>
          <div className="deal-row">
            <div>
              <p>Helios Logistics</p>
              <small>Discovery call</small>
            </div>
            <b>$28,500</b>
          </div>
        </div>
      </aside>

      <main className="auth-panel">
        <div className="auth-panel-inner">{children}</div>
      </main>
    </div>
  )
}
