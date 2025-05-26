import mongoose from "mongoose"

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: [true, "Please add comment content"],
      maxlength: [500, "Comment cannot be more than 500 characters"],
    },
    likes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  },
)

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: [true, "Please add post content"],
      maxlength: [1000, "Post cannot be more than 1000 characters"],
    },
    type: {
      type: String,
      required: [true, "Please specify post type"],
      enum: ["workout", "meal", "achievement", "progress", "general"],
    },
    images: [
      {
        type: String,
      },
    ],
    metadata: {
      workout: {
        type: mongoose.Schema.ObjectId,
        ref: "Workout",
      },
      meal: {
        type: mongoose.Schema.ObjectId,
        ref: "Meal",
      },
      achievement: {
        name: String,
        description: String,
        badge: String,
      },
      progress: {
        metric: String,
        value: Number,
        unit: String,
        previousValue: Number,
      },
    },
    likes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    comments: [commentSchema],
    shares: {
      type: Number,
      default: 0,
    },
    visibility: {
      type: String,
      enum: ["public", "friends", "private"],
      default: "public",
    },
    tags: [
      {
        type: String,
      },
    ],
    isActive: {
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

// Virtual for like count
postSchema.virtual("likeCount").get(function () {
  return this.likes.length
})

// Virtual for comment count
postSchema.virtual("commentCount").get(function () {
  return this.comments.length
})

// Index for efficient queries
postSchema.index({ user: 1, createdAt: -1 })
postSchema.index({ type: 1, visibility: 1 })
postSchema.index({ createdAt: -1, visibility: 1 })

export default mongoose.model("Post", postSchema)
