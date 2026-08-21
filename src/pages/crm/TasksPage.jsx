import { useMemo, useState } from 'react'
import Modal from '../../components/Modal'
import PageHeader from '../../components/PageHeader'
import StatusBadge from '../../components/StatusBadge'
import { useCrm } from '../../lib/CrmContext'

export default function TasksPage() {
  const { tasks, search, toggleTask, addTask } = useCrm()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ title: '', due: 'Today', type: 'Task', related: '' })
  const query = search.trim().toLowerCase()

  const rows = useMemo(
    () => tasks.filter((task) => `${task.title} ${task.related} ${task.type}`.toLowerCase().includes(query)),
    [tasks, query],
  )
  const openCount = rows.filter((task) => !task.done).length

  function submit(event) {
    event.preventDefault()
    if (!form.title.trim()) return
    addTask(form)
    setOpen(false)
    setForm({ title: '', due: 'Today', type: 'Task', related: '' })
  }

  return (
    <div className="page">
      <PageHeader
        eyebrow="Work"
        title="Tasks"
        subtitle={`${openCount} open follow-ups across calls, mail, and meetings.`}
        action={
          <button type="button" className="primary-btn" onClick={() => setOpen(true)}>
            Add task
          </button>
        }
      />

      <div className="panel">
        <ul className="task-list">
          {rows.map((task) => (
            <li key={task.id} className={task.done ? 'task done' : 'task'}>
              <label>
                <input type="checkbox" checked={task.done} onChange={() => toggleTask(task.id)} />
                <div>
                  <p>{task.title}</p>
                  <small>{task.related} · due {task.due}</small>
                </div>
              </label>
              <StatusBadge label={task.type} />
            </li>
          ))}
        </ul>
        {rows.length === 0 ? <p className="empty">No tasks match that search.</p> : null}
      </div>

      {open ? (
        <Modal title="New task" onClose={() => setOpen(false)}>
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
              <input value={form.due} onChange={(e) => setForm({ ...form, due: e.target.value })} />
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
            <button className="primary-btn" type="submit">Save task</button>
          </form>
        </Modal>
      ) : null}
    </div>
  )
}
