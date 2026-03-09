import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { FaCheck, FaTimes, FaShieldAlt } from 'react-icons/fa';

export default function AdminProductModeration() {
  const { currentUser } = useSelector((state) => state.user);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPendingProducts();
  }, [currentUser?.token]);

  const fetchPendingProducts = async () => {
    try {
      setLoading(true);
      const apiBase = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${apiBase}/api/admin/products?moderationStatus=pending`, {
        headers: { Authorization: `Bearer ${currentUser?.token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch products');
      setProducts(data.products || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleModeration = async (productId, status, reason = '') => {
    try {
      const apiBase = import.meta.env.VITE_API_URL || '';
      const endpoint = status === 'approved' ? 'approve' : 'reject';
      const res = await fetch(`${apiBase}/api/admin/products/${productId}/${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser?.token}`
        },
        body: JSON.stringify({ reason })
      });
      if (!res.ok) throw new Error(`Failed to ${endpoint}`);
      setProducts(products.filter(p => p._id !== productId));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className='p-4 sm:p-6 max-w-7xl mx-auto min-h-screen bg-gray-50 pb-28'>
      <Helmet>
        <title>Product Moderation | Nguzza Admin</title>
      </Helmet>

      <div className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-10">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-600 text-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
          <FaShieldAlt size={18} />
        </div>
        <div>
          <h1 className='text-2xl sm:text-3xl font-black text-gray-900'>Pending Reapproval</h1>
          <p className="text-gray-500 text-sm font-medium">Review edited/new listings and approve them to go live</p>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <div className="animate-spin h-10 w-10 border-4 border-emerald-600 border-t-transparent rounded-full" />
        </div>
      )}

      {error && <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 font-bold mb-8">{error}</div>}

      {!loading && products.length === 0 && (
        <div className="bg-white rounded-[2.5rem] p-20 text-center border-2 border-dashed border-gray-100">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-xl font-black text-gray-800">Queue is empty</h3>
          <p className="text-gray-500 mt-2">All products have been moderated. Good job!</p>
        </div>
      )}

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8'>
        {products.map((p) => (
          <div key={p._id} className='bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all group ring-1 ring-gray-100'>
            <div className="h-56 relative overflow-hidden">
              <img src={p.imageUrls?.[0] || "/favicon.png"} alt={p.name} className='w-full h-full object-cover transition-transform group-hover:scale-105 duration-700' />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-widest italic">
                {p.category}
              </div>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h2 className='text-xl font-black text-gray-900 line-clamp-1'>{p.name}</h2>
                <span className='text-sm font-black text-emerald-600'>UGX {p.regularPrice.toLocaleString()}</span>
              </div>
              <p className='text-gray-500 text-xs font-medium line-clamp-3 mb-4 leading-relaxed'>{p.description}</p>

              <label className="mb-4 flex items-center gap-2 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100 px-3 py-2 rounded-xl">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-emerald-600"
                  checked={false}
                  onChange={() => handleModeration(p._id, 'approved')}
                />
                Pending Reapproval (tick to approve)
              </label>

              <div className="pt-4 border-t border-gray-50 flex gap-3">
                <button onClick={() => handleModeration(p._id, 'approved')} className='flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 hover:scale-105 active:scale-95 transition-all'>
                  <FaCheck /> Mark Approved
                </button>
                <button onClick={() => {
                  const reason = prompt('Rejection reason:');
                  if (reason !== null) handleModeration(p._id, 'rejected', reason);
                }} className='flex-1 bg-white text-red-600 py-4 rounded-2xl font-black text-xs border-2 border-red-50 hover:bg-red-50 active:scale-95 transition-all'>
                  <FaTimes /> Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
