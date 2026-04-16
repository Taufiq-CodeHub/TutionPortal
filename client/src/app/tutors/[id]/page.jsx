import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tutorAPI, bookingAPI, reviewAPI } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { FiMapPin, FiStar, FiClock, FiCalendar, FiBook, FiSend } from 'react-icons/fi';

const TutorDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tutor, setTutor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingForm, setBookingForm] = useState({ subject: '', date: '', time: '', duration: 1, message: '' });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMsg, setBookingMsg] = useState('');
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    Promise.all([tutorAPI.getById(id), reviewAPI.getByTutor(id)])
      .then(([tutorRes, reviewRes]) => {
        setTutor(tutorRes.data);
        setReviews(reviewRes.data || []);
      })
      .catch(() => navigate('/tutors'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login', { state: { from: `/tutors/${id}` } }); return; }
    if (user.role !== 'student') { setBookingMsg('Only students can book tutors'); return; }
    if (!bookingForm.subject || !bookingForm.date || !bookingForm.time) {
      setBookingMsg('Please fill all required fields');
      return;
    }
    setBookingLoading(true);
    setBookingMsg('');
    try {
      await bookingAPI.create({ tutor: id, ...bookingForm });
      setBookingMsg('✅ Booking request sent successfully!');
      setBookingForm({ subject: '', date: '', time: '', duration: 1, message: '' });
      setTimeout(() => setShowBooking(false), 2000);
    } catch (err) {
      setBookingMsg(err.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-[0.75rem] ${i < Math.round(rating) ? 'text-[#FFB74D]' : 'text-[rgba(255,255,255,0.1)]'}`}>★</span>
    ));

  const getInitials = (name) =>
    name ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : 'T';

  if (loading) return <div className="fixed inset-0 bg-[#0d0d12] z-[9999] flex items-center justify-center"><div className="w-[40px] h-[40px] border-[3px] border-[rgba(108,99,255,0.2)] border-t-[#6C63FF] rounded-full animate-[spin_0.8s_linear_infinite]" /></div>;
  if (!tutor) return null;

  const estimatedPrice = tutor.hourlyRate * bookingForm.duration;

  return (
    <div className="pt-[100px] pb-[64px] min-h-screen">
      <div className="w-full max-w-[1200px] mx-auto px-[20px]">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-[40px] p-[36px] mb-[32px] bg-[rgba(255,255,255,0.06)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] rounded-[16px] animate-[fadeIn_0.5s_ease_forwards]">
          <div className="flex gap-[24px] items-start flex-1">
            <div className="shrink-0">
              {tutor.avatar
                ? <img src={tutor.avatar} alt={tutor.name} className="w-[100px] h-[100px] rounded-full object-cover border-[3px] border-[#6C63FF]" />
                : <div className="w-[100px] h-[100px] rounded-full bg-gradient-to-br from-[#6C63FF] to-[#00D4AA] flex items-center justify-center font-[700] text-[2rem] text-white border-[3px] border-[rgba(108,99,255,0.3)]">{getInitials(tutor.name)}</div>
              }
            </div>
            <div>
              <h1 className="text-[1.6rem] font-[700] text-white mb-[6px]">{tutor.name}</h1>
              {tutor.education && <p className="text-[0.9rem] text-[#b0b0cc] mb-[10px]">{tutor.education}</p>}
              <div className="flex gap-[16px] flex-wrap mb-[12px]">
                {tutor.location && <span className="flex items-center gap-[5px] text-[0.87rem] text-[#b0b0cc]"><FiMapPin className="text-[#00D4AA]" /> {tutor.location}</span>}
                <span className="flex items-center gap-[5px] text-[0.87rem] text-[#b0b0cc]"><FiClock className="text-[#00D4AA]" /> {tutor.experience || 0} years exp</span>
                <span className="flex items-center gap-[5px] text-[0.87rem] text-[#b0b0cc]"><FiBook className="text-[#00D4AA]" /> {tutor.subjects?.length || 0} subjects</span>
              </div>
              <div className="flex items-center gap-[8px]">
                <div className="flex">{renderStars(tutor.rating || 0)}</div>
                <strong className="text-white text-[0.95rem]">{tutor.rating?.toFixed(1) || '0.0'}</strong>
                <span className="text-[0.85rem] text-[#6b6b8d]">({tutor.totalReviews || 0} reviews)</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 w-full md:w-[220px]">
             <div className="bg-[rgba(108,99,255,0.06)] border border-[rgba(108,99,255,0.2)] rounded-[16px] p-[24px] text-center">
              <div className="mb-[20px]">
                <span className="text-[1.2rem] font-[700] text-[#00D4AA]">৳</span>
                <span className="text-[2.4rem] font-[900] text-white mx-[4px]">{tutor.hourlyRate || 0}</span>
                <span className="text-[0.9rem] text-[#6b6b8d]">/hour</span>
              </div>
              {user?.role === 'student' ? (
                <button className="w-full inline-flex items-center justify-center gap-[8px] px-[28px] py-[14px] rounded-[12px] font-[600] text-[1rem] bg-gradient-to-br from-[#6C63FF] to-[#5A52D5] text-white shadow-[0_4px_15px_rgba(108,99,255,0.35)] transition-all hover:-translate-y-[2px]" onClick={() => setShowBooking(true)}>
                  <FiCalendar /> Book Now
                </button>
              ) : !user ? (
                <button className="w-full inline-flex items-center justify-center gap-[8px] px-[28px] py-[14px] rounded-[12px] font-[600] text-[1rem] bg-gradient-to-br from-[#6C63FF] to-[#5A52D5] text-white shadow-[0_4px_15px_rgba(108,99,255,0.35)] transition-all hover:-translate-y-[2px]" onClick={() => navigate('/login')}>
                  Login to Book
                </button>
              ) : (
                <div className="p-[8px] bg-[rgba(255,255,255,0.04)] rounded-[12px] text-[0.85rem] text-[#6b6b8d]">You are a Tutor</div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-[20px]">
          {/* Left Column */}
          <div className="flex flex-col gap-[20px]">
            {/* About */}
            {tutor.bio && (
              <section className="p-[28px] bg-[rgba(255,255,255,0.06)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] rounded-[16px]">
                <h2 className="text-[1.1rem] font-[700] text-white mb-[16px] pb-[12px] border-b border-[rgba(255,255,255,0.1)]">About</h2>
                <p className="text-[#b0b0cc] leading-[1.8] text-[0.95rem]">{tutor.bio}</p>
              </section>
            )}

            {/* Subjects */}
            <section className="p-[28px] bg-[rgba(255,255,255,0.06)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] rounded-[16px]">
              <h2 className="text-[1.1rem] font-[700] text-white mb-[16px] pb-[12px] border-b border-[rgba(255,255,255,0.1)]">Subjects</h2>
              <div className="flex flex-wrap gap-[8px]">
                {tutor.subjects?.map((s, i) => <span key={i} className="px-[12px] py-[4px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-full text-[0.85rem] text-[#b0b0cc] transition-all hover:bg-[rgba(108,99,255,0.2)] hover:border-[#6C63FF] hover:text-white">{s}</span>)}
              </div>
            </section>

            {/* Availability */}
            {tutor.availability?.length > 0 && (
              <section className="p-[28px] bg-[rgba(255,255,255,0.06)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] rounded-[16px]">
                <h2 className="text-[1.1rem] font-[700] text-white mb-[16px] pb-[12px] border-b border-[rgba(255,255,255,0.1)]">Available Days</h2>
                <div className="flex flex-wrap gap-[8px]">
                  {tutor.availability.map((d, i) => (
                    <span key={i} className="px-[14px] py-[5px] bg-[rgba(0,212,170,0.1)] border border-[rgba(0,212,170,0.2)] text-[#00D4AA] rounded-full text-[0.85rem] font-[500]">{d}</span>
                  ))}
                </div>
              </section>
            )}

            {/* Reviews */}
            <section className="p-[28px] bg-[rgba(255,255,255,0.06)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] rounded-[16px]">
              <h2 className="text-[1.1rem] font-[700] text-white mb-[16px] pb-[12px] border-b border-[rgba(255,255,255,0.1)]">Reviews ({reviews.length})</h2>
              {reviews.length === 0 ? (
                <p className="text-[#6b6b8d] italic test-[0.95rem]">No reviews yet. Be the first to review!</p>
              ) : (
                <div className="flex flex-col gap-[20px]">
                  {reviews.map((r, idx) => (
                    <div key={r._id} className={`pb-[20px] ${idx !== reviews.length - 1 ? 'border-b border-[rgba(255,255,255,0.1)]' : ''}`}>
                      <div className="flex items-center gap-[12px] mb-[10px]">
                        <div className="shrink-0">
                          {r.student?.avatar
                            ? <img src={r.student.avatar} alt="" className="w-[36px] h-[36px] rounded-full object-cover" />
                            : <div className="w-[36px] h-[36px] rounded-full bg-gradient-to-br from-[#6C63FF] to-[#00D4AA] flex items-center justify-center font-[700] text-[0.75rem] text-white">{getInitials(r.student?.name)}</div>
                          }
                        </div>
                        <div>
                          <div className="font-[600] text-[0.9rem] text-white">{r.student?.name}</div>
                          <div className="flex">{renderStars(r.rating)}</div>
                        </div>
                        <div className="ml-auto text-[0.8rem] text-[#6b6b8d]">{new Date(r.createdAt).toLocaleDateString()}</div>
                      </div>
                      <p className="text-[0.9rem] text-[#b0b0cc] leading-[1.7]">{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.7)] backdrop-blur-[6px] z-[2000] flex items-center justify-center p-[20px]" onClick={() => setShowBooking(false)}>
          <div className="w-full max-w-[500px] max-h-[90vh] overflow-y-auto p-[32px] bg-[rgba(255,255,255,0.06)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] rounded-[16px] animate-[scaleIn_0.3s_ease_forwards]" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-[24px]">
              <h2 className="text-[1.3rem] font-[700] text-white">📅 Book {tutor.name}</h2>
              <button className="w-[32px] h-[32px] rounded-full flex justify-center items-center bg-transparent border-none text-[#6b6b8d] text-[1.1rem] cursor-pointer transition-all hover:bg-[rgba(255,255,255,0.08)] hover:text-white" onClick={() => setShowBooking(false)}>✕</button>
            </div>

            {bookingMsg && (
              <div className={`p-[12px_16px] rounded-[12px] text-[0.9rem] mb-[20px] border ${bookingMsg.startsWith('✅') ? 'bg-[rgba(76,175,80,0.1)] border-[rgba(76,175,80,0.25)] text-[#69c16d]' : 'bg-[rgba(255,82,82,0.1)] border-[rgba(255,82,82,0.25)] text-[#ff7a7a]'}`}>
                {bookingMsg}
              </div>
            )}

            <form onSubmit={handleBooking} className="flex flex-col gap-[16px]">
              <div className="flex flex-col">
                <label className="block mb-[8px] text-[0.9rem] font-[500] text-[#b0b0cc]">Subject *</label>
                <select className="w-full py-[12px] px-[16px] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] rounded-[12px] text-white text-[0.95rem] outline-none transition-all focus:border-[#6C63FF] focus:bg-[rgba(255,255,255,0.1)] [&>option]:bg-black" value={bookingForm.subject}
                  onChange={(e) => setBookingForm({ ...bookingForm, subject: e.target.value })}>
                  <option value="">Select subject</option>
                  {tutor.subjects?.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="block mb-[8px] text-[0.9rem] font-[500] text-[#b0b0cc]">Date *</label>
                <input type="date" className="w-full py-[12px] px-[16px] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] rounded-[12px] text-white text-[0.95rem] outline-none transition-all focus:border-[#6C63FF] focus:bg-[rgba(255,255,255,0.1)] [color-scheme:dark]"
                  min={new Date().toISOString().split('T')[0]}
                  value={bookingForm.date}
                  onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })} />
              </div>

              <div className="flex flex-col">
                <label className="block mb-[8px] text-[0.9rem] font-[500] text-[#b0b0cc]">Preferred Time *</label>
                <input type="text" className="w-full py-[12px] px-[16px] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] rounded-[12px] text-white text-[0.95rem] outline-none transition-all focus:border-[#6C63FF] focus:bg-[rgba(255,255,255,0.1)]" placeholder="e.g. 4:00 PM - 5:00 PM"
                  value={bookingForm.time}
                  onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })} />
              </div>

              <div className="flex flex-col">
                <label className="block mb-[8px] text-[0.9rem] font-[500] text-[#b0b0cc]">Duration (Hours)</label>
                <select className="w-full py-[12px] px-[16px] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] rounded-[12px] text-white text-[0.95rem] outline-none transition-all focus:border-[#6C63FF] focus:bg-[rgba(255,255,255,0.1)] [&>option]:bg-black" value={bookingForm.duration}
                  onChange={(e) => setBookingForm({ ...bookingForm, duration: Number(e.target.value) })}>
                  {[1, 1.5, 2, 2.5, 3].map((d) => <option key={d} value={d}>{d} hour{d > 1 ? 's' : ''}</option>)}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="block mb-[8px] text-[0.9rem] font-[500] text-[#b0b0cc]">Message (Optional)</label>
                <textarea className="w-full py-[12px] px-[16px] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] rounded-[12px] text-white text-[0.95rem] outline-none transition-all focus:border-[#6C63FF] focus:bg-[rgba(255,255,255,0.1)] resize-y" placeholder="Tell the tutor what you need help with..."
                  rows={3} value={bookingForm.message}
                  onChange={(e) => setBookingForm({ ...bookingForm, message: e.target.value })} />
              </div>

              <div className="flex justify-between items-center p-[14px_16px] bg-[rgba(0,212,170,0.06)] border border-[rgba(0,212,170,0.15)] rounded-[12px] my-[8px]">
                <span className="text-white">Estimated Total:</span>
                <strong className="text-[1.2rem] text-[#00D4AA]">৳{estimatedPrice}</strong>
              </div>

              <button type="submit" className="w-full inline-flex items-center justify-center gap-[8px] px-[28px] py-[12px] rounded-[12px] font-[600] text-[1.05rem] bg-gradient-to-br from-[#6C63FF] to-[#5A52D5] text-white shadow-[0_4px_15px_rgba(108,99,255,0.35)] transition-all hover:-translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed" disabled={bookingLoading}>
                {bookingLoading ? <span className="inline-block w-[18px] h-[18px] border-2 border-[rgba(255,255,255,0.3)] border-t-white rounded-full animate-[spin_0.8s_linear_infinite]" /> : <><FiSend /> Send Booking Request</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorDetail;
