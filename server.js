import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import rateLimit from "express-rate-limit"
import compression from "compression"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"
import connectDB from "./config/database.js"
import errorHandler from "./middleware/errorHandler.js"

// Route imports
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import reminderRoutes from "./routes/reminders.js"
import mealRoutes from "./routes/meals.js"
import workoutRoutes from "./routes/workouts.js"
import communityRoutes from "./routes/community.js"
import streakRoutes from "./routes/streaks.js"
import insightRoutes from "./routes/insights.js"

// Load environment variables
dotenv.config()

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Connect to MongoDB
connectDB()

const app = express()

// Security and performance middleware
app.use(helmet())
app.use(compression())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
})
app.use("/api/", limiter)

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
)

// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
} else {
  app.use(morgan("combined"))
}

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  })
})

// API Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/reminders", reminderRoutes)
app.use("/api/meals", mealRoutes)
app.use("/api/workouts", workoutRoutes)
app.use("/api/community", communityRoutes)
app.use("/api/streaks", streakRoutes)
app.use("/api/insights", insightRoutes)

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")))

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  })
}

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  })
})

// Error handling middleware
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 HealthQuest Server running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`)
})

export default app
