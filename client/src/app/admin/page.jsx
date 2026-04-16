import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { FiUsers, FiBookOpen, FiDollarSign, FiCheck, FiX } from 'react-icons/fi';

const AdminDashboard = () => {
  const [data, setData] = useState({ analytics: null, users: [] });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, usersRes] = await Promise.all([
        adminAPI.getAnalytics(),
        adminAPI.getUsers(),
      ]);
      setData({ analytics: analyticsRes.data, users: usersRes.data });
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApproval = async (id, isApproved) => {
    if (!window.confirm(`Are you sure you want to ${isApproved ? 'approve' : 'reject'} this tutor?`)) return;
    try {
      await adminAPI.approveTutor(id, isApproved);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update tutor status');
    }
  };

  if (loading) {
    return (
      <div className="pt-[120px] min-h-screen flex items-center justify-center">
        <div className="spinner border-t-[#6C63FF] border-[3px] w-[50px] h-[50px] rounded-full animate-spin"></div>
      </div>
    );
  }

  const tutors = data.users.filter(u => u.role === 'tutor');
  const students = data.users.filter(u => u.role === 'student');

  return (
    <div className="pt-[100px] pb-[64px] min-h-screen">
      <div className="max-w-[1200px] mx-auto px-[20px]">
        <div className="mb-[32px] animate-[fadeInDown_0.5s_ease_forwards]">
          <h1 className="text-[2rem] font-[700] text-white mb-[6px]">Admin <span className="gradient-text">Dashboard</span></h1>
          <p className="text-[#b0b0cc]">System analytics and user management</p>
        </div>

        {/* ANALYTICS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[20px] mb-[40px]">
          <div className="p-[24px] bg-[rgba(255,255,255,0.06)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] rounded-[16px] flex flex-col justify-between">
            <div className="flex items-center gap-[12px] mb-[16px]">
              <div className="w-[48px] h-[48px] flex justify-center items-center rounded-full bg-[rgba(108,99,255,0.15)] text-[#6C63FF] text-[1.5rem]"><FiUsers/></div>
              <div className="text-[0.95rem] text-[#b0b0cc] font-[500]">Total Users</div>
            </div>
            <div className="text-[2rem] font-[700] text-white">{data.users.length}</div>
            <div className="text-[#8B83FF] text-[0.85rem] mt-[8px]">Students: {data.analytics?.users?.students || 0} | Tutors: {data.analytics?.users?.tutors || 0}</div>
          </div>
          
          <div className="p-[24px] bg-[rgba(255,255,255,0.06)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] rounded-[16px] flex flex-col justify-between">
            <div className="flex items-center gap-[12px] mb-[16px]">
              <div className="w-[48px] h-[48px] flex justify-center items-center rounded-full bg-[rgba(0,212,170,0.15)] text-[#00D4AA] text-[1.5rem]"><FiBookOpen/></div>
              <div className="text-[0.95rem] text-[#b0b0cc] font-[500]">Bookings</div>
            </div>
            <div className="text-[2rem] font-[700] text-white">{data.analytics?.bookings?.total || 0}</div>
            <div className="text-[#00D4AA] text-[0.85rem] mt-[8px]">Completed: {data.analytics?.bookings?.completed || 0}</div>
          </div>

          <div className="p-[24px] bg-[rgba(255,255,255,0.06)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] rounded-[16px] flex flex-col justify-between">
            <div className="flex items-center gap-[12px] mb-[16px]">
              <div className="w-[48px] h-[48px] flex justify-center items-center rounded-full bg-[rgba(255,183,77,0.15)] text-[#FFB74D] text-[1.5rem]"><FiDollarSign/></div>
              <div className="text-[0.95rem] text-[#b0b0cc] font-[500]">Total Revenue</div>
            </div>
            <div className="text-[2rem] font-[700] text-white">৳{data.analytics?.revenue || 0}</div>
            <div className="text-[#FFB74D] text-[0.85rem] mt-[8px]">From completed tuitions</div>
          </div>

          {/* Popular Subjects */}
          <div className="p-[24px] bg-[rgba(255,255,255,0.06)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] rounded-[16px]">
             <h3 className="text-white font-[600] text-[1.1rem] mb-[16px]">Popular Subjects</h3>
             <ul className="flex flex-col gap-[12px]">
               {data.analytics?.popularSubjects?.slice(0,3).map(p => (
                 <li key={p.subject} className="flex justify-between items-center text-[0.9rem] text-[#b0b0cc]">
                   <span>{p.subject}</span>
                   <span className="font-[600] text-[#8B83FF]">{p.count} Bookings</span>
                 </li>
               ))}
               {!data.analytics?.popularSubjects?.length && <div className="text-[#6b6b8d] text-[0.85rem]">No bookings yet.</div>}
             </ul>
          </div>
        </div>

        {/* TUTORS MANAGEMENT */}
        <h2 className="text-[1.5rem] font-[700] text-white mb-[16px]">Tutor Approvals</h2>
        <div className="bg-[rgba(255,255,255,0.06)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] rounded-[16px] overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[800px] text-left border-collapse">
            <thead>
              <tr className="bg-[rgba(255,255,255,0.05)] border-b border-[rgba(255,255,255,0.1)]">
                <th className="px-[20px] py-[16px] font-[600] text-[#b0b0cc] text-[0.9rem]">Name</th>
                <th className="px-[20px] py-[16px] font-[600] text-[#b0b0cc] text-[0.9rem]">Email & Phone</th>
                <th className="px-[20px] py-[16px] font-[600] text-[#b0b0cc] text-[0.9rem]">Subjects</th>
                <th className="px-[20px] py-[16px] font-[600] text-[#b0b0cc] text-[0.9rem]">Status</th>
                <th className="px-[20px] py-[16px] font-[600] text-[#b0b0cc] text-[0.9rem] text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {tutors.map(tutor => (
                <tr key={tutor._id} className="border-b border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                  <td className="px-[20px] py-[16px] text-white font-[500] text-[0.95rem]">{tutor.name}</td>
                  <td className="px-[20px] py-[16px]">
                    <div className="text-[0.9rem] text-[#b0b0cc]">{tutor.email}</div>
                    <div className="text-[0.85rem] text-[#6b6b8d]">{tutor.phone || 'No Phone'}</div>
                  </td>
                  <td className="px-[20px] py-[16px] text-[#8B83FF] text-[0.85rem]">
                    {tutor.subjects?.slice(0,2).join(', ')}{tutor.subjects?.length > 2 && '...'}
                  </td>
                  <td className="px-[20px] py-[16px]">
                    <span className={`inline-flex px-[10px] py-[4px] rounded-full text-[0.75rem] font-[600] ${tutor.isApproved ? 'bg-[rgba(76,175,80,0.15)] text-[#4CAF50]' : 'bg-[rgba(255,183,77,0.15)] text-[#FFB74D]'}`}>
                      {tutor.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-[20px] py-[16px] text-right">
                    {tutor.isApproved ? (
                      <button onClick={() => handleApproval(tutor._id, false)} className="inline-flex items-center gap-[6px] px-[12px] py-[6px] bg-[rgba(255,82,82,0.1)] text-[#ff7a7a] border border-[rgba(255,82,82,0.25)] rounded-[8px] text-[0.8rem] font-[500] hover:bg-[rgba(255,82,82,0.2)]">
                        <FiX /> Reject
                      </button>
                    ) : (
                      <button onClick={() => handleApproval(tutor._id, true)} className="inline-flex items-center gap-[6px] px-[12px] py-[6px] bg-[rgba(76,175,80,0.1)] text-[#69c16d] border border-[rgba(76,175,80,0.25)] rounded-[8px] text-[0.8rem] font-[500] hover:bg-[rgba(76,175,80,0.2)]">
                        <FiCheck /> Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {tutors.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-[20px] py-[32px] text-center text-[#6b6b8d]">No tutors found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
