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
      fetchSettings(); // Refresh the image after upload
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploadingKey(null);
    }
  };

  if (loading) return <div className="animate-pulse flex gap-2 font-medium text-gray-600"><Loader2 className="animate-spin" /> Loading...</div>;

  const ImageRow = ({ title, settingKey, defaultImage }: { title: string, settingKey: string, defaultImage: string }) => (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        {/* Thumbnail Preview */}
        <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200">
          <img 
            src={settings[settingKey] || defaultImage} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500">Use the button on the right to change this image.</p>
        </div>
      </div>

      {/* Upload Button */}
      <label className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl cursor-pointer hover:bg-brand-purple transition-colors text-sm font-medium">
        {uploadingKey === settingKey ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
        {uploadingKey === settingKey ? 'Uploading...' : 'Change Image'}
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleImageUpload(settingKey, e.target.files[0]);
            }
          }}
        />
      </label>
    </div>
  );

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-display font-bold text-gray-900 mb-8 flex items-center gap-3">
        <ImageIcon className="w-8 h-8 text-brand-purple" />
        Manage Site Images
      </h1>
      
      <div className="flex flex-col gap-4">
        {/* Home Page Top Image */}
        <ImageRow 
          title="Home Page - Top Image" 
          settingKey="home_image_1" 
          defaultImage="/home_photo1.png" 
        />
        
        {/* Home Page Bottom Image */}
        <ImageRow 
          title="Home Page - Bottom Image" 
          settingKey="home_image_2" 
          defaultImage="/uploads/home_photo2.png" 
        />
        
        {/* About Page Image */}
        <ImageRow 
          title="About Page Image" 
          settingKey="about_image_1" 
          defaultImage="/about_photo1.png" 
        />
      </div>
    </div>
  );
}
