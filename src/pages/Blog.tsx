import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import {
  Calendar as CalendarIcon, ArrowRight, X, Heart, MessageCircle,
  Send, Search, Clock, TrendingUp, Sparkles, ChevronLeft, ChevronRight
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import Markdown from 'react-markdown';

/* ─── Google Fonts injection ─── */
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href =
  'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap';
document.head.appendChild(fontLink);

/* ─── Types ─── */
interface BlogComment {
  id: number;
  name: string;
  comment: string;
  created_at: string;
}

interface BlogPost {
  id: number;
  title: string;
  summary: string;
  content: string;
  image_url: string;
  likes: number;
  created_at: string;
  comments?: BlogComment[];
}

/* ─── Helpers ─── */
const readingTime = (text: string) =>
  Math.max(1, Math.ceil(text.split(/\s+/).length / 200));

const avatarColor = (name: string) => {
  const colors = ['#C9A96E', '#7B9E87', '#B07BAC', '#6E8EC9', '#C96E7B'];
  return colors[name.charCodeAt(0) % colors.length];
};

/* ─── Styles ─── */
const inlineStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  .blog-root * { font-family: 'DM Sans', sans-serif; }
  .font-display { font-family: 'Playfair Display', Georgia, serif; }
  .font-mono-custom { font-family: 'DM Mono', monospace; }

  .hero-post-card {
    background: linear-gradient(135deg, #0a0a0f 0%, #12121f 50%, #0f0f1a 100%);
    position: relative;
    overflow: hidden;
  }
  .hero-post-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 80% 60% at 70% 50%, rgba(201,169,110,0.12) 0%, transparent 70%);
    pointer-events: none;
  }

  .card-hover {
    transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.4s ease;
  }
  .card-hover:hover {
    transform: translateY(-6px);
    box-shadow: 0 24px 48px rgba(0,0,0,0.18);
  }

  .ink-underline {
    position: relative;
    display: inline-block;
  }
  .ink-underline::after {
    content: '';
    position: absolute;
    bottom: -4px; left: 0;
    width: 100%; height: 3px;
    background: #C9A96E;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.35s cubic-bezier(0.23, 1, 0.32, 1);
  }
  .ink-underline:hover::after { transform: scaleX(1); }

  .reading-progress {
    position: fixed;
    top: 0; left: 0;
    height: 3px;
    background: linear-gradient(90deg, #C9A96E, #e8c98a);
    z-index: 9999;
    transition: width 0.1s;
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
  }

  .modal-overlay {
    background: rgba(8, 8, 15, 0.85);
    backdrop-filter: blur(12px);
  }

  .like-burst {
    animation: likeBurst 0.5s cubic-bezier(0.23, 1, 0.32, 1) forwards;
  }
  @keyframes likeBurst {
    0% { transform: scale(1); }
    40% { transform: scale(1.45); }
    70% { transform: scale(0.9); }
    100% { transform: scale(1.1); }
  }

  .markdown-content h1, .markdown-content h2, .markdown-content h3 {
    font-family: 'Playfair Display', Georgia, serif;
    color: #1a1a2e;
  }
  .markdown-content h2 { font-size: 1.6rem; margin: 2rem 0 1rem; font-weight: 700; }
  .markdown-content h3 { font-size: 1.2rem; margin: 1.5rem 0 0.75rem; font-weight: 700; }
  .markdown-content p { line-height: 1.85; margin-bottom: 1.25rem; color: #3d3d5c; }
  .markdown-content strong { color: #1a1a2e; font-weight: 600; }
  .markdown-content blockquote {
    border-left: 3px solid #C9A96E;
    margin: 2rem 0;
    padding: 1rem 1.5rem;
    background: #fdf9f0;
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: 1.1rem;
    color: #5a4a2e;
  }
  .markdown-content a { color: #8B6914; text-decoration: underline; }
  .markdown-content ul, .markdown-content ol { margin: 1rem 0 1.25rem 1.5rem; }
  .markdown-content li { margin-bottom: 0.4rem; color: #3d3d5c; }
  .markdown-content code {
    font-family: 'DM Mono', monospace;
    background: #f0edf8;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 0.88em;
    color: #5b3fb0;
  }
  .markdown-content pre {
    background: #12121f;
    color: #e8dfc8;
    padding: 1.5rem;
    border-radius: 8px;
    overflow-x: auto;
    margin: 1.5rem 0;
    font-family: 'DM Mono', monospace;
    font-size: 0.88rem;
  }
  .markdown-content hr {
    border: none;
    border-top: 1px solid #e8dfc8;
    margin: 2rem 0;
  }

  .search-bar:focus { outline: none; border-color: #C9A96E; box-shadow: 0 0 0 3px rgba(201,169,110,0.15); }

  .comment-form input:focus, .comment-form textarea:focus {
    outline: none;
    border-color: #C9A96E;
    box-shadow: 0 0 0 3px rgba(201,169,110,0.12);
  }

  .grid-masonry {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .noise-overlay {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }
`;

/* ─── ReadingProgress ─── */
function ReadingProgress({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  const { scrollYProgress } = useScroll({ container: containerRef });
  const width = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  return <motion.div className="reading-progress" style={{ width }} />;
}

/* ─── HeroPost ─── */
function HeroPost({
  post,
  liked,
  onOpen,
  onLike,
}: {
  post: BlogPost;
  liked: boolean;
  onOpen: () => void;
  onLike: (e: React.MouseEvent) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
      className="hero-post-card rounded-3xl overflow-hidden cursor-pointer group mb-10"
      onClick={onOpen}
    >
      <div className="grid lg:grid-cols-2 min-h-[460px]">
        {/* Text side */}
        <div className="flex flex-col justify-between p-10 lg:p-14 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="tag-pill" style={{ background: '#C9A96E22', color: '#C9A96E', border: '1px solid #C9A96E44' }}>
                Featured
              </span>
              <span className="flex items-center gap-1.5 text-xs text-white/40 font-mono-custom tracking-widest uppercase">
                <CalendarIcon className="w-3 h-3" />
                {format(new Date(post.created_at), 'MMM d, yyyy')}
              </span>
            </div>

            <h2
              className="font-display text-4xl lg:text-5xl font-bold text-white leading-[1.12] mb-5"
              style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
            >
              {post.title}
            </h2>
            <p className="text-white/60 text-base leading-relaxed line-clamp-3">
              {post.summary}
            </p>
          </div>

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center gap-4">
              <button
                onClick={onLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                  liked
                    ? 'bg-red-500/20 border-red-400/40 text-red-400'
                    : 'border-white/20 text-white/50 hover:border-red-400/40 hover:text-red-400'
                }`}
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-current like-burst' : ''}`} />
                <span className="text-sm font-medium">{post.likes || 0}</span>
              </button>
              <span className="flex items-center gap-1.5 text-white/40 text-sm">
                <Clock className="w-3.5 h-3.5" />
                {readingTime(post.content)} min read
              </span>
            </div>

            <span className="flex items-center gap-2 text-sm font-semibold text-[#C9A96E] group-hover:gap-3 transition-all">
              Read Story <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>

        {/* Image side */}
        <div className="relative overflow-hidden lg:rounded-r-3xl min-h-[260px]">
          <img
            src={post.image_url || `https://picsum.photos/seed/hero${post.id}/800/600`}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/30 to-transparent lg:block hidden" />
          <div className="absolute inset-0 lg:hidden bg-gradient-to-t from-[#0a0a0f]/80 to-transparent" />
        </div>
      </div>
    </motion.div>
  );
}

/* ─── PostCard ─── */
function PostCard({
  post,
  index,
  liked,
  onOpen,
  onLike,
}: {
  post: BlogPost;
  index: number;
  liked: boolean;
  onOpen: () => void;
  onLike: (e: React.MouseEvent) => void;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="bg-white rounded-2xl overflow-hidden border border-[#ece8e0] card-hover cursor-pointer flex flex-col"
      onClick={onOpen}
    >
      {/* Image */}
      <div className="aspect-[16/10] overflow-hidden bg-[#f5f0e8] relative">
        <img
          src={post.image_url || `https://picsum.photos/seed/blog${post.id}/600/400`}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-white/30 to-transparent" />
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-3 mb-3">
          <span className="tag-pill">Article</span>
          <span className="flex items-center gap-1 text-xs text-gray-400 font-mono-custom">
            <Clock className="w-3 h-3" />
            {readingTime(post.content)} min
          </span>
        </div>

        <h3 className="font-display text-xl font-bold text-[#1a1a2e] leading-tight mb-3 group ink-underline line-clamp-2">
          {post.title}
        </h3>
        <p className="text-[#6b6b8a] text-sm leading-relaxed line-clamp-3 flex-grow mb-5">
          {post.summary}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-[#ece8e0] mt-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={onLike}
              className={`flex items-center gap-1.5 text-sm transition-colors ${
                liked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
              }`}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
              <span className="font-medium">{post.likes || 0}</span>
            </button>
            <span className="text-xs text-gray-300">·</span>
            <span className="text-xs text-gray-400 font-mono-custom">
              {format(new Date(post.created_at), 'MMM d')}
            </span>
          </div>
          <span className="text-sm font-semibold text-[#1a1a2e] flex items-center gap-1.5 hover:text-[#C9A96E] transition-colors">
            Read <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </motion.article>
  );
}

/* ─── ArticleModal ─── */
function ArticleModal({
  post,
  liked,
  onClose,
  onLike,
}: {
  post: BlogPost;
  liked: boolean;
  onClose: () => void;
  onLike: (e: React.MouseEvent) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [status, setStatus] = useState('');
  const [likedLocal, setLikedLocal] = useState(liked);

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !text) return;
    await fetch(`/api/blog/${post.id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, comment: text }),
    });
    setName(''); setText('');
    setStatus('✓ Your comment is awaiting approval.');
    setTimeout(() => setStatus(''), 6000);
  };

  const handleLike = (e: React.MouseEvent) => {
    if (!likedLocal) { setLikedLocal(true); onLike(e); }
    else e.stopPropagation();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <ReadingProgress containerRef={scrollRef} />

      {/* Overlay */}
      <motion.div
        className="modal-overlay absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        className="relative w-full sm:max-w-4xl max-h-[96vh] bg-[#fdfbf7] sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden flex flex-col"
        initial={{ opacity: 0, y: 60, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 60, scale: 0.97 }}
        transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 bg-[#1a1a2e]/80 backdrop-blur text-white rounded-full flex items-center justify-center hover:bg-[#1a1a2e] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scrollable body */}
        <div ref={scrollRef} className="overflow-y-auto flex-grow">
          {/* Hero image */}
          {post.image_url && (
            <div className="w-full h-56 sm:h-80 relative flex-shrink-0">
              <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#fdfbf7] via-[#fdfbf7]/10 to-transparent" />
            </div>
          )}

          <div className="px-8 sm:px-14 pt-6 pb-16">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="tag-pill">Article</span>
              <span className="flex items-center gap-1.5 text-xs text-gray-400 font-mono-custom">
                <CalendarIcon className="w-3 h-3" />
                {format(new Date(post.created_at), 'MMMM d, yyyy')}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-400 font-mono-custom">
                <Clock className="w-3 h-3" />
                {readingTime(post.content)} min read
              </span>

              <button
                onClick={handleLike}
                className={`ml-auto flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-medium transition-all ${
                  likedLocal
                    ? 'bg-red-50 border-red-200 text-red-500'
                    : 'border-[#ddd] text-gray-500 hover:border-red-200 hover:text-red-400'
                }`}
              >
                <Heart className={`w-4 h-4 ${likedLocal ? 'fill-current like-burst' : ''}`} />
                {post.likes || 0} Likes
              </button>
            </div>

            {/* Title */}
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a1a2e] leading-tight mb-10">
              {post.title}
            </h1>

            {/* Content */}
            <div className="markdown-content max-w-none">
              <Markdown>{post.content}</Markdown>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 my-12">
              <div className="flex-1 h-px bg-[#ece8e0]" />
              <span className="text-[#C9A96E] text-lg">✦</span>
              <div className="flex-1 h-px bg-[#ece8e0]" />
            </div>

            {/* Comments section */}
            <div>
              <h3 className="font-display text-2xl font-bold text-[#1a1a2e] mb-8 flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-[#C9A96E]" />
                {post.comments?.length || 0} Comments
              </h3>

              {/* Comment form */}
              <form onSubmit={submitComment} className="comment-form bg-white border border-[#ece8e0] rounded-2xl p-6 mb-10 shadow-sm">
                <p className="text-sm font-semibold text-[#1a1a2e] mb-4">Leave a comment</p>
                {status && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-3 rounded-xl mb-4"
                  >
                    {status}
                  </motion.div>
                )}
                <div className="grid sm:grid-cols-2 gap-3 mb-3">
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-[#ece8e0] text-sm transition-all"
                  />
                </div>
                <textarea
                  placeholder="Share your thoughts…"
                  value={text}
                  onChange={e => setText(e.target.value)}
                  required
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#ece8e0] text-sm resize-none transition-all mb-3"
                />
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-[#1a1a2e] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#2a2a4e] transition-colors"
                >
                  <Send className="w-3.5 h-3.5" /> Post Comment
                </button>
              </form>

              {/* Comment list */}
              <div className="space-y-4">
                {post.comments?.map((c, i) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex gap-4 bg-white border border-[#ece8e0] p-5 rounded-2xl"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-bold uppercase"
                      style={{ background: avatarColor(c.name) }}
                    >
                      {c.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-3 mb-1">
                        <span className="font-semibold text-[#1a1a2e] text-sm">{c.name}</span>
                        <span className="text-xs text-gray-400 font-mono-custom">
                          {formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-[#3d3d5c] leading-relaxed">{c.comment}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Main Blog Component ─── */
export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [sort, setSort] = useState<'newest' | 'likes'>('newest');
  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const [likedPosts, setLikedPosts] = useState<Set<number>>(() => {
    try {
      const saved = localStorage.getItem('blogLikes');
      return saved ? new Set(JSON.parse(saved)) : new Set<number>();
    } catch { return new Set<number>(); }
  });

  useEffect(() => { fetchPosts(); }, [sort]);

  const fetchPosts = () => {
    setLoading(true);
    fetch(`/api/blog?sort=${sort}`)
      .then(r => r.json())
      .then(data => { setPosts(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  const openPost = async (post: BlogPost) => {
    const res = await fetch(`/api/blog/${post.id}`);
    const data = await res.json();
    setSelectedPost(data);
    document.body.style.overflow = 'hidden';
  };

  const closePost = () => {
    setSelectedPost(null);
    document.body.style.overflow = '';
  };

  const handleLike = async (e: React.MouseEvent, postId: number) => {
    e.stopPropagation();
    if (likedPosts.has(postId)) return;
    await fetch(`/api/blog/${postId}/like`, { method: 'POST' });
    const next = new Set([...likedPosts, postId]);
    setLikedPosts(next);
    localStorage.setItem('blogLikes', JSON.stringify([...next]));
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: (p.likes || 0) + 1 } : p));
    if (selectedPost?.id === postId) {
      setSelectedPost(prev => prev ? { ...prev, likes: (prev.likes || 0) + 1 } : prev);
    }
  };

  const filtered = posts.filter(p =>
    !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.summary.toLowerCase().includes(search.toLowerCase())
  );

  const [hero, ...rest] = filtered;

  return (
    <>
      <style>{inlineStyles}</style>
      <div className="blog-root min-h-screen" style={{ background: 'linear-gradient(180deg, #f9f6f0 0%, #fdfbf7 40%, #f9f6f0 100%)' }}>
        <div className="noise-overlay" />

        {/* ── Header ── */}
        <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-20 pb-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-14"
          >
            

            <h1 className="font-display text-6xl sm:text-7xl md:text-8xl font-black text-[#1a1a2e] leading-none tracking-tight mb-5">
              Blog
            </h1>
            <p className="text-[#6b6b8a] text-lg max-w-lg mx-auto leading-relaxed">
              Tips, strategies, and stories to help you learn English faster and better.
            </p>
          </motion.div>

          {/* ── Toolbar ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-col sm:flex-row gap-4 mb-10 items-center"
          >
            {/* Search */}
            <div className={`flex items-center gap-2 bg-white border rounded-xl px-4 py-2.5 flex-1 max-w-sm transition-all ${searchFocused ? 'border-[#C9A96E] shadow-md' : 'border-[#ece8e0]'}`}>
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="search-bar bg-transparent text-sm text-[#1a1a2e] placeholder-gray-400 flex-1"
              />
              {search && (
                <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort tabs */}
            <div className="flex items-center bg-white border border-[#ece8e0] rounded-xl p-1 gap-1">
              {(['newest', 'likes'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setSort(s)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    sort === s
                      ? 'bg-[#1a1a2e] text-white shadow-sm'
                      : 'text-[#6b6b8a] hover:text-[#1a1a2e] hover:bg-[#f5f0e8]'
                  }`}
                >
                  {s === 'newest' ? <Sparkles className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
                  {s === 'newest' ? 'Newest' : 'Popular'}
                </button>
              ))}
            </div>

            {/* Count */}
            {search && (
              <span className="text-xs text-gray-400 font-mono-custom whitespace-nowrap">
                {filtered.length} result{filtered.length !== 1 ? 's' : ''}
              </span>
            )}
          </motion.div>

          {/* ── Content ── */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="w-10 h-10 rounded-full border-2 border-[#ece8e0] border-t-[#C9A96E] animate-spin" />
              <p className="text-sm text-gray-400 font-mono-custom tracking-wide">Loading stories…</p>
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-32 bg-white rounded-3xl border border-[#ece8e0]"
            >
              <div className="font-display text-5xl mb-4">✦</div>
              <h3 className="font-display text-2xl font-bold text-[#1a1a2e] mb-2">
                {search ? 'No results found' : 'No posts yet'}
              </h3>
              <p className="text-[#6b6b8a]">
                {search ? `Nothing matches "${search}"` : 'Check back soon for new articles!'}
              </p>
            </motion.div>
          ) : (
            <>
              {/* Hero */}
              {hero && !search && (
                <HeroPost
                  post={hero}
                  liked={likedPosts.has(hero.id)}
                  onOpen={() => openPost(hero)}
                  onLike={e => handleLike(e, hero.id)}
                />
              )}

              {/* Grid */}
              <div className="grid-masonry">
                {(search ? filtered : rest).map((post, i) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    index={i}
                    liked={likedPosts.has(post.id)}
                    onOpen={() => openPost(post)}
                    onLike={e => handleLike(e, post.id)}
                  />
                ))}
              </div>

              {/* Footer flourish */}
              {filtered.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center justify-center gap-4 mt-16 mb-4"
                >
                  <div className="h-px w-20 bg-[#ece8e0]" />
                  <span className="text-[#C9A96E] text-sm">✦</span>
                  <div className="h-px w-20 bg-[#ece8e0]" />
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Article Modal ── */}
      <AnimatePresence>
        {selectedPost && (
          <ArticleModal
            post={selectedPost}
            liked={likedPosts.has(selectedPost.id)}
            onClose={closePost}
            onLike={e => handleLike(e, selectedPost.id)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
