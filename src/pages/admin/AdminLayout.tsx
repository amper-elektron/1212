import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, FileText, MessageSquare, Users, LogOut, HelpCircle, Image as ImageIcon, MessageCircle } from 'lucide-react';
import clsx from 'clsx';

const adminLinks = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Courses', path: '/admin/courses', icon: BookOpen },
  { name: 'Blog', path: '/admin/blog', icon: FileText },
  { name: 'Requests', path: '/admin/requests', icon: Users },
  { name: 'Feedback', path: '/admin/feedback', icon: MessageSquare },
  { name: 'FAQ', path: '/admin/faq', icon: HelpCircle },
  { name: 'Images', path: '/admin/images', icon: ImageIcon },
  { name: 'Comments', path: '/admin/comments', icon: MessageCircle }, // YENİ EKLENDİ
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-10">
        <div className="h-20 flex items-center px-6 border-b border-gray-200">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-brand-yellow p-1.5 rounded-lg">
              <BookOpen className="w-5 h-5 text-gray-900" />
            </div>
            <span className="font-display font-bold text-lg text-gray-900">
              Admin Panel
            </span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {adminLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors',
                location.pathname === link.path
                  ? 'bg-brand-purple text-white shadow-md shadow-brand-purple/20'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <link.icon className="w-5 h-5" />
              {link.name}
            </Link>
          ))}
        </div>
        
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-100 hover:text-red-600 transition-colors w-full text-left"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
}
