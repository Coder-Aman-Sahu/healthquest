"use client"

import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useForm } from "react-hook-form"
import LoadingSpinner from "../components/LoadingSpinner"
import { User, Settings, LogOut, Edit } from "lucide-react"

const ProfilePage = () => {
  const { user, updateProfile, logout, isUpdatingProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      age: user?.age || "",
      weight: user?.weight || "",
      height: user?.height || "",
      preferences: user?.preferences || {},
    },
  })

  const onSubmit = (data) => {
    updateProfile(data)
    setIsEditing(false)
  }

  const handleCancel = () => {
    reset()
    setIsEditing(false)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-lg shadow-sm border">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                <p className="text-gray-500">{user?.email}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSubmit(onSubmit)}
                    disabled={isUpdatingProfile}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {isUpdatingProfile ? <LoadingSpinner size="sm" /> : "Save"}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="p-6">
          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    {...register("name", { required: "Name is required" })}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input
                    {...register("age", { required: "Age is required", min: 13, max: 120 })}
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                  <input
                    {...register("weight", { required: "Weight is required", min: 20, max: 500 })}
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                  <input
                    {...register("height", { required: "Height is required", min: 100, max: 250 })}
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height.message}</p>}
                </div>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center">
                  <User className="h-8 w-8 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Age</p>
                    <p className="text-lg font-semibold text-gray-900">{user?.age} years</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center">
                  <Settings className="h-8 w-8 text-green-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Weight</p>
                    <p className="text-lg font-semibold text-gray-900">{user?.weight} kg</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center">
                  <Settings className="h-8 w-8 text-purple-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Height</p>
                    <p className="text-lg font-semibold text-gray-900">{user?.height} cm</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center">
                  <Settings className="h-8 w-8 text-orange-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">BMI</p>
                    <p className="text-lg font-semibold text-gray-900">{user?.bmi}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center">
                  <Settings className="h-8 w-8 text-red-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Gender</p>
                    <p className="text-lg font-semibold text-gray-900 capitalize">{user?.gender}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center">
                  <Settings className="h-8 w-8 text-indigo-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Fitness Level</p>
                    <p className="text-lg font-semibold text-gray-900 capitalize">
                      {user?.preferences?.fitnessLevel || "Not set"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
