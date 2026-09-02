import { useMemo, useState } from 'react'
import Modal from '../../components/Modal'
import PageHeader from '../../components/PageHeader'
import StatusBadge from '../../components/StatusBadge'
import { useCrm } from '../../lib/CrmContext'

export default function TasksPage() {
  const { tasks, search, toggleTask, addTask, loading, error } = useCrm()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ title: '', due: '', type: 'Task', related: '' })
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const query = search.trim().toLowerCase()

  const rows = useMemo(
    () => tasks.filter((task) => `${task.title} ${task.related} ${task.type}`.toLowerCase().includes(query)),
    [tasks, query],
  )
  const openRows = rows.filter((task) => !task.done)
  const doneRows = rows.filter((task) => task.done)
  const openCount = openRows.length

  function openModal() {
    setFormError('')
    setForm({ title: '', due: '', type: 'Task', related: '' })
    setOpen(true)
  }

  async function submit(event) {
    event.preventDefault()
    if (!form.title.trim()) {
      setFormError('Title is required.')
      return
    }

    setSaving(true)
    setFormError('')
    try {
      await addTask(form)
      setOpen(false)
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function changeDone(taskId) {
    try {
      await toggleTask(taskId)
    } catch (err) {
      setFormError(err.message)
    }
  }

  return (
    <div className="page">
      <PageHeader
        eyebrow="Work"
        title="Tasks"
        subtitle={`${openCount} open follow-ups across calls, mail, and meetings.`}
        action={
          <button type="button" className="primary-btn" onClick={openModal}>
            Add task
          </button>
        }
      />

      {error ? <div className="banner banner--error">{error}</div> : null}
      {formError && !open ? <div className="banner banner--error">{formError}</div> : null}

      <div className="task-board">
        <div className="panel">
          <div className="panel-head">
            <h2>Open</h2>
            <span className="count-pill">{loading ? '…' : openRows.length}</span>
          </div>
          <ul className="task-list">
            {openRows.map((task) => (
              <li key={task.id} className="task">
                <label>
                  <input type="checkbox" checked={task.done} onChange={() => changeDone(task.id)} />
                  <div>
                    <p>{task.title}</p>
                    <small>{task.related || 'No account'} · due {task.due}</small>
                  </div>
                </label>
                <StatusBadge label={task.type} />
              </li>
            ))}
          </ul>
          {!loading && openRows.length === 0 ? <p className="empty">Nothing waiting. Nice work.</p> : null}
        </div>
        <div className="panel">
          <div className="panel-head">
            <h2>Done</h2>
            <span className="count-pill">{loading ? '…' : doneRows.length}</span>
          </div>
          <ul className="task-list">
            {doneRows.map((task) => (
              <li key={task.id} className="task done">
                <label>
                  <input type="checkbox" checked={task.done} onChange={() => changeDone(task.id)} />
                  <div>
                    <p>{task.title}</p>
                    <small>{task.related || 'No account'} · due {task.due}</small>
                  </div>
                </label>
                <StatusBadge label={task.type} />
              </li>
            ))}
          </ul>
        </div>
      </div>
      {!loading && rows.length === 0 ? <p className="empty">No tasks yet. Add one to get started.</p> : null}

      {open ? (
        <Modal title="New task" onClose={() => setOpen(false)}>
          {formError ? <div className="banner banner--error">{formError}</div> : null}
          <form className="auth-form" onSubmit={submit}>
            <label className="field">
              <span>Title</span>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </label>
            <label className="field">
              <span>Related to</span>
              <input value={form.related} onChange={(e) => setForm({ ...form, related: e.target.value })} />
            </label>
            <label className="field">
              <span>Due</span>
              <input value={form.due} placeholder="Today" onChange={(e) => setForm({ ...form, due: e.target.value })} />
            </label>
            <label className="field">
              <span>Type</span>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option>Task</option>
                <option>Call</option>
                <option>Email</option>
                <option>Meeting</option>
              </select>
            </label>
            <button className="primary-btn" type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save task'}
            </button>
          </form>
        </Modal>
      ) : null}
    </div>
  )
}
