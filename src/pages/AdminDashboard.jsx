import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Wallet, ChevronRight, Clock, ArrowDownCircle, History } from 'lucide-react'
import Header from '../components/Header'

const AdminDashboard = () => {
  const navigate = useNavigate()

  const menuItems = [
    {
      id: 'users',
      title: 'User Management',
      description: 'Manage users and their accounts',
      Icon: Users,
      path: '/admin/users',
    },
    {
      id: 'balance',
      title: 'Balance Management',
      description: 'Manage user balances and transactions',
      Icon: Wallet,
      path: '/admin/balance',
    },
    {
      id: 'reload',
      title: 'Reload Requests',
      description: 'Approve or reject user reload requests',
      Icon: Clock,
      path: '/admin/reload-requests',
    },
    {
      id: 'cashout',
      title: 'Cashout Requests',
      description: 'Process user withdrawal/cashout requests',
      Icon: ArrowDownCircle,
      path: '/admin/cashout-requests',
    },
    {
      id: 'transactions',
      title: 'Transaction History',
      description: 'View all user transactions including transfers',
      Icon: History,
      path: '/admin/transactions',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="Admin Panel" />
      
      <div className="p-5">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your PPOB application</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {menuItems.map((item) => {
            const IconComponent = item.Icon
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center">
                    <IconComponent size={24} className="text-gray-700" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  <ChevronRight size={20} className="text-gray-400" />
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

