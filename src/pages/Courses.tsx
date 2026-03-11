import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, BookOpen, Calendar, ChevronDown, HelpCircle, AlertCircle } from 'lucide-react';

interface Course {
  id: number;
  title: string;
  description: string;
  target_audience: string;
  active: boolean;
}

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const [coursesRes, faqsRes] = await Promise.all([
          fetch('/api/courses'),
          fetch('/api/faq')
        ]);

        if (!coursesRes.ok || !faqsRes.ok) {
          throw new Error('Failed to fetch data from the server.');
        }

        const coursesData = await coursesRes.json();
        const faqsData = await faqsRes.json();

        setCourses(Array.isArray(coursesData) ? coursesData : []);
        setFaqs(Array.isArray(faqsData) ? faqsData : []);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('We hit a snag loading the courses. Please try again in a moment.');
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, []);

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-display font-bold text-gray-900 mb-6 tracking-tight"
        >
          Find Your Perfect Course
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-600 leading-relaxed"
        >
          Whether you're preparing for exams or just want to speak confidently, I have a program for you.
        </motion.p>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div>
          <p className="text-gray-500 font-medium">Loading programs...</p>
        </div>
      ) : error ? (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="bg-red-50 text-red-600 p-6 rounded-2xl flex items-center justify-center gap-3 max-w-2xl mx-auto border border-red-100"
        >
          <AlertCircle className="w-6 h-6" />
          <p className="font-medium">{error}</p>
        </motion.div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
          <p className="text-xl text-gray-600">No courses are currently available. Please check back soon!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.4, ease: "easeOut" }}
              className="group bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-brand-lavender text-brand-purple flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {i % 3 === 0 ? <BookOpen className="w-6 h-6" /> : i % 3 === 1 ? <Users className="w-6 h-6" /> : <Calendar className="w-6 h-6" />}
              </div>
              <h3 className="text-2xl font-display font-bold text-gray-900 mb-3 leading-tight">{course.title}</h3>
              <p className="text-sm font-semibold text-brand-purple mb-4 uppercase tracking-wider">For: {course.target_audience}</p>
              <p className="text-gray-600 mb-8 flex-grow leading-relaxed">{course.description}</p>
              
              <Link
                to={`/contact?service=${encodeURIComponent(course.title)}`}
                className="inline-flex justify-center items-center gap-2 bg-gray-900 text-white px-6 py-4 rounded-xl font-bold hover:bg-brand-purple transition-colors duration-300 w-full focus:ring-4 focus:ring-brand-purple/20 focus:outline-none"
              >
                Register Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {/* FAQ Section */}
      {!loading && !error && faqs.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-32 max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-display font-bold text-center mb-12 text-gray-900">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div 
                key={faq.id} 
                className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-colors duration-300 ${expandedFaq === faq.id ? 'border-brand-purple/30' : 'border-gray-100'}`}
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                  aria-expanded={expandedFaq === faq.id}
                  aria-controls={`faq-answer-${faq.id}`}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <HelpCircle className={`w-6 h-6 flex-shrink-0 transition-colors ${expandedFaq === faq.id ? 'text-brand-purple' : 'text-gray-400'}`} />
                    <h4 className="font-bold text-lg text-gray-900 pr-8 leading-snug">{faq.question}</h4>
                  </div>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${expandedFaq === faq.id ? 'rotate-180 text-brand-purple' : ''}`} 
                  />
                </button>
                <AnimatePresence>
                  {expandedFaq === faq.id && (
                    <motion.div
                      id={`faq-answer-${faq.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 text-gray-600 border-t border-gray-50 pt-4 ml-10 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
