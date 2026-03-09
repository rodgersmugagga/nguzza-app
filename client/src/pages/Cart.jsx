import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash, FaMinus, FaPlus, FaArrowLeft, FaShoppingCart, FaShieldAlt, FaHeart } from 'react-icons/fa';
import { addToCart, removeFromCart } from '../redux/cart/cartSlice';
import { fetchWishlist, removeFromWishlist } from '../redux/wishlist/wishlistSlice';
import { resolvePrices } from '../utils/priceUtils';

export default function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { currentUser } = useSelector((state) => state.user);
  const { cartItems } = cart;
  const { items: wishlistItems, loading: wishlistLoading } = useSelector((state) => state.wishlist);

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchWishlist());
    }
  }, [currentUser, dispatch]);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);

  const handleAddWishlistToCart = (product) => {
    const { finalPrice } = resolvePrices(product);
    dispatch(addToCart({
      product: product._id,
      name: product.name,
      image: product.imageUrls?.[0],
      price: finalPrice,
      countInStock: product.countInStock ?? 99,
      quantity: 1,
    }));
  };

  const checkoutHandler = () => {
    if (!currentUser) {
      navigate('/sign-in?redirect=/shipping');
    } else {
      navigate('/shipping');
    }
  };

  return (
    <main className="min-h-screen bg-[#fafbfc] pb-28 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 pt-6 sm:pt-12">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <button onClick={() => navigate(-1)} className="sm:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <FaArrowLeft className="text-gray-500" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-3">
              <FaShoppingCart className="text-emerald-600 hidden sm:block" />
              Shopping Cart
            </h1>
            <p className="text-sm text-gray-400 font-medium mt-0.5">{totalItems} {totalItems === 1 ? 'item' : 'items'}</p>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <>
            <div className="text-center py-16 sm:py-20 bg-white rounded-3xl shadow-sm border border-gray-100 mb-6">
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-800 mb-2">Your cart is empty</h2>
              <p className="text-gray-400 font-medium mb-6 max-w-xs mx-auto">Discover fresh produce and farm equipment from verified sellers.</p>
              <Link to="/" className="inline-flex items-center gap-2 btn-primary">
                <FaArrowLeft className="text-xs" /> Start Shopping
              </Link>
            </div>

            {/* Saved Items above fold even on empty cart */}
            <div className="mt-2">
              <h2 className="text-base sm:text-lg font-black text-gray-800 mb-3 flex items-center gap-2">
                <FaHeart className="text-red-400" />
                Saved Items
                {Array.isArray(wishlistItems) && wishlistItems.length > 0 && (
                  <span className="text-xs font-bold text-gray-400 ml-1">({wishlistItems.length})</span>
                )}
              </h2>
              {!currentUser ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
                  <p className="text-sm text-gray-400 font-medium mb-3">Sign in to see your saved items.</p>
                  <Link to="/sign-in" className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors">Sign In</Link>
                </div>
              ) : wishlistLoading ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center text-sm text-gray-400">Loading saved items…</div>
              ) : !Array.isArray(wishlistItems) || wishlistItems.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-5 text-center">
                  <p className="text-sm text-gray-400 font-medium">No saved items yet.</p>
                  <Link to="/search" className="text-xs text-emerald-600 font-bold mt-1 inline-block hover:underline">Browse products →</Link>
                </div>
              ) : (
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1 snap-x">
                  {wishlistItems.map((product) => {
                    const { finalPrice, discountAmount } = resolvePrices(product);
                    return (
                      <div key={product._id} className="snap-start flex-shrink-0 w-36 sm:w-44 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden group">
                        <Link to={`/product/${product._id}`} className="block relative">
                          <div className="aspect-square overflow-hidden bg-gray-50">
                            <img src={product.imageUrls?.[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          </div>
                          {discountAmount > 0 && <span className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">Sale</span>}
                        </Link>
                        <div className="p-2.5 flex flex-col flex-1">
                          <Link to={`/product/${product._id}`}>
                            <p className="text-xs font-bold text-gray-800 line-clamp-1 leading-tight mb-1 group-hover:text-emerald-700 transition-colors">{product.name}</p>
                          </Link>
                          <p className="text-xs font-black text-emerald-700 mb-2">
                            <span className="text-[9px] mr-0.5">UGX</span>{Number(finalPrice).toLocaleString()}
                            {product.details?.unit && <span className="text-[9px] text-gray-400 font-bold ml-1">/ {product.details.unit}</span>}
                          </p>
                          <div className="flex gap-1.5 mt-auto">
                            <button onClick={() => handleAddWishlistToCart(product)} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 rounded-lg text-[10px] font-black flex items-center justify-center gap-1 transition-colors active:scale-95" title="Add to cart">
                              <FaShoppingCart size={9} /> Cart
                            </button>
                            <button onClick={() => dispatch(removeFromWishlist(product._id))} className="p-1.5 text-gray-300 hover:text-red-500 bg-gray-50 rounded-lg transition-colors active:scale-95" title="Remove from wishlist">
                              <FaTrash size={10} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-8 space-y-3 sm:space-y-4">
              {cartItems.map((item) => (
                <div key={item.product + (item.variant?.sku || '')} className="bg-white p-3 sm:p-5 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm flex gap-3 sm:gap-5 items-center group hover:border-emerald-100 transition-colors">
                  <Link to={`/product/${item.product}`}>
                    <img src={item.image} alt={item.name} className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl object-cover bg-gray-50 flex-shrink-0" />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.product}`} className="text-sm sm:text-base font-bold text-gray-900 hover:text-emerald-700 line-clamp-1 transition-colors">
                      {item.name}
                    </Link>
                    {item.variant && (
                      <p className="text-xs text-gray-400 font-medium mt-0.5">{item.variant.name}</p>
                    )}
                    <p className="text-emerald-700 font-black text-sm sm:text-base mt-1">
                      <span className="text-[10px] sm:text-xs mr-0.5">UGX</span>
                      {item.price.toLocaleString()}
                      {item.unit && <span className="text-[10px] sm:text-xs text-gray-400 font-bold ml-1">/ {item.unit}</span>}
                    </p>

                    {/* Mobile: quantity + delete inline */}
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-2 bg-gray-50 px-2.5 py-1.5 rounded-xl border border-gray-100">
                        <button
                          onClick={() => dispatch(addToCart({ ...item, quantity: Math.max(1, item.quantity - 1) }))}
                          className="text-gray-400 hover:text-gray-700 p-0.5 active:scale-90 transition-all"
                        >
                          <FaMinus size={10} />
                        </button>
                        <span className="font-black text-gray-900 text-sm w-5 text-center">{item.quantity}</span>
                        <button
                          onClick={() => dispatch(addToCart({ ...item, quantity: Math.min(item.countInStock, item.quantity + 1) }))}
                          className="text-gray-400 hover:text-gray-700 p-0.5 active:scale-90 transition-all"
                        >
                          <FaPlus size={10} />
                        </button>
                      </div>

                      <button
                        onClick={() => dispatch(removeFromCart({ id: item.product, sku: item.variant?.sku }))}
                        className="text-gray-300 hover:text-red-500 p-1.5 ml-auto transition-colors"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Saved Items (Wishlist) */}
            <div className="mt-6">
              <h2 className="text-base sm:text-lg font-black text-gray-800 mb-3 flex items-center gap-2">
                <FaHeart className="text-red-400" />
                Saved Items
                {Array.isArray(wishlistItems) && wishlistItems.length > 0 && (
                  <span className="text-xs font-bold text-gray-400 ml-1">({wishlistItems.length})</span>
                )}
              </h2>

              {!currentUser ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
                  <p className="text-sm text-gray-400 font-medium mb-3">Sign in to see your saved items.</p>
                  <Link to="/sign-in" className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors">
                    Sign In
                  </Link>
                </div>
              ) : wishlistLoading ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center text-sm text-gray-400">Loading saved items…</div>
              ) : !Array.isArray(wishlistItems) || wishlistItems.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-5 text-center">
                  <p className="text-sm text-gray-400 font-medium">No saved items yet.</p>
                  <Link to="/search" className="text-xs text-emerald-600 font-bold mt-1 inline-block hover:underline">Browse products →</Link>
                </div>
              ) : (
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1 snap-x">
                  {wishlistItems.map((product) => {
                    const { finalPrice, discountAmount } = resolvePrices(product);
                    return (
                      <div key={product._id} className="snap-start flex-shrink-0 w-36 sm:w-44 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden group">
                        <Link to={`/product/${product._id}`} className="block relative">
                          <div className="aspect-square overflow-hidden bg-gray-50">
                            <img
                              src={product.imageUrls?.[0]}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          {discountAmount > 0 && (
                            <span className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">Sale</span>
                          )}
                        </Link>
                        <div className="p-2.5 flex flex-col flex-1">
                          <Link to={`/product/${product._id}`}>
                            <p className="text-xs font-bold text-gray-800 line-clamp-1 leading-tight mb-1 group-hover:text-emerald-700 transition-colors">{product.name}</p>
                          </Link>
                          <p className="text-xs font-black text-emerald-700 mb-2">
                            <span className="text-[9px] mr-0.5">UGX</span>{Number(finalPrice).toLocaleString()}
                            {product.details?.unit && <span className="text-[9px] text-gray-400 font-bold ml-1">/ {product.details.unit}</span>}
                          </p>
                          <div className="flex gap-1.5 mt-auto">
                            <button
                              onClick={() => handleAddWishlistToCart(product)}
                              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 rounded-lg text-[10px] font-black flex items-center justify-center gap-1 transition-colors active:scale-95"
                              title="Add to cart"
                            >
                              <FaShoppingCart size={9} /> Cart
                            </button>
                            <button
                              onClick={() => dispatch(removeFromWishlist(product._id))}
                              className="p-1.5 text-gray-300 hover:text-red-500 bg-gray-50 rounded-lg transition-colors active:scale-95"
                              title="Remove from wishlist"
                            >
                              <FaTrash size={10} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4">
              <div className="bg-white p-5 sm:p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
                <h2 className="text-lg sm:text-xl font-black text-gray-900 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal ({totalItems} items)</span>
                    <span className="font-bold text-gray-700">UGX {totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Delivery</span>
                    <span className="text-xs text-gray-400 italic">Calculated at checkout</span>
                  </div>
                  <div className="border-t border-gray-100 pt-4 flex justify-between text-lg font-black text-gray-900">
                    <span>Total</span>
                    <span className="text-emerald-700">UGX {totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={checkoutHandler}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
                >
                  Proceed to Checkout
                </button>

                <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  <FaShieldAlt className="text-emerald-500" /> Secure Checkout
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
