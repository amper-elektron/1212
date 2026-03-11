import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { BookOpen, Users, Star, Award, CheckCircle2 } from 'lucide-react';

/* ─── Fonts — same as all pages ─── */
if (!document.querySelector('link[href*="Playfair+Display"]')) {
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap';
  document.head.appendChild(l);
}

const css = `
  .about-root * { font-family: 'DM Sans', sans-serif; }
  .about-root .font-display { font-family: 'Playfair Display', Georgia, serif; }

  .noise-overlay {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }

  .section-label {
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: #C9A96E;
  }

  .tag-pill {
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 2px;
    background: #f5f0e8;
    color: #8B6914;
    border: 1px solid #e8dfc8;
    display: inline-block;
  }

  /* Portrait frame */
  .portrait-frame {
    border-radius: 2rem;
    overflow: hidden;
    position: relative;
  }
  .portrait-frame img {
    transition: transform 0.6s cubic-bezier(0.23,1,0.32,1);
  }
  .portrait-frame:hover img { transform: scale(1.03); }

  /* Stat card */
  .stat-card {
    background: white;
    border: 1px solid #ece8e0;
    border-radius: 18px;
    padding: 24px;
    transition: transform 0.35s cubic-bezier(0.23,1,0.32,1), box-shadow 0.35s;
  }
  .stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(0,0,0,0.08);
  }

  /* Focus card */
  .focus-card {
    background: white;
    border: 1px solid #ece8e0;
    border-radius: 22px;
    padding: 32px 28px;
    transition: transform 0.4s cubic-bezier(0.23,1,0.32,1), box-shadow 0.4s, border-color 0.3s;
  }
  .focus-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 24px 48px rgba(0,0,0,0.10);
    border-color: #C9A96E;
  }
  .focus-icon {
    width: 52px; height: 52px;
    border-radius: 14px;
    background: #f5f0e8;
    border: 1px solid #e8dfc8;
    display: flex; align-items: center; justify-content: center;
    color: #C9A96E;
    margin-bottom: 18px;
    transition: background 0.3s;
  }
  .focus-card:hover .focus-icon { background: #fdf3d8; }

  /* Checklist row */
  .check-row {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 11px 0;
    border-bottom: 1px solid #f0ece4;
  }
  .check-row:last-child { border-bottom: none; }

  /* Dark band — same as Home & Courses */
  .dark-band {
    background: linear-gradient(135deg, #0a0a0f 0%, #12121f 50%, #0f0f1a 100%);
    position: relative; overflow: hidden;
  }
  .dark-band::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 60% 70% at 70% 40%, rgba(201,169,110,0.09) 0%, transparent 70%);
    pointer-events: none;
  }
`;

/* ─── Scroll reveal ─── */
function Reveal({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.23, 1, 0.32, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function About() {
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error(err));
  }, []);

  const facts = [
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

  const focusItems = [
    { Icon: Users,    title: 'Speaking practice',            desc: 'Engage in real-life conversations to improve your fluency and pronunciation.' },
    { Icon: BookOpen, title: 'Real-life conversation skills', desc: 'Learn useful expressions and vocabulary that you can apply in everyday situations.' },
    { Icon: Award,    title: 'Overcoming language barriers',  desc: 'Break down the walls that prevent you from expressing yourself clearly.' },
    { Icon: Star,     title: 'Building self-confidence',      desc: 'Overcome the fear of speaking English in a supportive and interactive environment.' },
  ];

  return (
    <>
      <style>{css}</style>
      <div
        className="about-root min-h-screen"
        style={{ background: 'linear-gradient(180deg, #f9f6f0 0%, #fdfbf7 40%, #f9f6f0 100%)' }}
      >
        <div className="noise-overlay" />

        {/* ── Page intro ── */}
        <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-24 pb-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-5"
          >
            <div className="h-px w-8 bg-[#C9A96E]" />
            <span className="section-label">The Teacher</span>
            <div className="h-px w-8 bg-[#C9A96E]" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
            className="font-display text-5xl sm:text-6xl font-black text-[#1a1a2e] leading-tight mb-3"
          >
            About <em style={{ color: '#C9A96E' }}>Asmar</em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="text-[#6b6b8a] text-lg max-w-lg mx-auto leading-relaxed"
          >
            A passionate English teacher dedicated to helping students speak with real confidence.
          </motion.p>
        </div>

        {/* ── Portrait + Bio ── */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16 grid lg:grid-cols-2 gap-16 items-start relative z-10">

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            className="relative"
          >
            <div className="portrait-frame aspect-[3/4] shadow-2xl">
              <img
                src={settings['about_image_1'] || '/about_photo1.png'}
                alt="Asmar Burjaliyeva"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e]/20 to-transparent" />
            </div>

            {/* Decorative blobs — same style as Home */}
            <div
              className="absolute -bottom-8 -right-8 w-48 h-48 rounded-full -z-10 opacity-60"
              style={{ background: '#f5f0e8', border: '1px solid #e8dfc8' }}
            />
            <div
              className="absolute -top-6 -left-6 w-28 h-28 rounded-full -z-10 opacity-40"
              style={{ background: '#C9A96E', filter: 'blur(32px)' }}
            />

            {/* Floating credential tag */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-4 -left-4 bg-[#fdfbf7] border border-[#ece8e0] rounded-2xl shadow-lg px-5 py-4 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-[#f5f0e8] border border-[#e8dfc8] flex items-center justify-center text-[#C9A96E]">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="section-label mb-0.5">Certified</p>
                <p className="font-display font-bold text-[#1a1a2e] text-base leading-none">TKT Teacher</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Bio */}
          <div>
            <Reveal>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-8 bg-[#C9A96E]" />
                <span className="section-label">Biography</span>
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <h2 className="font-display text-4xl font-black text-[#1a1a2e] leading-tight mb-2">
                Asmar Burjaliyeva
              </h2>
              <p className="font-display text-lg italic text-[#C9A96E] mb-7">
                English Language Teacher
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="border-t border-[#ece8e0]">
                {facts.map((fact, i) => (
                  <div key={i} className="check-row">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#C9A96E' }} />
                    <span className="text-[#3d3d5c] text-sm leading-relaxed">{fact}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Stats */}
            <Reveal delay={0.15} className="grid grid-cols-2 gap-4 mt-8">
              <div className="stat-card">
                <p className="font-display font-black text-4xl text-[#C9A96E] leading-none mb-1">10</p>
                <p className="section-label">Years Experience</p>
              </div>
              <div className="stat-card">
                <p className="font-display font-black text-4xl text-[#C9A96E] leading-none mb-1">100+</p>
                <p className="section-label">Trained Students</p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── divider ── */}
        <div className="flex items-center gap-4 max-w-6xl mx-auto px-5 sm:px-8 mb-0 relative z-10">
          <div className="flex-1 h-px bg-[#ece8e0]" />
          <span className="text-[#C9A96E] text-lg">✦</span>
          <div className="flex-1 h-px bg-[#ece8e0]" />
        </div>

        {/* ── Teaching Focus ── */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 py-20 relative z-10">
          <Reveal className="mb-4">
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-[#C9A96E]" />
              <span className="section-label">Teaching Focus</span>
            </div>
          </Reveal>
          <Reveal delay={0.05} className="mb-12">
            <h2 className="font-display text-4xl sm:text-5xl font-black text-[#1a1a2e] leading-tight max-w-lg">
              What I focus on<br /><em style={{ color: '#C9A96E' }}>in every lesson</em>
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {focusItems.map(({ Icon, title, desc }, i) => (
              <Reveal key={title} delay={i * 0.09}>
                <div className="focus-card h-full flex flex-col">
                  <div className="focus-icon"><Icon className="w-5 h-5" /></div>
                  <h3 className="font-display font-bold text-[#1a1a2e] text-lg mb-2 leading-snug">{title}</h3>
                  <p className="text-[#6b6b8a] text-sm leading-relaxed flex-grow">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Footer flourish ── */}
        <div className="flex items-center justify-center gap-4 pb-16 relative z-10">
          <div className="h-px w-20 bg-[#ece8e0]" />
          <span className="text-[#C9A96E] text-sm">✦</span>
          <div className="h-px w-20 bg-[#ece8e0]" />
        </div>

      </div>
    </>
  );
}
