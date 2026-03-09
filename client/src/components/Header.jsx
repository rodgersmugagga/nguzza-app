import { FaSearch, FaSeedling, FaShieldAlt, FaShoppingCart, FaBoxOpen, FaStore, FaHeart, FaMapMarkerAlt, FaChevronDown, FaUser, FaBars, FaTimes, FaHome, FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { deleteUserSuccess } from '../redux/user/userSlice.js';
import { useEffect, useState, useRef } from 'react';

const SEARCH_CATEGORIES = [
  { label: 'All Agri', value: 'all' },
  { label: 'Crops', value: 'Crops' },
  { label: 'Livestock', value: 'Livestock' },
  { label: 'Inputs', value: 'Agricultural Inputs' },
  { label: 'Equipment', value: 'Equipment & Tools' },
  { label: 'Services', value: 'Agricultural Services' },
];

const NAV_CATEGORIES = ['Crops', 'Livestock', 'Farm Inputs', 'Machinery', 'Fresh Harvest', 'Services'];

const categoryPath = (cat) => {
  if (cat === 'Farm Inputs') return 'Agricultural Inputs';
  if (cat === 'Machinery') return 'Equipment & Tools';
  if (cat === 'Fresh Harvest') return 'Crops';
  return cat;
};

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState(SEARCH_CATEGORIES[0]);
  const [showCatDropdown, setShowCatDropdown] = useState(false);
  const [showSideMenu, setShowSideMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems } = useSelector((state) => state.cart);
  const catRef = useRef(null);
  const menuRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuggestions([]);
    const urlParams = new URLSearchParams();
    if (searchTerm.trim()) urlParams.set('searchTerm', searchTerm);
    if (searchCategory.value !== 'all') urlParams.set('category', searchCategory.value);
    navigate(`/search?${urlParams.toString()}`);
  };

  const [suggestions, setSuggestions] = useState([]);

  const closeSideMenu = () => setShowSideMenu(false);

  const handleAutoScrollNavClick = () => {
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    dispatch(deleteUserSuccess(null));
    setShowSideMenu(false);
    navigate('/');
  };


  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const categoryFromUrl = urlParams.get('category');
    if (searchTermFromUrl) setSearchTerm(searchTermFromUrl);
    if (categoryFromUrl) {
      const found = SEARCH_CATEGORIES.find((cat) => cat.value === categoryFromUrl);
      if (found) setSearchCategory(found);
    } else {
      setSearchCategory(SEARCH_CATEGORIES[0]);
    }
  }, [location.search]);

  useEffect(() => {
    setShowSideMenu(false);
  }, [location.pathname]);

  useEffect(() => {
    const trimmed = searchTerm.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      return undefined;
    }

    const controller = new AbortController();

    const fetchSuggestions = async () => {
      try {
        const queryString = new URLSearchParams({ query: trimmed }).toString();
        const res = await fetch(`/api/products/suggestions?${queryString}`, { signal: controller.signal });
        const data = await res.json();
        setSuggestions(Array.isArray(data) ? data : []);
      } catch (error) {
        if (error.name !== 'AbortError') console.error(error);
      }
    };

    const t = setTimeout(fetchSuggestions, 300);
    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [searchTerm]);

  useEffect(() => {
    const handler = (e) => { if (catRef.current && !catRef.current.contains(e.target)) setShowCatDropdown(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setShowSideMenu(false);
    };
    const handleOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowSideMenu(false);
      }
    };

    if (showSideMenu) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEsc);
      document.addEventListener('mousedown', handleOutside);
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEsc);
      document.removeEventListener('mousedown', handleOutside);
    };
  }, [showSideMenu]);

  return (
    <header className="sticky top-0 z-50 shadow-sm">
      {/* ─── Top Bar ─── */}
      <div className="bg-emerald-900 text-white">
        <div className="max-w-7xl mx-auto px-2 flex items-center justify-between text-[11px] py-1.5 font-medium tracking-wide">
          <div className="flex items-center gap-2 sm:gap-6">
          </div>
          <div className="flex items-center gap-2 sm:gap-6">
            <Link to="/about" className="hover:text-amber-400 transition-colors">Help</Link>
            {currentUser?.user?.isAdmin && (
              <Link to="/admin-dashboard" className="text-amber-400 font-bold flex items-center gap-1">
                <FaShieldAlt className="text-[10px]" /> Admin
              </Link>
            )}
            {currentUser ? (
              <span className="flex items-center gap-1.5 uppercase font-bold text-emerald-100">
                <FaUser className="text-[10px]" /><span title={currentUser.user?.username?.split(' ')[0]}>{currentUser.user?.username?.split(' ')[0]?.slice(0, 3)}{currentUser.user?.username?.split(' ')[0]?.length > 3 ? '…' : ''}</span>
              </span>
            ) : (
              <Link to="/sign-in" className="hover:text-amber-400 transition-colors font-bold">Login</Link>
            )}
          </div>
        </div>
      </div>

      {/* ─── Main Header ─── */}
      <div className="bg-emerald-800">
        <div className="max-w-7xl mx-auto px-4 py-2 sm:py-3 flex items-center gap-3 sm:gap-6">

          {/* Sidebar Trigger */}
          <div className="flex-shrink-0">
            <button
              type="button"
              onClick={() => setShowSideMenu(true)}
              className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-emerald-500/50 bg-emerald-700/70 text-white hover:bg-emerald-600 transition-colors"
              aria-label="Open sidebar menu"
            >
              <img src="/logo.png" alt="Nguzza" className="h-9 w-9 rounded-full object-cover" />
              <span className="text-sm font-black tracking-wide"></span>
            </button>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSubmit} className="flex-1 min-w-0 sm:max-w-3xl relative">
            <div className="flex items-stretch rounded-xl overflow-hidden bg-white shadow-soft focus-within:ring-2 focus-within:ring-amber-400 transition-all">
              {/* Category Dropdown - Hidden on Mobile */}
              <div ref={catRef} className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => setShowCatDropdown(!showCatDropdown)}
                  className="h-full px-4 bg-gray-50 border-r border-gray-100 text-gray-600 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-gray-100 transition-colors"
                >
                  <span className="hidden sm:inline">{searchCategory.label}</span>
                  <span className="sm:hidden">{searchCategory.label.split(' ')[0]}</span>
                  <FaChevronDown className="text-[8px]" />
                </button>
                {showCatDropdown && (
                  <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 min-w-[180px] animate-in">
                    {SEARCH_CATEGORIES.map(cat => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => { setSearchCategory(cat); setShowCatDropdown(false); }}
                        className={`w-full text-left px-4 py-3 text-xs font-semibold hover:bg-emerald-50 transition-colors ${searchCategory.value === cat.value ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600'}`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <input
                type="text"
                placeholder="Search..."
                className="flex-1 px-4 py-2.5 sm:py-3 text-sm text-gray-800 placeholder-gray-400 bg-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <button type="submit" className="px-5 bg-amber-400 hover:bg-amber-500 text-emerald-900 transition-colors border-l border-amber-300">
                <FaSearch className="text-lg" />
              </button>
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && searchTerm && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 max-h-[70vh] overflow-y-auto">
                {suggestions.map((item) => (
                  <Link
                    key={item._id}
                    to={`/product/${item._id}`}
                    onClick={() => { setSearchTerm(''); setSuggestions([]); }}
                    className="p-4 hover:bg-emerald-50 cursor-pointer flex items-center gap-4 transition-colors border-b border-gray-50 last:border-0"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                      <img src={item.imageUrls?.[0]} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{item.name}</h4>
                      <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">{item.category}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </form>

          {/* Mobile Navigation Icons */}
          <div className="flex items-center gap-1 sm:hidden flex-shrink-0">
            {currentUser && (
              <Link
                to={currentUser.user?.role === 'seller' ? '/add-product' : '/register-vendor'}
                className="p-2 text-white hover:text-amber-400 transition-colors"
                title="Sell"
              >
                <FaStore className="text-xl" />
              </Link>
            )}
            <Link to="/cart" className="relative p-2 text-white hover:text-amber-400 transition-colors">
              <FaShoppingCart className="text-xl" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-400 text-emerald-900 text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center border border-emerald-800">
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </Link>
            {currentUser && (
              <Link to="/profile" className="ml-1">
                <img className="rounded-full h-8 w-8 object-cover border-2 border-emerald-600" src={currentUser?.user?.avatar || '/favicon.png'} alt="profile" />
              </Link>
            )}
          </div>

          {/* Desktop Navigation Icons */}
          <div className="hidden sm:flex items-center gap-2 sm:gap-6 flex-shrink-0 ml-auto">
            {currentUser && (
              <div className="flex items-center gap-4">
                <Link to="/wishlist" className="flex flex-col items-center group text-emerald-100 hover:text-amber-400 transition-colors">
                  <FaHeart className="text-lg" />
                  <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">Wishlist</span>
                </Link>
                <Link to="/seller-dashboard" className="flex flex-col items-center group text-emerald-100 hover:text-amber-400 transition-colors">
                  <FaStore className="text-lg" />
                  <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">Sell</span>
                </Link>
              </div>
            )}

            <Link to="/cart" className="flex flex-col items-center group text-emerald-100 hover:text-amber-400 transition-colors relative">
              <div className="relative">
                <FaShoppingCart className="text-xl" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-3 bg-white text-emerald-900 text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">My Cart</span>
            </Link>

            {currentUser && (
              <Link to="/profile" className="flex-shrink-0 h-10 w-10 border-2 border-emerald-600 rounded-full overflow-hidden hover:border-amber-400 transition-all p-0.5">
                <img className="rounded-full h-full w-full object-cover" src={currentUser?.user?.avatar || '/favicon.png'} alt="profile" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ─── Secondary Nav (Categories) ─── */}
      <div className="bg-emerald-700 text-white shadow-inner">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          {/* Mobile categories layout */}
          <div className="sm:hidden flex items-center gap-2 overflow-hidden py-2">
            <button type="button" onClick={() => setShowSideMenu(true)} aria-label="Open navigation" className="inline-flex items-center justify-center px-2 py-1.5 text-[9px] font-black uppercase tracking-wide border border-emerald-500/50 bg-emerald-600/60 rounded-md whitespace-nowrap">
              <FaBars className="text-[10px]" />
            </button>

            <div className="relative flex-1 overflow-hidden mask-fade-right">
              <div key={`mobile-${location.pathname}${location.search}`} className="flex items-center h-full auto-scroll-track">
                {[...NAV_CATEGORIES, 'Start Selling', ...NAV_CATEGORIES, 'Start Selling'].map((cat, idx) => {
                  const isSelling = cat === 'Start Selling';
                  return (
                    <Link
                      key={`${cat}-${idx}`}
                      to={isSelling ? (currentUser ? (currentUser.user?.role === 'seller' ? '/add-product' : '/register-vendor') : '/sign-in') : `/category/${encodeURIComponent(categoryPath(cat))}`}
                      onClick={handleAutoScrollNavClick}
                      className={isSelling
                        ? 'mx-2 px-3 py-1.5 bg-amber-400 text-emerald-900 hover:bg-amber-500 text-[10px] font-black uppercase tracking-wide transition-colors whitespace-nowrap rounded-full shadow'
                        : 'px-3 py-1.5 hover:bg-emerald-600/70 text-[10px] font-bold uppercase tracking-wide transition-colors whitespace-nowrap rounded-full bg-white/10 border border-white/10'}
                    >
                      {isSelling ? 'Start Selling' : cat}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Desktop categories layout */}
          <div className="hidden sm:flex items-center gap-2 overflow-hidden">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-3 hover:bg-emerald-600 rounded-none text-[11px] font-black uppercase tracking-widest transition-colors whitespace-nowrap border-r border-emerald-600/50"
              onClick={() => setShowSideMenu(true)}
              aria-label="Open categories menu"
            >
              <FaBars className="text-xs" />
              <span>Categories</span>
            </button>

            <div className="relative flex-1 overflow-hidden mask-fade-right">
              <div key={`desktop-${location.pathname}${location.search}`} className="flex items-center h-full auto-scroll-track">
                {[...NAV_CATEGORIES, ...NAV_CATEGORIES].map((cat, idx) => (
                  <Link
                    key={`${cat}-${idx}`}
                    to={`/category/${encodeURIComponent(categoryPath(cat))}`}
                    onClick={handleAutoScrollNavClick}
                    className="px-4 py-3 hover:bg-emerald-600 text-[11px] font-bold uppercase tracking-wider transition-colors whitespace-nowrap"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              to={currentUser ? (currentUser.user?.role === 'seller' ? "/add-product" : "/register-vendor") : "/sign-in"}
              onClick={handleAutoScrollNavClick}
              className="ml-auto px-4 py-3 bg-amber-400 text-emerald-900 hover:bg-amber-500 text-[11px] font-black uppercase tracking-widest transition-colors whitespace-nowrap shadow-xl"
            >
              {currentUser?.user?.role === 'seller' ? "+ Post Product" : "Start Selling"}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Side Menu */}
      {showSideMenu && (
        <div className="fixed inset-0 z-[70]" aria-modal="true" role="dialog">
          <div className="absolute inset-0 bg-black/40" onClick={closeSideMenu}></div>
          <aside ref={menuRef} className="absolute top-0 left-0 h-full w-[84%] max-w-xs bg-white shadow-2xl border-r border-emerald-100 p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="inline-flex items-center gap-2 text-xl font-black tracking-wide text-emerald-900"><span className="h-2.5 w-2.5 rounded-full bg-amber-400 shadow-[0_0_0_3px_rgba(16,185,129,0.15)]"></span>Menu</h2>
              <button type="button" onClick={closeSideMenu} className="p-2 text-emerald-800">
                <FaTimes />
              </button>
            </div>

            <nav className="space-y-2 text-sm font-semibold text-gray-700">
              <Link to="/" onClick={closeSideMenu} className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-emerald-50"><FaHome className="text-emerald-700" /> Home</Link>
              <Link to="/search" onClick={closeSideMenu} className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-emerald-50"><FaBars className="text-emerald-700" /> Categories</Link>
              <Link to={currentUser ? "/profile" : "/sign-in"} onClick={closeSideMenu} className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-emerald-50"><FaUser className="text-emerald-700" /> Profile</Link>
              <Link to={currentUser ? (currentUser.user?.role === 'seller' ? '/add-product' : '/register-vendor') : '/sign-in'} onClick={closeSideMenu} className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-emerald-50"><FaStore className="text-emerald-700" /> Sell</Link>
              <Link to="/order-history" onClick={closeSideMenu} className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-emerald-50"><FaBoxOpen className="text-emerald-700" /> Track Order</Link>
            </nav>

            <div className="mt-8 pt-5 border-t border-gray-100">
              {currentUser ? (
                <button type="button" onClick={handleSignOut} className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-xl font-bold">
                  <FaSignOutAlt /> Sign Out
                </button>
              ) : (
                <Link to="/sign-in" onClick={closeSideMenu} className="w-full inline-flex items-center justify-center gap-2 bg-emerald-700 text-white px-4 py-3 rounded-xl font-bold">
                  <FaUser /> Sign In
                </Link>
              )}
            </div>
          </aside>
        </div>
      )}

    </header>
  );
}
