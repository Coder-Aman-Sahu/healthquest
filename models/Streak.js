import mongoose from "mongoose"

const streakSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: [true, "Please specify streak type"],
      enum: ["workout", "nutrition", "water", "sleep", "meditation", "overall"],
    },
    currentStreak: {
      type: Number,
      default: 0,
      min: [0, "Current streak cannot be negative"],
    },
    longestStreak: {
      type: Number,
      default: 0,
      min: [0, "Longest streak cannot be negative"],
    },
    goal: {
      type: Number,
      default: 30,
      min: [1, "Goal must be at least 1 day"],
    },
    lastCheckIn: {
      type: Date,
    },
    streakHistory: [
      {
        date: {
          type: Date,
          required: true,
        },
        completed: {
          type: Boolean,
          required: true,
        },
        activity: {
          type: String,
          required: true,
        },
        metadata: {
          duration: Number,
          intensity: String,
          notes: String,
        },
      },
    ],
    milestones: [
      {
        days: {
          type: Number,
          required: true,
        },
        achieved: {
          type: Boolean,
          default: false,
        },
        achievedAt: Date,
        reward: {
          type: String,
          required: true,
        },
        claimed: {
          type: Boolean,
          default: false,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

// Index for efficient queries
streakSchema.index({ user: 1, type: 1 })
streakSchema.index({ user: 1, isActive: 1 })

// Method to check in for the day
streakSchema.methods.checkIn = function (activity, metadata = {}) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Check if already checked in today
  const todayEntry = this.streakHistory.find((entry) => {
    const entryDate = new Date(entry.date)
    entryDate.setHours(0, 0, 0, 0)
    return entryDate.getTime() === today.getTime()
  })

  if (todayEntry) {
    return { success: false, message: "Already checked in today" }
  }

  // Add today's entry
  this.streakHistory.push({
    date: today,
    completed: true,
    activity,
    metadata,
  })

  // Update current streak
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const yesterdayEntry = this.streakHistory.find((entry) => {
    const entryDate = new Date(entry.date)
    entryDate.setHours(0, 0, 0, 0)
    return entryDate.getTime() === yesterday.getTime() && entry.completed
  })

  if (yesterdayEntry || this.currentStreak === 0) {
    this.currentStreak += 1
  } else {
    this.currentStreak = 1
  }

  // Update longest streak
  if (this.currentStreak > this.longestStreak) {
    this.longestStreak = this.currentStreak
  }

  this.lastCheckIn = new Date()

  // Check for milestone achievements
  this.milestones.forEach((milestone) => {
    if (!milestone.achieved && this.currentStreak >= milestone.days) {
      milestone.achieved = true
      milestone.achievedAt = new Date()
    }
  })

  return { success: true, currentStreak: this.currentStreak }
}

// Method to break streak
streakSchema.methods.breakStreak = function () {
  this.currentStreak = 0
  this.lastCheckIn = new Date()
}

export default mongoose.model("Streak", streakSchema)
