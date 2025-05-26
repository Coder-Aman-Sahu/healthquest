import mongoose from "mongoose"

const mealSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a meal title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please add a meal description"],
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    category: {
      type: String,
      required: [true, "Please specify meal category"],
      enum: ["breakfast", "lunch", "dinner", "snacks", "drinks"],
    },
    cuisine: {
      type: String,
      enum: ["american", "italian", "mexican", "asian", "indian", "mediterranean", "other"],
    },
    ingredients: [
      {
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        unit: {
          type: String,
          required: true,
          enum: ["g", "kg", "ml", "l", "cup", "tbsp", "tsp", "piece", "slice"],
        },
      },
    ],
    instructions: [
      {
        step: {
          type: Number,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
      },
    ],
    nutrition: {
      calories: {
        type: Number,
        required: [true, "Please add calorie information"],
        min: [0, "Calories cannot be negative"],
      },
      protein: {
        type: Number,
        required: [true, "Please add protein information"],
        min: [0, "Protein cannot be negative"],
      },
      carbs: {
        type: Number,
        required: [true, "Please add carbohydrate information"],
        min: [0, "Carbs cannot be negative"],
      },
      fats: {
        type: Number,
        required: [true, "Please add fat information"],
        min: [0, "Fats cannot be negative"],
      },
      fiber: {
        type: Number,
        min: [0, "Fiber cannot be negative"],
      },
      sugar: {
        type: Number,
        min: [0, "Sugar cannot be negative"],
      },
      sodium: {
        type: Number,
        min: [0, "Sodium cannot be negative"],
      },
    },
    prepTime: {
      type: Number,
      required: [true, "Please add preparation time"],
      min: [1, "Prep time must be at least 1 minute"],
    },
    cookTime: {
      type: Number,
      min: [0, "Cook time cannot be negative"],
    },
    servings: {
      type: Number,
      required: [true, "Please specify number of servings"],
      min: [1, "Must serve at least 1 person"],
    },
    difficulty: {
      type: String,
      required: [true, "Please specify difficulty level"],
      enum: ["easy", "medium", "hard"],
    },
    tags: [
      {
        type: String,
        enum: [
          "vegetarian",
          "vegan",
          "gluten-free",
          "dairy-free",
          "low-carb",
          "high-protein",
          "keto",
          "paleo",
          "quick",
          "healthy",
          "comfort-food",
        ],
      },
    ],
    image: {
      type: String,
      default: "default-meal.jpg",
    },
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Virtual for total time
mealSchema.virtual("totalTime").get(function () {
  return this.prepTime + (this.cookTime || 0)
})

// Index for efficient searches
mealSchema.index({ category: 1, tags: 1 })
mealSchema.index({ "nutrition.calories": 1 })
mealSchema.index({ difficulty: 1, prepTime: 1 })
mealSchema.index({ title: "text", description: "text" })

export default mongoose.model("Meal", mealSchema)
