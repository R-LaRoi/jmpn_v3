import React, { useState } from 'react'
import { useRoutines } from './hooks/useRoutines'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { format, parseISO, addMonths, subMonths } from 'date-fns'

export function History() {
  const { routines, loading, fetchMonthlyRoutines } = useRoutines()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [view, setView] = useState<'recent' | 'monthly'>('recent')

  React.useEffect(() => {
    if (view === 'monthly') {
      fetchMonthlyRoutines(currentMonth)
    }
  }, [currentMonth, view])

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const isCurrentMonth = format(currentMonth, 'yyyy-MM') === format(new Date(), 'yyyy-MM')

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Routine History</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setView('recent')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === 'recent'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Recent (7 days)
            </button>
            <button
              onClick={() => setView('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === 'monthly'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Monthly View
            </button>
          </div>
        </div>

        {view === 'monthly' && (
          <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
            <button
              onClick={handlePreviousMonth}
              className="p-2 rounded-md hover:bg-gray-200 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-semibold text-gray-900">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>

            <button
              onClick={handleNextMonth}
              disabled={isCurrentMonth}
              className="p-2 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading routines...</p>
          </div>
        ) : routines.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {view === 'recent'
                ? 'No routines in the last 7 days.'
                : `No routines for ${format(currentMonth, 'MMMM yyyy')}.`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {routines.map((routine) => (
              <div
                key={routine.id}
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
      </div>
    </div>
  )
}