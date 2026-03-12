import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Users, Star, Award, CheckCircle2 } from 'lucide-react';

// --- DATA CONSTANTS (Extracted for better architecture) ---
const TEACHER_FACTS = [
  'English language teacher',
  'More than 10 years of teaching experience',
  'Certified TKT English teacher',
  'Specialized in speaking-focused English learning',
  'Helps students build confidence in speaking English',
  'Experienced in working with students of different levels',
  'Conducts speaking practice sessions and conversation clubs',
  'Focuses on practical English communication rather than only grammar',
  'Helps students overcome fear of speaking English',
  'Has trained hundreds of students',
];

const TEACHING_FOCUS = [
  {
    icon: Users,
    title: 'Speaking practice',
    desc: 'Engage in real-life conversations to improve your fluency and pronunciation.',
    color: 'bg-brand-pink',
  },
  {
    icon: BookOpen,
    title: 'Real-life conversation skills',
    desc: 'Learn useful expressions and vocabulary that you can apply in everyday situations.',
    color: 'bg-brand-yellow',
  },
  {
    icon: Award,
    title: 'Overcoming language barriers',
    desc: 'Break down the walls that prevent you from expressing yourself clearly.',
    color: 'bg-brand-purple',
  },
  {
    icon: Star,
    title: 'Building self-confidence',
    desc: 'Overcome the fear of speaking English in a supportive and interactive learning environment.',
    color: 'bg-brand-blue',
  },
];

const STATS = [
  { value: '10', label: 'Years Experience', color: 'text-brand-purple' },
  { value: '100+', label: 'Trained Students', color: 'text-brand-yellow' },
];

// --- ANIMATION VARIANTS ---
const listContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const listItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

export default function About() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  
 useEffect(() => {
    document.title = "Haqqımda | Əsmər Bürcəliyeva | English Teacher";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", "Əsmər Bürcəliyeva - 10 ildən artıq təcrübəyə malik sertifikatlı ingilis dili müəllimi.");
  }, []);
  
  useEffect(() => {
    fetch('/api/settings')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch settings');
        return res.json();
      })
      .then((data) => setSettings(data))
      .catch((err) => {
        console.error('Error fetching settings:', err);
        setError(true);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* HERO SECTION */}
      <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
        {/* Left Column: Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            <div className="aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl bg-gray-100">
              {isLoading ? (
                <div className="w-full h-full animate-pulse bg-gray-200" />
              ) : (
                <img
                  src={settings['about_image_1'] || '/about_photo1.png'}
                  alt="Asmar Burjaliyeva - English Teacher"
                  className="w-full h-full object-cover transition-opacity duration-500"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>
            {/* Decorative Elements */}
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-brand-yellow rounded-full -z-10" />
            <div className="absolute -top-8 -left-8 w-32 h-32 bg-brand-purple rounded-full -z-10 opacity-50" />
          </div>
        </motion.div>

        {/* Right Column: Bio & Facts */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <header className="mb-6">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-2">
              About the Teacher
            </h1>
            <h2 className="text-2xl font-display font-semibold text-brand-purple">
              Asmar Burjaliyeva
            </h2>
          </header>

          <div className="space-y-4 text-lg text-gray-600 mb-8">
            <motion.ul
              variants={listContainerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {TEACHER_FACTS.map((fact, i) => (
                <motion.li key={i} variants={listItemVariants} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-brand-yellow flex-shrink-0 mt-0.5" />
                  <span>{fact}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-10">
            {STATS.map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className={`font-display font-bold text-3xl mb-2 ${stat.color}`}>
                  {stat.value}
                </h3>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* TEACHING FOCUS SECTION */}
      <section className="mb-24">
        <h2 className="text-3xl font-display font-bold text-center mb-12">Teaching Focus</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {TEACHING_FOCUS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 text-center flex flex-col items-center"
              >
                <div className={`w-16 h-16 rounded-full ${item.color} flex items-center justify-center mb-6`}>
                  <Icon className="w-8 h-8 text-gray-900" />
                </div>
                <h3 className="text-xl font-bold font-display mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
