import mongoose from "mongoose"

const reminderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: [true, "Please specify reminder type"],
      enum: ["water", "meals", "sleep", "supplements", "workout", "medication"],
    },
    title: {
      type: String,
      required: [true, "Please add a reminder title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    time: {
      type: String,
      required: [true, "Please specify reminder time"],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please provide time in HH:MM format"],
    },
    days: [
      {
        type: String,
        enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
      },
    ],
    enabled: {
      type: Boolean,
      default: true,
    },
    frequency: {
      type: String,
      enum: ["once", "daily", "weekly", "custom"],
      default: "daily",
    },
    status: {
      type: String,
      enum: ["pending", "completed", "missed", "snoozed"],
      default: "pending",
    },
    completedAt: Date,
    snoozeUntil: Date,
    metadata: {
      quantity: Number,
      unit: String,
      notes: String,
    },
  },
  {
    timestamps: true,
  },
)

// Index for efficient queries
reminderSchema.index({ user: 1, enabled: 1 })
reminderSchema.index({ user: 1, type: 1 })
reminderSchema.index({ time: 1, enabled: 1 })

export default mongoose.model("Reminder", reminderSchema)
