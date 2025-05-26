"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "react-query"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { remindersAPI } from "../services/api"
import LoadingSpinner from "../components/LoadingSpinner"
import { Plus, Clock, Bell, Trash2, ToggleLeft, ToggleRight } from "lucide-react"

const RemindersPage = () => {
  const [showForm, setShowForm] = useState(false)
  const queryClient = useQueryClient()

  const { data: reminders, isLoading } = useQuery("reminders", remindersAPI.getReminders)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const createMutation = useMutation(remindersAPI.createReminder, {
    onSuccess: () => {
      queryClient.invalidateQueries("reminders")
      toast.success("Reminder created successfully!")
      reset()
      setShowForm(false)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create reminder")
    },
  })

  const toggleMutation = useMutation(remindersAPI.toggleReminder, {
    onSuccess: () => {
      queryClient.invalidateQueries("reminders")
    },
  })

  const deleteMutation = useMutation(remindersAPI.deleteReminder, {
    onSuccess: () => {
      queryClient.invalidateQueries("reminders")
      toast.success("Reminder deleted successfully!")
    },
  })

  const onSubmit = (data) => {
    createMutation.mutate(data)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const remindersList = reminders?.data?.data || []

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reminders</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Reminder
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Create New Reminder</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  {...register("type", { required: "Type is required" })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select type</option>
                  <option value="water">Water</option>
                  <option value="meals">Meals</option>
                  <option value="sleep">Sleep</option>
                  <option value="supplements">Supplements</option>
                  <option value="workout">Workout</option>
                  <option value="medication">Medication</option>
                </select>
                {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input
                  {...register("time", { required: "Time is required" })}
                  type="time"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                {...register("title", { required: "Title is required" })}
                type="text"
                placeholder="e.g., Drink water"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
              <textarea
                {...register("description")}
                rows={3}
                placeholder="Additional details..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMutation.isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {createMutation.isLoading ? <LoadingSpinner size="sm" /> : "Create Reminder"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {remindersList.length > 0 ? (
          remindersList.map((reminder) => (
            <div key={reminder._id} className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                    <Bell className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{reminder.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {reminder.time}
                      </span>
                      <span className="capitalize">{reminder.type}</span>
                    </div>
                    {reminder.description && <p className="text-sm text-gray-600 mt-1">{reminder.description}</p>}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleMutation.mutate(reminder._id)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    {reminder.enabled ? (
                      <ToggleRight className="h-6 w-6 text-green-500" />
                    ) : (
                      <ToggleLeft className="h-6 w-6 text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(reminder._id)}
                    className="p-2 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reminders yet</h3>
            <p className="text-gray-500 mb-4">Create your first reminder to stay on track with your health goals.</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Reminder
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default RemindersPage
