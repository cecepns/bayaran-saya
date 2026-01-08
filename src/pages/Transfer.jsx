import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { userAPI } from '../utils/api'

const Transfer = () => {
  const navigate = useNavigate()
  const [availableBalance, setAvailableBalance] = useState(5000.00)
  const [recipientPhone, setRecipientPhone] = useState('')
  const [transferAmount, setTransferAmount] = useState('0.00')
  const [loading, setLoading] = useState(false)

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

  const handleQuickAdd = (amount) => {
    const current = parseFloat(transferAmount) || 0
    const newAmount = current + amount
    setTransferAmount(newAmount.toFixed(2))
  }

  const handleAmountChange = (e) => {
    const value = e.target.value
    // Allow only numbers and decimal point
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setTransferAmount(value)
    }
  }

  const handleTransfer = async () => {
    const amount = parseFloat(transferAmount)
    
    if (!recipientPhone || recipientPhone.length < 10) {
      alert('Please enter a valid recipient phone number')
      return
    }

    if (amount <= 0) {
      alert('Please enter a valid transfer amount')
      return
    }

    if (amount > availableBalance) {
      alert('Insufficient balance')
      return
    }

    try {
      setLoading(true)
      await userAPI.transfer({
        recipientPhone,
        amount,
      })
      alert('Transfer successful!')
      navigate('/')
    } catch (error) {
      console.error('Transfer error:', error)
      alert(error.response?.data?.message || 'Transfer failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="Transfer" showBack />
      
      <div className="bg-white rounded-t-3xl mt-4 p-6 min-h-[calc(100vh-80px)]">
        <div className="mb-6">
          <div className="text-sm text-gray-600 mb-1">Available Balance</div>
          <div className="text-2xl font-bold text-primary">
            {formatCurrency(availableBalance)}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-2">
            Recipient Phone Number
          </label>
          <input
            type="tel"
            value={recipientPhone}
            onChange={(e) => setRecipientPhone(e.target.value)}
            placeholder="e.g., 0123456789"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-2">
            Transfer Amount (RM)
          </label>
          <input
            type="text"
            value={transferAmount}
            onChange={handleAmountChange}
            placeholder="0.00"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-800"
          />
          
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
          </div>
        </div>

        <button
          onClick={handleTransfer}
          disabled={loading}
          className="w-full bg-primary text-white py-4 rounded-lg font-semibold text-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Transfer Now'}
        </button>

        <div className="mt-6 text-sm text-gray-600 text-center">
          Note: Transfers are processed instantly. You can track your transaction status on the home page.
        </div>
      </div>
    </div>
  )
}

export default Transfer

