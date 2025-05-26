import { validationResult } from "express-validator"
import Meal from "../models/Meal.js"

// @desc    Get all meals
// @route   GET /api/meals
// @access  Public
export const getMeals = async (req, res, next) => {
  try {
    const { category, difficulty, tags, page = 1, limit = 10 } = req.query

    // Build query
    const query = { isPublic: true }

    if (category) {
      query.category = category
    }

    if (difficulty) {
      query.difficulty = difficulty
    }

    if (tags) {
      query.tags = { $in: tags.split(",") }
    }

    // Execute query with pagination
    const meals = await Meal.find(query)
      .populate("createdBy", "name")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Meal.countDocuments(query)

    res.status(200).json({
      success: true,
      count: meals.length,
      total,
      pagination: {
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        pages: Math.ceil(total / limit),
      },
      data: meals,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single meal
// @route   GET /api/meals/:id
// @access  Public
export const getMeal = async (req, res, next) => {
  try {
    const meal = await Meal.findById(req.params.id).populate("createdBy", "name")

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: "Meal not found",
      })
    }

    res.status(200).json({
      success: true,
      data: meal,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Create new meal
// @route   POST /api/meals
// @access  Private
export const createMeal = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      })
    }

    // Add user to req.body
    req.body.createdBy = req.user.id

    const meal = await Meal.create(req.body)

    res.status(201).json({
      success: true,
      data: meal,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update meal
// @route   PUT /api/meals/:id
// @access  Private
export const updateMeal = async (req, res, next) => {
  try {
    let meal = await Meal.findById(req.params.id)

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: "Meal not found",
      })
    }

    // Make sure user owns meal or is admin
    if (meal.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "Not authorized to update this meal",
      })
    }

    meal = await Meal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      success: true,
      data: meal,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete meal
// @route   DELETE /api/meals/:id
// @access  Private
export const deleteMeal = async (req, res, next) => {
  try {
    const meal = await Meal.findById(req.params.id)

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: "Meal not found",
      })
    }

    // Make sure user owns meal or is admin
    if (meal.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "Not authorized to delete this meal",
      })
    }

    await meal.deleteOne()

    res.status(200).json({
      success: true,
      message: "Meal deleted successfully",
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get meal recommendations
// @route   GET /api/meals/recommendations
// @access  Public
export const getMealRecommendations = async (req, res, next) => {
  try {
    const { category = "breakfast", limit = 6 } = req.query

    const meals = await Meal.find({
      category,
      isPublic: true,
    })
      .sort({ "rating.average": -1, createdAt: -1 })
      .limit(Number.parseInt(limit))

    res.status(200).json({
      success: true,
      count: meals.length,
      data: meals,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Rate a meal
// @route   POST /api/meals/:id/rate
// @access  Private
export const rateMeal = async (req, res, next) => {
  try {
    const { rating } = req.body

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      })
    }

    const meal = await Meal.findById(req.params.id)

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: "Meal not found",
      })
    }

    // Calculate new average rating
    const currentTotal = (meal.rating.average || 0) * (meal.rating.count || 0)
    const newCount = (meal.rating.count || 0) + 1
    const newAverage = (currentTotal + rating) / newCount

    meal.rating = {
      average: Math.round(newAverage * 10) / 10,
      count: newCount,
    }

    await meal.save()

    res.status(200).json({
      success: true,
      data: meal,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Search meals
// @route   GET /api/meals/search
// @access  Public
export const searchMeals = async (req, res, next) => {
  try {
    const { q, category, difficulty, maxCalories, minProtein } = req.query

    const query = { isPublic: true }

    // Text search
    if (q) {
      query.$text = { $search: q }
    }

    // Filter by category
    if (category) {
      query.category = category
    }

    // Filter by difficulty
    if (difficulty) {
      query.difficulty = difficulty
    }

    // Filter by max calories
    if (maxCalories) {
      query["nutrition.calories"] = { $lte: Number.parseInt(maxCalories) }
    }

    // Filter by min protein
    if (minProtein) {
      query["nutrition.protein"] = { $gte: Number.parseInt(minProtein) }
    }

    const meals = await Meal.find(query)
      .populate("createdBy", "name")
      .sort({ score: { $meta: "textScore" } })
      .limit(20)

    res.status(200).json({
      success: true,
      count: meals.length,
      data: meals,
    })
  } catch (error) {
    next(error)
  }
}
