import Wishlist from '../models/wishlist.model.js';

// Helper: extract user ID from JWT payload across auth variants
const getUserId = (req) => req.user?.user?.id || req.user?.id || req.user?._id;

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    let wishlist = await Wishlist.findOne({ user: userId }).populate('products');

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [] });
    }

    res.json(wishlist.products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist/:id
// @access  Private
export const addToWishlist = async (req, res) => {
  const { id } = req.params;
  const userId = getUserId(req);

  try {
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [id] });
    } else {
      const alreadyExists = wishlist.products.some((prodId) => prodId.toString() === id);
      if (!alreadyExists) {
        wishlist.products.push(id);
        await wishlist.save();
      }
    }

    res.json({ message: 'Product added to wishlist' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:id
// @access  Private
export const removeFromWishlist = async (req, res) => {
  const { id } = req.params;

  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    let wishlist = await Wishlist.findOne({ user: userId });

    if (wishlist) {
      wishlist.products = wishlist.products.filter(prodId => prodId.toString() !== id);
      await wishlist.save();
    }

    res.json({ message: 'Product removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
