import { useMemo, useState } from 'react'
import Modal from '../../components/Modal'
import PageHeader from '../../components/PageHeader'
import { STAGES, money } from '../../data/crm'
import { useCrm } from '../../lib/CrmContext'

export default function PipelinePage() {
  const { deals, companies, search, moveDeal, addDeal } = useCrm()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    name: '',
    companyId: companies[0]?.id || '',
    value: '',
    closeDate: '',
  })
  const query = search.trim().toLowerCase()

  const companyName = (id) => companies.find((company) => company.id === id)?.name || '—'
  const visible = useMemo(
    () => deals.filter((deal) => `${deal.name} ${companyName(deal.companyId)}`.toLowerCase().includes(query)),
    [deals, companies, query],
  )

  function submit(event) {
    event.preventDefault()
    if (!form.name.trim() || !form.value) return
    addDeal({
      name: form.name,
      companyId: form.companyId,
      value: Number(form.value),
      closeDate: form.closeDate || 'TBD',
    })
    setOpen(false)
    setForm({ name: '', companyId: companies[0]?.id || '', value: '', closeDate: '' })
  }

  return (
    <div className="page">
      <PageHeader
        eyebrow="Deals"
        title="Pipeline"
        subtitle="Move opportunities from first conversation to close."
        action={
          <button type="button" className="primary-btn" onClick={() => setOpen(true)}>
            Add deal
          </button>
        }
      />

      <div className="kanban">
        {STAGES.map((stage) => {
          const column = visible.filter((deal) => deal.stage === stage)
          const total = column.reduce((sum, deal) => sum + deal.value, 0)
          return (
            <section className={`kanban-col col-${stage.toLowerCase()}`} data-stage={stage} key={stage}>
              <header>
                <h2>{stage}</h2>
                <span>{column.length} · {money(total)}</span>
              </header>
              <ul>
                {column.map((deal) => (
                  <li className="deal-card" key={deal.id}>
                    <p>{deal.name}</p>
                    <small>{companyName(deal.companyId)}</small>
                    <strong>{money(deal.value)}</strong>
                    <div className="deal-card-foot">
                      <em>{deal.closeDate}</em>
                      <select value={deal.stage} onChange={(event) => moveDeal(deal.id, event.target.value)}>
                        {STAGES.map((item) => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </select>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>

      {open ? (
        <Modal title="New deal" onClose={() => setOpen(false)}>
          <form className="auth-form" onSubmit={submit}>
            <label className="field">
              <span>Deal name</span>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </label>
            <label className="field">
              <span>Company</span>
              <select value={form.companyId} onChange={(e) => setForm({ ...form, companyId: e.target.value })}>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>{company.name}</option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Value (USD)</span>
              <input type="number" min="1" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} required />
            </label>
            <label className="field">
              <span>Close date</span>
              <input value={form.closeDate} placeholder="Sep 30" onChange={(e) => setForm({ ...form, closeDate: e.target.value })} />
            </label>
            <button className="primary-btn" type="submit">Save deal</button>
          </form>
        </Modal>
      ) : null}
    </div>
  )
}
