import Streak from "../models/Streak.js"

// @desc    Get user streaks
// @route   GET /api/streaks
// @access  Private
export const getStreaks = async (req, res, next) => {
  try {
    const streaks = await Streak.find({ user: req.user.id, isActive: true })

    res.status(200).json({
      success: true,
      data: streaks,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Check in for streak
// @route   POST /api/streaks/checkin
// @access  Private
export const checkIn = async (req, res, next) => {
  try {
    const { type, activity, metadata } = req.body

    let streak = await Streak.findOne({
      user: req.user.id,
      type,
      isActive: true,
    })

    if (!streak) {
      streak = await Streak.create({
        user: req.user.id,
        type,
        milestones: [
          { days: 7, reward: "Week Warrior Badge" },
          { days: 30, reward: "Month Master Badge" },
          { days: 100, reward: "Century Champion Badge" },
        ],
      })
    }

    const result = streak.checkIn(activity, metadata)

    if (result.success) {
      await streak.save()
    }

    res.status(200).json({
      success: result.success,
      message: result.message,
      data: streak,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update streak goal
// @route   PUT /api/streaks/goal
// @access  Private
export const updateGoal = async (req, res, next) => {
  try {
    const { type, goal } = req.body

    const streak = await Streak.findOneAndUpdate(
      { user: req.user.id, type, isActive: true },
      { goal },
      { new: true, runValidators: true },
    )

    if (!streak) {
      return res.status(404).json({
        success: false,
        message: "Streak not found",
      })
    }

    res.status(200).json({
      success: true,
      data: streak,
    })
  } catch (error) {
    next(error)
  }
}
