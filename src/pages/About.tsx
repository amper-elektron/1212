import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Users, Star, Award, CheckCircle2 } from 'lucide-react';

/* ─── Fonts ─── */
if (!document.querySelector('link[href*="Playfair+Display"]')) {
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap';
  document.head.appendChild(l);
}

const css = `
  .about-root * { font-family: 'DM Sans', sans-serif; }
  .about-root .font-display { font-family: 'Playfair Display', Georgia, serif; }
  .about-root .text-brand-blue { color: #3A6BC4; }
  .about-root .bg-brand-blue-soft { background: #EEF3FB; }
`;

export default function About() {
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      <style>{css}</style>
      <div className="about-root py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <div className="aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl">
                <img
                  src={settings['about_image_1'] || "/about_photo1.png"}
                  alt="Asmar Burjaliyeva"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 w-48 h-48 rounded-full -z-10" style={{ background: '#CDDAF3' }} />
              <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full -z-10" style={{ background: '#3A6BC4', opacity: 0.25 }} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6" style={{ color: '#1E3A6E' }}>
              About the Teacher
            </h1>
            <h2 className="font-display text-2xl font-semibold mb-6" style={{ color: '#3A6BC4' }}>
              Asmar Burjaliyeva
            </h2>

            <div className="space-y-4 text-lg mb-8" style={{ color: '#4A5878' }}>
              <ul className="space-y-3">
                {[
                  'English language teacher',
                  'More than 10 years of teaching experience',
                  'Certified TKT English teacher',
                  'Specialized in speaking-focused English learning',
                  'Helps students build confidence in speaking English',
                  'Experienced in working with students of different levels',
                  'Conducts speaking practice sessions and conversation clubs',
                  'Focuses on practical English communication rather than only grammar',
                  'Helps students overcome fear of speaking English',
                  'Has trained hundreds of students'
                ].map((fact, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: '#3A6BC4' }} />
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-10">
              <div className="bg-white p-6 rounded-2xl shadow-sm border" style={{ borderColor: '#CDDAF3' }}>
                <h3 className="font-display font-bold text-3xl mb-2" style={{ color: '#3A6BC4' }}>10</h3>
                <p className="font-medium" style={{ color: '#4A5878' }}>Years Experience</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border" style={{ borderColor: '#CDDAF3' }}>
                <h3 className="font-display font-bold text-3xl mb-2" style={{ color: '#3A6BC4' }}>100+</h3>
                <p className="font-medium" style={{ color: '#4A5878' }}>Trained Students</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mb-24">
          <h2 className="font-display text-3xl font-bold text-center mb-12" style={{ color: '#1E3A6E' }}>Teaching Focus</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Users,
                title: "Speaking practice",
                desc: "Engage in real-life conversations to improve your fluency and pronunciation.",
                color: "#EEF3FB",
                border: "#CDDAF3"
              },
              {
                icon: BookOpen,
                title: "Real-life conversation skills",
                desc: "Learn useful expressions and vocabulary that you can apply in everyday situations.",
                color: "#E8F0FC",
                border: "#CDDAF3"
              },
              {
                icon: Award,
                title: "Overcoming language barriers",
                desc: "Break down the walls that prevent you from expressing yourself clearly.",
                color: "#DCE9FF",
                border: "#CDDAF3"
              },
              {
                icon: Star,
                title: "Building self-confidence",
                desc: "Overcome the fear of speaking English in a supportive and interactive learning environment.",
                color: "#EEF3FB",
                border: "#CDDAF3"
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-[2rem] shadow-sm border text-center"
                style={{ borderColor: item.border }}
              >
                <div
                  className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6"
                  style={{ background: item.color }}
                >
                  <item.icon className="w-8 h-8" style={{ color: '#3A6BC4' }} />
                </div>
                <h3 className="font-display text-xl font-bold mb-4" style={{ color: '#1E3A6E' }}>{item.title}</h3>
                <p style={{ color: '#4A5878' }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
