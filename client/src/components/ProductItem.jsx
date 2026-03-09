import React from 'react'
import { Link } from 'react-router-dom';
import { MdLocationOn, MdFavoriteBorder, MdFavorite, MdStar, MdVerified, MdLocalShipping } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../redux/wishlist/wishlistSlice.js';
import LazyImage from './LazyImage.jsx';
import { resolvePrices } from '../utils/priceUtils';

// Convert units to singular form
const singularizeUnit = (unit) => {
  if (!unit) return '';
  const singularMap = {
    bags: 'bag',
    bunches: 'bunch',
    boxes: 'box',
    bottles: 'bottle',
    crates: 'crate',
    cups: 'cup',
    grams: 'gram',
    kilograms: 'kilogram',
    kg: 'kg',
    liters: 'liter',
    litres: 'litre',
    pounds: 'pound',
    pieces: 'piece',
    packs: 'pack',
    units: 'unit',
  };
  return singularMap[unit.toLowerCase()] || unit;
};

export default function ProductItem({ product, compact = false }) {
  const dispatch = useDispatch();
  const wishlistItems = useSelector(state => state.wishlist?.items || []);
  const isFav = Array.isArray(wishlistItems) && wishlistItems.some(item => item._id === product._id || item._id === product.id);

  const now = new Date();
  const isFeatured = product?.isFeatured && product?.featuredUntil && new Date(product.featuredUntil) > now;
  const isFlashSale = product?.isFlashSale && product?.flashSaleEndsAt && new Date(product.flashSaleEndsAt) > now;

  const locationDistrict = product.location?.district || product.address || '';
  const { finalPrice: price, discountAmount } = resolvePrices(product);
  const discountPct = discountAmount && (price + discountAmount) > 0 ? Math.round((discountAmount / (price + discountAmount)) * 100) : 0;

  const handleFav = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const productId = product._id || product.id;
    if (!productId) return;

    if (isFav) {
      dispatch(removeFromWishlist(productId));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  const containerClass = compact
    ? 'group relative bg-white rounded-xl overflow-hidden flex flex-col h-full border border-gray-100 hover:shadow-lg transition-all duration-300 hover:scale-[1.01]'
    : 'group relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col h-full border border-gray-100 hover:shadow-2xl transition-all duration-400 hover:scale-[1.02]';

  const contentPadding = compact ? 'p-2' : 'p-2.5 sm:p-4';
  const titleClass = compact ? 'text-sm font-bold text-gray-800 line-clamp-1 leading-snug min-h-[1.2rem]' : 'text-xs sm:text-[15px] font-bold text-gray-800 line-clamp-1 leading-tight min-h-[1.25rem]';

  return (
    <div className={containerClass}>

      {/* ─── Favorite Button (Optimized for Touch) ─── */}
      <button
        onClick={handleFav}
        className="absolute top-2 right-2 z-20 p-2.5 rounded-full glass border-white/40 text-gray-400 hover:text-red-500 transition-all active:scale-75 shadow-sm"
      >
        {isFav ? <MdFavorite className="w-5 h-5 text-red-500" /> : <MdFavoriteBorder className="w-5 h-5" />}
      </button>

      {/* ─── Badges ─── */}
      <div className={`absolute top-2 left-2 z-20 flex flex-col ${compact ? 'gap-0' : 'gap-1'}`}>
        {discountPct > 0 && (
          <span className="bg-red-500 text-white px-2 py-0.5 rounded-lg text-[9px] sm:text-[10px] font-black shadow-lg uppercase tracking-tight">
            -{discountPct}%
          </span>
        )}
        {isFeatured && (
          <span className='bg-amber-400 text-emerald-900 px-2 py-0.5 rounded-lg text-[9px] sm:text-[10px] font-black shadow-lg flex items-center gap-0.5 uppercase tracking-tight'>
            Featured
          </span>
        )}
        {isFlashSale && (
          <span className='bg-red-600 text-white px-2 py-0.5 rounded-lg text-[9px] sm:text-[10px] font-black shadow-lg uppercase tracking-tight'>
            Flash Sale
          </span>
        )}
      </div>

      <Link
        to={`/product/${product._id}`}
        className="flex flex-col h-full"
      >
        {/* ─── Image ─── */}
        <div className='relative w-full aspect-square sm:aspect-square bg-gray-50 overflow-hidden'>
          <LazyImage
            src={product.imageUrls?.[0]}
            alt={product.name}
            className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out'
          />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

          {/* Price badge overlay */}
          <div className={`absolute left-3 bottom-3 ${compact ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-sm'} bg-white/95 text-gray-900 rounded-md font-extrabold shadow-md`}>
            <span className="uppercase text-[10px] mr-1">UGX</span>{Number(price).toLocaleString()}{product.details?.unit ? ` / ${singularizeUnit(product.details.unit)}` : ''}
          </div>
        </div>

        {/* ─── Content (Minimalistic - 4 Lines, Tight Spacing) ─── */}
        <div className={`${contentPadding} flex flex-col flex-1 justify-between gap-0.5`}>

          {/* Line 1: Product Name */}
          <h3 className={`${titleClass} group-hover:text-emerald-700 transition-colors`}>
            {product.name}
          </h3>

          {/* Line 2: Rating */}
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <MdStar key={i} className={`text-[8px] ${i < (product.rating || 4) ? 'text-amber-400' : 'text-gray-200'}`} />
            ))}
            <span className="text-[7px] text-gray-400 font-bold ml-0.5">{product.numReviews || 0}</span>
          </div>

          {/* Line 3: Price */}
          <p className={`font-black ${compact ? 'text-xs' : 'text-sm sm:text-base'} text-emerald-900 tracking-tight`}>
            <span className="text-[9px]">UGX</span> {Number(price).toLocaleString()}
            {product.details?.unit && (
              <span className="text-[9px] font-bold text-gray-500 ml-1">/ {singularizeUnit(product.details.unit)}</span>
            )}
          </p>

          {/* Line 4: Location */}
          <div className="flex items-center gap-1 text-gray-500">
            <MdLocationOn className="text-[10px] flex-shrink-0" />
            <span className="text-[9px] font-bold truncate">{locationDistrict || 'Uganda'}</span>
          </div>
        </div>
      </Link>
    </div>
  )
}
