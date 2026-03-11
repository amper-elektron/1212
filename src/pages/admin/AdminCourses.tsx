import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X, Archive, RefreshCw } from 'lucide-react';

interface Course {
  id: number;
  title: string;
  description: string;
  target_audience: string;
  active: boolean;
  archived: boolean;
}

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Course>>({});
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = () => {
    fetch('/api/admin/courses', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCourses(data);
        } else {
          console.error('Expected array of courses, got:', data);
          setCourses([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch admin courses:', err);
        setCourses([]);
        setLoading(false);
      });
  };

  const handleSave = async (id: number) => {
    await fetch(`/api/admin/courses/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      },
      body: JSON.stringify(editForm),
    });
    setIsEditing(null);
    fetchCourses();
  };

  const handleAdd = async () => {
    await fetch('/api/admin/courses', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      },
      body: JSON.stringify(editForm),
    });
    setIsAdding(false);
    setEditForm({});
    fetchCourses();
  };

  const toggleActive = async (course: Course) => {
    await fetch(`/api/admin/courses/${course.id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      },
      body: JSON.stringify({ ...course, active: !course.active }),
    });
    fetchCourses();
  };

  const toggleArchive = async (course: Course) => {
    await fetch(`/api/admin/courses/${course.id}/archive`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      },
      body: JSON.stringify({ archived: !course.archived }),
    });
    fetchCourses();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this course?')) {
      await fetch(`/api/admin/courses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
      fetchCourses();
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900">Manage Courses</h1>
        <button
          onClick={() => { setIsAdding(true); setEditForm({ active: true }); }}
          className="flex items-center gap-2 bg-brand-purple text-white px-4 py-2 rounded-xl font-medium hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-5 h-5" /> Add Course
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-purple mb-8">
          <h2 className="text-xl font-bold mb-4">Add New Course</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Course Title"
              value={editForm.title || ''}
              onChange={e => setEditForm({ ...editForm, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-xl"
            />
            <input
              type="text"
              placeholder="Target Audience"
              value={editForm.target_audience || ''}
              onChange={e => setEditForm({ ...editForm, target_audience: e.target.value })}
              className="w-full px-4 py-2 border rounded-xl"
            />
            <textarea
              placeholder="Description"
              value={editForm.description || ''}
              onChange={e => setEditForm({ ...editForm, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-xl"
              rows={3}
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-xl">Cancel</button>
              <button onClick={handleAdd} className="px-4 py-2 bg-brand-purple text-white rounded-xl">Save Course</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm uppercase tracking-wider">
              <th className="p-4 font-medium">Title</th>
              <th className="p-4 font-medium">Audience</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {courses.map(course => (
              <tr key={course.id} className="hover:bg-gray-50/50 transition-colors">
                {isEditing === course.id ? (
                  <td colSpan={4} className="p-4">
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={editForm.title || ''}
                        onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                        className="w-full px-4 py-2 border rounded-xl"
                      />
                      <input
                        type="text"
                        value={editForm.target_audience || ''}
                        onChange={e => setEditForm({ ...editForm, target_audience: e.target.value })}
                        className="w-full px-4 py-2 border rounded-xl"
                      />
                      <textarea
                        value={editForm.description || ''}
                        onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                        className="w-full px-4 py-2 border rounded-xl"
                        rows={2}
                      />
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => setIsEditing(null)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
                        <button onClick={() => handleSave(course.id)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg"><Check className="w-5 h-5" /></button>
                      </div>
                    </div>
                  </td>
                ) : (
                  <>
                    <td className="p-4 font-medium text-gray-900">{course.title}</td>
                    <td className="p-4 text-gray-600">{course.target_audience}</td>
                    <td className="p-4">
                      <button
                        onClick={() => toggleActive(course)}
                        className={`px-3 py-1 rounded-full text-xs font-bold ${course.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                      >
                        {course.active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => toggleArchive(course)}
                        className={`p-2 rounded-lg transition-colors mr-2 ${course.archived ? 'text-green-600 hover:bg-green-50' : 'text-orange-600 hover:bg-orange-50'}`}
                        title={course.archived ? "Unarchive" : "Archive"}
                      >
                        {course.archived ? <RefreshCw className="w-5 h-5" /> : <Archive className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => { setIsEditing(course.id); setEditForm(course); }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors mr-2"
                        title="Edit"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(course.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
