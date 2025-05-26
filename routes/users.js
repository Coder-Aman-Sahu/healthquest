import express from "express"
import { getProfile, updateProfile, uploadAvatar, deleteAccount } from "../controllers/users.js"
import { protect } from "../middleware/auth.js"

const router = express.Router()

// All routes are protected
router.use(protect)

router.get("/profile", getProfile)
router.put("/profile", updateProfile)
router.post("/avatar", uploadAvatar)
router.delete("/account", deleteAccount)

export default router
