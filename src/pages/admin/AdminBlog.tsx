import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Calendar, Edit, Image as ImageIcon, Link as LinkIcon, Upload, Archive, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

interface BlogPost {
  id: number;
  title: string;
  summary: string;
  content: string;
  image_url: string;
  created_at: string;
  archived: boolean;
}

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentInputRef = useRef<HTMLTextAreaElement>(null);
  const contentImageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = () => {
    fetch('/api/admin/blog', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPosts(data);
        } else {
          setPosts([]);
        }
        setLoading(false);
      });
  };

  const handleAdd = () => {
    setCurrentPost({});
    setImageFile(null);
    setIsEditing(true);
  };

  const handleEdit = (post: BlogPost) => {
    setCurrentPost(post);
    setImageFile(null);
    setIsEditing(true);
  };

  const handleArchive = async (post: BlogPost) => {
    await fetch(`/api/admin/blog/${post.id}/archive`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      },
      body: JSON.stringify({ archived: !post.archived }),
    });
    fetchPosts();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this post?')) {
      await fetch(`/api/admin/blog/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
      fetchPosts();
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('title', currentPost.title || '');
    formData.append('summary', currentPost.summary || '');
    formData.append('content', currentPost.content || '');
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const method = currentPost.id ? 'PUT' : 'POST';
    const url = currentPost.id ? `/api/admin/blog/${currentPost.id}` : '/api/admin/blog';

    await fetch(url, {
      method,
      headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` },
      body: formData,
    });
    
    setIsEditing(false);
    fetchPosts();
  };

  const insertText = (before: string, after: string) => {
    if (!contentInputRef.current) return;
    const start = contentInputRef.current.selectionStart;
    const end = contentInputRef.current.selectionEnd;
    const text = currentPost.content || '';
    const newText = text.substring(0, start) + before + text.substring(start, end) + after + text.substring(end);
    setCurrentPost({ ...currentPost, content: newText });
    
    setTimeout(() => {
      if (contentInputRef.current) {
        contentInputRef.current.focus();
        contentInputRef.current.setSelectionRange(start + before.length, end + before.length);
      }
    }, 0);
  };

  const handleAddLink = () => {
    const url = prompt('Enter link URL:');
    if (url) {
      insertText('[', `](${url})`);
    }
  };

  const handleContentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` },
        body: formData
      });
      const data = await res.json();
      if (data.url) {
        insertText(`![Image description](${data.url})`, '');
      }
    } catch (err) {
      alert('Failed to upload image');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900">Manage Blog</h1>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-brand-purple text-white px-4 py-2 rounded-xl font-medium hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-5 h-5" /> Write Post
        </button>
      </div>

      {isEditing && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-purple mb-8">
          <h2 className="text-xl font-bold mb-4">{currentPost.id ? 'Edit Post' : 'New Blog Post'}</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Post Title"
              value={currentPost.title || ''}
              onChange={e => setCurrentPost({ ...currentPost, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-xl"
            />
            <textarea
              placeholder="Post Summary"
              value={currentPost.summary || ''}
              onChange={e => setCurrentPost({ ...currentPost, summary: e.target.value })}
              className="w-full px-4 py-2 border rounded-xl"
              rows={2}
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Choose Image
                </button>
                <span className="text-sm text-gray-500">
                  {imageFile ? imageFile.name : (currentPost.image_url ? 'Current image will be kept' : 'No file chosen')}
                </span>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={e => setImageFile(e.target.files?.[0] || null)}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>

            <div className="border rounded-xl overflow-hidden">
              <textarea
                ref={contentInputRef}
                placeholder="Post Content (Markdown supported)"
                value={currentPost.content || ''}
                onChange={e => setCurrentPost({ ...currentPost, content: e.target.value })}
                className="w-full px-4 py-4 outline-none"
                rows={10}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-xl">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 bg-brand-purple text-white rounded-xl">Save Post</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {posts.map(post => (
          <div key={post.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-start">
            <div className="flex gap-4">
              {post.image_url && (
                <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                  <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(post.created_at), 'MMM d, yyyy')}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
                <p className="text-gray-600 line-clamp-2">{post.summary}</p>
              </div>
            </div>
            <div className="flex gap-2 ml-4 flex-shrink-0">
              <button
                onClick={() => handleArchive(post)}
                className={`p-2 rounded-lg transition-colors ${post.archived ? 'text-green-600 hover:bg-green-50' : 'text-orange-600 hover:bg-orange-50'}`}
                title={post.archived ? "Unarchive" : "Archive"}
              >
                {post.archived ? <RefreshCw className="w-5 h-5" /> : <Archive className="w-5 h-5" />}
              </button>
              <button
                onClick={() => handleEdit(post)}
                className="p-2 text-brand-blue hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(post.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
