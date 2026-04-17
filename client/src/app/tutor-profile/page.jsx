import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { tutorAPI } from '../../services/api';
import { FiArrowLeft, FiSave } from 'react-icons/fi';

const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Bangla', 'ICT', 'Accounting', 'History', 'Geography'];
const DAYS = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const TutorProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [form, setForm] = useState({
    subjects: [],
    hourlyRate: 0,
    experience: 0,
    education: '',
    location: '',
    availability: [],
    bio: ''
  });

  useEffect(() => {
    if (user && user.role === 'tutor') {
      setForm({
        subjects: user.subjects || [],
        hourlyRate: user.hourlyRate || 0,
        experience: user.experience || 0,
        education: user.education || '',
        location: user.location || '',
        availability: user.availability || [],
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleSubject = (s) => {
    setForm((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(s) ? prev.subjects.filter((x) => x !== s) : [...prev.subjects, s],
    }));
  };

  const toggleDay = (d) => {
    setForm((prev) => ({
      ...prev,
      availability: prev.availability.includes(d) ? prev.availability.filter((x) => x !== d) : [...prev.availability, d],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await tutorAPI.updateProfile(form);
      setSuccess('Profile updated successfully!');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'tutor') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-white mb-4">Only tutors can access this page</p>
          <button onClick={() => navigate('/dashboard')} className="text-[#6C63FF] hover:underline">
            Go back to dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[100px] pb-[40px] px-[20px]">
      <div className="max-w-[700px] mx-auto">
        <button onClick={() => navigate('/dashboard')} className="inline-flex items-center gap-[8px] text-[#6b6b8d] hover:text-white mb-[28px] transition-colors">
          <FiArrowLeft /> Back to Dashboard
        </button>

        <div className="bg-[rgba(255,255,255,0.06)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] rounded-[16px] p-[44px]">
          <h2 className="text-[1.6rem] text-white font-[700] mb-[8px]">Edit Your Profile</h2>
          <p className="text-[#b0b0cc] text-[0.9rem] mb-[28px]">Update your tutoring information and availability</p>

          {error && (
            <div className="p-[12px_16px] rounded-[12px] text-[0.9rem] mb-[20px] bg-[rgba(255,82,82,0.1)] border border-[rgba(255,82,82,0.25)] text-[#ff7a7a]">
              {error}
            </div>
          )}

          {success && (
            <div className="p-[12px_16px] rounded-[12px] text-[0.9rem] mb-[20px] bg-[rgba(76,175,80,0.1)] border border-[rgba(76,175,80,0.25)] text-[#4CAF50]">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-[20px]">
            {/* Bio */}
            <div className="flex flex-col">
              <label className="block mb-[8px] text-[0.9rem] font-[500] text-[#b0b0cc]">Bio / About You</label>
              <textarea
                name="bio"
                placeholder="Tell students about yourself..."
                value={form.bio}
                onChange={handleChange}
                className="w-full py-[12px] px-[16px] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] rounded-[12px] text-white text-[0.95rem] outline-none transition-all focus:border-[#6C63FF] focus:bg-[rgba(255,255,255,0.1)] placeholder:text-[#6b6b8d] min-h-[100px]"
              />
            </div>

            {/* Education */}
            <div className="flex flex-col">
              <label className="block mb-[8px] text-[0.9rem] font-[500] text-[#b0b0cc]">Education / Degree</label>
              <input
                type="text"
                name="education"
                placeholder="e.g. BSc in Physics from BUET"
                value={form.education}
                onChange={handleChange}
                className="w-full py-[12px] px-[16px] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] rounded-[12px] text-white text-[0.95rem] outline-none transition-all focus:border-[#6C63FF]"
              />
            </div>

            {/* Experience & Location */}
            <div className="grid grid-cols-2 gap-[16px]">
              <div className="flex flex-col">
                <label className="block mb-[8px] text-[0.9rem] font-[500] text-[#b0b0cc]">Experience (Years)</label>
                <input
                  type="number"
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  className="w-full py-[12px] px-[16px] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] rounded-[12px] text-white text-[0.95rem] outline-none transition-all focus:border-[#6C63FF]"
                />
              </div>
              <div className="flex flex-col">
                <label className="block mb-[8px] text-[0.9rem] font-[500] text-[#b0b0cc]">Hourly Rate (৳)</label>
                <input
                  type="number"
                  name="hourlyRate"
                  value={form.hourlyRate}
                  onChange={handleChange}
                  className="w-full py-[12px] px-[16px] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] rounded-[12px] text-white text-[0.95rem] outline-none transition-all focus:border-[#6C63FF]"
                />
              </div>
            </div>

            {/* Location */}
            <div className="flex flex-col">
              <label className="block mb-[8px] text-[0.9rem] font-[500] text-[#b0b0cc]">Location / Area</label>
              <input
                type="text"
                name="location"
                placeholder="e.g. Dhaka, Mirpur"
                value={form.location}
                onChange={handleChange}
                className="w-full py-[12px] px-[16px] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] rounded-[12px] text-white text-[0.95rem] outline-none transition-all focus:border-[#6C63FF]"
              />
            </div>

            {/* Subjects */}
            <div className="flex flex-col">
              <label className="block mb-[12px] text-[0.9rem] font-[500] text-[#b0b0cc]">Subjects You Teach</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-[8px]">
                {SUBJECTS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSubject(s)}
                    className={`p-[10px_12px] border rounded-[8px] text-[0.85rem] font-[500] cursor-pointer transition-all ${
                      form.subjects.includes(s)
                        ? 'bg-[rgba(108,99,255,0.2)] border-[#6C63FF] text-[#8B83FF]'
                        : 'bg-transparent border-[rgba(255,255,255,0.15)] text-[#b0b0cc] hover:border-[#6C63FF]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="flex flex-col">
              <label className="block mb-[12px] text-[0.9rem] font-[500] text-[#b0b0cc]">Availability</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-[8px]">
                {DAYS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDay(d)}
                    className={`p-[10px_12px] border rounded-[8px] text-[0.85rem] font-[500] cursor-pointer transition-all ${
                      form.availability.includes(d)
                        ? 'bg-[rgba(108,99,255,0.2)] border-[#6C63FF] text-[#8B83FF]'
                        : 'bg-transparent border-[rgba(255,255,255,0.15)] text-[#b0b0cc] hover:border-[#6C63FF]'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-[8px] px-[28px] py-[12px] rounded-[12px] font-[600] text-[0.95rem] bg-gradient-to-br from-[#6C63FF] to-[#5A52D5] text-white shadow-[0_4px_15px_rgba(108,99,255,0.35)] transition-all hover:-translate-y-[2px] disabled:opacity-50"
            >
              <FiSave /> {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TutorProfile;
