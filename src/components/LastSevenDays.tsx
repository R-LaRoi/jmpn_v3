import React, { useState } from 'react'
import { format, parseISO, subDays } from 'date-fns'
import { Routine } from './hooks/useRoutines'

interface LastSevenDaysProps {
  routines: Routine[]
  loading: boolean
}

interface DayData {
  dayName: string
  date: string
  hasRoutine: boolean
  routine?: Routine
}

// Modal component for displaying workout details
interface WorkoutModalProps {
  isOpen: boolean
  onClose: () => void
  routine: Routine | null
  dayName: string
  date: string
}

function WorkoutModal({ isOpen, onClose, routine, dayName, date }: WorkoutModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Modal Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 capitalize">{dayName}</h2>
              <p className="text-gray-600">
                {date ? format(parseISO(date), 'MMMM d, yyyy') : 'Date not available'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {routine ? (
            <div className="space-y-6">
              {/* Workout Overview */}
              <div className="bg-gradient-to-r from-pink-50 to-red-50 rounded-2xl p-6 border border-pink-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Workout Overview</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <span className="text-gray-500 block text-sm">Type</span>
                    <span className="font-bold text-gray-900 text-lg">{routine.type || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-sm">Duration</span>
                    <span className="font-bold text-gray-900 text-lg">{routine.duration || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-sm">Level</span>
                    <span className="font-bold text-gray-900 text-lg">{routine.level || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-sm">Exercises</span>
                    <span className="font-bold text-gray-900 text-lg">{routine.exercises?.length || 0}</span>
                  </div>
                </div>
              </div>

              {/* Exercises List */}
              {routine.exercises && routine.exercises.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Exercises</h3>
                  <div className="space-y-3">
                    {routine.exercises.map((exercise, index) => (
                      <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <span className="font-medium text-gray-900">{exercise}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Content */}
              {routine.content && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Notes</h3>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-gray-700">{routine.content}</p>
                  </div>
                </div>
              )}

              {/* Workout Stats */}
              <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Workout Completed! 🎉</h3>
                <p className="text-green-700">Great job on completing your {routine.type?.toLowerCase() || 'workout'}!</p>
                {routine.created_at && (
                  <p className="text-green-600 text-sm mt-2">
                    Completed at: {format(parseISO(routine.created_at), 'h:mm a')}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Rest Day</h3>
              <p className="text-gray-600">No workout scheduled for this day. Rest is important for recovery!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function LastSevenDays({ routines, loading }: LastSevenDaysProps) {
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const getLastSevenDays = (): DayData[] => {
    const days: DayData[] = []
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i)
      const dayName = format(date, 'EEEE').toLowerCase()
      const dateString = format(date, 'yyyy-MM-dd')

      const dayRoutine = routines.find(routine =>
        format(parseISO(routine.date), 'yyyy-MM-dd') === dateString
      )

      days.push({
        dayName,
        date: dateString,
        hasRoutine: !!dayRoutine,
        routine: dayRoutine
      })
    }
    return days
  }

  const handleDayClick = (day: DayData) => {
    setSelectedDay(day)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedDay(null)
  }

  const lastSevenDays = getLastSevenDays()

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <div className="text-center py-12">
          <div className="relative mx-auto w-12 h-12 mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-pink-500 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-600 text-lg font-medium">Loading your workout history...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Last 7 Days
          </h2>
          <p className="text-gray-600">Your workout consistency at a glance</p>
        </div>

        <div className="space-y-4">
          {lastSevenDays.map((day, index) => (
            <div
              key={day.date}
              onClick={() => handleDayClick(day)}
              className={`
                relative rounded-2xl px-6 py-4 transition-all duration-300 transform hover:scale-[1.02] border-2 cursor-pointer
                ${day.hasRoutine
                  ? 'bg-gradient-to-r from-pink-50 to-red-50 border-pink-200 shadow-md hover:shadow-lg hover:from-pink-100 hover:to-red-100'
                  : 'bg-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-md hover:bg-gray-100'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    {day.hasRoutine ? (
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-gray-400 rounded-full"></div>
                      </div>
                    )}
                  </div>

                  <div>
                    <span className={`
                      font-bold capitalize text-lg block
                      ${day.hasRoutine
                        ? 'text-gray-900'
                        : 'text-gray-500'
                      }
                    `}>
                      {day.dayName}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {format(parseISO(day.date), 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {day.hasRoutine ? (
                    <div className="flex items-center space-x-2">
                      <div className="px-3 py-1 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full text-sm font-medium">
                        Completed
                      </div>
                    </div>
                  ) : (
                    <div className="px-3 py-1 bg-gray-200 text-gray-500 rounded-full text-sm">
                      Rest Day
                    </div>
                  )}
                  
                  {/* Click indicator */}
                  <div className="text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>

              {day.hasRoutine && day.routine && (
                <div className="mt-4 pt-4 border-t border-pink-200">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 block">Type</span>
                      <span className="font-medium text-gray-900">{day.routine.type}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Duration</span>
                      <span className="font-medium text-gray-900">{day.routine.duration}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Level</span>
                      <span className="font-medium text-gray-900">{day.routine.level}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Exercises</span>
                      <span className="font-medium text-gray-900">{day.routine.exercises?.length || 0}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <WorkoutModal
        isOpen={isModalOpen}
        onClose={closeModal}
        routine={selectedDay?.routine || null}
        dayName={selectedDay?.dayName || ''}
        date={selectedDay?.date || ''}
      />
    </>
  )
}