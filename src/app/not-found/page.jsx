import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center pt-[80px] pb-[40px] px-[20px] relative overflow-hidden">
      <div className="absolute rounded-full blur-[80px] pointer-events-none w-[500px] h-[500px] bg-[rgba(108,99,255,0.08)] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] animate-[pulse_4s_ease-in-out_infinite]" />
      
      <div className="text-center relative z-10 animate-[scaleIn_0.4s_ease_forwards]">
        <div className="text-[clamp(6rem,15vw,12rem)] font-[900] leading-none bg-gradient-to-br from-[#6C63FF] via-[#00D4AA] to-[#5A52D5] bg-clip-text text-transparent mb-[10px]">
          404
        </div>
        <h1 className="text-[clamp(1.5rem,4vw,2.5rem)] font-[800] text-white mb-[16px]">Page Not Found</h1>
        <p className="text-[#b0b0cc] text-[1.1rem] max-w-[400px] mx-auto mb-[32px]">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-wrap gap-[16px] justify-center">
          <Link to="/" className="inline-flex items-center justify-center gap-[8px] px-[36px] py-[16px] rounded-[12px] font-[600] text-[1.05rem] bg-gradient-to-br from-[#6C63FF] to-[#5A52D5] text-white shadow-[0_4px_15px_rgba(108,99,255,0.35)] transition-all hover:-translate-y-[2px] hover:shadow-[0_6px_25px_rgba(108,99,255,0.5)]">
            Go Home
          </Link>
          <Link to="/tutors" className="inline-flex items-center justify-center gap-[8px] px-[36px] py-[16px] rounded-[12px] font-[600] text-[1.05rem] bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] text-[#b0b0cc] transition-all hover:bg-[rgba(255,255,255,0.12)] hover:border-[#6C63FF] hover:text-white">
            Find Tutors
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
