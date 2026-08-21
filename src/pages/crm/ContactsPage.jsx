import { useMemo, useState } from 'react'
import Modal from '../../components/Modal'
import PageHeader from '../../components/PageHeader'
import StatusBadge from '../../components/StatusBadge'
import { initials, avatarTone } from '../../data/crm'
import { useCrm } from '../../lib/CrmContext'

export default function ContactsPage() {
  const { contacts, companies, search, addContact } = useCrm()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', title: '', email: '', phone: '', companyId: companies[0]?.id || '' })

  const companyName = (id) => companies.find((company) => company.id === id)?.name || '—'
  const query = search.trim().toLowerCase()
  const rows = useMemo(
    () =>
      contacts.filter((contact) => {
        const haystack = `${contact.name} ${contact.email} ${contact.title} ${companyName(contact.companyId)}`.toLowerCase()
        return haystack.includes(query)
      }),
    [contacts, companies, query],
  )

  function submit(event) {
    event.preventDefault()
    if (!form.name.trim() || !form.email.trim()) return
    addContact(form)
    setOpen(false)
    setForm({ name: '', title: '', email: '', phone: '', companyId: companies[0]?.id || '' })
  }

  return (
    <div className="page">
      <PageHeader
        eyebrow="People"
        title="Contacts"
        subtitle="Everyone you sell to, support, and follow up with."
        action={
          <button type="button" className="primary-btn" onClick={() => setOpen(true)}>
            Add contact
          </button>
        }
      />

      <div className="toolbar">
        <span className="count-pill">{rows.length} people</span>
      </div>

      <div className="panel table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Email</th>
              <th>Status</th>
              <th>Last touch</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((contact) => (
              <tr key={contact.id}>
                <td>
                  <div className="cell-person">
                    <span className={`avatar sm tone-${avatarTone(contact.name)}`}>{initials(contact.name)}</span>
                    <div>
                      <strong>{contact.name}</strong>
                      <small>{contact.title}</small>
                    </div>
                  </div>
                </td>
                <td>{companyName(contact.companyId)}</td>
                <td>{contact.email}</td>
                <td><StatusBadge label={contact.status} /></td>
                <td>{contact.lastTouch}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 ? <p className="empty">No contacts match that search.</p> : null}
      </div>

      {open ? (
        <Modal title="New contact" onClose={() => setOpen(false)}>
          <form className="auth-form" onSubmit={submit}>
            <label className="field">
              <span>Full name</span>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </label>
            <label className="field">
              <span>Title</span>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </label>
            <label className="field">
              <span>Email</span>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </label>
            <label className="field">
              <span>Phone</span>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </label>
            <label className="field">
              <span>Company</span>
              <select value={form.companyId} onChange={(e) => setForm({ ...form, companyId: e.target.value })}>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>{company.name}</option>
                ))}
              </select>
            </label>
            <button className="primary-btn" type="submit">Save contact</button>
          </form>
        </Modal>
      ) : null}
    </div>
  )
}
