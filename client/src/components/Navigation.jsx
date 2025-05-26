import { NavLink } from "react-router-dom"
import { Home, Bell, Utensils, Dumbbell, Users, User } from "lucide-react"

const Navigation = () => {
  const navItems = [
    { to: "/dashboard", icon: Home, label: "Home" },
    { to: "/reminders", icon: Bell, label: "Reminders" },
    { to: "/meals", icon: Utensils, label: "Meals" },
    { to: "/workouts", icon: Dumbbell, label: "Workouts" },
    { to: "/community", icon: Users, label: "Community" },
    { to: "/profile", icon: User, label: "Profile" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="grid grid-cols-6 h-16">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center space-y-1 ${
                isActive ? "text-blue-600 bg-blue-50" : "text-gray-500 hover:text-gray-700"
              }`
            }
          >
            <Icon className="h-5 w-5" />
            <span className="text-xs">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default Navigation
