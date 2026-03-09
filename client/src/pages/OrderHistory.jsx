import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaBoxOpen, FaEye } from 'react-icons/fa';

export default function OrderHistory() {
  const { currentUser } = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders/myorders', {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(Array.isArray(data) ? data : []);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error(error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) return <div className="text-center py-20">Please sign in to view your orders</div>;

  return (
    <div className="min-h-screen bg-[#fafbfc] px-4 pt-6 sm:pt-12 pb-28 sm:pb-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 sm:mb-8 flex items-center gap-3">
          <FaBoxOpen className="text-emerald-600" /> My Orders
        </h1>

        {loading ? (
          <div className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-gray-100 text-center">
            Loading your orders...
          </div>
        ) : !Array.isArray(orders) || orders.length === 0 ? (
          <div className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-gray-100 text-center">
            <p className="text-gray-500 text-lg mb-6">You haven't placed any orders yet.</p>
            <Link to="/" className="inline-block bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {Array.isArray(orders) && orders.map((order) => (
              <div key={order._id} className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-4 group hover:border-emerald-100/60 transition-all">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] text-gray-400 uppercase tracking-wider truncate">#{order._id?.slice(-8)}</p>
                    <p className="text-xs font-bold text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Link to={`/order/${order._id}`} className="bg-gray-50 text-gray-700 px-4 py-2 rounded-xl font-bold text-xs hover:bg-gray-100 transition-all flex items-center gap-1.5 whitespace-nowrap flex-shrink-0">
                    Details <FaEye size={10} />
                  </Link>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg sm:text-xl font-black text-gray-900">UGX {order.totalPrice?.toLocaleString()}</h3>
                  <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {order.isPaid ? 'Paid' : 'Pending'}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black ${order.isDelivered ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                    {order.isDelivered ? 'Delivered' : 'Processing'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {order.orderItems?.slice(0, 4).map((item, idx) => (
                    <img key={idx} src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover border border-gray-100 bg-gray-50" />
                  ))}
                  {order.orderItems?.length > 4 && (
                    <span className="text-[10px] font-bold text-gray-400">+{order.orderItems.length - 4}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
