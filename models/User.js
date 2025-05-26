import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please add a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 6,
      select: false,
    },
    age: {
      type: Number,
      required: [true, "Please add your age"],
      min: [13, "Age must be at least 13"],
      max: [120, "Age must be less than 120"],
    },
    weight: {
      type: Number,
      required: [true, "Please add your weight"],
      min: [20, "Weight must be at least 20 kg"],
      max: [500, "Weight must be less than 500 kg"],
    },
    height: {
      type: Number,
      required: [true, "Please add your height"],
      min: [100, "Height must be at least 100 cm"],
      max: [250, "Height must be less than 250 cm"],
    },
    gender: {
      type: String,
      required: [true, "Please specify gender"],
      enum: ["male", "female", "other"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    preferences: {
      dietType: {
        type: String,
        enum: ["balanced", "low-carb", "high-protein", "vegetarian", "vegan", "keto"],
        default: "balanced",
      },
      fitnessLevel: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
        default: "beginner",
      },
      goals: [
        {
          type: String,
          enum: ["weight-loss", "muscle-gain", "maintenance", "endurance", "strength"],
        },
      ],
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        reminders: { type: Boolean, default: true },
      },
    },
    avatar: {
      type: String,
      default: "default-avatar.png",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Virtual for BMI calculation
userSchema.virtual("bmi").get(function () {
  const heightInMeters = this.height / 100
  return (this.weight / (heightInMeters * heightInMeters)).toFixed(1)
})

// Encrypt password using bcrypt
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "30d",
  })
}

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// Update last login
userSchema.methods.updateLastLogin = function () {
  this.lastLogin = new Date()
  return this.save({ validateBeforeSave: false })
}

export default mongoose.model("User", userSchema)
