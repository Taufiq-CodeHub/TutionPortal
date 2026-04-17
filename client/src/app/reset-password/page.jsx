import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { FiLock, FiCheckCircle, FiArrowLeft, FiEye, FiEyeOff } from 'react-icons/fi';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return setError('Passwords do not match');
    setLoading(true);
    setError('');
    try {
      await authAPI.resetPassword(token, password);
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
          <h2 className="text-[1.5rem] font-[700] text-white mb-[12px]">Password Updated!</h2>
          <p className="text-[#b0b0cc] text-[0.95rem] mb-[32px]">Your password has been reset successfully. You can now log in with your new password.</p>
          <button onClick={() => navigate('/login')} className="w-full inline-flex items-center justify-center gap-[8px] px-[28px] py-[12px] rounded-[12px] font-[600] text-[0.95rem] bg-[#6C63FF] text-white shadow-[0_4px_15px_rgba(108,99,255,0.35)] transition-all hover:scale-105 active:scale-95">
            Log In Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-[20px]">
      <div className="w-full max-w-[440px] p-[44px] bg-[rgba(255,255,255,0.06)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] rounded-[16px] animate-[scaleIn_0.4s_ease_forwards]">
        <h2 className="text-[1.6rem] font-[700] text-white mb-[12px]">Reset Password</h2>
        <p className="text-[#b0b0cc] text-[0.95rem] mb-[28px]">Please enter your new password below.</p>

        {error && (
          <div className="p-[12px_16px] rounded-[12px] text-[0.9rem] mb-[20px] bg-[rgba(255,82,82,0.1)] border border-[rgba(255,82,82,0.25)] text-[#ff7a7a]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-[16px]">
          <div className="flex flex-col">
            <label className="block mb-[8px] text-[0.9rem] font-[500] text-[#b0b0cc]">New Password</label>
            <div className="relative">
              <FiLock className="absolute left-[14px] top-[50%] translate-y-[-50%] text-[#6b6b8d]" />
              <input type={showPass ? 'text' : 'password'} placeholder="New Password" required className="w-full py-[12px] pl-[42px] pr-[42px] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] rounded-[12px] text-white text-[0.95rem] outline-none transition-all focus:border-[#6C63FF]" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="button" className="absolute right-[12px] top-[50%] translate-y-[-50%] text-[#6b6b8d] cursor-pointer bg-transparent border-none p-[4px]" onClick={() => setShowPass(!showPass)}>
                {showPass ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>
          <div className="flex flex-col mb-[12px]">
            <label className="block mb-[8px] text-[0.9rem] font-[500] text-[#b0b0cc]">Confirm Password</label>
            <div className="relative">
              <FiLock className="absolute left-[14px] top-[50%] translate-y-[-50%] text-[#6b6b8d]" />
              <input type={showPass ? 'text' : 'password'} placeholder="Confirm Password" required className="w-full py-[12px] pl-[42px] pr-[16px] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] rounded-[12px] text-white text-[0.95rem] outline-none transition-all focus:border-[#6C63FF]" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
          </div>
          <button type="submit" className="w-full inline-flex items-center justify-center px-[28px] py-[12px] rounded-[12px] font-[600] text-[0.95rem] bg-gradient-to-br from-[#6C63FF] to-[#5A52D5] text-white shadow-[0_4px_15px_rgba(108,99,255,0.35)] transition-all hover:-translate-y-[2px]" disabled={loading}>
            {loading ? <span className="w-[18px] h-[18px] border-2 border-[rgba(255,255,255,0.3)] border-t-white rounded-full animate-spin" /> : 'Set New Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
