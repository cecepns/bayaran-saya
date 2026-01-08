import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { userAPI } from '../utils/api'
import { Wallet, CheckCircle, Clock } from 'lucide-react'

const Pay = () => {
  const navigate = useNavigate()
  const [availableBalance, setAvailableBalance] = useState(5000.00)
  const [amount, setAmount] = useState('0.00')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchBalance()
  }, [])

  const fetchBalance = async () => {
    try {
      const response = await userAPI.getBalance()
      setAvailableBalance(response.data.balance || 5000.00)
    } catch (error) {
      console.error('Error fetching balance:', error)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const handleQuickAdd = (value) => {
    const current = parseFloat(amount) || 0
    const newAmount = current + value
    setAmount(newAmount.toFixed(2))
  }

  const handleAmountChange = (e) => {
    const value = e.target.value
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setAmount(value)
    }
  }

  const handleReload = async () => {
    const reloadAmount = parseFloat(amount)
    
    if (reloadAmount <= 0) {
      alert('Please enter a valid reload amount')
      return
    }

    if (reloadAmount < 10) {
      alert('Minimum reload amount is RM 10.00')
      return
    }

    try {
      setLoading(true)
      const response = await userAPI.pay({
        amount: reloadAmount,
        description: description || `Reload request`,
      })
      
      setSuccess(true)
      setTimeout(() => {
        navigate('/')
      }, 3000)
    } catch (error) {
      console.error('Reload request error:', error)
      alert(error.response?.data?.message || 'Reload request failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header title="Tambah Baki" showBack />
        <div className="bg-white rounded-t-3xl mt-4 p-6 min-h-[calc(100vh-80px)] flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Clock size={48} className="text-blue-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Request Submitted!</h2>
          <p className="text-gray-600 text-center mb-2">
            Your reload request of {formatCurrency(parseFloat(amount))} has been submitted.
          </p>
          <p className="text-sm text-gray-500 text-center mb-4">
            Waiting for admin approval. You will be notified once approved.
          </p>
          <p className="text-xs text-gray-400">Redirecting to home...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="Tambah Baki" showBack />
      
      <div className="bg-white rounded-t-3xl mt-4 p-6 min-h-[calc(100vh-80px)]">
        <div className="mb-6">
          <div className="text-sm text-gray-600 mb-1">Current Balance</div>
          <div className="text-2xl font-bold text-primary">
            {formatCurrency(availableBalance)}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-2">
            Reload Amount (RM)
          </label>
          <div className="relative">
            <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0.00"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-800"
            />
          </div>
          
          <div className="flex gap-3 mt-3">
            <button
              onClick={() => handleQuickAdd(10)}
              className="flex-1 px-4 py-2 bg-primary-light text-primary rounded-lg font-medium hover:bg-primary/10 transition-colors"
            >
              +10
            </button>
            <button
              onClick={() => handleQuickAdd(50)}
              className="flex-1 px-4 py-2 bg-primary-light text-primary rounded-lg font-medium hover:bg-primary/10 transition-colors"
            >
              +50
            </button>
            <button
              onClick={() => handleQuickAdd(100)}
              className="flex-1 px-4 py-2 bg-primary-light text-primary rounded-lg font-medium hover:bg-primary/10 transition-colors"
            >
              +100
            </button>
            <button
              onClick={() => handleQuickAdd(500)}
              className="flex-1 px-4 py-2 bg-primary-light text-primary rounded-lg font-medium hover:bg-primary/10 transition-colors"
            >
              +500
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Minimum: RM 10.00</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-2">
            Description (Optional)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Top up for monthly expenses"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <button
          onClick={handleReload}
          disabled={loading}
          className="w-full bg-primary text-white py-4 rounded-lg font-semibold text-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Request Reload'}
        </button>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 font-medium mb-1">Important Notes:</p>
          <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
            <li>Minimum reload amount is RM 10.00</li>
            <li>Your request will be reviewed by admin</li>
            <li>You will be notified once your request is approved</li>
            <li>Processing time: Usually within 24 hours</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Pay

