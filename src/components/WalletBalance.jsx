import React from 'react'
import { Wallet, ChevronRight } from 'lucide-react'

const WalletBalance = ({ balance, maxTransfer }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <div className="bg-white rounded-xl p-5 mx-5 my-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
            <Wallet size={20} className="text-gray-700" />
          </div>
          <span className="text-base font-medium text-gray-800">eWallet Balance</span>
        </div>
        <ChevronRight size={20} className="text-gray-400" />
      </div>
      <div className="text-2xl font-bold text-primary mb-2">
        {formatCurrency(balance)}
      </div>
      <div className="text-sm text-primary">
        You can transfer up to {formatCurrency(maxTransfer)}
      </div>
    </div>
  )
}

export default WalletBalance

