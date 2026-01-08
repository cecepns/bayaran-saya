import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import TotalAsset from '../components/TotalAsset'
import ActionButtons from '../components/ActionButtons'
import WalletBalance from '../components/WalletBalance'
import TransactionItem from '../components/TransactionItem'
import { userAPI } from '../utils/api'
import { useAuth } from '../context/AuthContext'

const UserDashboard = () => {
  const navigate = useNavigate()
  const { user, refreshUser } = useAuth()
  const [balance, setBalance] = useState(user?.balance || 0)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  // Update balance when user data changes
  useEffect(() => {
    if (user?.balance !== undefined) {
      setBalance(parseFloat(user.balance))
    }
  }, [user])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [balanceRes, transactionsRes] = await Promise.all([
        userAPI.getBalance(),
        userAPI.getTransactions(1, 5), // Limit to 5 transactions
      ])
      setBalance(balanceRes.data.balance || 0)
      setTransactions(transactionsRes.data.transactions || [])
      
      // Also refresh user data in context
      refreshUser()
    } catch (error) {
      console.error('Error fetching data:', error)
      // Use existing balance from user context
      if (user?.balance) {
        setBalance(parseFloat(user.balance))
      }
    } finally {
      setLoading(false)
    }
  }

  const handleReload = () => {
    console.log('Reload clicked')
    // Implement reload functionality
  }

  const maxTransfer = 5000.00

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <TotalAsset balance={balance} onReload={handleReload} />
      <ActionButtons />
      <WalletBalance balance={balance} maxTransfer={maxTransfer} />
      
      <div className="px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800">Recent Transactions</h2>
          <button
            onClick={() => navigate('/transactions')}
            className="text-primary text-sm font-medium hover:text-primary-dark"
          >
            View All
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-5 text-center text-gray-500">Loading...</div>
          ) : transactions.length === 0 ? (
            <div className="p-5 text-center text-gray-500">No transactions yet</div>
          ) : (
            transactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
