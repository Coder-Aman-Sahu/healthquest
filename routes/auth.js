import express from "express"
import { body } from "express-validator"
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  updatePassword,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.js"
import { protect } from "../middleware/auth.js"

const router = express.Router()

// Validation rules
const registerValidation = [
  body("name").trim().isLength({ min: 2, max: 50 }).withMessage("Name must be between 2 and 50 characters"),
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("age").isInt({ min: 13, max: 120 }).withMessage("Age must be between 13 and 120"),
  body("weight").isFloat({ min: 20, max: 500 }).withMessage("Weight must be between 20 and 500 kg"),
  body("height").isFloat({ min: 100, max: 250 }).withMessage("Height must be between 100 and 250 cm"),
  body("gender").isIn(["male", "female", "other"]).withMessage("Gender must be male, female, or other"),
]

const loginValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
]

// Routes
router.post("/register", registerValidation, register)
router.post("/login", loginValidation, login)
router.post("/logout", logout)
router.get("/me", protect, getMe)
router.put("/profile", protect, updateProfile)
router.put("/password", protect, updatePassword)
router.post("/forgot-password", forgotPassword)
router.put("/reset-password/:resettoken", resetPassword)

export default router
