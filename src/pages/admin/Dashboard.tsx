import { useState, useEffect } from 'react';
import { FileText, MessageSquare, TrendingUp, Heart, MessageCircle } from 'lucide-react';

interface Stats {
  pendingRequests: number;
}

interface Analytics {
  blog: {
    totalPosts: number;
    totalLikes: number;
    totalComments: number;
  };
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, analyticsRes] = await Promise.all([
        fetch('/api/admin/stats', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
        }),
        fetch('/api/admin/analytics', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
        })
      ]);
      
      const statsData = await statsRes.json();
      const analyticsData = await analyticsRes.json();
      
      setStats(statsData);
      setAnalytics(analyticsData);
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !stats) {
    return <div className="animate-pulse flex space-x-4 p-8">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-display font-bold text-gray-900 mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-yellow/20 text-brand-yellow flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Requests</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats?.pendingRequests || 0}</h3>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Blog Engagement */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-8">
            <TrendingUp className="w-6 h-6 text-brand-purple" />
            Blog Engagement
          </h2>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="w-10 h-10 mx-auto bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-2">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900">{analytics?.blog.totalPosts || 0}</h4>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-1">Posts</p>
            </div>
            
            <div className="text-center p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="w-10 h-10 mx-auto bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-2">
                <Heart className="w-5 h-5" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900">{analytics?.blog.totalLikes || 0}</h4>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-1">Likes</p>
            </div>
            
            <div className="text-center p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="w-10 h-10 mx-auto bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900">{analytics?.blog.totalComments || 0}</h4>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-1">Comments</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
