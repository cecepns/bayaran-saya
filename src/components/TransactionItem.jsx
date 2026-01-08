import React from 'react'
import { Check, Clock, X } from 'lucide-react'

const TransactionItem = ({ transaction }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const getStatusIcon = (status) => {
    if (status === 'completed' || status === 'success') {
      return { Icon: Check, bgColor: 'bg-green-500', textColor: 'text-green-600' }
    }
    if (status === 'pending' || status === 'on_process') {
      return { Icon: Clock, bgColor: 'bg-yellow-500', textColor: 'text-yellow-600' }
    }
    return { Icon: X, bgColor: 'bg-red-500', textColor: 'text-red-600' }
  }

  // Determine if transaction is outgoing (negative) or incoming (positive)
  const isOutgoing = ['transfer', 'cashout', 'pay', 'scan'].includes(transaction.type)
  const displayAmount = parseFloat(transaction.amount) || 0
  const amountColor = isOutgoing ? 'text-red-600' : 'text-green-600'
  const amountPrefix = isOutgoing ? '-' : '+'

  const statusInfo = getStatusIcon(transaction.status)
  const StatusIcon = statusInfo.Icon

  return (
    <div className="flex items-center justify-between py-3 px-5 border-b border-gray-200 last:border-b-0">
      <div className="flex items-center gap-3 flex-1">
        <div className={`w-10 h-10 ${statusInfo.bgColor} rounded-full flex items-center justify-center text-white`}>
          <StatusIcon size={20} />
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium text-slate-700">
            {transaction.description || 
             (transaction.recipient_name || transaction.recipient_phone) 
               ? `${transaction.type === 'transfer' ? 'Transfer to' : transaction.type === 'reload' ? 'Reload' : transaction.type} ${transaction.recipient_name || transaction.recipient_phone || ''}`
               : transaction.type || 'Transaction'}
          </div>
          {transaction.status === 'pending' || transaction.status === 'on_process' ? (
            <div className={`text-sm ${statusInfo.textColor} capitalize`}>
              {transaction.status === 'on_process' ? 'On Process' : 'Pending'}
            </div>
          ) : null}
        </div>
      </div>
      <div className={`text-sm font-semibold ${amountColor}`}>
        {amountPrefix}{formatCurrency(Math.abs(displayAmount))}
      </div>
    </div>
  )
}

export default TransactionItem

