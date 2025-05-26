"use client"

import { useState } from "react"
import { useQuery } from "react-query"
import { mealsAPI } from "../services/api"
import LoadingSpinner from "../components/LoadingSpinner"
import { Search, Clock, Users, Star } from "lucide-react"

const MealsPage = () => {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    category: "",
    difficulty: "",
    maxCalories: "",
  })

  const { data: meals, isLoading } = useQuery(["meals", filters], () => mealsAPI.getMeals(filters), {
    keepPreviousData: true,
  })

  const { data: recommendations } = useQuery(
    ["meal-recommendations", activeTab],
    () => mealsAPI.getRecommendations(activeTab === "all" ? "breakfast" : activeTab),
    {
      enabled: activeTab !== "all",
    },
  )

  const tabs = [
    { id: "all", label: "All Meals" },
    { id: "breakfast", label: "Breakfast" },
    { id: "lunch", label: "Lunch" },
    { id: "dinner", label: "Dinner" },
    { id: "snacks", label: "Snacks" },
  ]

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

  const mealsList = meals?.data?.data || []
  const recommendedMeals = recommendations?.data?.data || []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Meals & Nutrition</h1>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search meals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snacks">Snacks</option>
            </select>

            <select
              value={filters.difficulty}
              onChange={(e) => handleFilterChange("difficulty", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Levels</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Recommendations */}
      {activeTab !== "all" && recommendedMeals.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recommended for You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedMeals.slice(0, 3).map((meal) => (
              <MealCard key={meal._id} meal={meal} />
            ))}
          </div>
        </div>
      )}

      {/* All Meals */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {activeTab === "all" ? "All Meals" : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Meals`}
        </h2>
        {mealsList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mealsList.map((meal) => (
              <MealCard key={meal._id} meal={meal} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No meals found</h3>
            <p className="text-gray-500">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}

const MealCard = ({ meal }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-w-16 aspect-h-9 bg-gray-200">
        <img src={`/placeholder.svg?height=200&width=300`} alt={meal.title} className="w-full h-48 object-cover" />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full capitalize">
            {meal.category}
          </span>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600 ml-1">{meal.rating?.average || "N/A"}</span>
          </div>
        </div>

        <h3 className="font-semibold text-gray-900 mb-2">{meal.title}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{meal.description}</p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{meal.prepTime + (meal.cookTime || 0)} min</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{meal.servings} servings</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Calories: {meal.nutrition.calories}</span>
            <span className="text-gray-600">Protein: {meal.nutrition.protein}g</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MealsPage
