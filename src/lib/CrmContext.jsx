import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  createCompany,
  createContact,
  createDeal,
  createTask,
  listCompanies,
  listContacts,
  listDeals,
  listTasks,
  mapCompany,
  mapContact,
  mapDeal,
  mapTask,
  updateDealStage,
  updateTaskDone,
} from './crmApi'

const CrmContext = createContext(null)

export function CrmProvider({ children }) {
  const [search, setSearch] = useState('')
  const [contacts, setContacts] = useState([])
  const [companies, setCompanies] = useState([])
  const [deals, setDeals] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError('')
      try {
        const [companyResult, contactResult, dealResult, taskResult] = await Promise.allSettled([
          listCompanies(),
          listContacts(),
          listDeals(),
          listTasks(),
        ])
        if (cancelled) return

        if (companyResult.status === 'fulfilled') {
          setCompanies((companyResult.value || []).map(mapCompany))
        }
        if (contactResult.status === 'fulfilled') {
          setContacts((contactResult.value || []).map(mapContact))
        }
        if (dealResult.status === 'fulfilled') {
          setDeals((dealResult.value || []).map(mapDeal))
        }
        if (taskResult.status === 'fulfilled') {
          setTasks((taskResult.value || []).map(mapTask))
        }

        const failed = [companyResult, contactResult, dealResult, taskResult].find((result) => result.status === 'rejected')
        if (failed) setError(failed.reason?.message || 'Something went wrong. Please try again.')
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
      async addDeal(deal) {
        const created = await createDeal(deal)
        const mapped = mapDeal(created)
        setDeals((current) => [mapped, ...current])
        return mapped
      },
      async moveDeal(id, stage) {
        const updated = await updateDealStage(id, stage)
        const mapped = mapDeal(updated)
        setDeals((current) => current.map((item) => (item.id === id ? mapped : item)))
        return mapped
      },
      async addTask(task) {
        const created = await createTask(task)
        const mapped = mapTask(created)
        setTasks((current) => [mapped, ...current])
        return mapped
      },
      async toggleTask(id) {
        const current = tasks.find((task) => task.id === id)
        if (!current) throw new Error('Task not found')
        const updated = await updateTaskDone(id, !current.done)
        const mapped = mapTask(updated)
        setTasks((items) => items.map((task) => (task.id === id ? mapped : task)))
        return mapped
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
