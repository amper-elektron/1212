import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

export default function AdminFAQ() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentFaq, setCurrentFaq] = useState<Partial<FAQ>>({});

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = () => {
    fetch('/api/faq')
      .then(res => res.json())
      .then(data => setFaqs(data));
  };

  const handleAdd = () => {
    setCurrentFaq({});
    setIsEditing(true);
  };

  const handleEdit = (faq: FAQ) => {
    setCurrentFaq(faq);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this FAQ?')) {
      await fetch(`/api/admin/faq/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
      fetchFaqs();
    }
  };

  const handleSave = async () => {
    const method = currentFaq.id ? 'PUT' : 'POST';
    const url = currentFaq.id ? `/api/admin/faq/${currentFaq.id}` : '/api/admin/faq';
    
    await fetch(url, {
      method,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      },
      body: JSON.stringify(currentFaq)
    });
    
    setIsEditing(false);
    fetchFaqs();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage FAQ</h1>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-brand-purple text-white px-4 py-2 rounded-xl font-medium hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add FAQ
        </button>
      </div>

      {isEditing && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-purple mb-8">
          <h2 className="text-xl font-bold mb-4">{currentFaq.id ? 'Edit FAQ' : 'New FAQ'}</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Question"
              value={currentFaq.question || ''}
              onChange={e => setCurrentFaq({...currentFaq, question: e.target.value})}
              className="w-full px-4 py-2 border rounded-xl"
            />
            <textarea
              placeholder="Answer"
              value={currentFaq.answer || ''}
              onChange={e => setCurrentFaq({...currentFaq, answer: e.target.value})}
              className="w-full px-4 py-2 border rounded-xl h-32"
            />
            <div className="flex gap-4">
              <button onClick={handleSave} className="px-4 py-2 bg-brand-purple text-white rounded-xl">Save FAQ</button>
              <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-xl">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-medium text-gray-500">Question</th>
              <th className="px-6 py-4 font-medium text-gray-500">Answer</th>
              <th className="px-6 py-4 font-medium text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {faqs.map(faq => (
              <tr key={faq.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{faq.question}</td>
                <td className="px-6 py-4 text-gray-600 truncate max-w-xs">{faq.answer}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleEdit(faq)} className="text-brand-blue hover:text-blue-700 mr-3">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(faq.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
