import express from "express"
import { body } from "express-validator"
import {
  getWorkouts,
  getWorkout,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  getWorkoutRecommendations,
  rateWorkout,
} from "../controllers/workouts.js"
import { protect } from "../middleware/auth.js"

const router = express.Router()

// Public routes
router.get("/recommendations", getWorkoutRecommendations)
router.get("/", getWorkouts)
router.get("/:id", getWorkout)

// Protected routes
router.use(protect)

// Validation rules
const workoutValidation = [
  body("title").trim().isLength({ min: 1, max: 100 }).withMessage("Title must be between 1 and 100 characters"),
  body("category")
    .isIn(["strength", "cardio", "hiit", "yoga", "pilates", "crossfit", "sports", "flexibility"])
    .withMessage("Invalid workout category"),
  body("difficulty").isIn(["beginner", "intermediate", "advanced"]).withMessage("Invalid difficulty level"),
  body("duration").isInt({ min: 1 }).withMessage("Duration must be at least 1 minute"),
]

router.post("/", workoutValidation, createWorkout)
router.put("/:id", updateWorkout)
router.delete("/:id", deleteWorkout)
router.post("/:id/rate", rateWorkout)

export default router
