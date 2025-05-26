import User from "../models/User.js"

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)

    res.status(200).json({
      success: true,
      data: user,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      age: req.body.age,
      weight: req.body.weight,
      height: req.body.height,
      preferences: req.body.preferences,
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      success: true,
      data: user,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Upload avatar
// @route   POST /api/users/avatar
// @access  Private
export const uploadAvatar = async (req, res, next) => {
  try {
    // Mock avatar upload - implement with multer
    res.status(200).json({
      success: true,
      message: "Avatar uploaded successfully",
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete user account
// @route   DELETE /api/users/account
// @access  Private
export const deleteAccount = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user.id)

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    })
  } catch (error) {
    next(error)
  }
}
