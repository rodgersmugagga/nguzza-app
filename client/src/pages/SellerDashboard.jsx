import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaBox, FaChartLine, FaClipboardList, FaPlus, FaTrashAlt, FaPen } from 'react-icons/fa';

export default function SellerDashboard() {
  const { currentUser } = useSelector((state) => state.user);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyProducts();
  }, [currentUser.token]);

  const fetchMyProducts = async () => {
    try {
      const res = await fetch('/api/products/view/myproducts', {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setProducts(Array.isArray(data) ? data : data.products || []);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error(error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const res = await fetch(`/api/products/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${currentUser.token}` }
        });
        if (res.ok) {
          setProducts(products.filter((product) => product._id !== id));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] px-4 pt-6 sm:pt-12 pb-28 sm:pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4 sm:gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Seller Dashboard</h1>
            <p className="text-gray-500 mt-1 sm:mt-2 font-medium text-sm">Manage your farm inventory and track performance</p>
          </div>
          <Link to="/add-product" className="btn-primary flex items-center gap-2 shadow-lg shadow-emerald-600/20 hover:scale-105 transition-all active:scale-95">
            <FaPlus /> Post New Product
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-8 sm:mb-12">
          <div className="bg-white p-4 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100">
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-blue-50 text-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-6">
              <FaBox size={16} className="sm:hidden" />
              <FaBox size={24} className="hidden sm:block" />
            </div>
            <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5 sm:mb-1">Listed</p>
            <h4 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tighter">{products.length}</h4>
          </div>
          <div className="bg-white p-4 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100">
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-emerald-50 text-emerald-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-6">
              <FaChartLine size={16} className="sm:hidden" />
              <FaChartLine size={24} className="hidden sm:block" />
            </div>
            <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5 sm:mb-1">Views</p>
            <h4 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tighter">
              {products.reduce((acc, p) => acc + (p.views || 0), 0)}
            </h4>
          </div>
          <div className="bg-white p-4 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100">
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-amber-50 text-amber-600 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-6">
              <FaClipboardList size={16} className="sm:hidden" />
              <FaClipboardList size={24} className="hidden sm:block" />
            </div>
            <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5 sm:mb-1">Inquiries</p>
            <h4 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tighter">
              {products.reduce((acc, p) => acc + (p.contactClicks || 0), 0)}
            </h4>
          </div>
        </div>

        {/* Inventory List */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-3">
              <div className="w-1.5 h-8 bg-emerald-600 rounded-full" />
              Your Inventory
            </h3>
          </div>

          {loading ? (
            <div className="p-20 text-center"><div className="animate-spin h-10 w-10 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto" /></div>
          ) : products.length === 0 ? (
            <div className="p-12 sm:p-20 text-center">
              <div className="text-6xl mb-4">🪴</div>
              <h4 className="text-xl font-black text-gray-800">Your store is empty</h4>
              <p className="text-gray-500 mt-2 mb-8 text-sm">Start your selling journey by adding your first product!</p>
              <Link to="/add-product" className="btn-primary">Get Started</Link>
            </div>
          ) : (
            <>
              {/* Mobile Card Layout */}
              <div className="sm:hidden divide-y divide-gray-50">
                {products.map((p) => (
                  <div key={p._id} className="p-4 flex gap-3 items-center">
                    <Link to={`/product/${p._id}`} className="flex-shrink-0">
                      <img src={p.imageUrls?.[0] || "/favicon.png"} alt={p.name} className="w-16 h-16 rounded-xl object-cover bg-gray-50" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${p._id}`} className="font-bold text-gray-900 text-sm line-clamp-1 hover:text-emerald-700">{p.name}</Link>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{p.category} • {p.subCategory}</p>
                      <p className="text-sm font-black text-emerald-600 mt-1">UGX {p.regularPrice?.toLocaleString()}</p>
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <Link to={`/update-product/${p._id}`} className="p-2.5 bg-gray-50 text-gray-500 hover:text-emerald-600 rounded-xl transition-all active:scale-90">
                        <FaPen size={12} />
                      </Link>
                      <button onClick={() => handleDelete(p._id)} className="p-2.5 bg-gray-50 text-gray-400 hover:text-red-500 rounded-xl transition-all active:scale-90">
                        <FaTrashAlt size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    <tr>
                      <th className="px-8 py-6">Product Item</th>
                      <th className="px-8 py-6">Category</th>
                      <th className="px-8 py-6">Price</th>
                      <th className="px-8 py-6">Status</th>
                      <th className="px-8 py-6 text-right">Settings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {products.map((p) => (
                      <tr key={p._id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <img src={p.imageUrls?.[0] || "/favicon.png"} alt={p.name} className="w-14 h-14 rounded-2xl object-cover bg-gray-50 shadow-sm" />
                            <div>
                              <Link to={`/product/${p._id}`} className="font-black text-gray-900 hover:text-emerald-700 transition-colors line-clamp-1">{p.name}</Link>
                              <p className="text-[10px] font-bold text-gray-400 mt-0.5 uppercase tracking-wider">{p.subCategory}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-xs font-black text-gray-700">{p.category}</td>
                        <td className="px-8 py-6">
                          <span className="text-sm font-black text-emerald-600">UGX {p.regularPrice?.toLocaleString()}</span>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest ${p.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {p.status || 'active'}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex justify-end gap-2">
                            <Link to={`/update-product/${p._id}`} className="p-3 bg-gray-50 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all shadow-sm"><FaPen size={12} /></Link>
                            <button onClick={() => handleDelete(p._id)} className="p-3 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all shadow-sm"><FaTrashAlt size={12} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
