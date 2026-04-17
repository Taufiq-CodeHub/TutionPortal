import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { bookingAPI } from '../../services/api';
import { FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';

const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Bangla', 'ICT', 'Accounting', 'History', 'Geography'];

const TutorServices = () => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    subject: '',
    date: '',
    time: '',
    duration: 1,
    totalPrice: 0,
    message: ''
  });
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' || name === 'totalPrice' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!formData.subject || !formData.date || !formData.time) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      if (editingId) {
        // Update existing service
        const response = await bookingAPI.update(editingId, formData);
        const updated = response.data || response.data?.data || response;
        setServices(prev => prev.map(s => s._id === updated._id ? updated : s));
        setSuccess('Service updated successfully!');
        setEditingId(null);
      } else {
        const response = await bookingAPI.createAsService(formData);
        const created = response.data || response.data?.data || response;
        setServices(prev => [created, ...prev]);
        setSuccess('Service created successfully!');
      }
      setSuccess('Service created successfully!');
      setFormData({
        subject: '',
        date: '',
        time: '',
        duration: 1,
        totalPrice: 0,
        message: ''
      });
      setShowForm(false);

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create service');
    } finally {
      setLoading(false);
    }
  };

  // Fetch tutor's services on mount
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await bookingAPI.getMine({});
        // services where tutor is current user
        const mine = (data || []).filter(b => b.tutor && b.tutor._id === user._id && b.status === 'available');
        setServices(mine);
      } catch (err) {
        console.error('Failed to load services', err);
      }
    };
    load();
  }, [user]);

  const handleEditClick = (service) => {
    setEditingId(service._id);
    setFormData({
      subject: service.subject || '',
      date: service.date ? service.date.split('T')[0] : '',
      time: service.time || '',
      duration: service.duration || 1,
      totalPrice: service.totalPrice || 0,
      message: service.message || ''
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!user || user.role !== 'tutor') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white">Only tutors can access this page</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[100px] pb-[40px] px-[20px]">
      <div className="max-w-[900px] mx-auto">
        <div className="flex justify-between items-center mb-[28px]">
          <h2 className="text-[1.8rem] text-white font-[700]">My Tutoring Services</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-[8px] px-[16px] py-[10px] bg-[#6C63FF] text-white rounded-[8px] hover:bg-[#5A52D5] transition-all"
          >
            <FiPlus /> Add Service
          </button>
        </div>

        {error && (
          <div className="p-[12px_16px] rounded-[12px] mb-[20px] bg-[rgba(255,82,82,0.1)] border border-[rgba(255,82,82,0.25)] text-[#ff7a7a]">
            {error}
          </div>
        )}

        {success && (
          <div className="p-[12px_16px] rounded-[12px] mb-[20px] bg-[rgba(76,175,80,0.1)] border border-[rgba(76,175,80,0.25)] text-[#4CAF50]">
            {success}
          </div>
        )}

        {/* Add Service Form */}
        {showForm && (
          <div className="bg-[rgba(255,255,255,0.06)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] rounded-[16px] p-[28px] mb-[28px]">
            <h3 className="text-[1.2rem] text-white font-[600] mb-[20px]">Create New Service</h3>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
              {/* Subject */}
              <div className="sm:col-span-1">
                <label className="block mb-[8px] text-[0.9rem] font-[500] text-[#b0b0cc]">Subject *</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full py-[12px] px-[16px] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] rounded-[12px] text-white text-[0.95rem] outline-none focus:border-[#6C63FF]"
                >
                  <option value="">Select Subject</option>
                  {SUBJECTS.map(s => (
                    <option key={s} value={s} className="bg-[#1a1a2e] text-white">{s}</option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div className="sm:col-span-1">
                <label className="block mb-[8px] text-[0.9rem] font-[500] text-[#b0b0cc]">Date *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full py-[12px] px-[16px] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] rounded-[12px] text-white text-[0.95rem] outline-none focus:border-[#6C63FF]"
                />
              </div>

              {/* Time */}
              <div className="sm:col-span-1">
                <label className="block mb-[8px] text-[0.9rem] font-[500] text-[#b0b0cc]">Time *</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full py-[12px] px-[16px] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] rounded-[12px] text-white text-[0.95rem] outline-none focus:border-[#6C63FF]"
                />
              </div>

              {/* Duration */}
              <div className="sm:col-span-1">
                <label className="block mb-[8px] text-[0.9rem] font-[500] text-[#b0b0cc]">Duration (Hours)</label>
                <input
                  type="number"
                  name="duration"
                  min="1"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full py-[12px] px-[16px] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] rounded-[12px] text-white text-[0.95rem] outline-none focus:border-[#6C63FF]"
                />
              </div>

              {/* Price */}
              <div className="sm:col-span-1">
                <label className="block mb-[8px] text-[0.9rem] font-[500] text-[#b0b0cc]">Total Price (৳)</label>
                <input
                  type="number"
                  name="totalPrice"
                  value={formData.totalPrice}
                  onChange={handleChange}
                  className="w-full py-[12px] px-[16px] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] rounded-[12px] text-white text-[0.95rem] outline-none focus:border-[#6C63FF]"
                />
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label className="block mb-[8px] text-[0.9rem] font-[500] text-[#b0b0cc]">Description / Notes</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Add any details about this session..."
                  className="w-full py-[12px] px-[16px] bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] rounded-[12px] text-white text-[0.95rem] outline-none focus:border-[#6C63FF] placeholder:text-[#6b6b8d] min-h-[80px]"
                />
              </div>

              {/* Buttons */}
              <div className="sm:col-span-2 flex gap-[12px]">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-[12px] bg-[#6C63FF] text-white rounded-[12px] font-[600] hover:bg-[#5A52D5] transition-all disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Service'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-[12px] bg-[rgba(255,255,255,0.1)] text-white rounded-[12px] font-[600] hover:bg-[rgba(255,255,255,0.15)] transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Services List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
          {services.length === 0 ? (
            <div className="col-span-full text-center py-[40px] text-[#b0b0cc]">
              No services created yet. Create your first tutoring service!
            </div>
          ) : (
            services.map(service => (
              <div key={service._id} className="bg-[rgba(255,255,255,0.06)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] rounded-[12px] p-[20px]">
                <div className="flex justify-between items-start mb-[12px]">
                  <h4 className="text-[1.1rem] font-[600] text-white">{service.subject}</h4>
                  <div className="flex items-center gap-[8px]">
                    <button onClick={() => handleEditClick(service)} className="inline-flex items-center gap-[6px] px-[10px] py-[6px] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] rounded-[8px] text-[#b0b0cc] hover:bg-[rgba(255,255,255,0.06)]">
                      <FiEdit2 /> Edit
                    </button>
                  </div>
                  <span className={`px-[10px] py-[4px] rounded-[6px] text-[0.8rem] font-[500] ${
                    service.status === 'confirmed' ? 'bg-[rgba(76,175,80,0.2)] text-[#4CAF50]' :
                    service.status === 'completed' ? 'bg-[rgba(108,99,255,0.2)] text-[#8B83FF]' :
                    'bg-[rgba(255,193,7,0.2)] text-[#FFC107]'
                  }`}>
                    {service.status?.charAt(0).toUpperCase() + service.status?.slice(1)}
                  </span>
                </div>
                <p className="text-[#b0b0cc] text-[0.9rem] mb-[12px]">{service.message}</p>
                <div className="grid grid-cols-2 gap-[12px] mb-[16px] text-[0.85rem]">
                  <div>
                    <p className="text-[#6b6b8d]">Date & Time</p>
                    <p className="text-white font-[500]">{new Date(service.date).toLocaleDateString()} {service.time}</p>
                  </div>
                  <div>
                    <p className="text-[#6b6b8d]">Duration</p>
                    <p className="text-white font-[500]">{service.duration} hour{service.duration > 1 ? 's' : ''}</p>
                  </div>
                  <div>
                    <p className="text-[#6b6b8d]">Price</p>
                    <p className="text-white font-[500]">৳{service.totalPrice}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorServices;
