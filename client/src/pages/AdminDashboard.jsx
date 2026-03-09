import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  FaUsers, FaBox, FaShoppingBag, FaChartLine, FaTrashAlt, FaEye,
  FaArrowLeft, FaShieldAlt, FaStar, FaCheck, FaTimes, FaUndo, FaBan,
  FaPlus, FaEdit, FaSeedling, FaPaw, FaBolt
} from 'react-icons/fa';

export default function AdminDashboard() {
  const { currentUser } = useSelector((state) => state.user);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stats');
  const [analytics, setAnalytics] = useState(null);
  const [cropTypes, setCropTypes] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [selectedFlashProductIds, setSelectedFlashProductIds] = useState([]);
  const [flashEndsAt, setFlashEndsAt] = useState('');
  const [resetExistingFlash, setResetExistingFlash] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || '';

  const fetchAdminData = useCallback(async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${currentUser.token}` };
      const [statsRes, usersRes, productsRes, ordersRes, vendorsRes, analyticsRes, cropsRes, breedsRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/stats`, { headers }),
        fetch(`${API_URL}/api/admin/users`, { headers }),
        fetch(`${API_URL}/api/admin/products`, { headers }),
        fetch(`${API_URL}/api/admin/orders`, { headers }),
        fetch(`${API_URL}/api/admin/vendors/pending`, { headers }),
        fetch(`${API_URL}/api/admin/analytics`, { headers }),
        fetch(`${API_URL}/api/reference/crop-types`, { headers }),
        fetch(`${API_URL}/api/reference/livestock-breeds`, { headers })
      ]);

      const statsData = await statsRes.json();
      const usersData = await usersRes.json();
      const productsData = await productsRes.json();
      const ordersData = await ordersRes.json();
      const vendorsData = await vendorsRes.json();
      const analyticsData = await analyticsRes.json();
      const cropsData = await cropsRes.json();
      const breedsData = await breedsRes.json();

      if (statsRes.ok) setStats(statsData.stats);
      if (usersRes.ok) setUsers(usersData.users || []);
      if (productsRes.ok) setProducts(productsData.products || []);
      if (ordersRes.ok) setOrders(ordersData.orders || []);
      if (vendorsRes.ok) setVendors(vendorsData.vendors || []);
      if (analyticsRes.ok) setAnalytics(analyticsData.analytics);
      if (cropsRes.ok) setCropTypes(cropsData.cropTypes || []);
      if (breedsRes.ok) setBreeds(breedsData.breeds || []);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [API_URL, currentUser.token]);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const handleAction = async (path, method = 'PUT', body = null) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/${path}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser.token}`
        },
        body: body ? JSON.stringify(body) : null
      });
      if (res.ok) fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };



  const activeFlashSales = products.filter((product) => product.isFlashSale && product.flashSaleEndsAt && new Date(product.flashSaleEndsAt) > new Date());

  const toggleFlashProductSelection = (productId) => {
    setSelectedFlashProductIds((prev) => (
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    ));
  };

  const handleCreateFlashSale = async () => {
    if (!selectedFlashProductIds.length || !flashEndsAt) {
      window.alert('Select products and set a flash sale end date/time.');
      return;
    }

    await handleAction('flash-sales', 'POST', {
      productIds: selectedFlashProductIds,
      endsAt: new Date(flashEndsAt).toISOString(),
      resetExisting: resetExistingFlash
    });

    setSelectedFlashProductIds([]);
  };

  const handleResetFlashSales = async (productId = null) => {
    const path = productId ? `flash-sales/${productId}/reset` : 'flash-sales/reset';
    await handleAction(path, 'PUT');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-gray-900 text-white pt-8 sm:pt-12 pb-20 sm:pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          <Link to="/" className="text-gray-400 hover:text-white text-xs font-bold flex items-center gap-2 mb-6 sm:mb-8">
            <FaArrowLeft /> Marketplace Home
          </Link>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-emerald-500 font-black tracking-widest text-[10px] uppercase mb-2">Platform Control</p>
              <h1 className="text-2xl sm:text-4xl font-black">Admin Panel</h1>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase">Live</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-12">
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 ring-1 ring-gray-100 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-[10px] font-black tracking-widest uppercase text-gray-400">Admin Quick Action</p>
            <h2 className="text-lg font-black text-gray-900 mt-1">Add product on behalf of a vendor</h2>
            <p className="text-sm text-gray-500 mt-1">Use the listing wizard to create a new agriculture product and send it straight for moderation.</p>
          </div>
          <Link
            to="/add-product"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors"
          >
            <FaPlus /> Add Product
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {[
            { label: 'Users', val: stats?.totalUsers, icon: FaUsers, color: 'blue' },
            { label: 'Products', val: stats?.totalProducts, icon: FaBox, color: 'emerald' },
            { label: 'Orders', val: orders.length, icon: FaShoppingBag, color: 'purple' },
            { label: 'Value', val: `UGX ${(stats?.totalMarketValue || 0).toLocaleString()}`, icon: FaChartLine, color: 'amber' },
          ].map((s, i) => (
            <div key={i} className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 ring-1 ring-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center bg-${s.color}-50 text-${s.color}-600`}>
                <s.icon size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s.label}</p>
                <h4 className="text-lg sm:text-xl font-black text-gray-900">{s.val}</h4>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden ring-1 ring-gray-100">
          <div className="flex border-b border-gray-50 overflow-x-auto scrollbar-hide -mx-8 px-8">
            {[
              { id: 'stats', label: 'Monitor', icon: FaChartLine },
              { id: 'users', label: 'Users', icon: FaUsers },
              { id: 'products', label: 'Products', icon: FaBox },
              { id: 'orders', label: 'Orders', icon: FaShoppingBag },
              { id: 'inventory', label: 'Inventory', icon: FaSeedling },
              { id: 'flash-sales', label: 'Flash', icon: FaBolt },
              { id: 'vendors', label: 'Vendors', icon: FaShieldAlt }
            ].map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-4 sm:px-8 py-4 sm:py-5 text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap ${activeTab === t.id ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:bg-gray-50'}`}>
                <t.icon size={12} /> {t.label}
              </button>
            ))}
          </div>

          <div className="p-4 sm:p-8">
            {activeTab === 'stats' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-50 p-6 rounded-3xl">
                  <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">Revenue Growth</h3>
                  <div className="h-40 flex items-end gap-2">
                    {analytics?.revenueTrends.map((t, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors" style={{ height: `${(t.revenue / Math.max(...analytics.revenueTrends.map(x => x.revenue))) * 100}%` }}></div>
                        <span className="text-[8px] font-bold text-gray-400 capitalize">{new Date(0, t._id.month - 1).toLocaleString('default', { month: 'short' })}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-50 p-6 rounded-3xl">
                  <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">Category Distribution</h3>
                  <div className="space-y-4">
                    {analytics?.categoryDistribution.map((c, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <span className="text-[10px] font-bold w-20 text-gray-600 truncate">{c._id}</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(c.count / stats?.totalProducts) * 100}%` }}></div>
                        </div>
                        <span className="text-[10px] font-black text-gray-400">{c.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'vendors' && (
              <table className="w-full text-left mb-6">
                <thead className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <tr><th className="pb-4">Business</th><th className="pb-4">Owner</th><th className="pb-4">Contact</th><th className="pb-4">Status</th><th className="pb-4 text-right">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {vendors.map(v => (
                    <tr key={v._id} className="group hover:bg-gray-50/50">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <img src={v.vendorProfile?.businessLogo} className="w-10 h-10 rounded-xl object-cover bg-gray-100" />
                          <div><p className="font-black text-gray-900 line-clamp-1">{v.vendorProfile?.businessName || '—'}</p><p className="text-[10px] text-gray-400">{v.vendorProfile?.businessDescription}</p></div>
                        </div>
                      </td>
                      <td className="py-4 font-bold text-xs">{v.username}</td>
                      <td className="py-4 text-[12px]">{v.phoneNumber || v.email}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-black ${v.vendorProfile?.verificationStatus === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                          {v.vendorProfile?.verificationStatus}
                        </span>
                      </td>
                      <td className="py-4 text-right flex justify-end gap-2">
                        <button onClick={() => handleAction(`vendors/${v._id}/accept`, 'PUT')} className="p-2 text-emerald-600 bg-emerald-50 rounded-xl"><FaCheck size={12} /></button>
                        <button onClick={async () => {
                          const reason = window.prompt('Reason for rejection (optional):');
                          if (reason === null) return; // cancelled
                          await handleAction(`vendors/${v._id}/reject`, 'PUT', { reason });
                        }} className="p-2 text-red-600 bg-red-50 rounded-xl"><FaTimes size={12} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {activeTab === 'users' && (
              <>
                {/* Mobile card view */}
                <div className="sm:hidden space-y-3">
                  {users.map(u => (
                    <div key={u._id} className="bg-gray-50 rounded-2xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <img src={u.avatar} className="w-10 h-10 rounded-full bg-gray-100" />
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-gray-900 text-sm truncate">{u.username}</p>
                          <p className="text-[10px] text-gray-400">{u.phoneNumber}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-[10px] font-black ${u.isBanned ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                          {u.isBanned ? 'Banned' : 'Active'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{u.role}</span>
                        <div className="flex gap-2">
                          <button onClick={async () => {
                            const newRole = window.prompt('New Role (user, seller, admin):', u.role);
                            if (newRole) await handleAction(`user/${u._id}/role`, 'PUT', { role: newRole });
                          }} className="p-2 text-blue-600 bg-blue-50 rounded-xl"><FaShieldAlt size={12} /></button>
                          <button onClick={() => handleAction(`user/${u._id}/ban`, 'PUT')} className="p-2 text-red-600 bg-red-50 rounded-xl">
                            <FaBan size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Desktop table */}
                <table className="hidden sm:table w-full text-left">
                  <thead className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <tr><th className="pb-4">User</th><th className="pb-4">Role</th><th className="pb-4">Status</th><th className="pb-4 text-right">Actions</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {users.map(u => (
                      <tr key={u._id} className="group hover:bg-gray-50/50">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <img src={u.avatar} className="w-10 h-10 rounded-full bg-gray-100" />
                            <div><p className="font-black text-gray-900">{u.username}</p><p className="text-[10px] text-gray-400">{u.phoneNumber}</p></div>
                          </div>
                        </td>
                        <td className="py-4 font-bold text-xs">{u.role}</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-black ${u.isBanned ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                            {u.isBanned ? 'Banned' : 'Active'}
                          </span>
                        </td>
                        <td className="py-4 text-right flex justify-end gap-2 items-center">
                          <button onClick={async () => {
                            const newRole = window.prompt('New Role (user, seller, admin):', u.role);
                            if (newRole) await handleAction(`user/${u._id}/role`, 'PUT', { role: newRole });
                          }} className="p-2 text-blue-600 bg-blue-50 rounded-xl" title="Change Role"><FaShieldAlt size={12} /></button>
                          <button onClick={() => handleAction(`user/${u._id}/ban`, 'PUT')} className="p-2 text-red-600 bg-red-50 rounded-xl" title={u.isBanned ? 'Lift Ban' : 'Suspend'}>
                            <FaBan size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {activeTab === 'orders' && (
              <>
                {/* Mobile card view */}
                <div className="sm:hidden space-y-3">
                  {orders.map(o => (
                    <div key={o._id} className="bg-gray-50 rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-black text-xs text-emerald-600">#{o._id.slice(-6).toUpperCase()}</span>
                        <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${['Delivered', 'Paid'].includes(o.status) ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                          {o.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-gray-600">{o.user?.username || 'Guest'}</p>
                          <p className="text-sm font-black text-gray-900">UGX {o.totalPrice.toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={async () => {
                            const newStatus = window.prompt('Update Status (Pending, Shipped, Delivered, Cancelled):', o.status);
                            if (newStatus) await handleAction(`order/${o._id}/status`, 'PUT', { status: newStatus });
                          }} className="p-2 text-gray-600 bg-white rounded-xl"><FaEdit size={12} /></button>
                          <button onClick={() => handleAction(`order/${o._id}/cancel`, 'PUT')} className="p-2 text-red-600 bg-red-50 rounded-xl"><FaTimes size={12} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Desktop table */}
                <table className="hidden sm:table w-full text-left">
                  <thead className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <tr><th className="pb-4">Order ID</th><th className="pb-4">Customer</th><th className="pb-4">Total</th><th className="pb-4">Status</th><th className="pb-4 text-right">Actions</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.map(o => (
                      <tr key={o._id} className="group hover:bg-gray-50/50">
                        <td className="py-4 font-black text-xs text-emerald-600">#{o._id.slice(-6).toUpperCase()}</td>
                        <td className="py-4 font-bold text-xs">{o.user?.username || 'Guest'}</td>
                        <td className="py-4 font-black text-xs">UGX {o.totalPrice.toLocaleString()}</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${['Delivered', 'Paid'].includes(o.status) ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="py-4 text-right flex justify-end gap-2">
                          <button onClick={async () => {
                            const newStatus = window.prompt('Update Status (Pending, Shipped, Delivered, Cancelled):', o.status);
                            if (newStatus) await handleAction(`order/${o._id}/status`, 'PUT', { status: newStatus });
                          }} className="p-2 text-gray-600 bg-gray-50 rounded-xl"><FaEdit size={12} /></button>
                          <button onClick={() => handleAction(`order/${o._id}/cancel`, 'PUT')} className="p-2 text-red-600 bg-red-50 rounded-xl"><FaTimes size={12} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {activeTab === 'inventory' && (
              <div className="space-y-12">
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-black text-gray-900 flex items-center gap-2"><FaSeedling className="text-emerald-600" /> Crop Types</h3>
                    <button onClick={async () => {
                      const name = window.prompt('Crop Name:');
                      const category = window.prompt('Category (e.g. Grains & Cereals, Vegetables):');
                      if (name && category) {
                        await handleAction('crop-types', 'POST', { name, category });
                      }
                    }} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-colors">
                      <FaPlus /> Add Crop
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
                    {cropTypes.map(c => (
                      <div key={c._id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between items-center group">
                        <div>
                          <p className="font-black text-gray-900">{c.name}</p>
                          <p className="text-[10px] text-gray-400">{c.category}</p>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleAction(`crop-types/${c._id}`, 'DELETE')} className="p-1.5 text-red-500 hover:bg-white rounded-lg"><FaTrashAlt size={10} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-black text-gray-900 flex items-center gap-2"><FaPaw className="text-amber-600" /> Livestock Breeds</h3>
                    <button onClick={async () => {
                      const name = window.prompt('Breed Name:');
                      const animalType = window.prompt('Animal (e.g. Cattle, Poultry):');
                      if (name && animalType) {
                        await handleAction('breeds', 'POST', { name, animalType });
                      }
                    }} className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-700 transition-colors">
                      <FaPlus /> Add Breed
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
                    {breeds.map(b => (
                      <div key={b._id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between items-center group">
                        <div>
                          <p className="font-black text-gray-900">{b.name}</p>
                          <p className="text-[10px] text-gray-400">{b.animalType}</p>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleAction(`breeds/${b._id}`, 'DELETE')} className="p-1.5 text-red-500 hover:bg-white rounded-lg"><FaTrashAlt size={10} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'flash-sales' && (
              <div className="space-y-8">
                <div className="bg-red-50 border border-red-100 rounded-3xl p-6">
                  <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-black text-gray-900">Create Flash Sale Campaign</h3>
                      <p className="text-sm text-gray-500 mt-1">Select products, set the sale end time, and optionally reset any existing flash sale first.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                        Ends at
                        <input type="datetime-local" value={flashEndsAt} onChange={(e) => setFlashEndsAt(e.target.value)} className="mt-1 block px-3 py-2 rounded-xl border border-gray-200" />
                      </label>
                      <label className="flex items-center gap-2 text-xs font-bold text-gray-600">
                        <input type="checkbox" checked={resetExistingFlash} onChange={(e) => setResetExistingFlash(e.target.checked)} />
                        Reset existing flash sales first
                      </label>
                      <button onClick={handleCreateFlashSale} className="bg-red-600 text-white px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-700">Publish Flash Sale</button>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-black uppercase tracking-widest text-gray-500">Active Flash Sales ({activeFlashSales.length})</h4>
                    <button onClick={() => handleResetFlashSales()} className="text-xs font-black uppercase tracking-widest text-red-600 hover:text-red-700">Reset All</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {activeFlashSales.map((product) => (
                      <div key={product._id} className="bg-white border border-red-100 rounded-2xl p-4 flex justify-between gap-3">
                        <div>
                          <p className="font-black text-gray-900 line-clamp-1">{product.name}</p>
                          <p className="text-xs text-gray-500">Ends: {new Date(product.flashSaleEndsAt).toLocaleString()}</p>
                        </div>
                        <button onClick={() => handleResetFlashSales(product._id)} className="text-xs font-black text-red-600">Reset</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-4">Select Products for Flash Sale</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {products.filter((product) => product.moderationStatus === 'approved').map((product) => (
                      <button key={product._id} onClick={() => toggleFlashProductSelection(product._id)} className={`p-4 rounded-2xl border text-left transition-colors ${selectedFlashProductIds.includes(product._id) ? 'border-red-500 bg-red-50' : 'border-gray-100 bg-gray-50 hover:bg-white'}`}>
                        <p className="font-black text-gray-900 line-clamp-1">{product.name}</p>
                        <p className="text-xs text-gray-500">UGX {product.regularPrice?.toLocaleString()}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <>
                {/* Mobile card view */}
                <div className="sm:hidden space-y-4">
                  {products.map(p => (
                    <div key={p._id} className="bg-gray-50 rounded-[2rem] p-5 border border-gray-100 shadow-sm">
                      <Link to={`/product/${p._id}`} className="flex items-center gap-4 mb-4">
                        <img src={p.imageUrls?.[0]} className="w-16 h-16 rounded-2xl object-cover bg-white shadow-sm" />
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-gray-900 text-sm line-clamp-1">{p.name}</p>
                          <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">{p.category}</p>
                          <p className="text-xs font-black text-gray-900 mt-1">UGX {p.regularPrice?.toLocaleString()} {p.details?.unit ? `/ ${p.details.unit}` : ''}</p>
                        </div>
                      </Link>

                      <div className="bg-white rounded-2xl p-3 mb-4 border border-gray-100">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Uploaded By</p>
                        <div className="flex items-center gap-2">
                          <img src={p.userRef?.avatar || '/favicon.png'} className="w-6 h-6 rounded-full object-cover" />
                          <div>
                            <p className="text-xs font-bold text-gray-900">{p.userRef?.username || '—'}</p>
                            <p className="text-[10px] text-gray-500">{p.userRef?.phoneNumber || p.userRef?.email || 'No contact'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${p.moderationStatus === 'approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                            {p.moderationStatus}
                          </span>
                          {p.isFlashSale && <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-red-50 text-red-600">Flash</span>}
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleAction(`products/${p._id}/approve`, 'PUT')} className="p-2.5 text-emerald-600 bg-emerald-50 rounded-xl" title="Approve"><FaCheck size={12} /></button>
                          <Link to={`/update-product/${p._id}`} className="p-2.5 text-blue-600 bg-blue-50 rounded-xl flex items-center" title="Edit Product"><FaEdit size={12} /></Link>
                          <button onClick={() => handleResetFlashSales(p._id)} className="p-2.5 text-red-600 bg-red-50 rounded-xl" title="Reset Flash"><FaUndo size={12} /></button>
                          <button onClick={() => handleAction(`products/${p._id}`, 'DELETE')} className="p-2.5 text-red-600 bg-red-50 rounded-xl" title="Delete"><FaTrashAlt size={12} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                      <tr>
                        <th className="pb-4">Product</th>
                        <th className="pb-4">Seller Details</th>
                        <th className="pb-4">Price</th>
                        <th className="pb-4">Status</th>
                        <th className="pb-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {products.map(p => (
                        <tr key={p._id} className="group hover:bg-gray-50/50 transition-colors">
                          <td className="py-4">
                            <Link to={`/product/${p._id}`} className="flex items-center gap-3">
                              <img src={p.imageUrls?.[0]} className="w-12 h-12 rounded-xl object-cover bg-gray-100 shadow-sm" />
                              <div>
                                <p className="font-black text-gray-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">{p.name}</p>
                                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{p.category}</p>
                              </div>
                            </Link>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              <img src={p.userRef?.avatar || '/favicon.png'} className="w-8 h-8 rounded-full object-cover border border-gray-100" />
                              <div>
                                <p className="text-xs font-black text-gray-900">{p.userRef?.username || '—'}</p>
                                <p className="text-[10px] text-gray-500 font-bold">{p.userRef?.phoneNumber || p.userRef?.email || '—'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 font-black text-xs text-gray-900">UGX {p.regularPrice?.toLocaleString()} {p.details?.unit ? `/ ${p.details.unit}` : ''}</td>
                          <td className="py-4">
                            <div className="flex flex-col gap-1">
                              <span className={`w-fit px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${p.moderationStatus === 'approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                {p.moderationStatus}
                              </span>
                              {p.isFlashSale && (
                                <span className="w-fit px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-red-50 text-red-600">Flash Active</span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button onClick={() => handleAction(`products/${p._id}/approve`, 'PUT')} className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors" title="Approve"><FaCheck size={12} /></button>
                              <Link to={`/update-product/${p._id}`} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors flex items-center" title="Edit Product"><FaEdit size={12} /></Link>
                              <button onClick={() => handleResetFlashSales(p._id)} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors" title="Reset Flash"><FaUndo size={12} /></button>
                              <button onClick={() => handleAction(`products/${p._id}`, 'DELETE')} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors" title="Delete"><FaTrashAlt size={12} /></button>
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
    </main>
  );
}
