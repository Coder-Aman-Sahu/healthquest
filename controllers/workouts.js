import { validationResult } from "express-validator"
import Workout from "../models/Workout.js"

// @desc    Get all workouts
// @route   GET /api/workouts
// @access  Public
export const getWorkouts = async (req, res, next) => {
  try {
    const { category, difficulty, duration, page = 1, limit = 10 } = req.query

    const query = { isPublic: true }

    if (category) query.category = category
    if (difficulty) query.difficulty = difficulty
    if (duration) query.duration = { $lte: Number.parseInt(duration) }

    const workouts = await Workout.find(query)
      .populate("createdBy", "name")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Workout.countDocuments(query)

    res.status(200).json({
      success: true,
      count: workouts.length,
      total,
      pagination: {
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        pages: Math.ceil(total / limit),
      },
      data: workouts,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single workout
// @route   GET /api/workouts/:id
// @access  Public
export const getWorkout = async (req, res, next) => {
  try {
    const workout = await Workout.findById(req.params.id).populate("createdBy", "name")

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: "Workout not found",
      })
    }

    res.status(200).json({
      success: true,
      data: workout,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Create new workout
// @route   POST /api/workouts
// @access  Private
export const createWorkout = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      })
    }

    req.body.createdBy = req.user.id
    const workout = await Workout.create(req.body)

    res.status(201).json({
      success: true,
      data: workout,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update workout
// @route   PUT /api/workouts/:id
// @access  Private
export const updateWorkout = async (req, res, next) => {
  try {
    let workout = await Workout.findById(req.params.id)

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: "Workout not found",
      })
    }

    if (workout.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "Not authorized to update this workout",
      })
    }

    workout = await Workout.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      success: true,
      data: workout,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete workout
// @route   DELETE /api/workouts/:id
// @access  Private
export const deleteWorkout = async (req, res, next) => {
  try {
    const workout = await Workout.findById(req.params.id)

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: "Workout not found",
      })
    }

    if (workout.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "Not authorized to delete this workout",
      })
    }

    await workout.deleteOne()

    res.status(200).json({
      success: true,
      message: "Workout deleted successfully",
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get workout recommendations
// @route   GET /api/workouts/recommendations
// @access  Public
export const getWorkoutRecommendations = async (req, res, next) => {
  try {
    const { difficulty = "beginner", limit = 6 } = req.query

    const workouts = await Workout.find({
      difficulty,
      isPublic: true,
    })
      .sort({ "rating.average": -1, createdAt: -1 })
      .limit(Number.parseInt(limit))

    res.status(200).json({
      success: true,
      count: workouts.length,
      data: workouts,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Rate a workout
// @route   POST /api/workouts/:id/rate
// @access  Private
export const rateWorkout = async (req, res, next) => {
  try {
    const { rating } = req.body

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      })
    }

    const workout = await Workout.findById(req.params.id)

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: "Workout not found",
      })
    }

    const currentTotal = (workout.rating.average || 0) * (workout.rating.count || 0)
    const newCount = (workout.rating.count || 0) + 1
    const newAverage = (currentTotal + rating) / newCount

    workout.rating = {
      average: Math.round(newAverage * 10) / 10,
      count: newCount,
    }

    await workout.save()

    res.status(200).json({
      success: true,
      data: workout,
    })
  } catch (error) {
    next(error)
  }
}
