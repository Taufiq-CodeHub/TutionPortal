import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { bookingAPI, tutorAPI } from '../../services/api';
import { FiCalendar, FiClock, FiBook, FiArrowRight } from 'react-icons/fi';

const statusColor = {
  pending: 'bg-[rgba(255,183,77,0.15)] text-[#FFB74D]',
  confirmed: 'bg-[rgba(108,99,255,0.15)] text-[#8B83FF]',
  completed: 'bg-[rgba(76,175,80,0.15)] text-[#4CAF50]',
  cancelled: 'bg-[rgba(255,82,82,0.15)] text-[#FF5252]',
};

const Dashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recLoading, setRecLoading] = useState(false);

  useEffect(() => {
    bookingAPI.getMine()
      .then((res) => setBookings(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));

    if (user?.role === 'student') {
      setRecLoading(true);
      tutorAPI.getRecommended()
        .then((res) => setRecommended(res.data || []))
        .catch(() => {})
        .finally(() => setRecLoading(false));
    }
  }, [user]);

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    completed: bookings.filter((b) => b.status === 'completed').length,
  };

  const recentBookings = bookings.slice(0, 5);
  const isStudent = user?.role === 'student';

  const getInitials = (name) =>
    name ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : '?';

  return (
    <div className="pt-[100px] pb-[64px] min-h-screen">
      <div className="w-full max-w-[1200px] mx-auto px-[20px]">
        {/* Welcome Header */}
        <div className="flex justify-between items-center mb-[36px] gap-[20px] flex-wrap animate-[fadeInDown_0.5s_ease_forwards]">
          <div>
            <h1 className="text-[2rem] font-[700] text-white mb-[6px]">
              Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
            </h1>
            <p className="text-[#b0b0cc] text-[0.95rem]">
              {isStudent
                ? 'Track your bookings and find new tutors'
                : 'Manage your incoming booking requests'}
            </p>
          </div>
          {isStudent ? (
            <Link to="/tutors" className="inline-flex items-center justify-center gap-[8px] px-[28px] py-[12px] bg-gradient-to-br from-[#6C63FF] to-[#5A52D5] text-white font-[600] rounded-[12px] shadow-[0_4px_15px_rgba(108,99,255,0.35)] transition-all hover:-translate-y-[2px] hover:shadow-[0_6px_25px_rgba(108,99,255,0.5)]">
               Find Tutors <FiArrowRight />
            </Link>
          ) : (
            <Link to="/profile" className="inline-flex items-center justify-center gap-[8px] px-[28px] py-[12px] bg-transparent border-2 border-[#6C63FF] text-[#6C63FF] font-[600] rounded-[12px] transition-all hover:bg-[#6C63FF] hover:text-white hover:-translate-y-[2px]">
              Edit Profile
            </Link>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[16px] mb-[28px]">
          <div className="flex items-center gap-[16px] p-[22px_20px] bg-[rgba(255,255,255,0.06)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] rounded-[16px] transition-all hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(108,99,255,0.3)] hover:-translate-y-[4px] animate-[fadeInUp_0.6s_ease_forwards] delay-[0.1s] opacity-0">
            <div className="w-[48px] h-[48px] rounded-[12px] flex items-center justify-center text-[1.2rem] shrink-0 bg-[rgba(108,99,255,0.15)] text-[#6C63FF]">
              <FiCalendar />
            </div>
            <div>
              <div className="text-[1.8rem] font-[900] text-white leading-none mb-[4px]">{stats.total}</div>
              <div className="text-[0.82rem] text-[#6b6b8d]">Total Bookings</div>
            </div>
          </div>
          <div className="flex items-center gap-[16px] p-[22px_20px] bg-[rgba(255,255,255,0.06)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] rounded-[16px] transition-all hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(108,99,255,0.3)] hover:-translate-y-[4px] animate-[fadeInUp_0.6s_ease_forwards] delay-[0.2s] opacity-0">
            <div className="w-[48px] h-[48px] rounded-[12px] flex items-center justify-center text-[1.2rem] shrink-0 bg-[rgba(255,183,77,0.15)] text-[#FFB74D]">
              <FiClock />
            </div>
            <div>
              <div className="text-[1.8rem] font-[900] text-white leading-none mb-[4px]">{stats.pending}</div>
              <div className="text-[0.82rem] text-[#6b6b8d]">Pending</div>
            </div>
          </div>
          <div className="flex items-center gap-[16px] p-[22px_20px] bg-[rgba(255,255,255,0.06)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] rounded-[16px] transition-all hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(108,99,255,0.3)] hover:-translate-y-[4px] animate-[fadeInUp_0.6s_ease_forwards] delay-[0.3s] opacity-0">
            <div className="w-[48px] h-[48px] rounded-[12px] flex items-center justify-center text-[1.2rem] shrink-0 bg-[rgba(108,99,255,0.15)] text-[#8B83FF]">
              <FiBook />
            </div>
            <div>
              <div className="text-[1.8rem] font-[900] text-white leading-none mb-[4px]">{stats.confirmed}</div>
              <div className="text-[0.82rem] text-[#6b6b8d]">Confirmed</div>
            </div>
          </div>
          <div className="flex items-center gap-[16px] p-[22px_20px] bg-[rgba(255,255,255,0.06)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] rounded-[16px] transition-all hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(108,99,255,0.3)] hover:-translate-y-[4px] animate-[fadeInUp_0.6s_ease_forwards] delay-[0.4s] opacity-0">
            <div className="w-[48px] h-[48px] rounded-[12px] flex items-center justify-center text-[1.2rem] shrink-0 bg-[rgba(76,175,80,0.15)] text-[#4CAF50]">
              ✓
            </div>
            <div>
              <div className="text-[1.8rem] font-[900] text-white leading-none mb-[4px]">{stats.completed}</div>
              <div className="text-[0.82rem] text-[#6b6b8d]">Completed</div>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="p-[28px] mb-[24px] bg-[rgba(255,255,255,0.06)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] rounded-[16px] animate-[fadeInUp_0.6s_ease_forwards]">
          <div className="flex justify-between items-center mb-[24px] pb-[16px] border-b border-[rgba(255,255,255,0.06)]">
            <h2 className="text-[1.1rem] font-[700] text-white">Recent Bookings</h2>
            <Link to={isStudent ? '/bookings' : '/manage-bookings'} className="inline-flex items-center justify-center gap-[8px] px-[18px] py-[8px] rounded-[8px] font-[500] text-[0.85rem] bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] text-[#b0b0cc] transition-all hover:bg-[rgba(255,255,255,0.12)] hover:border-[#6C63FF] hover:text-white">
              View All <FiArrowRight />
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-col gap-[10px]">
              {[1, 2, 3].map((i) => <div key={i} className="h-[64px] rounded-[12px] bg-gradient-to-r from-[rgba(255,255,255,0.03)] via-[rgba(255,255,255,0.06)] to-[rgba(255,255,255,0.03)] bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]" />)}
            </div>
          ) : recentBookings.length === 0 ? (
            <div className="text-center p-[48px_20px]">
              <div className="text-[3rem] text-[#6b6b8d] mb-[12px] flex justify-center">
                <FiBook />
              </div>
              <p className="text-[#b0b0cc] mb-[16px]">No bookings yet</p>
              {isStudent && (
                <Link to="/tutors" className="inline-flex items-center justify-center gap-[8px] px-[18px] py-[8px] rounded-[8px] font-[600] text-[0.85rem] bg-gradient-to-br from-[#6C63FF] to-[#5A52D5] text-white transition-all hover:-translate-y-[2px]">
                  Find a Tutor
                </Link>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-[12px]">
              {recentBookings.map((b) => (
                <div key={b._id} className="flex items-center gap-[14px] p-[14px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-[12px] transition-all hover:bg-[rgba(255,255,255,0.06)] hover:border-[#6C63FF]">
                  <div className="shrink-0">
                    {isStudent
                      ? (b.tutor?.avatar
                        ? <img src={b.tutor.avatar} alt="" className="w-[40px] h-[40px] rounded-full object-cover" />
                        : <div className="w-[40px] h-[40px] rounded-full bg-gradient-to-br from-[#6C63FF] to-[#00D4AA] flex flex-col items-center justify-center font-[700] text-[0.8rem] text-white">{getInitials(b.tutor?.name)}</div>)
                      : (b.student?.avatar
                        ? <img src={b.student.avatar} alt="" className="w-[40px] h-[40px] rounded-full object-cover" />
                        : <div className="w-[40px] h-[40px] rounded-full bg-gradient-to-br from-[#6C63FF] to-[#00D4AA] flex flex-col items-center justify-center font-[700] text-[0.8rem] text-white">{getInitials(b.student?.name)}</div>)
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-[600] text-white text-[0.9rem] mb-[2px]">
                      {isStudent ? b.tutor?.name : b.student?.name}
                    </div>
                    <div className="text-[0.8rem] text-[#6b6b8d] whitespace-nowrap overflow-hidden text-ellipsis hidden sm:block">
                      {b.subject} • {new Date(b.date).toLocaleDateString()} • {b.time}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-[4px] shrink-0">
                    <span className={`inline-flex items-center gap-[4px] px-[12px] py-[4px] rounded-full text-[0.8rem] font-[600] capitalize ${statusColor[b.status]}`}>{b.status}</span>
                    <span className="text-[0.85rem] font-[600] text-[#00D4AA]">৳{b.totalPrice}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recommended Tutors (Students Only) */}
        {isStudent && (
          <div className="mb-[24px] animate-[fadeInUp_0.6s_ease_forwards] delay-[0.2s]">
            <div className="flex justify-between items-center mb-[20px]">
              <h2 className="text-[1.1rem] font-[700] text-white">Recommended Tutors</h2>
              <Link to="/tutors" className="text-[0.85rem] text-[#6C63FF] font-[600] hover:underline">View suggestions based on your history</Link>
            </div>
            {recLoading ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px]">
                  {[1,2,3].map(i => <div key={i} className="h-[120px] rounded-[16px] bg-[rgba(255,255,255,0.05)] animate-pulse" />)}
               </div>
            ) : recommended.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px]">
                {recommended.map(tutor => (
                  <Link key={tutor._id} to={`/tutors/${tutor._id}`} className="flex items-center gap-[16px] p-[16px] bg-[rgba(255,255,255,0.06)] backdrop-blur-[10px] border border-[rgba(255,255,255,0.1)] rounded-[16px] transition-all hover:bg-[rgba(255,255,255,0.1)] hover:border-[#6C63FF] hover:-translate-y-[4px]">
                    <div className="shrink-0 relative">
                      {tutor.avatar ? (
                        <img src={tutor.avatar} alt={tutor.name} className="w-[50px] h-[50px] rounded-full object-cover" />
                      ) : (
                        <div className="w-[50px] h-[50px] rounded-full bg-gradient-to-br from-[#6C63FF] to-[#00D4AA] flex items-center justify-center font-[700] text-[0.9rem] text-white">{getInitials(tutor.name)}</div>
                      )}
                      <div className="absolute -bottom-[2px] -right-[2px] w-[14px] h-[14px] bg-[#4CAF50] border-2 border-[#12122b] rounded-full"></div>
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-white font-[600] text-[0.9rem] mb-[2px] truncate">{tutor.name}</h4>
                      <p className="text-[0.75rem] text-[#8B83FF] font-[500] mb-[2px] truncate">{tutor.subjects?.slice(0, 2).join(', ')}</p>
                      <div className="flex items-center gap-[4px] text-[#FFB74D] text-[0.7rem] font-[700]">
                        <span>⭐ {tutor.rating || 'N/A'}</span>
                        <span className="text-[#6b6b8d]">|</span>
                        <span>৳{tutor.hourlyRate}/hr</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
                <div className="p-[32px] bg-[rgba(255,255,255,0.03)] border border-dashed border-[rgba(255,255,255,0.1)] rounded-[16px] text-center">
                   <p className="text-[#6b6b8d] text-[0.85rem]">No recommendations yet. Start booking to see suggestions!</p>
                </div>
            )}
          </div>
        )}

        {/* Profile Completion */}
        <div className="flex justify-between items-center p-[24px_28px] gap-[20px] flex-wrap bg-[rgba(255,255,255,0.06)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] rounded-[16px] animate-[fadeInUp_0.6s_ease_forwards]">
          <div className="flex items-center gap-[16px]">
            <div className="shrink-0">
              {user?.avatar
                ? <img src={user.avatar} alt="" className="w-[56px] h-[56px] rounded-full object-cover border-2 border-[#6C63FF]" />
                : <div className="w-[56px] h-[56px] rounded-full bg-gradient-to-br from-[#6C63FF] to-[#00D4AA] flex items-center justify-center font-[700] text-[1.2rem] text-white border-2 border-[rgba(108,99,255,0.3)]">{getInitials(user?.name)}</div>
              }
            </div>
            <div>
              <h3 className="text-[1rem] font-[700] text-white mb-[2px]">{user?.name}</h3>
              <p className="text-[0.85rem] text-[#8B83FF] mb-[2px] font-[500]">{user?.role === 'tutor' ? 'Tutor' : 'Student'}</p>
              <p className="text-[0.82rem] text-[#6b6b8d]">{user?.email}</p>
            </div>
          </div>
          <Link to="/profile" className="inline-flex items-center justify-center px-[18px] py-[8px] bg-transparent border border-[#6C63FF] text-[#6C63FF] rounded-[8px] font-[500] text-[0.85rem] transition-all hover:bg-[#6C63FF] hover:text-white">Edit Profile</Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
