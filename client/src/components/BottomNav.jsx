import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaSearch, FaPlus, FaHeart, FaUser } from 'react-icons/fa';
import { useSelector } from 'react-redux';

export default function BottomNav() {
  const location = useLocation();
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { currentUser } = useSelector((state) => state.user);

  const isActive = (path) => location.pathname === path;

  const sellPath = currentUser
    ? currentUser.user?.role === 'seller' ? '/add-product' : '/register-vendor'
    : '/sign-in';

  const navLeft = [
    { icon: FaHome, label: 'Home', path: '/' },
    { icon: FaSearch, label: 'Explore', path: '/search' },
  ];

  const wishlistCount = currentUser && Array.isArray(wishlistItems) ? wishlistItems.length : 0;

  const navRight = [
    { icon: FaHeart, label: 'Wishlist', path: '/wishlist', badge: wishlistCount },
    { icon: FaUser, label: 'Account', path: currentUser ? '/profile' : '/sign-in' },
  ];

  const NavItem = ({ item }) => {
    const active = isActive(item.path);
    return (
      <Link
        to={item.path}
        className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 ${active ? 'text-emerald-700' : 'text-gray-400'}`}
      >
        <div className="relative">
          <item.icon className={`text-[20px] ${active ? 'scale-110' : ''} transition-transform`} />
          {item.badge > 0 && (
            <span className="absolute -top-1.5 -right-2.5 bg-amber-400 text-emerald-900 text-[9px] font-black rounded-full min-w-[16px] h-4 flex items-center justify-center px-0.5 border-2 border-white shadow-sm">
              {item.badge}
            </span>
          )}
        </div>
        <span className={`text-[9px] mt-0.5 tracking-wide ${active ? 'font-black text-emerald-700' : 'font-semibold'}`}>
          {item.label}
        </span>
        {active && <div className="w-1 h-1 rounded-full bg-emerald-600 mt-0.5" />}
      </Link>
    );
  };

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-gray-200/60 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around h-[60px] relative">
        {navLeft.map((item) => <NavItem key={item.label} item={item} />)}

        {/* Raised Center Sell Button */}
        <div className="flex flex-col items-center justify-center flex-1 relative">
          <Link
            to={sellPath}
            className="-mt-6 w-[52px] h-[52px] bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/30 active:scale-90 transition-all border-[3px] border-white"
          >
            <FaPlus className="text-white text-lg" />
          </Link>
          <span className="text-[9px] font-black text-emerald-700 tracking-wide mt-0.5">Sell</span>
        </div>

        {navRight.map((item) => <NavItem key={item.label} item={item} />)}
      </div>
    </nav>
  );
}
