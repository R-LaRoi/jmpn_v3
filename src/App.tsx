
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './components/Landing';

import AuthForm from './components/auth/AuthForm'
import { Layout } from './components/Layout'
import { Dashboard } from './components/Dashboard'
import { Profile } from './components/Profile'
import { History } from './components/History'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<AuthForm />} />
        <Route path="/register" element={<AuthForm />} />
        <Route path="/dashboard" element={

          <Layout>
            <Dashboard />
          </Layout>

        } />
        <Route path="/profile" element={

          <Layout>
            <Profile />
          </Layout>

        } />
        <Route path="/history" element={

          <Layout>
            <History />
          </Layout>

        } />
      </Routes>
    </Router >
  );
}

export default App