import express from "express"
import { getInsights, getProgressData, getHealthMetrics } from "../controllers/insights.js"
import { protect } from "../middleware/auth.js"

const router = express.Router()

// All routes are protected
router.use(protect)

router.get("/", getInsights)
router.get("/progress", getProgressData)
router.get("/health-metrics", getHealthMetrics)

export default router
