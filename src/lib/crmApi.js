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
