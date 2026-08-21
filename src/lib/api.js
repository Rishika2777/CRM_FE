const API_BASE = import.meta.env.VITE_API_BASE ?? ''

export async function apiRequest(path, { method = 'GET', body, token } = {}) {
  let response

  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new Error(
      'Cannot reach the server. Confirm the backend is running on http://localhost:8080.',
    )
  }

  const raw = await response.text()
  let data = null
  if (raw) {
    try {
      data = JSON.parse(raw)
    } catch {
      data = raw
    }
  }

  if (!response.ok) {
    const rawMessage = typeof data === 'string' ? data : data?.message || data?.error
    throw new Error(rawMessage || `Request failed (${response.status})`)
  }

  return data
}
