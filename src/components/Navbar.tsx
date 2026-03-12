import { Link, useLocation } from 'react-router-dom';
import { Menu, X, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import clsx from 'clsx';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Courses', path: '/courses' },
  { name: 'Blog', path: '/blog' },
  { name: 'Reviews', path: '/reviews' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-brand-yellow p-2 rounded-xl group-hover:rotate-12 transition-transform">
                <BookOpen className="w-6 h-6 text-gray-900" />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-gray-900">
                English with Asmar
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={clsx(
                  'font-medium text-sm transition-colors hover:text-brand-purple',
                  location.pathname === link.path ? 'text-brand-purple' : 'text-gray-600'
                )}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/courses"
              className="bg-gray-900 text-white px-5 py-2.5 rounded-full font-medium text-sm hover:bg-brand-purple transition-colors shadow-sm"
            >
              Join a Course
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Menyu" className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={clsx(
                    'block px-3 py-3 rounded-xl font-medium text-base',
                    location.pathname === link.path
                      ? 'bg-brand-lavender text-brand-purple'
                      : 'text-gray-600 hover:bg-gray-50'
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4">
                <Link
                  to="/courses"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center bg-brand-yellow text-gray-900 px-5 py-3 rounded-xl font-bold text-base shadow-sm"
                >
                  Join a Course
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
