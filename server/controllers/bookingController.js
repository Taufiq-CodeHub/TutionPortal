const Booking = require('../models/Booking');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Private (Student only)
const createBooking = async (req, res, next) => {
  try {
    const { tutor, subject, date, time, duration, message } = req.body;

    // Verify tutor exists
    const tutorUser = await User.findById(tutor);
    if (!tutorUser || tutorUser.role !== 'tutor') {
      res.status(404);
      throw new Error('Tutor not found');
    }

    const totalPrice = tutorUser.hourlyRate * (duration || 1);

    const booking = await Booking.create({
      student: req.user._id,
      tutor,
      subject,
      date,
      time,
      duration: duration || 1,
      totalPrice,
      message: message || '',
      status: 'pending',
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('student', 'name email avatar')
      .populate('tutor', 'name email avatar subjects hourlyRate isApproved');

    // Notify Tutor
    try {
      await sendEmail({
        email: tutorUser.email,
        subject: 'New Booking Request',
        message: `You have a new booking request from ${req.user.name} for ${subject}. Please check your dashboard to confirm.`
      });
    } catch (e) {
      console.log('Notification failed');
    }

    res.status(201).json(populatedBooking);
  } catch (error) {
    next(error);
  }
};

// @desc    Get my bookings (student or tutor)
// @route   GET /api/bookings/mine
// @access  Private
const getMyBookings = async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role === 'student') {
      query.student = req.user._id;
    } else if (req.user.role === 'tutor') {
      query.tutor = req.user._id;
    }

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    const bookings = await Booking.find(query)
      .populate('student', 'name email avatar phone')
      .populate('tutor', 'name email avatar subjects hourlyRate phone')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status (confirm/complete/cancel)
// @route   PUT /api/bookings/:id/status
// @access  Private
const updateBookingStatus = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    const { status, date, time } = req.body;

    // Tutor can confirm or complete, or reschedule
    if (req.user.role === 'tutor') {
      if (booking.tutor.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('This is not your booking');
      }
      if (!['confirmed', 'completed', 'cancelled', 'rescheduled'].includes(status)) {
        res.status(400);
        throw new Error('Invalid status');
      }
    }

    // Student can cancel or reschedule
    if (req.user.role === 'student') {
      if (booking.student.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('This is not your booking');
      }
      if (!['cancelled', 'rescheduled'].includes(status)) {
        res.status(400);
        throw new Error('Students can only cancel or reschedule a booking');
      }
    }

    booking.status = status;
    if (date) booking.date = date;
    if (time) booking.time = time;
    const updatedBooking = await booking.save();

    const populatedBooking = await Booking.findById(updatedBooking._id)
      .populate('student', 'name email avatar phone')
      .populate('tutor', 'name email avatar subjects hourlyRate phone');

    // Notify the other party
    try {
      const recipient = req.user.role === 'tutor' ? populatedBooking.student : populatedBooking.tutor;
      const roleText = req.user.role === 'tutor' ? 'Tutor' : 'Student';
      await sendEmail({
        email: recipient.email,
        subject: `Booking ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        message: `Your booking status has been updated to "${status}" by the ${roleText}.`
      });
    } catch (e) {
      console.log('Notification failed');
    }

    res.json(populatedBooking);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete/Cancel a booking
// @route   DELETE /api/bookings/:id
// @access  Private (Owner)
const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    // Only allow deletion if user is student who created it and status is pending
    if (
      booking.student.toString() !== req.user._id.toString() &&
      booking.tutor.toString() !== req.user._id.toString()
    ) {
      res.status(403);
      throw new Error('This is not your booking');
    }

    if (booking.status !== 'pending' && booking.status !== 'cancelled') {
      res.status(400);
      throw new Error('Only pending or cancelled bookings can be deleted');
    }

    await booking.deleteOne();
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a tutoring service (Tutor creates their own availability)
// @route   POST /api/bookings/service
// @access  Private (Tutor only)
const createTutorService = async (req, res, next) => {
  try {
    const { subject, date, time, duration, totalPrice, message } = req.body;

    // Only tutors can create services
    if (req.user.role !== 'tutor') {
      res.status(403);
      throw new Error('Only tutors can create services');
    }

    const booking = await Booking.create({
      student: req.user._id,  // placeholder (tutor's id) since model requires student
      tutor: req.user._id,
      subject,
      date,
      time,
      duration: duration || 1,
      totalPrice: totalPrice || 0,
      message: message || '',
      status: 'available', // Available for students to book
    });

    // Populate tutor information before returning
    const populatedBooking = await Booking.findById(booking._id).populate('tutor', 'name email avatar subjects hourlyRate location rating totalReviews');

    console.log('✅ Tutor service created:', booking._id);

    res.status(201).json(populatedBooking);
  } catch (error) {
    next(error);
  }
};

// @desc    Get available tutoring services
// @route   GET /api/bookings/available-services
// @access  Public
const getAvailableServices = async (req, res, next) => {
  try {
    const { subject, location } = req.query;

    let query = { status: 'available' };

    // Filter by subject
    if (subject) {
      query.subject = { $regex: subject, $options: 'i' };
    }

    const services = await Booking.find(query)
      .populate('tutor', 'name email avatar subjects hourlyRate location rating totalReviews')
      .sort({ createdAt: -1 });

    // Filter tutors by location if needed
    let filtered = services;
    if (location) {
      filtered = services.filter(s => 
        s.tutor.location && s.tutor.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    res.json(filtered);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a tutoring service created by a tutor
// @route   PUT /api/bookings/:id
// @access  Private (Tutor only)
const updateTutorService = async (req, res, next) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) {
      res.status(404);
      throw new Error('Service not found');
    }

    // Only the tutor who created the service can edit
    if (booking.tutor.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to edit this service');
    }

    if (booking.status !== 'available') {
      res.status(400);
      throw new Error('Only available services can be edited');
    }

    const allowed = ['subject', 'date', 'time', 'duration', 'totalPrice', 'message'];
    allowed.forEach(field => {
      if (req.body[field] !== undefined) booking[field] = req.body[field];
    });

    await booking.save();

    const populatedBooking = await Booking.findById(booking._id).populate('tutor', 'name email avatar subjects hourlyRate location rating totalReviews');
    res.json(populatedBooking);
  } catch (error) {
    next(error);
  }
};

module.exports = { createBooking, getMyBookings, updateBookingStatus, deleteBooking, createTutorService, getAvailableServices, updateTutorService };
