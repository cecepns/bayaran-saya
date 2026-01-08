import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Loading spinner component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="text-blue-200/70">Loading...</p>
    </div>
  </div>
)

// Protected Route for authenticated users
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

// Protected Route for regular users only
export const UserRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // If admin tries to access user routes, redirect to admin dashboard
  if (isAdmin) {
    return <Navigate to="/admin" replace />
  }

  return <div className="max-w-4xl mx-auto">{children}</div>
}

// Protected Route for admin users only
export const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (!isAdmin) {
    // If regular user tries to access admin routes, redirect to user dashboard
    return <Navigate to="/" replace />
  }

  return <div className="max-w-4xl mx-auto">{children}</div>
}

// Public Route - redirect to dashboard if already authenticated
export const PublicRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (isAuthenticated) {
    // Redirect based on role
    return <Navigate to={isAdmin ? '/admin' : '/'} replace />
  }

  return children
}

export default ProtectedRoute


