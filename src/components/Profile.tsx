import React, { useEffect, useState } from 'react'

type UserProfile = {
  email: string
  fullName: string
  // add other fields if needed
}

export function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/user/profile', {
          headers: {
            // If you use JWT in localStorage, pass it here:
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include', // if you use httpOnly cookies for auth
        })
        if (!res.ok) throw new Error('Failed to fetch profile')
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
        <div className="mt-1">{profile.fullName}</div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-semibold">Email</label>
        <div className="mt-1">{profile.email}</div>
      </div>
      {/* Add more fields as needed */}
      {/* Add edit form here if you want users to update their info */}
    </div>
  )
}