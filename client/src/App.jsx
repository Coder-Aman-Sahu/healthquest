"use client"

import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./contexts/AuthContext"
import Layout from "./components/Layout"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import DashboardPage from "./pages/DashboardPage"
import RemindersPage from "./pages/RemindersPage"
import MealsPage from "./pages/MealsPage"
import WorkoutsPage from "./pages/WorkoutsPage"
import CommunityPage from "./pages/CommunityPage"
import ProfilePage from "./pages/ProfilePage"
import LoadingSpinner from "./components/LoadingSpinner"

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/dashboard" />} />

      {/* Protected routes */}
      <Route path="/" element={user ? <Layout /> : <Navigate to="/login" />}>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="reminders" element={<RemindersPage />} />
        <Route path="meals" element={<MealsPage />} />
        <Route path="workouts" element={<WorkoutsPage />} />
        <Route path="community" element={<CommunityPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
    </Routes>
  )
}

export default App
