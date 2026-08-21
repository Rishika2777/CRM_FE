import { apiRequest } from './api'

const SESSION_KEY = 'nexora_crm_session'
const TOKEN_KEY = 'nexora_crm_token'

function toSession(user, token) {
  return {
    id: user.id,
    fullName: user.name || user.fullName || '',
    email: user.email,
    token,
  }
}

function persist(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  if (session.token) {
    localStorage.setItem(TOKEN_KEY, session.token)
  }
}

export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function signOut() {
  localStorage.removeItem(SESSION_KEY)
  localStorage.removeItem(TOKEN_KEY)
}

export async function signUp({ fullName, email, password, confirmPassword }) {
  const data = await apiRequest('/api/auth/signup', {
    method: 'POST',
    body: {
      name: fullName.trim(),
      email: email.trim().toLowerCase(),
      password,
      confirmPassword,
    },
  })

  if (data?.token && data?.user) {
    const session = toSession(data.user, data.token)
    persist(session)
    return session
  }

  return signIn({ email, password })
}

export async function signIn({ email, password }) {
  const data = await apiRequest('/api/auth/login', {
    method: 'POST',
    body: {
      email: email.trim().toLowerCase(),
      password,
    },
  })

  if (!data?.token || !data?.user) {
    throw new Error(data?.message || 'Login did not return a session.')
  }

  const session = toSession(data.user, data.token)
  persist(session)
  return session
}
