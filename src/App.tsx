import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WhatsAppButton from './components/WhatsAppButton'; 
import ScrollToTop from './components/ScrollToTop'; 
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Courses from './pages/Courses';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Reviews from './pages/Reviews';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AdminCourses from './pages/admin/AdminCourses';
import AdminBlog from './pages/admin/AdminBlog';
import AdminRequests from './pages/admin/AdminRequests';
import AdminFeedback from './pages/admin/AdminFeedback';
import AdminFAQ from './pages/admin/AdminFAQ';
import Login from './pages/admin/Login';
import AdminImages from './pages/admin/AdminImages';
import AdminComments from './pages/admin/AdminComments';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

export default function App() {
  useEffect(() => {
    fetch('/api/track-visit', { method: 'POST' }).catch(() => {});
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/courses" element={<Layout><Courses /></Layout>} />
        <Route path="/blog" element={<Layout><Blog /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
        <Route path="/reviews" element={<Layout><Reviews /></Layout>} />

        {/* Admin Login */}
        <Route path="/admin/login" element={<Login />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="blog" element={<AdminBlog />} />
          <Route path="requests" element={<AdminRequests />} />
          <Route path="feedback" element={<AdminFeedback />} />
          <Route path="faq" element={<AdminFAQ />} />
          <Route path="images" element={<AdminImages />} />
          <Route path="comments" element={<AdminComments />} />
        </Route>
      </Routes>
    </Router>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Navbar />
      <main className="flex-grow pt-20">
        {children}
      </main>
      <WhatsAppButton />
      <Footer />
    </div>
  );
}
