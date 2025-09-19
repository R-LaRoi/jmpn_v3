import { useEffect, useState } from 'react'
import { useAuth } from './useAuth'

export type Routine = {
  _id?: string
  id?: string
  user_id?: string
  content?: string
  date: string
  created_at?: string
  duration: string
  type: string
  level: string
  weekday: string
  exercises: string[]
}

export function useRoutines() {
  const { user, isAuthenticated } = useAuth()
  const [routines, setRoutines] = useState<Routine[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRoutines = async () => {
    if (!isAuthenticated || !user?._id) {
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`/api/weekly-routines/${user._id}`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setRoutines(data)
      } else {
        setError('Failed to fetch routines')
      }
    } catch (err) {
      setError('Failed to fetch routines')
    } finally {
      setLoading(false)
    }
  }

  const addRoutine = async (routineData: Partial<Routine>) => {
    try {
      const res = await fetch('/api/routines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(routineData),
      })
      if (!res.ok) throw new Error('Failed to add routine')
      const newRoutine = await res.json()
      setRoutines((prev) => [newRoutine, ...prev])
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  const refreshRoutines = () => {
    fetchRoutines()
  }

  const fetchMonthlyRoutines = async (date: Date) => {
    // Implementation for monthly routines if needed
    console.log('Fetching monthly routines for:', date)
  }

  useEffect(() => {
    fetchRoutines()
  }, [isAuthenticated, user])

  return {
    routines,
    loading,
    error,
    addRoutine,
    fetchMonthlyRoutines,
    refreshRoutines
  }
}
