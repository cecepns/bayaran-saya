import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import { adminAPI } from '../../utils/api'
import { CheckCircle, XCircle, Clock, User, ChevronLeft, ChevronRight } from 'lucide-react'

const TransactionHistory = () => {
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  useEffect(() => {
    fetchTransactions()
  }, [page])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getAllTransactions(page, 10)
      setTransactions(response.data.transactions || [])
      setPagination(response.data.pagination || pagination)
    } catch (error) {
      console.error('Error fetching transactions:', error)
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center gap-1">
            <CheckCircle size={14} />
            Completed
          </span>
        )
      case 'pending':
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium flex items-center gap-1">
            <Clock size={14} />
            Pending
          </span>
        )
      case 'on_process':
        return (
          <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium flex items-center gap-1">
            <Clock size={14} />
            On Process
          </span>
        )
      case 'failed':
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium flex items-center gap-1">
            <XCircle size={14} />
            Failed
          </span>
        )
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
            {status}
          </span>
        )
    }
  }

  const getTypeBadge = (type) => {
    const colors = {
      transfer: 'bg-blue-100 text-blue-800',
      reload: 'bg-green-100 text-green-800',
      cashout: 'bg-red-100 text-red-800',
      pay: 'bg-purple-100 text-purple-800',
      scan: 'bg-indigo-100 text-indigo-800',
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${colors[type] || 'bg-gray-100 text-gray-800'}`}>
        {type}
      </span>
    )
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPage(newPage)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null

    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-6">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1 || loading}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
        
        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
            >
              1
            </button>
            {startPage > 2 && (
              <span className="px-2 text-gray-500">...</span>
            )}
          </>
        )}

        {pages.map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => handlePageChange(pageNum)}
            disabled={loading}
            className={`px-3 py-2 rounded-lg border transition-colors text-sm font-medium ${
              pageNum === page
                ? 'bg-primary text-white border-primary'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {pageNum}
          </button>
        ))}

        {endPage < pagination.totalPages && (
          <>
            {endPage < pagination.totalPages - 1 && (
              <span className="px-2 text-gray-500">...</span>
            )}
            <button
              onClick={() => handlePageChange(pagination.totalPages)}
              className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
            >
              {pagination.totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === pagination.totalPages || loading}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={20} className="text-gray-600" />
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="Transaction History" showBack />
      
      <div className="p-5">
        <div className="mb-4">
          <h1 className="text-xl font-bold text-gray-800 mb-1">All Transactions</h1>
          <p className="text-sm text-gray-600">
            {pagination.total > 0 
              ? `Showing ${((page - 1) * pagination.limit) + 1} - ${Math.min(page * pagination.limit, pagination.total)} of ${pagination.total} transactions`
              : 'No transactions found'
            }
          </p>
        </div>

        {loading && transactions.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <div className="text-gray-500">Loading transactions...</div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <p className="text-gray-600">No transactions found</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="bg-white rounded-xl p-5 shadow-sm border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <User size={18} className="text-gray-500" />
                        <span className="font-semibold text-gray-800">
                          {transaction.user_name || 'Unknown User'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-1">
                        Phone: {transaction.user_phone || '-'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(transaction.created_at)}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(transaction.status)}
                      {getTypeBadge(transaction.type)}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Amount:</span>
                      </div>
                      <span className={`text-lg font-bold ${
                        transaction.type === 'cashout' || transaction.type === 'transfer' 
                          ? 'text-red-600' 
                          : 'text-green-600'
                      }`}>
                        {transaction.type === 'cashout' || transaction.type === 'transfer' ? '-' : '+'}
                        {formatCurrency(Math.abs(parseFloat(transaction.amount)))}
                      </span>
                    </div>

                    {transaction.recipient_phone && (
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Recipient:</span>
                        <span className="text-sm font-medium text-gray-800">
                          {transaction.recipient_name || transaction.recipient_phone}
                        </span>
                      </div>
                    )}

                    {transaction.description && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                        <strong>Description:</strong> {transaction.description}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {renderPagination()}
          </>
        )}
      </div>
    </div>
  )
}

export default TransactionHistory

