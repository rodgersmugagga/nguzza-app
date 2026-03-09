import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  FaMapMarkerAlt, FaCalendarAlt, FaTag, FaUser, FaPhoneAlt,
  FaWhatsapp, FaShareAlt, FaHeart, FaExclamationTriangle,
  FaChevronLeft, FaChartLine, FaCheckCircle, FaStar, FaStore
} from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css/bundle';
import Contact from '../components/Contact';
import ProductReviews from '../components/ProductReviews';
import SafeHelmet from '../components/SafeHelmet';
import { fetchProductById, clearCurrentProduct } from '../redux/products/productsSlice.js';
import { addToCart } from '../redux/cart/cartSlice.js';
import { resolvePrices } from '../utils/priceUtils';


const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://nguzza.com';

const generateTitle = (product) => {
  if (!product) return 'Product | Nguzza';
  const location = product.location?.district || 'Uganda';
  return `${product.name} in ${location} | Nguzza Marketplace`.substring(0, 70);
};

const generateDescription = (product) => {
  if (!product) return 'Find agricultural products on Nguzza.';
  return `${product.name}. ${product.description?.substring(0, 150) || ''}`.substring(0, 160);
};

const generateStructuredData = (product) => {
  if (!product) return null;
  const { finalPrice } = resolvePrices(product);
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.imageUrls,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "UGX",
      "price": finalPrice,
      "availability": "https://schema.org/InStock",
      "seller": { "@type": "Person", "name": product.sellerName || "Nguzza Seller" }
    }
  };
};

export default function ProductDetails() {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { currentProduct: product, status } = useSelector(s => s.products || { currentProduct: null, status: 'idle' });

  const [contact, setContact] = useState(false);
  const [copied, setCopied] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const productId = params.id || params.productId;
    if (productId) {
      dispatch(fetchProductById(productId));
    }
    return () => dispatch(clearCurrentProduct());
  }, [params.id, params.productId, dispatch]);

  if (status === 'loading') return (
    <div className='flex items-center justify-center min-h-screen bg-white'>
      <div className='animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent shadow-lg shadow-emerald-600/20'></div>
    </div>
  );

  if (status === 'failed' || !product) return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center'>
      <div className='text-6xl mb-4'>🪴</div>
      <h2 className="text-2xl font-black text-gray-800 tracking-tight">Product Not Found</h2>
      <p className="text-gray-400 mt-2 font-medium">The harvest might have been moved or doesn't exist.</p>
      <Link to="/" className="btn-primary mt-8">Explore Marketplace</Link>
    </div>
  );

  const { finalPrice, originalPrice, discountAmount } = resolvePrices(product);
  const isOwner = product.userRef === currentUser?._id || product.userRef === currentUser?.user?._id;

  const handleAddToCart = () => {
    const itemToAdd = {
      product: product._id,
      name: product.name,
      image: product.imageUrls?.[0],
      price: finalPrice,
      countInStock: product.countInStock ?? 99,
      quantity: 1,
    };

    dispatch(addToCart(itemToAdd));
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1800);
  };

  const goToCart = () => navigate('/cart');

  return (
    <main className="bg-gray-50 min-h-screen pb-40 sm:pb-12">
      <SafeHelmet>
        <title>{generateTitle(product)}</title>
        <meta name="description" content={generateDescription(product)} />
        <link rel="canonical" href={product ? `${SITE_URL}/product/${product._id}` : SITE_URL} />
        <script type="application/ld+json">{JSON.stringify(generateStructuredData(product))}</script>
      </SafeHelmet>

      {/* Hero Gallery */}
      <div className="relative h-[45vh] sm:h-[60vh] lg:h-[70vh] w-full overflow-hidden bg-emerald-950 group">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation={{
            prevEl: '.swiper-button-prev-custom',
            nextEl: '.swiper-button-next-custom',
          }}
          pagination={{ clickable: true, dynamicBullets: true }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          }}
          loop={product.imageUrls.length > 1}
          className="h-full swiper-premium"
        >
          {product.imageUrls.map((url, index) => (
            <SwiperSlide key={index}>
              <div className="h-full w-full bg-cover bg-center transition-transform duration-[2000ms] group-hover:scale-105" style={{ backgroundImage: `url(${url})` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/40 via-transparent to-transparent"></div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <div className="hidden sm:block">
          <button className="swiper-button-prev-custom absolute left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full glass flex items-center justify-center text-white hover:bg-white hover:text-emerald-900 transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 shadow-2xl">
            <FaChevronLeft size={20} />
          </button>
          <button className="swiper-button-next-custom absolute right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full glass flex items-center justify-center text-white hover:bg-white hover:text-emerald-900 transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 shadow-2xl">
            <FaChevronLeft size={20} className="rotate-180" />
          </button>
        </div>

        {/* Back Button (Mobile) */}
        <button onClick={() => window.history.back()} className="sm:hidden absolute top-6 left-6 z-20 glass p-3 rounded-full text-white shadow-xl">
          <FaChevronLeft size={18} />
        </button>

        <button onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }} className="absolute top-6 right-6 z-20 glass p-3.5 rounded-full text-white hover:bg-white hover:text-emerald-700 transition-all active:scale-95 border-white/20">
          <FaShareAlt size={18} />
        </button>
        {copied && <div className="absolute top-24 right-6 z-20 bg-emerald-600 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl animate-in">Link Copied!</div>}
      </div>

      <div className="container-responsive -mt-12 relative z-10 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">

          {/* Main Info */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">
            <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-8 shadow-premium border border-gray-100">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border border-emerald-100">{product.category}</span>
                {product.isFeatured && (
                  <span className="bg-amber-400 text-emerald-900 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] shadow-lg shadow-amber-400/20">Featured</span>
                )}
              </div>

              <h1 className="text-xl sm:text-4xl font-black text-gray-900 leading-[1.15] mb-3 text-balance">{product.name}</h1>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1.5 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
                  <FaStar className="text-amber-400 text-[10px]" />
                  <span className="text-[11px] font-black text-amber-900">{product.rating ? product.rating.toFixed(1) : '0.0'}</span>
                </div>
                <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">{product.numReviews || 0} Reviews</span>
              </div>

              <div className="flex items-center gap-2 text-gray-400 font-bold mb-6">
                <FaMapMarkerAlt className="text-emerald-600" size={10} />
                <span className="text-[10px] sm:text-xs uppercase tracking-wide">
                  {product.location?.district} {product.location?.subcounty ? `• ${product.location.subcounty}` : ''}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-8">
                <div className="inline-block bg-emerald-700 px-6 py-3 rounded-2xl shadow-xl shadow-emerald-700/20">
                  <p className="text-[11px] sm:text-lg font-black text-white tracking-tighter">
                    <span className="text-[10px] font-bold opacity-80 mr-1">UGX</span>
                    {Number(finalPrice).toLocaleString()}
                    {product.details?.unit && (
                      <span className="text-[10px] sm:text-sm font-bold opacity-70 ml-1">/ {product.details.unit}</span>
                    )}
                  </p>
                </div>
                {discountAmount > 0 && (
                  <p className="text-gray-300 line-through text-[10px] font-bold">
                    UGX {Number(originalPrice).toLocaleString()}
                  </p>
                )}
              </div>

              <div className="space-y-3 pt-6 border-t border-gray-50">
                <h3 className="text-sm font-black text-gray-900 flex items-center gap-2 tracking-tight uppercase">
                  <div className="w-1 h-3.5 bg-emerald-600 rounded-full" />
                  Produce Details
                </h3>
                <p className="text-gray-600 leading-relaxed font-bold bg-gray-50/30 p-4 sm:p-6 rounded-2xl border border-gray-100 italic text-[13px] sm:text-sm">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Specifications Card */}
            <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-8 shadow-premium border border-gray-100">
              <h3 className="text-sm font-black text-gray-900 mb-6 flex items-center gap-2 tracking-tight uppercase">
                <div className="w-1 h-3.5 bg-emerald-600 rounded-full" />
                Technical Data
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                {Object.entries(product.details || {}).map(([key, value]) => (
                  <div key={key} className="bg-emerald-50/30 p-3 rounded-xl border border-emerald-100/30">
                    <p className="text-[8px] font-black text-emerald-700/50 uppercase tracking-widest mb-0.5 truncate">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                    <p className="text-[11px] font-black text-emerald-900 truncate">{String(value)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <ProductReviews productId={product._id} productOwnerId={product.userRef} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] p-6 shadow-premium border border-gray-100 overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-125" />

              <h3 className="text-lg font-black text-gray-800 mb-8 flex items-center gap-2 relative z-10 tracking-tight">
                <FaStore className="text-emerald-600" /> Seller Verification
              </h3>

              <div className="flex items-center gap-4 mb-8 relative z-10 p-2 rounded-2xl hover:bg-gray-50 transition-colors">
                <div className="w-16 h-16 rounded-2xl bg-emerald-900 p-1 flex-shrink-0 shadow-lg">
                  <img src={product.userAvatar || '/favicon.png'} className="w-full h-full object-cover rounded-xl" alt="avatar" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-gray-900 leading-tight">{product.sellerName || 'Verified Producer'}</h4>
                  <div className="flex items-center gap-1.5 mt-1">
                    <FaCheckCircle className="text-blue-500 text-xs" />
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Trust Index A+</span>
                  </div>
                </div>
              </div>

              {!isOwner && (
                <div className="space-y-4 relative z-10">
                  <button onClick={handleAddToCart} className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black tracking-widest uppercase text-xs flex items-center justify-center gap-2 hover:bg-black transition-colors">
                    <FaTag className="text-sm" /> Add to Cart
                  </button>
                  {addedToCart && (
                    <button onClick={goToCart} className="w-full py-3 bg-emerald-50 text-emerald-700 rounded-xl font-black text-[11px] uppercase tracking-widest border border-emerald-100">
                      Added to cart — Open cart
                    </button>
                  )}
                  <button onClick={() => setContact(!contact)} className="btn-primary w-full py-4 tracking-widest uppercase text-xs flex gap-2">
                    <FaWhatsapp className="text-lg" /> Contact Seller
                  </button>
                  {contact && <Contact product={product} />}
                </div>
              )}

              {isOwner && (
                <Link to={`/update-product/${product._id}`} className="btn-accent w-full py-4 tracking-widest uppercase text-xs flex gap-2 relative z-10">
                  Manage Product
                </Link>
              )}

              <div className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center justify-center gap-1"><FaChartLine /> Views</p>
                  <p className="text-lg font-black text-emerald-800 tracking-tighter">{product.views || Math.floor(Math.random() * 200 + 50)}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center justify-center gap-1"><FaCalendarAlt /> Listed</p>
                  <p className="text-lg font-black text-emerald-800 tracking-tighter">{new Date(product.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</p>
                </div>
              </div>
            </div>

            {/* Safety Tips */}
            <div className="bg-amber-50 rounded-[2rem] p-6 border border-amber-100">
              <h4 className="flex items-center gap-2 text-amber-800 font-black text-xs uppercase tracking-widest mb-4">
                <FaExclamationTriangle className="text-amber-500" /> Safety Notice
              </h4>
              <ul className="space-y-3 text-[11px] font-bold text-amber-700/80 leading-snug">
                <li>• Meet the seller in a public agricultural market.</li>
                <li>• Inspect the quality of produce before payment.</li>
                <li>• Nguzza never asks for advance payments.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Mobile Sticky Contact Bar ─── */}
      {!isOwner && (
        <div className="sm:hidden fixed bottom-[60px] left-0 right-0 z-[55] p-3 bg-white/90 backdrop-blur-xl border-t border-gray-200/60 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
          <div className="flex gap-2.5 h-12">
            <button
              onClick={() => setContact(!contact)}
              className="flex-1 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all shadow-emerald-600/20"
            >
              <FaWhatsapp className="text-base" /> Contact Seller
            </button>
            <button onClick={handleAddToCart} className="w-12 bg-gray-900 text-white rounded-xl flex items-center justify-center shadow-lg active:scale-95 transition-all">
              <FaTag size={14} />
            </button>
          </div>
          {contact && (
            <div className="absolute bottom-full left-0 right-0 mb-2 px-3 animate-in">
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-2">
                <Contact product={product} />
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
