import { validationResult } from "express-validator"
import Reminder from "../models/Reminder.js"

// @desc    Get all reminders for user
// @route   GET /api/reminders
// @access  Private
export const getReminders = async (req, res, next) => {
  try {
    const reminders = await Reminder.find({ user: req.user.id }).sort({ time: 1 })

    res.status(200).json({
      success: true,
      count: reminders.length,
      data: reminders,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Create new reminder
// @route   POST /api/reminders
// @access  Private
export const createReminder = async (req, res, next) => {
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
    req.body.user = req.user.id

    const reminder = await Reminder.create(req.body)

    res.status(201).json({
      success: true,
      data: reminder,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update reminder
// @route   PUT /api/reminders/:id
// @access  Private
export const updateReminder = async (req, res, next) => {
  try {
    let reminder = await Reminder.findById(req.params.id)

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: "Reminder not found",
      })
    }

    // Make sure user owns reminder
    if (reminder.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to update this reminder",
      })
    }

    reminder = await Reminder.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      success: true,
      data: reminder,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete reminder
// @route   DELETE /api/reminders/:id
// @access  Private
export const deleteReminder = async (req, res, next) => {
  try {
    const reminder = await Reminder.findById(req.params.id)

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: "Reminder not found",
      })
    }

    // Make sure user owns reminder
    if (reminder.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to delete this reminder",
      })
    }

    await reminder.deleteOne()

    res.status(200).json({
      success: true,
      message: "Reminder deleted successfully",
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Toggle reminder enabled/disabled
// @route   PUT /api/reminders/:id/toggle
// @access  Private
export const toggleReminder = async (req, res, next) => {
  try {
    const reminder = await Reminder.findById(req.params.id)

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: "Reminder not found",
      })
    }

    // Make sure user owns reminder
    if (reminder.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to modify this reminder",
      })
    }

    reminder.enabled = !reminder.enabled
    await reminder.save()

    res.status(200).json({
      success: true,
      data: reminder,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Mark reminder as completed
// @route   PUT /api/reminders/:id/complete
// @access  Private
export const completeReminder = async (req, res, next) => {
  try {
    const reminder = await Reminder.findById(req.params.id)

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: "Reminder not found",
      })
    }

    // Make sure user owns reminder
    if (reminder.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to modify this reminder",
      })
    }

    reminder.status = "completed"
    reminder.completedAt = new Date()
    await reminder.save()

    res.status(200).json({
      success: true,
      data: reminder,
    })
  } catch (error) {
    next(error)
  }
}
