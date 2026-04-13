import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-[#111128] border-t border-[rgba(255,255,255,0.1)] pt-[60px] pb-[20px]">
      <div className="w-full max-w-[1200px] mx-auto px-[20px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.5fr] gap-[40px] mb-[60px]">
          <div className="flex flex-col gap-[16px]">
            <Link to="/" className="text-[1.4rem] font-[800] text-white flex items-center gap-[8px]">
              Tuition<span className="text-[#6C63FF]">Hub</span>
            </Link>
            <p className="text-[#b0b0cc] text-[0.95rem] leading-[1.6]">
              Connecting passionate learners with expert tutors for a brighter future.
            </p>
            <div className="flex gap-[12px] mt-[8px]">
              <a href="#" className="w-[36px] h-[36px] rounded-full bg-[rgba(255,255,255,0.06)] flex items-center justify-center text-[#b0b0cc] border border-[rgba(255,255,255,0.1)] transition-all hover:bg-[rgba(108,99,255,0.15)] hover:border-[#6C63FF] hover:text-[#8B83FF] hover:-translate-y-[2px]">f</a>
              <a href="#" className="w-[36px] h-[36px] rounded-full bg-[rgba(255,255,255,0.06)] flex items-center justify-center text-[#b0b0cc] border border-[rgba(255,255,255,0.1)] transition-all hover:bg-[rgba(108,99,255,0.15)] hover:border-[#6C63FF] hover:text-[#8B83FF] hover:-translate-y-[2px]">in</a>
              <a href="#" className="w-[36px] h-[36px] rounded-full bg-[rgba(255,255,255,0.06)] flex items-center justify-center text-[#b0b0cc] border border-[rgba(255,255,255,0.1)] transition-all hover:bg-[rgba(108,99,255,0.15)] hover:border-[#6C63FF] hover:text-[#8B83FF] hover:-translate-y-[2px]">t</a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-[600] text-[1.1rem] mb-[20px] relative inline-block after:content-[''] after:absolute after:bottom-[-6px] after:left-0 after:w-[30px] after:h-[2px] after:bg-[#6C63FF]">Quick Links</h4>
            <ul className="flex flex-col gap-[12px]">
              <li><Link to="/" className="text-[#b0b0cc] hover:text-[#8B83FF] hover:pl-[4px] transition-all text-[0.95rem]">Home</Link></li>
              <li><Link to="/tutors" className="text-[#b0b0cc] hover:text-[#8B83FF] hover:pl-[4px] transition-all text-[0.95rem]">Find Tutors</Link></li>
              <li><Link to="/register" className="text-[#b0b0cc] hover:text-[#8B83FF] hover:pl-[4px] transition-all text-[0.95rem]">Become a Tutor</Link></li>
              <li><Link to="/login" className="text-[#b0b0cc] hover:text-[#8B83FF] hover:pl-[4px] transition-all text-[0.95rem]">Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-[600] text-[1.1rem] mb-[20px] relative inline-block after:content-[''] after:absolute after:bottom-[-6px] after:left-0 after:w-[30px] after:h-[2px] after:bg-[#6C63FF]">Subjects</h4>
            <ul className="flex flex-col gap-[12px]">
              <li><Link to="/tutors?subject=Mathematics" className="text-[#b0b0cc] hover:text-[#8B83FF] hover:pl-[4px] transition-all text-[0.95rem]">Mathematics</Link></li>
              <li><Link to="/tutors?subject=Physics" className="text-[#b0b0cc] hover:text-[#8B83FF] hover:pl-[4px] transition-all text-[0.95rem]">Physics</Link></li>
              <li><Link to="/tutors?subject=English" className="text-[#b0b0cc] hover:text-[#8B83FF] hover:pl-[4px] transition-all text-[0.95rem]">English</Link></li>
              <li><Link to="/tutors?subject=Chemistry" className="text-[#b0b0cc] hover:text-[#8B83FF] hover:pl-[4px] transition-all text-[0.95rem]">Chemistry</Link></li>
              <li><Link to="/tutors?subject=Biology" className="text-[#b0b0cc] hover:text-[#8B83FF] hover:pl-[4px] transition-all text-[0.95rem]">Biology</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-[600] text-[1.1rem] mb-[20px] relative inline-block after:content-[''] after:absolute after:bottom-[-6px] after:left-0 after:w-[30px] after:h-[2px] after:bg-[#6C63FF]">Contact</h4>
            <ul className="flex flex-col gap-[16px]">
              <li className="flex items-center gap-[12px] text-[#b0b0cc] text-[0.95rem]"><FiMail className="text-[#6C63FF]" /> support@tuitionhub.com</li>
              <li className="flex items-center gap-[12px] text-[#b0b0cc] text-[0.95rem]"><FiPhone className="text-[#6C63FF]" /> +880 1999-007160</li>
              <li className="flex items-center gap-[12px] text-[#b0b0cc] text-[0.95rem]"><FiMapPin className="text-[#6C63FF]" /> Sylhet, Bangladesh</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-[24px] border-t border-[rgba(255,255,255,0.1)] text-[0.85rem] text-[#6b6b8d] gap-[16px]">
          <p>© {new Date().getFullYear()} TuitionHub. All rights reserved.</p>
          <div className="flex gap-[20px]">
            <a href="#" className="hover:text-[#6C63FF] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#6C63FF] transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
