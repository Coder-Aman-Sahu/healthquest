"use client"

import { createContext, useContext, useReducer, useEffect } from "react"
import { useMutation, useQueryClient } from "react-query"
import toast from "react-hot-toast"
import api from "../services/api"

const AuthContext = createContext()

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, loading: true, error: null }
    case "LOGIN_SUCCESS":
      return { ...state, loading: false, user: action.payload, error: null }
    case "LOGIN_ERROR":
      return { ...state, loading: false, error: action.payload }
    case "LOGOUT":
      return { ...state, user: null, loading: false, error: null }
    case "UPDATE_USER":
      return { ...state, user: { ...state.user, ...action.payload } }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    loading: true,
    error: null,
  })

  const queryClient = useQueryClient()

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`
      // Fetch user data
      fetchUser()
    } else {
      dispatch({ type: "LOGIN_ERROR", payload: null })
    }
  }, [])

  const fetchUser = async () => {
    try {
      const response = await api.get("/auth/me")
      dispatch({ type: "LOGIN_SUCCESS", payload: response.data.data })
    } catch (error) {
      localStorage.removeItem("token")
      delete api.defaults.headers.common["Authorization"]
      dispatch({ type: "LOGIN_ERROR", payload: null })
    }
  }

  // Login mutation
  const loginMutation = useMutation((credentials) => api.post("/auth/login", credentials), {
    onSuccess: (response) => {
      const { token, data } = response.data
      localStorage.setItem("token", token)
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`
      dispatch({ type: "LOGIN_SUCCESS", payload: data })
      toast.success("Welcome back!")
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Login failed"
      dispatch({ type: "LOGIN_ERROR", payload: message })
      toast.error(message)
    },
  })

  // Register mutation
  const registerMutation = useMutation((userData) => api.post("/auth/register", userData), {
    onSuccess: (response) => {
      const { token, data } = response.data
      localStorage.setItem("token", token)
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`
      dispatch({ type: "LOGIN_SUCCESS", payload: data })
      toast.success("Account created successfully!")
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Registration failed"
      dispatch({ type: "LOGIN_ERROR", payload: message })
      toast.error(message)
    },
  })

  // Logout function
  const logout = () => {
    localStorage.removeItem("token")
    delete api.defaults.headers.common["Authorization"]
    dispatch({ type: "LOGOUT" })
    queryClient.clear()
    toast.success("Logged out successfully")
  }

  // Update profile mutation
  const updateProfileMutation = useMutation((profileData) => api.put("/auth/profile", profileData), {
    onSuccess: (response) => {
      dispatch({ type: "UPDATE_USER", payload: response.data.data })
      toast.success("Profile updated successfully!")
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Update failed"
      toast.error(message)
    },
  })

  const value = {
    user: state.user,
    loading: state.loading,
    error: state.error,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    updateProfile: updateProfileMutation.mutate,
    isLoggingIn: loginMutation.isLoading,
    isRegistering: registerMutation.isLoading,
    isUpdatingProfile: updateProfileMutation.isLoading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
