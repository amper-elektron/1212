import { Link } from 'react-router-dom';
import { Instagram, Send, BookOpen, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" aria-label="Ana Səhifə" className="flex items-center gap-2 mb-6">
              <div className="bg-brand-yellow p-2 rounded-xl">
                <BookOpen className="w-5 h-5 text-gray-900" />
              </div>
              <span className="font-display font-bold text-xl text-gray-900">
                English with Asmar
              </span>
            </Link>
            <p className="text-gray-600 max-w-sm mb-6">
              Modern, energetic, and effective English lessons for learners of all levels.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/asmarburjaliyeva/" aria-label="Instagram hesabımız" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#E1306C]/10 flex items-center justify-center text-[#E1306C] hover:bg-[#E1306C] hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://t.me/boostyourenglishwithasmar" aria-label="Telegram kanalımız" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#0088cc]/10 flex items-center justify-center text-[#0088cc] hover:bg-[#0088cc] hover:text-white transition-colors">
                <Send className="w-5 h-5" />
              </a>
              <a href="https://wa.me/+994509742636" aria-label="WhatsApp əlaqə xətti" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-display font-bold text-gray-900 mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link to="/" className="text-gray-600 hover:text-brand-purple transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-gray-600 hover:text-brand-purple transition-colors">About</Link></li>
              <li><Link to="/courses" className="text-gray-600 hover:text-brand-purple transition-colors">Courses</Link></li>
              <li><Link to="/blog" className="text-gray-600 hover:text-brand-purple transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-brand-purple transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-display font-bold text-gray-900 mb-6">Admin</h3>
            <ul className="space-y-4">
              <li><Link to="/admin" className="text-gray-600 hover:text-brand-purple transition-colors">Admin Dashboard</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} English with Asmar. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
