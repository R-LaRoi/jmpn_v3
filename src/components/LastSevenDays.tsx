import React from 'react'
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

export function LastSevenDays({ routines, loading }: LastSevenDaysProps) {
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
            className={`
              relative rounded-2xl px-6 py-4 transition-all duration-300 transform hover:scale-[1.02] border-2
              ${day.hasRoutine
                ? 'bg-gradient-to-r from-pink-50 to-red-50 border-pink-200 shadow-md hover:shadow-lg'
                : 'bg-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-md'
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

              <div className="text-right">
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
  )
}