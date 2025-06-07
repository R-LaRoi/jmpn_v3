import { useEffect, useState } from 'react'

export type User = {
  _id: string
  email: string
  full_name: string
  // add more fields as needed
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    fetch('/api/auth/me', { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error('Not authenticated')
        return res.json()
      })
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const signOut = async () => {
    await fetch('/api/auth/signout', { method: 'POST', credentials: 'include' })
    setUser(null)
    window.location.href = '/signin'
  }

  return { user, loading, error, signOut }
}