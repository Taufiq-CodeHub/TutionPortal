import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiMenu, FiX, FiUser, FiLogOut, FiBookOpen,
  FiCalendar, FiSettings, FiGrid
} from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  const getInitials = (name) =>
    name ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : 'U';

  return (
    <nav className={`fixed top-0 w-full z-[1000] transition-all duration-300 ${scrolled ? 'bg-[rgba(10,10,26,0.9)] backdrop-blur-[10px] py-[15px] border-b border-[rgba(255,255,255,0.1)] shadow-[0_2px_8px_rgba(0,0,0,0.3)]' : 'bg-transparent py-[20px]'}`}>
      <div className="w-full max-w-[1200px] mx-auto px-[20px] flex justify-between items-center relative">
        {/* Logo */}
        <Link to="/" className="text-[1.4rem] font-[800] flex items-center gap-[8px] text-white">
          <span className="text-[#6C63FF]">TuitionHub</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className={`md:static md:flex md:flex-row md:items-center md:bg-transparent md:w-auto md:p-0 md:gap-[10px] fixed top-full left-0 w-full bg-[#111128] flex-col p-[20px] gap-[16px] border-b border-[rgba(255,255,255,0.1)] transition-all ${menuOpen ? 'flex max-h-[500px]' : 'hidden max-h-0 md:max-h-none overflow-hidden md:overflow-visible'}`}>
          <NavLink to="/" end className={({ isActive }) => `text-[0.95rem] font-[500] px-[16px] py-[8px] rounded-[8px] transition-all ${isActive ? 'text-[#6C63FF] bg-[rgba(108,99,255,0.1)]' : 'text-[#b0b0cc] hover:text-white hover:bg-[rgba(255,255,255,0.05)]'}`} onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/tutors" className={({ isActive }) => `text-[0.95rem] font-[500] px-[16px] py-[8px] rounded-[8px] transition-all ${isActive ? 'text-[#6C63FF] bg-[rgba(108,99,255,0.1)]' : 'text-[#b0b0cc] hover:text-white hover:bg-[rgba(255,255,255,0.05)]'}`} onClick={() => setMenuOpen(false)}>Find Tutors</NavLink>

          {user?.role === 'student' && (
            <NavLink to="/bookings" className={({ isActive }) => `text-[0.95rem] font-[500] px-[16px] py-[8px] rounded-[8px] transition-all ${isActive ? 'text-[#6C63FF] bg-[rgba(108,99,255,0.1)]' : 'text-[#b0b0cc] hover:text-white hover:bg-[rgba(255,255,255,0.05)]'}`} onClick={() => setMenuOpen(false)}>
              My Bookings
            </NavLink>
          )}
          {user?.role === 'tutor' && (
            <NavLink to="/manage-bookings" className={({ isActive }) => `text-[0.95rem] font-[500] px-[16px] py-[8px] rounded-[8px] transition-all ${isActive ? 'text-[#6C63FF] bg-[rgba(108,99,255,0.1)]' : 'text-[#b0b0cc] hover:text-white hover:bg-[rgba(255,255,255,0.05)]'}`} onClick={() => setMenuOpen(false)}>
              Manage Bookings
            </NavLink>
          )}
          {user && (
            <NavLink to="/dashboard" className={({ isActive }) => `text-[0.95rem] font-[500] px-[16px] py-[8px] rounded-[8px] transition-all ${isActive ? 'text-[#6C63FF] bg-[rgba(108,99,255,0.1)]' : 'text-[#b0b0cc] hover:text-white hover:bg-[rgba(255,255,255,0.05)]'}`} onClick={() => setMenuOpen(false)}>
              Dashboard
            </NavLink>
          )}

          {/* Mobile auth buttons */}
          {!user && (
            <div className="md:hidden flex flex-col gap-[10px] mt-[10px] pt-[15px] border-t border-[rgba(255,255,255,0.1)]">
              <Link to="/login" className="inline-flex items-center justify-center gap-[8px] px-[18px] py-[8px] rounded-[12px] font-[600] text-[0.85rem] bg-[rgba(255,255,255,0.06)] text-[#b0b0cc] border border-[rgba(255,255,255,0.1)] transition-all hover:bg-[rgba(255,255,255,0.12)] hover:text-white hover:border-[#6C63FF]" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="inline-flex items-center justify-center gap-[8px] px-[18px] py-[8px] rounded-[12px] font-[600] text-[0.85rem] bg-gradient-to-br from-[#6C63FF] to-[#5A52D5] text-white shadow-[0_4px_15px_rgba(108,99,255,0.35)] transition-all hover:translate-y-[-2px] hover:shadow-[0_6px_25px_rgba(108,99,255,0.5)]" onClick={() => setMenuOpen(false)}>Register</Link>
            </div>
          )}
        </div>

        {/* Desktop Auth */}
        <div className="flex items-center gap-[12px]">
          {!user ? (
            <div className="hidden md:flex gap-[12px]">
              <Link to="/login" className="inline-flex items-center justify-center gap-[8px] px-[18px] py-[8px] rounded-[12px] font-[600] text-[0.85rem] bg-[rgba(255,255,255,0.06)] text-[#b0b0cc] border border-[rgba(255,255,255,0.1)] transition-all hover:bg-[rgba(255,255,255,0.12)] hover:text-white hover:border-[#6C63FF]">Login</Link>
              <Link to="/register" className="inline-flex items-center justify-center gap-[8px] px-[18px] py-[8px] rounded-[12px] font-[600] text-[0.85rem] bg-gradient-to-br from-[#6C63FF] to-[#5A52D5] text-white shadow-[0_4px_15px_rgba(108,99,255,0.35)] transition-all hover:translate-y-[-2px] hover:shadow-[0_6px_25px_rgba(108,99,255,0.5)]">Get Started</Link>
            </div>
          ) : (
            <div className="relative">
              <button className="flex items-center gap-[10px] px-[6px] py-[6px] pr-[12px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-[30px] cursor-pointer transition-all hover:bg-[rgba(255,255,255,0.1)]" onClick={() => setDropdownOpen(!dropdownOpen)}>
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-[32px] h-[32px] rounded-full object-cover border-2 border-transparent" />
                ) : (
                  <div className="w-[32px] h-[32px] rounded-full bg-[#6C63FF] text-white flex items-center justify-center font-[700] text-[0.8rem]">{getInitials(user.name)}</div>
                )}
                <span className="font-[600] text-[0.9rem] text-white">{user.name?.split(' ')[0]}</span>
                <span className={`text-[0.7rem] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}>▾</span>
              </button>

              {dropdownOpen && (
                <div className="absolute top-[calc(100%+10px)] right-0 w-[240px] bg-[rgba(17,17,40,0.95)] backdrop-blur-[20px] rounded-[16px] border border-[rgba(255,255,255,0.1)] shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden z-[100] animate-[fadeInDown_0.3s_ease]">
                  <div className="p-[16px]">
                    <span className="block font-[700] text-white text-[1rem] mb-[4px]">{user.name}</span>
                    <span className={`inline-flex items-center gap-[4px] px-[12px] py-[4px] rounded-full text-[0.8rem] font-[600] ${user.role === 'tutor' ? 'bg-[rgba(108,99,255,0.15)] text-[#8B83FF]' : 'bg-[rgba(0,212,170,0.15)] text-[#00D4AA]'}`}>
                      {user.role === 'tutor' ? 'Tutor' : 'Student'}
                    </span>
                  </div>
                  <div className="h-[1px] bg-[rgba(255,255,255,0.06)]" />
                  <div className="p-[8px] flex flex-col gap-[2px]">
                    <Link to="/dashboard" className="flex items-center gap-[12px] px-[16px] py-[10px] rounded-[8px] text-[#b0b0cc] font-[500] text-[0.9rem] transition-all hover:bg-[rgba(255,255,255,0.05)] hover:text-white" onClick={() => setDropdownOpen(false)}>
                      <FiGrid /> Dashboard
                    </Link>
                    <Link to="/profile" className="flex items-center gap-[12px] px-[16px] py-[10px] rounded-[8px] text-[#b0b0cc] font-[500] text-[0.9rem] transition-all hover:bg-[rgba(255,255,255,0.05)] hover:text-white" onClick={() => setDropdownOpen(false)}>
                      <FiUser /> Profile
                    </Link>
                    {user.role === 'student' && (
                      <Link to="/bookings" className="flex items-center gap-[12px] px-[16px] py-[10px] rounded-[8px] text-[#b0b0cc] font-[500] text-[0.9rem] transition-all hover:bg-[rgba(255,255,255,0.05)] hover:text-white" onClick={() => setDropdownOpen(false)}>
                        <FiCalendar /> My Bookings
                      </Link>
                    )}
                    {user.role === 'tutor' && (
                      <Link to="/manage-bookings" className="flex items-center gap-[12px] px-[16px] py-[10px] rounded-[8px] text-[#b0b0cc] font-[500] text-[0.9rem] transition-all hover:bg-[rgba(255,255,255,0.05)] hover:text-white" onClick={() => setDropdownOpen(false)}>
                        <FiBookOpen /> Manage Bookings
                      </Link>
                    )}
                    <Link to="/profile" className="flex items-center gap-[12px] px-[16px] py-[10px] rounded-[8px] text-[#b0b0cc] font-[500] text-[0.9rem] transition-all hover:bg-[rgba(255,255,255,0.05)] hover:text-white" onClick={() => setDropdownOpen(false)}>
                      <FiSettings /> Settings
                    </Link>
                  </div>
                  <div className="h-[1px] bg-[rgba(255,255,255,0.06)]" />
                  <div className="p-[8px]">
                    <button className="w-full flex items-center gap-[12px] px-[16px] py-[10px] rounded-[8px] text-[#b0b0cc] font-[500] text-[0.9rem] transition-all hover:bg-[rgba(255,82,82,0.1)] hover:text-[#ff7a7a]" onClick={handleLogout}>
                      <FiLogOut /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile menu toggle */}
          <button className="md:hidden flex bg-transparent border-none text-white cursor-pointer p-[4px]" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Overlay for dropdown */}
      {dropdownOpen && <div className="fixed inset-0 z-[90]" onClick={() => setDropdownOpen(false)} />}
    </nav>
  );
};

export default Navbar;
