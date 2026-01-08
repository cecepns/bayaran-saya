import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check if user is authenticated on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token')
      if (storedToken) {
        try {
          // Set token in axios headers
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
          
          // Verify token and get user data
          const response = await api.get('/auth/me')
          setUser(response.data.user)
          setToken(storedToken)
        } catch (err) {
          // Token is invalid or expired
          console.error('Auth initialization error:', err)
          localStorage.removeItem('token')
          delete api.defaults.headers.common['Authorization']
          setToken(null)
          setUser(null)
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  // Login function
  const login = async (phone, password) => {
    try {
      setError(null)
      const response = await api.post('/auth/login', { phone, password })
      
      const { token: newToken, user: userData } = response.data
      
      // Store token
      localStorage.setItem('token', newToken)
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
      
      setToken(newToken)
      setUser(userData)
      
      return { success: true, user: userData }
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed'
      setError(message)
      return { success: false, message }
    }
  }

  // Register function
  const register = async (name, phone, email, password) => {
    try {
      setError(null)
      const response = await api.post('/auth/register', { 
        name, 
        phone, 
        email: email || undefined, 
        password 
      })
      
      const { token: newToken, user: userData } = response.data
      
      // Store token
      localStorage.setItem('token', newToken)
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
      
      setToken(newToken)
      setUser(userData)
      
      return { success: true, user: userData }
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed'
      setError(message)
      return { success: false, message }
    }
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
    setToken(null)
    setUser(null)
    setError(null)
  }

  // Update user data (for refreshing balance, etc.)
  const refreshUser = async () => {
    try {
      const response = await api.get('/auth/me')
      setUser(response.data.user)
      return response.data.user
    } catch (err) {
      console.error('Failed to refresh user:', err)
      // If token is invalid, logout
      if (err.response?.status === 401 || err.response?.status === 403) {
        logout()
      }
      return null
    }
  }

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setError(null)
      await api.post('/auth/change-password', { currentPassword, newPassword })
      return { success: true }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to change password'
      setError(message)
      return { success: false, message }
    }
  }

  // Clear error
  const clearError = () => setError(null)

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin',
    isUser: user?.role === 'user',
    login,
    register,
    logout,
    refreshUser,
    changePassword,
    clearError,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext


