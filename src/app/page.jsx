import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tutorAPI } from '../services/api';
import TutorCard from '../components/Tutor/TutorCard';
import {
  FiSearch, FiArrowRight, FiUsers, FiBook, FiStar, FiCheckCircle
} from 'react-icons/fi';

const SUBJECTS = [
  { name: 'Mathematics', icon: '📐', color: '#6C63FF' },
  { name: 'Physics', icon: '⚛️', color: '#00D4AA' },
  { name: 'Chemistry', icon: '🧪', color: '#FF6B9D' },
  { name: 'Biology', icon: '🧬', color: '#4CAF50' },
  { name: 'English', icon: '📝', color: '#FFB74D' },
  { name: 'Bangla', icon: '🇧🇩', color: '#42A5F5' },
  { name: 'ICT', icon: '💻', color: '#AB47BC' },
  { name: 'Accounting', icon: '📊', color: '#FF7043' },
];

const STATS = [
  { icon: <FiUsers />, value: '500+', label: 'Expert Tutors' },
  { icon: <FiBook />, value: '1200+', label: 'Happy Students' },
  { icon: <FiStar />, value: '4.8', label: 'Average Rating' },
  { icon: <FiCheckCircle />, value: '3000+', label: 'Sessions Done' },
];

const STEPS = [
  { step: '01', title: 'Find Your Tutor', desc: 'Browse verified tutors by subject, location, and price range.', icon: '🔍' },
  { step: '02', title: 'Book a Session', desc: 'Pick a convenient date & time and send a booking request.', icon: '📅' },
  { step: '03', title: 'Start Learning', desc: 'Tutor confirms your booking. Learn, grow, and achieve your goals!', icon: '🚀' },
];

const Home = () => {
  const [search, setSearch] = useState('');
  const [featuredTutors, setFeaturedTutors] = useState([]);
  const [loadingTutors, setLoadingTutors] = useState(true);

  useEffect(() => {
    tutorAPI.getAll({ limit: 6, sort: 'rating' })
      .then((res) => setFeaturedTutors(res.data.tutors || []))
      .catch(() => { })
      .finally(() => setLoadingTutors(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    window.location.href = `/tutors?search=${search}`;
  };

  return (
    <div className="pt-[80px]">
      {/* ===== HERO ===== */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden py-[80px] pb-[60px]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute rounded-full blur-[80px] animate-[float_6s_ease-in-out_infinite] w-[500px] h-[500px] bg-[rgba(108,99,255,0.12)] top-[-100px] right-[-150px] delay-0" />
          <div className="absolute rounded-full blur-[80px] animate-[float_6s_ease-in-out_infinite] w-[400px] h-[400px] bg-[rgba(0,212,170,0.08)] bottom-[-50px] left-[-100px] delay-[2s]" />
          <div className="absolute rounded-full blur-[80px] animate-[float_6s_ease-in-out_infinite] w-[300px] h-[300px] bg-[rgba(255,107,157,0.07)] top-[50%] left-[40%] delay-[4s]" />
        </div>

        <div className="w-full max-w-[1200px] mx-auto px-[20px] relative z-10 text-center xl:max-w-[800px]">
          <div className="inline-flex items-center gap-[8px] px-[20px] py-[8px] bg-[rgba(108,99,255,0.12)] border border-[rgba(108,99,255,0.25)] rounded-full text-[0.85rem] font-[500] text-[#8B83FF] mb-[28px] animate-[fadeInDown_0.5s_ease_forwards]">
            <span>🎓</span> Bangladesh's #1 Tuition Platform
          </div>

          <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-[900] leading-[1.1] text-white mb-[20px] animate-[fadeInUp_0.6s_ease_forwards] delay-[0.1s] opacity-0">
            Find the <span className="gradient-text">Perfect Tutor</span><br />
            for Every Subject
          </h1>

          <p className="text-[1.1rem] text-[#6b6b8d] max-w-[580px] mx-auto mb-[36px] leading-[1.8] animate-[fadeInUp_0.6s_ease_forwards] delay-[0.2s] opacity-0">
            Connect with expert tutors for personalized online and home tuition.
            Boost your grades, build confidence, and achieve your academic goals.
          </p>

          {/* Search Bar */}
          <form className="flex flex-col md:flex-row gap-[12px] max-w-[620px] mx-auto mb-[24px] animate-[fadeInUp_0.6s_ease_forwards] delay-[0.3s] opacity-0" onSubmit={handleSearch}>
            <div className="flex-1 relative">
              <FiSearch className="absolute left-[16px] top-[50%] translate-y-[-50%] text-[#6b6b8d] text-[1.1rem]" />
              <input
                type="text"
                placeholder="Search by subject, tutor name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-[48px] pr-[16px] py-[16px] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] rounded-[12px] text-white text-[1rem] outline-none transition-all focus:border-[#6C63FF] focus:bg-[rgba(255,255,255,0.12)] focus:shadow-[0_0_0_3px_rgba(108,99,255,0.3)] placeholder:text-[#6b6b8d]"
              />
            </div>
            <button type="submit" className="inline-flex items-center justify-center gap-[8px] px-[36px] py-[16px] rounded-[12px] font-[600] text-[1.05rem] bg-gradient-to-br from-[#6C63FF] to-[#5A52D5] text-white shadow-[0_4px_15px_rgba(108,99,255,0.35)] transition-all hover:translate-y-[-2px] hover:shadow-[0_6px_25px_rgba(108,99,255,0.5)]">
              Search <FiArrowRight />
            </button>
          </form>

          <div className="flex flex-wrap justify-center gap-[8px] animate-[fadeInUp_0.6s_ease_forwards] delay-[0.4s] opacity-0">
            {['Mathematics', 'Physics', 'English', 'Chemistry', 'Biology'].map((s) => (
              <Link key={s} to={`/tutors?subject=${s}`} className="px-[16px] py-[6px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-full text-[0.85rem] text-[#b0b0cc] transition-all hover:bg-[rgba(108,99,255,0.3)] hover:border-[#6C63FF] hover:text-[#8B83FF]">
                {s}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="py-[48px]">
        <div className="w-full max-w-[1200px] mx-auto px-[20px] grid grid-cols-2 lg:grid-cols-4 gap-[20px]">
          {STATS.map((stat, i) => (
            <div key={i} className={`text-center py-[28px] px-[20px] bg-[rgba(255,255,255,0.06)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] rounded-[16px] transition-all hover:translate-y-[-4px] hover:border-[rgba(108,99,255,0.3)] hover:shadow-[0_0_30px_rgba(108,99,255,0.15)] animate-[fadeInUp_0.6s_ease_forwards] opacity-0`} style={{ animationDelay: `${(i + 1) * 0.1}s` }}>
              <div className="text-[1.5rem] text-[#6C63FF] mb-[10px] flex justify-center">{stat.icon}</div>
              <div className="text-[2rem] font-[900] text-white mb-[4px]">{stat.value}</div>
              <div className="text-[0.85rem] text-[#6b6b8d]">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== SUBJECTS ===== */}
      <section className="py-[64px]">
        <div className="w-full max-w-[1200px] mx-auto px-[20px]">
          <div className="text-center mb-[48px]">
            <h2 className="text-[clamp(1.8rem,4vw,2.5rem)] font-[700] text-white mb-[10px]">Browse by <span className="gradient-text">Subject</span></h2>
            <p className="text-[#6b6b8d] text-[1rem]">Find expert tutors in your preferred subject</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[16px]">
            {SUBJECTS.map((sub, i) => (
              <Link
                key={i}
                to={`/tutors?subject=${sub.name}`}
                className="group flex flex-col items-center gap-[12px] p-[28px_16px] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] rounded-[16px] transition-all duration-300 relative overflow-hidden hover:-translate-y-[6px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] animate-[fadeInUp_0.6s_ease_forwards] opacity-0"
                style={{ animationDelay: `${((i % 6) + 1) * 0.1}s` }}
              >
                <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-[0.08]" style={{ backgroundColor: sub.color }} />
                <span className="text-[2.4rem] relative z-10 transition-transform duration-300 group-hover:scale-110">{sub.icon}</span>
                <span className="text-[0.9rem] font-[600] text-white relative z-10">{sub.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED TUTORS ===== */}
      <section className="py-[64px]">
        <div className="w-full max-w-[1200px] mx-auto px-[20px]">
          <div className="text-center mb-[48px]">
            <h2 className="text-[clamp(1.8rem,4vw,2.5rem)] font-[700] text-white mb-[10px]">Top Rated <span className="gradient-text">Tutors</span></h2>
            <p className="text-[#6b6b8d] text-[1rem]">Highly rated tutors loved by hundreds of students</p>
          </div>

          {loadingTutors ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px] mb-[40px]">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[280px] rounded-[16px] border border-[rgba(255,255,255,0.06)] bg-gradient-to-r from-[rgba(255,255,255,0.03)] via-[rgba(255,255,255,0.07)] to-[rgba(255,255,255,0.03)] bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]" />
              ))}
            </div>
          ) : featuredTutors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px] mb-[40px]">
              {featuredTutors.map((tutor) => (
                <TutorCard key={tutor._id} tutor={tutor} />
              ))}
            </div>
          ) : (
            <div className="text-center py-[60px] px-[20px] text-[#6b6b8d]">
              <p>No tutors yet. <Link to="/register" className="text-[#6C63FF] hover:underline">Be the first tutor!</Link></p>
            </div>
          )}

          <div className="text-center">
            <Link to="/tutors" className="inline-flex items-center justify-center gap-[8px] px-[36px] py-[16px] rounded-[12px] font-[600] text-[1.05rem] bg-transparent border-2 border-[#6C63FF] text-[#6C63FF] transition-all hover:bg-[#6C63FF] hover:text-white hover:-translate-y-[2px]">
              View All Tutors <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-[64px]">
        <div className="w-full max-w-[1200px] mx-auto px-[20px]">
          <div className="text-center mb-[48px]">
            <h2 className="text-[clamp(1.8rem,4vw,2.5rem)] font-[700] text-white mb-[10px]">How It <span className="gradient-text">Works</span></h2>
            <p className="text-[#6b6b8d] text-[1rem]">Get started in just 3 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[32px]">
            {STEPS.map((step, i) => (
              <div key={i} className="text-center p-[40px_28px] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] rounded-[24px] transition-all hover:border-[#6C63FF] hover:-translate-y-[4px] hover:shadow-[0_0_30px_rgba(108,99,255,0.15)] relative animate-[fadeInUp_0.6s_ease_forwards] opacity-0" style={{ animationDelay: `${(i + 1) * 0.1}s` }}>
                <div className="absolute top-[-14px] left-[24px] bg-gradient-to-br from-[#6C63FF] to-[#5A52D5] text-white text-[0.75rem] font-[800] px-[12px] py-[4px] rounded-full">
                  {step.step}
                </div>
                <div className="text-[3rem] mb-[16px]">{step.icon}</div>
                <h3 className="text-[1.1rem] font-[700] text-white mb-[10px]">{step.title}</h3>
                <p className="text-[0.9rem] text-[#6b6b8d] leading-[1.7]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="py-[64px] pb-[80px]">
        <div className="w-full max-w-[1200px] mx-auto px-[20px]">
          <div className="bg-gradient-to-br from-[rgba(108,99,255,0.15)] to-[rgba(0,212,170,0.08)] border border-[rgba(108,99,255,0.25)] rounded-[24px] p-[40px_28px] md:p-[64px] flex flex-col md:flex-row items-center justify-between gap-[40px] relative overflow-hidden text-center md:text-left">
            <div className="absolute top-[-50%] right-[-10%] w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(108,99,255,0.1)_0%,transparent_70%)] pointer-events-none" />

            <div className="relative z-10 text-center md:text-left">
              <h2 className="text-[2rem] font-[700] text-white mb-[10px]">Ready to Start Learning?</h2>
              <p className="text-[#6b6b8d] mb-[28px]">Join thousands of students already learning with TuitionHub</p>
              <div className="flex flex-wrap gap-[16px] justify-center md:justify-start">
                <Link to="/register" className="inline-flex items-center justify-center gap-[8px] px-[36px] py-[16px] rounded-[12px] font-[600] text-[1.05rem] bg-gradient-to-br from-[#6C63FF] to-[#5A52D5] text-white shadow-[0_4px_15px_rgba(108,99,255,0.35)] transition-all hover:-translate-y-[2px] hover:shadow-[0_6px_25px_rgba(108,99,255,0.5)]">
                  Get Started Free <FiArrowRight />
                </Link>
                <Link to="/tutors" className="inline-flex items-center justify-center gap-[8px] px-[36px] py-[16px] rounded-[12px] font-[600] text-[1.05rem] bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] text-[#b0b0cc] transition-all hover:bg-[rgba(255,255,255,0.12)] hover:text-white hover:border-[#6C63FF]">
                  Browse Tutors
                </Link>
              </div>
            </div>

            <div className="text-[5rem] md:text-[8rem] relative z-10 animate-[float_4s_ease-in-out_infinite]">🎓</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
