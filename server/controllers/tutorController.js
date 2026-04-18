const User = require('../models/User');
const Booking = require('../models/Booking');

// @desc    Get all tutors (with search & filters)
// @route   GET /api/tutors
// @access  Public
const getTutors = async (req, res, next) => {
  try {
    const { search, subject, location, minPrice, maxPrice, minRating, sort, page = 1, limit = 12 } = req.query;

    let query = { role: 'tutor', isApproved: true };

    // Search by name or subject
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { subjects: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by subject
    if (subject) {
      query.subjects = { $regex: subject, $options: 'i' };
    }

    // Filter by location
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.hourlyRate = {};
      if (minPrice) query.hourlyRate.$gte = Number(minPrice);
      if (maxPrice) query.hourlyRate.$lte = Number(maxPrice);
    }

    // Filter by minimum rating
    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    // Sort options
    let sortOption = { createdAt: -1 }; // default: newest
    if (sort === 'price_low') sortOption = { hourlyRate: 1 };
    if (sort === 'price_high') sortOption = { hourlyRate: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };
    if (sort === 'experience') sortOption = { experience: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const tutors = await User.find(query)
      .select('-password')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    res.json({
      tutors,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single tutor by ID
// @route   GET /api/tutors/:id
// @access  Public
const getTutorById = async (req, res, next) => {
  try {
    const tutor = await User.findById(req.params.id).select('-password');

    if (!tutor || tutor.role !== 'tutor' || !tutor.isApproved) {
      res.status(404);
      throw new Error('Tutor not found or not approved');
    }

    res.json(tutor);
  } catch (error) {
    next(error);
  }
};

// @desc    Get recommended tutors for a student based on past bookings
// @route   GET /api/tutors/recommended
// @access  Private (Student)
const getRecommendedTutors = async (req, res, next) => {
  try {
    const studentId = req.user._id;

    // Find previous bookings of this student
    const pastBookings = await Booking.find({ student: studentId }).distinct('subject');
    
    // If no past bookings, return some high-rated tutors as fallback
    let query = { role: 'tutor', isApproved: true };
    if (pastBookings.length > 0) {
      // Find tutors that teach subjects the student has booked before, excluding tutors already booked (optional, but let's keep it simple and just recommend by subject)
      // We will match tutors whose subjects intersect with past bookings
      query.subjects = { $in: pastBookings };
    }

    const recommendedTutors = await User.find(query)
      .select('-password')
      .sort({ rating: -1, totalReviews: -1 })
      .limit(6);

    res.json(recommendedTutors);
  } catch (error) {
    next(error);
  }
};

// @desc    Update tutor profile
// @route   PUT /api/tutors/profile
// @access  Private (Tutor)
const updateTutorProfile = async (req, res, next) => {
  try {
    const { subjects, hourlyRate, experience, education, location, availability, bio } = req.body;
    
    const tutor = await User.findById(req.user._id);
    
    if (!tutor || tutor.role !== 'tutor') {
      res.status(403);
      throw new Error('Only tutors can update tutor profile');
    }

    // Update fields
    if (subjects) tutor.subjects = subjects;
    if (hourlyRate) tutor.hourlyRate = hourlyRate;
    if (experience !== undefined) tutor.experience = experience;
    if (education) tutor.education = education;
    if (location) tutor.location = location;
    if (availability) tutor.availability = availability;
    if (bio) tutor.bio = bio;

    await tutor.save();

    console.log('✅ Tutor profile updated:', tutor._id);

    res.json({
      message: 'Profile updated successfully',
      tutor
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTutors, getTutorById, getRecommendedTutors, updateTutorProfile };
