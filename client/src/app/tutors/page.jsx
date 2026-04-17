import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { tutorAPI, bookingAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Bangla', 'ICT', 'Accounting', 'History', 'Geography'];

const Tutors = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState('');

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    subject: searchParams.get('subject') || '',
    location: '',
  });

  const fetchServices = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== '')
      );
      const { data } = await bookingAPI.getAvailableServices(params);
      let filtered = Array.isArray(data) ? data : data.services || [];

      // Client-side filtering for search
      if (filters.search) {
        filtered = filtered.filter(s => 
          (s.tutor?.name || '').toLowerCase().includes(filters.search.toLowerCase()) ||
          (s.subject || '').toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      setServices(filtered);
      setTotal(filtered.length);
    } catch (err) {
      console.error('Failed to fetch services:', err);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleBookNow = (service) => {
    if (!user) {
      alert('Please login to book a service');
      return;
    }
    if (user.role !== 'student') {
      alert('Only students can book services');
      return;
    }
    setSelectedService(service);
    setBookingMessage('');
  };

  const handleConfirmBooking = async () => {
    if (!selectedService) return;
    
    setBookingLoading(true);
    try {
      const bookingData = {
        tutor: selectedService.tutor._id,
        subject: selectedService.subject,
        date: selectedService.date,
        time: selectedService.time,
        duration: selectedService.duration,
        message: selectedService.message || ''
      };
      
      const response = await bookingAPI.create(bookingData);
      const tutorApproved = response.data?.tutor?.isApproved;
      
      if (tutorApproved === false) {
        setBookingMessage('✅ Booking request sent! This tutor\'s profile is pending verification. Your booking will be confirmed once they are approved.');
      } else {
        setBookingMessage('✅ Booking confirmed! Check your bookings for details.');
      }
      
      setTimeout(() => {
        setSelectedService(null);
        setBookingMessage('');
      }, 3000);
    } catch (err) {
      setBookingMessage('❌ Booking failed: ' + (err.response?.data?.message || 'Try again'));
    } finally {
      setBookingLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({ search: '', subject: '', location: '' });
    setSearchParams({});
  };

  const hasActiveFilters = filters.subject || filters.location;

  return (
    <div className="pt-[80px] min-h-screen">
      <div className="bg-gradient-to-br from-[rgba(108,99,255,0.08)] to-[rgba(0,212,170,0.04)] border-b border-[rgba(255,255,255,0.06)] py-[48px] pb-[32px]">
        <div className="w-full max-w-[1200px] mx-auto px-[20px]">
          <h1 className="text-[2.2rem] font-[700] text-white mb-[8px]">Find Your Perfect <span className="gradient-text">Tutor</span></h1>
          <p className="text-[#b0b0cc] mb-[24px]">{total} tutors available</p>

          <div className="flex gap-[12px] flex-wrap items-center">
            <div className="flex-1 min-w-[280px] relative">
              <FiSearch className="absolute left-[16px] top-[50%] translate-y-[-50%] text-[#6b6b8d] text-[1.1rem]" />
              <input
                type="text"
                placeholder="Search by tutor name or subject..."
                className="w-full pl-[48px] pr-[16px] py-[12px] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] rounded-[12px] text-white text-[0.95rem] outline-none transition-all focus:border-[#6C63FF] focus:bg-[rgba(255,255,255,0.1)] focus:shadow-[0_0_0_3px_rgba(108,99,255,0.3)] placeholder:text-[#6b6b8d]"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            <button className="h-[46px] inline-flex items-center justify-center gap-[6px] px-[16px] bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] text-[#b0b0cc] rounded-[12px] font-[500] hover:bg-[rgba(255,255,255,0.12)] hover:text-white transition-all cursor-pointer" onClick={() => setShowFilters(!showFilters)}>
              <FiFilter /> Filters {hasActiveFilters && <span className="inline-block w-[6px] h-[6px] bg-[#FF6B9D] rounded-full ml-[4px]" />}
            </button>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1200px] mx-auto px-[20px] flex flex-col md:flex-row gap-[24px] pt-[32px] pb-[64px] items-start">
        {/* Filters Sidebar */}
        {showFilters && (
          <aside className="w-full md:w-[280px] shrink-0 p-[24px] bg-[rgba(255,255,255,0.06)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] rounded-[16px] md:sticky md:top-[100px] animate-[slideInLeft_0.3s_ease_forwards]">
            <div className="flex justify-between items-center mb-[20px]">
              <h3 className="text-[1rem] font-[700] text-white">Filters</h3>
              {hasActiveFilters && (
                <button className="flex items-center gap-[4px] bg-transparent border-none text-[#FF6B9D] text-[0.82rem] cursor-pointer hover:underline" onClick={clearFilters}>
                  <FiX /> Clear All
                </button>
              )}
            </div>

            <div className="mb-[22px]">
              <label className="block text-[0.85rem] font-[600] text-[#b0b0cc] mb-[10px] uppercase tracking-[0.05em]">Subject</label>
              <div className="flex flex-wrap gap-[6px]">
                {SUBJECTS.map((s) => (
                  <button
                    key={s}
                    className={`px-[12px] py-[6px] border rounded-full text-[0.82rem] cursor-pointer transition-all ${filters.subject === s ? 'bg-[rgba(108,99,255,0.15)] border-[#6C63FF] text-[#8B83FF] font-[500]' : 'bg-transparent border-[rgba(255,255,255,0.1)] text-[#6b6b8d] hover:border-[#6C63FF] hover:text-[#8B83FF]'}`}
                    onClick={() => handleFilterChange('subject', filters.subject === s ? '' : s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-[22px]">
              <label className="block text-[0.85rem] font-[600] text-[#b0b0cc] mb-[10px] uppercase tracking-[0.05em]">Location</label>
              <input
                type="text"
                placeholder="e.g. Dhaka, Chittagong"
                className="w-full py-[10px] px-[14px] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] rounded-[12px] text-white text-[0.9rem] outline-none transition-all focus:border-[#6C63FF]"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              />
            </div>
          </aside>
        )}

        {/* Results */}
        <div className="flex-1 min-w-0 w-full">
          {loading ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-[20px] mb-[32px]">
              {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-[280px] rounded-[16px] border border-[rgba(255,255,255,0.06)] bg-gradient-to-r from-[rgba(255,255,255,0.03)] via-[rgba(255,255,255,0.07)] to-[rgba(255,255,255,0.03)] bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]" />)}
            </div>
          ) : services.length > 0 ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-[20px] mb-[32px]">
              {services.map((service) => (
                <div key={service._id} className="bg-[rgba(255,255,255,0.06)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] rounded-[16px] overflow-hidden hover:border-[rgba(255,255,255,0.2)] transition-all group cursor-pointer">
                  <div className="p-[20px]">
                    <div className="flex items-start justify-between mb-[12px]">
                      <div>
                        <h3 className="text-[1.1rem] font-[700] text-white">
                          {service.tutor?.name || 'Anonymous Tutor'}
                        </h3>
                        <p className="text-[#b0b0cc] text-[0.85rem]">{service.subject}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-[4px] text-[0.9rem]">
                          <span className="text-[#FFD700]">★</span>
                          <span className="text-white font-[600]">{service.tutor?.rating || 0}</span>
                        </div>
                        <p className="text-[#6b6b8d] text-[0.75rem]">({service.tutor?.totalReviews || 0})</p>
                      </div>
                    </div>

                    <p className="text-[#b0b0cc] text-[0.9rem] mb-[12px] line-clamp-2">{service.message || 'No description'}</p>

                    <div className="grid grid-cols-2 gap-[12px] mb-[16px] text-[0.85rem]">
                      <div>
                        <p className="text-[#6b6b8d]">Date</p>
                        <p className="text-white font-[500]">{new Date(service.date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-[#6b6b8d]">Time</p>
                        <p className="text-white font-[500]">{service.time}</p>
                      </div>
                      <div>
                        <p className="text-[#6b6b8d]">Duration</p>
                        <p className="text-white font-[500]">{service.duration}h</p>
                      </div>
                      <div>
                        <p className="text-[#6b6b8d]">Price</p>
                        <p className="text-[#00D4AA] font-[600]">৳{service.totalPrice}</p>
                      </div>
                    </div>

                    {service.tutor?.location && (
                      <p className="text-[#6b6b8d] text-[0.85rem] mb-[12px]">📍 {service.tutor.location}</p>
                    )}

                    <button 
                      onClick={() => handleBookNow(service)}
                      className="w-full py-[10px] bg-[#6C63FF] text-white rounded-[8px] font-[600] hover:bg-[#5A52D5] transition-all">
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-[80px] px-[20px]">
              <div className="text-[4rem] mb-[16px] flex justify-center">🔍</div>
              <h3 className="text-[1.3rem] font-[600] text-white mb-[8px]">No services found</h3>
              <p className="text-[#6b6b8d] mb-[24px]">Try adjusting your search filters or check back later</p>
              <button className="inline-flex items-center justify-center px-[28px] py-[12px] bg-transparent border border-[var(--primary)] text-[var(--primary)] font-[600] rounded-[12px] transition-all hover:bg-[var(--primary)] hover:text-white" onClick={clearFilters}>Clear Filters</button>
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-[20px]">
          <div className="bg-[#0f0f1e] border border-[rgba(255,255,255,0.1)] rounded-[16px] max-w-[500px] w-full p-[32px]">
            <h2 className="text-[1.5rem] font-[700] text-white mb-[16px]">Confirm Booking</h2>

            <div className="mb-[24px] space-y-[12px]">
              <div className="flex justify-between">
                <span className="text-[#6b6b8d]">Tutor:</span>
                <span className="text-white font-[500]">{selectedService.tutor?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b6b8d]">Subject:</span>
                <span className="text-white font-[500]">{selectedService.subject}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b6b8d]">Date:</span>
                <span className="text-white font-[500]">{new Date(selectedService.date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b6b8d]">Time:</span>
                <span className="text-white font-[500]">{selectedService.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b6b8d]">Duration:</span>
                <span className="text-white font-[500]">{selectedService.duration} hour{selectedService.duration > 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between pt-[12px] border-t border-[rgba(255,255,255,0.1)]">
                <span className="text-[#b0b0cc] font-[600]">Total Price:</span>
                <span className="text-[#00D4AA] font-[700] text-[1.1rem]">৳{selectedService.totalPrice}</span>
              </div>
            </div>

            {bookingMessage && (
              <div className={`p-[12px_16px] rounded-[12px] mb-[16px] text-center ${
                bookingMessage.includes('✅') 
                  ? 'bg-[rgba(76,175,80,0.1)] border border-[rgba(76,175,80,0.25)] text-[#4CAF50]'
                  : 'bg-[rgba(255,82,82,0.1)] border border-[rgba(255,82,82,0.25)] text-[#ff7a7a]'
              }`}>
                {bookingMessage}
              </div>
            )}

            <div className="flex gap-[12px]">
              <button
                onClick={() => setSelectedService(null)}
                disabled={bookingLoading}
                className="flex-1 py-[12px] bg-[rgba(255,255,255,0.1)] text-white rounded-[8px] font-[600] hover:bg-[rgba(255,255,255,0.15)] transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBooking}
                disabled={bookingLoading}
                className="flex-1 py-[12px] bg-[#6C63FF] text-white rounded-[8px] font-[600] hover:bg-[#5A52D5] transition-all disabled:opacity-50"
              >
                {bookingLoading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tutors;
