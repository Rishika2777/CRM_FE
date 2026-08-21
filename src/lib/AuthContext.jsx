import { createContext, useContext, useMemo, useState } from 'react'
import * as auth from './auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => auth.getSession())

  const value = useMemo(
    () => ({
      session,
      async signIn(payload) {
        const next = await auth.signIn(payload)
        setSession(next)
        return next
      },
      async signUp(payload) {
        const next = await auth.signUp(payload)
        setSession(next)
        return next
      },
      signOut() {
        auth.signOut()
        setSession(null)
      },
    }),
    [session],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
