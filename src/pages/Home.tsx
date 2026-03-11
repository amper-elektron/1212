import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, BookOpen, Users, Calendar, CheckCircle2, X } from 'lucide-react';

interface Feedback {
  id: number;
  name: string;
  review: string;
  image_url: string;
  rating: number;
}

export default function Home() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({}); // YENİ EKLENDİ
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/feedback')
      .then(res => res.json())
      .then(data => setFeedbacks(data));

    // YENİ EKLENDİ: Resim ayarlarını veritabanından çek
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data));
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-brand-yellow/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-brand-purple/20 rounded-full blur-3xl opacity-50" />
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            
            <h1 className="text-5xl lg:text-7xl font-display font-bold text-gray-900 leading-[1.1] mb-6">
              Speak English with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-pink">
                Confidence.
              </span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
              Overcome your fear of speaking. Practical English lessons and conversation clubs with Asmar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/courses"
                className="inline-flex justify-center items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-brand-purple hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-brand-purple/20"
              >
                Join Speaking Club
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            
            <div className="mt-12 flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    src={`https://picsum.photos/seed/student${i}/100/100`}
                    alt="Student"
                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                    referrerPolicy="no-referrer"
                  />
                ))}
              </div>
              <div className="text-sm">
                <div className="flex items-center gap-1 text-brand-yellow">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="font-medium text-gray-900">100+ happy students</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative lg:ml-auto"
          >
            <div className="relative w-full max-w-md aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl">
              {/* YENİ EKLENDİ: Resim yolu dinamik yapıldı */}
              <img
                src={settings['home_image_1'] || "/home_photo1.png"}
                alt="Asmar teaching"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent" />
            </div>
            
            {/* Floating Badges */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4"
            >
              <div className="bg-brand-yellow/20 p-3 rounded-xl text-brand-yellow">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Experience</p>
                <p className="font-display font-bold text-gray-900 text-lg">10 Years</p>
              </div>
            </motion.div>
            
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-12 -right-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4"
            >
              <div className="bg-brand-blue/20 p-3 rounded-xl text-brand-blue">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Students</p>
                <p className="font-display font-bold text-gray-900 text-lg">100% Pass Rate</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 mb-6">
              How we can learn together
            </h2>
            <p className="text-lg text-gray-600">
              Choose the format that fits your goals and learning style.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Speaking Club',
                desc: 'Practice speaking in a friendly, relaxed environment with peers.',
                icon: Users,
                color: 'bg-brand-yellow',
                textColor: 'text-yellow-900'
              },
              {
                title: 'English Corner',
                desc: 'Interactive sessions focusing on practical vocabulary and everyday situations.',
                icon: BookOpen,
                color: 'bg-brand-purple',
                textColor: 'text-purple-900'
              },
              {
                title: 'Teacher Training',
                desc: 'Specialized program for aspiring English teachers to improve their methodology.',
                icon: Calendar,
                color: 'bg-brand-blue',
                textColor: 'text-blue-900'
              }
            ].map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative bg-gray-50 rounded-[2rem] p-8 hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100"
              >
                <div className={`w-14 h-14 rounded-2xl ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <service.icon className={`w-6 h-6 ${service.textColor}`} />
                </div>
                <h3 className="text-xl font-display font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.desc}</p>
                <Link to="/courses" className="inline-flex items-center font-bold text-gray-900 group-hover:text-brand-purple transition-colors">
                  Learn more <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Me Section */}
      <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://picsum.photos/seed/pattern/1920/1080')] opacity-5 mix-blend-overlay" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
                Not your typical <br/> English classes.
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                I believe learning a language should be engaging, practical, and fun. No more memorizing endless grammar rules without context.
              </p>
              <ul className="space-y-4">
                {[
                  'Interactive and modern teaching methods',
                  'Focus on real-life speaking and comprehension',
                  'Personalized feedback for every student',
                  'Friendly and supportive learning environment'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-brand-yellow flex-shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <Link to="/about" className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-brand-yellow transition-colors">
                  More about me
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-[3rem] overflow-hidden border-8 border-gray-800 rotate-3 hover:rotate-0 transition-transform duration-500">
                {/* YENİ EKLENDİ: Resim yolu dinamik yapıldı */}
                <img src={settings['home_image_2'] || "/uploads/home_photo2.png"} alt="Teaching" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-pink rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-pulse" />
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-purple rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-display font-bold text-gray-900 mb-6">
            Ready to level up your English?
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Join hundreds of successful students who have achieved their goals. Book your first lesson today.
          </p>
          <Link
            to="/contact"
            className="inline-flex justify-center items-center gap-2 bg-brand-yellow text-gray-900 px-10 py-5 rounded-2xl font-bold text-xl hover:scale-105 transition-transform shadow-xl shadow-brand-yellow/20"
          >
            Start Learning Now
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>
    </div>
  );
}
