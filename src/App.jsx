import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { UserRoute, AdminRoute, PublicRoute } from './components/ProtectedRoute'

// Auth Pages
import Login from './pages/Login'
import Register from './pages/Register'

// User Pages
import UserDashboard from './pages/UserDashboard'
import Transfer from './pages/Transfer'
import Scan from './pages/Scan'
import Pay from './pages/Pay'
import Cashout from './pages/Cashout'
import TransactionHistory from './pages/TransactionHistory'
import Profile from './pages/Profile'

// Admin Pages
import AdminDashboard from './pages/AdminDashboard'
import UserManagement from './pages/admin/UserManagement'
import BalanceManagement from './pages/admin/BalanceManagement'
import ReloadRequests from './pages/admin/ReloadRequests'
import CashoutRequests from './pages/admin/CashoutRequests'
import AdminTransactionHistory from './pages/admin/TransactionHistory'

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes (redirect to dashboard if logged in) */}
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />

        {/* User Protected Routes */}
        <Route path="/" element={
          <UserRoute>
            <UserDashboard />
          </UserRoute>
        } />
        <Route path="/transfer" element={
          <UserRoute>
            <Transfer />
          </UserRoute>
        } />
        <Route path="/scan" element={
          <UserRoute>
            <Scan />
          </UserRoute>
        } />
        <Route path="/pay" element={
          <UserRoute>
            <Pay />
          </UserRoute>
        } />
        <Route path="/cashout" element={
          <UserRoute>
            <Cashout />
          </UserRoute>
        } />
        <Route path="/transactions" element={
          <UserRoute>
            <TransactionHistory />
          </UserRoute>
        } />
        <Route path="/profile" element={
          <UserRoute>
            <Profile />
          </UserRoute>
        } />

        {/* Admin Protected Routes */}
        <Route path="/admin" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
        <Route path="/admin/users" element={
          <AdminRoute>
            <UserManagement />
          </AdminRoute>
        } />
        <Route path="/admin/balance" element={
          <AdminRoute>
            <BalanceManagement />
          </AdminRoute>
        } />
        <Route path="/admin/reload-requests" element={
          <AdminRoute>
            <ReloadRequests />
          </AdminRoute>
        } />
        <Route path="/admin/cashout-requests" element={
          <AdminRoute>
            <CashoutRequests />
          </AdminRoute>
        } />
        <Route path="/admin/transactions" element={
          <AdminRoute>
            <AdminTransactionHistory />
          </AdminRoute>
        } />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
