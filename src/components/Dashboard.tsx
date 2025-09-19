import React, { useState } from 'react'
import { Calendar, User } from 'lucide-react'
import { format, parseISO, subDays } from 'date-fns'
import { useRoutines, Routine } from './hooks/useRoutines'
import { useProfile } from './hooks/useProfile'
import RoutineForm from './RoutineForm'

interface DayData {
  dayName: string
  date: string
  hasRoutine: boolean
  routine?: Routine
}

export function Dashboard() {
  const { routines, loading, refreshRoutines } = useRoutines()
  const { profile } = useProfile()
  
  // Add modal state variables
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null)

  // Generate last 7 days
  const getLastSevenDays = (): DayData[] => {
    const days: DayData[] = []
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i)
      const dayName = format(date, 'EEEE').toLowerCase()
      const dateString = format(date, 'yyyy-MM-dd')

      // Find routine for this day
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

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedRoutine(null)
  }

  const lastSevenDays = getLastSevenDays()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Welcome Section */}
        <section className="bg-white  p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-[#E8175D]  flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Welcome back, {profile?.full_name || 'there'}!
              </h1>
              <p className="text-gray-600">Ready to log your workout routine?</p>
            </div>
          </div>
        </section>

        {/* Routine Form */}
        <RoutineForm onRoutineSaved={refreshRoutines} />

        {/* Last 7 Days */}
        <section className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Last 7 Days
            </h2>
            <div className="w-10 h-10 bg-[#E8175D] rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="relative mx-auto w-8 h-8 mb-3">
                <div className="absolute inset-0 rounded-full border-2 border-gray-200"></div>
                <div className="absolute inset-0 rounded-full border-2 border-[#E8175D] border-t-transparent animate-spin"></div>
              </div>
              <p className="text-gray-600 text-sm">Loading your workout history...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lastSevenDays.map((day) => (
                <div
                  key={day.date}
                  className="relative bg-white text-black px-8 py-4 rounded-full transition-all duration-200 cursor-pointer border border-gray-200 shadow-md hover:shadow-lg hover:bg-[#E8175D]"
                  onClick={() => {
                    if (day.routine) {
                      // Add state management for modal visibility
                      setIsModalOpen(true);
                      // Pass the routine data to modal component
                      setSelectedRoutine(day.routine);
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        {day.hasRoutine ? (
                          <div className="w-8 h-8 bg-[#E8175D] rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        ) : (
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <div className="w-4 h-4 border border-gray-400 rounded-full"></div>
                          </div>
                        )}
                      </div>

                      <div>
                        <span className="font-semibold capitalize text-base block text-black">
                          {day.dayName}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {format(parseISO(day.date), 'MMM d')}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      {day.hasRoutine ? (
                        <div className="px-3 py-1 bg-[#E8175D] text-white rounded-full text-xs font-medium">
                          View
                        </div>
                      ) : (
                        <div className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                          {/* Removed 'Add' text */}
                        </div>
                      )}
                    </div>
                  </div>

                  {day.hasRoutine && day.routine && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="grid grid-cols-3 gap-3 text-xs">
                        <div>
                          <span className="text-gray-500 block">Type</span>
                          <span className="font-medium text-black">{day.routine.type}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Duration</span>
                          <span className="font-medium text-black">{day.routine.duration}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Exercises</span>
                          <span className="font-medium text-black">{day.routine.exercises?.length || 0}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
        
        {/* Modal for displaying routine details */}
        {isModalOpen && selectedRoutine && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Workout Details</h3>
                <button 
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700">Type:</span>
                  <span className="ml-2">{selectedRoutine.type}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Duration:</span>
                  <span className="ml-2">{selectedRoutine.duration}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Level:</span>
                  <span className="ml-2">{selectedRoutine.level}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Date:</span>
                  <span className="ml-2">{format(parseISO(selectedRoutine.date), 'MMMM d, yyyy')}</span>
                </div>
                {selectedRoutine.exercises && selectedRoutine.exercises.length > 0 && (
                  <div>
                    <span className="font-medium text-gray-700">Exercises:</span>
                    <ul className="ml-2 mt-1 space-y-1">
                      {selectedRoutine.exercises.map((exercise, index) => (
                        <li key={index} className="text-sm text-gray-600">• {exercise}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}