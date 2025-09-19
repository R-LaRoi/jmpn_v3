import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './hooks/useAuth';

// Move the interface to the top of the file
interface RoutineFormProps {
  onRoutineSaved?: () => void;
}

// Update the component declaration to accept props
export default function RoutineForm({ onRoutineSaved }: RoutineFormProps) {
  const { user, isAuthenticated, loading } = useAuth();
  const [formData, setFormData] = useState({
    duration: '',
    type: '',
    level: '',
    exercises: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState('');
  const [weekday, setWeekday] = useState('');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const currentDate = new Date();
        const options = {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        };

        setDate(currentDate.toLocaleDateString(undefined, {
          weekday: 'long' as const,
          year: 'numeric' as const,
          month: 'long' as const,
          day: 'numeric' as const
        }));
        setWeekday(currentDate.toLocaleDateString(undefined, { weekday: 'long' }));
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };
    fetchInitialData();
  }, []);

  function handleChange(name, value) {
    setFormData({ ...formData, [name]: value });
  }

  // Add this to the RoutineForm component props
  interface RoutineFormProps {
    onRoutineSaved?: () => void
  }

  // In the handleSaveRoutine function, after successful save:
  const handleSaveRoutine = async () => {
    const { duration, type, level, exercises } = formData;

    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      window.alert('Error: Please log in to save routines.');
      return;
    }

    if (!duration || !type || !level || !exercises || exercises.length === 0) {
      window.alert('Error: Please fill in all required fields.');
      return;
    }

    const exercisesArray = exercises.split('\n').map(exercise => exercise.trim()).filter(exercise => exercise !== '');

    const routineData = {
      userId: user._id, // Use the authenticated user's ID
      duration: duration,
      type: type,
      level: level,
      date: date,
      weekday: weekday,
      exercises: exercisesArray,
    };

    console.log('Data being sent:', routineData);
    setIsLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:8000/save-routine',
        routineData,
        {
          withCredentials: true, // Important: Include cookies for authentication
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      console.log(response.data);
      window.alert('Submitted: Routine saved successfully!');
      setFormData({
        duration: '',
        type: '',
        level: '',
        exercises: '',
      });
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        window.alert('Error: Please log in to save routines.');
      } else if (error.response?.status === 403) {
        window.alert('Error: Access denied.');
      } else {
        window.alert('Error: Failed to save routine. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  // Show loading state while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="text-center p-4">
        <p>Please log in to create and save routines.</p>
      </div>
    );
  }

  return (
    <section className="bg-white rounded-2xl shadow-sm border-t-4 border-[#E8175D] p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Today's Routine
        </h2>
        <div className="inline-flex items-center px-3 py-1 bg-[#E8175D] text-white rounded-full text-sm font-medium">
          {weekday}
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Type (e.g., Cardio, Strength)"
            value={formData.type}
            onChange={(e) => handleChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#E8175D] focus:ring-2 focus:ring-[#E8175D] focus:ring-opacity-20 transition-all duration-200 text-gray-900 placeholder-gray-500"
          />
          <input
            type="text"
            placeholder="Duration (e.g., 30 min)"
            value={formData.duration}
            onChange={(e) => handleChange('duration', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#E8175D] focus:ring-2 focus:ring-[#E8175D] focus:ring-opacity-20 transition-all duration-200 text-gray-900 placeholder-gray-500"
          />
        </div>

        <input
          type="text"
          placeholder="Level (e.g., Beginner, Intermediate)"
          value={formData.level}
          onChange={(e) => handleChange('level', e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#E8175D] focus:ring-2 focus:ring-[#E8175D] focus:ring-opacity-20 transition-all duration-200 text-gray-900 placeholder-gray-500"
        />

        <textarea
          placeholder="Exercises (e.g., Pushups, Squats)\n(Enter each exercise on a new line)"
          rows={4}
          value={formData.exercises}
          onChange={(e) => handleChange('exercises', e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#E8175D] focus:ring-2 focus:ring-[#E8175D] focus:ring-opacity-20 transition-all duration-200 text-gray-900 placeholder-gray-500 resize-none"
        />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-[#E8175D] rounded-full"></div>
            <p className="text-gray-600 text-sm font-medium">Date: {date}</p>
          </div>
          <button
            onClick={handleSaveRoutine}
            disabled={isLoading}
            className="px-6 py-2 bg-[#E8175D] text-white rounded-full font-medium hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[#E8175D] focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </div>
            ) : (
              'Save Workout'
            )}
          </button>
        </div>
      </div>
    </section>
  );
}