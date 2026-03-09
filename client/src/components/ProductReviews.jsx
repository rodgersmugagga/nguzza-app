import React, { useState, useEffect } from 'react';
import { FaStar, FaReply, FaUser, FaCheckCircle, FaPaperPlane } from 'react-icons/fa';
import { useSelector } from 'react-redux';

export default function ProductReviews({ productId, productOwnerId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [replyText, setReplyText] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState({});

  const userId = currentUser?.user?._id || currentUser?.user?.id || currentUser?._id || currentUser?.id;
  const token = currentUser?.token;

  // Robust owner check: normalize both to strings for comparison
  const isOwner = userId && productOwnerId && String(userId) === String(productOwnerId?._id || productOwnerId);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${productId}/reviews`);
      const data = await res.json();
      if (res.ok) {
        setReviews(data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!userId) return alert('Please sign in to review');
    if (isOwner) return alert('Owners cannot review their own products');
    if (!token) return alert('Authentication error. Please sign in again.');

    setSubmitting(true);
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating, comment }),
      });
      if (res.ok) {
        setComment('');
        fetchReviews();
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review. Check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (reviewId) => {
    if (!replyText[reviewId]) return;
    if (!token) return alert('Please sign in again to reply');

    try {
      const res = await fetch(`/api/products/review/${reviewId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ comment: replyText[reviewId] }),
      });

      const data = await res.json();
      if (res.ok) {
        // Optimistic/Immediate UI update
        setReviews(prev => prev.map(r => r._id === reviewId ? data.review : r));
        setReplyText({ ...replyText, [reviewId]: '' });
        setShowReplyInput({ ...showReplyInput, [reviewId]: false });
      } else {
        alert(data.message || 'Failed to reply');
      }
    } catch (error) {
      console.error('Error replying to review:', error);
    }
  };

  const userAlreadyReviewed = reviews.some(r => r.user?._id === userId || r.user === userId);

  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
          <div className="w-0.5 h-3 bg-emerald-600 rounded-full" />
          Market Feedback ({reviews.length})
        </h3>
        {reviews.length > 0 && (
          <div className="flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100/50">
            <FaStar className="text-amber-400 text-[8px]" />
            <span className="text-[10px] font-black text-amber-900">
              {(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Ultra Compact Review Form */}
      {userId && !isOwner && !userAlreadyReviewed && (
        <form onSubmit={handleSubmitReview} className="bg-gray-50/50 rounded-xl p-2 border border-gray-100 flex items-center gap-2">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-xs transition-all ${star <= rating ? 'text-amber-400' : 'text-gray-200'}`}
              >
                <FaStar />
              </button>
            ))}
          </div>
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Feedback..."
            className="flex-1 bg-white border border-gray-100 rounded-lg px-2 py-1 text-[10px] font-bold outline-none"
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-emerald-700 text-white px-3 py-1 rounded-lg font-black text-[8px] uppercase hover:bg-emerald-800 disabled:opacity-50"
          >
            Post
          </button>
        </form>
      )}

      {/* Ultra Compact Reviews List */}
      <div className="space-y-1.5">
        {loading ? (
          <div className="h-6 bg-gray-50 rounded animate-pulse" />
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="bg-white rounded-xl p-2 border border-gray-50/50 shadow-sm transition-all hover:bg-gray-50/20">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded bg-emerald-50 flex items-center justify-center overflow-hidden border border-gray-100/50">
                    {review.user?.avatar ? (
                      <img src={review.user.avatar} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <FaUser className="text-emerald-200 text-[8px]" />
                    )}
                  </div>
                  <h4 className="text-[9px] font-black text-gray-800 leading-none">{review.user?.username || review.name}</h4>
                  <div className="flex text-amber-400 text-[6px] gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < review.rating ? '' : 'text-gray-100'} />
                    ))}
                  </div>
                </div>
                <span className="text-[7px] font-bold text-gray-300 uppercase">{new Date(review.createdAt).toLocaleDateString()}</span>
              </div>

              <p className="text-[10px] font-semibold text-gray-600 leading-tight pl-6.5">{review.comment}</p>

              {/* Compact Replies */}
              {review.replies && review.replies.length > 0 && (
                <div className="mt-1.5 ml-6 space-y-1 border-l border-emerald-50 pl-2">
                  {review.replies.map((reply, idx) => (
                    <div key={idx} className="flex gap-1.5 items-start">
                      <div className="w-4 h-4 rounded bg-emerald-900 flex items-center justify-center p-0.5 mt-0.5">
                        <img src={reply.user?.avatar || '/favicon.png'} className="w-full h-full object-cover rounded-[1px]" alt="" />
                      </div>
                      <div className="bg-emerald-50/30 rounded px-1.5 py-1 flex-1">
                        <div className="flex items-center gap-1 mb-0.5">
                          <span className="text-[7px] font-black text-emerald-900 uppercase">Producer</span>
                          <FaCheckCircle className="text-blue-500 text-[5px]" />
                        </div>
                        <p className="text-[9px] font-bold text-emerald-800 leading-tight">{reply.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Ultra Compact Owner Action */}
              {isOwner && (
                <div className="mt-1.5 pt-1 border-t border-gray-50 flex justify-end">
                  {!showReplyInput[review._id] ? (
                    <button
                      onClick={() => setShowReplyInput({ ...showReplyInput, [review._id]: true })}
                      className="text-[7px] font-black text-emerald-700 uppercase tracking-widest flex items-center gap-1 hover:text-emerald-900"
                    >
                      <FaReply size={6} /> Reply
                    </button>
                  ) : (
                    <div className="flex gap-1 w-full mt-1">
                      <input
                        autoFocus
                        value={replyText[review._id] || ''}
                        onChange={(e) => setReplyText({ ...replyText, [review._id]: e.target.value })}
                        placeholder="Reply..."
                        className="flex-1 bg-gray-50 border border-gray-100 rounded px-2 py-0.5 text-[9px] font-bold outline-none"
                        onKeyPress={(e) => e.key === 'Enter' && handleReply(review._id)}
                      />
                      <button
                        onClick={() => handleReply(review._id)}
                        className="bg-emerald-700 text-white px-1.5 rounded"
                      >
                        <FaPaperPlane size={7} />
                      </button>
                      <button
                        onClick={() => setShowReplyInput({ ...showReplyInput, [review._id]: false })}
                        className="text-[7px] font-black text-gray-400 px-1"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="py-2 text-center opacity-30">
            <p className="text-[8px] font-black uppercase tracking-widest">No feedback</p>
          </div>
        )}
      </div>
    </div>
  );
}
