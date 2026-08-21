import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { seedActivity, seedDeals, seedTasks } from '../data/crm'
import {
  createCompany,
  createContact,
  listCompanies,
  listContacts,
  mapCompany,
  mapContact,
} from './crmApi'

const CrmContext = createContext(null)

export function CrmProvider({ children }) {
  const [search, setSearch] = useState('')
  const [contacts, setContacts] = useState([])
  const [companies, setCompanies] = useState([])
  const [deals, setDeals] = useState(seedDeals)
  const [tasks, setTasks] = useState(seedTasks)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError('')
      try {
        const [companyRows, contactRows] = await Promise.all([
          listCompanies(),
          listContacts(),
        ])
        if (cancelled) return
        setCompanies((companyRows || []).map(mapCompany))
        setContacts((contactRows || []).map(mapContact))
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo(
    () => ({
      search,
      setSearch,
      contacts,
      companies,
      deals,
      tasks,
      activity: seedActivity,
      loading,
      error,
      async addContact(contact) {
        const created = await createContact(contact)
        const mapped = mapContact(created)
        setContacts((current) => [mapped, ...current])
        return mapped
      },
      async addCompany(company) {
        const created = await createCompany(company)
        const mapped = mapCompany(created)
        setCompanies((current) => [mapped, ...current])
        return mapped
      },
      addDeal(deal) {
        setDeals((current) => [
          { id: crypto.randomUUID(), stage: 'Lead', owner: 'You', ...deal },
          ...current,
        ])
      },
      moveDeal(id, stage) {
        setDeals((current) => current.map((item) => (item.id === id ? { ...item, stage } : item)))
      },
      addTask(task) {
        setTasks((current) => [
          { id: crypto.randomUUID(), done: false, type: 'Task', ...task },
          ...current,
        ])
      },
      toggleTask(id) {
        setTasks((current) =>
          current.map((task) => (task.id === id ? { ...task, done: !task.done } : task)),
        )
      },
    }),
    [search, contacts, companies, deals, tasks, loading, error],
  )

  return <CrmContext.Provider value={value}>{children}</CrmContext.Provider>
}

export function useCrm() {
  const context = useContext(CrmContext)
  if (!context) throw new Error('useCrm must be used inside CrmProvider')
  return context
}
