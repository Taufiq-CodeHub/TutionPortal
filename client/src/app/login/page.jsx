import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/dashboard';

  const [form, setForm] = useState({ email: '', password: '' });
  const [role, setRole] = useState('student');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please enter your email and password');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-[100px] pb-[40px] px-[20px] relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute rounded-full blur-[80px] pointer-events-none w-[400px] h-[400px] bg-[rgba(108,99,255,0.1)] top-[-100px] right-[-100px]" />
      <div className="absolute rounded-full blur-[80px] pointer-events-none w-[300px] h-[300px] bg-[rgba(0,212,170,0.08)] bottom-[-50px] left-[-80px]" />

      {/* Auth Card */}
      <div className="w-full max-w-[440px] p-[28px_20px] sm:p-[44px] relative z-10 bg-[rgba(255,255,255,0.06)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] rounded-[16px] animate-[scaleIn_0.4s_ease_forwards] transition-all">
        <div className="text-[1.2rem] font-[800] text-white text-center mb-[20px]">TuitionHub</div>
        <h2 className="text-[1.6rem] text-white font-[700] text-center mb-[8px]">{role === 'tutor' ? 'Tutor Login' : 'Student Login'}</h2>
        <p className="text-center text-[#6b6b8d] text-[0.9rem] mb-[28px]">Access your account to continue</p>

        {error && (
          <div className="p-[12px_16px] rounded-[12px] text-[0.9rem] mb-[20px] bg-[rgba(255,82,82,0.1)] border border-[rgba(255,82,82,0.25)] text-[#ff7a7a]">
            {error}
          </div>
        )}

        {/* Role Selector */}
        <div className="flex gap-[10px] mb-[24px]">
          <button
            type="button"
            className={`flex-1 p-[12px] border rounded-[12px] text-[0.9rem] font-[500] cursor-pointer transition-all ${role === 'student' ? 'bg-[rgba(108,99,255,0.12)] border-[#6C63FF] text-[#8B83FF]' : 'bg-transparent border-[rgba(255,255,255,0.1)] text-[#b0b0cc] hover:border-[#6C63FF] hover:text-[#8B83FF]'}`}
            onClick={() => setRole('student')}
          >
            Student
          </button>
          <button
            type="button"
            className={`flex-1 p-[12px] border rounded-[12px] text-[0.9rem] font-[500] cursor-pointer transition-all ${role === 'tutor' ? 'bg-[rgba(108,99,255,0.12)] border-[#6C63FF] text-[#8B83FF]' : 'bg-transparent border-[rgba(255,255,255,0.1)] text-[#b0b0cc] hover:border-[#6C63FF] hover:text-[#8B83FF]'}`}
            onClick={() => setRole('tutor')}
          >
            Tutor
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-[16px]">
          <div className="flex flex-col mb-[4px]">
            <label className="block mb-[8px] text-[0.9rem] font-[500] text-[#b0b0cc]">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-[14px] top-[50%] translate-y-[-50%] text-[#6b6b8d] text-[1rem] pointer-events-none" />
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                className="w-full py-[12px] pl-[42px] pr-[16px] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] rounded-[12px] text-white text-[0.95rem] outline-none transition-all focus:border-[#6C63FF] focus:bg-[rgba(255,255,255,0.1)] focus:shadow-[0_0_0_3px_rgba(108,99,255,0.3)] placeholder:text-[#6b6b8d]"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="flex flex-col mb-[4px]">
            <label className="block mb-[8px] text-[0.9rem] font-[500] text-[#b0b0cc]">Password</label>
            <div className="relative">
              <FiLock className="absolute left-[14px] top-[50%] translate-y-[-50%] text-[#6b6b8d] text-[1rem] pointer-events-none" />
              <input
                type={showPass ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                className="w-full py-[12px] pl-[42px] pr-[16px] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] rounded-[12px] text-white text-[0.95rem] outline-none transition-all focus:border-[#6C63FF] focus:bg-[rgba(255,255,255,0.1)] focus:shadow-[0_0_0_3px_rgba(108,99,255,0.3)] placeholder:text-[#6b6b8d]"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute right-[12px] top-[50%] translate-y-[-50%] bg-transparent border-none text-[#6b6b8d] cursor-pointer p-[4px] flex hover:text-white transition-colors"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            <div className="flex justify-end mt-[8px]">
              <Link to="/forgot-password" size="sm" className="text-[0.85rem] text-[#8B83FF] hover:text-[#6C63FF] transition-colors">Forgot password?</Link>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-[8px] inline-flex items-center justify-center gap-[8px] px-[28px] py-[12px] rounded-[12px] font-[600] text-[0.95rem] bg-gradient-to-br from-[#6C63FF] to-[#5A52D5] text-white shadow-[0_4px_15px_rgba(108,99,255,0.35)] transition-all hover:-translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={loading}
          >
            {loading ? <span className="inline-block w-[18px] h-[18px] border-2 border-[rgba(255,255,255,0.3)] border-t-white rounded-full animate-[spin_0.8s_linear_infinite]" /> : 'Log In'}
          </button>
        </form>

        <div className="flex items-center gap-[12px] my-[20px] text-[#6b6b8d] text-[0.8rem] before:content-[''] before:flex-1 before:h-[1px] before:bg-[rgba(255,255,255,0.1)] after:content-[''] after:flex-1 after:h-[1px] after:bg-[rgba(255,255,255,0.1)]">
          <span>OR</span>
        </div>

        <p className="text-center text-[#6b6b8d] text-[0.9rem] mt-[20px]">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#8B83FF] font-[500] hover:text-[#6C63FF] transition-colors">Create one free</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
