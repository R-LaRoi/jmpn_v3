import { useEffect, useState } from 'react'

// Add API base URL
const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:8000'

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
    fetch(`${API_BASE_URL}/api/auth/me`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.error || 'Not authenticated')
        }
        return res.json()
      })
      .then((data) => {
        console.log('User authenticated:', data)
        setUser(data)
        setError(null)
      })
      .catch((err) => {
        console.log('Authentication check failed:', err.message)
        setUser(null)
        setError(null) // Don't show error for initial auth check
      })
      .finally(() => setLoading(false))
  }, [])

  // Sign up function
  const signup = async (email: string, password: string, full_name: string) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, full_name }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Signup failed')
      }

      console.log('Signup successful:', data)
      setUser(data.user)
      return { success: true, message: data.message }
    } catch (err: any) {
      console.error('Signup error:', err.message)
      setError(err.message)
      setUser(null)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  // Sign in function
  const signin = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Signin failed')
      }

      console.log('Signin successful:', data)
      setUser(data.user)
      return { success: true, message: data.message }
    } catch (err: any) {
      console.error('Signin error:', err.message)
      setError(err.message)
      setUser(null)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  // Sign out function
  const signOut = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/signout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Signout failed')
      }

      console.log('Signout successful')
      setUser(null)
      setError(null)

      return { success: true }
    } catch (err: any) {
      console.error('Signout error:', err.message)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  // Helper function to check if user is authenticated
  const isAuthenticated = !!user && !loading

  // Helper function to get user ID
  const getUserId = () => user?._id || null

  return {
    user,
    loading,
    error,
    signup,
    signin,
    signOut,
    isAuthenticated,
    getUserId
  }
}