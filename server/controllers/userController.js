const User = require('../models/User');

const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    if (req.body.name !== undefined) user.name = req.body.name;
    if (req.body.phone !== undefined) user.phone = req.body.phone;
    if (req.body.bio !== undefined) user.bio = req.body.bio;
    if (req.body.avatar !== undefined) user.avatar = req.body.avatar;

    // Tutor-specific fields
    if (user.role === 'tutor') {
      if (req.body.subjects !== undefined) user.subjects = req.body.subjects;
      if (req.body.hourlyRate !== undefined) user.hourlyRate = req.body.hourlyRate;
      if (req.body.experience !== undefined) user.experience = req.body.experience;
      if (req.body.education !== undefined) user.education = req.body.education;
      if (req.body.location !== undefined) user.location = req.body.location;
      if (req.body.availability !== undefined) user.availability = req.body.availability;
    }

    // Only update password if explicitly provided and non-empty
    if (req.body.password && req.body.password.trim() !== '') {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      bio: updatedUser.bio,
      avatar: updatedUser.avatar,
      subjects: updatedUser.subjects,
      hourlyRate: updatedUser.hourlyRate,
      experience: updatedUser.experience,
      education: updatedUser.education,
      location: updatedUser.location,
      availability: updatedUser.availability,
      rating: updatedUser.rating,
      totalReviews: updatedUser.totalReviews,
      isVerified: updatedUser.isVerified,
      isApproved: updatedUser.isApproved,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { updateProfile };