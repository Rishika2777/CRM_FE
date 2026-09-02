import { apiRequest } from './api'
import { getToken } from './auth'

function withAuth() {
  return { token: getToken() }
}

export function mapCompany(row) {
  return {
    id: row.id,
    name: row.companyName || row.name || '',
    industry: row.industry || '',
    city: row.city || '',
  }
}

export function mapContact(row) {
  return {
    id: row.id,
    name: row.fullName || row.name || '',
    title: row.title || '',
    email: row.email || '',
    phone: row.phone || '',
    companyId: row.companyId,
    companyName: row.companyName || '',
    status: 'Lead',
    lastTouch: 'Just now',
  }
}

export function listCompanies() {
  return apiRequest('/api/companies', withAuth())
}

export function createCompany({ name, industry, city }) {
  return apiRequest('/api/companies', {
    method: 'POST',
    ...withAuth(),
    body: {
      companyName: name.trim(),
      industry: industry.trim(),
      city: city.trim(),
    },
  })
}

export function listContacts() {
  return apiRequest('/api/contacts', withAuth())
}

export function createContact({ name, title, email, phone, companyId }) {
  return apiRequest('/api/contacts', {
    method: 'POST',
    ...withAuth(),
    body: {
      fullName: name.trim(),
      title: title.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      companyId: Number(companyId),
    },
  })
}

export function mapDeal(row) {
  return {
    id: row.id,
    name: row.dealName || row.name || '',
    companyId: row.companyId,
    companyName: row.companyName || '',
    value: Number(row.value) || 0,
    closeDate: row.closeDate || row.closedDate || 'TBD',
    stage: row.stage || 'Lead',
    owner: row.owner || 'You',
  }
}

export function listDeals() {
  return apiRequest('/api/pipeline', withAuth())
}

export function createDeal({ name, companyId, value, closeDate }) {
  return apiRequest('/api/pipeline', {
    method: 'POST',
    ...withAuth(),
    body: {
      dealName: name.trim(),
      companyId: Number(companyId),
      value: Number(value),
      closeDate: closeDate || null,
    },
  })
}

export function updateDealStage(id, stage) {
  return apiRequest(`/api/pipeline/${id}/stage`, {
    method: 'PATCH',
    ...withAuth(),
    body: { stage },
  })
}

export function mapTask(row) {
  return {
    id: row.id,
    title: row.title || '',
    related: row.relatedTo || row.related || '',
    due: row.due || 'TBD',
    type: row.type || 'Task',
    done: Boolean(row.done),
  }
}

export function listTasks() {
  return apiRequest('/api/tasks', withAuth())
}

export function createTask({ title, related, due, type }) {
  return apiRequest('/api/tasks', {
    method: 'POST',
    ...withAuth(),
    body: {
      title: title.trim(),
      relatedTo: related?.trim() || null,
      due: due?.trim() || null,
      type: type || 'Task',
    },
  })
}

export function updateTaskDone(id, done) {
  return apiRequest(`/api/tasks/${id}/done`, {
    method: 'PATCH',
    ...withAuth(),
    body: { done },
  })
}
