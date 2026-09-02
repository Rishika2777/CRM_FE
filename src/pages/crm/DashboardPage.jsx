import { useMemo } from 'react'
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
  const { contacts, companies, deals, tasks, loading, error } = useCrm()
  const hour = new Date().getHours()
  const hello = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const firstName = (session.fullName || 'there').split(' ')[0]
  const today = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date())

  const openDeals = deals.filter((deal) => deal.stage !== 'Won')
  const pipelineValue = openDeals.reduce((sum, deal) => sum + deal.value, 0)
  const won = deals.filter((deal) => deal.stage === 'Won')
  const winRate = deals.length ? Math.round((won.length / deals.length) * 100) : 0
  const dueTasks = tasks.filter((task) => !task.done)

  const liveDeals = useMemo(
    () => [...deals].sort((a, b) => b.value - a.value).slice(0, 5),
    [deals],
  )

  const activity = useMemo(() => {
    const dealItems = [...deals]
      .sort((a, b) => Number(b.id) - Number(a.id))
      .slice(0, 3)
      .map((deal) => ({
        id: `deal-${deal.id}`,
        text: `${deal.name} is in ${deal.stage}`,
        time: deal.companyName || deal.closeDate || 'Pipeline',
        tone: deal.stage === 'Won' ? 'teal' : 'ink',
      }))

    const taskItems = [...tasks]
      .sort((a, b) => Number(b.id) - Number(a.id))
      .slice(0, 3)
      .map((task) => ({
        id: `task-${task.id}`,
        text: task.done ? `Completed: ${task.title}` : `${task.type}: ${task.title}`,
        time: task.related || task.due || 'Task',
        tone: task.done ? 'teal' : 'amber',
      }))

    return [...dealItems, ...taskItems].slice(0, 6)
  }, [deals, tasks])

  return (
    <div className="page dash-page">
      <PageHeader
        eyebrow="Overview"
        title={`${hello}, ${firstName}`}
        subtitle={`${today} · Pipeline, follow-ups, and accounts in one place.`}
      />

      {error ? <div className="banner banner--error">{error}</div> : null}

      <section className="kpi-grid">
        <article className="kpi">
          <KpiIcon>
            <svg viewBox="0 0 24 24" fill="none"><path d="M4 16.5 9 11l4 4 7-8" stroke="currentColor" strokeWidth="1.8" /><path d="M15 7h5v5" stroke="currentColor" strokeWidth="1.8" /></svg>
          </KpiIcon>
          <div>
            <span>Open pipeline</span>
            <strong>{loading ? '…' : money(pipelineValue)}</strong>
            <p>{loading ? 'Loading deals' : `${openDeals.length} active deals`}</p>
          </div>
        </article>
        <article className="kpi">
          <KpiIcon>
            <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" /><path d="M12 8v4l3 2" stroke="currentColor" strokeWidth="1.8" /></svg>
          </KpiIcon>
          <div>
            <span>Win rate</span>
            <strong>{loading ? '…' : `${winRate}%`}</strong>
            <p>{loading ? 'Loading deals' : `${won.length} closed won`}</p>
          </div>
        </article>
        <article className="kpi">
          <KpiIcon>
            <svg viewBox="0 0 24 24" fill="none"><path d="M4 20V7h10v13M14 11h6v9H4" stroke="currentColor" strokeWidth="1.8" /></svg>
          </KpiIcon>
          <div>
            <span>Accounts</span>
            <strong>{loading ? '…' : companies.length}</strong>
            <p>{loading ? 'Loading accounts' : `${contacts.length} people`}</p>
          </div>
        </article>
        <article className="kpi">
          <KpiIcon>
            <svg viewBox="0 0 24 24" fill="none"><rect x="5" y="5" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.8" /><path d="m8.5 12 2.4 2.4L16 9.5" stroke="currentColor" strokeWidth="1.8" /></svg>
          </KpiIcon>
          <div>
            <span>Follow-ups</span>
            <strong>{loading ? '…' : dueTasks.length}</strong>
            <p>open tasks</p>
          </div>
        </article>
      </section>

      <section className="dash-split">
        <div className="panel">
          <div className="panel-head">
            <div>
              <h2>Live pipeline</h2>
              <p className="panel-hint">Highest-value deals from your board</p>
            </div>
            <Link to="/pipeline">Open board</Link>
          </div>
          {liveDeals.length ? (
            <ul className="deal-list">
              {liveDeals.map((deal) => (
                <li key={deal.id}>
                  <div>
                    <p>{deal.name}</p>
                    <small>{deal.closeDate} · {deal.companyName || 'No company'}</small>
                  </div>
                  <div className="deal-meta">
                    <StatusBadge label={deal.stage} />
                    <b>{money(deal.value)}</b>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty">{loading ? 'Loading pipeline…' : 'No deals yet. Add one in Pipeline.'}</p>
          )}
        </div>

        <div className="panel">
          <div className="panel-head">
            <div>
              <h2>Activity</h2>
              <p className="panel-hint">Latest deals and tasks</p>
            </div>
            <Link to="/tasks">View tasks</Link>
          </div>
          {activity.length ? (
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
          ) : (
            <p className="empty">{loading ? 'Loading activity…' : 'No pipeline or task activity yet.'}</p>
          )}
        </div>
      </section>

      <section className="panel due-panel">
        <div className="panel-head">
          <div>
            <h2>Due now</h2>
            <p className="panel-hint">Open follow-ups from Tasks</p>
          </div>
          <Link to="/tasks">All tasks</Link>
        </div>
        {dueTasks.length ? (
          <ul className="due-list">
            {dueTasks.slice(0, 4).map((task) => (
              <li key={task.id}>
                <span className="due-mark" />
                <div>
                  <p>{task.title}</p>
                  <small>{task.related || 'No account'} · {task.due}</small>
                </div>
                <StatusBadge label={task.type} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty">{loading ? 'Loading tasks…' : 'No open tasks. Add one in Tasks.'}</p>
        )}
      </section>
    </div>
  )
}
