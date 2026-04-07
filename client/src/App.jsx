import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './app/page';
import Login from './app/login/page';
import Register from './app/register/page';
import Tutors from './app/tutors/page';
import TutorDetail from './app/tutors/[id]/page';
import Dashboard from './app/dashboard/page';
import MyBookings from './app/bookings/page';
import ManageBookings from './app/manage-bookings/page';
import Profile from './app/profile/page';
import NotFound from './app/not-found/page';

const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loader-fullscreen">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />
          <Route path="/tutors" element={<Tutors />} />
          <Route path="/tutors/:id" element={<TutorDetail />} />

          {/* Protected - Any Auth */}
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />

          {/* Protected - Student Only */}
          <Route path="/bookings" element={
            <ProtectedRoute role="student"><MyBookings /></ProtectedRoute>
          } />

          {/* Protected - Tutor Only */}
          <Route path="/manage-bookings" element={
            <ProtectedRoute role="tutor"><ManageBookings /></ProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default App;
