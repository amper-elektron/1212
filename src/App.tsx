import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, BookOpen, Users, Calendar, CheckCircle2 } from 'lucide-react';

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
`;

interface Feedback {
  id: number;
  name: string;
  review: string;
  image_url: string;
  rating: number;
}

// Resim genişliğini 600px yaparak mobildeki yükü daha da azalttık
const optimizeImage = (url: string) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  if (url.includes('q_auto')) return url;
  return url.replace('/upload/', '/upload/q_auto:eco,f_auto,w_600/');
};

export default function Home() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  
  useEffect(() => {
    document.title = "Ana Səhifə | English with Asmar | Əsmər Bürcəliyeva";
  }, []);
  
  useEffect(() => {
    Promise.all([
      fetch('/api/feedback').then(res => res.json()),
      fetch('/api/settings').then(res => res.json())
    ]).then(([f, s]) => {
      setFeedbacks(f);
      setSettings(s);
    }).catch(() => {});
  }, []);

  return (
    <>
      <style>{themedCss}</style>
      <div className="overflow-hidden">

        {/* ── Hero Section ── */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-brand-yellow/20 rounded-full blur-3xl opacity-50" />
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Animasyon kaldırıldı: Yazı anında görünür hale geldi (Performans için kritik) */}
            <div>
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
                  className="inline-flex justify-center items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-brand-purple transition-all shadow-xl shadow-brand-purple/20"
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
                      src={`https://fastly.picsum.photos/seed/student${i}/100/100`}
                      alt="Student"
                      width="40" height="40"
                      className="w-10 h-10 rounded-full border-2 border-white object-cover"
                    />
                  ))}
                </div>
                <div className="text-sm">
                  <div className="flex items-center gap-1 text-brand-yellow">
                    {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <span className="font-medium text-gray-900">100+ happy students</span>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="relative lg:ml-auto"
            >
              <div className="relative w-full max-w-md aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl">
                <img
                  src={optimizeImage(settings['home_image_1'] || "/home_photo1.png")}
                  alt="Asmar teaching"
                  width="448" height="560"
                  fetchPriority="high"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* ... Diğer bölümler aynı kalabilir ... */}
      </div>
    </>
  );
}
