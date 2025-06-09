import React, { useEffect, useState } from 'react'

type UserProfile = {
  email: string
  full_Name: string
  // add other fields if needed
}

export function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    async function fetchProfile() {
      try {
        // CHANGE THIS LINE: Point to your actual /api/auth/me endpoint
        const res = await fetch('/api/auth/me', {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Important for sending cookies
        })

        if (res.status === 401) {
          // Handle unauthenticated state explicitly, e.g., redirect to login
          throw new Error('Not authenticated. Please sign in.')
        }

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to fetch profile');
        }

        const data = await res.json()
        setProfile(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  if (loading) return <div className="text-center mt-8">Loading...</div>
  if (error) return <div className="text-center mt-8 text-red-600">{error}</div>
  if (!profile) return <div className="text-center mt-8">No profile data.</div>

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <div className="mb-4">
        <label className="block text-sm font-semibold">Full Name</label>
        <div className="mt-1">{profile.full_Name}</div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-semibold">Email</label>
        <div className="mt-1">{profile.email}</div>
      </div>
    </div>
  )
}