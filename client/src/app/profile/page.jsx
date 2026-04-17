import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../services/api';
import { FiUser, FiMail, FiPhone, FiMapPin, FiBook, FiDollarSign, FiSave } from 'react-icons/fi';

const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Bangla', 'ICT', 'Accounting', 'History', 'Geography'];
const DAYS = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: '', phone: '', bio: '', subjects: [],
    hourlyRate: '', experience: '', education: '', location: '', availability: [],
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        phone: user.phone || '',
        bio: user.bio || '',
        subjects: user.subjects || [],
        hourlyRate: user.hourlyRate || '',
        experience: user.experience || '',
        education: user.education || '',
        location: user.location || '',
        availability: user.availability || [],
      });
    }
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleSubject = (s) => setForm((prev) => ({
    ...prev,
    subjects: prev.subjects.includes(s) ? prev.subjects.filter((x) => x !== s) : [...prev.subjects, s],
  }));

  const toggleDay = (d) => setForm((prev) => ({
    ...prev,
    availability: prev.availability.includes(d) ? prev.availability.filter((x) => x !== d) : [...prev.availability, d],
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      const { data } = await userAPI.updateProfile(form);
      // FIX: Pass only `data` (the fresh server response) — don't spread
      // the old `user` object on top of it, which would re-introduce stale
      // values. AuthContext.updateUser preserves the token automatically.
      updateUser(data);
      setMsg('Profile updated successfully!');
      setIsError(false);
      // Auto-clear success message after 3 seconds
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Update failed');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) =>
    name ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : '?';

  return (
    <div className="pt-[100px] pb-[64px] min-h-screen">
      <div className="w-full max-w-[1200px] mx-auto px-[20px]">
        <div className="mb-[36px] animate-[fadeInDown_0.5s_ease_forwards]">
          <h1 className="text-[2rem] font-[700] text-white mb-[6px]">My <span className="gradient-text">Profile</span></h1>
          <p className="text-[#b0b0cc]">Update your personal information and preferences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-[28px] items-start">
          {/* Avatar Panel */}
          <div className="p-[36px_24px] text-center bg-[rgba(255,255,255,0.06)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] rounded-[16px] md:sticky md:top-[100px] transition-all hover:bg-[rgba(255,255,255,0.08)] animate-[fadeInUp_0.6s_ease_forwards]">
            <div className="mb-[16px] mx-auto w-[100px] h-[100px] rounded-full border-[3px] border-[#6C63FF] overflow-hidden shadow-[0_0_20px_rgba(108,99,255,0.3)]">
              {user?.avatar
                ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                : <div className="w-full h-full bg-gradient-to-br from-[#6C63FF] to-[#00D4AA] flex flex-col items-center justify-center font-[700] text-[2rem] text-white">{getInitials(user?.name)}</div>
              }
            </div>
            <h3 className="text-[1.1rem] font-[700] text-white mb-[10px]">{user?.name}</h3>
            <span className={`inline-flex items-center px-[12px] py-[4px] rounded-full text-[0.8rem] font-[600] capitalize ${user?.role === 'tutor' ? 'bg-[rgba(108,99,255,0.15)] text-[#8B83FF]' : 'bg-[rgba(0,212,170,0.15)] text-[#00D4AA]'}`}>
              {user?.role === 'tutor' ? 'Tutor' : 'Student'}
            </span>
            <p className="text-[0.82rem] text-[#6b6b8d] mt-[8px] break-all">{user?.email}</p>

            {user?.role === 'tutor' && (
              <div className="flex justify-center gap-[20px] mt-[24px] pt-[20px] border-t border-[rgba(255,255,255,0.1)]">
                <div className="flex flex-col">
                  <div className="text-[1rem] font-[700] text-white">{user.rating?.toFixed(1) || '0.0'}</div>
                  <div className="text-[0.75rem] text-[#6b6b8d] mt-[2px]">Rating</div>
                </div>
                <div className="flex flex-col">
                  <div className="text-[1rem] font-[700] text-white">{user.totalReviews || 0}</div>
                  <div className="text-[0.75rem] text-[#6b6b8d] mt-[2px]">Reviews</div>
                </div>
                <div className="flex flex-col">
                  <div className="text-[1rem] font-[700] text-white">৳{user.hourlyRate || 0}</div>
                  <div className="text-[0.75rem] text-[#6b6b8d] mt-[2px]">Per Hour</div>
                </div>
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-[20px] animate-[fadeInUp_0.6s_ease_forwards] delay-[0.1s] opacity-0" style={{ animationFillMode: 'forwards' }}>
            <div className="p-[28px] bg-[rgba(255,255,255,0.06)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] rounded-[16px] transition-all hover:bg-[rgba(255,255,255,0.08)]">
              <h2 className="text-[1rem] font-[700] text-white mb-[20px] pb-[12px] border-b border-[rgba(255,255,255,0.1)]">Personal Information</h2>

              {msg && (
                <div className={`p-[12px_16px] rounded-[12px] text-[0.9rem] mb-[20px] ${isError ? 'bg-[rgba(255,82,82,0.1)] border border-[rgba(255,82,82,0.25)] text-[#ff7a7a]' : 'bg-[rgba(76,175,80,0.1)] border border-[rgba(76,175,80,0.25)] text-[#69c16d]'}`}>{msg}</div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[12px] mb-[16px]">
                <div className="flex flex-col">
                  <label className="block mb-[8px] text-[0.9rem] font-[500] text-[#b0b0cc]">Full Name</label>
                  <div className="relative">
                    <FiUser className="absolute left-[14px] top-[50%] translate-y-[-50%] text-[#6b6b8d] text-[1rem] pointer-events-none" />
                    <input type="text" name="name" className="w-full py-[12px] pl-[42px] pr-[16px] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] rounded-[12px] text-white text-[0.95rem] outline-none transition-all focus:border-[#6C63FF] focus:bg-[rgba(255,255,255,0.1)]" value={form.name} onChange={handleChange} placeholder="Your full name" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="block mb-[8px] text-[0.9rem] font-[500] text-[#b0b0cc]">Phone Number</label>
                  <div className="relative">
                    <FiPhone className="absolute left-[14px] top-[50%] translate-y-[-50%] text-[#6b6b8d] text-[1rem] pointer-events-none" />
                    <input type="text" name="phone" className="w-full py-[12px] pl-[42px] pr-[16px] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] rounded-[12px] text-white text-[0.95rem] outline-none transition-all focus:border-[#6C63FF] focus:bg-[rgba(255,255,255,0.1)]" value={form.phone} onChange={handleChange} placeholder="+880 1234-567890" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                <label className="block mb-[8px] text-[0.9rem] font-[500] text-[#b0b0cc]">Bio / About Me</label>
                <textarea name="bio" className="w-full py-[12px] px-[16px] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] rounded-[12px] text-white text-[0.95rem] outline-none transition-all focus:border-[#6C63FF] focus:bg-[rgba(255,255,255,0.1)] min-h-[100px] resize-y" rows={3} value={form.bio} onChange={handleChange} placeholder="Tell students about yourself, your teaching style, experience..." />
              </div>
            </div>

            {/* Tutor Fields */}
            {user?.role === 'tutor' && (
              <div className="p-[28px] bg-[rgba(255,255,255,0.06)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] rounded-[16px] transition-all hover:bg-[rgba(255,255,255,0.08)]">
                <h2 className="text-[1rem] font-[700] text-white mb-[20px] pb-[12px] border-b border-[rgba(255,255,255,0.1)]">Tutor Details</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-[12px] mb-[16px]">
                  <div className="flex flex-col">
                    <label className="block mb-[8px] text-[0.9rem] font-[500] text-[#b0b0cc]">Education / Degree</label>
                    <div className="relative">
                      <FiBook className="absolute left-[14px] top-[50%] translate-y-[-50%] text-[#6b6b8d] text-[1rem] pointer-events-none" />
                      <input type="text" name="education" className="w-full py-[12px] pl-[42px] pr-[16px] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] rounded-[12px] text-white text-[0.95rem] outline-none transition-all focus:border-[#6C63FF]" value={form.education} onChange={handleChange} placeholder="e.g. BSc Physics, BUET" />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="block mb-[8px] text-[0.9rem] font-[500] text-[#b0b0cc]">Location / Area</label>
                    <div className="relative">
                      <FiMapPin className="absolute left-[14px] top-[50%] translate-y-[-50%] text-[#6b6b8d] text-[1rem] pointer-events-none" />
                      <input type="text" name="location" className="w-full py-[12px] pl-[42px] pr-[16px] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] rounded-[12px] text-white text-[0.95rem] outline-none transition-all focus:border-[#6C63FF]" value={form.location} onChange={handleChange} placeholder="e.g. Dhaka, Mirpur" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-[12px] mb-[16px]">
                  <div className="flex flex-col">
                    <label className="block mb-[8px] text-[0.9rem] font-[500] text-[#b0b0cc]">Hourly Rate (৳)</label>
                    <div className="relative">
                      <FiDollarSign className="absolute left-[14px] top-[50%] translate-y-[-50%] text-[#6b6b8d] text-[1rem] pointer-events-none" />
                      <input type="number" name="hourlyRate" className="w-full py-[12px] pl-[42px] pr-[16px] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] rounded-[12px] text-white text-[0.95rem] outline-none transition-all focus:border-[#6C63FF]" value={form.hourlyRate} onChange={handleChange} placeholder="e.g. 500" />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="block mb-[8px] text-[0.9rem] font-[500] text-[#b0b0cc]">Years of Experience</label>
                    <input type="number" name="experience" className="w-full py-[12px] px-[16px] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] rounded-[12px] text-white text-[0.95rem] outline-none transition-all focus:border-[#6C63FF]" value={form.experience} onChange={handleChange} placeholder="e.g. 3" />
                  </div>
                </div>

                <div className="flex flex-col mb-[16px]">
                  <label className="block mb-[8px] text-[0.9rem] font-[500] text-[#b0b0cc]">Subjects You Teach</label>
                  <div className="flex flex-wrap gap-[8px]">
                    {SUBJECTS.map((s) => (
                      <button key={s} type="button"
                        className={`px-[12px] py-[6px] border rounded-full text-[0.82rem] cursor-pointer transition-all ${form.subjects.includes(s) ? 'bg-[rgba(108,99,255,0.15)] border-[#6C63FF] text-[#8B83FF] font-[500]' : 'bg-transparent border-[rgba(255,255,255,0.1)] text-[#6b6b8d] hover:border-[#6C63FF] hover:text-[#8B83FF]'}`}
                        onClick={() => toggleSubject(s)}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="block mb-[8px] text-[0.9rem] font-[500] text-[#b0b0cc]">Available Days</label>
                  <div className="flex flex-wrap gap-[8px]">
                    {DAYS.map((d) => (
                      <button key={d} type="button"
                        className={`px-[12px] py-[6px] border rounded-full text-[0.82rem] cursor-pointer transition-all ${form.availability.includes(d) ? 'bg-[rgba(108,99,255,0.15)] border-[#6C63FF] text-[#8B83FF] font-[500]' : 'bg-transparent border-[rgba(255,255,255,0.1)] text-[#6b6b8d] hover:border-[#6C63FF] hover:text-[#8B83FF]'}`}
                        onClick={() => toggleDay(d)}>
                        {d.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <button type="submit" className="inline-flex items-center justify-center gap-[8px] px-[28px] py-[12px] rounded-[12px] font-[600] text-[0.95rem] bg-gradient-to-br from-[#6C63FF] to-[#5A52D5] text-white shadow-[0_4px_15px_rgba(108,99,255,0.35)] transition-all hover:-translate-y-[2px] hover:shadow-[0_6px_25px_rgba(108,99,255,0.5)] disabled:opacity-50 disabled:cursor-not-allowed" disabled={loading}>
              {loading ? <span className="inline-block w-[18px] h-[18px] border-2 border-[rgba(255,255,255,0.3)] border-t-white rounded-full animate-[spin_0.8s_linear_infinite]" /> : <><FiSave /> Save Changes</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;