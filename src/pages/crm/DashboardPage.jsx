import { Link } from 'react-router-dom'
import PageHeader from '../../components/PageHeader'
import StatusBadge from '../../components/StatusBadge'
import { money } from '../../data/crm'
import { useAuth } from '../../lib/AuthContext'
import { useCrm } from '../../lib/CrmContext'

function KpiIcon({ children }) {
  return <span className="kpi-icon">{children}</span>
}

export default function DashboardPage() {
  const { session } = useAuth()
  const { contacts, companies, deals, tasks, activity } = useCrm()
  const hour = new Date().getHours()
  const hello = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const firstName = (session.fullName || 'there').split(' ')[0]
  const openDeals = deals.filter((deal) => deal.stage !== 'Won')
  const pipelineValue = openDeals.reduce((sum, deal) => sum + deal.value, 0)
  const won = deals.filter((deal) => deal.stage === 'Won')
  const winRate = deals.length ? Math.round((won.length / deals.length) * 100) : 0
  const dueTasks = tasks.filter((task) => !task.done)
  const recentDeals = [...deals].slice(0, 5)
  const today = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date())

  return (
    <div className="page dash-page">
      <PageHeader
        eyebrow="Overview"
        title={`${hello}, ${firstName}`}
        subtitle={`${today} · Pipeline, follow-ups, and accounts in one place.`}
      />

      <section className="kpi-grid">
        <article className="kpi">
          <KpiIcon>
            <svg viewBox="0 0 24 24" fill="none"><path d="M4 16.5 9 11l4 4 7-8" stroke="currentColor" strokeWidth="1.8" /><path d="M15 7h5v5" stroke="currentColor" strokeWidth="1.8" /></svg>
          </KpiIcon>
          <div>
            <span>Open pipeline</span>
            <strong>{money(pipelineValue)}</strong>
            <p>{openDeals.length} active deals</p>
          </div>
        </article>
        <article className="kpi">
          <KpiIcon>
            <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" /><path d="M12 8v4l3 2" stroke="currentColor" strokeWidth="1.8" /></svg>
          </KpiIcon>
          <div>
            <span>Win rate</span>
            <strong>{winRate}%</strong>
            <p>{won.length} closed won</p>
          </div>
        </article>
        <article className="kpi">
          <KpiIcon>
            <svg viewBox="0 0 24 24" fill="none"><path d="M4 20V7h10v13M14 11h6v9H4" stroke="currentColor" strokeWidth="1.8" /></svg>
          </KpiIcon>
          <div>
            <span>Accounts</span>
            <strong>{companies.length}</strong>
            <p>{contacts.length} people</p>
          </div>
        </article>
        <article className="kpi">
          <KpiIcon>
            <svg viewBox="0 0 24 24" fill="none"><rect x="5" y="5" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.8" /><path d="m8.5 12 2.4 2.4L16 9.5" stroke="currentColor" strokeWidth="1.8" /></svg>
          </KpiIcon>
          <div>
            <span>Follow-ups</span>
            <strong>{dueTasks.length}</strong>
            <p>open tasks</p>
          </div>
        </article>
      </section>

      <section className="dash-split">
        <div className="panel">
          <div className="panel-head">
            <div>
              <h2>Live pipeline</h2>
              <p className="panel-hint">Highest-value deals this week</p>
            </div>
            <Link to="/pipeline">Open board</Link>
          </div>
          <ul className="deal-list">
            {recentDeals.map((deal) => (
              <li key={deal.id}>
                <div>
                  <p>{deal.name}</p>
                  <small>{deal.closeDate} · {deal.owner}</small>
                </div>
                <div className="deal-meta">
                  <StatusBadge label={deal.stage} />
                  <b>{money(deal.value)}</b>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="panel">
          <div className="panel-head">
            <div>
              <h2>Activity</h2>
              <p className="panel-hint">Latest movement on accounts</p>
            </div>
            <Link to="/tasks">View tasks</Link>
          </div>
          <ul className="activity-list">
            {activity.map((item) => (
              <li key={item.id}>
                <span className={`dot dot-${item.tone}`} />
                <div>
                  <p>{item.text}</p>
                  <small>{item.time}</small>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="panel due-panel">
        <div className="panel-head">
          <div>
            <h2>Due now</h2>
            <p className="panel-hint">Keep the next conversations moving</p>
          </div>
          <Link to="/tasks">All tasks</Link>
        </div>
        <ul className="due-list">
          {dueTasks.slice(0, 4).map((task) => (
            <li key={task.id}>
              <span className="due-mark" />
              <div>
                <p>{task.title}</p>
                <small>{task.related} · {task.due}</small>
              </div>
              <StatusBadge label={task.type} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
