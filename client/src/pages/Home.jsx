import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  FaSeedling,
  FaPaw,
  FaLeaf,
  FaTractor,
  FaHandshake,
  FaChevronRight,
  FaChevronLeft,
  FaBolt,
  FaClock,
  FaFire
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeaturedProducts, fetchProducts } from '../redux/products/productsSlice.js';
import ProductItem from '../components/ProductItem.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css/bundle';

/* ─── Categories ─── */
const CATEGORIES = [
  { key: 'Crops', title: 'Fresh Harvest', icon: FaSeedling },
  { key: 'Livestock', title: 'Livestock', icon: FaPaw },
  { key: 'Agricultural Inputs', title: 'Farm Inputs', icon: FaLeaf },
  { key: 'Equipment & Tools', title: 'Machinery', icon: FaTractor },
  { key: 'Agricultural Services', title: 'Services', icon: FaHandshake },
];

/* ─── Countdown Hook ─── */
function useCountdown(endTime) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, endTime - Date.now());
      setTimeLeft({
        hours: Math.floor(diff / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endTime]);

  return timeLeft;
}

/* ─── Scroll Row ─── */
function ScrollRow({ children }) {
  const ref = useRef(null);

  const scroll = (dir) => {
    if (ref.current) {
      ref.current.scrollBy({ left: dir * 240, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={() => scroll(-1)}
        className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 opacity-0 group-hover:opacity-100 transition"
      >
        <FaChevronLeft />
      </button>

      <div
        ref={ref}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-hide touch-pan-x scroll-smooth"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {children}
      </div>

      <button
        onClick={() => scroll(1)}
        className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 opacity-0 group-hover:opacity-100 transition"
      >
        <FaChevronRight />
      </button>
    </div>
  );
}

/* ─── Hero Slides ─── */
const HERO_SLIDES = [
  {
    title: 'Harvest Season Deals',
    subtitle: 'Up to 40% off fresh crops & produce',
    bg: 'from-emerald-800 to-emerald-600',
    link: '/category/Crops',
    emoji: '🌾'
  },
  {
    title: 'Premium Livestock',
    subtitle: 'Cattle, goats & poultry',
    bg: 'from-amber-700 to-amber-500',
    link: '/category/Livestock',
    emoji: '🐄'
  },
];

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user || {});
  const { featured, items, status } = useSelector((s) => s.products || {});

  const SITE_URL =
    import.meta.env.VITE_SITE_URL ||
    (typeof window !== 'undefined' ? window.location.origin : '');

  // Determine post button destination based on user status
  const getPostDestination = () => {
    if (!currentUser) {
      return '/sign-in';
    }
    const userRole = currentUser.role || currentUser.user?.role;
    if (userRole === 'seller') {
      return '/add-product';
    }
    return '/register-vendor';
  };

  const handlePostClick = () => {
    navigate(getPostDestination());
  };

  const [flashProducts, setFlashProducts] = useState([]);
    const [flashEnd, setFlashEnd] = useState(Date.now() + 86400000);


  const countdown = useCountdown(flashEnd);

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
    dispatch(fetchProducts({ page: 1, limit: 24 }));
  }, [dispatch]);

  useEffect(() => {
    fetch(`${SITE_URL}/api/products?flashSaleOnly=true&pageSize=10`)
      .then((r) => r.json())
      .then((data) => {
        const deals = Array.isArray(data?.products) ? data.products : [];
        setFlashProducts(deals);
      })
      .catch(() => {});
  }, [SITE_URL]);

  const filteredItems = useMemo(() => {
    return Array.isArray(items) ? items : [];
  }, [items]);

  return (
    <main className="min-h-screen bg-gray-50 overflow-x-hidden pb-12">

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 pt-3">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-4">

          {/* Carousel */}
          <div className="relative rounded-xl overflow-hidden shadow-sm h-[180px] sm:h-[280px] border border-gray-100">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              loop
              className="h-full"
              speed={400}
              touchEventsTarget="container"
              simulateTouch={true}
            >
              {HERO_SLIDES.map((slide, idx) => (
                <SwiperSlide key={idx}>
                  <div className={`h-full w-full bg-gradient-to-br ${slide.bg} flex items-center px-5`}>
                    <div className="text-white max-w-sm">
                      <h2 className="text-xl sm:text-4xl font-black leading-tight mb-2">
                        {slide.title}
                      </h2>
                      <p className="text-xs sm:text-base opacity-90 mb-3">
                        {slide.subtitle}
                      </p>
                      <Link
                        to={slide.link}
                        className="bg-white text-emerald-900 px-4 py-2 rounded-full text-xs font-bold"
                      >
                        Explore
                      </Link>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Post Button Promo Panel */}
          <div className="hidden lg:flex flex-col bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl p-6 shadow-lg border border-amber-300 items-center justify-center text-center gap-4">
            <div>
              <div className="text-4xl mb-2">📦</div>
              <h3 className="font-black text-white text-lg leading-tight">Have items to sell?</h3>
              <p className="text-sm text-amber-900 font-semibold mt-2">List your products now</p>
            </div>
            <button
              onClick={handlePostClick}
              className="w-full bg-white text-amber-600 font-black px-4 py-3 rounded-xl hover:bg-amber-50 transition-all active:scale-95 shadow-md"
            >
              + Post Item
            </button>
          </div>

        </div>

        {/* Mobile Post Button */}
        <div className="lg:hidden mt-4 bg-gradient-to-r from-amber-400 to-amber-500 rounded-2xl p-4 shadow-lg border border-amber-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📦</span>
              <div>
                <h3 className="font-black text-white">Have items to sell?</h3>
                <p className="text-xs text-amber-900 font-semibold">List now & start earning</p>
              </div>
            </div>
            <button
              onClick={handlePostClick}
              className="bg-white text-amber-600 font-black px-4 py-2.5 rounded-lg hover:bg-amber-50 transition-all active:scale-95 flex-shrink-0 whitespace-nowrap"
            >
              + Post
            </button>
          </div>
        </div>
      </section>

      {/* FLASH SALES */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow border border-gray-100">

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg sm:text-xl font-black flex items-center gap-2">
              <FaBolt className="text-red-500" />
              Flash Sales
            </h2>

            <div className="flex gap-1">
              {[countdown.hours, countdown.minutes, countdown.seconds].map((v, i) => (
                <div
                  key={i}
                  className="bg-gray-900 text-white w-6 h-6 flex items-center justify-center rounded text-xs font-mono"
                >
                  {String(v).padStart(2, '0')}
                </div>
              ))}
            </div>
          </div>

          <ScrollRow>
            {status === 'loading'
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="snap-start flex-shrink-0 w-32 sm:w-48">
                    <SkeletonCard />
                  </div>
                ))
              : flashProducts.map((item) => (
                  <div key={item._id} className="snap-start flex-shrink-0 w-32 sm:w-48">
                    <ProductItem product={item} compact />
                  </div>
                ))}
          </ScrollRow>

        </div>
      </section>

      {/* TRENDING PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 pb-8">
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg sm:text-xl font-black flex items-center gap-2">
              <FaFire className="text-amber-500" />
              Trending Products
            </h2>
            <Link
              to="/search"
              className="inline-flex items-center text-emerald-700 text-xs font-bold gap-1"
            >
              More <FaChevronRight />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {status === 'loading'
              ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
              : filteredItems.map((item) => (
                  <ProductItem key={item._id} product={item} compact />
                ))}
          </div>
        </div>
      </section>

    </main>
  );
}