import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WhatsAppButton from './components/WhatsAppButton'; 
import ScrollToTop from './components/ScrollToTop'; 
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// 🚀 YENİ: SADECE TIKLANAN SAYFAYI YÜKLEYEN "LAZY LOADING" SİSTEMİ (Mobilde Hızı Uçurur)
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Courses = lazy(() => import('./pages/Courses'));
const Blog = lazy(() => import('./pages/Blog'));
const Contact = lazy(() => import('./pages/Contact'));
const Reviews = lazy(() => import('./pages/Reviews'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminCourses = lazy(() => import('./pages/admin/AdminCourses'));
const AdminBlog = lazy(() => import('./pages/admin/AdminBlog'));
const AdminRequests = lazy(() => import('./pages/admin/AdminRequests'));
const AdminFeedback = lazy(() => import('./pages/admin/AdminFeedback'));
const AdminFAQ = lazy(() => import('./pages/admin/AdminFAQ'));
const Login = lazy(() => import('./pages/admin/Login'));
const AdminImages = lazy(() => import('./pages/admin/AdminImages'));
const AdminComments = lazy(() => import('./pages/admin/AdminComments'));

// YENİ: Sayfalar arası geçerken milisaniyelik gecikmede çıkacak şık yüklenme animasyonu
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
    <div className="w-10 h-10 border-4 border-[#C9A96E] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

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
      {/* 🚀 Suspense: Lazy loading olan sayfaları sarmalar */}
      <Suspense fallback={<LoadingScreen />}>
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
      </Suspense>
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
