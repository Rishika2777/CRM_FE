import { useMemo, useState } from 'react'
import Modal from '../../components/Modal'
import PageHeader from '../../components/PageHeader'
import { initials, money, avatarTone } from '../../data/crm'
import { useCrm } from '../../lib/CrmContext'

export default function CompaniesPage() {
  const { companies, contacts, deals, search, addCompany } = useCrm()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', industry: '', city: '' })
  const query = search.trim().toLowerCase()

  const cards = useMemo(
    () =>
      companies
        .filter((company) => `${company.name} ${company.industry} ${company.city}`.toLowerCase().includes(query))
        .map((company) => ({
          ...company,
          people: contacts.filter((contact) => contact.companyId === company.id).length,
          pipeline: deals
            .filter((deal) => deal.companyId === company.id && deal.stage !== 'Won')
            .reduce((sum, deal) => sum + deal.value, 0),
        })),
    [companies, contacts, deals, query],
  )

  function submit(event) {
    event.preventDefault()
    if (!form.name.trim()) return
    addCompany(form)
    setOpen(false)
    setForm({ name: '', industry: '', city: '' })
  }

  return (
    <div className="page">
      <PageHeader
        eyebrow="Accounts"
        title="Companies"
        subtitle="The organizations behind your pipeline."
        action={
          <button type="button" className="primary-btn" onClick={() => setOpen(true)}>
            Add company
          </button>
        }
      />

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
                <dt>Owner</dt>
                <dd>{company.owner}</dd>
              </div>
            </dl>
          </article>
        ))}
      </section>
      {cards.length === 0 ? <p className="empty">No companies match that search.</p> : null}

      {open ? (
        <Modal title="New company" onClose={() => setOpen(false)}>
          <form className="auth-form" onSubmit={submit}>
            <label className="field">
              <span>Company name</span>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </label>
            <label className="field">
              <span>Industry</span>
              <input value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
            </label>
            <label className="field">
              <span>City</span>
              <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </label>
            <button className="primary-btn" type="submit">Save company</button>
          </form>
        </Modal>
      ) : null}
    </div>
  )
}
