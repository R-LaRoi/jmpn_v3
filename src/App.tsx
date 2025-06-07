import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './components/hooks/useAuth'
import { AuthForm } from './components/auth/AuthForm'
import { Layout } from './components/Layout'
import { Dashboard } from './components/Dashboard'
import { Profile } from './components/Profile'
import { History } from './components/History'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user) {
    return <AuthForm />
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/history" element={<History />} />
          <Route path="/" element={<Navigate to="/dashboard\" replace />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App