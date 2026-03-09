import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaHeart, FaTrash, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import { fetchWishlist, removeFromWishlist } from '../redux/wishlist/wishlistSlice';
import { addToCart } from '../redux/cart/cartSlice';
import { Helmet } from 'react-helmet-async';
import { resolvePrices } from '../utils/priceUtils';

export default function Wishlist() {
  const dispatch = useDispatch();
  const { items: wishlistItems, loading, error } = useSelector((state) => state.wishlist);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchWishlist());
    }
  }, [currentUser, dispatch]);

  const handleRemove = (id) => {
    dispatch(removeFromWishlist(id));
  };

  const handleAddToCart = (product) => {
    const { finalPrice } = resolvePrices(product);
    const itemToAdd = {
      product: product._id,
      name: product.name,
      image: product.imageUrls?.[0],
      price: finalPrice,
      countInStock: product.countInStock ?? 99,
      quantity: 1,
    };
    dispatch(addToCart(itemToAdd));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafbfc]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafbfc] pb-28 sm:pb-12">
      <Helmet>
        <title>My Wishlist | Nguzza</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 pt-6 sm:pt-12">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 sm:mb-8 flex items-center gap-3">
          <FaHeart className="text-red-500" /> My Wishlist
        </h1>

        {!Array.isArray(wishlistItems) || wishlistItems.length === 0 ? (
          <div className="text-center py-16 sm:py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <div className="text-6xl mb-4">💚</div>
            <h2 className="text-xl font-black text-gray-800 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-400 font-medium mb-6 max-w-xs mx-auto">Save items you love and come back to buy them later.</p>
            <Link to="/search" className="btn-primary">
              <FaArrowLeft className="mr-2 text-xs" /> Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {wishlistItems.map((product) => {
              const { finalPrice, originalPrice, discountAmount } = resolvePrices(product);
              return (
                <div key={product._id} className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 group relative flex flex-col">
                  <button
                    onClick={() => handleRemove(product._id)}
                    className="absolute top-2 right-2 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 shadow-sm transition-colors border border-gray-100 active:scale-90"
                    title="Remove from wishlist"
                  >
                    <FaTrash size={12} />
                  </button>

                  <Link to={`/product/${product._id}`} className="block">
                    <div className="aspect-square rounded-t-2xl sm:rounded-t-3xl overflow-hidden bg-gray-50 relative">
                      <img
                        src={product.imageUrls?.[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {discountAmount > 0 && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-lg shadow-lg uppercase">
                          Sale
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-3 sm:p-4 flex flex-col flex-1">
                    <Link to={`/product/${product._id}`}>
                      <h3 className="font-bold text-gray-900 text-xs sm:text-sm mb-1 line-clamp-1 group-hover:text-emerald-700 transition-colors leading-tight">{product.name}</h3>
                    </Link>

                    <div className="flex items-center gap-2 mt-auto mb-3">
                      <span className="text-sm sm:text-base font-black text-emerald-800">
                        <span className="text-[9px] sm:text-xs mr-0.5">UGX</span>
                        {Number(finalPrice).toLocaleString()}
                        {product.details?.unit && <span className="text-[9px] sm:text-xs text-gray-400 font-bold ml-1">/ {product.details.unit}</span>}
                      </span>
                      {discountAmount > 0 && (
                        <span className="text-[10px] sm:text-xs text-gray-300 line-through">
                          {Number(originalPrice).toLocaleString()}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors active:scale-95"
                    >
                      <FaShoppingCart size={12} /> Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
