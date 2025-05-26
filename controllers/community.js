import Post from "../models/Post.js"

// @desc    Get all posts
// @route   GET /api/community/posts
// @access  Private
export const getPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, type } = req.query

    const query = { isActive: true, visibility: { $in: ["public", "friends"] } }
    if (type) query.type = type

    const posts = await Post.find(query)
      .populate("user", "name avatar")
      .populate("comments.user", "name avatar")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Post.countDocuments(query)

    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      pagination: {
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        pages: Math.ceil(total / limit),
      },
      data: posts,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Create new post
// @route   POST /api/community/posts
// @access  Private
export const createPost = async (req, res, next) => {
  try {
    req.body.user = req.user.id
    const post = await Post.create(req.body)

    const populatedPost = await Post.findById(post._id).populate("user", "name avatar")

    res.status(201).json({
      success: true,
      data: populatedPost,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Like/unlike post
// @route   POST /api/community/posts/:id/like
// @access  Private
export const likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      })
    }

    const likeIndex = post.likes.indexOf(req.user.id)

    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1)
    } else {
      post.likes.push(req.user.id)
    }

    await post.save()

    res.status(200).json({
      success: true,
      data: post,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Comment on post
// @route   POST /api/community/posts/:id/comment
// @access  Private
export const commentPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      })
    }

    const comment = {
      user: req.user.id,
      content: req.body.content,
    }

    post.comments.push(comment)
    await post.save()

    const updatedPost = await Post.findById(post._id)
      .populate("user", "name avatar")
      .populate("comments.user", "name avatar")

    res.status(200).json({
      success: true,
      data: updatedPost,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get challenges
// @route   GET /api/community/challenges
// @access  Private
export const getChallenges = async (req, res, next) => {
  try {
    // Mock challenges data - implement with actual Challenge model
    const challenges = [
      {
        _id: "1",
        title: "30-Day Fitness Challenge",
        description: "Complete 30 days of consistent workouts",
        participants: 156,
        duration: "30 days",
        reward: "Fitness Champion Badge",
      },
      {
        _id: "2",
        title: "Hydration Hero",
        description: "Drink 8 glasses of water daily for 7 days",
        participants: 89,
        duration: "7 days",
        reward: "Hydration Badge",
      },
    ]

    res.status(200).json({
      success: true,
      data: challenges,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Join challenge
// @route   POST /api/community/challenges/:id/join
// @access  Private
export const joinChallenge = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Successfully joined challenge",
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get friends
// @route   GET /api/community/friends
// @access  Private
export const getFriends = async (req, res, next) => {
  try {
    // Mock friends data - implement with actual Friend model
    const friends = [
      {
        _id: "1",
        name: "Sarah Johnson",
        avatar: "default-avatar.png",
        status: "online",
        lastActivity: "2 hours ago",
      },
      {
        _id: "2",
        name: "Mike Chen",
        avatar: "default-avatar.png",
        status: "offline",
        lastActivity: "1 day ago",
      },
    ]

    res.status(200).json({
      success: true,
      data: friends,
    })
  } catch (error) {
    next(error)
  }
}
