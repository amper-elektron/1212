import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, BookOpen, Users, Calendar, CheckCircle2, X, Quote } from 'lucide-react';

/* ─── Fonts for themed sections ─── */
if (!document.querySelector('link[href*="Playfair+Display"]')) {
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap';
  document.head.appendChild(l);
}

const themedCss = `
  .section-label {
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: #C9A96E;
  }
  .dark-band {
    background: linear-gradient(135deg, #0a0a0f 0%, #12121f 50%, #0f0f1a 100%);
    position: relative; overflow: hidden;
  }
  .dark-band::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 70% 70% at 30% 60%, rgba(201,169,110,0.10) 0%, transparent 70%);
    pointer-events: none;
  }
  .why-item {
    display: flex; align-items: flex-start; gap: 14px;
    padding: 16px 0;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .why-item:last-child { border-bottom: none; }
  .btn-gold {
    background: #C9A96E; color: #1a1a2e;
    font-weight: 600; font-size: 0.95rem;
    padding: 14px 28px; border-radius: 12px;
    display: inline-flex; align-items: center; gap: 10px;
    text-decoration: none;
    transition: background 0.2s, gap 0.2s;
  }
  .btn-gold:hover { background: #e8c98a; gap: 14px; }
  .ink-underline-gold {
    position: relative; display: inline;
  }
  .ink-underline-gold::after {
    content: '';
    position: absolute; bottom: -2px; left: 0;
    width: 100%; height: 3px;
    background: #C9A96E;
  }
`;

interface Feedback {
  id: number;
  name: string;
  review: string;
  image_url: string;
  rating: number;
}

export default function Home() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/feedback')
      .then(res => res.json())
      .then(data => setFeedbacks(data));

    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data));
  }, []);

  return (
    <>
      <style>{themedCss}</style>
      <div className="overflow-hidden">

        {/* ── Hero Section — original ── */}
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
                <img
                  src={settings['home_image_1'] || "/home_photo1.png"}
                  alt="Asmar teaching"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent" />
              </div>

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

        {/* ── Services Preview — original ── */}
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

        {/* ── Why Me — NEW THEMED dark band ── */}
        <section className="dark-band py-24 relative z-10">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-16 items-center relative z-10">

            <div>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="h-px w-8 bg-[#C9A96E]" />
                <span className="section-label">Why choose me</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                className="font-display text-4xl sm:text-5xl font-black text-white leading-tight mb-6"
              >
                Not your typical<br />
                <em style={{ color: '#C9A96E' }}>English classes.</em>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-white/55 text-base leading-relaxed mb-8 max-w-md"
              >
                I believe learning a language should be engaging, practical, and fun. No more memorising endless grammar rules without context.
              </motion.p>

              <div>
                {[
                  'Interactive and modern teaching methods',
                  'Focus on real-life speaking and comprehension',
                  'Personalised feedback for every student',
                  'Friendly and supportive learning environment',
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 + i * 0.07 }}
                    className="why-item"
                  >
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#C9A96E' }} />
                    <span className="text-white/75 text-sm leading-relaxed">{item}</span>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="mt-10"
              >
                <Link to="/about" className="btn-gold">
                  More about me <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              className="relative"
            >
              <div
                className="aspect-square rounded-[2rem] overflow-hidden border border-white/10"
                style={{ rotate: '2deg', transition: 'rotate 0.5s' }}
                onMouseEnter={e => (e.currentTarget.style.rotate = '0deg')}
                onMouseLeave={e => (e.currentTarget.style.rotate = '2deg')}
              >
                <img
                  src={settings['home_image_2'] || '/uploads/home_photo2.png'}
                  alt="Teaching"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/40 to-transparent" />
              </div>
              <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full opacity-25 blur-3xl pointer-events-none" style={{ background: '#C9A96E' }} />
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: '#C9A96E' }} />
            </motion.div>
          </div>
        </section>

        {/* ── CTA — NEW THEMED ── */}
        <section className="py-28 relative z-10" style={{ background: 'linear-gradient(180deg, #f9f6f0 0%, #fdfbf7 100%)' }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center justify-center gap-3 mb-6"
            >
              <div className="h-px w-8 bg-[#C9A96E]" />
              <span className="section-label">Get Started</span>
              <div className="h-px w-8 bg-[#C9A96E]" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              className="font-display text-5xl sm:text-6xl font-black text-[#1a1a2e] leading-tight mb-5"
            >
              Ready to level up<br />
              <em style={{ color: '#C9A96E' }}>your English?</em>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-[#6b6b8a] text-lg mb-10 max-w-xl mx-auto leading-relaxed"
            >
              Join hundreds of successful students who have achieved their goals. Book your first lesson today.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
            >
              <Link to="/contact" className="btn-gold text-base px-10 py-4">
                Start Learning Now <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>

            {/* footer flourish */}
            <div className="flex items-center justify-center gap-4 mt-16">
              <div className="h-px w-20 bg-[#ece8e0]" />
              <span className="text-[#C9A96E] text-sm">✦</span>
              <div className="h-px w-20 bg-[#ece8e0]" />
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
