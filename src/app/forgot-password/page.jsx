import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return setError('Please enter your email');
    setLoading(true);
    setError('');
    try {
      await authAPI.forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-[20px]">
        <div className="w-full max-w-[440px] p-[44px] bg-[rgba(255,255,255,0.06)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] rounded-[16px] text-center animate-[scaleIn_0.4s_ease_forwards]">
          <div className="w-[64px] h-[64px] bg-[rgba(76,175,80,0.15)] text-[#4CAF50] rounded-full flex items-center justify-center text-[2rem] mx-auto mb-[24px]">
            <FiCheckCircle />
          </div>
          <h2 className="text-[1.5rem] font-[700] text-white mb-[12px]">Check your email</h2>
          <p className="text-[#b0b0cc] text-[0.95rem] mb-[32px]">We've sent a password reset link to <span className="text-white font-[500]">{email}</span>. Please check your inbox.</p>
          <Link to="/login" className="inline-flex items-center justify-center gap-[8px] text-[#6C63FF] font-[600] text-[0.9rem] hover:underline">
            <FiArrowLeft /> Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-[20px]">
      <div className="w-full max-w-[440px] p-[44px] bg-[rgba(255,255,255,0.06)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] rounded-[16px] animate-[scaleIn_0.4s_ease_forwards]">
        <Link to="/login" className="inline-flex items-center gap-[8px] text-[#6b6b8d] text-[0.85rem] mb-[32px] hover:text-white transition-colors">
          <FiArrowLeft /> Back to Login
        </Link>
        <h2 className="text-[1.6rem] font-[700] text-white mb-[12px]">Forgot Password?</h2>
        <p className="text-[#b0b0cc] text-[0.95rem] mb-[28px]">No worries! Enter your email and we'll send you a reset link.</p>

        {error && (
          <div className="p-[12px_16px] rounded-[12px] text-[0.9rem] mb-[20px] bg-[rgba(255,82,82,0.1)] border border-[rgba(255,82,82,0.25)] text-[#ff7a7a]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col mb-[24px]">
            <label className="block mb-[8px] text-[0.9rem] font-[500] text-[#b0b0cc]">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-[14px] top-[50%] translate-y-[-50%] text-[#6b6b8d]" />
              <input type="email" placeholder="your@email.com" className="w-full py-[12px] pl-[42px] pr-[16px] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] rounded-[12px] text-white text-[0.95rem] outline-none transition-all focus:border-[#6C63FF]" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>
          <button type="submit" className="w-full inline-flex items-center justify-center px-[28px] py-[12px] rounded-[12px] font-[600] text-[0.95rem] bg-gradient-to-br from-[#6C63FF] to-[#5A52D5] text-white shadow-[0_4px_15px_rgba(108,99,255,0.35)] transition-all hover:-translate-y-[2px]" disabled={loading}>
            {loading ? <span className="w-[18px] h-[18px] border-2 border-[rgba(255,255,255,0.3)] border-t-white rounded-full animate-spin" /> : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
