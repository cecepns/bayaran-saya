import React from 'react'
import { useNavigate } from 'react-router-dom'
import { QrCode, CreditCard, Send, DollarSign } from 'lucide-react'

const ActionButtons = () => {
  const navigate = useNavigate()

  const actions = [
    { 
      id: 'scan', 
      label: 'Scan', 
      Icon: QrCode, 
      onClick: () => navigate('/scan') 
    },
    { 
      id: 'pay', 
      label: 'Pay', 
      Icon: CreditCard, 
      onClick: () => navigate('/pay') 
    },
    { 
      id: 'transfer', 
      label: 'Transfer', 
      Icon: Send, 
      onClick: () => navigate('/transfer') 
    },
    { 
      id: 'cashout', 
      label: 'Cashout', 
      Icon: DollarSign, 
      onClick: () => navigate('/cashout') 
    },
  ]

  return (
    <div className="flex justify-around px-5 py-5 gap-4">
      {actions.map((action) => {
        const IconComponent = action.Icon
        return (
          <button
            key={action.id}
            className={`flex flex-col items-center gap-2 bg-transparent border-none cursor-pointer p-2 flex-1 transition-transform hover:-translate-y-0.5 ${
              action.id === 'transfer' ? 'active' : ''
            }`}
            onClick={action.onClick}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                action.id === 'transfer'
                  ? 'bg-primary text-white'
                  : 'bg-primary-light text-gray-700'
              }`}
            >
              <IconComponent size={24} />
            </div>
            <span
              className={`text-xs font-medium ${
                action.id === 'transfer' ? 'text-primary font-semibold' : 'text-gray-700'
              }`}
            >
              {action.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default ActionButtons
