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

  // Fetch the currently authenticated user on mount
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

  // Sign up function
  const signup = async (email: string, password: string, full_name: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, full_name }),
      })



      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Signup failed')
      setUser(data.user || data) // adjust as per your backend response
      return data
    } catch (err: any) {
      setError(err.message)
      setUser(null)
      return null
    } finally {
      setLoading(false)
    }
  }

  // Sign in function
  const signin = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Signin failed')
      setUser(data.user || data) // adjust as per your backend response
      return data
    } catch (err: any) {
      setError(err.message)
      setUser(null)
      return null
    } finally {
      setLoading(false)
    }
  }

  // Sign out function
  const signOut = async () => {
    setLoading(true)
    setError(null)
    try {
      await fetch('/api/auth/signout', { method: 'POST', credentials: 'include' })
      setUser(null)
      window.location.href = '/signin'
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { user, loading, error, signup, signin, signOut }
}