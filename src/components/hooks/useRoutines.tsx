import { useEffect, useState } from 'react'

export type Routine = {
  _id?: string
  id?: string
  user_id: string
  content: string
  date: string
  created_at: string
}

export function useRoutines() {
  const [routines, setRoutines] = useState<Routine[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    fetch('/api/routines', {
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch routines')
        return res.json()
      })
      .then((data) => setRoutines(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const addRoutine = async (content: string) => {
    try {
      const res = await fetch('/api/routines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content }),
      })
      if (!res.ok) throw new Error('Failed to add routine')
      const newRoutine = await res.json()
      setRoutines((prev) => [newRoutine, ...prev])
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  const fetchMonthlyRoutines = async (date: Date) => {
    // You should implement this to fetch routines for a specific month!
    // For now, it's a stub:
    // setRoutines(await fetch(...))
  }

  return { routines, loading, error, addRoutine, fetchMonthlyRoutines }
}
