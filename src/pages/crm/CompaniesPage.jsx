import { useMemo, useState } from 'react'
import Modal from '../../components/Modal'
import PageHeader from '../../components/PageHeader'
import { avatarTone, initials, money } from '../../data/crm'
import { useCrm } from '../../lib/CrmContext'

export default function CompaniesPage() {
  const { companies, contacts, deals, search, addCompany, loading, error } = useCrm()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', industry: '', city: '' })
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const query = search.trim().toLowerCase()

  const cards = useMemo(
    () =>
      companies
        .filter((company) => `${company.name} ${company.industry} ${company.city}`.toLowerCase().includes(query))
        .map((company) => ({
          ...company,
          people: contacts.filter((contact) => String(contact.companyId) === String(company.id)).length,
          pipeline: deals
            .filter((deal) => String(deal.companyId) === String(company.id) && deal.stage !== 'Won')
            .reduce((sum, deal) => sum + deal.value, 0),
        })),
    [companies, contacts, deals, query],
  )

  function openModal() {
    setFormError('')
    setForm({ name: '', industry: '', city: '' })
    setOpen(true)
  }

  async function submit(event) {
    event.preventDefault()
    if (!form.name.trim() || !form.industry.trim() || !form.city.trim()) {
      setFormError('Company name, industry, and city are required.')
      return
    }

    setSaving(true)
    setFormError('')
    try {
      await addCompany(form)
      setOpen(false)
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page">
      <PageHeader
        eyebrow="Accounts"
        title="Companies"
        subtitle="The organizations behind your pipeline."
        action={
          <button type="button" className="primary-btn" onClick={openModal}>
            Add company
          </button>
        }
      />

      {error ? <div className="banner banner--error">{error}</div> : null}

      <div className="toolbar">
        <span className="count-pill">{loading ? 'Loading…' : `${cards.length} companies`}</span>
      </div>

      <section className="company-grid">
        {cards.map((company) => (
          <article className="company-card" key={company.id}>
            <div className="cell-person">
              <span className={`avatar tone-${avatarTone(company.name)}`}>{initials(company.name)}</span>
              <div>
                <h2>{company.name}</h2>
                <p>{company.industry} · {company.city}</p>
              </div>
            </div>
            <dl className="mini-stats">
              <div>
                <dt>People</dt>
                <dd>{company.people}</dd>
              </div>
              <div>
                <dt>Open pipeline</dt>
                <dd>{money(company.pipeline)}</dd>
              </div>
              <div>
                <dt>City</dt>
                <dd>{company.city}</dd>
              </div>
            </dl>
          </article>
        ))}
      </section>
      {!loading && cards.length === 0 ? <p className="empty">No companies yet. Add one to get started.</p> : null}

      {open ? (
        <Modal title="New company" onClose={() => setOpen(false)}>
          {formError ? <div className="banner banner--error">{formError}</div> : null}
          <form className="auth-form" onSubmit={submit}>
            <label className="field">
              <span>Company name</span>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </label>
            <label className="field">
              <span>Industry</span>
              <input value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} required />
            </label>
            <label className="field">
              <span>City</span>
              <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
            </label>
            <button className="primary-btn" type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save company'}
            </button>
          </form>
        </Modal>
      ) : null}
    </div>
  )
}
