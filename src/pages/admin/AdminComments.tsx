import { useState, useEffect } from 'react';
import { Check, Trash2 } from 'lucide-react';

interface Comment {
  id: number;
  post_title: string;
  name: string;
  comment: string;
  approved: number;
  created_at: string;
}

export default function AdminComments() {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = () => {
    fetch('/api/admin/comments', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
    })
    .then(res => res.json())
    .then(data => setComments(data));
  };

  const approveComment = async (id: number) => {
    await fetch(`/api/admin/comments/${id}/approve`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
    });
    fetchComments();
  };

  const deleteComment = async (id: number) => {
    if (window.confirm('Delete this comment?')) {
      await fetch(`/api/admin/comments/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
      fetchComments();
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-display font-bold text-gray-900 mb-8">Blog Comments</h1>
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4">Post</th>
              <th className="p-4">Name</th>
              <th className="p-4">Comment</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {comments.map(c => (
              <tr key={c.id}>
                <td className="p-4 text-sm font-medium">{c.post_title}</td>
                <td className="p-4 text-sm">{c.name}</td>
                <td className="p-4 text-sm text-gray-600 max-w-xs truncate">{c.comment}</td>
                <td className="p-4">
                  {c.approved === 1 ? (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Approved</span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold">Pending</span>
                  )}
                </td>
                <td className="p-4 text-right flex justify-end gap-2">
                  {c.approved === 0 && (
                    <button onClick={() => approveComment(c.id)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Approve">
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => deleteComment(c.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {comments.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-gray-500">No comments found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
