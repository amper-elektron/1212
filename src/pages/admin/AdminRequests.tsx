import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CheckCircle2, Clock, XCircle, Edit2, Check, X, Trash2 } from 'lucide-react';

interface Request {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  email: string | null;
  service: string;
  message: string | null;
  status: 'Pending' | 'Accepted' | 'Rejected';
  created_at: string;
}

export default function AdminRequests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Request>>({});

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = () => {
    fetch('/api/admin/requests', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
    })
      .then(res => res.json())
      .then(data => {
        setRequests(data);
        setLoading(false);
      });
  };

  const updateStatus = async (id: number, status: string) => {
    await fetch(`/api/admin/requests/${id}/status`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      },
      body: JSON.stringify({ status }),
    });
    fetchRequests();
  };

  const handleSave = async (id: number) => {
    await fetch(`/api/admin/requests/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      },
      body: JSON.stringify(editForm),
    });
    setIsEditing(null);
    fetchRequests();
  };

  // YENİ EKLENEN SİLME FONKSİYONU
  const handleDelete = async (id: number) => {
    if (window.confirm('Bu isteği silmek istediğinize emin misiniz?')) {
      await fetch(`/api/admin/requests/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
      fetchRequests();
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-display font-bold text-gray-900 mb-8">Student Requests</h1>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm uppercase tracking-wider">
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Student</th>
              <th className="p-4 font-medium">Contact</th>
              <th className="p-4 font-medium">Service</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {requests.map(req => (
              <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                {isEditing === req.id ? (
                  <td colSpan={6} className="p-4">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <input
                        type="text"
                        placeholder="First Name"
                        value={editForm.first_name || ''}
                        onChange={e => setEditForm({ ...editForm, first_name: e.target.value })}
                        className="w-full px-4 py-2 border rounded-xl"
                      />
                      <input
                        type="text"
                        placeholder="Last Name"
                        value={editForm.last_name || ''}
                        onChange={e => setEditForm({ ...editForm, last_name: e.target.value })}
                        className="w-full px-4 py-2 border rounded-xl"
                      />
                      <input
                        type="text"
                        placeholder="Phone"
                        value={editForm.phone || ''}
                        onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                        className="w-full px-4 py-2 border rounded-xl"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={editForm.email || ''}
                        onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full px-4 py-2 border rounded-xl"
                      />
                      <input
                        type="text"
                        placeholder="Service"
                        value={editForm.service || ''}
                        onChange={e => setEditForm({ ...editForm, service: e.target.value })}
                        className="w-full px-4 py-2 border rounded-xl col-span-2"
                      />
                      <textarea
                        placeholder="Message"
                        value={editForm.message || ''}
                        onChange={e => setEditForm({ ...editForm, message: e.target.value })}
                        className="w-full px-4 py-2 border rounded-xl col-span-2"
                        rows={2}
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => setIsEditing(null)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
                      <button onClick={() => handleSave(req.id)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg"><Check className="w-5 h-5" /></button>
                    </div>
                  </td>
                ) : (
                  <>
                    <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                      {format(new Date(req.created_at), 'MMM d, yyyy HH:mm')}
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{req.first_name} {req.last_name}</div>
                      {req.message && <div className="text-sm text-gray-500 truncate max-w-[200px]" title={req.message}>{req.message}</div>}
                    </td>
                    <td className="p-4 text-sm">
                      <div className="text-gray-900">{req.phone}</div>
                      <div className="text-gray-500">{req.email}</div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-gray-800 text-white shadow-sm">
                        {req.service}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        req.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        req.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {req.status === 'Pending' && <Clock className="w-3 h-3" />}
                        {req.status === 'Accepted' && <CheckCircle2 className="w-3 h-3" />}
                        {req.status === 'Rejected' && <XCircle className="w-3 h-3" />}
                        {req.status}
                      </span>
                    </td>
                    <td className="p-4 text-right flex items-center justify-end gap-2">
                      <select
                        value={req.status}
                        onChange={(e) => updateStatus(req.id, e.target.value)}
                        className="text-sm border border-gray-200 rounded-lg px-2 py-1 bg-white outline-none focus:ring-2 focus:ring-brand-purple"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                      <button
                        onClick={() => { setIsEditing(req.id); setEditForm(req); }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {/* YENİ EKLENEN SİLME BUTONU */}
                      <button
                        onClick={() => handleDelete(req.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  No requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
