"use client"

import { Bell, User } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"

const Header = () => {
  const { user } = useAuth()

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">HEALTHQUEST</h1>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-500">
              <Bell className="h-6 w-6" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-500 text-white">
                <User className="h-5 w-5" />
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                <div className="text-xs text-gray-500">
                  {user?.age} yrs • {user?.weight} kg
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
