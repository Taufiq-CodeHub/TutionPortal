import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingAPI } from '../../services/api';
import { FiCalendar, FiClock, FiCheck, FiX, FiCheckCircle } from 'react-icons/fi';

const STATUS_TABS = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];

const statusColor = {
  pending: 'bg-[rgba(255,183,77,0.15)] text-[#FFB74D]',
  confirmed: 'bg-[rgba(108,99,255,0.15)] text-[#8B83FF]',
  completed: 'bg-[rgba(76,175,80,0.15)] text-[#4CAF50]',
  cancelled: 'bg-[rgba(255,82,82,0.15)] text-[#FF5252]',
};

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [actionLoading, setActionLoading] = useState('');

  const fetchBookings = () => {
    setLoading(true);
    bookingAPI.getMine()
      .then((res) => setBookings(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleStatus = async (id, status) => {
    setActionLoading(id + status);
    try {
      await bookingAPI.updateStatus(id, status);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading('');
    }
  };

  const filtered = activeTab === 'all' ? bookings : bookings.filter((b) => b.status === activeTab);
  const getInitials = (name) => name ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : '?';

  return (
    <div className="pt-[100px] pb-[64px] min-h-screen">
      <div className="w-full max-w-[1200px] mx-auto px-[20px]">
        <div className="mb-[32px] animate-[fadeInDown_0.5s_ease_forwards]">
          <h1 className="text-[2rem] font-[700] text-white mb-[6px]">Manage <span className="gradient-text">Bookings</span></h1>
          <p className="text-[#b0b0cc]">Accept, complete, or cancel incoming booking requests</p>
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
            <p className="text-[#b0b0cc] mb-[24px]">Update your profile to attract more students</p>
            <Link to="/profile" className="inline-flex items-center justify-center px-[28px] py-[12px] bg-transparent border border-[#6C63FF] text-[#6C63FF] font-[600] rounded-[12px] transition-all hover:bg-[#6C63FF] hover:text-white">Update Profile</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-[16px]">
            {filtered.map((b) => (
              <div key={b._id} className="p-[24px] bg-[rgba(255,255,255,0.06)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] rounded-[16px] transition-all duration-300 hover:border-[#6C63FF] hover:shadow-[0_0_30px_rgba(108,99,255,0.15)] hover:-translate-y-[4px] animate-[fadeInUp_0.6s_ease_forwards]">
                <div className="flex justify-between items-start mb-[16px] flex-wrap gap-[12px]">
                  <div className="flex gap-[12px] items-center">
                    {b.student?.avatar
                      ? <img src={b.student.avatar} alt="" className="w-[48px] h-[48px] rounded-full object-cover" />
                      : <div className="w-[48px] h-[48px] rounded-full bg-gradient-to-br from-[#6C63FF] to-[#00D4AA] flex items-center justify-center text-[0.9rem] font-[700] text-white shrink-0">{getInitials(b.student?.name)}</div>
                    }
                    <div>
                      <div className="font-[700] text-white text-[1rem] mb-[2px]">{b.student?.name}</div>
                      <div className="text-[0.85rem] text-[#8B83FF]">{b.subject}</div>
                      {b.student?.phone && <div className="text-[0.82rem] text-[#6b6b8d]">📞 {b.student.phone}</div>}
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

                <div className="flex gap-[10px] flex-wrap">
                  {b.status === 'pending' && (
                    <>
                      <button
                        className="inline-flex items-center justify-center gap-[6px] px-[16px] py-[6px] bg-[#6C63FF] text-white rounded-[8px] text-[0.85rem] font-[600] hover:bg-[#5A52D5] hover:-translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!!actionLoading}
                        onClick={() => handleStatus(b._id, 'confirmed')}
                      >
                        {actionLoading === b._id + 'confirmed' ? <span className="inline-block w-[14px] h-[14px] border-2 border-[rgba(255,255,255,0.3)] border-t-white rounded-full animate-[spin_0.8s_linear_infinite]" /> : <><FiCheck /> Accept</>}
                      </button>
                      <button
                        className="inline-flex items-center justify-center gap-[6px] px-[16px] py-[6px] bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] text-[#b0b0cc] rounded-[8px] text-[0.85rem] font-[500] hover:bg-[rgba(255,255,255,0.12)] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!!actionLoading}
                        onClick={() => handleStatus(b._id, 'cancelled')}
                      >
                        {actionLoading === b._id + 'cancelled' ? <span className="inline-block w-[14px] h-[14px] border-2 border-[rgba(255,255,255,0.3)] border-t-white rounded-full animate-[spin_0.8s_linear_infinite]" /> : <><FiX /> Decline</>}
                      </button>
                    </>
                  )}
                  {b.status === 'confirmed' && (
                    <button
                      className="inline-flex items-center justify-center gap-[6px] px-[16px] py-[6px] bg-gradient-to-br from-[#6C63FF] to-[#5A52D5] text-white rounded-[8px] text-[0.85rem] font-[600] hover:shadow-[0_4px_15px_rgba(108,99,255,0.35)] hover:-translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!!actionLoading}
                      onClick={() => handleStatus(b._id, 'completed')}
                    >
                      {actionLoading === b._id + 'completed' ? <span className="inline-block w-[14px] h-[14px] border-2 border-[rgba(255,255,255,0.3)] border-t-white rounded-full animate-[spin_0.8s_linear_infinite]" /> : <><FiCheckCircle /> Mark Completed</>}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBookings;
