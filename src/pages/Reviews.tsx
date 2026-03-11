import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { Star, X, ZoomIn } from 'lucide-react';

/* ─── Fonts — same as all pages ─── */
if (!document.querySelector('link[href*="Playfair+Display"]')) {
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap';
  document.head.appendChild(l);
}

interface Feedback {
  id: number;
  name: string;
  review: string;
  image_url: string;
  rating: number;
}

const css = `
  .reviews-root * { font-family: 'DM Sans', sans-serif; }
  .reviews-root .font-display { font-family: 'Playfair Display', Georgia, serif; }

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

  /* Masonry grid */
  .masonry {
    columns: 1;
    column-gap: 1.25rem;
  }
  @media (min-width: 640px)  { .masonry { columns: 2; } }
  @media (min-width: 1024px) { .masonry { columns: 3; } }

  .masonry-item {
    break-inside: avoid;
    margin-bottom: 1.25rem;
    display: block;
  }

  /* Photo card */
  .photo-card {
    background: white;
    border: 1px solid #ece8e0;
    border-radius: 20px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.4s cubic-bezier(0.23,1,0.32,1),
                box-shadow 0.4s ease,
                border-color 0.3s;
    position: relative;
  }
  .photo-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 48px rgba(0,0,0,0.13);
    border-color: #C9A96E;
  }

  /* Zoom overlay on hover */
  .photo-card .zoom-hint {
    position: absolute;
    inset: 0;
    background: rgba(26,26,46,0);
    display: flex; align-items: center; justify-content: center;
    transition: background 0.35s;
    pointer-events: none;
    border-radius: 20px 20px 0 0;
  }
  .photo-card:hover .zoom-hint {
    background: rgba(26,26,46,0.22);
  }
  .zoom-hint svg {
    opacity: 0;
    transform: scale(0.7);
    transition: opacity 0.3s, transform 0.3s;
    color: white;
  }
  .photo-card:hover .zoom-hint svg {
    opacity: 1;
    transform: scale(1);
  }

  .photo-card img {
    display: block;
    width: 100%;
    transition: transform 0.55s cubic-bezier(0.23,1,0.32,1);
  }
  .photo-card:hover img { transform: scale(1.04); }

  /* Caption strip */
  .card-caption {
    padding: 16px 20px 18px;
    border-top: 1px solid #f0ece4;
  }

  /* Lightbox */
  .lightbox-bg {
    background: rgba(8, 8, 15, 0.94);
    backdrop-filter: blur(18px);
  }

  /* Stars */
  .star-filled { fill: #C9A96E; color: #C9A96E; }
  .star-empty  { color: #e8dfc8; }
`;

/* ─── Stars ─── */
function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`w-3.5 h-3.5 ${i <= n ? 'star-filled' : 'star-empty'}`} />
      ))}
    </div>
  );
}

/* ─── Single card ─── */
function ReviewCard({ fb, index, onZoom }: {
  fb: Feedback;
  index: number;
  onZoom: (src: string) => void;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const src = fb.image_url || `https://picsum.photos/seed/feedback${fb.id}/800/600`;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: (index % 6) * 0.07, ease: [0.23, 1, 0.32, 1] }}
      className="masonry-item"
    >
      <div className="photo-card" onClick={() => onZoom(src)}>
        {/* Photo — no fixed aspect ratio so masonry breathes naturally */}
        <div className="relative overflow-hidden" style={{ borderRadius: '20px 20px 0 0' }}>
          <img src={src} alt={`Review by ${fb.name}`} referrerPolicy="no-referrer" loading="lazy" />
          <div className="zoom-hint">
            <ZoomIn className="w-8 h-8" strokeWidth={1.5} />
          </div>
        </div>

        {/* Caption */}
        {(fb.review || fb.name) && (
          <div className="card-caption">
            {fb.review && (
              <p className="font-display text-sm italic text-[#3d3d5c] leading-relaxed mb-3 line-clamp-3">
                "{fb.review}"
              </p>
            )}
            <div className="flex items-center justify-between gap-2">
              {fb.name && (
                <span className="font-semibold text-sm text-[#1a1a2e]">{fb.name}</span>
              )}
              {fb.rating > 0 && <Stars n={fb.rating} />}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Main ─── */
export default function Reviews() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/feedback')
      .then(res => res.json())
      .then(data => { setFeedbacks(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  /* lock body scroll when lightbox open */
  useEffect(() => {
    document.body.style.overflow = lightbox ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightbox]);

  return (
    <>
      <style>{css}</style>
      <div
        className="reviews-root min-h-screen"
        style={{ background: 'linear-gradient(180deg, #f9f6f0 0%, #fdfbf7 40%, #f9f6f0 100%)' }}
      >
        <div className="noise-overlay" />

        {/* ── Header ── */}
        <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-24 pb-14 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-5"
          >
            <div className="h-px w-8 bg-[#C9A96E]" />
            <span className="section-label">Testimonials</span>
            <div className="h-px w-8 bg-[#C9A96E]" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
            className="font-display text-5xl sm:text-6xl font-black text-[#1a1a2e] leading-tight mb-4"
          >
            Student <em style={{ color: '#C9A96E' }}>Reviews</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="text-[#6b6b8a] text-lg max-w-lg mx-auto leading-relaxed"
          >
            Hear what my students have to say about their learning experience.
          </motion.p>
        </div>

        {/* ── Gallery ── */}
        <div className="max-w-6xl mx-auto px-5 sm:px-8 pb-24 relative z-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="w-10 h-10 rounded-full border-2 border-[#ece8e0] border-t-[#C9A96E] animate-spin" />
              <p className="section-label" style={{ color: '#b0a890' }}>Loading reviews…</p>
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="text-center py-28 bg-white rounded-3xl border border-[#ece8e0]">
              <div className="font-display text-5xl mb-4 text-[#C9A96E]">✦</div>
              <h3 className="font-display text-2xl font-bold text-[#1a1a2e] mb-2">No reviews yet</h3>
              <p className="text-[#6b6b8a]">Check back soon for new student feedback!</p>
            </div>
          ) : (
            <div className="masonry">
              {feedbacks.map((fb, i) => (
                <ReviewCard key={fb.id} fb={fb} index={i} onZoom={setLightbox} />
              ))}
            </div>
          )}
        </div>

        {/* Footer flourish */}
        {!loading && feedbacks.length > 0 && (
          <div className="flex items-center justify-center gap-4 pb-14 relative z-10">
            <div className="h-px w-20 bg-[#ece8e0]" />
            <span className="text-[#C9A96E] text-sm">✦</span>
            <div className="h-px w-20 bg-[#ece8e0]" />
          </div>
        )}
      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="lightbox-bg fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            {/* Close */}
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-5 right-5 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <motion.img
              key={lightbox}
              src={lightbox}
              alt="Full size review"
              className="max-w-full max-h-[88vh] rounded-2xl object-contain shadow-2xl"
              initial={{ opacity: 0, scale: 0.93 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.93 }}
              transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
              onClick={e => e.stopPropagation()}
              referrerPolicy="no-referrer"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
