import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { bookingAPI, reviewAPI } from '../../services/api';
import { FiCalendar, FiClock, FiX, FiStar, FiMail, FiPhone } from 'react-icons/fi';

const STATUS_TABS = ['all', 'pending', 'rescheduled', 'confirmed', 'completed', 'cancelled'];

const statusColor = {
  pending: 'bg-[rgba(255,183,77,0.15)] text-[#FFB74D]',
  rescheduled: 'bg-[rgba(0,212,170,0.15)] text-[#00D4AA]',
  confirmed: 'bg-[rgba(108,99,255,0.15)] text-[#8B83FF]',
  completed: 'bg-[rgba(76,175,80,0.15)] text-[#4CAF50]',
  cancelled: 'bg-[rgba(255,82,82,0.15)] text-[#FF5252]',
};

const MyBookings = () => {
  const { user } = useAuth();
  const isTutor = user?.role === 'tutor';
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [reviewModal, setReviewModal] = useState(null);
  const [rescheduleModal, setRescheduleModal] = useState(null);
  const [rescheduleForm, setRescheduleForm] = useState({ date: '', time: '' });
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchBookings = () => {
    setLoading(true);
    bookingAPI.getMine()
      .then((res) => setBookings(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleUpdateStatus = async (id, status, confirmMsg, extraData = {}) => {
    if (confirmMsg && !window.confirm(confirmMsg)) return;
    try {
      await bookingAPI.updateStatus(id, status, extraData);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!rescheduleForm.date || !rescheduleForm.time) {
      alert('Please select date and time');
      return;
    }
    try {
      await bookingAPI.updateStatus(rescheduleModal._id, 'rescheduled', { date: rescheduleForm.date, time: rescheduleForm.time });
      setRescheduleModal(null);
      setRescheduleForm({ date: '', time: '' });
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reschedule');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    try {
      await reviewAPI.create({
        tutor: reviewModal.tutor._id,
        booking: reviewModal._id,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });
      setMsg('✅ Review submitted successfully!');
      setTimeout(() => { setReviewModal(null); setMsg(''); fetchBookings(); }, 1500);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  const filtered = activeTab === 'all' ? bookings : bookings.filter((b) => b.status === activeTab);
  const getInitials = (name) => name ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : '?';

  return (
    <div className="pt-[100px] pb-[64px] min-h-screen">
      <div className="w-full max-w-[1200px] mx-auto px-[20px]">
        <div className="mb-[32px] animate-[fadeInDown_0.5s_ease_forwards]">
          <h1 className="text-[2rem] font-[700] text-white mb-[6px]">My <span className="gradient-text">Bookings</span></h1>
          <p className="text-[#b0b0cc]">Track all your tuition session requests</p>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-[8px] flex-wrap mb-[28px] pb-[16px] border-b border-[rgba(255,255,255,0.1)]">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              className={`flex items-center gap-[6px] px-[16px] py-[8px] border rounded-full text-[0.87rem] font-[500] cursor-pointer transition-all ${activeTab === tab ? 'bg-[rgba(108,99,255,0.12)] border-[#6C63FF] text-[#8B83FF]' : 'bg-transparent border-[rgba(255,255,255,0.1)] text-[#b0b0cc] hover:border-[#6C63FF] hover:text-[#8B83FF]'}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              <span className="bg-[rgba(255,255,255,0.1)] rounded-full px-[7px] py-[1px] text-[0.75rem]">
                {tab === 'all' ? bookings.length : bookings.filter((b) => b.status === tab).length}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col gap-[16px]">
            {[1,2,3].map((i) => <div key={i} className="h-[160px] bg-gradient-to-r from-[rgba(255,255,255,0.03)] via-[rgba(255,255,255,0.06)] to-[rgba(255,255,255,0.03)] bg-[length:200%_100%] animate-[shimmer_1.5s_infinite] rounded-[16px] border border-[rgba(255,255,255,0.1)]" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-[80px] px-[20px]">
            <div className="text-[4rem] mb-[16px]">📋</div>
            <h3 className="text-[1.3rem] text-white font-[600] mb-[8px]">No {activeTab === 'all' ? '' : activeTab} bookings</h3>
            {!isTutor && (
              <Link to="/tutors" className="inline-flex items-center justify-center px-[28px] py-[12px] rounded-[12px] font-[600] text-[0.95rem] bg-gradient-to-br from-[#6C63FF] to-[#5A52D5] text-white shadow-[0_4px_15px_rgba(108,99,255,0.35)] transition-all hover:-translate-y-[2px] mt-[16px]">Find a Tutor</Link>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-[16px]">
            {filtered.map((b) => {
              const otherParty = isTutor ? b.student : b.tutor;
              return (
                <div key={b._id} className="p-[24px] bg-[rgba(255,255,255,0.06)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] rounded-[16px] transition-all duration-300 hover:border-[#6C63FF] hover:shadow-[0_0_30px_rgba(108,99,255,0.15)] hover:-translate-y-[4px] animate-[fadeInUp_0.6s_ease_forwards]">
                  <div className="flex justify-between items-start mb-[16px] flex-wrap gap-[12px]">
                    <div className="flex gap-[12px] items-center">
                      {otherParty?.avatar
                        ? <img src={otherParty.avatar} alt="" className="w-[48px] h-[48px] rounded-full object-cover" />
                        : <div className="w-[48px] h-[48px] rounded-full bg-gradient-to-br from-[#6C63FF] to-[#00D4AA] flex items-center justify-center text-[0.9rem] font-[700] text-white shrink-0">{getInitials(otherParty?.name)}</div>
                      }
                      <div>
                        <div className="font-[700] text-white text-[1rem] mb-[2px]">{otherParty?.name}</div>
                        <div className="text-[0.85rem] text-[#8B83FF]">{b.subject}</div>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-[12px] py-[4px] rounded-full text-[0.8rem] font-[600] capitalize ${statusColor[b.status]}`}>{b.status}</span>
                  </div>

                  <div className="flex gap-[20px] flex-wrap mb-[12px] p-[12px_14px] bg-[rgba(255,255,255,0.03)] rounded-[12px]">
                    <span className="flex items-center gap-[5px] text-[0.85rem] text-[#b0b0cc]"><FiCalendar className="text-[#00D4AA]" /> {new Date(b.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span className="flex items-center gap-[5px] text-[0.85rem] text-[#b0b0cc]"><FiClock className="text-[#00D4AA]" /> {b.time}</span>
                    <span className="flex items-center gap-[5px] text-[0.85rem] text-[#b0b0cc]">⏱ {b.duration} hr{b.duration > 1 ? 's' : ''}</span>
                    <span className="text-[#00D4AA] font-[700]">৳{b.totalPrice}</span>
                  </div>

                  {b.message && (
                    <p className="text-[0.87rem] text-[#6b6b8d] italic p-[10px_14px] border-l-[2px] border-[#6C63FF] mb-[12px]">"{b.message}"</p>
                  )}

                  {(b.status === 'confirmed' || b.status === 'completed') && (
                    <div className="flex flex-col gap-[8px] mb-[12px] p-[12px_16px] bg-[rgba(108,99,255,0.05)] border border-[rgba(108,99,255,0.15)] rounded-[12px]">
                      <div className="text-[0.85rem] font-[600] text-[#8B83FF] mb-[2px]">{isTutor ? 'Student Contact Info' : 'Tutor Contact Info'}</div>
                      <div className="flex gap-[20px] flex-wrap">
                        {otherParty?.email ? (
                          <a href={`mailto:${otherParty.email}`} className="flex items-center gap-[8px] text-[0.9rem] text-white hover:text-[#00D4AA] transition-colors">
                            <FiMail className="text-[#6C63FF]" />
                            {otherParty.email}
                          </a>
                        ) : (
                          <span className="flex items-center gap-[8px] text-[0.9rem] text-[#6b6b8d]">
                            <FiMail className="text-[#6b6b8d]" /> No email provided
                          </span>
                        )}
                        {otherParty?.phone ? (
                          <a href={`tel:${otherParty.phone}`} className="flex items-center gap-[8px] text-[0.9rem] text-white hover:text-[#00D4AA] transition-colors">
                            <FiPhone className="text-[#6C63FF]" />
                            {otherParty.phone}
                          </a>
                        ) : (
                          <span className="flex items-center gap-[8px] text-[0.9rem] text-[#6b6b8d]">
                            <FiPhone className="text-[#6b6b8d]" /> No phone provided
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-[10px] flex-wrap">
                    {(b.status === 'pending' || b.status === 'rescheduled') && !isTutor && (
                      <>
                        <button className="inline-flex items-center justify-center gap-[6px] px-[16px] py-[6px] bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] text-[#b0b0cc] rounded-[8px] text-[0.85rem] font-[500] hover:bg-[rgba(255,255,255,0.12)] hover:text-white" onClick={() => handleUpdateStatus(b._id, 'cancelled', 'Cancel this booking?')}>
                          <FiX /> Cancel
                        </button>
                        <button className="inline-flex items-center justify-center gap-[6px] px-[16px] py-[6px] bg-[rgba(0,212,170,0.1)] border border-[rgba(0,212,170,0.25)] text-[#00D4AA] rounded-[8px] text-[0.85rem] font-[500] hover:bg-[rgba(0,212,170,0.2)] hover:text-white" onClick={() => setRescheduleModal(b)}>
                          <FiClock /> Reschedule
                        </button>
                      </>
                    )}
                    {(b.status === 'pending' || b.status === 'rescheduled') && isTutor && (
                      <>
                        <button className="inline-flex items-center justify-center gap-[6px] px-[16px] py-[6px] bg-[#00D4AA] text-black rounded-[8px] text-[0.85rem] font-[600] hover:bg-[#00e6b8] hover:-translate-y-[2px] transition-all hover:shadow-[0_4px_15px_rgba(0,212,170,0.3)]" onClick={() => handleUpdateStatus(b._id, 'confirmed', 'Confirm this booking?')}>
                          Confirm
                        </button>
                        <button className="inline-flex items-center justify-center gap-[6px] px-[16px] py-[6px] bg-[rgba(0,212,170,0.1)] border border-[rgba(0,212,170,0.25)] text-[#00D4AA] rounded-[8px] text-[0.85rem] font-[500] hover:bg-[rgba(0,212,170,0.2)] hover:text-white" onClick={() => setRescheduleModal(b)}>
                          <FiClock /> Reschedule
                        </button>
                        <button className="inline-flex items-center justify-center gap-[6px] px-[16px] py-[6px] bg-[rgba(255,82,82,0.1)] border border-[rgba(255,82,82,0.25)] text-[#ff7a7a] rounded-[8px] text-[0.85rem] font-[500] hover:bg-[rgba(255,82,82,0.2)] hover:text-white" onClick={() => handleUpdateStatus(b._id, 'cancelled', 'Reject this booking?')}>
                          <FiX /> Reject
                        </button>
                      </>
                    )}
                    {b.status === 'confirmed' && isTutor && (
                      <button className="inline-flex items-center justify-center gap-[6px] px-[16px] py-[6px] bg-[#6C63FF] text-white rounded-[8px] text-[0.85rem] font-[600] hover:bg-[#5A52D5] hover:-translate-y-[2px] transition-all hover:shadow-[0_4px_15px_rgba(108,99,255,0.3)]" onClick={() => handleUpdateStatus(b._id, 'completed', 'Mark as completed?')}>
                        Mark Completed
                      </button>
                    )}
                    {b.status === 'completed' && !isTutor && (
                      <button className="inline-flex items-center justify-center gap-[6px] px-[16px] py-[6px] bg-[#00D4AA] text-black rounded-[8px] text-[0.85rem] font-[600] hover:bg-[#00e6b8] hover:-translate-y-[2px] transition-all hover:shadow-[0_4px_15px_rgba(0,212,170,0.3)]" onClick={() => setReviewModal(b)}>
                        <FiStar /> Leave Review
                      </button>
                    )}
                    {!isTutor && (
                      <Link to={`/tutors/${b.tutor?._id}`} className="inline-flex items-center justify-center gap-[6px] px-[16px] py-[6px] bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] text-[#b0b0cc] rounded-[8px] text-[0.85rem] font-[500] hover:bg-[rgba(255,255,255,0.12)] hover:text-white">
                        View Tutor
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewModal && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.7)] backdrop-blur-[6px] z-[2000] flex items-center justify-center p-[20px]" onClick={() => setReviewModal(null)}>
          <div className="w-full max-w-[500px] max-h-[90vh] overflow-y-auto p-[32px] bg-[rgba(255,255,255,0.06)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] rounded-[16px] animate-[scaleIn_0.3s_ease_forwards]" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-[24px]">
              <h2 className="text-[1.3rem] font-[700] text-white">⭐ Review {reviewModal.tutor?.name}</h2>
              <button className="w-[32px] h-[32px] rounded-full flex items-center justify-center text-[#6b6b8d] text-[1.1rem] hover:bg-[rgba(255,255,255,0.08)] hover:text-white transition-all bg-transparent border-none cursor-pointer" onClick={() => setReviewModal(null)}>✕</button>
            </div>
            {msg && <div className={`p-[12px_16px] rounded-[12px] text-[0.9rem] mb-[20px] border ${msg.startsWith('✅') ? 'bg-[rgba(76,175,80,0.1)] border-[rgba(76,175,80,0.25)] text-[#69c16d]' : 'bg-[rgba(255,82,82,0.1)] border-[rgba(255,82,82,0.25)] text-[#ff7a7a]'}`}>{msg}</div>}
            <form onSubmit={handleReviewSubmit}>
              <div className="flex flex-col mb-[16px]">
                <label className="block mb-[12px] text-[0.9rem] font-[500] text-[#b0b0cc]">Rating</label>
                <div className="flex gap-[8px]">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: s })}
                      className={`w-[48px] h-[48px] flex items-center justify-center text-[2rem] leading-none rounded-[8px] transition-all ${
                        reviewForm.rating >= s
                          ? 'bg-[rgba(255,183,77,0.2)] border border-[#FFB74D] text-[#FFB74D] shadow-[0_0_10px_rgba(255,183,77,0.3)]'
                          : 'bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.3)] hover:bg-[rgba(255,255,255,0.08)] hover:text-[rgba(255,255,255,0.5)]'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <p className="text-[0.8rem] text-[#8B83FF] mt-[8px]">Rating: {reviewForm.rating}/5</p>
              </div>
              <div className="flex flex-col mb-[20px]">
                <label className="block mb-[8px] text-[0.9rem] font-[500] text-[#b0b0cc]">Your Review</label>
                <textarea className="w-full py-[12px] px-[16px] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] rounded-[12px] text-white text-[0.95rem] outline-none transition-all focus:border-[#6C63FF] resize-y" rows={4} placeholder="Share your experience..."
                  value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} />
              </div>
              <button type="submit" className="w-full inline-flex items-center justify-center gap-[8px] px-[28px] py-[12px] rounded-[12px] font-[600] text-[0.95rem] bg-gradient-to-br from-[#6C63FF] to-[#5A52D5] text-white shadow-[0_4px_15px_rgba(108,99,255,0.35)] transition-all hover:-translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed" disabled={reviewLoading || !reviewForm.comment}>
                {reviewLoading ? <span className="inline-block w-[18px] h-[18px] border-2 border-[rgba(255,255,255,0.3)] border-t-white rounded-full animate-[spin_0.8s_linear_infinite]" /> : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleModal && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.7)] backdrop-blur-[6px] z-[2000] flex items-center justify-center p-[20px]" onClick={() => setRescheduleModal(null)}>
          <div className="w-full max-w-[400px] p-[32px] bg-[rgba(255,255,255,0.06)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] rounded-[16px] animate-[scaleIn_0.3s_ease_forwards]" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-[24px]">
              <h2 className="text-[1.3rem] font-[700] text-white">🗓️ Reschedule</h2>
              <button className="w-[32px] h-[32px] rounded-full flex items-center justify-center text-[#6b6b8d] text-[1.1rem] hover:bg-[rgba(255,255,255,0.08)] hover:text-white transition-all bg-transparent border-none cursor-pointer" onClick={() => setRescheduleModal(null)}>✕</button>
            </div>
            <form onSubmit={handleRescheduleSubmit}>
              <div className="flex flex-col mb-[16px]">
                <label className="block mb-[8px] text-[0.9rem] font-[500] text-[#b0b0cc]">New Date</label>
                <input type="date" className="w-full py-[12px] px-[16px] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] rounded-[12px] text-white text-[0.95rem] outline-none transition-all focus:border-[#6C63FF]" required value={rescheduleForm.date} onChange={(e) => setRescheduleForm({ ...rescheduleForm, date: e.target.value })} min={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="flex flex-col mb-[24px]">
                <label className="block mb-[8px] text-[0.9rem] font-[500] text-[#b0b0cc]">New Time</label>
                <input type="time" className="w-full py-[12px] px-[16px] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] rounded-[12px] text-white text-[0.95rem] outline-none transition-all focus:border-[#6C63FF]" required value={rescheduleForm.time} onChange={(e) => setRescheduleForm({ ...rescheduleForm, time: e.target.value })} />
              </div>
              <button type="submit" className="w-full inline-flex items-center justify-center gap-[8px] px-[28px] py-[12px] rounded-[12px] font-[600] text-[0.95rem] bg-[rgba(0,212,170,0.15)] text-[#00D4AA] border border-[rgba(0,212,170,0.3)] shadow-[0_4px_15px_rgba(0,212,170,0.2)] transition-all hover:-translate-y-[2px] hover:bg-[rgba(0,212,170,0.25)]">
                Update Schedule
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
