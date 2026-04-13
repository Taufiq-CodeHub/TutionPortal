import { Link } from 'react-router-dom';
import { FiMapPin, FiStar, FiClock, FiBook } from 'react-icons/fi';

const TutorCard = ({ tutor }) => {
  const getInitials = (name) =>
    name ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : 'T';

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-[0.95rem] transition-colors duration-200 ${i < Math.round(rating) ? 'text-[#FFB74D]' : 'text-[rgba(255,255,255,0.1)]'}`}>★</span>
    ));
  };

  return (
    <div className="p-[24px] flex flex-col gap-[16px] cursor-default bg-[rgba(255,255,255,0.06)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] rounded-[16px] transition-all duration-300 hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(108,99,255,0.3)] hover:shadow-[0_0_30px_rgba(108,99,255,0.15)] hover:translate-y-[-4px] animate-[fadeInUp_0.6s_ease_forwards]">
      <div className="flex gap-[14px] items-start">
        <div className="relative shrink-0">
          {tutor.avatar ? (
            <img src={tutor.avatar} alt={tutor.name} className="w-[64px] h-[64px] rounded-full object-cover border-2 border-[#6C63FF]" />
          ) : (
            <div className="w-[64px] h-[64px] rounded-full bg-gradient-to-br from-[#6C63FF] to-[#00D4AA] flex items-center justify-center text-[1.3rem] font-[700] text-white border-2 border-[rgba(108,99,255,0.3)]">{getInitials(tutor.name)}</div>
          )}
          <div className="absolute bottom-[2px] right-[2px] w-[12px] h-[12px] bg-[#4CAF50] rounded-full border-2 border-[#0a0a1a]" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[1rem] font-[700] text-white mb-[4px] whitespace-nowrap overflow-hidden text-ellipsis">{tutor.name}</h3>
          {tutor.education && (
            <p className="text-[0.8rem] text-[#6b6b8d] mb-[4px] whitespace-nowrap overflow-hidden text-ellipsis">{tutor.education}</p>
          )}
          {tutor.location && (
            <span className="flex items-center gap-[4px] text-[0.8rem] text-[#00D4AA]">
              <FiMapPin size={12} /> {tutor.location}
            </span>
          )}
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-[6px]">
        <div className="flex gap-[1px]">{renderStars(tutor.rating || 0)}</div>
        <span className="text-[0.9rem] font-[700] text-white">{tutor.rating?.toFixed(1) || '0.0'}</span>
        <span className="text-[0.8rem] text-[#6b6b8d]">({tutor.totalReviews || 0} reviews)</span>
      </div>

      {/* Subjects */}
      {tutor.subjects?.length > 0 && (
        <div className="flex flex-wrap gap-[6px]">
          {tutor.subjects.slice(0, 4).map((s, i) => (
            <span key={i} className="px-[10px] py-[3px] bg-[rgba(108,99,255,0.12)] text-[#8B83FF] rounded-full text-[0.78rem] font-[500] border border-[rgba(108,99,255,0.2)]">{s}</span>
          ))}
          {tutor.subjects.length > 4 && (
            <span className="px-[10px] py-[3px] bg-[rgba(255,255,255,0.05)] text-[#6b6b8d] rounded-full text-[0.78rem] border border-[rgba(255,255,255,0.1)]">+{tutor.subjects.length - 4}</span>
          )}
        </div>
      )}

      {/* Meta */}
      <div className="flex gap-[16px]">
        <div className="flex items-center gap-[5px] text-[0.82rem] text-[#6b6b8d]">
          <FiClock size={14} className="text-[#00D4AA]" />
          <span>{tutor.experience || 0} yrs exp</span>
        </div>
        <div className="flex items-center gap-[5px] text-[0.82rem] text-[#6b6b8d]">
          <FiBook size={14} className="text-[#00D4AA]" />
          <span>{tutor.subjects?.length || 0} subjects</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-[14px] border-t border-[rgba(255,255,255,0.06)] mt-auto">
        <div className="flex items-baseline gap-[3px]">
          <span className="text-[1.2rem] font-[800] text-[#00D4AA]">৳{tutor.hourlyRate || 0}</span>
          <span className="text-[0.8rem] text-[#6b6b8d]">/hour</span>
        </div>
        <Link to={`/tutors/${tutor._id}`} className="inline-flex items-center justify-center gap-[8px] px-[18px] py-[8px] rounded-[12px] font-[600] text-[0.85rem] bg-gradient-to-br from-[#6C63FF] to-[#5A52D5] text-white shadow-[0_4px_15px_rgba(108,99,255,0.35)] transition-all hover:translate-y-[-2px] hover:shadow-[0_6px_25px_rgba(108,99,255,0.5)]">
          View Profile
        </Link>
      </div>
    </div>
  );
};

export default TutorCard;
