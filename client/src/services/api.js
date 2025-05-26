import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

export default api

// API service functions
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  getMe: () => api.get("/auth/me"),
  updateProfile: (data) => api.put("/auth/profile", data),
  updatePassword: (data) => api.put("/auth/password", data),
}

export const remindersAPI = {
  getReminders: () => api.get("/reminders"),
  createReminder: (data) => api.post("/reminders", data),
  updateReminder: (id, data) => api.put(`/reminders/${id}`, data),
  deleteReminder: (id) => api.delete(`/reminders/${id}`),
  toggleReminder: (id) => api.put(`/reminders/${id}/toggle`),
  completeReminder: (id) => api.put(`/reminders/${id}/complete`),
}

export const mealsAPI = {
  getMeals: (params) => api.get("/meals", { params }),
  getMeal: (id) => api.get(`/meals/${id}`),
  createMeal: (data) => api.post("/meals", data),
  updateMeal: (id, data) => api.put(`/meals/${id}`, data),
  deleteMeal: (id) => api.delete(`/meals/${id}`),
  getRecommendations: (category) => api.get(`/meals/recommendations?category=${category}`),
  rateMeal: (id, rating) => api.post(`/meals/${id}/rate`, { rating }),
  searchMeals: (query) => api.get(`/meals/search?q=${query}`),
}

export const workoutsAPI = {
  getWorkouts: (params) => api.get("/workouts", { params }),
  getWorkout: (id) => api.get(`/workouts/${id}`),
  createWorkout: (data) => api.post("/workouts", data),
  updateWorkout: (id, data) => api.put(`/workouts/${id}`, data),
  deleteWorkout: (id) => api.delete(`/workouts/${id}`),
  getRecommendations: (difficulty) => api.get(`/workouts/recommendations?difficulty=${difficulty}`),
}

export const communityAPI = {
  getPosts: (params) => api.get("/community/posts", { params }),
  createPost: (data) => api.post("/community/posts", data),
  likePost: (id) => api.post(`/community/posts/${id}/like`),
  commentPost: (id, content) => api.post(`/community/posts/${id}/comment`, { content }),
  getChallenges: () => api.get("/community/challenges"),
  joinChallenge: (id) => api.post(`/community/challenges/${id}/join`),
  getFriends: () => api.get("/community/friends"),
}

export const streaksAPI = {
  getStreaks: () => api.get("/streaks"),
  checkIn: (type, activity) => api.post("/streaks/checkin", { type, activity }),
  updateGoal: (type, goal) => api.put("/streaks/goal", { type, goal }),
}
