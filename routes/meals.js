import express from "express"
import { body } from "express-validator"
import {
  getMeals,
  getMeal,
  createMeal,
  updateMeal,
  deleteMeal,
  getMealRecommendations,
  rateMeal,
  searchMeals,
} from "../controllers/meals.js"
import { protect } from "../middleware/auth.js"

const router = express.Router()

// Public routes
router.get("/recommendations", getMealRecommendations)
router.get("/search", searchMeals)
router.get("/", getMeals)
router.get("/:id", getMeal)

// Protected routes
router.use(protect)

// Validation rules
const mealValidation = [
  body("title").trim().isLength({ min: 1, max: 100 }).withMessage("Title must be between 1 and 100 characters"),
  body("description")
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage("Description must be between 1 and 500 characters"),
  body("category").isIn(["breakfast", "lunch", "dinner", "snacks", "drinks"]).withMessage("Invalid meal category"),
  body("nutrition.calories").isFloat({ min: 0 }).withMessage("Calories must be a positive number"),
  body("nutrition.protein").isFloat({ min: 0 }).withMessage("Protein must be a positive number"),
  body("nutrition.carbs").isFloat({ min: 0 }).withMessage("Carbs must be a positive number"),
  body("nutrition.fats").isFloat({ min: 0 }).withMessage("Fats must be a positive number"),
]

router.post("/", mealValidation, createMeal)
router.put("/:id", updateMeal)
router.delete("/:id", deleteMeal)
router.post("/:id/rate", rateMeal)

export default router
