import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

const TotalAsset = ({ balance, onReload }) => {
  const [isVisible, setIsVisible] = useState(true)

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <div className="bg-gradient-to-br from-primary to-primary-dark rounded-xl p-5 mx-5 my-5 text-white shadow-lg">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm opacity-90">Total Asset</span>
        <button
          className="bg-transparent border-none text-white cursor-pointer p-1 flex items-center justify-center hover:opacity-80 transition-opacity"
          onClick={() => setIsVisible(!isVisible)}
        >
          {isVisible ? <Eye size={20} /> : <EyeOff size={20} />}
        </button>
      </div>
      <div className="text-3xl font-bold mb-4">
        {isVisible ? formatCurrency(balance) : '••••••'}
      </div>
      <button
        className="bg-white text-primary border-none rounded-lg py-3 px-5 text-base font-semibold cursor-pointer flex items-center gap-2 w-full justify-center hover:bg-gray-100 transition-colors"
        onClick={onReload}
      >
        <span className="text-xl font-bold">+</span>
        Reload
      </button>
    </div>
  )
}

export default TotalAsset
