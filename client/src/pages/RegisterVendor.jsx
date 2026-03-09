import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FaStore, FaArrowLeft, FaCamera, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

export default function RegisterVendor() {
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    businessName: '',
    businessDescription: '',
    businessAddress: '',
    taxId: '',
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setError(null);
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const fd = new FormData();
      fd.append('businessName', formData.businessName);
      fd.append('businessDescription', formData.businessDescription);
      fd.append('businessAddress', formData.businessAddress);
      fd.append('taxId', formData.taxId);
      if (file) fd.append('businessLogo', file);

      const apiBase = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${apiBase}/api/user/register-vendor`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${currentUser?.token || ''}` },
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');

      setSuccess(true);
      setTimeout(() => navigate('/profile'), 2500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Start Selling | Nguzza Marketplace</title>
      </Helmet>

      <main className="min-h-screen bg-[#fafbfc] pb-28 sm:pb-12 flex items-start sm:items-center justify-center py-6 sm:py-12 px-4">
        <div className="w-full max-w-lg">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-emerald-600 text-xs font-bold uppercase tracking-widest transition-all mb-6 group">
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" size={10} /> Back to Marketplace
          </Link>

          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                <FaStore className="text-emerald-600 text-2xl" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">Start Selling</h1>
              <p className="text-gray-400 font-medium text-sm">Register your farm or business on Nguzza</p>
            </div>

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-700 rounded-2xl flex items-center gap-3 font-bold text-sm">
                <FaCheckCircle className="text-lg flex-shrink-0" /> Application submitted! Redirecting to your profile...
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl flex items-center gap-3 font-bold text-sm">
                <FaExclamationCircle className="text-red-400 flex-shrink-0" /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">Business / Farm Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Mukono Fresh Farms"
                  id="businessName"
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-100 bg-gray-50/50 p-4 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none font-bold text-gray-700 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">Description *</label>
                <textarea
                  placeholder="Describe what you sell or the services you provide..."
                  id="businessDescription"
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full border border-gray-100 bg-gray-50/50 p-4 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none font-bold text-gray-700 transition-all resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">Location / Address *</label>
                <input
                  type="text"
                  placeholder="e.g. Mukono, Central Region"
                  id="businessAddress"
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-100 bg-gray-50/50 p-4 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none font-bold text-gray-700 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">Tax / TIN Number (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 1234567890"
                  id="taxId"
                  onChange={handleChange}
                  className="w-full border border-gray-100 bg-gray-50/50 p-4 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none font-bold text-gray-700 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">Business Logo (Optional)</label>
                <label className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-emerald-400 transition-colors bg-gray-50/30">
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-14 h-14 rounded-xl object-cover" />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
                      <FaCamera size={18} />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-bold text-gray-700">{file ? file.name : 'Upload logo image'}</p>
                    <p className="text-[10px] text-gray-400 font-medium">JPG, PNG up to 5MB</p>
                  </div>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              </div>

              <button
                disabled={loading || success}
                type="submit"
                className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all shadow-lg shadow-emerald-600/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
