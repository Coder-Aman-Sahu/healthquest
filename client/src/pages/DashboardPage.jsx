"use client"

import { useQuery } from "react-query"
import { useAuth } from "../contexts/AuthContext"
import { remindersAPI, streaksAPI } from "../services/api"
import LoadingSpinner from "../components/LoadingSpinner"
import { Calendar, Flame, Target, TrendingUp } from "lucide-react"

const DashboardPage = () => {
  const { user } = useAuth()

  const { data: reminders, isLoading: remindersLoading } = useQuery("reminders", remindersAPI.getReminders)

  const { data: streaks, isLoading: streaksLoading } = useQuery("streaks", streaksAPI.getStreaks)

  if (remindersLoading || streaksLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const todayReminders =
    reminders?.data?.data?.filter((reminder) => reminder.enabled && reminder.status === "pending") || []

  const currentStreak = streaks?.data?.currentStreak || 0
  const longestStreak = streaks?.data?.longestStreak || 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600">Here's your health overview for today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Today's Tasks</p>
              <p className="text-2xl font-semibold text-gray-900">{todayReminders.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Flame className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Current Streak</p>
              <p className="text-2xl font-semibold text-gray-900">{currentStreak}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">BMI</p>
              <p className="text-2xl font-semibold text-gray-900">{user?.bmi}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Best Streak</p>
              <p className="text-2xl font-semibold text-gray-900">{longestStreak}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Reminders */}
      <div className="bg-white rounded-lg shadow-sm border mb-8">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Reminders</h2>
          {todayReminders.length > 0 ? (
            <div className="space-y-3">
              {todayReminders.map((reminder) => (
                <div key={reminder._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <div>
                      <p className="font-medium text-gray-900">{reminder.title}</p>
                      <p className="text-sm text-gray-600">{reminder.time}</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium text-orange-800 bg-orange-100 rounded-full">
                    Pending
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No pending reminders for today</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-2xl mb-2">💧</div>
              <p className="text-sm font-medium">Log Water</p>
            </button>
            <button className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-2xl mb-2">🍎</div>
              <p className="text-sm font-medium">Log Meal</p>
            </button>
            <button className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-2xl mb-2">💪</div>
              <p className="text-sm font-medium">Start Workout</p>
            </button>
            <button className="p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-2xl mb-2">😴</div>
              <p className="text-sm font-medium">Log Sleep</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
