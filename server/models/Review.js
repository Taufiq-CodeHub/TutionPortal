const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Comment is required'],
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ booking: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
