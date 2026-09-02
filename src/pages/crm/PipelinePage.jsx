import { useMemo, useState } from 'react'
import Modal from '../../components/Modal'
import PageHeader from '../../components/PageHeader'
import { STAGES, money } from '../../data/crm'
import { useCrm } from '../../lib/CrmContext'

export default function PipelinePage() {
  const { deals, companies, search, moveDeal, addDeal, loading, error } = useCrm()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    name: '',
    companyId: '',
    value: '',
    closeDate: '',
  })
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const query = search.trim().toLowerCase()

  const companyName = (deal) =>
    deal.companyName
    || companies.find((company) => String(company.id) === String(deal.companyId))?.name
    || '—'

  const visible = useMemo(
    () => deals.filter((deal) => `${deal.name} ${companyName(deal)}`.toLowerCase().includes(query)),
    [deals, companies, query],
  )

  function openModal() {
    setFormError('')
    setForm({
      name: '',
      companyId: companies[0]?.id ?? '',
      value: '',
      closeDate: '',
    })
    setOpen(true)
  }

  async function submit(event) {
    event.preventDefault()
    if (!form.name.trim() || !form.value || !form.companyId) {
      setFormError('Deal name, company, and value are required.')
      return
    }

    setSaving(true)
    setFormError('')
    try {
      await addDeal({
        name: form.name,
        companyId: form.companyId,
        value: Number(form.value),
        closeDate: form.closeDate || null,
      })
      setOpen(false)
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function changeStage(dealId, stage) {
    try {
      await moveDeal(dealId, stage)
    } catch (err) {
      setFormError(err.message)
    }
  }

  return (
    <div className="page">
      <PageHeader
        eyebrow="Deals"
        title="Pipeline"
        subtitle="Move opportunities from first conversation to close."
        action={
          <button type="button" className="primary-btn" onClick={openModal}>
            Add deal
          </button>
        }
      />

      {error ? <div className="banner banner--error">{error}</div> : null}
      {formError && !open ? <div className="banner banner--error">{formError}</div> : null}

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
                    <small>{companyName(deal)}</small>
                    <strong>{money(deal.value)}</strong>
                    <div className="deal-card-foot">
                      <em>{deal.closeDate}</em>
                      <select value={deal.stage} onChange={(event) => changeStage(deal.id, event.target.value)}>
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
          {formError ? <div className="banner banner--error">{formError}</div> : null}
          {companies.length === 0 ? (
            <p className="empty">Add a company first, then you can attach a deal to it.</p>
          ) : (
            <form className="auth-form" onSubmit={submit}>
              <label className="field">
                <span>Deal name</span>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </label>
              <label className="field">
                <span>Company</span>
                <select value={form.companyId} onChange={(e) => setForm({ ...form, companyId: e.target.value })} required>
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
                <input type="date" value={form.closeDate} onChange={(e) => setForm({ ...form, closeDate: e.target.value })} />
              </label>
              <button className="primary-btn" type="submit" disabled={saving}>
                {saving ? 'Saving…' : 'Save deal'}
              </button>
            </form>
          )}
        </Modal>
      ) : null}
    </div>
  )
}
