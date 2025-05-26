import express from "express"
import { body } from "express-validator"
import {
  getPosts,
  createPost,
  likePost,
  commentPost,
  getChallenges,
  joinChallenge,
  getFriends,
} from "../controllers/community.js"
import { protect } from "../middleware/auth.js"

const router = express.Router()

// All routes are protected
router.use(protect)

// Validation rules
const postValidation = [
  body("content").trim().isLength({ min: 1, max: 1000 }).withMessage("Content must be between 1 and 1000 characters"),
  body("type").isIn(["workout", "meal", "achievement", "progress", "general"]).withMessage("Invalid post type"),
]

// Routes
router.get("/posts", getPosts)
router.post("/posts", postValidation, createPost)
router.post("/posts/:id/like", likePost)
router.post("/posts/:id/comment", commentPost)
router.get("/challenges", getChallenges)
router.post("/challenges/:id/join", joinChallenge)
router.get("/friends", getFriends)

export default router
