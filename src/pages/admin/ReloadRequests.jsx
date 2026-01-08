import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import { adminAPI } from '../../utils/api'
import { CheckCircle, XCircle, Clock, User, Wallet } from 'lucide-react'

const ReloadRequests = () => {
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
      const response = await adminAPI.getReloadRequests()
      setRequests(response.data.requests || [])
    } catch (error) {
      console.error('Error fetching reload requests:', error)
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

  const handleApprove = async (requestId) => {
    if (!window.confirm('Are you sure you want to approve this reload request?')) {
      return
    }

    try {
      setProcessingId(requestId)
      await adminAPI.approveReloadRequest(requestId)
      alert('Reload request approved successfully!')
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
    
    try {
      setProcessingId(requestId)
      await adminAPI.rejectReloadRequest(requestId, { reason })
      alert('Reload request rejected successfully!')
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
      <Header title="Reload Requests" showBack />
      
      <div className="p-5">
        <div className="mb-4">
          <h1 className="text-xl font-bold text-gray-800 mb-1">Pending Reload Requests</h1>
          <p className="text-sm text-gray-600">
            Review and approve or reject user reload requests
          </p>
        </div>

        {loading && requests.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <div className="text-gray-500">Loading requests...</div>
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <Clock size={48} className="mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600">No pending reload requests</p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((request) => (
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
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                      Pending
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Wallet size={18} className="text-primary" />
                      <span className="text-sm text-gray-600">Request Amount:</span>
                    </div>
                    <span className="text-lg font-bold text-primary">
                      {formatCurrency(parseFloat(request.amount))}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">Current Balance:</span>
                    <span className="text-sm font-medium text-gray-800">
                      {formatCurrency(parseFloat(request.current_balance))}
                    </span>
                  </div>

                  {request.description && (
                    <div className="mb-3 p-2 bg-gray-50 rounded text-sm text-gray-600">
                      <strong>Note:</strong> {request.description}
                    </div>
                  )}

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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ReloadRequests

