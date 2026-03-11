import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Users, BookOpen, Calendar, Plus, Minus,
  Target, Zap, Star, CheckCircle2,
} from 'lucide-react';

/* ─── Google Fonts — same as Blog ─── */
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href =
  'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap';
if (!document.querySelector('link[href*="Playfair+Display"]')) {
  document.head.appendChild(fontLink);
}

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

/* ─── Inline styles — exact same tokens as Blog ─── */
const css = `
  .courses-root * { font-family: 'DM Sans', sans-serif; }
  .courses-root .font-display { font-family: 'Playfair Display', Georgia, serif; }
  .courses-root .font-mono-custom { font-family: 'DM Mono', monospace; }

  .noise-overlay {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
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

  .card-hover {
    transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.4s ease;
  }
  .card-hover:hover {
    transform: translateY(-6px);
    box-shadow: 0 24px 48px rgba(0,0,0,0.12);
  }

  /* Hero — mirrors Blog's dark featured card */
  .courses-hero {
    background: linear-gradient(135deg, #0a0a0f 0%, #12121f 50%, #0f0f1a 100%);
    position: relative; overflow: hidden;
  }
  .courses-hero::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 70% 80% at 30% 50%, rgba(201,169,110,0.10) 0%, transparent 70%);
    pointer-events: none;
  }

  .section-label {
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: #C9A96E;
  }

  /* Ghost number on course cards */
  .ghost-number {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 7rem; line-height: 1;
    font-weight: 900; font-style: italic;
    color: rgba(26,26,46,0.04);
    position: absolute; bottom: -1rem; right: 1.5rem;
    user-select: none;
    transition: color 0.4s;
  }
  .course-card:hover .ghost-number { color: rgba(201,169,110,0.08); }

  .course-icon-wrap {
    width: 48px; height: 48px;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    background: #f5f0e8; color: #C9A96E;
    border: 1px solid #e8dfc8; flex-shrink: 0;
    transition: background 0.3s, border-color 0.3s;
  }
  .course-card:hover .course-icon-wrap {
    background: #fdf3d8; border-color: #C9A96E;
  }

  .cta-btn {
    background: #1a1a2e; color: #fff;
    font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 0.875rem;
    padding: 11px 22px; border-radius: 10px;
    display: inline-flex; align-items: center; gap: 8px;
    text-decoration: none;
    transition: background 0.2s, gap 0.2s;
  }
  .cta-btn:hover { background: #2a2a4e; gap: 12px; }

  .faq-item { border-bottom: 1px solid #ece8e0; }
  .faq-trigger {
    width: 100%; padding: 22px 0;
    display: flex; align-items: center; justify-content: space-between; gap: 16px;
    cursor: pointer; background: transparent; border: none; text-align: left;
    transition: color 0.2s; color: #1a1a2e;
  }
  .faq-trigger:hover { color: #C9A96E; }
  .faq-icon {
    width: 28px; height: 28px;
    border: 1px solid #e8dfc8; border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; color: #C9A96E;
    transition: background 0.2s;
  }
  .faq-trigger:hover .faq-icon { background: #f5f0e8; }
  .faq-answer {
    color: #6b6b8a; font-size: 0.95rem; line-height: 1.8;
    padding-bottom: 22px; padding-right: 44px;
  }

  .why-card {
    background: white; border: 1px solid #ece8e0; border-radius: 18px; padding: 28px;
    transition: transform 0.35s cubic-bezier(0.23,1,0.32,1), box-shadow 0.35s;
  }
  .why-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.08); }

  .cta-strip {
    background: linear-gradient(135deg, #0a0a0f 0%, #12121f 60%, #1a0a2e 100%);
    position: relative; overflow: hidden;
  }
  .cta-strip::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 60% 80% at 80% 50%, rgba(201,169,110,0.09) 0%, transparent 70%);
    pointer-events: none;
  }

  .stat-val {
    font-family: 'Playfair Display', Georgia, serif;
    font-weight: 900; font-size: 2.5rem; line-height: 1;
    color: #C9A96E;
  }
`;

/* ─── AnimatedNumber ─── */
function AnimatedNumber({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let n = 0;
    const step = target / 45;
    const t = setInterval(() => {
      n += step;
      if (n >= target) { setVal(target); clearInterval(t); }
      else setVal(Math.floor(n));
    }, 28);
    return () => clearInterval(t);
  }, [inView, target]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ─── CourseCard ─── */
const ICONS = [BookOpen, Users, Calendar, Target, Zap, Star];

function CourseCard({ course, index }: { course: Course; index: number }) {
  const Icon = ICONS[index % ICONS.length];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.09, ease: [0.23, 1, 0.32, 1] }}
      className="course-card card-hover bg-white rounded-2xl border border-[#ece8e0] overflow-hidden flex flex-col relative"
    >
      <span className="ghost-number">{String(index + 1).padStart(2, '0')}</span>

      <div className="p-8 flex flex-col flex-grow relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className="course-icon-wrap">
            <Icon className="w-5 h-5" />
          </div>
          <span
            className="tag-pill"
            style={course.active
              ? { background: '#edf7f0', color: '#2d7a50', borderColor: '#b8dfc8' }
              : { background: '#fdf3e8', color: '#a05a14', borderColor: '#f0d4b0' }}
          >
            {course.active ? 'Enrol Now' : 'Coming Soon'}
          </span>
        </div>

        <p className="section-label mb-2">{course.target_audience}</p>
        <h3 className="font-display text-xl font-bold text-[#1a1a2e] leading-snug mb-3">
          {course.title}
        </h3>
        <p className="text-[#6b6b8a] text-sm leading-relaxed flex-grow mb-7">
          {course.description}
        </p>

        <Link
          to={`/contact?service=${encodeURIComponent(course.title)}`}
          className="cta-btn self-start"
        >
          Register Now <ArrowRight className="w-3.5 h-3.5" />
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
  const inView = useInView(ref, { once: true, margin: '-30px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -12 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.07, duration: 0.45 }}
      className="faq-item"
    >
      <button className="faq-trigger" onClick={onToggle}>
        <span className="font-display text-base sm:text-lg font-bold">{faq.question}</span>
        <div className="faq-icon">
          {open ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="ans"
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

/* ─── Main Component ─── */
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
      .catch(() => { setCourses([]); setFaqs([]); setLoading(false); });
  }, []);

  return (
    <>
      <style>{css}</style>
      <div
        className="courses-root min-h-screen"
        style={{ background: 'linear-gradient(180deg, #f9f6f0 0%, #fdfbf7 40%, #f9f6f0 100%)' }}
      >
        <div className="noise-overlay" />


        {/* ── COURSES ── */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 py-20 relative z-10">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px w-8 bg-[#C9A96E]" />
            <span className="section-label">Programs</span>
            <div className="flex-1 h-px bg-[#ece8e0]" />
            {!loading && (
              <span className="font-mono-custom text-xs text-[#C9A96E]">
                {courses.length} course{courses.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="w-10 h-10 rounded-full border-2 border-[#ece8e0] border-t-[#C9A96E] animate-spin" />
              <p className="section-label" style={{ color: '#b0a890' }}>Loading programs…</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-28 bg-white rounded-3xl border border-[#ece8e0]">
              <div className="font-display text-5xl mb-4" style={{ color: '#C9A96E' }}>✦</div>
              <h3 className="font-display text-2xl font-bold text-[#1a1a2e] mb-2">No courses yet</h3>
              <p className="text-[#6b6b8a]">Check back soon for new programs!</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, i) => (
                <CourseCard key={course.id} course={course} index={i} />
              ))}
            </div>
          )}
        </section>

        {/* ── WHY US ── */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-20 relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px w-8 bg-[#C9A96E]" />
            <span className="section-label">Why Choose Us</span>
            <div className="flex-1 h-px bg-[#ece8e0]" />
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl sm:text-5xl font-black text-[#1a1a2e] mb-12 leading-tight"
          >
            Learning that <em>actually</em> works
          </motion.h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { Icon: Target,       title: 'Goal-Oriented',    desc: 'Every lesson designed around your specific outcomes and timeline.' },
              { Icon: Zap,          title: 'Fast Progress',     desc: 'Proven accelerated methods that deliver real results in weeks.' },
              { Icon: Users,        title: 'Small Groups',      desc: 'Personalised attention in intimate class sizes for maximum growth.' },
              { Icon: CheckCircle2, title: 'Certified Tutors',  desc: 'Experienced teachers who genuinely care about your success.' },
            ].map(({ Icon, title, desc }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="why-card"
              >
                <div className="course-icon-wrap mb-5">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-display font-bold text-[#1a1a2e] text-lg mb-2">{title}</h4>
                <p className="text-[#6b6b8a] text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Gold divider — same as Blog ✦ */}
        <div className="flex items-center gap-4 max-w-6xl mx-auto px-5 sm:px-8 mb-20 relative z-10">
          <div className="flex-1 h-px bg-[#ece8e0]" />
          <span className="text-[#C9A96E] text-lg">✦</span>
          <div className="flex-1 h-px bg-[#ece8e0]" />
        </div>

        {/* ── FAQ ── */}
        {faqs.length > 0 && (
          <section className="max-w-3xl mx-auto px-5 sm:px-8 pb-24 relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-8 bg-[#C9A96E]" />
              <span className="section-label">FAQ</span>
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-4xl sm:text-5xl font-black text-[#1a1a2e] mb-10 leading-tight"
            >
              Frequently Asked<br />Questions
            </motion.h2>

            <div className="border-t border-[#ece8e0]">
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

        {/* ── CTA STRIP — dark, mirrors Blog hero card ── */}
        <section className="cta-strip py-20 relative z-10">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-8 relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-[#C9A96E]" />
                <span className="section-label">Get Started</span>
              </div>
              <h3 className="font-display text-4xl sm:text-5xl font-black text-white leading-tight">
                Ready to start<br />
                <span style={{ color: '#C9A96E', fontStyle: 'italic' }}>learning?</span>
              </h3>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
              <Link
                to="/contact"
                style={{ background: '#C9A96E', color: '#1a1a2e' }}
                className="flex items-center gap-2 font-semibold text-sm px-7 py-4 rounded-xl hover:opacity-90 transition-opacity"
              >
                Book a Free Trial <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/about"
                className="flex items-center gap-2 border border-white/20 text-white/80 font-semibold text-sm px-7 py-4 rounded-xl hover:bg-white/10 transition-colors"
              >
                Meet the Teacher
              </Link>
            </div>
          </div>
        </section>

        {/* Footer flourish — same as Blog */}
        <div className="flex items-center justify-center gap-4 py-10 relative z-10">
          <div className="h-px w-20 bg-[#ece8e0]" />
          <span className="text-[#C9A96E] text-sm">✦</span>
          <div className="h-px w-20 bg-[#ece8e0]" />
        </div>

      </div>
    </>
  );
}
