import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiPhone } from 'react-icons/fi';

const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Bangla', 'ICT', 'Accounting', 'History', 'Geography'];

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'student', phone: '',
    subjects: [], hourlyRate: '', experience: '', education: '', location: '', availability: [],
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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
    if (!form.name || !form.email || !form.password) { setError('Please fill in all required fields'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    setError('');
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const DAYS = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <div className="min-h-screen flex items-center justify-center pt-[100px] pb-[40px] px-[20px] relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute rounded-full blur-[80px] pointer-events-none w-[400px] h-[400px] bg-[rgba(108,99,255,0.1)] top-[-100px] right-[-100px]" />
      <div className="absolute rounded-full blur-[80px] pointer-events-none w-[300px] h-[300px] bg-[rgba(0,212,170,0.08)] bottom-[-50px] left-[-80px]" />

      {/* Auth Card Wide */}
      <div className="w-full max-w-[560px] p-[28px_20px] sm:p-[44px] relative z-10 bg-[rgba(255,255,255,0.06)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] rounded-[16px] animate-[scaleIn_0.4s_ease_forwards] transition-all">
        <div className="text-[1.2rem] font-[800] text-white text-center mb-[20px]">TuitionHub</div>
        <h2 className="text-[1.6rem] text-white font-[700] text-center mb-[8px]">Create an Account</h2>
        <p className="text-center text-[#6b6b8d] text-[0.9rem] mb-[28px]">Enter your details to register</p>

        {error && (
          <div className="p-[12px_16px] rounded-[12px] text-[0.9rem] mb-[20px] bg-[rgba(255,82,82,0.1)] border border-[rgba(255,82,82,0.25)] text-[#ff7a7a]">
            {error}
          </div>
        )}

        {/* Role Selector */}
        <div className="flex gap-[10px] mb-[24px]">
          <button
            type="button"
            className={`flex-1 p-[12px] border rounded-[12px] text-[0.9rem] font-[500] cursor-pointer transition-all ${form.role === 'student' ? 'bg-[rgba(108,99,255,0.12)] border-[#6C63FF] text-[#8B83FF]' : 'bg-transparent border-[rgba(255,255,255,0.1)] text-[#b0b0cc] hover:border-[#6C63FF] hover:text-[#8B83FF]'}`}
            onClick={() => setForm({ ...form, role: 'student' })}
          >
            Student
          </button>
          <button
            type="button"
            className={`flex-1 p-[12px] border rounded-[12px] text-[0.9rem] font-[500] cursor-pointer transition-all ${form.role === 'tutor' ? 'bg-[rgba(108,99,255,0.12)] border-[#6C63FF] text-[#8B83FF]' : 'bg-transparent border-[rgba(255,255,255,0.1)] text-[#b0b0cc] hover:border-[#6C63FF] hover:text-[#8B83FF]'}`}
            onClick={() => setForm({ ...form, role: 'tutor' })}
          >
            Tutor
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-[16px]">
          <div className="flex flex-col mb-[4px]">
            <label className="block mb-[8px] text-[0.9rem] font-[500] text-[#b0b0cc]">Full Name</label>
            <div className="relative">
              <FiUser className="absolute left-[14px] top-[50%] translate-y-[-50%] text-[#6b6b8d] text-[1rem] pointer-events-none" />
              <input type="text" name="name" placeholder="Your full name" className="w-full py-[12px] pl-[42px] pr-[16px] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] rounded-[12px] text-white text-[0.95rem] outline-none transition-all focus:border-[#6C63FF] focus:bg-[rgba(255,255,255,0.1)] focus:shadow-[0_0_0_3px_rgba(108,99,255,0.3)] placeholder:text-[#6b6b8d]" value={form.name} onChange={handleChange} />
            </div>
          </div>

          <div className="flex flex-col mb-[4px]">
            <label className="block mb-[8px] text-[0.9rem] font-[500] text-[#b0b0cc]">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-[14px] top-[50%] translate-y-[-50%] text-[#6b6b8d] text-[1rem] pointer-events-none" />
              <input type="email" name="email" placeholder="your@email.com" className="w-full py-[12px] pl-[42px] pr-[16px] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] rounded-[12px] text-white text-[0.95rem] outline-none transition-all focus:border-[#6C63FF] focus:bg-[rgba(255,255,255,0.1)] focus:shadow-[0_0_0_3px_rgba(108,99,255,0.3)] placeholder:text-[#6b6b8d]" value={form.email} onChange={handleChange} />
            </div>
          </div>

          <div className="flex flex-col mb-[4px]">
            <label className="block mb-[8px] text-[0.9rem] font-[500] text-[#b0b0cc]">Phone Number</label>
            <div className="relative">
              <FiPhone className="absolute left-[14px] top-[50%] translate-y-[-50%] text-[#6b6b8d] text-[1rem] pointer-events-none" />
              <input type="tel" name="phone" placeholder="e.g. 01xxxxxxxxx" className="w-full py-[12px] pl-[42px] pr-[16px] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] rounded-[12px] text-white text-[0.95rem] outline-none transition-all focus:border-[#6C63FF] focus:bg-[rgba(255,255,255,0.1)] focus:shadow-[0_0_0_3px_rgba(108,99,255,0.3)] placeholder:text-[#6b6b8d]" value={form.phone} onChange={handleChange} />
            </div>
          </div>

          <div className="flex flex-col mb-[4px]">
            <label className="block mb-[8px] text-[0.9rem] font-[500] text-[#b0b0cc]">Password</label>
            <div className="relative">
              <FiLock className="absolute left-[14px] top-[50%] translate-y-[-50%] text-[#6b6b8d] text-[1rem] pointer-events-none" />
              <input
                type={showPass ? 'text' : 'password'}
                name="password"
                placeholder="Minimum 6 characters"
                className="w-full py-[12px] pl-[42px] pr-[16px] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] rounded-[12px] text-white text-[0.95rem] outline-none transition-all focus:border-[#6C63FF] focus:bg-[rgba(255,255,255,0.1)] focus:shadow-[0_0_0_3px_rgba(108,99,255,0.3)] placeholder:text-[#6b6b8d]"
                value={form.password}
                onChange={handleChange}
              />
              <button type="button" className="absolute right-[12px] top-[50%] translate-y-[-50%] bg-transparent border-none text-[#6b6b8d] cursor-pointer p-[4px] flex hover:text-white transition-colors" onClick={() => setShowPass(!showPass)}>
                {showPass ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Tutor Extra Fields */}
          {form.role === 'tutor' && (
            <div className="bg-[rgba(108,99,255,0.04)] border border-[rgba(108,99,255,0.15)] rounded-[12px] p-[20px] mb-[4px] animate-[fadeInUp_0.4s_ease_forwards]">
              <div className="text-[0.9rem] font-[600] text-[#8B83FF] mb-[16px]">Tutor Details</div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[12px] mb-[12px]">
                <div className="flex flex-col">
                  <label className="block mb-[8px] text-[0.9rem] font-[500] text-[#b0b0cc]">Education / Degree</label>
                  <input type="text" name="education" placeholder="e.g. BSc in Physics, BUET" className="w-full py-[12px] px-[16px] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] rounded-[12px] text-white text-[0.95rem] outline-none transition-all focus:border-[#6C63FF]" value={form.education} onChange={handleChange} />
                </div>
                <div className="flex flex-col">
                  <label className="block mb-[8px] text-[0.9rem] font-[500] text-[#b0b0cc]">Location / Area</label>
                  <input type="text" name="location" placeholder="e.g. Dhaka, Mirpur" className="w-full py-[12px] px-[16px] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] rounded-[12px] text-white text-[0.95rem] outline-none transition-all focus:border-[#6C63FF]" value={form.location} onChange={handleChange} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[12px] mb-[16px]">
                <div className="flex flex-col">
                  <label className="block mb-[8px] text-[0.9rem] font-[500] text-[#b0b0cc]">Hourly Rate (৳)</label>
                  <input type="number" name="hourlyRate" placeholder="e.g. 500" className="w-full py-[12px] px-[16px] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] rounded-[12px] text-white text-[0.95rem] outline-none transition-all focus:border-[#6C63FF]" value={form.hourlyRate} onChange={handleChange} />
                </div>
                <div className="flex flex-col">
                  <label className="block mb-[8px] text-[0.9rem] font-[500] text-[#b0b0cc]">Experience (Years)</label>
                  <input type="number" name="experience" placeholder="e.g. 3" className="w-full py-[12px] px-[16px] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] rounded-[12px] text-white text-[0.95rem] outline-none transition-all focus:border-[#6C63FF]" value={form.experience} onChange={handleChange} />
                </div>
              </div>

              <div className="flex flex-col mb-[16px]">
                <label className="block mb-[8px] text-[0.9rem] font-[500] text-[#b0b0cc]">Subjects You Teach</label>
                <div className="flex flex-wrap gap-[8px]">
                  {SUBJECTS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`px-[12px] py-[6px] border rounded-full text-[0.82rem] cursor-pointer transition-all ${form.subjects.includes(s) ? 'bg-[rgba(108,99,255,0.15)] border-[#6C63FF] text-[#8B83FF] font-[500]' : 'bg-transparent border-[rgba(255,255,255,0.1)] text-[#6b6b8d] hover:border-[#6C63FF] hover:text-[#8B83FF]'}`}
                      onClick={() => toggleSubject(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col mb-[8px]">
                <label className="block mb-[8px] text-[0.9rem] font-[500] text-[#b0b0cc]">Available Days</label>
                <div className="flex flex-wrap gap-[8px]">
                  {DAYS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      className={`px-[12px] py-[6px] border rounded-full text-[0.82rem] cursor-pointer transition-all ${form.availability.includes(d) ? 'bg-[rgba(108,99,255,0.15)] border-[#6C63FF] text-[#8B83FF] font-[500]' : 'bg-transparent border-[rgba(255,255,255,0.1)] text-[#6b6b8d] hover:border-[#6C63FF] hover:text-[#8B83FF]'}`}
                      onClick={() => toggleDay(d)}
                    >
                      {d.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <button type="submit" className="w-full mt-[8px] inline-flex items-center justify-center gap-[8px] px-[28px] py-[12px] rounded-[12px] font-[600] text-[0.95rem] bg-gradient-to-br from-[#6C63FF] to-[#5A52D5] text-white shadow-[0_4px_15px_rgba(108,99,255,0.35)] transition-all hover:-translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" disabled={loading}>
            {loading ? <span className="inline-block w-[18px] h-[18px] border-2 border-[rgba(255,255,255,0.3)] border-t-white rounded-full animate-[spin_0.8s_linear_infinite]" /> : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-[#6b6b8d] text-[0.9rem] mt-[24px]">
          Already have an account? <Link to="/login" className="text-[#8B83FF] font-[500] hover:text-[#6C63FF] transition-colors">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
