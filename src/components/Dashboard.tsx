import React, { useState } from 'react'
import { Plus, Calendar, User } from 'lucide-react'
import { format, parseISO } from 'date-fns'


import { useRoutines } from './hooks/useRoutines'
import { useProfile } from './hooks/useProfile'

export function Dashboard() {
  const { routines, loading, addRoutine } = useRoutines()
  const { profile } = useProfile()
  const [routineInput, setRoutineInput] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleAddRoutine = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!routineInput.trim()) return

    setSubmitting(true)
    const result = await addRoutine(routineInput)
    if (result.success) {
      setRoutineInput('')
    }
    setSubmitting(false)
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <section className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4">
          <div className="bg-primary-100 rounded-full p-3">
            <User className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {profile?.full_name || 'there'}!
            </h1>
            <p className="text-gray-600">Ready to log your workout routine?</p>
          </div>
        </div>
      </section>

      {/* Add Routine Form */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Today's Routine
        </h2>
        <form onSubmit={handleAddRoutine} className="space-y-4">
          <textarea
            value={routineInput}
            onChange={(e) => setRoutineInput(e.target.value)}
            placeholder="Describe your workout routine for today..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          />
          <button
            type="submit"
            disabled={submitting || !routineInput.trim()}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4 mr-2" />
            {submitting ? 'Adding...' : 'Add Routine'}
          </button>
        </form>
      </section>

      {/* Recent Routines */}
      <section className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Routines (Last 7 Days)
          </h2>
          <Calendar className="w-5 h-5 text-gray-400" />
        </div>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading routines...</p>
          </div>
        ) : routines.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No routines logged yet. Add your first routine above!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {routines.map((routine) => (
              <div
                key={routine._id || routine.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-primary-600">
                    {format(parseISO(routine.date), 'EEEE, MMMM d, yyyy')}
                  </span>
                  <span className="text-xs text-gray-500">
                    {format(parseISO(routine.created_at), 'h:mm a')}
                  </span>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{routine.content}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}