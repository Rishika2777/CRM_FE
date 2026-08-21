import PageHeader from '../../components/PageHeader'
import { STAGES, money } from '../../data/crm'
import { useCrm } from '../../lib/CrmContext'

export default function ReportsPage() {
  const { deals, contacts, companies, tasks } = useCrm()
  const byStage = STAGES.map((stage) => {
    const items = deals.filter((deal) => deal.stage === stage)
    return {
      stage,
      count: items.length,
      value: items.reduce((sum, deal) => sum + deal.value, 0),
    }
  })
  const maxValue = Math.max(...byStage.map((row) => row.value), 1)
  const total = deals.reduce((sum, deal) => sum + deal.value, 0)
  const won = deals.filter((deal) => deal.stage === 'Won').reduce((sum, deal) => sum + deal.value, 0)
  const openTasks = tasks.filter((task) => !task.done).length

  return (
    <div className="page">
      <PageHeader
        eyebrow="Insights"
        title="Reports"
        subtitle="A snapshot of revenue movement and team workload."
      />

      <section className="kpi-grid">
        <article className="kpi">
          <span>Total pipeline</span>
          <strong>{money(total)}</strong>
        </article>
        <article className="kpi">
          <span>Won revenue</span>
          <strong>{money(won)}</strong>
        </article>
        <article className="kpi">
          <span>Companies</span>
          <strong>{companies.length}</strong>
        </article>
        <article className="kpi">
          <span>Open tasks</span>
          <strong>{openTasks}</strong>
        </article>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>Value by stage</h2>
          <span className="muted">{contacts.length} contacts in play</span>
        </div>
        <ul className="bar-chart">
          {byStage.map((row) => (
            <li key={row.stage}>
              <div className="bar-label">
                <span>{row.stage}</span>
                <b>{money(row.value)}</b>
              </div>
              <div className="bar-track">
                <span style={{ width: `${(row.value / maxValue) * 100}%` }} />
              </div>
              <small>{row.count} deals</small>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
