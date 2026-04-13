import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { reviewAPI, bookingAPI } from '../../services/api';
import { FiArrowLeft, FiStar } from 'react-icons/fi';

const LeaveReview = () => {
  const { bookingId, tutorId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      setError('Please write a comment');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await reviewAPI.create({
        tutor: tutorId,
        booking: bookingId,
        rating: Number(rating),
        comment,
      });
      setSuccess('Review submitted successfully!');
      setTimeout(() => navigate('/bookings'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-[100px] pb-[64px] px-[20px] min-h-screen">
      <div className="max-w-[600px] mx-auto">
        <button onClick={() => navigate('/bookings')} className="inline-flex items-center gap-[8px] text-[#6b6b8d] hover:text-white mb-[28px] transition-colors">
          <FiArrowLeft /> Back to Bookings
        </button>

        <div className="bg-[rgba(255,255,255,0.06)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] rounded-[16px] p-[44px]">
          <h2 className="text-[1.6rem] text-white font-[700] mb-[8px]">Leave a Review</h2>
          <p className="text-[#b0b0cc] text-[0.9rem] mb-[28px]">Share your experience with this tutor</p>

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
            {/* Rating */}
            <div className="flex flex-col">
              <label className="block mb-[12px] text-[0.9rem] font-[500] text-[#b0b0cc]">Rating *</label>
              <div className="flex gap-[12px]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-[2rem] transition-all ${
                      star <= rating ? 'text-[#FFB74D]' : 'text-[#6b6b8d]'
                    } hover:text-[#FFB74D]`}
                  >
                    <FiStar fill={star <= rating ? '#FFB74D' : 'none'} />
                  </button>
                ))}
              </div>
              <p className="text-[0.8rem] text-[#6b6b8d] mt-[8px]">{rating} out of 5 stars</p>
            </div>

            {/* Comment */}
            <div className="flex flex-col">
              <label className="block mb-[8px] text-[0.9rem] font-[500] text-[#b0b0cc]">Your Comment *</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us about your experience. What did you learn? Was the tutor helpful?"
                className="w-full py-[12px] px-[16px] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] rounded-[12px] text-white text-[0.95rem] outline-none transition-all focus:border-[#6C63FF] focus:bg-[rgba(255,255,255,0.1)] placeholder:text-[#6b6b8d] min-h-[150px]"
              />
              <p className="text-[0.8rem] text-[#6b6b8d] mt-[8px]">{comment.length}/500</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-[12px] bg-gradient-to-br from-[#6C63FF] to-[#5A52D5] text-white rounded-[12px] font-[600] transition-all hover:-translate-y-[2px] disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LeaveReview;
