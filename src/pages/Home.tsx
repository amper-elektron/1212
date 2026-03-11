import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Star, BookOpen, Users, Calendar,
  CheckCircle2, X, Quote,
} from 'lucide-react';

/* ─── Google Fonts — shared with Blog & Courses ─── */
if (!document.querySelector('link[href*="Playfair+Display"]')) {
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap';
  document.head.appendChild(l);
}

/* ─── Types ─── */
interface Feedback {
  id: number;
  name: string;
  review: string;
  image_url: string;
  rating: number;
}

/* ─── Shared CSS tokens ─── */
const css = `
  .home-root * { font-family: 'DM Sans', sans-serif; }
  .home-root .font-display { font-family: 'Playfair Display', Georgia, serif; }
  .home-root .font-mono  { font-family: 'DM Mono', monospace; }

  /* Noise — same as Blog & Courses */
  .noise-overlay {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }

  /* Section label — same mono uppercase gold */
  .section-label {
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: #C9A96E;
  }

  /* Tag pill — same as Blog */
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

  /* Card hover — same as Blog & Courses */
  .card-hover {
    transition: transform 0.4s cubic-bezier(0.23,1,0.32,1), box-shadow 0.4s ease;
  }
  .card-hover:hover {
    transform: translateY(-6px);
    box-shadow: 0 24px 48px rgba(0,0,0,0.12);
  }

  /* Dark hero band — same as Courses & Blog featured card */
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

  /* Hero image frame */
  .hero-frame {
    border-radius: 2rem;
    overflow: hidden;
    position: relative;
  }
  .hero-frame img { transition: transform 0.6s cubic-bezier(0.23,1,0.32,1); }
  .hero-frame:hover img { transform: scale(1.03); }

  /* Floating badge */
  .float-badge {
    background: #fdfbf7;
    border: 1px solid #ece8e0;
    border-radius: 14px;
    padding: 14px 18px;
    display: flex; align-items: center; gap: 14px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.10);
    position: absolute;
  }
  .float-badge-icon {
    width: 42px; height: 42px;
    border-radius: 10px;
    background: #f5f0e8;
    border: 1px solid #e8dfc8;
    display: flex; align-items: center; justify-content: center;
    color: #C9A96E;
    flex-shrink: 0;
  }

  /* Service card */
  .service-card {
    background: white;
    border: 1px solid #ece8e0;
    border-radius: 22px;
    padding: 32px;
    transition: transform 0.4s cubic-bezier(0.23,1,0.32,1), box-shadow 0.4s, border-color 0.3s;
  }
  .service-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 24px 48px rgba(0,0,0,0.10);
    border-color: #C9A96E;
  }
  .service-icon {
    width: 50px; height: 50px;
    border-radius: 14px;
    background: #f5f0e8;
    border: 1px solid #e8dfc8;
    display: flex; align-items: center; justify-content: center;
    color: #C9A96E;
    margin-bottom: 20px;
    transition: background 0.3s;
  }
  .service-card:hover .service-icon { background: #fdf3d8; }

  /* CTA primary btn */
  .btn-primary {
    background: #1a1a2e; color: #fff;
    font-weight: 600; font-size: 0.95rem;
    padding: 14px 28px; border-radius: 12px;
    display: inline-flex; align-items: center; gap: 10px;
    text-decoration: none;
    transition: background 0.2s, gap 0.2s;
  }
  .btn-primary:hover { background: #2a2a4e; gap: 14px; }

  /* CTA gold btn */
  .btn-gold {
    background: #C9A96E; color: #1a1a2e;
    font-weight: 600; font-size: 0.95rem;
    padding: 14px 28px; border-radius: 12px;
    display: inline-flex; align-items: center; gap: 10px;
    text-decoration: none;
    transition: background 0.2s, gap 0.2s;
  }
  .btn-gold:hover { background: #e8c98a; gap: 14px; }

  /* Review card */
  .review-card {
    background: white;
    border: 1px solid #ece8e0;
    border-radius: 20px;
    padding: 28px;
    transition: transform 0.35s cubic-bezier(0.23,1,0.32,1), box-shadow 0.35s;
  }
  .review-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(0,0,0,0.08);
  }

  /* Why list item */
  .why-item {
    display: flex; align-items: flex-start; gap: 14px;
    padding: 16px 0;
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .why-item:last-child { border-bottom: none; }

  /* Image lightbox */
  .lightbox-overlay {
    background: rgba(8,8,15,0.92);
    backdrop-filter: blur(16px);
  }

  /* Ink underline — same as Blog */
  .ink-underline {
    position: relative; display: inline;
  }
  .ink-underline::after {
    content: '';
    position: absolute; bottom: -2px; left: 0;
    width: 100%; height: 3px;
    background: #C9A96E;
  }
`;

/* ─── Avatar colour (same as Blog comments) ─── */
const avatarColor = (name: string) => {
  const colors = ['#C9A96E', '#7B9E87', '#B07BAC', '#6E8EC9', '#C96E7B'];
  return colors[name.charCodeAt(0) % colors.length];
};

/* ─── StarRating ─── */
function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`w-3.5 h-3.5 ${i <= n ? 'fill-[#C9A96E] text-[#C9A96E]' : 'text-[#e8dfc8]'}`} />
      ))}
    </div>
  );
}

/* ─── Section wrapper with scroll reveal ─── */
function Reveal({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.23, 1, 0.32, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Main ─── */
export default function Home() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/feedback').then(r => r.json()).then(setFeedbacks).catch(() => {});
    fetch('/api/settings').then(r => r.json()).then(setSettings).catch(() => {});
  }, []);

  return (
    <>
      <style>{css}</style>
      <div
        className="home-root overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #f9f6f0 0%, #fdfbf7 40%, #f9f6f0 100%)' }}
      >
        <div className="noise-overlay" />

        {/* ══════════════════════════════════════
            HERO
        ══════════════════════════════════════ */}
        <section className="relative pt-32 pb-24 px-5 sm:px-8 max-w-6xl mx-auto z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 mb-7"
              >
                <div className="h-px w-8 bg-[#C9A96E]" />
                <span className="section-label">English with Asmar</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                className="font-display text-6xl sm:text-7xl font-black text-[#1a1a2e] leading-[1.05] mb-6"
              >
                Speak English<br />
                with{' '}
                <span className="ink-underline" style={{ color: '#C9A96E', fontStyle: 'italic' }}>
                  Confidence
                </span>.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.6 }}
                className="text-[#6b6b8a] text-lg leading-relaxed max-w-md mb-10"
              >
                Overcome your fear of speaking. Practical English lessons and conversation clubs designed for real progress.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="flex flex-wrap gap-3 mb-12"
              >
                <Link to="/courses" className="btn-primary">
                  Join Speaking Club <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/about" className="btn-primary" style={{ background: 'white', color: '#1a1a2e', border: '1px solid #ece8e0' }}>
                  Meet Asmar
                </Link>
              </motion.div>

              {/* Social proof */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-4"
              >
                <div className="flex -space-x-2.5">
                  {[1,2,3,4].map(i => (
                    <img
                      key={i}
                      src={`https://picsum.photos/seed/st${i}/80/80`}
                      alt=""
                      className="w-9 h-9 rounded-full border-2 border-[#fdfbf7] object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-0.5">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#C9A96E] text-[#C9A96E]" />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-[#1a1a2e] font-mono">100+ happy students</span>
                </div>
              </motion.div>
            </div>

            {/* Right — image + floating badges */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="relative lg:ml-auto"
            >
              <div
                className="hero-frame w-full max-w-md aspect-[4/5] shadow-2xl cursor-zoom-in"
                onClick={() => setLightbox(settings['home_image_1'] || '/home_photo1.png')}
              >
                <img
                  src={settings['home_image_1'] || '/home_photo1.png'}
                  alt="Asmar teaching"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e]/30 to-transparent" />
              </div>

              {/* Badge: Experience */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="float-badge -bottom-5 -left-5"
              >
                <div className="float-badge-icon"><BookOpen className="w-5 h-5" /></div>
                <div>
                  <p className="section-label mb-0.5">Experience</p>
                  <p className="font-display font-bold text-[#1a1a2e] text-lg leading-none">10 Years</p>
                </div>
              </motion.div>

              {/* Badge: Pass Rate */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="float-badge top-10 -right-5"
              >
                <div className="float-badge-icon"><Users className="w-5 h-5" /></div>
                <div>
                  <p className="section-label mb-0.5">Students</p>
                  <p className="font-display font-bold text-[#1a1a2e] text-lg leading-none">100% Pass</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── divider ── */}
        <div className="flex items-center gap-4 max-w-6xl mx-auto px-5 sm:px-8 mb-0 relative z-10">
          <div className="flex-1 h-px bg-[#ece8e0]" />
          <span className="text-[#C9A96E] text-lg">✦</span>
          <div className="flex-1 h-px bg-[#ece8e0]" />
        </div>

        {/* ══════════════════════════════════════
            SERVICES
        ══════════════════════════════════════ */}
        <section className="py-24 relative z-10">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <Reveal className="mb-4">
              <div className="flex items-center gap-3">
                <div className="h-px w-8 bg-[#C9A96E]" />
                <span className="section-label">How we learn</span>
              </div>
            </Reveal>
            <Reveal delay={0.05} className="mb-12">
              <h2 className="font-display text-4xl sm:text-5xl font-black text-[#1a1a2e] leading-tight max-w-xl">
                Learning formats that fit <em>your</em> life
              </h2>
            </Reveal>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: 'Speaking Club',    desc: 'Practice speaking in a friendly, relaxed environment with peers.',                              Icon: Users },
                { title: 'English Corner',   desc: 'Interactive sessions focusing on practical vocabulary and everyday situations.',               Icon: BookOpen },
                { title: 'Teacher Training', desc: 'Specialised program for aspiring English teachers to improve their methodology.',              Icon: Calendar },
              ].map(({ title, desc, Icon }, i) => (
                <Reveal key={title} delay={i * 0.1}>
                  <div className="service-card h-full flex flex-col">
                    <div className="service-icon"><Icon className="w-5 h-5" /></div>
                    <h3 className="font-display text-xl font-bold text-[#1a1a2e] mb-3">{title}</h3>
                    <p className="text-[#6b6b8a] text-sm leading-relaxed flex-grow mb-6">{desc}</p>
                    <Link
                      to="/courses"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#1a1a2e] hover:text-[#C9A96E] transition-colors group"
                    >
                      Learn more <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            WHY ME — dark band (same as Blog hero)
        ══════════════════════════════════════ */}
        <section className="dark-band py-24 relative z-10">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-16 items-center relative z-10">

            {/* Left text */}
            <div>
              <Reveal>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px w-8 bg-[#C9A96E]" />
                  <span className="section-label">Why choose me</span>
                </div>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="font-display text-4xl sm:text-5xl font-black text-white leading-tight mb-6">
                  Not your typical<br />
                  <em style={{ color: '#C9A96E' }}>English classes.</em>
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="text-white/55 text-base leading-relaxed mb-8 max-w-md">
                  I believe learning a language should be engaging, practical, and fun. No more memorising endless grammar rules without context.
                </p>
              </Reveal>

              <div>
                {[
                  'Interactive and modern teaching methods',
                  'Focus on real-life speaking and comprehension',
                  'Personalised feedback for every student',
                  'Friendly and supportive learning environment',
                ].map((item, i) => (
                  <Reveal key={i} delay={0.12 + i * 0.07}>
                    <div className="why-item">
                      <CheckCircle2 className="w-5 h-5 text-[#C9A96E] flex-shrink-0 mt-0.5" />
                      <span className="text-white/75 text-sm leading-relaxed">{item}</span>
                    </div>
                  </Reveal>
                ))}
              </div>

              <Reveal delay={0.4}>
                <div className="mt-10">
                  <Link to="/about" className="btn-gold">
                    More about me <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </Reveal>
            </div>

            {/* Right — image */}
            <Reveal delay={0.15} className="relative">
              <div
                className="aspect-square rounded-[2rem] overflow-hidden border border-white/10 cursor-zoom-in"
                onClick={() => setLightbox(settings['home_image_2'] || '/uploads/home_photo2.png')}
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
              {/* Glow blobs */}
              <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full opacity-30 blur-3xl" style={{ background: '#C9A96E' }} />
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20 blur-3xl" style={{ background: '#C9A96E' }} />
            </Reveal>
          </div>
        </section>

        {/* ══════════════════════════════════════
            REVIEWS
        ══════════════════════════════════════ */}
        {feedbacks.length > 0 && (
          <section className="py-24 relative z-10">
            <div className="max-w-6xl mx-auto px-5 sm:px-8">
              <Reveal className="mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-px w-8 bg-[#C9A96E]" />
                  <span className="section-label">Student Reviews</span>
                </div>
              </Reveal>
              <Reveal delay={0.05} className="mb-12">
                <h2 className="font-display text-4xl sm:text-5xl font-black text-[#1a1a2e] leading-tight">
                  Words from the <em style={{ color: '#C9A96E' }}>classroom</em>
                </h2>
              </Reveal>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {feedbacks.map((fb, i) => (
                  <Reveal key={fb.id} delay={i * 0.08}>
                    <div className="review-card h-full flex flex-col">
                      <div className="flex items-start justify-between mb-4">
                        <Quote className="w-8 h-8 text-[#e8dfc8]" />
                        <Stars n={fb.rating} />
                      </div>
                      <p className="text-[#3d3d5c] text-sm leading-relaxed flex-grow mb-6 italic font-display">
                        "{fb.review}"
                      </p>
                      <div className="flex items-center gap-3 pt-4 border-t border-[#ece8e0]">
                        {fb.image_url ? (
                          <img
                            src={fb.image_url}
                            alt={fb.name}
                            className="w-9 h-9 rounded-full object-cover border border-[#e8dfc8]"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold uppercase"
                            style={{ background: avatarColor(fb.name) }}
                          >
                            {fb.name.charAt(0)}
                          </div>
                        )}
                        <span className="font-semibold text-[#1a1a2e] text-sm">{fb.name}</span>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── divider ── */}
        <div className="flex items-center gap-4 max-w-6xl mx-auto px-5 sm:px-8 mb-0 relative z-10">
          <div className="flex-1 h-px bg-[#ece8e0]" />
          <span className="text-[#C9A96E] text-lg">✦</span>
          <div className="flex-1 h-px bg-[#ece8e0]" />
        </div>

        {/* ══════════════════════════════════════
            CTA
        ══════════════════════════════════════ */}
        <section className="py-28 relative z-10">
          <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
            <Reveal>
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-8 bg-[#C9A96E]" />
                <span className="section-label">Get Started</span>
                <div className="h-px w-8 bg-[#C9A96E]" />
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-display text-5xl sm:text-6xl font-black text-[#1a1a2e] leading-tight mb-5">
                Ready to level up<br />
                <em style={{ color: '#C9A96E' }}>your English?</em>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-[#6b6b8a] text-lg mb-10 max-w-xl mx-auto leading-relaxed">
                Join hundreds of successful students who have achieved their goals. Book your first lesson today.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <Link to="/contact" className="btn-gold text-base px-10 py-4">
                Start Learning Now <ArrowRight className="w-5 h-5" />
              </Link>
            </Reveal>
          </div>
        </section>

        {/* Footer flourish */}
        <div className="flex items-center justify-center gap-4 pb-12 relative z-10">
          <div className="h-px w-20 bg-[#ece8e0]" />
          <span className="text-[#C9A96E] text-sm">✦</span>
          <div className="h-px w-20 bg-[#ece8e0]" />
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightbox && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setLightbox(null)}
          style={{ background: 'rgba(8,8,15,0.92)', backdropFilter: 'blur(16px)' }}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-5 right-5 w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <motion.img
            src={lightbox}
            alt=""
            className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            referrerPolicy="no-referrer"
            onClick={e => e.stopPropagation()}
          />
        </motion.div>
      )}
    </>
  );
}
