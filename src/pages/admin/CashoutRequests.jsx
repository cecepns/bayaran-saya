import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import { adminAPI } from '../../utils/api'
import { CheckCircle, XCircle, Clock, User, Wallet, Building, CreditCard } from 'lucide-react'

const CashoutRequests = () => {
  const navigate = useNavigate()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [processingId, setProcessingId] = useState(null)

  useEffect(() => {
    fetchRequests()
    // Refresh every 5 seconds
    const interval = setInterval(fetchRequests, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getCashoutRequests()
      setRequests(response.data.requests || [])
    } catch (error) {
      console.error('Error fetching cashout requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-MY', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const parseBankDetails = (description) => {
    // Parse description like: "Cashout to Ahmad (Maybank) - 1234567890"
    const match = description?.match(/Cashout to (.+?) \((.+?)\) - (\d+)/)
    if (match) {
      return {
        accountName: match[1],
        bankName: match[2],
        accountNumber: match[3],
      }
    }
    return {
      accountName: '-',
      bankName: '-',
      accountNumber: description || '-',
    }
  }

  const handleApprove = async (requestId) => {
    if (!window.confirm('Are you sure you want to approve this cashout request? This confirms that payment has been made to the user.')) {
      return
    }

    try {
      setProcessingId(requestId)
      await adminAPI.approveCashoutRequest(requestId)
      alert('Cashout request approved successfully!')
      fetchRequests()
    } catch (error) {
      console.error('Error approving request:', error)
      alert(error.response?.data?.message || 'Failed to approve request')
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (requestId) => {
    const reason = prompt('Please enter rejection reason (optional):')
    
    if (!window.confirm('Are you sure you want to reject this cashout request? The amount will be refunded to the user\'s balance.')) {
      return
    }

    try {
      setProcessingId(requestId)
      await adminAPI.rejectCashoutRequest(requestId, { reason })
      alert('Cashout request rejected and balance refunded successfully!')
      fetchRequests()
    } catch (error) {
      console.error('Error rejecting request:', error)
      alert(error.response?.data?.message || 'Failed to reject request')
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="Cashout Requests" showBack />
      
      <div className="p-5">
        <div className="mb-4">
          <h1 className="text-xl font-bold text-gray-800 mb-1">Pending Cashout Requests</h1>
          <p className="text-sm text-gray-600">
            Review and process user cashout/withdrawal requests
          </p>
        </div>

        {loading && requests.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <div className="text-gray-500">Loading requests...</div>
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <Clock size={48} className="mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600">No pending cashout requests</p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((request) => {
              const bankDetails = parseBankDetails(request.description)
              return (
                <div
                  key={request.id}
                  className="bg-white rounded-xl p-5 shadow-sm border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <User size={18} className="text-gray-500" />
                        <span className="font-semibold text-gray-800">
                          {request.user_name}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-1">
                        Phone: {request.user_phone}
                      </div>
                      <div className="text-xs text-gray-500">
                        Requested: {formatDate(request.created_at)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                        On Process
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Wallet size={18} className="text-red-500" />
                        <span className="text-sm text-gray-600">Cashout Amount:</span>
                      </div>
                      <span className="text-lg font-bold text-red-600">
                        -{formatCurrency(parseFloat(request.amount))}
                      </span>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 mb-3 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Building size={16} className="text-gray-500" />
                        <span className="text-gray-600">Bank:</span>
                        <span className="font-medium text-gray-800">{bankDetails.bankName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CreditCard size={16} className="text-gray-500" />
                        <span className="text-gray-600">Account:</span>
                        <span className="font-medium text-gray-800">{bankDetails.accountNumber}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <User size={16} className="text-gray-500" />
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium text-gray-800">{bankDetails.accountName}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-600">User's Current Balance:</span>
                      <span className="text-sm font-medium text-gray-800">
                        {formatCurrency(parseFloat(request.current_balance))}
                      </span>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleApprove(request.id)}
                        disabled={processingId === request.id}
                        className="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={18} />
                        {processingId === request.id ? 'Processing...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        disabled={processingId === request.id}
                        className="flex-1 bg-red-600 text-white py-2.5 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <XCircle size={18} />
                        Reject
                      </button>
                    </div>

                    <p className="text-xs text-gray-500 mt-3 text-center">
                      Note: Rejecting will refund the amount to user's balance
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default CashoutRequests


