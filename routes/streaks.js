import express from "express"
import { getStreaks, checkIn, updateGoal } from "../controllers/streaks.js"
import { protect } from "../middleware/auth.js"

const router = express.Router()

// All routes are protected
router.use(protect)

router.get("/", getStreaks)
router.post("/checkin", checkIn)
router.put("/goal", updateGoal)

export default router
