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

/* ─── Blue accent palette ─────────────────────────
   Primary blue  : #3A6BC4
   Light blue bg : #EEF3FB
   Border blue   : #CDDAF3
   Text blue     : #1E3A6E  (dark navy for large type)
   Muted body    : #4A5878
──────────────────────────────────────────────────── */
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
    color: #3A6BC4;
  }

  .tag-pill {
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 2px;
    background: #EEF3FB;
    color: #2A5BAE;
    border: 1px solid #CDDAF3;
    display: inline-block;
  }

  /* Portrait */
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
    border: 1px solid #CDDAF3;
    border-radius: 18px;
    padding: 24px;
    transition: transform 0.35s cubic-bezier(0.23,1,0.32,1), box-shadow 0.35s;
  }
  .stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(58,107,196,0.10);
  }

  /* Focus card */
  .focus-card {
    background: white;
    border: 1px solid #e4eaf4;
    border-radius: 22px;
    padding: 32px 28px;
    transition: transform 0.4s cubic-bezier(0.23,1,0.32,1), box-shadow 0.4s, border-color 0.3s;
  }
  .focus-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 24px 48px rgba(58,107,196,0.12);
    border-color: #3A6BC4;
  }
  .focus-icon {
    width: 52px; height: 52px;
    border-radius: 14px;
    background: #EEF3FB;
    border: 1px solid #CDDAF3;
    display: flex; align-items: center; justify-content: center;
    color: #3A6BC4;
    margin-bottom: 18px;
    transition: background 0.3s;
  }
  .focus-card:hover .focus-icon { background: #dce9ff; }

  /* Checklist row */
  .check-row {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 11px 0;
    border-bottom: 1px solid #eef1f7;
  }
  .check-row:last-child { border-bottom: none; }

  /* Dark hero band — navy-tinted to complement blue */
  .dark-band {
    background: linear-gradient(135deg, #07091a 0%, #0e1530 50%, #080c20 100%);
    position: relative; overflow: hidden;
  }
  .dark-band::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 60% 70% at 70% 40%, rgba(58,107,196,0.15) 0%, transparent 70%);
    pointer-events: none;
  }

  /* Floating badge */
  .float-badge {
    background: #fdfcff;
    border: 1px solid #CDDAF3;
    border-radius: 14px;
    padding: 14px 18px;
    display: flex; align-items: center; gap: 14px;
    box-shadow: 0 8px 32px rgba(58,107,196,0.12);
    position: absolute;
  }
  .float-badge-icon {
    width: 42px; height: 42px;
    border-radius: 10px;
    background: #EEF3FB;
    border: 1px solid #CDDAF3;
    display: flex; align-items: center; justify-content: center;
    color: #3A6BC4;
    flex-shrink: 0;
  }

  /* Divider line */
  .divider-line { background: #dce6f5; }
  .divider-star { color: #3A6BC4; }
`;

/* ─── Scroll reveal (same as Courses & Blog) ─── */
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
    { Icon: Users,    title: 'Speaking Practice',            desc: 'Engage in real-life conversations to improve your fluency and pronunciation.' },
    { Icon: BookOpen, title: 'Real-life Conversation Skills', desc: 'Learn useful expressions and vocabulary that you can apply in everyday situations.' },
    { Icon: Award,    title: 'Overcoming Language Barriers',  desc: 'Break down the walls that prevent you from expressing yourself clearly.' },
    { Icon: Star,     title: 'Building Self-confidence',      desc: 'Overcome the fear of speaking English in a supportive and interactive environment.' },
  ];

  return (
    <>
      <style>{css}</style>
      <div
        className="about-root min-h-screen"
        style={{ background: 'linear-gradient(180deg, #f4f7fd 0%, #fafcff 40%, #f4f7fd 100%)' }}
      >
        <div className="noise-overlay" />

        {/* ── Page intro ── */}
        <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-24 pb-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-5"
          >
            <div className="h-px w-8 divider-line" style={{ height: '1px', background: '#3A6BC4' }} />
            <span className="section-label">The Teacher</span>
            <div className="h-px w-8" style={{ height: '1px', background: '#3A6BC4' }} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
            className="font-display text-5xl sm:text-6xl font-black leading-tight mb-3"
            style={{ color: '#1E3A6E' }}
          >
            About{' '}
            <em style={{ color: '#3A6BC4' }}>Asmar</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            style={{ color: '#4A5878' }}
            className="text-lg max-w-lg mx-auto leading-relaxed"
          >
            A passionate English teacher dedicated to helping students speak with real confidence.
          </motion.p>
        </div>

        {/* ── Portrait + Bio ── */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16 grid lg:grid-cols-2 gap-16 items-start relative z-10">

          {/* Image column */}
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
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A6E]/25 to-transparent" />
            </div>

            {/* Decorative shape */}
            <div
              className="absolute -bottom-8 -right-8 w-48 h-48 rounded-full -z-10"
              style={{ background: '#EEF3FB', border: '1px solid #CDDAF3' }}
            />
            <div
              className="absolute -top-6 -left-6 w-28 h-28 rounded-full -z-10 opacity-30"
              style={{ background: '#3A6BC4', filter: 'blur(32px)' }}
            />

            {/* Floating TKT badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="float-badge -bottom-4 -left-4"
            >
              <div className="float-badge-icon">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="section-label mb-0.5">Certified</p>
                <p className="font-display font-bold text-base leading-none" style={{ color: '#1E3A6E' }}>TKT Teacher</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Bio column */}
          <div>
            <Reveal>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-8" style={{ background: '#3A6BC4' }} />
                <span className="section-label">Biography</span>
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <h2 className="font-display text-4xl font-black leading-tight mb-1" style={{ color: '#1E3A6E' }}>
                Asmar Burjaliyeva
              </h2>
              <p className="font-display text-lg italic mb-7" style={{ color: '#3A6BC4' }}>
                English Language Teacher
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <div style={{ borderTop: '1px solid #dce6f5' }}>
                {facts.map((fact, i) => (
                  <div key={i} className="check-row">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#3A6BC4' }} />
                    <span className="text-sm leading-relaxed" style={{ color: '#374060' }}>{fact}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Stats */}
            <Reveal delay={0.15} className="grid grid-cols-2 gap-4 mt-8">
              <div className="stat-card">
                <p className="font-display font-black text-4xl leading-none mb-1" style={{ color: '#3A6BC4' }}>10</p>
                <p className="section-label">Years Experience</p>
              </div>
              <div className="stat-card">
                <p className="font-display font-black text-4xl leading-none mb-1" style={{ color: '#3A6BC4' }}>100+</p>
                <p className="section-label">Trained Students</p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="flex items-center gap-4 max-w-6xl mx-auto px-5 sm:px-8 mb-0 relative z-10">
          <div className="flex-1 h-px" style={{ background: '#dce6f5' }} />
          <span className="text-lg divider-star" style={{ color: '#3A6BC4' }}>✦</span>
          <div className="flex-1 h-px" style={{ background: '#dce6f5' }} />
        </div>

        {/* ── Teaching Focus ── */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 py-20 relative z-10">
          <Reveal className="mb-4">
            <div className="flex items-center gap-3">
              <div className="h-px w-8" style={{ background: '#3A6BC4' }} />
              <span className="section-label">Teaching Focus</span>
            </div>
          </Reveal>

          <Reveal delay={0.05} className="mb-12">
            <h2 className="font-display text-4xl sm:text-5xl font-black leading-tight max-w-lg" style={{ color: '#1E3A6E' }}>
              What I focus on<br />
              <em style={{ color: '#3A6BC4' }}>in every lesson</em>
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {focusItems.map(({ Icon, title, desc }, i) => (
              <Reveal key={title} delay={i * 0.09}>
                <div className="focus-card h-full flex flex-col">
                  <div className="focus-icon"><Icon className="w-5 h-5" /></div>
                  <h3 className="font-display font-bold text-lg mb-2 leading-snug" style={{ color: '#1E3A6E' }}>{title}</h3>
                  <p className="text-sm leading-relaxed flex-grow" style={{ color: '#4A5878' }}>{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Footer flourish ── */}
        <div className="flex items-center justify-center gap-4 pb-16 relative z-10">
          <div className="h-px w-20" style={{ background: '#dce6f5' }} />
          <span className="text-sm" style={{ color: '#3A6BC4' }}>✦</span>
          <div className="h-px w-20" style={{ background: '#dce6f5' }} />
        </div>

      </div>
    </>
  );
}
