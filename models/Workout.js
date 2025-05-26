import mongoose from "mongoose"

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add exercise name"],
    trim: true,
  },
  type: {
    type: String,
    required: [true, "Please specify exercise type"],
    enum: ["cardio", "strength", "flexibility", "balance", "sports"],
  },
  muscleGroups: [
    {
      type: String,
      enum: [
        "chest",
        "back",
        "shoulders",
        "biceps",
        "triceps",
        "forearms",
        "abs",
        "obliques",
        "glutes",
        "quadriceps",
        "hamstrings",
        "calves",
        "full-body",
        "core",
      ],
    },
  ],
  equipment: [
    {
      type: String,
      enum: [
        "none",
        "dumbbells",
        "barbell",
        "resistance-bands",
        "kettlebell",
        "pull-up-bar",
        "bench",
        "machine",
        "cable",
        "medicine-ball",
      ],
    },
  ],
  instructions: [
    {
      step: Number,
      description: String,
    },
  ],
  duration: {
    type: Number, // in seconds
    min: [1, "Duration must be at least 1 second"],
  },
  sets: {
    type: Number,
    min: [1, "Must have at least 1 set"],
  },
  reps: {
    type: Number,
    min: [1, "Must have at least 1 rep"],
  },
  weight: {
    type: Number,
    min: [0, "Weight cannot be negative"],
  },
  restTime: {
    type: Number, // in seconds
    default: 60,
  },
  caloriesBurned: {
    type: Number,
    min: [0, "Calories burned cannot be negative"],
  },
})

const workoutSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a workout title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    category: {
      type: String,
      required: [true, "Please specify workout category"],
      enum: ["strength", "cardio", "hiit", "yoga", "pilates", "crossfit", "sports", "flexibility"],
    },
    difficulty: {
      type: String,
      required: [true, "Please specify difficulty level"],
      enum: ["beginner", "intermediate", "advanced"],
    },
    duration: {
      type: Number,
      required: [true, "Please add workout duration"],
      min: [1, "Duration must be at least 1 minute"],
    },
    exercises: [exerciseSchema],
    equipment: [
      {
        type: String,
        enum: [
          "none",
          "dumbbells",
          "barbell",
          "resistance-bands",
          "kettlebell",
          "pull-up-bar",
          "bench",
          "machine",
          "cable",
          "medicine-ball",
        ],
      },
    ],
    location: [
      {
        type: String,
        enum: ["home", "gym", "outdoor", "pool"],
      },
    ],
    targetMuscles: [
      {
        type: String,
        enum: [
          "chest",
          "back",
          "shoulders",
          "biceps",
          "triceps",
          "forearms",
          "abs",
          "obliques",
          "glutes",
          "quadriceps",
          "hamstrings",
          "calves",
          "full-body",
          "core",
        ],
      },
    ],
    caloriesBurned: {
      type: Number,
      min: [0, "Calories burned cannot be negative"],
    },
    image: {
      type: String,
      default: "default-workout.jpg",
    },
    video: String,
    tags: [
      {
        type: String,
        enum: [
          "fat-loss",
          "muscle-building",
          "endurance",
          "flexibility",
          "strength",
          "quick",
          "no-equipment",
          "beginner-friendly",
          "high-intensity",
        ],
      },
    ],
    rating: {
      average: {
        type: Number,
        min: [1, "Rating must be at least 1"],
        max: [5, "Rating must not be more than 5"],
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

// Index for efficient searches
workoutSchema.index({ category: 1, difficulty: 1 })
workoutSchema.index({ duration: 1, equipment: 1 })
workoutSchema.index({ title: "text", description: "text" })

export default mongoose.model("Workout", workoutSchema)
