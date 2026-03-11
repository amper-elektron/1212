import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar as CalendarIcon, ArrowRight, X, Heart, MessageCircle, Send } from 'lucide-react';
import { format } from 'date-fns';
import Markdown from 'react-markdown';

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

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [sort, setSort] = useState<'newest' | 'likes'>('newest');
  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchPosts();
  }, [sort]);

  const fetchPosts = () => {
    setLoading(true);
    fetch(`/api/blog?sort=${sort}`)
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      });
  };

  const openPost = async (post: BlogPost) => {
    const res = await fetch(`/api/blog/${post.id}`);
    const data = await res.json();
    setSelectedPost(data);
  };

  const handleLike = async (e: React.MouseEvent, postId: number) => {
    e.stopPropagation();
    if (likedPosts.has(postId)) return;
    
    await fetch(`/api/blog/${postId}/like`, { method: 'POST' });
    setLikedPosts(new Set([...likedPosts, postId]));
    
    // Update local state
    setPosts(posts.map(p => p.id === postId ? { ...p, likes: (p.likes || 0) + 1 } : p));
    if (selectedPost?.id === postId) {
      setSelectedPost({ ...selectedPost, likes: (selectedPost.likes || 0) + 1 });
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost || !newCommentName || !newCommentText) return;

    await fetch(`/api/blog/${selectedPost.id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCommentName, comment: newCommentText })
    });

    setNewCommentName('');
    setNewCommentText('');
    
    // Refresh post to get new comments
    openPost(selectedPost);
  };

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-display font-bold text-gray-900 mb-6"
        >
          Blog
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-600"
        >
          Tips, strategies, and stories to help you learn English faster and better.
        </motion.p>
      </div>

      <div className="flex justify-end mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1 flex gap-1">
          <button
            onClick={() => setSort('newest')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${sort === 'newest' ? 'bg-brand-purple text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Newest
          </button>
          <button
            onClick={() => setSort('likes')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${sort === 'likes' ? 'bg-brand-purple text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Most Liked
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-purple"></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[2rem] border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-2">No posts yet</h3>
          <p className="text-gray-500">Check back soon for new articles!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all group flex flex-col cursor-pointer"
              onClick={() => openPost(post)}
            >
              <div className="aspect-video bg-gray-100 relative overflow-hidden">
                <img 
                  src={post.image_url || `https://picsum.photos/seed/blog${post.id}/600/400`} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-900 flex items-center gap-1">
                  <CalendarIcon className="w-3 h-3" />
                  {format(new Date(post.created_at), 'MMM d, yyyy')}
                </div>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <h2 className="text-2xl font-display font-bold text-gray-900 mb-4 line-clamp-2 group-hover:text-brand-purple transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-600 mb-6 line-clamp-3 flex-grow">
                  {post.summary}
                </p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-gray-500">
                    <button 
                      onClick={(e) => handleLike(e, post.id)}
                      className={`flex items-center gap-1.5 transition-colors ${likedPosts.has(post.id) ? 'text-red-500' : 'hover:text-red-500'}`}
                    >
                      <Heart className={`w-5 h-5 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                      <span className="text-sm font-medium">{post.likes || 0}</span>
                    </button>
                  </div>
                  <span className="inline-flex items-center gap-2 font-bold text-gray-900 group-hover:text-brand-purple transition-colors">
                    Read <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      {/* Full Article Modal */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPost(null)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={() => setSelectedPost(null)}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors shadow-sm"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="overflow-y-auto flex-grow">
                {selectedPost.image_url && (
                  <div className="w-full h-64 sm:h-80 relative">
                    <img src={selectedPost.image_url} alt={selectedPost.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                )}
                
                <div className="p-8 sm:p-12">
                  <div className="max-w-3xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                        <CalendarIcon className="w-4 h-4" />
                        {format(new Date(selectedPost.created_at), 'MMMM d, yyyy')}
                      </div>
                      <button 
                        onClick={(e) => handleLike(e, selectedPost.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${likedPosts.has(selectedPost.id) ? 'bg-red-50 border-red-100 text-red-500' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                      >
                        <Heart className={`w-5 h-5 ${likedPosts.has(selectedPost.id) ? 'fill-current' : ''}`} />
                        <span className="font-bold">{selectedPost.likes || 0} Likes</span>
                      </button>
                    </div>
                    
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-gray-900 mb-8 leading-tight">
                      {selectedPost.title}
                    </h1>
                    
                    <div className="prose prose-lg prose-brand max-w-none text-gray-600 mb-16">
                      <div className="markdown-body">
                        <Markdown>{selectedPost.content}</Markdown>
                      </div>
                    </div>

                    {/* Comments Section */}
                    <div className="border-t border-gray-200 pt-12">
                      <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                        <MessageCircle className="w-6 h-6" />
                        Comments ({selectedPost.comments?.length || 0})
                      </h3>

                      <form onSubmit={handleComment} className="bg-gray-50 p-6 rounded-2xl mb-10">
                        <h4 className="font-bold text-gray-900 mb-4">Leave a comment</h4>
                        <div className="space-y-4">
                          <input
                            type="text"
                            placeholder="Your Name"
                            value={newCommentName}
                            onChange={e => setNewCommentName(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-purple outline-none"
                          />
                          <textarea
                            placeholder="Your Comment"
                            value={newCommentText}
                            onChange={e => setNewCommentText(e.target.value)}
                            required
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-purple outline-none resize-none"
                          />
                          <button
                            type="submit"
                            className="flex items-center gap-2 bg-brand-purple text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors"
                          >
                            <Send className="w-4 h-4" />
                            Post Comment
                          </button>
                        </div>
                      </form>

                      <div className="space-y-6">
                        {selectedPost.comments?.map(comment => (
                          <div key={comment.id} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-bold text-gray-900">{comment.name}</h5>
                              <span className="text-sm text-gray-500">
                                {format(new Date(comment.created_at), 'MMM d, yyyy')}
                              </span>
                            </div>
                            <p className="text-gray-700">{comment.comment}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
