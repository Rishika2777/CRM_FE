import { createContext, useContext, useMemo, useState } from 'react'
import { seedActivity, seedCompanies, seedContacts, seedDeals, seedTasks } from '../data/crm'

const CrmContext = createContext(null)

export function CrmProvider({ children }) {
  const [search, setSearch] = useState('')
  const [contacts, setContacts] = useState(seedContacts)
  const [companies, setCompanies] = useState(seedCompanies)
  const [deals, setDeals] = useState(seedDeals)
  const [tasks, setTasks] = useState(seedTasks)

  const value = useMemo(
    () => ({
      search,
      setSearch,
      contacts,
      companies,
      deals,
      tasks,
      activity: seedActivity,
      addContact(contact) {
        setContacts((current) => [
          { id: crypto.randomUUID(), status: 'Lead', lastTouch: 'Just now', ...contact },
          ...current,
        ])
      },
      addCompany(company) {
        setCompanies((current) => [
          { id: crypto.randomUUID(), employees: 1, owner: 'You', ...company },
          ...current,
        ])
      },
      addDeal(deal) {
        setDeals((current) => [
          { id: crypto.randomUUID(), stage: 'Lead', owner: 'You', ...deal },
          ...current,
        ])
      },
      moveDeal(id, stage) {
        setDeals((current) => current.map((deal) => (deal.id === id ? { ...deal, stage } : deal)))
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
    [search, contacts, companies, deals, tasks],
  )

  return <CrmContext.Provider value={value}>{children}</CrmContext.Provider>
}

export function useCrm() {
  const context = useContext(CrmContext)
  if (!context) throw new Error('useCrm must be used inside CrmProvider')
  return context
}
