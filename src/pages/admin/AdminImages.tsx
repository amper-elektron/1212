import { useState, useEffect } from 'react';
import { Upload, Loader2, Image as ImageIcon } from 'lucide-react';

export default function AdminImages() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = () => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setLoading(false);
      });
  };

  const handleImageUpload = async (key: string, file: File) => {
    setUploadingKey(key);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('key', key);

    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: formData
      });
      fetchSettings(); // Yükleme bitince yeni resmi ekrana getir
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploadingKey(null);
    }
  };

  if (loading) return <div className="animate-pulse">Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-display font-bold text-gray-900 mb-8 flex items-center gap-3">
        <ImageIcon className="w-8 h-8 text-brand-purple" />
        Manage Home Images
      </h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Ana Sayfa Üst Resim */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-4">Home Page - Top Image</h2>
          <div className="aspect-[4/5] bg-gray-100 rounded-xl overflow-hidden mb-4 relative shadow-inner">
            <img 
              src={settings['home_image_1'] || '/home_photo1.png'} 
              alt="Home Top" 
              className="w-full h-full object-cover"
            />
          </div>
          <label className="flex items-center justify-center gap-2 w-full bg-brand-purple text-white px-4 py-3 rounded-xl cursor-pointer hover:bg-purple-700 transition">
            {uploadingKey === 'home_image_1' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
            {uploadingKey === 'home_image_1' ? 'Uploading...' : 'Change Image'}
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleImageUpload('home_image_1', e.target.files[0]);
                }
              }}
            />
          </label>
        </div>

        {/* Ana Sayfa Alt Resim */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-4">Home Page - Bottom Image</h2>
          <div className="aspect-square bg-gray-100 rounded-[3rem] overflow-hidden mb-4 relative shadow-inner">
            <img 
              src={settings['home_image_2'] || '/uploads/home_photo2.png'} 
              alt="Home Bottom" 
              className="w-full h-full object-cover"
            />
          </div>
          <label className="flex items-center justify-center gap-2 w-full bg-gray-900 text-white px-4 py-3 rounded-xl cursor-pointer hover:bg-gray-800 transition">
            {uploadingKey === 'home_image_2' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
            {uploadingKey === 'home_image_2' ? 'Uploading...' : 'Change Image'}
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleImageUpload('home_image_2', e.target.files[0]);
                }
              }}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
