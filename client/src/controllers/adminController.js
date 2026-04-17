const User = require('../models/User');
const Booking = require('../models/Booking');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or reject tutor
// @route   PUT /api/admin/tutors/:id/approve
// @access  Private/Admin
const approveTutor = async (req, res, next) => {
  try {
    const tutor = await User.findById(req.params.id);

    if (!tutor || tutor.role !== 'tutor') {
      res.status(404);
      throw new Error('Tutor not found');
    }

    tutor.isApproved = req.body.isApproved;
    await tutor.save();

    res.json({ success: true, tutor });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin analytics overview
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getAnalytics = async (req, res, next) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalTutors = await User.countDocuments({ role: 'tutor' });
    const totalBookings = await Booking.countDocuments();
    const completedBookings = await Booking.countDocuments({ status: 'completed' });

    // Revenue from completed bookings
    const completedBookingDocs = await Booking.find({ status: 'completed' });
    const totalRevenue = completedBookingDocs.reduce((acc, booking) => acc + booking.totalPrice, 0);

    // Get popular subjects
    const popularSubjects = await Booking.aggregate([
      { $group: { _id: '$subject', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      users: { students: totalStudents, tutors: totalTutors },
      bookings: { total: totalBookings, completed: completedBookings },
      revenue: totalRevenue,
      popularSubjects: popularSubjects.map(p => ({ subject: p._id, count: p.count }))
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, approveTutor, getAnalytics };
