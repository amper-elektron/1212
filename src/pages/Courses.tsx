import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, BookOpen, Calendar, Plus, Minus, Zap, Target, Star } from 'lucide-react';

/* ─── Google Fonts ─── */
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href =
  'https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Bebas+Neue&display=swap';
document.head.appendChild(fontLink);

/* ─── Types ─── */
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

/* ─── Styles ─── */
const css = `
  .courses-root { font-family: 'Instrument Sans', sans-serif; }
  .font-syne { font-family: 'Syne', sans-serif; }
  .font-bebas { font-family: 'Bebas Neue', cursive; letter-spacing: 0.04em; }

  :root {
    --ink: #0b0b10;
    --ink-soft: #16161f;
    --teal: #00e5c8;
    --teal-dim: rgba(0,229,200,0.12);
    --amber: #f5a623;
    --text: #e8e6f0;
    --muted: #7a7890;
    --border: rgba(255,255,255,0.07);
    --card-bg: #111118;
  }

  /* Scrollbar */
  .courses-root ::-webkit-scrollbar { width: 4px; }
  .courses-root ::-webkit-scrollbar-track { background: transparent; }
  .courses-root ::-webkit-scrollbar-thumb { background: var(--teal); border-radius: 2px; }

  /* Hero marquee */
  .marquee-track {
    display: flex;
    gap: 0;
    animation: marquee 18s linear infinite;
    white-space: nowrap;
  }
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  /* Course cards */
  .course-card {
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: 4px;
    position: relative;
    overflow: hidden;
    transition: border-color 0.3s, transform 0.4s cubic-bezier(0.23,1,0.32,1);
  }
  .course-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, var(--teal-dim) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.4s;
  }
  .course-card:hover {
    border-color: var(--teal);
    transform: translateY(-4px);
  }
  .course-card:hover::before { opacity: 1; }

  .course-number {
    font-family: 'Bebas Neue', cursive;
    font-size: 6rem;
    line-height: 1;
    color: rgba(255,255,255,0.04);
    position: absolute;
    top: 1rem; right: 1.5rem;
    letter-spacing: 0.04em;
    user-select: none;
    transition: color 0.4s;
  }
  .course-card:hover .course-number { color: rgba(0,229,200,0.08); }

  .icon-wrap {
    width: 48px; height: 48px;
    border: 1px solid var(--border);
    border-radius: 3px;
    display: flex; align-items: center; justify-content: center;
    color: var(--teal);
    transition: background 0.3s, border-color 0.3s;
    flex-shrink: 0;
  }
  .course-card:hover .icon-wrap {
    background: var(--teal-dim);
    border-color: var(--teal);
  }

  .badge {
    font-family: 'Syne', sans-serif;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    padding: 3px 10px;
    border-radius: 2px;
    background: rgba(0,229,200,0.1);
    color: var(--teal);
    border: 1px solid rgba(0,229,200,0.25);
  }

  .cta-btn {
    background: var(--teal);
    color: var(--ink);
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 0.85rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 12px 24px;
    border-radius: 3px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: background 0.2s, gap 0.2s, box-shadow 0.2s;
    text-decoration: none;
  }
  .cta-btn:hover {
    background: #00ffd9;
    gap: 12px;
    box-shadow: 0 0 24px rgba(0,229,200,0.3);
  }

  /* FAQ */
  .faq-item {
    border-bottom: 1px solid var(--border);
    overflow: hidden;
  }
  .faq-trigger {
    width: 100%;
    padding: 24px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    cursor: pointer;
    background: transparent;
    border: none;
    text-align: left;
    color: var(--text);
    transition: color 0.2s;
  }
  .faq-trigger:hover { color: var(--teal); }
  .faq-icon {
    width: 28px; height: 28px;
    border: 1px solid var(--border);
    border-radius: 2px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    color: var(--teal);
    transition: background 0.2s, border-color 0.2s;
  }
  .faq-trigger:hover .faq-icon,
  .faq-open .faq-icon {
    background: var(--teal-dim);
    border-color: var(--teal);
  }
  .faq-answer {
    color: var(--muted);
    font-size: 0.95rem;
    line-height: 1.8;
    padding-bottom: 24px;
    padding-right: 44px;
  }

  /* Stats bar */
  .stat-item {
    display: flex; flex-direction: column; align-items: center;
    gap: 4px;
    padding: 20px 32px;
    border-right: 1px solid var(--border);
  }
  .stat-item:last-child { border-right: none; }

  /* Grid line decoration */
  .grid-lines {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(to right, rgba(255,255,255,0.025) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.025) 1px, transparent 1px);
    background-size: 80px 80px;
    pointer-events: none;
  }

  /* Glow orb */
  .orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
  }

  /* Divider */
  .section-label {
    font-family: 'Syne', sans-serif;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--teal);
  }
`;

/* ─── AnimatedNumber ─── */
function AnimatedNumber({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / 40;
    const t = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(t); }
      else setVal(Math.floor(start));
    }, 30);
    return () => clearInterval(t);
  }, [inView, target]);

  return <span ref={ref}>{val}{suffix}</span>;
}

/* ─── CourseCard ─── */
const ICONS = [BookOpen, Users, Calendar, Target, Star, Zap];

function CourseCard({ course, index }: { course: Course; index: number }) {
  const Icon = ICONS[index % ICONS.length];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
      className="course-card flex flex-col p-8 h-full"
    >
      <span className="course-number">{String(index + 1).padStart(2, '0')}</span>

      <div className="relative z-10 flex flex-col h-full gap-5">
        <div className="flex items-start justify-between">
          <div className="icon-wrap">
            <Icon className="w-5 h-5" />
          </div>
          {!course.active && (
            <span className="badge" style={{ color: '#f5a623', background: 'rgba(245,166,35,0.1)', borderColor: 'rgba(245,166,35,0.25)' }}>
              Coming Soon
            </span>
          )}
          {course.active && <span className="badge">Open</span>}
        </div>

        <div>
          <p className="section-label mb-2">{course.target_audience}</p>
          <h3 className="font-syne text-xl font-bold text-[#e8e6f0] leading-tight">{course.title}</h3>
        </div>

        <p className="text-[#7a7890] text-sm leading-relaxed flex-grow">{course.description}</p>

        <Link
          to={`/contact?service=${encodeURIComponent(course.title)}`}
          className="cta-btn mt-2 self-start"
        >
          Register <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </motion.div>
  );
}

/* ─── FAQItem ─── */
function FAQItem({ faq, index, open, onToggle }: {
  faq: FAQ; index: number; open: boolean; onToggle: () => void;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -16 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.07, duration: 0.5 }}
      className={`faq-item ${open ? 'faq-open' : ''}`}
    >
      <button className="faq-trigger" onClick={onToggle}>
        <span className="font-syne font-600 text-base sm:text-lg" style={{ fontWeight: 600 }}>
          {faq.question}
        </span>
        <div className="faq-icon">
          {open ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
          >
            <p className="faq-answer">{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Main ─── */
export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/courses').then(r => r.json()),
      fetch('/api/faq').then(r => r.json()),
    ])
      .then(([c, f]) => {
        setCourses(Array.isArray(c) ? c : []);
        setFaqs(Array.isArray(f) ? f : []);
        setLoading(false);
      })
      .catch(() => {
        setCourses([]); setFaqs([]); setLoading(false);
      });
  }, []);

  const marqueeParts = ['Master English', '·', 'Speak Freely', '·', 'Learn Smarter', '·', 'Build Confidence', '·'];
  const marqueeText = [...marqueeParts, ...marqueeParts].join('  ');

  return (
    <>
      <style>{css}</style>
      <div className="courses-root min-h-screen" style={{ background: 'var(--ink)' }}>

        {/* ── HERO ── */}
        <section className="relative overflow-hidden pt-24 pb-16">
          <div className="grid-lines" />
          {/* Orbs */}
          <div className="orb w-96 h-96 top-[-6rem] left-[-4rem]" style={{ background: 'rgba(0,229,200,0.07)' }} />
          <div className="orb w-72 h-72 top-20 right-[-2rem]" style={{ background: 'rgba(245,166,35,0.06)' }} />

          <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-7"
            >
              <div className="h-px w-8 bg-[#00e5c8]" />
              <span className="section-label">Curriculum</span>
            </motion.div>

            <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-end">
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                  className="font-bebas text-[clamp(4rem,12vw,9rem)] text-[#e8e6f0] leading-none mb-4"
                  style={{ letterSpacing: '0.02em' }}
                >
                  Find Your<br />
                  <span style={{ color: 'var(--teal)' }}>Perfect</span> Course
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.6 }}
                  className="text-[#7a7890] text-lg max-w-md leading-relaxed"
                >
                  Whether you're preparing for exams or want to speak confidently — there's a program built exactly for you.
                </motion.p>
              </div>

              {/* Stats block */}
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25, duration: 0.6 }}
                className="hidden lg:flex border border-[rgba(255,255,255,0.07)] rounded-sm"
                style={{ background: 'var(--card-bg)' }}
              >
                {[
                  { val: 500, suffix: '+', label: 'Students' },
                  { val: 98, suffix: '%', label: 'Satisfaction' },
                  { val: 6, suffix: '', label: 'Programs' },
                ].map((s, i) => (
                  <div key={i} className="stat-item">
                    <span className="font-bebas text-4xl" style={{ color: 'var(--teal)', letterSpacing: '0.04em' }}>
                      <AnimatedNumber target={s.val} suffix={s.suffix} />
                    </span>
                    <span className="section-label" style={{ color: 'var(--muted)' }}>{s.label}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Marquee */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-14 overflow-hidden border-y"
            style={{ borderColor: 'var(--border)', borderTopColor: 'var(--border)' }}
          >
            <div
              className="marquee-track py-3"
              style={{ background: 'rgba(0,229,200,0.04)' }}
            >
              {marqueeText.split('  ').map((chunk, i) => (
                <span key={i} className="font-bebas text-2xl px-6" style={{ color: i % 2 === 0 ? 'rgba(232,230,240,0.5)' : 'var(--teal)' }}>
                  {chunk}
                </span>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── COURSES ── */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 py-20">
          <div className="flex items-center gap-4 mb-12">
            <span className="section-label">Programs</span>
            <div className="flex-1 h-px bg-[rgba(255,255,255,0.07)]" />
            {!loading && (
              <span className="font-bebas text-xl text-[#7a7890]">
                {courses.length} Courses
              </span>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-6">
              <div
                className="w-12 h-12 rounded-sm border border-[rgba(0,229,200,0.3)] border-t-[#00e5c8] animate-spin"
                style={{ borderRadius: '3px' }}
              />
              <p className="section-label" style={{ color: 'var(--muted)' }}>Loading programs…</p>
            </div>
          ) : courses.length === 0 ? (
            <div
              className="text-center py-24 rounded-sm border"
              style={{ borderColor: 'var(--border)', background: 'var(--card-bg)' }}
            >
              <p className="font-bebas text-5xl mb-3" style={{ color: 'var(--teal)' }}>?</p>
              <p className="font-syne font-bold text-xl text-[#e8e6f0] mb-2">No courses yet</p>
              <p className="text-[#7a7890]">Check back soon.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {courses.map((course, i) => (
                <CourseCard key={course.id} course={course} index={i} />
              ))}
            </div>
          )}
        </section>

        {/* ── WHY US ── */}
        <section className="relative overflow-hidden py-20" style={{ background: 'var(--ink-soft)' }}>
          <div className="grid-lines" />
          <div className="orb w-80 h-80 bottom-0 right-0" style={{ background: 'rgba(0,229,200,0.05)' }} />
          <div className="max-w-6xl mx-auto px-5 sm:px-8 relative z-10">
            <div className="flex items-center gap-4 mb-12">
              <span className="section-label">Why Us</span>
              <div className="flex-1 h-px bg-[rgba(255,255,255,0.07)]" />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { icon: Target, title: 'Goal-Oriented', desc: 'Every lesson designed around your specific learning outcomes.' },
                { icon: Zap, title: 'Fast Progress', desc: 'Accelerated methods proven to get results in weeks, not years.' },
                { icon: Users, title: 'Small Groups', desc: 'Personalised attention in intimate class sizes for maximum growth.' },
                { icon: Star, title: 'Expert Tutors', desc: 'Certified, experienced teachers who genuinely care about your success.' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="p-6 rounded-sm border"
                    style={{ borderColor: 'var(--border)', background: 'rgba(255,255,255,0.02)' }}
                  >
                    <div className="icon-wrap mb-4">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="font-syne font-bold text-[#e8e6f0] mb-2">{item.title}</h4>
                    <p className="text-[#7a7890] text-sm leading-relaxed">{item.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        {faqs.length > 0 && (
          <section className="max-w-3xl mx-auto px-5 sm:px-8 py-24">
            <div className="flex items-center gap-4 mb-3">
              <span className="section-label">FAQ</span>
              <div className="flex-1 h-px bg-[rgba(255,255,255,0.07)]" />
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-bebas text-5xl sm:text-6xl text-[#e8e6f0] mb-12"
              style={{ letterSpacing: '0.02em' }}
            >
              Got Questions?
            </motion.h2>

            <div className="border-t" style={{ borderColor: 'var(--border)' }}>
              {faqs.map((faq, i) => (
                <FAQItem
                  key={faq.id}
                  faq={faq}
                  index={i}
                  open={expandedFaq === faq.id}
                  onToggle={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* ── CTA STRIP ── */}
        <section
          className="relative overflow-hidden py-20"
          style={{ background: 'var(--teal)' }}
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #000 0px, #000 1px, transparent 1px, transparent 40px)',
            }}
          />
          <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-bebas text-4xl sm:text-5xl text-[#0b0b10] mb-1" style={{ letterSpacing: '0.02em' }}>
                Ready to Start Learning?
              </h3>
              <p className="text-[#0b0b10]/70 font-medium">Join hundreds of students already making progress.</p>
            </div>
            <Link
              to="/contact"
              className="flex-shrink-0 flex items-center gap-2 bg-[#0b0b10] text-[#00e5c8] font-syne font-bold text-sm uppercase tracking-widest px-7 py-4 rounded-sm hover:bg-[#16161f] transition-colors"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

      </div>
    </>
  );
}
