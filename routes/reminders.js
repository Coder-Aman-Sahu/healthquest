import express from "express"
import { body } from "express-validator"
import {
  getReminders,
  createReminder,
  updateReminder,
  deleteReminder,
  toggleReminder,
  completeReminder,
} from "../controllers/reminders.js"
import { protect } from "../middleware/auth.js"

const router = express.Router()

// All routes are protected
router.use(protect)

// Validation rules
const reminderValidation = [
  body("type")
    .isIn(["water", "meals", "sleep", "supplements", "workout", "medication"])
    .withMessage("Invalid reminder type"),
  body("title").trim().isLength({ min: 1, max: 100 }).withMessage("Title must be between 1 and 100 characters"),
  body("time")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Time must be in HH:MM format"),
]

// Routes
router.route("/").get(getReminders).post(reminderValidation, createReminder)

router.route("/:id").put(updateReminder).delete(deleteReminder)

router.put("/:id/toggle", toggleReminder)
router.put("/:id/complete", completeReminder)

export default router
