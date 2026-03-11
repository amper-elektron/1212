import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, BookOpen, Calendar, ChevronDown, HelpCircle } from 'lucide-react';

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
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/courses').then(res => res.json()),
      fetch('/api/faq').then(res => res.json())
    ])
      .then(([coursesData, faqsData]) => {
        if (Array.isArray(coursesData)) {
          setCourses(coursesData);
        } else {
          setCourses([]);
        }
        if (Array.isArray(faqsData)) {
          setFaqs(faqsData);
        } else {
          setFaqs([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch data:', err);
        setCourses([]);
        setFaqs([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-20">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-display font-bold text-gray-900 mb-6"
        >
          Find Your Perfect Course
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-600"
        >
          Whether you're preparing for exams or just want to speak confidently, I have a program for you.
        </motion.p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col hover:shadow-xl transition-shadow"
            >
              <div className="w-14 h-14 rounded-2xl bg-brand-lavender text-brand-purple flex items-center justify-center mb-6">
                {i % 3 === 0 ? <BookOpen className="w-6 h-6" /> : i % 3 === 1 ? <Users className="w-6 h-6" /> : <Calendar className="w-6 h-6" />}
              </div>
              <h3 className="text-2xl font-display font-bold text-gray-900 mb-3">{course.title}</h3>
              <p className="text-sm font-medium text-brand-purple mb-4">For: {course.target_audience}</p>
              <p className="text-gray-600 mb-8 flex-grow">{course.description}</p>
              
              <Link
                to={`/contact?service=${encodeURIComponent(course.title)}`}
                className="inline-flex justify-center items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-purple transition-colors w-full"
              >
                Register Now
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {/* FAQ Section */}
      {faqs.length > 0 && (
        <div className="mt-32 max-w-3xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div 
                key={faq.id} 
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-brand-purple flex-shrink-0" />
                    <h4 className="font-bold text-lg text-gray-900 pr-8">{faq.question}</h4>
                  </div>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${expandedFaq === faq.id ? 'rotate-180' : ''}`} 
                  />
                </button>
                <AnimatePresence>
                  {expandedFaq === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-5 text-gray-600 border-t border-gray-50 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
