import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async'; // SEO İÇİN EKLENDİ
import { Send, Instagram, MessageCircle, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [searchParams] = useSearchParams();
  const preselectedService = searchParams.get('service') || '';

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    service: preselectedService,
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [courses, setCourses] = useState<{title: string}[]>([]);

  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCourses(data);
        }
      })
      .catch(err => console.error('Failed to fetch courses:', err));
  }, []);

  const serviceOptions = [...courses.map(c => c.title),  'Other'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setStatus('success');
        setFormData({
          first_name: '', last_name: '', phone: '', email: '', service: '', message: ''
        });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <>
      {/* GOOGLE SEO KODLARI: ASMAR HOCANIN İSİMLERİ ÖZELLİKLE VURGULANDI */}
      <Helmet>
        <title>Əlaqə | English with Asmar | Əsmər Bürcəliyeva</title>
        <meta name="description" content="English with Asmar - Əsmər Bürcəliyeva ilə əlaqə saxlayın. İngilis dili kursları, speaking club və fərdi dərslər üçün Asmar Burjaliyeva ilə əlaqəyə keçin." />
        <meta name="keywords" content="Əsmər Bürcəliyeva əlaqə, Asmar Burjaliyeva contact, English with Asmar, ingilis dili müəllimi, speaking club baku" />
      </Helmet>

      <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold text-gray-900 mb-6">
              Let's get in touch!
            </h1>
            <p className="text-xl text-gray-600 mb-12">
              Have questions about a course? Want to book a consultation? Fill out the form or reach out directly.
            </p>

            <div className="space-y-8">
              <a href="https://wa.me/+994509742636" target="_blank" rel="noopener noreferrer" className="flex items-center gap-6 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-[#25D366] hover:shadow-md transition-all group">
                <div className="w-14 h-14 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">WhatsApp</h3>
                  <p className="text-gray-500">+994 50 974 26 36</p>
                </div>
              </a>
              
              <a href="https://t.me/boostyourenglishwithasmar" target="_blank" rel="noopener noreferrer" className="flex items-center gap-6 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-[#0088cc] hover:shadow-md transition-all group">
                <div className="w-14 h-14 rounded-full bg-[#0088cc]/10 text-[#0088cc] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Send className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Telegram</h3>
                  <p className="text-gray-500">@boostyourenglishwithasmar</p>
                </div>
              </a>
              
              <a href="https://www.instagram.com/asmarburjaliyeva/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-6 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-[#E1306C] hover:shadow-md transition-all group">
                <div className="w-14 h-14 rounded-full bg-[#E1306C]/10 text-[#E1306C] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Instagram className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Instagram</h3>
                  <p className="text-gray-500">@asmarburjaliyeva</p>
                </div>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 md:p-10 rounded-[2rem] shadow-xl border border-gray-100 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-yellow/20 rounded-bl-full -z-10" />
            
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-8">Send a Request</h2>
            
            {status === 'success' ? (
              <div className="bg-green-50 text-green-800 p-6 rounded-2xl text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Request Sent!</h3>
                <p>Thanks for reaching out. I'll get back to you as soon as possible via WhatsApp or Telegram.</p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="mt-6 text-green-700 font-medium underline"
                >
                  Send another request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                    <input
                      required
                      type="text"
                      value={formData.first_name}
                      onChange={e => setFormData({...formData, first_name: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none transition-all"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                    <input
                      required
                      type="text"
                      value={formData.last_name}
                      onChange={e => setFormData({...formData, last_name: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none transition-all"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none transition-all"
                      placeholder="+1 234 567 890"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email (Optional)</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">Interested In *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {serviceOptions.map((service) => (
                      <button
                        key={service}
                        type="button"
                        onClick={() => setFormData({...formData, service})}
                        className={`px-4 py-3 rounded-xl border text-left transition-all ${
                          formData.service === service 
                            ? 'border-brand-purple bg-brand-purple/5 text-brand-purple font-bold shadow-sm' 
                            : 'border-gray-200 text-gray-600 hover:border-brand-purple/30 hover:bg-gray-50'
                        }`}
                      >
                        {service}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Tell me a bit about your goals..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-purple transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
                >
                  {status === 'submitting' ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>Send Request <Send className="w-5 h-5" /></>
                  )}
                </button>
                {status === 'error' && (
                  <p className="text-red-500 text-sm text-center mt-2">Something went wrong. Please try again.</p>
                )}
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
}
