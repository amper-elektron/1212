import { useState, useEffect, useRef } from 'react';
import { Check, Trash2, Plus, Upload, Archive, RefreshCw, Edit2, X } from 'lucide-react';

interface Feedback {
  id: number;
  name: string;
  review: string;
  image_url: string;
  approved: boolean;
  archived: boolean;
}

export default function AdminFeedback() {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [newFeedback, setNewFeedback] = useState<Partial<Feedback>>({ name: '', review: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = () => {
    fetch('/api/admin/feedback', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setFeedbackList(data);
        } else {
          setFeedbackList([]);
        }
        setLoading(false);
      });
  };

  const handleApprove = async (id: number) => {
    await fetch(`/api/admin/feedback/${id}/approve`, { 
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
    });
    fetchFeedback();
  };

  const handleArchive = async (feedback: Feedback) => {
    await fetch(`/api/admin/feedback/${feedback.id}/archive`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      },
      body: JSON.stringify({ archived: !feedback.archived }),
    });
    fetchFeedback();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this review?')) {
      await fetch(`/api/admin/feedback/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
      fetchFeedback();
    }
  };

  const handleAdd = async () => {
    const formData = new FormData();
    formData.append('name', newFeedback.name || '');
    formData.append('review', newFeedback.review || '');
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `/api/admin/feedback/${isEditing}` : '/api/admin/feedback';

    await fetch(url, {
      method,
      headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` },
      body: formData,
    });
    
    setIsAdding(false);
    setIsEditing(null);
    setNewFeedback({ name: '', review: '' });
    setImageFile(null);
    fetchFeedback();
  };

  const handleEdit = (feedback: Feedback) => {
    setIsEditing(feedback.id);
    setNewFeedback(feedback);
    setIsAdding(true);
    setImageFile(null);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900">Manage Feedback</h1>
        <button
          onClick={() => { setIsAdding(true); setIsEditing(null); setNewFeedback({ name: '', review: '' }); setImageFile(null); }}
          className="flex items-center gap-2 bg-brand-purple text-white px-4 py-2 rounded-xl font-medium hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-5 h-5" /> Add Feedback
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-purple mb-8">
          <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit Feedback' : 'Add New Feedback'}</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Student Name"
              value={newFeedback.name || ''}
              onChange={e => setNewFeedback({ ...newFeedback, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-xl"
            />
            <textarea
              placeholder="Review Text"
              value={newFeedback.review || ''}
              onChange={e => setNewFeedback({ ...newFeedback, review: e.target.value })}
              className="w-full px-4 py-2 border rounded-xl"
              rows={3}
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Student Photo</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Choose Image
                </button>
                <span className="text-sm text-gray-500">
                  {imageFile ? imageFile.name : (newFeedback.image_url ? 'Current image will be kept' : 'No file chosen')}
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

            <div className="flex gap-2 justify-end">
              <button onClick={() => { setIsAdding(false); setIsEditing(null); }} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-xl">Cancel</button>
              <button onClick={handleAdd} className="px-4 py-2 bg-brand-purple text-white rounded-xl">Save Feedback</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {feedbackList.map(feedback => (
          <div key={feedback.id} className={`bg-white p-6 rounded-2xl shadow-sm border ${feedback.approved ? 'border-gray-100' : 'border-yellow-300 bg-yellow-50/30'} flex justify-between items-start`}>
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                <img 
                  src={feedback.image_url || `https://picsum.photos/seed/feedback${feedback.id}/100/100`} 
                  alt={feedback.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{feedback.name}</h3>
                  {!feedback.approved && (
                    <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full uppercase tracking-wider">
                      Pending Approval
                    </span>
                  )}
                </div>
                <p className="text-gray-600">{feedback.review}</p>
              </div>
            </div>
            <div className="flex gap-2 ml-4 flex-shrink-0">
              {!feedback.approved && (
                <button
                  onClick={() => handleApprove(feedback.id)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Approve"
                >
                  <Check className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => handleArchive(feedback)}
                className={`p-2 rounded-lg transition-colors ${feedback.archived ? 'text-green-600 hover:bg-green-50' : 'text-orange-600 hover:bg-orange-50'}`}
                title={feedback.archived ? "Unarchive" : "Archive"}
              >
                {feedback.archived ? <RefreshCw className="w-5 h-5" /> : <Archive className="w-5 h-5" />}
              </button>
              <button
                onClick={() => handleEdit(feedback)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(feedback.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
        {feedbackList.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-500">No feedback received yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
