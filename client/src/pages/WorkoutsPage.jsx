"use client"

import { useState } from "react"
import { useQuery } from "react-query"
import { workoutsAPI } from "../services/api"
import LoadingSpinner from "../components/LoadingSpinner"
import { Clock, Zap, Star, Play } from "lucide-react"

const WorkoutsPage = () => {
  const [filters, setFilters] = useState({
    category: "",
    difficulty: "",
    duration: "",
  })

  const { data: workouts, isLoading } = useQuery(["workouts", filters], () => workoutsAPI.getWorkouts(filters), {
    keepPreviousData: true,
  })

  const { data: recommendations } = useQuery(["workout-recommendations"], () =>
    workoutsAPI.getRecommendations("beginner"),
  )

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const workoutsList = workouts?.data?.data || []
  const recommendedWorkouts = recommendations?.data?.data || []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Workouts</h1>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            <option value="strength">Strength</option>
            <option value="cardio">Cardio</option>
            <option value="hiit">HIIT</option>
            <option value="yoga">Yoga</option>
            <option value="pilates">Pilates</option>
          </select>

          <select
            value={filters.difficulty}
            onChange={(e) => handleFilterChange("difficulty", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          <select
            value={filters.duration}
            onChange={(e) => handleFilterChange("duration", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Any Duration</option>
            <option value="15">Under 15 min</option>
            <option value="30">Under 30 min</option>
            <option value="45">Under 45 min</option>
            <option value="60">Under 60 min</option>
          </select>
        </div>
      </div>

      {/* Recommendations */}
      {recommendedWorkouts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recommended for You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedWorkouts.slice(0, 3).map((workout) => (
              <WorkoutCard key={workout._id} workout={workout} />
            ))}
          </div>
        </div>
      )}

      {/* All Workouts */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">All Workouts</h2>
        {workoutsList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workoutsList.map((workout) => (
              <WorkoutCard key={workout._id} workout={workout} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💪</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No workouts found</h3>
            <p className="text-gray-500">Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}

const WorkoutCard = ({ workout }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "beginner":
        return "text-green-800 bg-green-100"
      case "intermediate":
        return "text-yellow-800 bg-yellow-100"
      case "advanced":
        return "text-red-800 bg-red-100"
      default:
        return "text-gray-800 bg-gray-100"
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-w-16 aspect-h-9 bg-gray-200 relative">
        <img src={`/placeholder.svg?height=200&width=300`} alt={workout.title} className="w-full h-48 object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
          <button className="bg-white bg-opacity-90 rounded-full p-3 hover:bg-opacity-100 transition-all">
            <Play className="h-6 w-6 text-gray-900" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full capitalize">
            {workout.category}
          </span>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600 ml-1">{workout.rating?.average || "N/A"}</span>
          </div>
        </div>

        <h3 className="font-semibold text-gray-900 mb-2">{workout.title}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{workout.description}</p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{workout.duration} min</span>
          </div>
          <div className="flex items-center">
            <Zap className="h-4 w-4 mr-1" />
            <span>{workout.caloriesBurned || "N/A"} cal</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getDifficultyColor(workout.difficulty)}`}
          >
            {workout.difficulty}
          </span>
          <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
            Start Workout
          </button>
        </div>
      </div>
    </div>
  )
}

export default WorkoutsPage
