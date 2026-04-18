const Review = require('../models/Review');
const Booking = require('../models/Booking');
const User = require('../models/User');

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private (Student only, completed booking required)
const createReview = async (req, res, next) => {
  try {
    const { tutor, booking, rating, comment } = req.body;

    // Verify booking exists and is completed
    const bookingDoc = await Booking.findById(booking);
    if (!bookingDoc) {
      res.status(404);
      throw new Error('Booking not found');
    }

    if (bookingDoc.status !== 'completed') {
      res.status(400);
      throw new Error('You can only review a completed booking');
    }

    if (bookingDoc.student.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('This is not your booking');
    }

    // Check for existing review
    const existingReview = await Review.findOne({ booking, student: req.user._id });
    if (existingReview) {
      res.status(400);
      throw new Error('You have already reviewed this booking');
    }

    const review = await Review.create({
      student: req.user._id,
      tutor,
      booking,
      rating: Number(rating),
      comment,
    });

    // Update tutor's average rating
    const allReviews = await Review.find({ tutor });
    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await User.findByIdAndUpdate(tutor, {
      rating: Math.round(avgRating * 10) / 10,
      totalReviews: allReviews.length,
    });

    const populatedReview = await Review.findById(review._id)
      .populate('student', 'name avatar');

    res.status(201).json(populatedReview);
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a tutor
// @route   GET /api/reviews/tutor/:tutorId
// @access  Public
const getTutorReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ tutor: req.params.tutorId })
      .populate('student', 'name avatar')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

module.exports = { createReview, getTutorReviews };
