import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { userAPI } from '../utils/api'
import { DollarSign, CreditCard, CheckCircle } from 'lucide-react'

const Cashout = () => {
  const navigate = useNavigate()
  const [availableBalance, setAvailableBalance] = useState(5000.00)
  const [amount, setAmount] = useState('0.00')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountName, setAccountName] = useState('')
  const [bankName, setBankName] = useState('')
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

  const handleCashout = async () => {
    const cashoutAmount = parseFloat(amount)
    
    if (cashoutAmount <= 0) {
      alert('Please enter a valid cashout amount')
      return
    }

    if (cashoutAmount < 10) {
      alert('Minimum cashout amount is RM 10.00')
      return
    }

    if (cashoutAmount > availableBalance) {
      alert('Insufficient balance')
      return
    }

    if (!accountNumber || accountNumber.length < 10) {
      alert('Please enter a valid account number (minimum 10 digits)')
      return
    }

    if (!accountName || accountName.trim().length < 3) {
      alert('Please enter account holder name')
      return
    }

    if (!bankName || bankName.trim().length < 2) {
      alert('Please enter bank name')
      return
    }

    const confirmMessage = `Confirm cashout of ${formatCurrency(cashoutAmount)} to:\n\nAccount: ${accountNumber}\nName: ${accountName}\nBank: ${bankName}`
    
    if (!window.confirm(confirmMessage)) {
      return
    }

    try {
      setLoading(true)
      const response = await userAPI.cashout({
        amount: cashoutAmount,
        accountNumber,
        accountName,
        bankName,
      })
      
      setSuccess(true)
      setTimeout(() => {
        navigate('/')
      }, 3000)
    } catch (error) {
      console.error('Cashout error:', error)
      alert(error.response?.data?.message || 'Cashout failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header title="Cashout" showBack />
        <div className="bg-white rounded-t-3xl mt-4 p-6 min-h-[calc(100vh-80px)] flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle size={48} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Cashout Request Submitted!</h2>
          <p className="text-gray-600 text-center mb-2">
            Your cashout request of {formatCurrency(parseFloat(amount))} has been submitted.
          </p>
          <p className="text-sm text-gray-500 text-center mb-4">
            Funds will be transferred within 1-2 business days.
          </p>
          <p className="text-xs text-gray-400">Redirecting to home...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="Cashout" showBack />
      
      <div className="bg-white rounded-t-3xl mt-4 p-6 min-h-[calc(100vh-80px)]">
        <div className="mb-6">
          <div className="text-sm text-gray-600 mb-1">Available Balance</div>
          <div className="text-2xl font-bold text-primary">
            {formatCurrency(availableBalance)}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-2">
            Cashout Amount (RM)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
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
            Bank Name
          </label>
          <input
            type="text"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            placeholder="e.g., Maybank, CIMB, Public Bank"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-2">
            Account Number
          </label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter account number"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-2">
            Account Holder Name
          </label>
          <input
            type="text"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            placeholder="Enter account holder name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <button
          onClick={handleCashout}
          disabled={loading}
          className="w-full bg-primary text-white py-4 rounded-lg font-semibold text-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Request Cashout'}
        </button>

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800 font-medium mb-1">Important Notes:</p>
          <ul className="text-xs text-yellow-700 space-y-1 list-disc list-inside">
            <li>Minimum cashout amount is RM 10.00</li>
            <li>Processing time: 1-2 business days</li>
            <li>Please ensure account details are correct</li>
            <li>A small processing fee may apply</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Cashout

