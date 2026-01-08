import React, { useState, useEffect } from 'react'
import Header from '../../components/Header'
import { adminAPI } from '../../utils/api'

const BalanceManagement = () => {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [amount, setAmount] = useState('')
  const [action, setAction] = useState('add') // 'add' or 'subtract'
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getAllUsers()
      setUsers(response.data.users || [])
    } catch (error) {
      console.error('Error fetching users:', error)
      // Mock data
      setUsers([
        { id: 1, name: 'John Doe', phone: '0123456789', balance: 10000.00 },
        { id: 2, name: 'Jane Smith', phone: '0198765432', balance: 5000.00 },
      ])
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const handleUpdateBalance = async () => {
    if (!selectedUser || !amount || parseFloat(amount) <= 0) {
      alert('Please select a user and enter a valid amount')
      return
    }

    try {
      setLoading(true)
      await adminAPI.updateBalance(selectedUser.id, {
        amount: parseFloat(amount),
        action,
      })
      alert('Balance updated successfully!')
      setAmount('')
      setSelectedUser(null)
      fetchUsers()
    } catch (error) {
      console.error('Error updating balance:', error)
      alert(error.response?.data?.message || 'Failed to update balance')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="Balance Management" showBack />
      
      <div className="p-5">
        <div className="bg-white rounded-xl p-5 shadow-sm mb-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Update User Balance</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">Select User</label>
              <select
                value={selectedUser?.id || ''}
                onChange={(e) => {
                  const user = users.find(u => u.id === parseInt(e.target.value))
                  setSelectedUser(user || null)
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select a user...</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.phone}) - {formatCurrency(user.balance || 0)}
                  </option>
                ))}
              </select>
            </div>

            {selectedUser && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Current Balance</div>
                <div className="text-2xl font-bold text-primary">
                  {formatCurrency(selectedUser.balance || 0)}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-600 mb-2">Action</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setAction('add')}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                    action === 'add'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Add Balance
                </button>
                <button
                  onClick={() => setAction('subtract')}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                    action === 'subtract'
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Subtract Balance
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Amount (RM)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <button
              onClick={handleUpdateBalance}
              disabled={loading || !selectedUser || !amount}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Update Balance'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">All Users Balance</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {users.map((user) => (
              <div key={user.id} className="p-5 flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-800">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.phone}</div>
                </div>
                <div className="text-lg font-bold text-primary">
                  {formatCurrency(user.balance || 0)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BalanceManagement

